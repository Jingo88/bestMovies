document.addEventListener('DOMContentLoaded', function(event){

	var quotes = {
		"Anthony Burgess" : "It's funny how the colors of the real world only seem really real when you watch them on a screen.",
		"Audrey Hepburn" : "Everything I learned I learned from the movies.",
		"Sean Penn" : "When everything gets answered, it\'s fake.",
		"Alfred Hitchcock": "The length of a film should be directly related to the endurance of the human bladder.",
		"Martin Scorsese" : "Cinema is a matter of what's in the frame and what's out",
		"Meryl Streep" : "I have a theory that movies operate on the level of dreams, where you dream yourself.",
		"Roger Ebert" : "It\'s not what a movie is about, it's how it is about it.",
		"Charlie Chaplin" : "All I need to make a comedy is a park, a policeman, and a pretty girl.",
		"Roman Polanski" : "Cinema should make you forget you are sitting in a theater.",
		"Alfred Hitchcock" : "The picture\'s over. Now I have to go and put it on film.",
		"John Fowles" : "I\'m only happy when I forget to exist. When just my eyes or my ears or my skin exist.",
		"Romy Schneider" : "I don't know anything about life, but everything about cinema.",
		"Peter Mullan" : "In terms of popular cinema, \'One Flew Over the Cuckoo\'s Nest\' is as near perfection as I can think of."
	};
	var ppl = Object.keys(quotes);
	var num = ppl.length

	var slider = document.getElementsByClassName('quoteSlider')[0];
	var count = 0;

//////////////////////
//////////////////////			Quote Slider 
//////////////////////
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
		},3000)
	}

	quoteDelay();

//////////////////////
////////////////////// Modal Functionality
//////////////////////
	var loginBtn = document.getElementById('loginBtn');
	var registerBtn = document.getElementById('registerBtn');
	var loginForm = document.getElementById('loginForm');
	var registerForm = document.getElementById('registerForm');
	var close = document.getElementsByClassName('closeNow')

	for (var c = 0; c<2; c++){
		close[c].addEventListener('click', function(){
			closeModal()
		});
	}

	var closeModal = function(){
		console.log("in close modal")
		loginForm.style.display = 'none'
		registerForm.style.display = 'none'
	}

	loginBtn.addEventListener('click', function(){
		updateModal('login')
	})

	registerBtn.addEventListener('click', function(){
		updateModal('register')
	})

	var updateModal = function(userChoice){
		if (userChoice === 'login'){
			if (loginForm.style.display === 'none' || loginForm.style.display === ""){
				loginForm.style.display = 'block';
			} else {
				loginForm.style.display = 'none';
			}
		} else if (userChoice === 'register'){
			if (registerForm.style.display === 'none' || registerForm.style.display === ""){
				registerForm.style.display = 'block';
			} else {
				registerForm.style.display = 'none';
			}			
		}
	}

});