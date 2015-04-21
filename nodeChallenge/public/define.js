var homenav = document.querySelector('#home');
var findTitle = document.querySelector('#findTitle');
var titleButton = document.querySelector('#titleButton');
var movieList = document.querySelector('#movieList');
var movieDets = document.querySelector('#movieDets');
var multiMovie = document.querySelector('#movieList');
var page = document.querySelector('#page');

function clearData(){
    page.innerHTML = '';
    findTitle = '';
}

homenav.addEventListener('click', function(){
    clearData();

    var landing = document.createElement('h1');
        landing.setAttribute('id', 'landing');
        landing.innerHTML = "Best Movies";

    var sublanding = document.createElement('h3');
        sublanding.setAttribute('id', 'sublanding');
        sublanding.innerHTML = "A site where you can search movies and save them to a favorites list.";

    page.appendChild(landing);
    page.appendChild(sublanding);

});

//search using find button
titleButton.addEventListener('click', function(){
    var movie = findTitle.value;
    if (movie != ''){
        searchTitle(movie);
    } else {
        alert('Please enter a movie title');
    }
});

//search using enter key
findTitle.addEventListener('keyup', function(e){
    if (e.keyCode === 13){
        var movie = findTitle.value;

        if (movie != ''){
            searchTitle(movie);
        } else {
            alert('Please enter a movie title');
        }   
    }
});
