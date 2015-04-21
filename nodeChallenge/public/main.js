var homenav = document.querySelector('#home');
var findTitle = document.querySelector('#findTitle');
var titleButton = document.querySelector('#titleButton');
var movieList = document.querySelector('#movieList');
var movieDets = document.querySelector('#movieDets');
var multiMovie = document.querySelector('#movieList');


homenav.addEventListener('click', function(){
    var url = "/"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.send();
});

titleButton.addEventListener('click', function(){
    var movie = findTitle.value;
    if (movie != ''){
        searchTitle(movie);
    } else {
        alert('Please enter a movie title');
    }
});

function searchTitle(movie){
    var url = '/movies/' + movie
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.addEventListener('load', function(){
        var movieObj = JSON.parse(xhr.responseText);
        var movies = movieObj.movies;
        console.log(movieObj);

        if (movies.length >= 2){
            for (i=0; i<movies.length; i++){
                var li=document.createElement('li');
                // li.innerHTML = "<a href=''>" + movieObj.movies[i].title + "</a>";
                li.innerHTML = movies[i].title;
                li.setAttribute('class', 'multiMovie');
                movieList.appendChild(li);
            };
        } else {
            singleMovie(movie);
        }

    });
    xhr.send();
};


multiMovie.addEventListener('click', function(){
    console.log(this);
});

// var myFunction = function() {
//     var attribute = this.getAttribute("data-myattribute");
//     console.log(this);
// };

// for(var i=0;i<multiMovie.length;i++){
//     multiMovie[i].addEventListener('click', myFunction, false);
// }

function singleMovie(movie){
    
    var url = "movies/single/" + movie;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url);

    xhr.addEventListener('load', function(e) {

        var d = xhr.responseText;
        var parsed = JSON.parse(d);
        console.log(parsed);


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
        poster.innerHTML = "<img src='" + parsed.Poster + "'>"

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



        movieDets.appendChild(title);
        movieDets.appendChild(poster);
        movieDets.appendChild(cast);
        movieDets.appendChild(directors);
        movieDets.appendChild(writers);
        movieDets.appendChild(genre);
    })
    xhr.send();
}


// function allBills(bioID) {
//     var urlB = "/bills/" + bioID;
//     var xhr = new XMLHttpRequest();
//     console.log(urlB);
//     xhr.open("GET", urlB);
//     xhr.addEventListener('load', function(){
//     	var billObj = JSON.parse(xhr.responseText);
//         var billResults = billObj.results;
//         console.log("WE ARE IN THE EVENT LISTENER");

//         console.log(billResults);
//         for (var i = 0; i < billObj.results.length; i++) {

//             var official_title = billResults[i].official_title;
//             var billLink = billResults[i].urls.congress;
//             var billURL = "<a href=" + billLink + " target='_blank'>" + billLink + "</a>";
//             var billactive = billResults[i].history.active;
//             //make a var bill link array and have that loop through the urls. It can then push all the 
//             //urls (url[j] etc etc) into an array and at the end push that array into the newBill hash
//             if (billactive === true){
//                 var billactiveDate = billResults[i].history.active_at;
//             } else {
//                 var billactiveDate = 'This bill is not active';
//             }
            
//             newBill = new currentBills(official_title,billURL, billactive, billactiveDate);
//     		billsArr.push(newBill);
//     	};

//         for (l=0; l<billsArr.length; l++){
//             var billsUL = document.createElement('ul');
//             billsUL.setAttribute('class', 'wholeBill');

//             var keys = Object.keys(billsArr[l]);
//             console.log("These are the bills keys" + keys);

//             for (k=0; k<keys.length; k++){
//                 var values = keys[k];
                    
//                 var newKey = values.replace(/[_]/g, " ");

//                 var li = document.createElement('li');
                
//                 li.setAttribute('class', 'billInfo');
//                 li.innerHTML = newKey + ": " + billsArr[l][values];

//                 billsUL.appendChild(li);
//             }
//             var billNum = document.createElement('h4');
//             billNum.innerText = "Bill: " + billCounter;
//             billsInfo.appendChild(billNum);
//             billsInfo.appendChild(billsUL);
//             infoBox.appendChild(billsInfo);
//             page.appendChild(infoBox);
//             billCounter++;
//         }
//     });

//     xhr.send();
// };
