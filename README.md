#Movie Lister

Hello wonderful students! This tutorial was written as an outline for how to build a full fledged movie application. I have also provided an example of the project in this repo. There are certain parameters involved so feel free to visit the **Objectives** section whenever you want to get started.

**A live demo of the web app can be viewed here[jason.princesspeach.nyc](jason.princesspeach.nyc).**

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
Your server.js file can get fairly long. We'll try to condense it here and hit the major points. 
#### Require
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

Once the user is verified the redirect will render the index.ejs file

```
app.get('/movies', function(req,res){
	if (req.session.valid_user === true){
		res.render('index.ejs', {});
	} else {
		res.redirect('/');
	} 
});
```	

#### Movie Search 
I have created two search events in the express server. 

Below is the first search event triggered. This is a "GET" request

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
I built a second search event that will search for a single specific title. This is a "POST" request. This second function allows us to utilize the "singleMovie" function in the main.js over and over again. The single movie function is a long function that populates the details of a selected movie. In this second function we also search the databse to see if the movie is already in there, and if it isn't we bring it in. You can console.log the request body to see the JSON format in your terminal. It will be easier to view the data through a console.log in your main.js file.

```
app.post('/movies/single/:title', function(req, res){
  var title = req.params.title;

  var omdburl = "http://www.omdbapi.com/?t=" + title;

  request(omdburl, function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
    }
  })
  db.get("SELECT * FROM movies WHERE title = ?", title, function(err,row){
  	if(err) {throw err;};

  	if (row===undefined){
  		db.run("INSERT INTO movies(title) VALUES (?)", title, function(err){
  			if(err){throw err;};
  			
  		})
  	}
  });
});
```

#### Storing Favorites / Viewing Your Favorites List
Alright lets get into the nitty gritty of how to let users save their favorite movies, and then see a list of that **PERSISTED** data.

Here we are allowing the user to add movies to their "favorite" list. The first two "SELECT" iterations are getting us the user and movie id. The "DELETE" section is used to ensure movies cannot be duplicated on a users list. The "INSERT" is to create the relationship of between the user and movie in the "favorites" table. 

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

Now lets get the users list of favorite movies. Here we are still encapsulating the database events. Remember that "req.session.username" I told you to pay attention to earlier? Well now you get to use it!

We also created two empty arrays to store the data we will be using throughout this event. The process for grabbing the proper data looks a little like this: **user_id --> movie_id --> movie_title**

The last if statement is to ensure the res.send does not initiate until the for loops are completed

```
app.get('/favList/', function(req, res){
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

					if(movieTitles.length === movieArr.length){
						res.send(movieTitles);
					}
				})
			};
		})
	})
});

```

#### Logging out and Port Listening
you can use the session.destroy to destroy the current session. However to get back to the login page this event send a json object to the main.js file. If the object matches a parameter that function will use the window.location command to render the login.ejs.

```
app.delete('/logout', function(req,res){
	req.session.destroy();

	console.log(req.session);
	res.json("logout");
})
```
Listen for port 3000 on your laptop, but for port 80 before pushing to DO.

```
app.listen(3000);
console.log("we are connected to port 3000");
```

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
Here is the "POST" function. This is the function to create the movie details when a single title is selected. You can console.log "parsed" to see how the data coming back is formatted. All of the createElements / setAttributes / appendChild are all for DOM Manipulation. In this example we are clearing out the HTML from the "page" div (clearData()) and repopulating it with the selected content.

```
function singleMovie(movie){
    
    var url = "movies/single/" + movie;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.addEventListener('load', function(e) {

        var d = xhr.responseText;
        var parsed = JSON.parse(d);
        console.log(parsed);

        clearData();

        var cast = document.createElement('ul');
        var directors = document.createElement('ul');
        var writers = document.createElement('ul');
        var genre = document.createElement('ul');

        var castHead = document.createElement('h3');
        var dirHead = document.createElement('h3');
        var writHead = document.createElement('h3');
        var genreHead = document.createElement('h3');

        castHead.innerHTML = "Cast";
        dirHead.innerHTML = "Directors";
        writHead.innerHTML = "Writers";
        genreHead.innerHTML = "Genre";

        cast.appendChild(castHead);
        directors.appendChild(dirHead);
        writers.appendChild(writHead);
        genre.appendChild(genreHead);

        var title = document.createElement('h3');
        title.innerText = parsed.Title;
        
        var castName = parsed.Actors.split(',');
        var directorName = parsed.Director.split(',');
        var writerName = parsed.Writer.split(',');
        var genreType = parsed.Genre.split(',');

        for (i=0; i<castName.length; i++){
            var li = document.createElement("li");
            li.innerText = castName[i];
            cast.appendChild(li);
        };

        for (i=0; i<directorName.length; i++){
            var li = document.createElement("li");
            li.innerText = directorName[i];
            directors.appendChild(li);
        };

        for (i=0; i<writerName.length; i++){
            var li = document.createElement("li");
            li.innerText = writerName[i];
            writers.appendChild(li);
        };

        for (i=0; i<genreType.length; i++){
            var li = document.createElement("li");
            li.innerText = genreType[i];
            genre.appendChild(li);
        };

        button.setAttribute('id', 'favSave');
        button.innerText = "Save to Favorites!";

        currentMovie = parsed.Title;

        page.appendChild(title);
        page.appendChild(cast);
        page.appendChild(directors);
        page.appendChild(writers);
        page.appendChild(genre);
        page.appendChild(button);
    });
    xhr.send();
};

```

## <a name=do>Digital Ocean Hosting</a>
Shameless plug! Visit my other tutorial on how to host a node app on Digital Ocean. 

* [Launching a Node.js Website on Digital Ocean](https://github.com/Jingo88/Tutorial-Launch_Node.js_Apps_on_Digital_Ocean)

Bonus Shameless plug! Learn to configure your ssh for an easier time logging into your droplet

* [How to Vim / Bash / SSH Config](https://github.com/Jingo88/Tutorial-How_To_VIM_Bash_and_SSHConfig)


## <a name=notes> Personal Notes on Project Process</a>

* **README.md**: I was slightly confused as to directions of how the README was to be presented. So I decided to try and me it a tutorial geared towards web development students.
* **Data.json**: Did not utilize this file. I was filled with the grandiose notion that this web app would be cooler if users were able to create logins and authenticate. I hope I was right. 
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