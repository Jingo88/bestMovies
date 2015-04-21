//This file will hold the query selectors, event listeners, and clear data function
var homenav = document.querySelector('#home');
var findTitle = document.querySelector('#findTitle');
var titleButton = document.querySelector('#titleButton');
var multiMovie = document.querySelector('#movieList');
var page = document.querySelector('#page');

function clearData(){
    page.innerHTML = '';
    findTitle.value = '';
}

homenav.addEventListener('click', function(){
    var url = "/"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.send();
});

//search using enter key
findTitle.addEventListener('keyup', function(e){
    if (e.keyCode === 13){
        var movie = findTitle.value;
        
        if (movie != ''){
            clearData();
            searchTitle(movie);
        } else {
            alert('Please enter a movie title');
        }   
    }
});