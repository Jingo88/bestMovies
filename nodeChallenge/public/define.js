//This file will hold the query selectors, event listeners, and clear data function
var findTitle = document.querySelector('#findTitle');
var titleButton = document.querySelector('#titleButton');
var multiMovie = document.querySelector('#movieList');
var page = document.querySelector('#page');
var home = document.querySelector('#home');
var button = document.createElement('button');
var userFav = document.querySelector('#favLink');

//use this to store the title of the current SINGLE movie the user is viewing
var currentMovie = '';

//This is a single page app, we will be using a "clearData" function to clean out the html in the "page" div and populate it with the information requested
function clearData(){
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

//Will bring the user back to the splash text
home.addEventListener('click', function(){
//clear the page div
    clearData();

//repopulate the page div
    var landing = document.createElement('h1');
        landing.setAttribute('id', 'landing');
        landing.innerHTML = "Best Movies";

    var sublanding = document.createElement('h3');
        sublanding.setAttribute('id', 'sublanding');
        sublanding.innerHTML = "A site where you can search movies and save them to a favorites list.";

    page.appendChild(landing);
    page.appendChild(sublanding);

});