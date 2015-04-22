#Movie Lister

Hello wonderful students! This tutorial was written as an outline for how to build a full fledged movie application. I have also provided an example of the project in this repo. There are certain parameters involved so feel free to visit the **Objectives** section whenever you want to get started.

**A live demo of the web app can be viewed here [jason.princesspeach.nyc](jason.princesspeach.nyc).**

## Table of Contents

##### [I. Objectives](#objectives)
##### [II. Blueprint](#layout)
##### [III. NPM Packages](#npm)
##### [IV. Database](#db)
##### [V. Server](#server)
##### [VI. Main.js](#mainjs)
##### [VII. Digital Ocean Hosting](#do)
##### [VIII. Personal Notes/Thoughts on Project Process](#notes)



## <a name=objectives>Objectives</a>
**Your mission, should you choose to accept it** is to build a web application using an external movie api. Users will be able to save their "favorite" movies and view their movie list at any time. (Persistance!). **This message will self destruct in five seconds. Good luck** Okay nothing will explode, just follow the requirements below:

* Your web application must use vanilla JavaScript
* You will be using OMDB's free api 
* Users should be able to see a list of ALL movies containing the searched title
* Users should be able to click on a movie and view detailed information about that movie
* Users can save a movie to their "favorites list"
* The saved movie must persist.
* Users can view their list of favorite movies


## <a name=layout>Blueprint</a>
Let's begin by formatting the layout of our application. Below is a list of the directory structure. Feel free to visit the example in this repo for more details

* Root Directory
	* Our root directory will have several files
		* server.js
		* .gitignore - Use this to ignore the node_modules and database
		* package.json - Use this to keep the dependencies updated for npm installing elsewhere
		* movies.db - when you run your schema, your movies database should be in the root folder
				
	* The subfolders should be similar to this
		* node_modules - holds your npm packages, will be ignored on git push. It will be created and populated by itself when you npm install packages
		* public - contains your front end javascript and css stylesheet files
		* views - contains your ejs file/s
		* db - contains your schema, and seed files


	
## <a name=npm>NPM Packages</a>
What are the dependencies we should input into our "package.json" file? 

* express - we need a server
* body-parser - aids in parsing data coming in
* ejs - We will be using "ejs" files instead of "html" files
* sqlite3 - use to create databases
* bcrypt - secure the users passwords when the signup or login
* express-session - allow the users to authenticate when logging in
* request - request data from the external apis

```
  "dependencies": {
    "express": "^4.12.2",
    "body-parser": "^1.12.0",
    "ejs": "^2.3.1",
    "sqlite3": "^3.0.4",
    "bcrypt": "^0.8.2",
    "express-session": "^1.11.1",
    "request": "2.55.0"
  }
```

	
## <a name=db>Database</a>
As mentioned in the above section we will be using "sqlite3" to create our database and store the information. What exactly are we storing? Three different tables. One for users, one for movies, and one for the relationship between users and movies when they add to their favorites list. Below is an example of the schema.

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

Now to create the tables run the following command in the root folder

```
sqlite3 bestMovies.db < db/schema.sql
```

If you ever feel the need to change your table names or reset the data in your database just remove your current db and rerun the command above. 

## <a name=server>Server</a>
Your server file can get fairly long. This tutorial will point out some of the necessities, and provide some hints and samples for you to reference to
 
#### Require
First require all the correct packages. Make sure to put these as dependencies in your package.json file, and .gitignore your node_modules folder.

```
var express = require('express');
var app = express();
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bestMovies.db');
var bcrypt = require('bcrypt');
var bodyParser=require('body-parser');
var request = require('request');
var ejs = require('ejs');
```

#### Session / Create / Login
Next we're going to use a session for authentication of the user.

```
app.use(session({
  secret: "string",
  resave: false,
  saveUninitialized: true
}));
```

When the user visits our site they will see a login page with two different forms. One form should lead to the user logging in, and the other form should lead to the user creating an account. If the user is logging in, we need to check the submitted password against the password in the database. If approved we will res.render the index.ejs file. These express events from the provided exercise example is below:


Let's render the login file

```
app.get('/', function(req,res){
	res.render('login.ejs', {});
});
```
Now we'll create the event to see if a user is creating an account, and store that data. Mind the "bcrypt" portion, that creates the password hash so the users actual password is not stored. Then redirect back to the login page for the user to sign in.

```
app.post('/user', function(req,res){
	var username = req.body.newName;
	var password = req.body.newPassword;
	console.log(username);
	console.log(password);

	if (req.body.newPassword === req.body.confirmPass){
		var hash = bcrypt.hashSync(password, 8);
		db.run('INSERT INTO users(username, password) VALUES (?, ?)', username, hash, function(err){
			if(err) { throw err;}

		});
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});
```

We are verifying the user that is signing in. Select the user from the database and see if the stored password matches the submitted password. Pay attention to the two "req.session" below. We are creating more values in our session token to be used later.

```
app.post('/session', function(req,res){
	var username = req.body.username;
	var password = req.body.password;

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
```

Once you're all done here make sure to make a request to render the index.ejs file if the user is authenticated.

**BONUS** What about allowing the user to log out of their session?


#### Movie Search 
Below is a "GET" request that pulls data from the omdb api.

```
app.get('/movies/:title', function(req, res){
  var title = req.params.title;

  var omdburl = "http://www.omdbapi.com/?s=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
    }
  })
});
```

In the example code provided in this repo, I used a second request that will be called on a single specific title. It is here I also added movies to the database. Your api request and database requests are dependent on how you want to display the movie information. 

**Hint**: Your request type may be a POST instead of GET if you are editing your database.

#### Storing Favorites / Viewing Your Favorites List
Alright lets get into the nitty gritty of how to let users save their favorite movies, and then see a list of that **PERSISTED** data.

Provided below is a sample of how to allow users to add a movie to their "favorite" list. The first two "SELECT" iterations are getting us the user and movie id. The "DELETE" section is used to ensure movies cannot be duplicated on a users list. The "INSERT" is to create the relationship of between the user and movie in the "favorites" table. 

Encapsulating these events within each other prevents issues caused by JS async properties. For example, if you did not encapsulate the db events, the DELETE or INSERT events may run before the user_id/movie_id is returned.

```
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
```

Now write a request that will allow the users to pull the movie list data from your database. 

**Hint**: Might be a GET request instead of a POST

**Hint 2**: The encapsulation in the above sample may be the same format you choose to use when pulling data from your tables.

**Hint 3**: The flow may look like - User_id --> Movie_id --> Movie_title


## <a name=mainjs>Main.js</a>
I will only be covering the material required to make the calls to the server and parse the data. Feel free to manipulate the DOM however you please. Some things you can consider are:

```
* Do you want a home button? 
* What details do you want to show off? 
* Are you having the list of movies, and a list of details appearing at the same time?
* Maybe provide a movie poster? 
* But what if the JSON file doesn't have a movie poster? 
* How much of the DOM do you want to manipulate/create? vs. How much do you want to already have on the ejs file layout?
```
Alright, lets get into the meat and potatoes of this beautiful main.js file. We'll start by making the call to search for a movie. You will want to create a "url" variable which will tell us what express point we are targeting. Also, make sure you are using the proper request! ("GET" vs. "POST"). Below is the "GET" function from the provided example:

```
function searchTitle(movie){
    var url = '/movies/' + movie
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.addEventListener('load', function(){
        var movieObj = JSON.parse(xhr.responseText);
        var movies = movieObj.Search;
        console.log(movieObj);
        clearData();

        if (movies.length >= 2){
            for (i=0; i<movies.length; i++){
                var li=document.createElement('li');
                li.innerHTML = movies[i].Title;
                li.setAttribute('class', 'multiMovie');
                page.appendChild(li);
            };

            var multiMovie = document.getElementsByClassName('multiMovie');
            
            var getMovie = function() {
                singleMovie(this.innerText);
                console.log(this.innerText);
            };

            for(var i=0;i<multiMovie.length;i++){
                multiMovie[i].addEventListener('click', getMovie, false);
            }
        } else {
            singleMovie(movie);
        }
    });
    xhr.send();
};
```

Now how will you pass the movie details of a single movie onto the page. What would the "singleMovie(movie)" function in the above sample look like?

**Hint**: It can get kind of long using all vanilla javascript DOM manipulate, so keep your naming conventions organized!

## <a name=do>Digital Ocean Hosting</a>
Shameless plug! Visit my other tutorial on how to host a node app on Digital Ocean. 

* [Launching a Node.js Website on Digital Ocean](https://github.com/Jingo88/Tutorial-Launch_Node.js_Apps_on_Digital_Ocean)

Bonus Shameless plug! Learn to configure your ssh for an easier time logging into your droplet

* [How to Vim / Bash / SSH Config](https://github.com/Jingo88/Tutorial-How_To_VIM_Bash_and_SSHConfig)


## <a name=notes> Personal Notes on Project Process</a>

* **README.md**: The directions were vague on how to format the README file so I decided a tutorial for web development students would work best.
* **Data.json**: Did not utilize this file. I was filled with the grandiose notion that a web app with login and authentication would be more impressive. I hope I was right. 
* **fs**: It was my intention to use the "fs" npm package to read an apikey file. I began writing code to use the Rotten Tomatoes api for the initial search(because it is way faster than OMDB), and then use the OMDB api for movie details. However I could not get an RT apikey in time, so I discarded the idea.
* **OMDB API**: Great api, but their documentation only gives us the link for single movie searches. To find multiple movies with the same search title the api link is:

```
http://www.omdbapi.com/?s=[movie title]
```
* **MVC**: I am currently teaching myself Angular, but did not feel I had sufficient time to deploy this app utilizing that framework. I hope to further this web app later on.
* **Learn img tag**: Neat trick about centering an image tag. Give it an attribute of "align = center"
* **Learn .gitkeep**: This is used to track empty directories because Git cannot add empty directories. Makes sense since .gitignore wouldn't really help you with that.
* **Learn Vanilla JS**: Selecting a single element from list items created with the same class proved to be slightly difficult. This was one of my favorite obstacles I faced in this project. You cannot addEventListener to a variable that is "getElementsByClassName" because that returns an array, and you can't try to loop through that array as a global variable because it will run on load and your array will be empty. SCOPE!

```
      var multiMovie = document.getElementsByClassName('multiMovie');
            
      var getMovie = function() {
          singleMovie(this.innerText);
          console.log(this.innerText);
      };

      for(var i=0;i<multiMovie.length;i++){
          multiMovie[i].addEventListener('click', getMovie, false);
      }
```