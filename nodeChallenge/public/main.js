var homenav = document.querySelector('#home');
var findTitle = document.querySelector('#findTitle');
var titleButton = document.querySelector('#titleButton');

homenav.addEventListener('click', function(){
    var url = "/"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.send();
})

titleButton.addEventListener('click', function(){
    var movie = findTitle.value;
    if (movie != ''){
        searchTitle(movie);
    } else {
        alert('Please enter a movie title');
    }
})

function searchTitle(movie){
    var url = encodeURI(movie);
    var xhr = new XMLHttpRequest();

    console.log(url);

    xhr.open("GET", url);

    xhr.addEventListener('load', function(){
        var movieObj = JSON.parse(xhr.responseText);
        console.log(movieObj);
    });

    xhr.send();
};

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
