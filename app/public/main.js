document.addEventListener('DOMContentLoaded', function(event){
//////////////////////
//////////////////////          Grab Dom Elements 
//////////////////////
    var findTitle = document.querySelector('#findTitle');
    var multiMovie = document.querySelector('#movieList');
    var page = document.querySelector('#page');
    var home = document.querySelector('#home');
    var button = document.createElement('button');
    var userFav = document.querySelector('#favLink');
    var logout = document.querySelector('#logout');

//////////////////////
//////////////////////          Quote Slider 
//////////////////////
    var ppl = Object.keys(quotes);
    var num = ppl.length

    var sliderWrap = function(){

        var slider = document.getElementsByClassName('quoteSlider')[0];
        var count = 0;

        var person =ppl[Math.floor(Math.random()*num)];
        var current_quote = document.createElement('h4');
        current_quote.innerHTML = '"' + quotes[person] + '"';
        slider.appendChild(current_quote);
        var current_person = document.createElement('h5');
        current_person.innerHTML = "- " + person;
        slider.appendChild(current_person);


        var quoteDelay = function(){
            setTimeout(function(){
                count++;
                if(count<100){
                    slider.innerHTML = "";
                    var person =ppl[Math.floor(Math.random()*num)];
                    var current_quote = document.createElement('h4');
                    current_quote.innerHTML = '"' + quotes[person] + '"';
                    slider.appendChild(current_quote);
                    var current_person = document.createElement('h5');
                    current_person.innerHTML = "- " + person;
                    slider.appendChild(current_person);
                    quoteDelay()
                }
            },2500)
        }
        quoteDelay();
    }

    sliderWrap();

//////////////////////          Home Button Builds Original Page 
//////////////////////          Calls slider wrap function for quotes
//////////////////////          Does not refresh page

    //Will bring the user back to the splash text
    home.addEventListener('click', function(){
    //clear the page div
        clearData();

    //Put up the main page header and quote slider
        var wrap1 = document.createElement('div');
        wrap1.className += 'col';
        wrap1.className += ' s12';
        wrap1.className += ' home';
        var h1 = document.createElement('h1');
        h1.className += 'col';
        h1.className += ' s12';
        h1.className += ' m6';
        h1.className += ' push-m3';
        h1.setAttribute('id', 'landing');
        h1.innerHTML = "Movie Lister"
        wrap1.appendChild(h1)
        page.appendChild(wrap1)

        var wrap2 = document.createElement('div');
        wrap2.className += 'col';
        wrap2.className += ' s12';
        wrap2.className += ' home';
        var newSlider = document.createElement('div');
        newSlider.className += 'quoteSlider'
        var h3 = document.createElement('h1');
        h3.className += 'col';
        h3.className += ' s12';
        h3.className += ' m6';
        h3.className += ' push-m3';
        h3.setAttribute('id', 'sublanding');
        wrap2.appendChild(newSlider);
        wrap2.appendChild(h3);
        page.appendChild(wrap2);

        sliderWrap()
    });


//////////////////////          Click Logout Button
//////////////////////          XHR request to delete route
//////////////////////          back to home route


    logout.addEventListener('click', function(){

        var url = '/logout';
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", url);

        xhr.addEventListener('load', function(){
            var success = JSON.parse(xhr.responseText);
            
            if (success === "logout"){
                window.location = "/";
            }
        })
        xhr.send();
    });


//////////////////////
//////////////////////          Rest of page 
//////////////////////

    //use this to store the title of the current SINGLE movie the user is viewing
    var currentMovie = '';

    //This is a single page app, we will be using a "clearData" function to clean out the html in the "page" div and populate it with the information requested
    var clearData = function(){
        page.innerHTML = '';
        findTitle.value = '';
        currentMovie = '';
    }

    //search using enter key
    findTitle.addEventListener('keyup', function(e){
        if (e.keyCode === 13){
            var movie = findTitle.value;

    //If there is something in the input field run the search function
    //If the input field is empty alert the user
            if (movie != ''){
                searchTitle(movie);
            } else {
                alert('Please enter a movie title');
            };   
        }
    });



    //This is the initial search function
    var searchTitle = function(movie){
        var url = '/movies/' + movie
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.addEventListener('load', function(){
            var movieObj = JSON.parse(xhr.responseText);
            var movies = movieObj.Search;
            var moviesLen = movies.length;
            console.log(movieObj);
    //clear all the html from the "page" div
            clearData();
            // debugger;
    //if there is more than one movie create a list only showing the titles
            if (moviesLen >= 2){

                var ol = document.createElement('ol');
                ol.className += 'col '
                ol.className += 's12 '
                ol.className += 'm6'

                for (var i=0; i<moviesLen; ++i){
                    var wrap = document.createElement('li');
                    var ul = document.createElement('ul');
                    var title = document.createElement('li');
                    title.setAttribute('class', 'multiMovie');
                    title.innerHTML = movies[i].Title;
                    ul.appendChild(title);
                    var year = document.createElement('li');
                    year.innerHTML = movies[i].Year;
                    ul.appendChild(year);
                    wrap.appendChild(ul);
                    ol.appendChild(wrap);
                };
    //Vanilla JS way of making those titles clickable and returning only the contents of the clicked element
                page.appendChild(ol);

                var multiMovie = document.getElementsByClassName('multiMovie');
                var getMovie = function() {
                    singleMovie(this.innerHTML);
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

//////////////////////
//////////////////////          Single Movie Search
//////////////////////

    var singleMovie = function(movie){
        
        var url = "movies/single/" + movie;
        var xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.addEventListener('load', function(e) {

            var d = xhr.responseText;
            var parsed = JSON.parse(d);

    //clear the page div
            clearData();

    //create the categories and their headers
            var cast = document.createElement('ul');
            var directors = document.createElement('ul');
            var writers = document.createElement('ul');
            var genre = document.createElement('ul');
            var other = document.createElement('ul');

            var castHead = document.createElement('h5');
            var dirHead = document.createElement('h5');
            var writHead = document.createElement('h5');
            var genreHead = document.createElement('h5');
            var otherHead = document.createElement('h5');

            castHead.innerHTML = "Cast";
            dirHead.innerHTML = "Directors";
            writHead.innerHTML = "Writers";
            genreHead.innerHTML = "Genre";
            otherHead.innerHTML = "Other Information";

            cast.appendChild(castHead);
            directors.appendChild(dirHead);
            writers.appendChild(writHead);
            genre.appendChild(genreHead);
            other.appendChild(otherHead);

    //bringing in the list of movie stuff
            var title = document.createElement('h3');
            title.innerHTML = parsed.Title;

            var poster = document.createElement('div');

            if (parsed.Poster != "N/A"){
                poster.innerHTML = "<img src='" + parsed.Poster + "'>";
    //Cool trick to center an img tag
                poster.setAttribute('align', 'middle');    
            } else {
                poster.innerHTML = "Sorry there is no poster for this film!";
            }
            
            var castName = parsed.Actors.split(',');
            var directorName = parsed.Director.split(',');
            var writerName = parsed.Writer.split(',');
            var genreType = parsed.Genre.split(',');

            var loopin = function(parent, children){
                for (var i = 0; i<children.length; ++i){
                    var li = document.createElement('li');
                    li.innerHTML = children[i];
                    parent.appendChild(li);
                }
            }

            loopin(cast, castName);
            loopin(directors, directorName);
            loopin(writers, writerName);
            loopin(genre, genreType);

            button.setAttribute('id', 'favSave');
            button.innerHTML = "Save to Favorites!";
            button.className += "waves-effect "
            button.className += "waves-light "
            button.className += "btn"

            currentMovie = parsed.Title;

            var rating = document.createElement('li');
            rating.innerHTML = "Rating: " + parsed.Rated;
            var runtime = document.createElement('li');
            runtime.innerHTML = "Runtime: " + parsed.Runtime;
            var released = document.createElement('li');
            released.innerHTML = "Released: " + parsed.Released;
            var plot = document.createElement('li');
            plot.innerHTML = "Plot: " + parsed.Plot;

            other.appendChild(rating);
            other.appendChild(runtime);
            other.appendChild(released);
            other.appendChild(plot);

    //Append all of these items to the page div in the order you want them to show
            var ol = document.createElement('ol');
            ol.className += 'col '
            ol.className += 's12 '
            ol.className += 'm6'
            
            ol.appendChild(poster);
            ol.appendChild(title);
            ol.appendChild(cast);
            ol.appendChild(directors);
            ol.appendChild(writers);
            ol.appendChild(genre);
            ol.appendChild(other);
            ol.appendChild(button);

            page.appendChild(ol)
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
            alert('This movie has been added to your favorites list.')
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
            var favLen = favList.length;

            clearData();

            if (favList !== []){
                var wrap = document.createElement('div');
                wrap.className += "col "
                wrap.className += "s12 "
                wrap.className += "m6 "
                var ol = document.createElement('ol');

                var h3 = document.createElement('h3');
                h3.innerHTML = "Your Favorite Movies";
                wrap.appendChild(h3);

                for(i=0; i<favList.length; i++){
                    var li=document.createElement('li');
                    li.innerHTML = favList[i];
                    li.setAttribute('class', 'favListItem');
                    ol.appendChild(li);
                }
                wrap.appendChild(ol);
                page.appendChild(wrap);
    //Same process as the beginning search function
    //Allows the user to click a specific title in the list
    //And run the singleMovie function on the selected title
                var favListItem = document.getElementsByClassName('favListItem');

                var myFunction = function() {
                    singleMovie(this.innerHTML);
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
});