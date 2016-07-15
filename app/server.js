//require the correct node modules
var express = require('express');
var app = express();
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bestMovies.db');
var bcrypt = require('bcrypt');
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

//This event is hit when the user is creating a new profile on the login.ejs page
//Their information will be put into the database
app.post('/user', function(req,res){
	var username = req.body.newName;
	var password = req.body.newPassword;
	var confirm = req.body.confirmPass;

	// console.log(req.body)
	// console.log(req.POST) === undefined
	// console.log(req.method) === "POST"
	
	if (password === confirm){
		var hash = bcrypt.hashSync(password, 8);

// Now the password is the hash you have created using bcrypt
		db.run('INSERT INTO users(username, password) VALUES (?, ?)', username, hash, function(err){
			if(err) { throw err;}
		});
//Redirects to login page again so the user can sign in
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});


//This post is hit when the user logs in through the login.ejs
//verifying the user with the password
app.post('/session', function(req,res){
	var username = req.body.username;
	var password = req.body.password;

//search through the users table. compare the submitted password with the password in the db
	db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
		if(err) {throw err;};
		
		if(row) {
			var passwordMatches = bcrypt.compareSync(password, row.password);
			
			if (passwordMatches) { 
				//Pay attention to these two "req.session". 
				//We are creating more values in our session token to use for later!!!
				req.session.valid_user = true;
				req.session.username = username;
				res.redirect('/movies');	
			}
		} else {
			res.redirect('/');	
		}
	});
});



//Once the user is verified in "/session" we will render the index.ejs file
app.get('/movies', function(req,res){
	if (req.session.valid_user === true){
		res.render('index.ejs', {});
	} else {
		res.redirect('/');
	} 
});


//This is the first search event. 
app.get('/movies/:title', function(req, res){
  var title = req.params.title;

  var omdburl = "http://www.omdbapi.com/?s=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
//see what the JSON file looks like for multiple or single movies
    }
  })
});

//Instead of creating the "singleMovie" function in my main.js over and over again in similar variations
//I decided to create the below event which will pull data from the api based off the very specific title clicked on or searched
//This event is also where the movies are added to the movie database
app.post('/movies/single/:title', function(req, res){
  var title = req.params.title;

  var omdburl = "http://www.omdbapi.com/?t=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
//enter a console.log here if you want to see the JSON file format for the movie details
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


//Here we are allowing the user to add movies to their "favorite" list
//The first two "SELECT" iterations are for grabbing the user_id and movie_id. These will be used for the favorites table
//The "DELETE" portion is implemented to make sure a user will not have duplicate movies on their list
//The "INSERT" is the creation of the relation between user and movie in the "favorites" table
//Encapsulating these events within each other stopped the issues caused by JS async properties
//For example, if not encapsulated, the DELETE or INSERT events may run before receiving the user_id or movie_id
app.post('/movies/favAdd/:title', function(req,res){
	var username = req.session.username;
	var title = req.params.title;
	var user_id = '';
	var movie_id = '';

	db.get("SELECT * FROM users WHERE username = ?", username,function(err, row){
		if(err) {throw err;};

		if (row != undefined){	
			user_id = row.id;
		}

		db.get("SELECT * FROM movies WHERE title = ?", title,function(err, row){
			if(err) {throw err;};
			if (row != undefined){
				movie_id = row.id;
			}

			db.run("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?", user_id, movie_id, function(err){
				if(err){ throw err;};
		
				db.run("INSERT INTO favorites(user_id, movie_id) VALUES (?, ?)", user_id, movie_id, function(err){
					//console log the user id and movie id to see the relationship
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

//Grabbing the users favorite list
//Again we require the db events are encapsulated within each other
//Created two empty arrays so I can pull/push/grab the movie data(user_id --> movie_id --> movie_title)
app.get('/favList/', function(req, res){
//Remember that req.session.username we created above. Well now we get to use it
	var username = req.session.username;
	var user_id = '';
	var movieArr = [];
	var movieTitles = [];

	db.get("SELECT * FROM users WHERE username = ?", username, function(err, row){
		if(err) {throw err;};

		if(row != undefined){
			user_id = row.id;
		}
		db.all("SELECT * FROM favorites WHERE user_id = ?", user_id, function(err, rows){
			if(err) {throw err;};

			for (i=0; i<rows.length; i++){
				movieArr.push(rows[i].movie_id);
			}

			for (j=0; j<movieArr.length; j++){
				db.get("SELECT * FROM movies WHERE id = ?", movieArr[j], function(err, row){
					if(err) {throw err;};
					movieTitles.push(row.title);

//This last if statement is to ensure the res.send does not initiate until the for loops are completed
					if(movieTitles.length === movieArr.length){
						res.send(movieTitles);
					}
				})
			};
		})
	})
});

app.delete('/logout', function(req,res){
	console.log("ARE WE IN LOGOUT?");
	console.log(req.session);
	req.session.destroy();

	console.log(req.session);
	res.json("logout");
})

//tells you if you are connected, shows up in terminal. Make sure to turn this to port 80 when pushing to Digital Ocean
app.listen(5002);
console.log("we are connected to port 4000, Move to 5002 when pushing to DO");

