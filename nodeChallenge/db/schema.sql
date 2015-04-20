CREATE TABLE users(
          id INTEGER PRIMARY KEY,
          username TEXT,
          password TEXT
);

CREATE TABLE movies(
          id INTEGER PRIMARY KEY,
          title TEXT
);

CREATE TABLE joins(
          id INTEGER PRIMARY KEY,
          user_id INTEGER REFERENCES users,
          movie_id INTEGER REFERENCES movies
);
