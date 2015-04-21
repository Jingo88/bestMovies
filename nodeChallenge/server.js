//require the correct node modules
var express = require('express');
var app = express();
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bestMovies.db');
var bcrypt = require('bcrypt');
var fs = require('fs');
var bodyParser=require('body-parser');
var request = require('request');
var ejs = require('ejs');
var path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//sessions for login
app.use(session({
  secret: "string",
  resave: false,
  saveUninitialized: true
}));

//renders the login.ejs file
app.get('/', function(req,res){
	res.render('login.ejs', {});
});

//creating a new user in the database
app.post('/user', function(req,res){
	var username = req.body.newName;
	var password = req.body.newPassword;
	console.log(username);
	console.log(password);

	if (req.body.newPassword === req.body.confirmPass){
		var hash = bcrypt.hashSync(password, 8);
// Now the password is the hash you have created using bcrypt
		db.run('INSERT INTO users(username, password) VALUES (?, ?)', username, hash, function(err){
			if(err) { throw err;}

		});
//These res.redirects('/') will redirect to the app.get call above and show the user the login.ejs again
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});

//verifying the user with the password
app.post('/session', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	console.log("your username is " + username);
	console.log("your password is " + password);
	console.log("you are now in session post");

//search through the users table. compare the submitted password with the password in the db
	db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
		if(err) {throw err;};
		
		if(row) {
			var passwordMatches = bcrypt.compareSync(password, row.password);
			console.log(passwordMatches)
			if (passwordMatches) { 
				req.session.valid_user = true;
				req.session.username = username;
				res.redirect('/movies');	
			}

		} else {
			res.redirect('/');	
		}
	});
});



//if verified, render the index.ejs file
app.get('/movies', function(req,res){
	if (req.session.valid_user === true){
		res.render('index.ejs', {});
	} else {
		res.redirect('/');
	} 
});



//searches through movie titles on the Rotten Tomatoes API.
//Using RT because OMDB does not allow easy cycling through movies with the same title
app.get('/movies/:title', function(req, res){
  var title = req.params.title;


  var omdburl = "http://www.omdbapi.com/?s=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
      console.log(body);
    }
  })
  console.log(omdburl);
});


//This gets the info from OMDB because they have more movie details
//It will also search the current movies tables, and add new movies there if they are not there already
app.post('/movies/single/:title', function(req, res){
  var title = req.params.title;

  var omdburl = "http://www.omdbapi.com/?t=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
    }
  })



//check the movies table to see if it already exist. if it doesn't then add the movie title
  db.get("SELECT * FROM movies WHERE title = ?", title, function(err,row){
  	if(err) {throw err;};

  	if (row===undefined){
  		db.run("INSERT INTO movies(title) VALUES (?)", title, function(err){
  			if(err){throw err;};
  			
  		})
  	}
  });
  console.log("This is the omdb url" + omdburl);
});


//have to encapsulate all the db calls within one another because they run asynchronously
//This causes issues when db.get the user or movie id comes in after the delete or insert events run
app.post('/movies/favAdd/:title', function(req,res){
	var username = req.session.username;
	var title = req.params.title;
	var user_id = '';
	var movie_id = '';
	console.log("we are in the favorite add post")

	db.get("SELECT * FROM users WHERE username = ?", username,function(err, row){
		if(err) {throw err;};
		console.log("This is db.get in adding to favorites username")

		if (row != undefined){	
			user_id = row.id;
			console.log("This is the favorites username logging the user_id and row_id " + user_id);
		}

		db.get("SELECT * FROM movies WHERE title = ?", title,function(err, row){
			if(err) {throw err;};

			if (row != undefined){
				movie_id = row.id;
			}


			db.run("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?", user_id, movie_id, function(err){
				if(err){ console.log("THIS IS AN ERROR")}
		

				//need to add an if statement to make sure this type of relationship hasn't already been created
				db.run("INSERT INTO favorites(user_id, movie_id) VALUES (?, ?)", user_id, movie_id, function(err){

					console.log("your user_id being added is " + user_id);
					console.log("your movie_id being added is " + movie_id);
					if(err) {throw err;}
					var id = this.lastID;
					db.get("SELECT * FROM favorites WHERE id = ?", id, function(err, row){
						if(err) {throw err;} 
							res.json(row);
					});
				})
			});
		})
	})
});



app.get('/favList/', function(req, res){
	var username = req.session.username;
	var user_id = '';
	var movieArr = [];
	var movieTitles = [];

	console.log("We are in the favorite list server call");

	db.get("SELECT * FROM users WHERE username = ?", username, function(err, row){
		if(err) {throw err;};

		if(row != undefined){
			user_id = row.id;
		}
		db.all("SELECT * FROM favorites WHERE user_id = ?", user_id, function(err, rows){
			if(err) {throw err;};
			//only returning the first row and nothing else!

			for (i=0; i<rows.length; i++){
				movieArr.push(rows[i].movie_id);
				console.log(movieArr);
			}

			
			for (j=0; j<movieArr.length; j++){
				db.get("SELECT * FROM movies WHERE id = ?", movieArr[j], function(err, row){
					if(err) {throw err;};
					console.log("This is your row going in the movieArr " + row.title);
					movieTitles.push(row.title);

					if(movieTitles.length === movieArr.length){
						res.send(movieTitles);
					}
				})
			};
		})
	})
});

//tells you if you are connected, shows up in terminal
app.listen(3000);
console.log("we are connected to port 3000");

