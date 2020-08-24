const adviceBtn = document.getElementById('advice-btn');
const jokeBtn = document.getElementById('joke-btn');
const homeBtn = document.getElementById('home-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');
const refreshBtnContainer = document.getElementById('refresh-btn-container');
const dogPageDataKey = 'dogPageData';
const loadingSpinner = document.querySelector('.spin-container');
const errorMessage = document.querySelector('.error-container');
const btnContainer = document.querySelector('.btn-container');
const quoteSpinner = document.querySelector('.quote-spinner');
let refreshBtn = null;
let dogPageLocal = null;

adviceBtn.addEventListener('click', renderDogAdviceOnClick);
homeBtn.addEventListener('click', goToHomePage);
jokeBtn.addEventListener('click', renderFoxJokeOnClick);

function renderDogAdviceOnClick() {
  showLoadingSpinner();
  hideBtns();
  if (!refreshBtn) {
    renderRefreshBtn();
    refreshBtn.title = 'New Dog Advice';
  }
  renderDogImage();
  renderAdviceQuote();
}

function renderDogImage() {
  $.ajax({
    url: "https://random.dog/woof.json?filter=mp4,webm",
    success: data => {
      if (!isOnHomePage()) {
        const dogImg = document.createElement('IMG');
        dogImg.src = data.url;
        dogImg.alt = 'Dog';
        dogImg.classList = 'col-11 p-0 dog col-70';
        dogParent.appendChild(dogImg);

        dogPageLocal.url = dogImg.src;
        dogPageLocal.alt = dogImg.alt;
        dogPageLocal.isDog = true;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
      }
      removeLoadingSpinner();
    },
    error: () => {
      showErrorMessage();
      removeLoadingSpinner();
      resetLocalStorageObj();
    }
  })
}

function renderAdviceQuote() {
  removeAdvice();
  showQuoteSpinner();
  $.ajax({
    url: "https://api.adviceslip.com/advice",
    dataType: 'json',
    success: data => {
      if (!isOnHomePage()) {
        if (data.slip.advice === dogPageLocal.quoteText) {
          debounce(renderAdviceQuote(), 2000);
        } else {
          const quote = document.createElement('P');
          quote.textContent = data.slip.advice;
          quote.classList = 'col-11 p-3 quote text-center col-70';
          quoteParent.appendChild(quote);

          dogPageLocal.quoteText = quote.textContent;
          localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
          removeLoadingSpinner();
          removeQuoteSpinner();
        }
      } else {
        removeLoadingSpinner();
        removeQuoteSpinner();
      }
    },
    error: () => {
      showErrorMessage();
      removeLoadingSpinner();
      removeQuoteSpinner();
      resetLocalStorageObj();
    }
  })
}

function renderFoxJokeOnClick() {
  showLoadingSpinner();
  hideBtns();
  if (!refreshBtn) {
    renderRefreshBtn();
    refreshBtn.title = 'New Fox Joke';
  }
  $.ajax({
    headers: {"Accept": "application/json"},
    url: "https://icanhazdadjoke.com/",
    success: data => {
      if (!isOnHomePage()) {
        const quote = document.createElement('P');
        quote.textContent = data.joke;
        quote.classList = 'col-11 p-3 quote text-center col-70';
        quoteParent.appendChild(quote);

        dogPageLocal.quoteText = quote.textContent;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
        removeLoadingSpinner();
      }
      removeLoadingSpinner();
    },
    error: () => {
      showErrorMessage();
      removeLoadingSpinner();
      resetLocalStorageObj();
    }
  })

  $.ajax({
    url: "https://randomfox.ca/floof/",
    success: data => {
      if (!isOnHomePage()) {
        const dogImg = document.createElement('IMG');
        dogImg.src = data.image;
        dogImg.alt = 'Fox';
        dogImg.classList = 'col-11 p-0 dog col-70';
        dogParent.appendChild(dogImg);

        dogPageLocal.url = dogImg.src;
        dogPageLocal.alt = dogImg.alt;
        dogPageLocal.isDog = false;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
        removeLoadingSpinner();
      }
      removeLoadingSpinner();
    },
    error: () => {
      showErrorMessage();
      removeLoadingSpinner();
      resetLocalStorageObj();
    }
  })
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
  removeDogAdvice();
  if (dogPageLocal.isDog) {
    renderDogAdviceOnClick();
  } else {
    renderFoxJokeOnClick();
  }
}

function removeRefreshBtn() {
  refreshBtnContainer.innerHTML = '';
}

function removeDogAdvice() {
  dogParent.innerHTML = '';
  quoteParent.innerHTML = '';
}

function removeAdvice() {
  quoteParent.innerHTML = '';
}

function showBtns() {
  btnContainer.classList.remove('d-none');
}

function hideBtns() {
  btnContainer.classList.add('d-none');
}

function isOnHomePage() {
  if (btnContainer.classList.contains('d-none')) {
    return false;
  } else {
    return true;
  }
}

function goToHomePage() {
  removeDogAdvice();
  showBtns();
  removeRefreshBtn();
  removeErrorMessage();
  refreshBtn = null;
  resetLocalStorageObj();
}

function showLoadingSpinner() {
  loadingSpinner.classList.remove('d-none');
}

function removeLoadingSpinner() {
  loadingSpinner.classList.add('d-none');
  console.log('hide quote spin')
}

function showQuoteSpinner() {
  console.log('show quote spin')
  quoteSpinner.classList.remove('d-none');
  console.log(quoteSpinner)
}

function removeQuoteSpinner() {
  quoteSpinner.classList.add('d-none');
  console.log(quoteSpinner)
}

function showErrorMessage() {
  errorMessage.classList.remove('d-none');
}

function removeErrorMessage() {
  if (!errorMessage.classList.contains('d-none')) {
    errorMessage.classList.add('d-none');
  }
}

function resetLocalStorageObj() {
  localStorage.setItem(dogPageDataKey, '{}')
}

function start() {
  if (!localStorage.getItem(dogPageDataKey)) {
    resetLocalStorageObj();
  }
  dogPageLocal = JSON.parse(localStorage.getItem(dogPageDataKey));
  if (dogPageLocal.url !== undefined) {
    hideBtns();
    const dogImg = document.createElement('IMG');
    dogImg.src = dogPageLocal.url;
    dogImg.alt = dogPageLocal.alt;
    dogImg.classList = 'col-11 p-0 dog col-70';
    dogParent.appendChild(dogImg);

    const quote = document.createElement('P');
    quote.textContent = dogPageLocal.quoteText;
    quote.classList = 'col-11 p-3 quote text-center col-70';
    quoteParent.appendChild(quote);
    renderRefreshBtn();
  }
}

start();
