const adviceBtn = document.getElementById('advice-btn');
const jokeBtn = document.getElementById('joke-btn');
const homeBtn = document.getElementById('home-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');
const refreshBtnContainer = document.getElementById('refresh-btn-container');
const dogPageDataKey = 'dogPageData';
let isDog = null;
let refreshBtn = null;
let dogPageLocal = null;

adviceBtn.addEventListener('click', renderDogAdviceOnClick);
homeBtn.addEventListener('click', goToHomePage);
jokeBtn.addEventListener('click', renderFoxJokeOnClick);

function renderDogAdviceOnClick() {
  $.ajax({
    url: "https://api.adviceslip.com/advice",
    success: data => {
      let obj = JSON.parse(data);
      while (obj.slip.advice === dogPageLocal.quoteText) {
        $.ajax({
          url: "https://api.adviceslip.com/advice",
          async: false,
          success: newData => {
            obj = JSON.parse(newData)
          },
          error: newError => console.log(newError)
        })
      }
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
      isDog = true;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })
  hideBtns();
  if (!refreshBtn){
    renderRefreshBtn();
    refreshBtn.title = 'New Dog Advice';
  }
}

function renderFoxJokeOnClick() {
  $.ajax({
    headers: {"Accept": "application/json"},
    url: "https://icanhazdadjoke.com/",
    success: data => {
      const quote = document.createElement('P');
      quote.textContent = data.joke;
      quote.classList = 'col-11 p-3 quote text-center';
      quoteParent.appendChild(quote);

      dogPageLocal.quoteText = quote.textContent;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })

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
      isDog = false;
      localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
    },
    error: error => console.log(error)
  })
  hideBtns();
  if (!refreshBtn) {
    renderRefreshBtn();
    refreshBtn.title = 'New Fox Joke';
  }
}

function renderRefreshBtn() {
  refreshBtn = document.createElement('I');
  refreshBtn.id = 'refresh-btn';
  refreshBtn.className = 'fas fa-sync-alt';
  refreshBtnContainer.appendChild(refreshBtn);
  refreshBtn.addEventListener('click', debounce(newQuoteAndImg, 500));
}

function debounce(fn, delay) {
  let timeout = null;
  return function() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn();
    }, delay);
  }
}

function newQuoteAndImg() {
  const dogImg = document.querySelector('IMG');
  RemoveDogAdvice();
  if (isDog) {
    renderDogAdviceOnClick();
  } else {
    renderFoxJokeOnClick();
  }
}

function removeRefreshBtn() {
  refreshBtnContainer.innerHTML = '';
}

function RemoveDogAdvice() {
  dogParent.innerHTML = '';
  quoteParent.innerHTML = '';
}

function showBtns() {
  document.querySelector('.btn-container').classList.remove('d-none');
}

function hideBtns() {
  document.querySelector('.btn-container').classList.add('d-none');
}

function goToHomePage() {
  RemoveDogAdvice();
  showBtns();
  removeRefreshBtn();
  isDog = null;
  refreshBtn = null;
  localStorage.setItem(dogPageDataKey, '{}');
}

function start() {
  if (!localStorage.getItem(dogPageDataKey)) {
    localStorage.setItem(dogPageDataKey, '{}');
  }
  dogPageLocal = JSON.parse(localStorage.getItem(dogPageDataKey));
  if (dogPageLocal.url !== undefined) {
    hideBtns();
    const dogImg = document.createElement('IMG');
    dogImg.src = dogPageLocal.url;
    dogImg.alt = dogPageLocal.alt;
    dogImg.classList = 'col-11 p-0 dog';
    dogParent.appendChild(dogImg);

    const quote = document.createElement('P');
    quote.textContent = dogPageLocal.quoteText;
    quote.classList = 'col-11 p-3 quote text-center';
    quoteParent.appendChild(quote);
    renderRefreshBtn();
  }
}

start();
