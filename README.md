#Movie Lister

Take a look at the site live [here](jasonng.nyc:5002)

**Movie Lister** Is a movie search engine web application. Users have the ability to create a login username and password. Once they are logged in they can search for movies by title, and save the movies they enjoyed to a "favorites" list. 

The application utilizing data from the OMDB api. Users can create login information and authentication is done through Bcrypt. Once logged in users make HTTP requests to the server, and can save their favorite movies. Their login information and movies saved are persisted in a SQL database. 

Want to give it a shot? Let's clone the repo

```
git clone https://github.com/Jingo88/bestMovies.git
```
* If you don't have sqlite3 installed yet go ahead an run the installation on your respective OS. 

```
apt-get install sqlite3

OR 

brew install sqlite3
```
* Now lets go ahead and install the dependencies from the package.json file. 

```
npm install
```
* Before we start our servers we have to make a new database. Go ahead and run the schema to make a new database.

```
sqlite3 bestMovies.db < schema.sql
```
* Great now lets go into the server file and change the port our server is listening to to port 3000 and run our server from the terminal

```
node server.js
```
* Last step, visit your `localhost:3000` and enjoy browsing through you favorite movies. 

### The technologies in use.

* JavaScript 
* Node.js
* Express.js
* CSS
* HTML
* SQLite3
* Bcrypt
