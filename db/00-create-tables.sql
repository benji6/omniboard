CREATE TABLE IF NOT EXISTS posts(
	id SERIAL PRIMARY KEY,
	user_id TEXT NOT NULL,
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	location TEXT NOT NULL
);
