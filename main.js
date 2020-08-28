const adviceBtn = document.getElementById('advice-btn');
const jokeBtn = document.getElementById('joke-btn');
const homeBtn = document.getElementById('home-btn');
const saveBtn = document.getElementById('save-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');
const refreshBtnContainer = document.getElementById('refresh-btn-container');
const saveContainer = document.getElementById('save-container');
const dogPageDataKey = 'dogPageData';
const savedKey = 'saved';
const nextIdKey = 'nextId';
const loadingSpinner = document.querySelector('.spin-container');
const errorMessage = document.querySelector('.error-container');
const btnContainer = document.querySelector('.btn-container');
const quoteSpinner = document.querySelector('.quote-spinner');
let dogPageLocal = null;
let refreshBtn = null;
let savedItemsLocal = null;
let nextIdLocal = null;
let isOnSavedItemsPage = null;
let isOnSavedItemsPageKey = 'isOnSavedItemsPage';

adviceBtn.addEventListener('click', renderDogAdviceOnClick);
homeBtn.addEventListener('click', goToHomePage);
jokeBtn.addEventListener('click', renderFoxJokeOnClick);
saveBtn.addEventListener('click', renderSavedItemsOnClick);

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
        dogImg.classList = 'col-11 p-0 dog col-40';
        dogParent.appendChild(dogImg);

        dogPageLocal.url = dogImg.src;
        dogPageLocal.alt = dogImg.alt;
        dogPageLocal.isDog = true;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
      }
      removeLoadingSpinner();
    },
    error: () => {
      removeImageAndQuote();
      showErrorMessage();
      removeLoadingSpinner();
      resetLocalStorageObj();
    }
  })
}

function renderAdviceQuote() {
  removeQuote();
  showQuoteSpinner();
  $.ajax({
    url: "https://api.adviceslip.com/advice",
    dataType: 'json',
    success: data => {
      if (!isOnHomePage()) {
        if (data.slip.advice === dogPageLocal.quoteText) {
          debounce(renderAdviceQuote(), 2000);
        } else {
          renderQuoteContainer();
          const quote = document.querySelector('P');
          quote.textContent = data.slip.advice;

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
      removeImageAndQuote();
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
        renderQuoteContainer();
        const quote = document.querySelector('P');
        quote.textContent = data.joke;

        dogPageLocal.quoteText = quote.textContent;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
      }
      removeLoadingSpinner();
    },
    error: () => {
      removeImageAndQuote();
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
        dogImg.classList = 'col-11 p-0 dog col-40';
        dogParent.appendChild(dogImg);

        dogPageLocal.url = dogImg.src;
        dogPageLocal.alt = dogImg.alt;
        dogPageLocal.isDog = false;
        localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
      }
      removeLoadingSpinner();
    },
    error: () => {
      removeImageAndQuote();
      showErrorMessage();
      removeLoadingSpinner();
      resetLocalStorageObj();
    }
  })
}

function renderQuoteContainer() {
  const quoteContainer = document.createElement('DIV');
  const quote = document.createElement('P');
  const bookmark = document.createElement('I');
  quoteContainer.classList = 'col-11 p-3 quote col-40 d-flex align-items-center justify-content-center';
  quote.classList = 'col-10 mb-0';
  bookmark.classList = 'col-2 fas fa-bookmark';
  quoteContainer.append(quote, bookmark)
  quoteParent.appendChild(quoteContainer);

  if (!isOnSavedItemsPage) {
    bookmark.addEventListener('click', saveOnClick)
  } else {
    // add bookmark.addEventListener('click', unsaveOnClick)
    return;
  }
  function saveOnClick() {
    bookmark.classList.add('red');
    saveItemToLocalStorage();
    bookmark.removeEventListener('click', saveOnClick);
  }
}

function saveItemToLocalStorage() {
  savedItemsLocal.items[nextIdLocal++] = {
    url: dogPageLocal.url,
    quoteText: dogPageLocal.quoteText,
    alt: dogPageLocal.alt
  }
  localStorage.setItem(savedKey, JSON.stringify(savedItemsLocal));
  localStorage.setItem(nextIdKey, JSON.stringify(nextIdLocal));
}

function renderSavedItemsOnClick() {
  hideBtns();
  showSaveContainer();
  localStorage.setItem(isOnSavedItemsPageKey, true);
  isOnSavedItemsPage = JSON.parse(localStorage.getItem(isOnSavedItemsPageKey));
  if (Object.keys(savedItemsLocal.items).length === 0) {
    const noSavedItems = document.createElement('P');
    noSavedItems.textContent = 'You have nothing saved';
    noSavedItems.classList = 'col-11 p-3 quote col-40 text-center';
    saveContainer.appendChild(noSavedItems);
  } else {
    for (let i = 1; i < Object.keys(savedItemsLocal.items).length + 1; i++) {
      const imageRow = document.createElement('DIV');
      const quoteRow = document.createElement('DIV');
      imageRow.classList = 'col-12 d-flex flex-wrap justify-content-center';
      quoteRow.classList = 'col-12 d-flex flex-wrap justify-content-center';

      const dogImg = document.createElement('IMG');
      dogImg.src = savedItemsLocal.items[i].url;
      dogImg.alt = savedItemsLocal.items[i].alt;
      dogImg.classList = 'col-11 p-0 dog col-40 mb-1';

      const quoteContainer = document.createElement('DIV');
      const quote = document.createElement('P');
      const bookmark = document.createElement('I');
      quoteContainer.classList = 'col-11 p-3 quote col-40 d-flex mb-5 align-items-center justify-content-center';
      quote.classList = 'col-10 mb-0';
      bookmark.classList = 'col-2 fas fa-bookmark red';
      quoteContainer.append(quote, bookmark)
      quote.textContent = savedItemsLocal.items[i].quoteText;

      imageRow.appendChild(dogImg)
      quoteRow.append(quoteContainer);
      saveContainer.append(imageRow, quoteRow);
    }
  }
}

function unsaveItemInLocal() {
  // removes saved dog image and quote from savedItems local storage obj

}

function renderRefreshBtn() {
  refreshBtn = document.createElement('I');
  refreshBtn.id = 'refresh-btn';
  refreshBtn.className = 'fas fa-sync-alt';
  refreshBtnContainer.appendChild(refreshBtn);
  refreshBtn.addEventListener('click', debounce(renderQuoteAndImg, 500));
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

function renderQuoteAndImg() {
  const dogImg = document.querySelector('IMG');
  removeImageAndQuote();
  removeErrorMessage();
  if (dogPageLocal.isDog) {
    renderDogAdviceOnClick();
  } else {
    renderFoxJokeOnClick();
  }
}

function removeRefreshBtn() {
  refreshBtnContainer.innerHTML = '';
}

function removeImageAndQuote() {
  dogParent.innerHTML = '';
  quoteParent.innerHTML = '';
}

function removeQuote() {
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

function isOnDogOrFoxPage() {
  return dogPageLocal.url !== undefined
}

function goToHomePage() {
  removeImageAndQuote();
  removeSaveContainer();
  showBtns();
  removeRefreshBtn();
  removeErrorMessage();
  refreshBtn = null;
  resetLocalStorageObj();
  localStorage.setItem(isOnSavedItemsPageKey, false);
  isOnSavedItemsPage = JSON.parse(localStorage.getItem(isOnSavedItemsPageKey));
}

function showSaveContainer() {
  saveContainer.classList.remove('d-none');
}

function removeSaveContainer() {
  if (!saveContainer.classList.contains('d-none')) {
    saveContainer.classList.add('d-none');
    saveContainer.innerHTML = '';
  }
}

function showLoadingSpinner() {
  loadingSpinner.classList.remove('d-none');
}

function removeLoadingSpinner() {
  loadingSpinner.classList.add('d-none');
}

function showQuoteSpinner() {
  quoteSpinner.classList.remove('d-none');
}

function removeQuoteSpinner() {
  quoteSpinner.classList.add('d-none');
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
    const saved = new Saved();
    localStorage.setItem(savedKey, JSON.stringify(saved));
    localStorage.setItem(nextIdKey, 1)
    localStorage.setItem(isOnSavedItemsPageKey, false)
  }
  dogPageLocal = JSON.parse(localStorage.getItem(dogPageDataKey));
  savedItemsLocal = JSON.parse(localStorage.getItem(savedKey));
  nextIdLocal = JSON.parse(localStorage.getItem(nextIdKey));
  isOnSavedItemsPage = JSON.parse(localStorage.getItem(isOnSavedItemsPageKey));
  if (isOnDogOrFoxPage()) {
    hideBtns();
    const dogImg = document.createElement('IMG');
    dogImg.src = dogPageLocal.url;
    dogImg.alt = dogPageLocal.alt;
    dogImg.classList = 'col-11 p-0 dog col-40';
    dogParent.appendChild(dogImg);

    renderQuoteContainer();
    const quote = document.querySelector('P');
    quote.textContent = dogPageLocal.quoteText;

    renderRefreshBtn();
  } else if (isOnSavedItemsPage) {
  renderSavedItemsOnClick();
  }
}

start();
