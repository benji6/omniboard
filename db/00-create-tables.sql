CREATE TABLE IF NOT EXISTS cities(
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
	body TEXT NOT NULL,
	city_id INTEGER REFERENCES cities,
	created_at TIMESTAMPTZ NOT NULl DEFAULT NOW(),
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	user_id TEXT NOT NULL
);

-- INSERT INTO cities (name) VALUES
--   ('Aberdeen'),
--   ('Armagh'),
--   ('Bangor'),
--   ('Bath'),
--   ('Belfast'),
--   ('Birmingham'),
--   ('Bradford'),
--   ('Brighton & Hove'),
--   ('Bristol'),
--   ('Cambridge'),
--   ('Canterbury'),
--   ('Cardiff'),
--   ('Carlisle'),
--   ('Chelmsford'),
--   ('Chester'),
--   ('Chichester'),
--   ('Coventry'),
--   ('Derby'),
--   ('Derry'),
--   ('Dundee'),
--   ('Durham'),
--   ('Edinburgh'),
--   ('Ely'),
--   ('Exeter'),
--   ('Glasgow'),
--   ('Gloucester'),
--   ('Hereford'),
--   ('Inverness'),
--   ('Kingston upon Hull'),
--   ('Lancaster'),
--   ('Leeds'),
--   ('Leicester'),
--   ('Lichfield'),
--   ('Lincoln'),
--   ('Lisburn'),
--   ('Liverpool'),
--   ('London'),
--   ('Manchester'),
--   ('Newcastle upon Tyne'),
--   ('Newport'),
--   ('Newry'),
--   ('Norwich'),
--   ('Nottingham'),
--   ('Oxford'),
--   ('Perth'),
--   ('Peterborough'),
--   ('Plymouth'),
--   ('Portsmouth'),
--   ('Preston'),
--   ('Ripon'),
--   ('Salford'),
--   ('Salisbury'),
--   ('Sheffield'),
--   ('Southampton'),
--   ('St Albans'),
--   ('St Asaph'),
--   ('St Davids'),
--   ('Stirling'),
--   ('Stoke-on-Trent'),
--   ('Sunderland'),
--   ('Swansea'),
--   ('Truro'),
--   ('Wakefield'),
--   ('Wells'),
--   ('Westminster'),
--   ('Winchester'),
--   ('Wolverhampton'),
--   ('Worcester'),
--   ('York');
