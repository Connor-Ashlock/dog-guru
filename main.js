const adviceBtn = document.getElementById('advice-btn');
const insultBtn = document.getElementById('insult-btn');
const homeBtn = document.getElementById('home-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');
const dogBtnContainer = document.getElementById('quote-btn-container');
const dogPageDataKey = 'dogPageData';
let dogBtn = null;
let dogPageLocal = localStorage.getItem(dogPageDataKey);
dogPageLocal = JSON.parse(dogPageLocal)

adviceBtn.addEventListener('click', renderDogAdviceOnClick);
homeBtn.addEventListener('click', goToHomePage);
insultBtn.addEventListener('click', renderFoxInsultOnClick);

function renderDogAdviceOnClick() {
  $.ajax({
    url: "https://api.adviceslip.com/advice",
    success: data => {
      const obj = JSON.parse(data);
      const quote = document.createElement('P');
      quote.textContent = obj.slip.advice;
      quote.classList = 'col-11 p-3 quote text-center';
      quoteParent.appendChild(quote);
      dogPageLocal.quoteText = quote.textContent;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })

  $.ajax({
    url: "https://random.dog/woof.json?filter=mp4,webm",
    success: data => {
      const dogImg = document.createElement('IMG');
      dogImg.src = data.url;
      dogImg.alt = 'Dog';
      dogImg.classList = 'col-11 p-0 dog';
      dogParent.appendChild(dogImg);

      dogPageLocal.url = dogImg.src;
      dogPageLocal.alt = dogImg.alt;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })
  hideBtns();
  if (!dogBtn){
    renderDogIcon();
    dogBtn.title = 'New Dog Advice';
  }
}

function renderFoxInsultOnClick() {
  // $.ajax({
  //   // headers: {"Content-Type": "application/json"},
  //   url: "https://api.fungenerators.com/taunt/generate?category=pirate-insult&limit=5",
  //   success: data => {
  //     console.log(data)
  //     // const response = JSON.parse(advice.responseText);
  //     // const quote = document.createElement('P');
  //     // quote.textContent = (response.slip.advice);
  //     // quote.classList = 'col-11 p-3 quote text-center';
  //     // quoteParent.appendChild(quote);
  //   },
  //   error: error => console.log(error)
  // })

  $.ajax({
    url: "https://randomfox.ca/floof/",
    success: data => {
      const dogImg = document.createElement('IMG');
      dogImg.src = data.image;
      dogImg.alt = 'Fox';
      dogImg.classList = 'col-11 p-0 dog';
      dogParent.appendChild(dogImg);

      dogPageLocal.url = dogImg.src;
      dogPageLocal.alt = dogImg.alt;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })
  hideBtns();
  if (!dogBtn) {
    renderDogIcon();
    dogBtn.title = 'New Fox Insult';
  }
}

function newQuoteAndImg () {
  const dogImg = document.querySelector('IMG');
  if (dogImg.alt === 'Dog') {
    RemoveDogAdvice();
    renderDogAdviceOnClick();
  } else {
    RemoveDogAdvice();
    renderFoxInsultOnClick();
  }
}

function renderDogIcon() {
  dogBtn = document.createElement('I');
  dogBtn.id = 'new-quote-btn';
  dogBtn.className = 'fas fa-dog';
  dogBtnContainer.appendChild(dogBtn);
  dogBtn.addEventListener('click', newQuoteAndImg);
}

function removeDogIcon() {
  dogBtnContainer.innerHTML = '';
}

function RemoveDogAdvice() {
  dogParent.innerHTML = '';
  quoteParent.innerHTML = '';
}

function showBtns() {
  adviceBtn.parentElement.classList.remove('d-none');
  insultBtn.parentElement.classList.remove('d-none');
}

function hideBtns() {
  adviceBtn.parentElement.classList.add('d-none');
  insultBtn.parentElement.classList.add('d-none');
}

function goToHomePage() {
  RemoveDogAdvice();
  showBtns();
  removeDogIcon();
  dogBtn = null;
  localStorage.setItem(dogPageDataKey, '{}');
}

function localStorageFunc() {
  if (dogPageLocal.url !== undefined) {
    hideBtns();
    if (dogPageLocal.alt === 'Dog' || dogPageLocal.alt === 'Fox') {
      const dogImg = document.createElement('IMG');
      dogImg.src = dogPageLocal.url;
      dogImg.alt = dogPageLocal.alt;
      dogImg.classList = 'col-11 p-0 dog';
      dogParent.appendChild(dogImg);

      const quote = document.createElement('P');
      quote.textContent = dogPageLocal.quoteText;
      quote.classList = 'col-11 p-3 quote text-center';
      quoteParent.appendChild(quote);
    }
    renderDogIcon();
  }
}

localStorageFunc();
