-- CI assertions: run after the migration and seed against a fresh
-- Postgres. Fails loudly if the schema or catalog is broken.

do $$
declare
  n int;
  test_user uuid := gen_random_uuid();
begin
  -- Catalog volume
  select count(*) into n from cocktails;
  if n < 50 then
    raise exception 'expected at least 50 cocktails, found %', n;
  end if;

  select count(*) into n from ingredients;
  if n < 70 then
    raise exception 'expected at least 70 ingredients, found %', n;
  end if;

  -- Every cocktail has at least two linked ingredients
  select count(*) into n
  from cocktails c
  where (select count(*) from cocktail_ingredients ci where ci.cocktail_id = c.id) < 2;
  if n > 0 then
    raise exception '% cocktails have fewer than 2 ingredients', n;
  end if;

  -- Closure integrity: bourbon must descend from whiskey and spirit
  select count(*) into n
  from ingredient_ancestors ia
  join ingredients a on a.id = ia.ancestor_id
  join ingredients d on d.id = ia.descendant_id
  where d.slug = 'bourbon' and a.slug in ('whiskey', 'spirit', 'bourbon');
  if n <> 3 then
    raise exception 'closure table broken for bourbon: % ancestor rows, expected 3', n;
  end if;

  -- Can-make smoke test: a user owning white rum, lime juice and simple
  -- syrup can make a Daiquiri (missing = 0) and is exactly one bottle
  -- away from a Margarita after adding tequila (missing = triple sec).
  insert into auth.users (id) values (test_user);
  insert into profiles (id, display_name) values (test_user, 'ci');
  insert into inventory_items (user_id, ingredient_id)
  select test_user, id from ingredients
  where slug in ('white-rum', 'lime-juice', 'simple-syrup', 'tequila-blanco');

  with owned as (
    select distinct ia.ancestor_id as ingredient_id
    from inventory_items ii
    join ingredient_ancestors ia on ia.descendant_id = ii.ingredient_id
    where ii.user_id = test_user
  ),
  gaps as (
    select ci.cocktail_id,
           count(*) filter (where o.ingredient_id is null
                            and not ci.is_optional
                            and not ci.is_garnish) as missing
    from cocktail_ingredients ci
    left join owned o on o.ingredient_id = ci.ingredient_id
    group by ci.cocktail_id
  )
  select missing into n
  from gaps join cocktails c on c.id = gaps.cocktail_id
  where c.slug = 'daiquiri';
  if n <> 0 then
    raise exception 'daiquiri should be makeable (missing = 0), got missing = %', n;
  end if;

  with owned as (
    select distinct ia.ancestor_id as ingredient_id
    from inventory_items ii
    join ingredient_ancestors ia on ia.descendant_id = ii.ingredient_id
    where ii.user_id = test_user
  ),
  gaps as (
    select ci.cocktail_id,
           count(*) filter (where o.ingredient_id is null
                            and not ci.is_optional
                            and not ci.is_garnish) as missing
    from cocktail_ingredients ci
    left join owned o on o.ingredient_id = ci.ingredient_id
    group by ci.cocktail_id
  )
  select missing into n
  from gaps join cocktails c on c.id = gaps.cocktail_id
  where c.slug = 'margarita';
  if n <> 1 then
    raise exception 'margarita should be one bottle away (missing = 1), got missing = %', n;
  end if;

  raise notice 'all database assertions passed';
end $$;
