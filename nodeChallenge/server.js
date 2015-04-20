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

app.use(session({
  secret: "string",
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req,res){
	res.render('login.ejs', {});
});


app.post('/user', function(req,res){
	var username = req.body.newName;
	var password = req.body.newPassword;
	console.log(username);
	console.log(password);

	if (req.body.newPassword === req.body.confirmPass){
		var hash = bcrypt.hashSync(password, 8);
		// Now the password is the hash you have created
		db.run('INSERT INTO users(username, password) VALUES (?, ?)', username, hash, function(err){
			if(err) { throw err;}

		});
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});

app.post('/session', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	console.log("your username is " + username);
	console.log("your password is " + password);
	console.log("you are now in session post");

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

app.get('/movies', function(req,res){
	if (req.session.valid_user === true){
		res.render('index.ejs', {});
	} else {
		res.redirect('/');
	} 
});

// app.get('/', function(req, res){
//   res.render('index.ejs', {});
// });

// app.get('/:title', function(req, res){
//   var title = req.params.title;

//   var omdburl = "http://www.omdbapi.com/?t=" + title;

//   request(omdburl, function(error, response, body){
//     if (!error && response.statusCode == 200){
//       res.send(body);
//     }
//   })
//   console.log(omdburl);
// })


// app.use(express.static(path.join(__dirname, '/public')));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use('/', express.static(path.join(__dirname, 'public'));

// app.get('/favorites', function(req, res){
//   var data = fs.readFileSync('./data.json');
//   res.setHeader('Content-Type', 'application/json');
//   res.send(data);
// ;

// app.get('favorites', function(req, res){
//   if(!req.body.name || !req.body.oid){
//     res.send("Error");
//     return
  
//   var data = JSON.parse(fs.readFileSync('./data.json'));
//   data.push(req.body);
//   fs.writeFile('./data.json', JSON.stringify(data));
//   res.setHeader('Content-Type', 'application/json');
//   res.send(data);
// });

//tells you if you are connected, shows up in terminal
app.listen(3000)
console.log("we are connected to port 3000")