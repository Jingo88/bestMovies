var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("bestMovies.db");

db.run("INSERT INTO users (username, password) VALUES(?, ?)",
	'J)

db.run("INSERT INTO pets (name, type) VALUES(?, ?), (?, ?), (?, ?), (?, ?), (?, ?),(?, ?)",
	'Fluffy', 'hamster',
	'Salty', 'cat',
	'Pepper', 'cat',
	"Big Moe", 'frog',
	"Frick", 'goldfish',
	'Frack', 'goldfish',
	function(err){
		if(err){
			throw err;
		}
	}
);
