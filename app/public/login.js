document.addEventListener('DOMContentLoaded', function(event){
//////////////////////
//////////////////////			Quote Slider 
//////////////////////
	var ppl = Object.keys(quotes);
	var num = ppl.length

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