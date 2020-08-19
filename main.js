const dogBtn = document.getElementById('dog-btn');
const homeBtn = document.getElementById('home-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');

dogBtn.addEventListener('click', renderDogAdvice);
homeBtn.addEventListener('click', RemoveDogAdvice)

function renderDogAdvice() {
  const advice = $.ajax({
    url: "https://api.adviceslip.com/advice",
    success: () => {
      console.log(advice)
      const response = JSON.parse(advice.responseText);
      const quote = document.createElement('P');
      quote.textContent = (response.slip.advice);
      quote.classList = 'col-11 p-3 quote text-center';
      quoteParent.appendChild(quote);
    },
    error: error => console.log(error)
  })

  const dog = $.ajax({
    url: "https://random.dog/woof.json?filter=mp4,webm",
    success: () => {
      console.log(dog)
      const dogImg = document.createElement('IMG');
      dogImg.src = dog.responseJSON.url;
      dogImg.alt = 'Dog';
      dogImg.classList = 'col-11 p-0 dog';
      dogParent.appendChild(dogImg);
    },
    error: error => console.log(error)
  })
  hideDogBtn()
}

function RemoveDogAdvice() {
  dogParent.innerHTML = '';
  quoteParent.innerHTML = '';
  showDogBtn();
}

function showDogBtn() {
  dogBtn.parentElement.classList.remove('d-none');
}

function hideDogBtn() {
  dogBtn.parentElement.classList.add('d-none');
}
