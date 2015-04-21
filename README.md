#Movie Lister

Hello wonderful students! This tutorial was written as an outline for how to build a full fledged movie application. There are certain parameters involed so feel free to visit the **Objectives** section whenever you want to get started.

## Table of Contents

##### [I. Objectives](#objectives)
##### [II. Blueprint](#layout)
##### [III. NPM Packages](#npm)
##### [IV. Database](#db)
##### [V. Server](#server)
##### [Digital Ocean Hosting](#do)
##### [Project Notes](#notes)



## <a name=objectives>Objectives</a>
Your goal is to build a full fledge movie list web application. You will pull from an external API to request movie data. Users should be able to save their "favorite" movies and view that list any time they feel like it. (Persistance!). Here are some rules and guidelines:

* You can only use Vanilla JavaScript
* Use external APIs (OMDB is free and open, Rotten Tomatoes is free but needs a key)
	* We will be using both because OMDB does not seem to return multiple movies even with the same or similar titles. 
* Users should be able to see a list of ALL movies with the searched title
* Users should be able to click on a movie and see detailed information about the movie
* Users can save a "favorite" movie
* The saved movie must persist.
* Users can view their list of favorite movies

## <a name=layout>Blueprint</a>
Let's begin to think about the web app from an architecture standpoint. How do you want to build this? What npm packages will you need? What files will go in what folders?

* Root Directory
	* db
	* node_modules
	* public
	* views
	* .gitignore - ignore the files that are not going to github. This includes the node_modules file and the file where you will be storing your api data.
	* package.json - This file is used for others to "npm install" packages. Make sure the versions are all up to date.
	* api.txt file - where you can store your api key if you are using one
	* server.js
	* movies.db - after you create your schema use the sqlite3 command to create the database in the root folder

* db 
	* schema.sql - use this to create your database

* public
	* main.js - Your main.js file will be making the request to the express server, and doing DOM manipulation
	* style.css - Looks aren't everything but they sure as hell count

* views
	* login.ejs- initial page people see when they visit your site
	* index.ejs - after logging in this will be a single page app making ajax calls to the external apis
	
## <a name=npm>NPM Packages</a>
What are the dependencies we should input into our "package.json" file? 

* express - we need a server
* body-parser - aids in parsing data coming in
* fs - we'll use this to read the txt file holding our api key
* ejs - We will be using "ejs" files instead of "html" files
* sqlite3 - use to create databases
* bcrypt - secure the users passwords when the signup or login
* express-session - allow the users to authenticate when logging in
* request - request data from the external apis

```
  "dependencies": {
    "express": "^4.12.2",
    "body-parser": "^1.12.0",
    "fs": "^0.0.2",
    "ejs": "^2.3.1",
    "sqlite3": "^3.0.4",
    "bcrypt": "^0.8.2",
    "express-session": "^1.11.1",
    "request": "2.55.0"
  }
```

	
## <a name=db>Database</a>
As mentioned in the above section we will be using "sqlite3" to create our database and store the information. What exactly are we storing? We'll need a table for users, another for movies, and another table to connect the first two. Our schema.sql should look like this:

```
CREATE TABLE users(
          id INTEGER PRIMARY KEY,
          username TEXT,
          password TEXT
);

CREATE TABLE movies(
          id INTEGER PRIMARY KEY,
          title TEXT
);

CREATE TABLE favorites(
          id INTEGER PRIMARY KEY,
          user_id INTEGER REFERENCES users,
          movie_id INTEGER REFERENCES movies
);
```

Now to create the tables you can type (while in the root folder)

```
sqlite3 bestMovies.db < db/schema.sql
```

## <a name=server>Server</a>
Let's make a short semi detailed layout of how to write up our Express.js server.

First require all the correct packages. Make sure to put these as dependencies in your package.json file, and .gitignore your node_modules folder.

```
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
```

Next we're going to use a session for authentication of the user.

```
app.use(session({
  secret: "string",
  resave: false,
  saveUninitialized: true
}));

//for pulling in the api key later
var rtapi = fs.readFileSync('rtapi.txt', 'utf8');
```

When the user visits our site they should go to a login.ejs file with two different forms. One form should lead to the user logging in, and the other form should lead to the user creating an account, by inputing a name and password. If the user is logging in, we need to check the submitted password to the password in the database. If approved we will res.render the index.ejs file. These express events should look similar to the ones below:

```
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
```	

The first movie search will hit the Rotten Tomatoes api. We do this to see if there is more than one movie to the searched title. If so it will send back the JSON file which we will loop through and create list items for the user to see. Creating the list items is done in main.js.

```
//searches through movie titles on the Rotten Tomatoes API.
//Using RT because OMDB does not allow easy cycling through movies with the same title
app.get('/movies/:title', function(req, res){
  var title = req.params.title;

  var urlRT = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=" + rtapi + "&q=" + title;

  request(urlRT, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
      console.log(body);
    }
  })
  console.log(urlRT);
});
```

But what happens when there is only one movie? This is where that sweet free OMDB api comes in. 

```
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
  console.log(omdburl);
})
```

* require the packages
* app.use - session
* app.get - login
* app.post - user (create)
* app.post - session (login)
* app.get - index (authenticated)
* app.get - movies1 (multiple movie list)
* app.post - movies2 (single movie found, push to db, send movie details to main.js)
* app.listen - what port

## <a name=do>Digital Ocean Hosting</a>
Shameless plug! Visit my other tutorial on how to host a node app on Digital Ocean. 

* [Launching a Node.js Website on Digital Ocean](https://github.com/Jingo88/Tutorial-Launch_Node.js_Apps_on_Digital_Ocean)

Bonus Shameless plug! Learn to configure your ssh for an easier time logging into your droplet

* [How to Vim / Bash / SSH Config](https://github.com/Jingo88/Tutorial-How_To_VIM_Bash_and_SSHConfig)


## <a name=notes> Project Notes</a>

* **README.md**: This markdown was written as a tutorial catering to students. I tried to provide examples but not give too much information as well.  
* **Sqlite3 and Bcrypt**: Creating three tables (users, movies, favorites) and used this to authenticate users and persist user data and favorited movies.
* **Data.json**: Did not utilize data.json file. Wanted to provide authentication using bcrypt. 
* **OMDB vs. RT**: OMDB is a great free database with a ton of information. However, it is slow at times, so I figured I could use a Rotten Tomatoes api to pull for multiple movies and the OMDB api to pull for a single movies details. 
* and only gives you one movie per search. This means if you searched "Star wars", "Die Hard", "Kill Bill" and the like, you would only get a JSON file of the first movie. Rotten Tomatoes, does not provide very detailed information about movies, but does respond with a JSON file that has all movie titles containing the searched string.
	* **Fun Fact**: In the OMDB documentation one of the updates was specifically for the "Lost" tv show because when users searched for "Lost" it would return only "Raiders of the Lost Ark"
* **Selecting a Single element from document.getElementsByClassName**: This has been a mystery left unsolved for longer than time itself. Or at least longer than the math equation Matt Damon solved in the hallway in Good Will Hunting. Anyway here's the review for how I'm able to select ONE list item from multiple created list items with the same class name.  


```
   var multiMovie = document.getElementByClassName('classname');
   multiMovie.addEventListener('click', function(){
       console.log(this);
   });

```
* This will return an error saying multiMovie.addEventListener is not a function. Remember getting an element by class name returns an array of those elements. 
* Alright it's an array, lets try to loop through it and then add a listener

```
    var classname = document.getElementsByClassName("classname");

    var myFunction = function() {
        var attribute = this.getAttribute("data-myattribute");
        alert(attribute);
    };

    for(var i=0;i<classname.length;i++){
        classname[i].addEventListener('click', myFunction, false);
    }
```
* This will return an empty array. When declared outside the function the array will be empty because the list items that are created and hold the class names do not appear until after a user searchs a movie(That comes back with multiple results).
* So maybe it's a problem with scope? Let's dump this code inside the event listener with the created list items.



* removed search button, the user can just press enter
* why not Rotten Tomatoes
* removed var rtapi = fs.readFileSync('rtapi.txt', 'utf8');
* OMDB Documentation does not show you can search for multiple movies
* define.js to organize all the JS
* login.css to organize css
* created a rtapi.txt to bring in to safely secure the apikey no longer need it. this means you no longer need fs either
* 


