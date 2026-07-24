-- MixAI initial schema. Source of truth: docs/DATA_MODEL.md.
-- Catalog tables are public-read; user tables are owner-only via RLS;
-- monetization tables are service-role only (RLS enabled, no policies).

create extension if not exists pgcrypto;

--------------------------------------------------------------------------
-- CATALOG
--------------------------------------------------------------------------

create table ingredients (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  parent_id     uuid references ingredients(id),
  kind          text not null check (kind in
                  ('spirit','liqueur','wine','beer','mixer','juice',
                   'syrup','bitters','garnish','other')),
  abv_typical   numeric(4,1),
  is_alcoholic  boolean not null,
  created_at    timestamptz not null default now()
);
create index ingredients_parent_idx on ingredients (parent_id);

-- Closure table: one row per (ancestor, descendant) pair including self.
-- Maintained by trigger so can-make matching is a flat indexed join.
create table ingredient_ancestors (
  ancestor_id   uuid not null references ingredients(id) on delete cascade,
  descendant_id uuid not null references ingredients(id) on delete cascade,
  depth         smallint not null,
  primary key (ancestor_id, descendant_id)
);
create index ingredient_ancestors_desc_idx on ingredient_ancestors (descendant_id);

create function ingredients_closure_sync() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into ingredient_ancestors (ancestor_id, descendant_id, depth)
    values (new.id, new.id, 0);
    if new.parent_id is not null then
      insert into ingredient_ancestors (ancestor_id, descendant_id, depth)
      select ancestor_id, new.id, depth + 1
      from ingredient_ancestors
      where descendant_id = new.parent_id;
    end if;
    return new;
  end if;

  -- UPDATE of parent_id: refuse cycles, then splice the subtree.
  if new.parent_id is not null and exists (
    select 1 from ingredient_ancestors
    where ancestor_id = new.id and descendant_id = new.parent_id
  ) then
    raise exception 'ingredient % cannot be moved under its own descendant', new.slug;
  end if;

  delete from ingredient_ancestors
  where descendant_id in (
          select descendant_id from ingredient_ancestors where ancestor_id = new.id)
    and ancestor_id not in (
          select descendant_id from ingredient_ancestors where ancestor_id = new.id);

  if new.parent_id is not null then
    insert into ingredient_ancestors (ancestor_id, descendant_id, depth)
    select supertree.ancestor_id, subtree.descendant_id,
           supertree.depth + subtree.depth + 1
    from ingredient_ancestors supertree
    join ingredient_ancestors subtree on subtree.ancestor_id = new.id
    where supertree.descendant_id = new.parent_id;
  end if;
  return new;
end;
$$;

create trigger ingredients_closure_insert
  after insert on ingredients
  for each row execute function ingredients_closure_sync();

create trigger ingredients_closure_move
  after update of parent_id on ingredients
  for each row
  when (old.parent_id is distinct from new.parent_id)
  execute function ingredients_closure_sync();

create table products (
  id            uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id),
  brand         text not null,
  name          text not null,
  volume_ml     int,
  abv           numeric(4,1),
  barcode       text,
  image_path    text,
  created_at    timestamptz not null default now()
);
create index products_ingredient_idx on products (ingredient_id);
create unique index products_barcode_key on products (barcode) where barcode is not null;

create table cocktails (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null,
  history       text,
  difficulty    text not null check (difficulty in ('easy','medium','hard')),
  method        text not null,
  glass         text not null,
  garnish       text,
  abv_estimate  numeric(4,1),
  calories      int,
  image_path    text,
  search        tsvector generated always as
                  (to_tsvector('simple', name || ' ' || description)) stored,
  created_at    timestamptz not null default now()
);
create index cocktails_search_idx on cocktails using gin (search);

create table cocktail_ingredients (
  cocktail_id   uuid not null references cocktails(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id),
  amount        numeric(6,2),
  unit          text,
  is_optional   boolean not null default false,
  is_garnish    boolean not null default false,
  note          text,
  primary key (cocktail_id, ingredient_id)
);
create index cocktail_ingredients_ingredient_idx on cocktail_ingredients (ingredient_id);

create table cocktail_tags (
  cocktail_id uuid not null references cocktails(id) on delete cascade,
  tag         text not null,
  primary key (cocktail_id, tag)
);
create index cocktail_tags_tag_idx on cocktail_tags (tag);

--------------------------------------------------------------------------
-- USER DATA
--------------------------------------------------------------------------

create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  country      char(2),
  birth_date   date,
  taste        jsonb not null default '{}',
  created_at   timestamptz not null default now()
);

create table inventory_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  product_id    uuid references products(id),
  ingredient_id uuid not null references ingredients(id),
  volume_ml     int,
  remaining_pct smallint check (remaining_pct between 0 and 100),
  purchased_at  date,
  is_favorite   boolean not null default false,
  image_path    text,
  created_at    timestamptz not null default now()
);
create index inventory_items_user_idx on inventory_items (user_id);

-- A branded bottle always counts as its generic ingredient; keep the two
-- columns consistent regardless of what the client sends.
create function inventory_items_sync_ingredient() returns trigger
language plpgsql as $$
begin
  if new.product_id is not null then
    select ingredient_id into strict new.ingredient_id
    from products where id = new.product_id;
  end if;
  return new;
end;
$$;

create trigger inventory_items_sync_ingredient
  before insert or update of product_id on inventory_items
  for each row execute function inventory_items_sync_ingredient();

create table favorites (
  user_id     uuid not null references profiles(id) on delete cascade,
  cocktail_id uuid not null references cocktails(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, cocktail_id)
);

create table chat_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);
create index chat_messages_user_idx on chat_messages (user_id, created_at desc);

-- Written only by the RevenueCat webhook (service role).
create table entitlements (
  user_id     uuid primary key references profiles(id) on delete cascade,
  tier        text not null default 'free' check (tier in ('free','premium')),
  expires_at  timestamptz,
  updated_at  timestamptz not null default now()
);

--------------------------------------------------------------------------
-- MONETIZATION (service-role only)
--------------------------------------------------------------------------

create table affiliate_merchants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  network     text not null,
  countries   char(2)[] not null,
  priority    int not null default 100,
  config      jsonb not null default '{}',
  is_active   boolean not null default true
);

create table affiliate_offers (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id),
  merchant_id  uuid not null references affiliate_merchants(id),
  country      char(2) not null,
  url_template text not null,
  price_cents  int,
  currency     char(3),
  updated_at   timestamptz not null default now(),
  unique (product_id, merchant_id, country)
);
create index affiliate_offers_lookup_idx on affiliate_offers (product_id, country);

create table affiliate_clicks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete set null,
  offer_id    uuid not null references affiliate_offers(id),
  context     text not null,
  created_at  timestamptz not null default now()
);

--------------------------------------------------------------------------
-- ROW LEVEL SECURITY
--------------------------------------------------------------------------

-- Catalog: readable by everyone (anon included), writable only via
-- service role (which bypasses RLS).
alter table ingredients enable row level security;
alter table ingredient_ancestors enable row level security;
alter table products enable row level security;
alter table cocktails enable row level security;
alter table cocktail_ingredients enable row level security;
alter table cocktail_tags enable row level security;

create policy "catalog read" on ingredients for select using (true);
create policy "catalog read" on ingredient_ancestors for select using (true);
create policy "catalog read" on products for select using (true);
create policy "catalog read" on cocktails for select using (true);
create policy "catalog read" on cocktail_ingredients for select using (true);
create policy "catalog read" on cocktail_tags for select using (true);

-- User tables: owner-only.
alter table profiles enable row level security;
create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

alter table inventory_items enable row level security;
create policy "own inventory select" on inventory_items for select using (auth.uid() = user_id);
create policy "own inventory insert" on inventory_items for insert with check (auth.uid() = user_id);
create policy "own inventory update" on inventory_items for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own inventory delete" on inventory_items for delete using (auth.uid() = user_id);

alter table favorites enable row level security;
create policy "own favorites select" on favorites for select using (auth.uid() = user_id);
create policy "own favorites insert" on favorites for insert with check (auth.uid() = user_id);
create policy "own favorites delete" on favorites for delete using (auth.uid() = user_id);

alter table chat_messages enable row level security;
create policy "own chat select" on chat_messages for select using (auth.uid() = user_id);
-- Inserts happen through the chat Edge Function (service role), which is
-- where quotas are enforced; clients cannot write history directly.

alter table entitlements enable row level security;
create policy "own entitlement select" on entitlements for select using (auth.uid() = user_id);

-- Monetization: no policies — service role only.
alter table affiliate_merchants enable row level security;
alter table affiliate_offers enable row level security;
alter table affiliate_clicks enable row level security;
