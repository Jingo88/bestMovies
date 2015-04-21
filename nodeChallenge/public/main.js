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
        console.log(movieObj);

        if (movieObj.total >= 2){
            for (i=0; i<movieObj.total; i++){
                var li=document.createElement('li');
                // li.innerHTML = "<a href=''>" + movieObj.movies[i].title + "</a>";
                li.innerHTML = movieObj.movies[i].title;
                li.setAttribute('class', 'multiMovie');
                movieList.appendChild(li);
            };
        } else {
                    var d = xhr.responseText;
        var parsed = JSON.parse(d);
        var cast = document.createElement('ul');
        var directors = document.createElement('ul');
        var writers = document.createElement('ul');
        var genre = document.createElement('ul');

        //bringing in the list of movie stuff
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

        // cover.innerHTML = "<img src='" + parsedPoster + "'>"
        title.innerText = parsed.Title;


        movieDets.appendChild(title);
        movieDets.appendChild(cast);
        movieDets.appendChild(directors);
        movieDets.appendChild(writers);
        movieInfo.appendChild(genre);
        console.log(parsed);
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
