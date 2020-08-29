const adviceBtn = document.getElementById('advice-btn');
const jokeBtn = document.getElementById('joke-btn');
const homeBtn = document.getElementById('home-btn');
const saveBtn = document.getElementById('save-btn');
const dogParent = document.getElementById('dog-row');
const quoteParent = document.getElementById('advice-row');
const refreshBtnContainer = document.getElementById('refresh-btn-container');
const saveContainer = document.getElementById('save-container');
const loadingSpinner = document.querySelector('.spin-container');
const errorMessage = document.querySelector('.error-container');
const btnContainer = document.querySelector('.btn-container');
const quoteSpinner = document.querySelector('.quote-spinner');
const dogPageDataKey = 'dogPageData';
const savedKey = 'saved';
const nextIdKey = 'nextId';
const isBookmarkedKey = 'isBookmarked';
const lastClickedKey = 'lastClicked';
let isOnSavedItemsPageKey = 'isOnSavedItemsPage';
let dogPageLocal = null;
let refreshBtn = null;
let savedItemsLocal = null;
let nextIdLocal = null;
let isOnSavedItemsPage = null;
let isBookmarked = null;
let lastClicked = {};


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
          if (isBookmarked) {
            return;
          } else {
            localStorage.setItem(isBookmarkedKey, false);
            isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
          }
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
        if (isBookmarked) {
          return;
        } else {
          localStorage.setItem(isBookmarkedKey, false);
          isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
        }
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

  const saveOnClickCallback = () => saveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback);
  const unsaveOnClickCallback = () => unsaveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback);

  if (!isBookmarked) {
    bookmark.addEventListener('click', saveOnClickCallback);
  } else {
    bookmark.addEventListener('click', unsaveOnClickCallback);
    bookmark.classList.add('red');
  }
}

function saveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback) {
  if (isOnSavedItemsPage) {
    const previousText = event.target.previousSibling.textContent;
    const previousUrl = event.target.parentElement.parentElement.previousSibling.firstElementChild.src;
    const previousAlt = event.target.parentElement.parentElement.previousSibling.firstElementChild.alt;
    setLastClickedItem(previousUrl, previousText, previousAlt);
  } else {
    setLastClickedItem(dogPageLocal.url, dogPageLocal.quoteText, dogPageLocal.alt, nextIdLocal);
  }
  bookmark.classList.add('red');
  quoteContainer.setAttribute('data-id', nextIdLocal);
  saveItemToLocalStorage();
  bookmark.removeEventListener('click', saveOnClickCallback);
  bookmark.addEventListener('click', unsaveOnClickCallback);
}

function saveItemToLocalStorage() {
  if (isOnSavedItemsPage) {
    savedItemsLocal.items[nextIdLocal] = {
      url: lastClicked.url,
      quoteText: lastClicked.quoteText,
      alt: lastClicked.alt,
    }
  } else {
    savedItemsLocal.items[nextIdLocal] = {
      url: dogPageLocal.url,
      quoteText: dogPageLocal.quoteText,
      alt: dogPageLocal.alt,
    }
  }
  savedItemsLocal.items[nextIdLocal].id = nextIdLocal++
  localStorage.setItem(savedKey, JSON.stringify(savedItemsLocal));
  localStorage.setItem(nextIdKey, JSON.stringify(nextIdLocal));
  localStorage.setItem(isBookmarkedKey, true);
  isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
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
    for (const prop in savedItemsLocal.items) {
      const imageRow = document.createElement('DIV');
      const quoteRow = document.createElement('DIV');
      imageRow.classList = 'col-12 d-flex flex-wrap justify-content-center';
      quoteRow.classList = 'col-12 d-flex flex-wrap justify-content-center';

      const dogImg = document.createElement('IMG');
      dogImg.src = savedItemsLocal.items[prop].url;
      dogImg.alt = savedItemsLocal.items[prop].alt;
      dogImg.classList = 'col-11 p-0 dog col-40 mb-1';

      const quoteContainer = document.createElement('DIV');
      const quote = document.createElement('P');
      const bookmark = document.createElement('I');
      quoteContainer.classList = 'col-11 p-3 quote col-40 d-flex mb-5 align-items-center justify-content-center';
      quote.classList = 'col-10 mb-0';
      bookmark.classList = 'col-2 fas fa-bookmark red';
      quoteContainer.append(quote, bookmark)
      quote.textContent = savedItemsLocal.items[prop].quoteText;

      quoteContainer.setAttribute('data-id', savedItemsLocal.items[prop].id);
      imageRow.appendChild(dogImg);
      quoteRow.append(quoteContainer);
      saveContainer.append(imageRow, quoteRow);

      const saveOnClickCallback = () => saveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback);
      const unsaveOnClickCallback = () => unsaveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback);
      bookmark.addEventListener('click', unsaveOnClickCallback);
    }
  }
}

function unsaveItemInLocal(id) {
  localStorage.setItem(isBookmarkedKey, false);
  isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
  delete savedItemsLocal.items[id];
  localStorage.setItem(savedKey, JSON.stringify(savedItemsLocal));
}

function unsaveOnClick(bookmark, quoteContainer, saveOnClickCallback, unsaveOnClickCallback) {
  const id = quoteContainer.getAttribute('data-id') || JSON.parse(localStorage.getItem(lastClickedKey)).id;
  setLastClickedItem(savedItemsLocal.items[id].url, savedItemsLocal.items[id].quoteText, savedItemsLocal.items[id].alt, id);
  unsaveItemInLocal(id);
  quoteContainer.removeAttribute('data-id');
  bookmark.classList.remove('red');
  bookmark.removeEventListener('click', unsaveOnClickCallback);
  bookmark.addEventListener('click', saveOnClickCallback);
}

function setLastClickedItem(previousUrl, previousText, previousAlt, previousId) {
  lastClicked = {
    url: previousUrl,
    quoteText: previousText,
    alt: previousAlt,
    id: previousId
  }
  localStorage.setItem(lastClickedKey, JSON.stringify(lastClicked));
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
  localStorage.setItem(isBookmarkedKey, false);
  isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
  localStorage.setItem(dogPageDataKey, JSON.stringify(dogPageLocal));
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
  localStorage.setItem(isBookmarkedKey, false);
  isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));
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
    localStorage.setItem(nextIdKey, 1);
    localStorage.setItem(isOnSavedItemsPageKey, false);
    localStorage.setItem(isBookmarkedKey, false);
  }
  dogPageLocal = JSON.parse(localStorage.getItem(dogPageDataKey));
  savedItemsLocal = JSON.parse(localStorage.getItem(savedKey));
  nextIdLocal = JSON.parse(localStorage.getItem(nextIdKey));
  isOnSavedItemsPage = JSON.parse(localStorage.getItem(isOnSavedItemsPageKey));
  isBookmarked = JSON.parse(localStorage.getItem(isBookmarkedKey));

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
