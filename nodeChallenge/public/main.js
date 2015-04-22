//This is the initial search function
function searchTitle(movie){
    var url = '/movies/' + movie
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.addEventListener('load', function(){
        var movieObj = JSON.parse(xhr.responseText);
        var movies = movieObj.Search;
        console.log(movieObj);
//clear all the html from the "page" div
        clearData();
//if there is more than one movie create a list only showing the titles
        if (movies.length >= 2){
            for (i=0; i<movies.length; i++){
                var li=document.createElement('li');
                li.innerHTML = movies[i].Title;
                li.setAttribute('class', 'multiMovie');
                page.appendChild(li);
            };
//Vanilla JS way of making those titles clickable and returning only the contents of the clicked element
            var multiMovie = document.getElementsByClassName('multiMovie');
            
            var getMovie = function() {
                singleMovie(this.innerText);
                console.log(this.innerText);
            };
//If a title is clicked from the movie list run the getMovie function which will pass the elements text into the singleMovie function
            for(var i=0;i<multiMovie.length;i++){
                multiMovie[i].addEventListener('click', getMovie, false);
            }
//If there is only one movie run the singleMovie function
        } else {
            singleMovie(movie);
        }
    });
    xhr.send();
};

//This function is going to be called upon whenever we are looking for movie details
//If a movie is searched and only one exists
//If a movie is clicked in the searched list
//If a movie is clicked in the favorites list
//This looks like a super long difficult function but half of it is strictly repitition
function singleMovie(movie){
    
    var url = "movies/single/" + movie;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.addEventListener('load', function(e) {

        var d = xhr.responseText;
        var parsed = JSON.parse(d);
//console.log to see how the JSON data is formatted        
        console.log(parsed);

//clear the page div
        clearData();

//create the categories and their headers
        var cast = document.createElement('ul');
        var directors = document.createElement('ul');
        var writers = document.createElement('ul');
        var genre = document.createElement('ul');
        var other = document.createElement('ul');

        var castHead = document.createElement('h3');
        var dirHead = document.createElement('h3');
        var writHead = document.createElement('h3');
        var genreHead = document.createElement('h3');
        var otherHead = document.createElement('h3');

        castHead.innerHTML = "Cast";
        dirHead.innerHTML = "Directors";
        writHead.innerHTML = "Writers";
        genreHead.innerHTML = "Genre";
        otherHead.innerText = "Other Information";

        cast.appendChild(castHead);
        directors.appendChild(dirHead);
        writers.appendChild(writHead);
        genre.appendChild(genreHead);
        other.appendChild(otherHead);

//bringing in the list of movie stuff
        var title = document.createElement('h3');
        title.innerText = parsed.Title;

        var poster = document.createElement('div');

        if (parsed.Poster != "N/A"){
            poster.innerHTML = "<img src='" + parsed.Poster + "'>";
//Really cool trick to center an img tag
            poster.setAttribute('align', 'middle');    
        } else {
            poster.innerHTML = "Sorry there is no poster for this film!";
        }
        
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

        var rating = document.createElement('li');
        rating.innerText = "Rating: " + parsed.Rated;
        var runtime = document.createElement('li');
        runtime.innerText = "Runtime: " + parsed.Runtime;
        var released = document.createElement('li');
        released.innerText = "Released: " + parsed.Released;
        var plot = document.createElement('li');
        plot.innerText = "Plot: " + parsed.Plot;

        other.appendChild(rating);
        other.appendChild(runtime);
        other.appendChild(released);
        other.appendChild(plot);

//Append all of these items to the page div in the order you want them to show
        page.appendChild(poster);
        page.appendChild(title);
        page.appendChild(cast);
        page.appendChild(directors);
        page.appendChild(writers);
        page.appendChild(genre);
        page.appendChild(other);
        page.appendChild(button);
    });
    xhr.send();
};

//This event Listener will add to the favorites list
button.addEventListener('click', function(){
//Remember that current movie title you stored in define.js
//How convenient we can just use that to make the proper call to our server
    var url = '/movies/favAdd/' + currentMovie;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.addEventListener('load', function(){
        var d = xhr.responseText;
        var parsed = JSON.parse(d);
        console.log(parsed);
        alert('This movie has been added to your list. Please click the "Your Favorites" button on the top right to view your current list.')
    });
    xhr.send();
});

//This event listener will show the favorites list
//you can add the class loop from earlier and then call the single movie function when needed
userFav.addEventListener('click', function(){

    var url = '/favList/';
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.addEventListener('load', function(){
        var favList = JSON.parse(xhr.responseText);

        clearData();

        if (favList.length >= 1){
            var h3 = document.createElement('h3');
            h3.innerText = "Your Favorite Movies";
            page.appendChild(h3);

            for(i=0; i<favList.length; i++){
                var li=document.createElement('li');
                li.innerHTML = favList[i];
                li.setAttribute('class', 'favListItem');
                page.appendChild(li);
            }
//Same process as the beginning search function
//Allows the user to click a specific title in the list
//And run the singleMovie function on the selected title
            var favListItem = document.getElementsByClassName('favListItem');

            var myFunction = function() {
                singleMovie(this.innerText);
            };

            for(var j=0;j<favListItem.length;j++){
                favListItem[j].addEventListener('click', myFunction, false);
            }
        } else {
            alert("You have not favorited any movies");
        }
    });
    xhr.send();
});
