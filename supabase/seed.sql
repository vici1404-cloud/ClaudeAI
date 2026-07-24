-- MixAI seed catalog: ingredient taxonomy, starter products, and the
-- classic cocktail canon (IBA recipes are facts; all prose is original).
-- Applied by `supabase db reset` locally and by CI's schema check.

--------------------------------------------------------------------------
-- Seed helpers (dropped at the end of this file)
--------------------------------------------------------------------------

create function seed_ing(
  p_slug text, p_name text, p_parent text, p_kind text,
  p_abv numeric, p_alcoholic boolean
) returns void language plpgsql as $$
begin
  insert into ingredients (slug, name, parent_id, kind, abv_typical, is_alcoholic)
  values (
    p_slug, p_name,
    case when p_parent is null then null
         else (select id from ingredients where slug = p_parent) end,
    p_kind, p_abv, p_alcoholic
  );
end $$;

create function seed_cocktail(
  p_slug text, p_name text, p_description text, p_history text,
  p_difficulty text, p_method text, p_glass text, p_garnish text,
  p_abv numeric, p_tags text[]
) returns void language plpgsql as $$
declare cid uuid;
begin
  insert into cocktails (slug, name, description, history, difficulty,
                         method, glass, garnish, abv_estimate)
  values (p_slug, p_name, p_description, p_history, p_difficulty,
          p_method, p_glass, p_garnish, p_abv)
  returning id into cid;
  insert into cocktail_tags (cocktail_id, tag)
  select cid, unnest(p_tags);
end $$;

create function link(
  p_cocktail text, p_ingredient text, p_amount numeric, p_unit text,
  p_optional boolean default false, p_garnish boolean default false
) returns void language plpgsql as $$
begin
  insert into cocktail_ingredients
    (cocktail_id, ingredient_id, amount, unit, is_optional, is_garnish)
  values (
    (select id from cocktails where slug = p_cocktail),
    (select id from ingredients where slug = p_ingredient),
    p_amount, p_unit, p_optional, p_garnish
  );
end $$;

--------------------------------------------------------------------------
-- Ingredient taxonomy
--------------------------------------------------------------------------

-- Roots
select seed_ing('spirit', 'Spirit', null, 'spirit', 40, true);
select seed_ing('liqueur', 'Liqueur', null, 'liqueur', 25, true);
select seed_ing('wine', 'Wine', null, 'wine', 13, true);

-- Spirits
select seed_ing('whiskey', 'Whiskey', 'spirit', 'spirit', 43, true);
select seed_ing('bourbon', 'Bourbon', 'whiskey', 'spirit', 45, true);
select seed_ing('rye-whiskey', 'Rye Whiskey', 'whiskey', 'spirit', 45, true);
select seed_ing('scotch', 'Scotch Whisky', 'whiskey', 'spirit', 43, true);
select seed_ing('irish-whiskey', 'Irish Whiskey', 'whiskey', 'spirit', 40, true);
select seed_ing('gin', 'Gin', 'spirit', 'spirit', 42, true);
select seed_ing('london-dry-gin', 'London Dry Gin', 'gin', 'spirit', 43, true);
select seed_ing('vodka', 'Vodka', 'spirit', 'spirit', 40, true);
select seed_ing('rum', 'Rum', 'spirit', 'spirit', 40, true);
select seed_ing('white-rum', 'White Rum', 'rum', 'spirit', 38, true);
select seed_ing('gold-rum', 'Gold Rum', 'rum', 'spirit', 40, true);
select seed_ing('dark-rum', 'Dark Rum', 'rum', 'spirit', 40, true);
select seed_ing('tequila', 'Tequila', 'spirit', 'spirit', 38, true);
select seed_ing('tequila-blanco', 'Tequila Blanco', 'tequila', 'spirit', 38, true);
select seed_ing('tequila-reposado', 'Tequila Reposado', 'tequila', 'spirit', 38, true);
select seed_ing('mezcal', 'Mezcal', 'spirit', 'spirit', 42, true);
select seed_ing('brandy', 'Brandy', 'spirit', 'spirit', 40, true);
select seed_ing('cognac', 'Cognac', 'brandy', 'spirit', 40, true);
select seed_ing('pisco', 'Pisco', 'brandy', 'spirit', 40, true);
select seed_ing('cachaca', 'Cachaça', 'spirit', 'spirit', 40, true);
select seed_ing('absinthe', 'Absinthe', 'spirit', 'spirit', 60, true);

-- Liqueurs
select seed_ing('orange-liqueur', 'Orange Liqueur', 'liqueur', 'liqueur', 35, true);
select seed_ing('triple-sec', 'Triple Sec', 'orange-liqueur', 'liqueur', 40, true);
select seed_ing('orange-curacao', 'Orange Curaçao', 'orange-liqueur', 'liqueur', 30, true);
select seed_ing('coffee-liqueur', 'Coffee Liqueur', 'liqueur', 'liqueur', 20, true);
select seed_ing('amaretto', 'Amaretto', 'liqueur', 'liqueur', 28, true);
select seed_ing('maraschino-liqueur', 'Maraschino Liqueur', 'liqueur', 'liqueur', 32, true);
select seed_ing('campari', 'Campari', 'liqueur', 'liqueur', 25, true);
select seed_ing('aperol', 'Aperol', 'liqueur', 'liqueur', 11, true);
select seed_ing('amaro', 'Amaro', 'liqueur', 'liqueur', 30, true);
select seed_ing('green-chartreuse', 'Green Chartreuse', 'liqueur', 'liqueur', 55, true);
select seed_ing('benedictine', 'Bénédictine', 'liqueur', 'liqueur', 40, true);
select seed_ing('drambuie', 'Drambuie', 'liqueur', 'liqueur', 40, true);
select seed_ing('creme-de-cassis', 'Crème de Cassis', 'liqueur', 'liqueur', 20, true);
select seed_ing('creme-de-menthe', 'Crème de Menthe', 'liqueur', 'liqueur', 24, true);
select seed_ing('creme-de-cacao', 'Crème de Cacao', 'liqueur', 'liqueur', 24, true);
select seed_ing('creme-de-mure', 'Crème de Mûre', 'liqueur', 'liqueur', 20, true);
select seed_ing('creme-de-violette', 'Crème de Violette', 'liqueur', 'liqueur', 20, true);
select seed_ing('elderflower-liqueur', 'Elderflower Liqueur', 'liqueur', 'liqueur', 20, true);
select seed_ing('irish-cream', 'Irish Cream', 'liqueur', 'liqueur', 17, true);
select seed_ing('galliano', 'Galliano', 'liqueur', 'liqueur', 42, true);
select seed_ing('cherry-liqueur', 'Cherry Liqueur', 'liqueur', 'liqueur', 24, true);
select seed_ing('peach-schnapps', 'Peach Schnapps', 'liqueur', 'liqueur', 18, true);

-- Wines & fortified
select seed_ing('vermouth', 'Vermouth', 'wine', 'wine', 16, true);
select seed_ing('sweet-vermouth', 'Sweet Vermouth', 'vermouth', 'wine', 16, true);
select seed_ing('dry-vermouth', 'Dry Vermouth', 'vermouth', 'wine', 16, true);
select seed_ing('sparkling-wine', 'Sparkling Wine', 'wine', 'wine', 12, true);
select seed_ing('champagne', 'Champagne', 'sparkling-wine', 'wine', 12, true);
select seed_ing('prosecco', 'Prosecco', 'sparkling-wine', 'wine', 11, true);
select seed_ing('lillet-blanc', 'Lillet Blanc', 'wine', 'wine', 17, true);

-- Juices & purées
select seed_ing('lime-juice', 'Lime Juice', null, 'juice', null, false);
select seed_ing('lemon-juice', 'Lemon Juice', null, 'juice', null, false);
select seed_ing('orange-juice', 'Orange Juice', null, 'juice', null, false);
select seed_ing('pineapple-juice', 'Pineapple Juice', null, 'juice', null, false);
select seed_ing('cranberry-juice', 'Cranberry Juice', null, 'juice', null, false);
select seed_ing('grapefruit-juice', 'Grapefruit Juice', null, 'juice', null, false);
select seed_ing('tomato-juice', 'Tomato Juice', null, 'juice', null, false);
select seed_ing('peach-puree', 'Peach Purée', null, 'juice', null, false);

-- Syrups & sweeteners
select seed_ing('simple-syrup', 'Simple Syrup', null, 'syrup', null, false);
select seed_ing('grenadine', 'Grenadine', null, 'syrup', null, false);
select seed_ing('orgeat', 'Orgeat', null, 'syrup', null, false);
select seed_ing('honey-syrup', 'Honey-Ginger Syrup', null, 'syrup', null, false);
select seed_ing('agave-syrup', 'Agave Syrup', null, 'syrup', null, false);
select seed_ing('raspberry-syrup', 'Raspberry Syrup', null, 'syrup', null, false);

-- Mixers & dairy
select seed_ing('soda-water', 'Soda Water', null, 'mixer', null, false);
select seed_ing('tonic-water', 'Tonic Water', null, 'mixer', null, false);
select seed_ing('cola', 'Cola', null, 'mixer', null, false);
select seed_ing('ginger-beer', 'Ginger Beer', null, 'mixer', null, false);
select seed_ing('ginger-ale', 'Ginger Ale', null, 'mixer', null, false);
select seed_ing('espresso', 'Espresso', null, 'mixer', null, false);
select seed_ing('hot-coffee', 'Hot Coffee', null, 'mixer', null, false);
select seed_ing('cream', 'Cream', null, 'mixer', null, false);
select seed_ing('coconut-cream', 'Coconut Cream', null, 'mixer', null, false);

-- Bitters
select seed_ing('angostura-bitters', 'Angostura Bitters', null, 'bitters', 45, true);
select seed_ing('orange-bitters', 'Orange Bitters', null, 'bitters', 40, true);
select seed_ing('peychauds-bitters', 'Peychaud''s Bitters', null, 'bitters', 35, true);

-- Fresh / other
select seed_ing('mint', 'Fresh Mint', null, 'garnish', null, false);
select seed_ing('egg-white', 'Egg White', null, 'other', null, false);

--------------------------------------------------------------------------
-- Starter products (branded bottles for search & demo inventories)
--------------------------------------------------------------------------

insert into products (ingredient_id, brand, name, volume_ml, abv)
select i.id, p.brand, p.name, p.volume_ml, p.abv
from (values
  ('bourbon',        'Maker''s Mark',  'Maker''s Mark Bourbon',      700, 45.0),
  ('rye-whiskey',    'Rittenhouse',    'Rittenhouse Rye 100',        700, 50.0),
  ('scotch',         'Monkey Shoulder','Monkey Shoulder Blended Malt',700, 40.0),
  ('irish-whiskey',  'Jameson',        'Jameson Irish Whiskey',      700, 40.0),
  ('london-dry-gin', 'Tanqueray',      'Tanqueray London Dry',       700, 43.1),
  ('vodka',          'Absolut',        'Absolut Vodka',              700, 40.0),
  ('white-rum',      'Bacardí',        'Bacardí Carta Blanca',       700, 37.5),
  ('dark-rum',       'Goslings',       'Goslings Black Seal',        700, 40.0),
  ('tequila-blanco', 'Patrón',         'Patrón Silver',              700, 40.0),
  ('triple-sec',     'Cointreau',      'Cointreau',                  700, 40.0),
  ('coffee-liqueur', 'Kahlúa',         'Kahlúa',                     700, 16.0),
  ('campari',        'Campari',        'Campari',                    700, 25.0),
  ('aperol',         'Aperol',         'Aperol',                     700, 11.0),
  ('sweet-vermouth', 'Martini',        'Martini Rosso',              750, 15.0),
  ('dry-vermouth',   'Noilly Prat',    'Noilly Prat Original Dry',   750, 18.0)
) as p(slug, brand, name, volume_ml, abv)
join ingredients i on i.slug = p.slug;

--------------------------------------------------------------------------
-- Cocktails
--------------------------------------------------------------------------

select seed_cocktail('old-fashioned', 'Old Fashioned',
  'Bourbon sweetened with a touch of sugar and deepened with aromatic bitters — the definition of a spirit-forward classic.',
  'One of the earliest drinks ever called a cocktail, traced to the 1880s at the Pendennis Club in Louisville.',
  'easy',
  E'1. Stir simple syrup and bitters in a rocks glass.\n2. Add bourbon and a large ice cube.\n3. Stir until well chilled.\n4. Express orange peel over the top and drop it in.',
  'Rocks', 'Orange peel', 32,
  array['spirit-forward','classic','after-dinner']);
select link('old-fashioned','bourbon',60,'ml');
select link('old-fashioned','simple-syrup',10,'ml');
select link('old-fashioned','angostura-bitters',2,'dash');

select seed_cocktail('negroni', 'Negroni',
  'Equal parts gin, Campari and sweet vermouth: bitter, bracing and perfectly balanced.',
  'Born in Florence around 1919 when Count Camillo Negroni asked for his Americano stiffened with gin.',
  'easy',
  E'1. Add all ingredients to a mixing glass with ice.\n2. Stir until well chilled.\n3. Strain into a rocks glass over a large cube.\n4. Garnish with an orange slice.',
  'Rocks', 'Orange slice', 24,
  array['bitter','aperitif','classic']);
select link('negroni','gin',30,'ml');
select link('negroni','campari',30,'ml');
select link('negroni','sweet-vermouth',30,'ml');

select seed_cocktail('manhattan', 'Manhattan',
  'Rye whiskey rounded by sweet vermouth and bitters — silky, serious and timeless.',
  'A New York institution since the 1870s.',
  'easy',
  E'1. Stir rye, vermouth and bitters with ice.\n2. Strain into a chilled coupe.\n3. Garnish with a maraschino cherry.',
  'Coupe', 'Maraschino cherry', 28,
  array['spirit-forward','classic']);
select link('manhattan','rye-whiskey',50,'ml');
select link('manhattan','sweet-vermouth',20,'ml');
select link('manhattan','angostura-bitters',2,'dash');

select seed_cocktail('whiskey-sour', 'Whiskey Sour',
  'Bourbon, lemon and sugar shaken to a bright, silky sour; egg white adds a cloud-like foam.',
  null, 'easy',
  E'1. Shake bourbon, lemon juice, syrup and egg white without ice (dry shake).\n2. Add ice and shake hard.\n3. Strain into a rocks glass over fresh ice.\n4. Dash bitters onto the foam.',
  'Rocks', 'Lemon wheel and cherry', 20,
  array['sour','classic','shaken']);
select link('whiskey-sour','bourbon',45,'ml');
select link('whiskey-sour','lemon-juice',25,'ml');
select link('whiskey-sour','simple-syrup',20,'ml');
select link('whiskey-sour','egg-white',15,'ml',true);
select link('whiskey-sour','angostura-bitters',1,'dash',true);

select seed_cocktail('margarita', 'Margarita',
  'Tequila, lime and orange liqueur — sharp, salty and endlessly refreshing.',
  null, 'easy',
  E'1. Salt the rim of a chilled glass if desired.\n2. Shake tequila, triple sec and lime juice with ice.\n3. Strain into the glass over fresh ice.\n4. Garnish with a lime wheel.',
  'Rocks', 'Lime wheel, salt rim', 23,
  array['sour','refreshing','party']);
select link('margarita','tequila-blanco',50,'ml');
select link('margarita','triple-sec',20,'ml');
select link('margarita','lime-juice',25,'ml');

select seed_cocktail('daiquiri', 'Daiquiri',
  'White rum, lime and sugar: three ingredients, zero places to hide, and one of the finest drinks ever made.',
  'Named for a beach near Santiago de Cuba, and a favorite of Hemingway''s Havana.',
  'easy',
  E'1. Shake rum, lime juice and syrup hard with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with a thin lime wheel.',
  'Coupe', 'Lime wheel', 20,
  array['sour','refreshing','classic']);
select link('daiquiri','white-rum',60,'ml');
select link('daiquiri','lime-juice',25,'ml');
select link('daiquiri','simple-syrup',15,'ml');

select seed_cocktail('mojito', 'Mojito',
  'Cuban highball of rum, lime, mint and soda — bright, herbal and made for hot evenings.',
  null, 'medium',
  E'1. Gently press mint leaves with syrup and lime juice in a highball glass.\n2. Add rum and fill with crushed ice.\n3. Top with soda water and stir gently.\n4. Crown with a mint sprig.',
  'Highball', 'Mint sprig', 12,
  array['refreshing','summer','long-drink']);
select link('mojito','white-rum',45,'ml');
select link('mojito','lime-juice',20,'ml');
select link('mojito','simple-syrup',15,'ml');
select link('mojito','mint',8,'leaf');
select link('mojito','soda-water',60,'ml');

select seed_cocktail('dry-martini', 'Dry Martini',
  'Ice-cold gin kissed with dry vermouth — the most iconic cocktail silhouette in the world.',
  null, 'easy',
  E'1. Stir gin and vermouth with plenty of ice until very cold.\n2. Strain into a chilled martini glass.\n3. Garnish with a lemon twist or olive.',
  'Martini', 'Lemon twist or olive', 30,
  array['spirit-forward','classic','aperitif']);
select link('dry-martini','gin',60,'ml');
select link('dry-martini','dry-vermouth',10,'ml');
select link('dry-martini','orange-bitters',1,'dash',true);

select seed_cocktail('espresso-martini', 'Espresso Martini',
  'Vodka, coffee liqueur and a fresh shot of espresso, shaken to a velvet crema.',
  'Created by Dick Bradsell in 1980s London.',
  'medium',
  E'1. Shake vodka, coffee liqueur, espresso and syrup hard with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with three coffee beans.',
  'Coupe', 'Three coffee beans', 18,
  array['after-dinner','party','coffee']);
select link('espresso-martini','vodka',40,'ml');
select link('espresso-martini','coffee-liqueur',20,'ml');
select link('espresso-martini','espresso',30,'ml');
select link('espresso-martini','simple-syrup',5,'ml',true);

select seed_cocktail('cosmopolitan', 'Cosmopolitan',
  'Citrus vodka territory: tart cranberry, lime and orange liqueur in a blush-pink coupe.',
  null, 'easy',
  E'1. Shake all ingredients with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with an orange twist.',
  'Coupe', 'Orange twist', 20,
  array['fruity','party']);
select link('cosmopolitan','vodka',40,'ml');
select link('cosmopolitan','triple-sec',15,'ml');
select link('cosmopolitan','lime-juice',15,'ml');
select link('cosmopolitan','cranberry-juice',30,'ml');

select seed_cocktail('moscow-mule', 'Moscow Mule',
  'Vodka, spicy ginger beer and lime, traditionally served in a frosty copper mug.',
  null, 'easy',
  E'1. Fill a copper mug with ice.\n2. Add vodka and lime juice.\n3. Top with ginger beer and stir once.\n4. Garnish with a lime wedge.',
  'Copper mug', 'Lime wedge', 10,
  array['refreshing','long-drink','spicy']);
select link('moscow-mule','vodka',45,'ml');
select link('moscow-mule','lime-juice',15,'ml');
select link('moscow-mule','ginger-beer',120,'ml');

select seed_cocktail('dark-n-stormy', 'Dark ''n'' Stormy',
  'Dark rum floating over fiery ginger beer — a squall in a highball glass.',
  null, 'easy',
  E'1. Fill a highball glass with ice.\n2. Add lime juice and top with ginger beer.\n3. Float dark rum on top.\n4. Garnish with a lime wedge.',
  'Highball', 'Lime wedge', 11,
  array['refreshing','long-drink']);
select link('dark-n-stormy','dark-rum',60,'ml');
select link('dark-n-stormy','ginger-beer',100,'ml');
select link('dark-n-stormy','lime-juice',10,'ml',true);

select seed_cocktail('mai-tai', 'Mai Tai',
  'The king of tiki: aged rum, lime, orange curaçao and almond orgeat in perfect tropical tension.',
  'Trader Vic claimed it in 1944; the name comes from Tahitian for "the best".',
  'medium',
  E'1. Shake rum, curaçao, lime juice and orgeat with crushed ice.\n2. Pour unstrained into a rocks glass.\n3. Garnish with mint and a lime shell.',
  'Rocks', 'Mint sprig, lime shell', 26,
  array['tiki','summer','party']);
select link('mai-tai','gold-rum',45,'ml');
select link('mai-tai','orange-curacao',15,'ml');
select link('mai-tai','lime-juice',25,'ml');
select link('mai-tai','orgeat',15,'ml');

select seed_cocktail('pina-colada', 'Piña Colada',
  'Rum, pineapple and coconut cream blended into a beach holiday you can drink.',
  'Puerto Rico''s national cocktail since 1978.',
  'easy',
  E'1. Blend rum, pineapple juice and coconut cream with crushed ice until smooth.\n2. Pour into a hurricane glass.\n3. Garnish with pineapple and a cherry.',
  'Hurricane', 'Pineapple wedge, cherry', 12,
  array['tiki','sweet','summer']);
select link('pina-colada','white-rum',50,'ml');
select link('pina-colada','pineapple-juice',90,'ml');
select link('pina-colada','coconut-cream',30,'ml');

select seed_cocktail('aperol-spritz', 'Aperol Spritz',
  'Prosecco, Aperol and soda over ice — the orange glow of an Italian aperitivo hour.',
  null, 'easy',
  E'1. Fill a large wine glass with ice.\n2. Add prosecco, then Aperol, then a splash of soda.\n3. Stir gently and garnish with an orange slice.',
  'Wine glass', 'Orange slice', 8,
  array['aperitif','refreshing','summer','low-abv']);
select link('aperol-spritz','prosecco',90,'ml');
select link('aperol-spritz','aperol',60,'ml');
select link('aperol-spritz','soda-water',30,'ml');

select seed_cocktail('americano', 'Americano',
  'Campari and sweet vermouth lengthened with soda — the Negroni''s lighter, older sibling.',
  null, 'easy',
  E'1. Build Campari and vermouth in a highball glass with ice.\n2. Top with soda water.\n3. Garnish with an orange slice.',
  'Highball', 'Orange slice', 10,
  array['bitter','aperitif','low-abv']);
select link('americano','campari',30,'ml');
select link('americano','sweet-vermouth',30,'ml');
select link('americano','soda-water',90,'ml');

select seed_cocktail('boulevardier', 'Boulevardier',
  'A Negroni that swapped its gin for bourbon: richer, warmer, made for cold nights.',
  null, 'easy',
  E'1. Stir all ingredients with ice.\n2. Strain into a rocks glass over a large cube.\n3. Garnish with an orange twist.',
  'Rocks', 'Orange twist', 26,
  array['bitter','spirit-forward','winter']);
select link('boulevardier','bourbon',40,'ml');
select link('boulevardier','campari',30,'ml');
select link('boulevardier','sweet-vermouth',30,'ml');

select seed_cocktail('sazerac', 'Sazerac',
  'Rye, Peychaud''s bitters and an absinthe-rinsed glass — New Orleans in liquid form.',
  'Often cited as America''s first branded cocktail, born in 1850s New Orleans.',
  'medium',
  E'1. Rinse a chilled rocks glass with absinthe and discard the excess.\n2. Stir rye, syrup and bitters with ice.\n3. Strain into the glass, no ice.\n4. Express lemon peel over the drink and discard.',
  'Rocks', 'Lemon peel (expressed)', 30,
  array['spirit-forward','classic']);
select link('sazerac','rye-whiskey',60,'ml');
select link('sazerac','simple-syrup',10,'ml');
select link('sazerac','peychauds-bitters',3,'dash');
select link('sazerac','absinthe',5,'ml');

select seed_cocktail('mint-julep', 'Mint Julep',
  'Bourbon and fresh mint over a mountain of crushed ice — the drink of Derby Day.',
  null, 'medium',
  E'1. Gently press mint with syrup in a julep cup.\n2. Add bourbon and fill with crushed ice.\n3. Stir until the cup frosts, then mound more ice.\n4. Garnish generously with mint.',
  'Julep cup', 'Mint bouquet', 25,
  array['refreshing','summer','classic']);
select link('mint-julep','bourbon',60,'ml');
select link('mint-julep','simple-syrup',10,'ml');
select link('mint-julep','mint',8,'leaf');

select seed_cocktail('tom-collins', 'Tom Collins',
  'Gin, lemon and soda — a sparkling lemonade for grown-ups.',
  null, 'easy',
  E'1. Shake gin, lemon juice and syrup with ice.\n2. Strain into a tall glass over fresh ice.\n3. Top with soda water.\n4. Garnish with a lemon slice and cherry.',
  'Collins', 'Lemon slice, cherry', 11,
  array['refreshing','long-drink','summer']);
select link('tom-collins','gin',45,'ml');
select link('tom-collins','lemon-juice',30,'ml');
select link('tom-collins','simple-syrup',15,'ml');
select link('tom-collins','soda-water',60,'ml');

select seed_cocktail('gin-fizz', 'Gin Fizz',
  'A shaken gin sour lengthened with soda; with egg white it becomes silver and silky.',
  null, 'medium',
  E'1. Dry-shake gin, lemon, syrup and egg white.\n2. Add ice and shake hard.\n3. Strain into a chilled fizz glass without ice.\n4. Top with soda water.',
  'Fizz', 'Lemon twist', 12,
  array['sour','refreshing','shaken']);
select link('gin-fizz','gin',45,'ml');
select link('gin-fizz','lemon-juice',30,'ml');
select link('gin-fizz','simple-syrup',10,'ml');
select link('gin-fizz','egg-white',15,'ml',true);
select link('gin-fizz','soda-water',60,'ml');

select seed_cocktail('french-75', 'French 75',
  'Gin and lemon crowned with Champagne — celebration in a flute.',
  'Named after the French 75mm field gun of World War I for its kick.',
  'easy',
  E'1. Shake gin, lemon juice and syrup with ice.\n2. Strain into a chilled flute.\n3. Top with Champagne.\n4. Garnish with a lemon twist.',
  'Flute', 'Lemon twist', 15,
  array['sparkling','celebration','aperitif']);
select link('french-75','gin',30,'ml');
select link('french-75','lemon-juice',15,'ml');
select link('french-75','simple-syrup',10,'ml');
select link('french-75','champagne',60,'ml');

select seed_cocktail('gimlet', 'Gimlet',
  'Gin and lime cordial character in modern form: gin, fresh lime and sugar, crystal clean.',
  null, 'easy',
  E'1. Shake gin, lime juice and syrup with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with a lime wheel.',
  'Coupe', 'Lime wheel', 22,
  array['sour','classic']);
select link('gimlet','gin',60,'ml');
select link('gimlet','lime-juice',20,'ml');
select link('gimlet','simple-syrup',15,'ml');

select seed_cocktail('sidecar', 'Sidecar',
  'Cognac, orange liqueur and lemon — the elegant template every modern sour descends from.',
  null, 'easy',
  E'1. Shake all ingredients with ice.\n2. Double-strain into a chilled coupe with an optional sugar rim.\n3. Garnish with an orange twist.',
  'Coupe', 'Orange twist, sugar rim', 25,
  array['sour','classic']);
select link('sidecar','cognac',50,'ml');
select link('sidecar','triple-sec',20,'ml');
select link('sidecar','lemon-juice',20,'ml');

select seed_cocktail('amaretto-sour', 'Amaretto Sour',
  'Almond liqueur balanced by lemon and a bourbon backbone — dessert-adjacent but grown-up.',
  null, 'easy',
  E'1. Dry-shake all ingredients.\n2. Add ice and shake hard.\n3. Strain over fresh ice in a rocks glass.\n4. Garnish with a lemon wheel and cherry.',
  'Rocks', 'Lemon wheel, cherry', 15,
  array['sour','sweet','after-dinner']);
select link('amaretto-sour','amaretto',45,'ml');
select link('amaretto-sour','bourbon',15,'ml',true);
select link('amaretto-sour','lemon-juice',25,'ml');
select link('amaretto-sour','simple-syrup',5,'ml',true);
select link('amaretto-sour','egg-white',15,'ml',true);

select seed_cocktail('white-russian', 'White Russian',
  'Vodka and coffee liqueur under a slow cascade of cream.',
  null, 'easy',
  E'1. Build vodka and coffee liqueur in a rocks glass with ice.\n2. Float cream on top.\n3. Stir just before drinking.',
  'Rocks', 'None', 15,
  array['creamy','after-dinner']);
select link('white-russian','vodka',40,'ml');
select link('white-russian','coffee-liqueur',20,'ml');
select link('white-russian','cream',30,'ml');

select seed_cocktail('black-russian', 'Black Russian',
  'Vodka and coffee liqueur, dark and direct.',
  null, 'easy',
  E'1. Build both ingredients in a rocks glass over ice.\n2. Stir briefly.',
  'Rocks', 'None', 22,
  array['after-dinner','coffee']);
select link('black-russian','vodka',50,'ml');
select link('black-russian','coffee-liqueur',20,'ml');

select seed_cocktail('bloody-mary', 'Bloody Mary',
  'The savory icon: vodka and seasoned tomato juice, brunch''s official cocktail.',
  null, 'medium',
  E'1. Roll vodka, tomato juice, lemon juice and seasonings between two mixing tins with ice.\n2. Strain into a highball glass over fresh ice.\n3. Garnish with celery and a lemon wedge.',
  'Highball', 'Celery stalk, lemon wedge', 10,
  array['savory','brunch','long-drink']);
select link('bloody-mary','vodka',45,'ml');
select link('bloody-mary','tomato-juice',120,'ml');
select link('bloody-mary','lemon-juice',15,'ml');

select seed_cocktail('sex-on-the-beach', 'Sex on the Beach',
  'Vodka and peach schnapps with orange and cranberry — sunset colors in a glass.',
  null, 'easy',
  E'1. Build all ingredients in a highball glass with ice.\n2. Stir gently.\n3. Garnish with an orange slice.',
  'Highball', 'Orange slice', 11,
  array['fruity','party','summer']);
select link('sex-on-the-beach','vodka',40,'ml');
select link('sex-on-the-beach','peach-schnapps',20,'ml');
select link('sex-on-the-beach','orange-juice',40,'ml');
select link('sex-on-the-beach','cranberry-juice',40,'ml');

select seed_cocktail('tequila-sunrise', 'Tequila Sunrise',
  'Tequila and orange juice with grenadine sinking into a sunrise gradient.',
  null, 'easy',
  E'1. Build tequila and orange juice in a highball glass with ice.\n2. Slowly pour grenadine down the inside of the glass.\n3. Do not stir; garnish with an orange slice.',
  'Highball', 'Orange slice, cherry', 12,
  array['fruity','party','summer']);
select link('tequila-sunrise','tequila-blanco',45,'ml');
select link('tequila-sunrise','orange-juice',90,'ml');
select link('tequila-sunrise','grenadine',15,'ml');

select seed_cocktail('paloma', 'Paloma',
  'Mexico''s favorite tequila drink: grapefruit, lime and soda, brighter than any margarita.',
  null, 'easy',
  E'1. Rim a highball glass with salt if desired and fill with ice.\n2. Add tequila, grapefruit juice, lime juice and syrup.\n3. Top with soda and stir once.\n4. Garnish with a grapefruit wedge.',
  'Highball', 'Grapefruit wedge, salt rim', 10,
  array['refreshing','summer','long-drink']);
select link('paloma','tequila-blanco',50,'ml');
select link('paloma','grapefruit-juice',60,'ml');
select link('paloma','lime-juice',10,'ml');
select link('paloma','simple-syrup',10,'ml',true);
select link('paloma','soda-water',60,'ml');

select seed_cocktail('caipirinha', 'Caipirinha',
  'Brazil''s national cocktail: cachaça, muddled lime and sugar over crushed ice.',
  null, 'easy',
  E'1. Muddle lime wedges with sugar syrup in a rocks glass.\n2. Fill with crushed ice and add cachaça.\n3. Stir well and serve with a straw.',
  'Rocks', 'Lime wedge', 22,
  array['refreshing','summer','party']);
select link('caipirinha','cachaca',60,'ml');
select link('caipirinha','lime-juice',30,'ml');
select link('caipirinha','simple-syrup',20,'ml');

select seed_cocktail('cuba-libre', 'Cuba Libre',
  'Rum and cola sharpened with fresh lime — three ingredients and a century of history.',
  null, 'easy',
  E'1. Fill a highball glass with ice.\n2. Add rum and lime juice.\n3. Top with cola and stir once.\n4. Garnish with a lime wedge.',
  'Highball', 'Lime wedge', 10,
  array['long-drink','party']);
select link('cuba-libre','white-rum',50,'ml');
select link('cuba-libre','cola',100,'ml');
select link('cuba-libre','lime-juice',10,'ml');

select seed_cocktail('long-island-iced-tea', 'Long Island Iced Tea',
  'Four spirits, citrus and a cola cap — tastes like iced tea, hits like a freight train.',
  null, 'medium',
  E'1. Build vodka, gin, rum, tequila, triple sec, lemon juice and syrup in a tall glass with ice.\n2. Stir, then top with cola.\n3. Garnish with a lemon wedge.',
  'Collins', 'Lemon wedge', 22,
  array['party','long-drink','strong']);
select link('long-island-iced-tea','vodka',15,'ml');
select link('long-island-iced-tea','gin',15,'ml');
select link('long-island-iced-tea','white-rum',15,'ml');
select link('long-island-iced-tea','tequila-blanco',15,'ml');
select link('long-island-iced-tea','triple-sec',15,'ml');
select link('long-island-iced-tea','lemon-juice',25,'ml');
select link('long-island-iced-tea','simple-syrup',20,'ml');
select link('long-island-iced-tea','cola',40,'ml');

select seed_cocktail('bramble', 'Bramble',
  'A gin sour over crushed ice with blackberry liqueur bleeding through like autumn.',
  'Another Dick Bradsell creation, from 1980s Soho.',
  'easy',
  E'1. Shake gin, lemon juice and syrup with ice.\n2. Strain into a rocks glass over crushed ice.\n3. Drizzle crème de mûre over the top.\n4. Garnish with a blackberry and lemon slice.',
  'Rocks', 'Blackberry, lemon slice', 18,
  array['sour','fruity']);
select link('bramble','gin',40,'ml');
select link('bramble','lemon-juice',25,'ml');
select link('bramble','simple-syrup',10,'ml');
select link('bramble','creme-de-mure',15,'ml');

select seed_cocktail('clover-club', 'Clover Club',
  'Pre-Prohibition elegance: gin, raspberry, lemon and silky egg-white foam.',
  null, 'medium',
  E'1. Dry-shake all ingredients.\n2. Add ice and shake hard.\n3. Double-strain into a chilled coupe.\n4. Garnish with skewered raspberries.',
  'Coupe', 'Raspberries', 17,
  array['sour','classic','shaken']);
select link('clover-club','gin',45,'ml');
select link('clover-club','raspberry-syrup',15,'ml');
select link('clover-club','lemon-juice',15,'ml');
select link('clover-club','dry-vermouth',10,'ml',true);
select link('clover-club','egg-white',15,'ml');

select seed_cocktail('bees-knees', 'Bee''s Knees',
  'A Prohibition-era gin sour sweetened with honey instead of sugar.',
  null, 'easy',
  E'1. Shake gin, lemon juice and honey syrup with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with a lemon twist.',
  'Coupe', 'Lemon twist', 20,
  array['sour','classic']);
select link('bees-knees','gin',50,'ml');
select link('bees-knees','lemon-juice',20,'ml');
select link('bees-knees','honey-syrup',20,'ml');

select seed_cocktail('penicillin', 'Penicillin',
  'Smoky scotch over honey-ginger and lemon — the defining modern classic of the 2000s.',
  'Created by Sam Ross at Milk & Honey, New York, in 2005.',
  'medium',
  E'1. Shake blended scotch, lemon juice and honey-ginger syrup with ice.\n2. Strain into a rocks glass over a large cube.\n3. Float smoky Islay scotch on top.\n4. Garnish with candied ginger.',
  'Rocks', 'Candied ginger', 22,
  array['sour','smoky','modern-classic']);
select link('penicillin','scotch',60,'ml');
select link('penicillin','lemon-juice',20,'ml');
select link('penicillin','honey-syrup',20,'ml');

select seed_cocktail('paper-plane', 'Paper Plane',
  'Equal parts bourbon, Aperol, amaro and lemon — bittersweet, modern and dangerously drinkable.',
  'Sam Ross again, 2008, named after the M.I.A. song.',
  'easy',
  E'1. Shake all four ingredients with ice.\n2. Double-strain into a chilled coupe.',
  'Coupe', 'None', 24,
  array['sour','bitter','modern-classic']);
select link('paper-plane','bourbon',22.5,'ml');
select link('paper-plane','aperol',22.5,'ml');
select link('paper-plane','amaro',22.5,'ml');
select link('paper-plane','lemon-juice',22.5,'ml');

select seed_cocktail('last-word', 'Last Word',
  'Gin, green Chartreuse, maraschino and lime in perfect equal-parts harmony.',
  'A Detroit Athletic Club drink from the 1920s, resurrected in 2004 Seattle.',
  'easy',
  E'1. Shake all ingredients with ice.\n2. Double-strain into a chilled coupe.',
  'Coupe', 'Brandied cherry', 25,
  array['sour','herbal','classic']);
select link('last-word','gin',22.5,'ml');
select link('last-word','green-chartreuse',22.5,'ml');
select link('last-word','maraschino-liqueur',22.5,'ml');
select link('last-word','lime-juice',22.5,'ml');

select seed_cocktail('corpse-reviver-2', 'Corpse Reviver No. 2',
  'Gin, Cointreau, Lillet and lemon through an absinthe mist — the classiest hangover cure ever devised.',
  null, 'medium',
  E'1. Rinse a chilled coupe with absinthe.\n2. Shake gin, triple sec, Lillet and lemon juice with ice.\n3. Double-strain into the coupe.\n4. Garnish with an orange twist.',
  'Coupe', 'Orange twist', 23,
  array['sour','classic','brunch']);
select link('corpse-reviver-2','gin',22.5,'ml');
select link('corpse-reviver-2','triple-sec',22.5,'ml');
select link('corpse-reviver-2','lillet-blanc',22.5,'ml');
select link('corpse-reviver-2','lemon-juice',22.5,'ml');
select link('corpse-reviver-2','absinthe',3,'ml');

select seed_cocktail('vesper', 'Vesper',
  'Gin, vodka and Lillet: invented on the page by Ian Fleming, shaken — of course — not stirred.',
  'Ordered by James Bond in Casino Royale, 1953.',
  'easy',
  E'1. Shake gin, vodka and Lillet with ice.\n2. Strain into a chilled coupe.\n3. Garnish with a long lemon twist.',
  'Coupe', 'Lemon twist', 30,
  array['spirit-forward','classic']);
select link('vesper','gin',60,'ml');
select link('vesper','vodka',15,'ml');
select link('vesper','lillet-blanc',7.5,'ml');

select seed_cocktail('aviation', 'Aviation',
  'Gin, maraschino, lemon and a whisper of violet — a pale-sky drink from 1916.',
  null, 'medium',
  E'1. Shake all ingredients with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with a brandied cherry.',
  'Coupe', 'Brandied cherry', 22,
  array['sour','floral','classic']);
select link('aviation','gin',45,'ml');
select link('aviation','maraschino-liqueur',15,'ml');
select link('aviation','creme-de-violette',7.5,'ml');
select link('aviation','lemon-juice',15,'ml');

select seed_cocktail('hemingway-daiquiri', 'Hemingway Daiquiri',
  'A drier, sharper daiquiri with grapefruit and maraschino, built for the writer who drank them double.',
  null, 'medium',
  E'1. Shake rum, both juices and maraschino with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with a lime wheel.',
  'Coupe', 'Lime wheel', 20,
  array['sour','refreshing','classic']);
select link('hemingway-daiquiri','white-rum',60,'ml');
select link('hemingway-daiquiri','maraschino-liqueur',15,'ml');
select link('hemingway-daiquiri','grapefruit-juice',20,'ml');
select link('hemingway-daiquiri','lime-juice',15,'ml');

select seed_cocktail('irish-coffee', 'Irish Coffee',
  'Hot coffee, Irish whiskey and brown sugar under a layer of softly whipped cream.',
  'Perfected at Shannon Airport in the 1940s to warm transatlantic travellers.',
  'medium',
  E'1. Warm a stemmed glass with hot water and discard.\n2. Add whiskey, syrup and hot coffee; stir.\n3. Float lightly whipped cream over the back of a spoon.',
  'Irish coffee glass', 'None', 9,
  array['hot','after-dinner','coffee','winter']);
select link('irish-coffee','irish-whiskey',40,'ml');
select link('irish-coffee','hot-coffee',120,'ml');
select link('irish-coffee','simple-syrup',15,'ml');
select link('irish-coffee','cream',30,'ml');

select seed_cocktail('grasshopper', 'Grasshopper',
  'Mint, chocolate and cream shaken into a pale-green after-dinner treat.',
  null, 'easy',
  E'1. Shake all ingredients hard with ice.\n2. Double-strain into a chilled coupe.\n3. Garnish with grated chocolate.',
  'Coupe', 'Grated chocolate', 12,
  array['creamy','sweet','after-dinner']);
select link('grasshopper','creme-de-menthe',30,'ml');
select link('grasshopper','creme-de-cacao',30,'ml');
select link('grasshopper','cream',30,'ml');

select seed_cocktail('brandy-alexander', 'Brandy Alexander',
  'Cognac, dark cacao and cream — dessert with a backbone.',
  null, 'easy',
  E'1. Shake all ingredients hard with ice.\n2. Double-strain into a chilled coupe.\n3. Dust with freshly grated nutmeg.',
  'Coupe', 'Grated nutmeg', 16,
  array['creamy','sweet','after-dinner','winter']);
select link('brandy-alexander','cognac',30,'ml');
select link('brandy-alexander','creme-de-cacao',30,'ml');
select link('brandy-alexander','cream',30,'ml');

select seed_cocktail('vieux-carre', 'Vieux Carré',
  'Rye, cognac, vermouth and Bénédictine — the French Quarter''s answer to the Manhattan.',
  'Created at the Hotel Monteleone''s Carousel Bar, New Orleans, 1938.',
  'medium',
  E'1. Stir all ingredients with ice.\n2. Strain into a rocks glass over a large cube.\n3. Garnish with a lemon twist.',
  'Rocks', 'Lemon twist', 28,
  array['spirit-forward','classic']);
select link('vieux-carre','rye-whiskey',30,'ml');
select link('vieux-carre','cognac',30,'ml');
select link('vieux-carre','sweet-vermouth',30,'ml');
select link('vieux-carre','benedictine',7.5,'ml');
select link('vieux-carre','peychauds-bitters',1,'dash');
select link('vieux-carre','angostura-bitters',1,'dash');

select seed_cocktail('singapore-sling', 'Singapore Sling',
  'A grand, fruity gin sling layered with cherry, herbs and pineapple.',
  'Invented at Raffles Hotel, Singapore, around 1915.',
  'hard',
  E'1. Shake all ingredients except soda with ice.\n2. Strain into a tall glass over fresh ice.\n3. Top with soda if desired.\n4. Garnish with pineapple and a cherry.',
  'Hurricane', 'Pineapple slice, cherry', 12,
  array['fruity','long-drink','classic']);
select link('singapore-sling','gin',30,'ml');
select link('singapore-sling','cherry-liqueur',15,'ml');
select link('singapore-sling','triple-sec',7.5,'ml');
select link('singapore-sling','benedictine',7.5,'ml');
select link('singapore-sling','pineapple-juice',120,'ml');
select link('singapore-sling','lime-juice',15,'ml');
select link('singapore-sling','grenadine',10,'ml');
select link('singapore-sling','angostura-bitters',1,'dash');

select seed_cocktail('pisco-sour', 'Pisco Sour',
  'Peru''s silky national sour: pisco, lime, sugar and egg-white foam dotted with bitters.',
  null, 'medium',
  E'1. Dry-shake pisco, lime juice, syrup and egg white.\n2. Add ice and shake hard.\n3. Strain into a chilled coupe.\n4. Dot the foam with bitters.',
  'Coupe', 'Angostura drops', 18,
  array['sour','shaken','classic']);
select link('pisco-sour','pisco',60,'ml');
select link('pisco-sour','lime-juice',30,'ml');
select link('pisco-sour','simple-syrup',20,'ml');
select link('pisco-sour','egg-white',15,'ml');
select link('pisco-sour','angostura-bitters',3,'drop');

select seed_cocktail('bellini', 'Bellini',
  'White peach purée lifted by cold Prosecco — Venice in a flute.',
  'Created by Giuseppe Cipriani at Harry''s Bar, Venice, in 1948.',
  'easy',
  E'1. Pour chilled peach purée into a flute.\n2. Slowly top with Prosecco, stirring gently.',
  'Flute', 'None', 8,
  array['sparkling','brunch','aperitif','low-abv']);
select link('bellini','prosecco',100,'ml');
select link('bellini','peach-puree',50,'ml');

select seed_cocktail('mimosa', 'Mimosa',
  'Champagne and fresh orange juice — brunch''s golden standard.',
  null, 'easy',
  E'1. Pour chilled orange juice into a flute.\n2. Top gently with Champagne.',
  'Flute', 'None', 7,
  array['sparkling','brunch','low-abv']);
select link('mimosa','champagne',75,'ml');
select link('mimosa','orange-juice',75,'ml');

select seed_cocktail('kir-royale', 'Kir Royale',
  'A blackcurrant jewel: crème de cassis beneath cold Champagne.',
  null, 'easy',
  E'1. Pour crème de cassis into a flute.\n2. Top slowly with Champagne.',
  'Flute', 'None', 11,
  array['sparkling','aperitif','celebration']);
select link('kir-royale','champagne',90,'ml');
select link('kir-royale','creme-de-cassis',10,'ml');

select seed_cocktail('gin-tonic', 'Gin & Tonic',
  'The world''s most reliable highball: botanical gin, bitter tonic, plenty of ice.',
  null, 'easy',
  E'1. Fill a large glass to the top with ice.\n2. Add gin, then pour tonic down a bar spoon.\n3. Stir once and garnish with lime.',
  'Highball', 'Lime wedge', 10,
  array['refreshing','long-drink','aperitif']);
select link('gin-tonic','gin',50,'ml');
select link('gin-tonic','tonic-water',150,'ml');

select seed_cocktail('whiskey-highball', 'Whiskey Highball',
  'Whiskey stretched with sparkling water — Japan turned this simplicity into an art form.',
  null, 'easy',
  E'1. Fill a highball glass with ice.\n2. Add whiskey and stir to chill.\n3. Top with soda water and stir once, gently.',
  'Highball', 'Lemon twist (optional)', 9,
  array['refreshing','long-drink','low-abv']);
select link('whiskey-highball','whiskey',45,'ml');
select link('whiskey-highball','soda-water',120,'ml');

select seed_cocktail('el-diablo', 'El Diablo',
  'Tequila, cassis, lime and ginger beer — a devilish take on the mule.',
  null, 'easy',
  E'1. Build tequila, cassis and lime juice in a highball glass with ice.\n2. Top with ginger beer.\n3. Garnish with a lime wheel.',
  'Highball', 'Lime wheel', 11,
  array['refreshing','fruity','long-drink']);
select link('el-diablo','tequila-blanco',45,'ml');
select link('el-diablo','creme-de-cassis',15,'ml');
select link('el-diablo','lime-juice',15,'ml');
select link('el-diablo','ginger-beer',90,'ml');

select seed_cocktail('naked-and-famous', 'Naked and Famous',
  'Mezcal''s answer to the Paper Plane: smoke, Chartreuse, Aperol and lime in equal parts.',
  'Created by Joaquín Simó at Death & Co., New York.',
  'easy',
  E'1. Shake all ingredients with ice.\n2. Double-strain into a chilled coupe.',
  'Coupe', 'None', 23,
  array['sour','smoky','modern-classic']);
select link('naked-and-famous','mezcal',22.5,'ml');
select link('naked-and-famous','green-chartreuse',22.5,'ml');
select link('naked-and-famous','aperol',22.5,'ml');
select link('naked-and-famous','lime-juice',22.5,'ml');

select seed_cocktail('rusty-nail', 'Rusty Nail',
  'Scotch smoothed with honeyed Drambuie — a two-bottle nightcap.',
  null, 'easy',
  E'1. Build both ingredients in a rocks glass over a large cube.\n2. Stir until chilled.\n3. Garnish with a lemon twist.',
  'Rocks', 'Lemon twist', 32,
  array['spirit-forward','after-dinner','winter']);
select link('rusty-nail','scotch',45,'ml');
select link('rusty-nail','drambuie',20,'ml');

select seed_cocktail('elderflower-spritz', 'Elderflower Spritz',
  'Prosecco, elderflower liqueur, mint and soda — the Alpine garden spritz also known as the Hugo.',
  null, 'easy',
  E'1. Fill a wine glass with ice and mint leaves.\n2. Add elderflower liqueur and prosecco.\n3. Top with soda and stir gently.\n4. Garnish with mint and lime.',
  'Wine glass', 'Mint sprig, lime slice', 8,
  array['sparkling','refreshing','summer','low-abv']);
select link('elderflower-spritz','prosecco',90,'ml');
select link('elderflower-spritz','elderflower-liqueur',30,'ml');
select link('elderflower-spritz','soda-water',30,'ml');
select link('elderflower-spritz','mint',4,'leaf');

select seed_cocktail('harvey-wallbanger', 'Harvey Wallbanger',
  'A screwdriver crowned with a float of vanilla-herbal Galliano.',
  null, 'easy',
  E'1. Build vodka and orange juice in a highball glass with ice.\n2. Float Galliano on top.\n3. Garnish with an orange slice and cherry.',
  'Highball', 'Orange slice, cherry', 11,
  array['fruity','party','retro']);
select link('harvey-wallbanger','vodka',45,'ml');
select link('harvey-wallbanger','orange-juice',90,'ml');
select link('harvey-wallbanger','galliano',15,'ml');

select seed_cocktail('mudslide', 'Mudslide',
  'Vodka, coffee liqueur and Irish cream — a milkshake that bites back.',
  null, 'easy',
  E'1. Shake all ingredients hard with ice.\n2. Strain into a rocks glass over fresh ice.\n3. Garnish with grated chocolate.',
  'Rocks', 'Grated chocolate', 14,
  array['creamy','sweet','after-dinner']);
select link('mudslide','vodka',30,'ml');
select link('mudslide','coffee-liqueur',30,'ml');
select link('mudslide','irish-cream',30,'ml');

--------------------------------------------------------------------------
-- Cleanup
--------------------------------------------------------------------------

drop function link(text, text, numeric, text, boolean, boolean);
drop function seed_cocktail(text, text, text, text, text, text, text, text, numeric, text[]);
drop function seed_ing(text, text, text, text, numeric, boolean);
