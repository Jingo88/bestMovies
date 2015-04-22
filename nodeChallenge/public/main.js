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
            
            var myFunction = function() {
                singleMovie(this.innerText);
                console.log(this.innerText);
            };

            for(var i=0;i<multiMovie.length;i++){
                multiMovie[i].addEventListener('click', myFunction, false);
            }

        } else {
            singleMovie(movie);
        }

    });
    xhr.send();
};

function singleMovie(movie){
    
    var url = "movies/single/" + movie;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.addEventListener('load', function(e) {

        var d = xhr.responseText;
        var parsed = JSON.parse(d);
        console.log(parsed);

        clearData();
        //create the categories and their headers
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

        //bringing in the list of movie stuff
        var title = document.createElement('h3');
        title.innerText = parsed.Title;

        var poster = document.createElement('div');

        if (parsed.Poster != "N/A"){
            poster.innerHTML = "<img src='" + parsed.Poster + "'>"    
        } else {
            poster.innerHTML = "Sorry there is no poster for this film"
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

        page.appendChild(title);
        page.appendChild(poster);
        page.appendChild(cast);
        page.appendChild(directors);
        page.appendChild(writers);
        page.appendChild(genre);
        page.appendChild(button);
    });
    xhr.send();
};

//This event Listener will add to the favorites list
button.addEventListener('click', function(){
    console.log("The Current Movie is " + currentMovie);
    var url = '/movies/favAdd/' + currentMovie;
    console.log("The url for adding in main.js is " + url );


    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.addEventListener('load', function(){
        var d = xhr.responseText;
        var parsed = JSON.parse(d);
        console.log(parsed);
        console.log("We are now attempting to add to the favorites table");
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
