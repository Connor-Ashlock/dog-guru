const advice = $.ajax({
  url: "https://api.adviceslip.com/advice",
  success: () => {
    console.log(advice)
    const response = JSON.parse(advice.responseText);
    const pRow = document.getElementById('advice-row');
    const p = document.createElement('P');
    p.textContent = (response.slip.advice);
    p.classList = 'col-11 p-3 quote text-center';
    pRow.appendChild(p);
  },
  error: error => console.log(error)
})

const dog = $.ajax({
  url: "https://random.dog/woof.json",
  success: () => {
    console.log(dog)
    const img = document.createElement('IMG');
    const imgRow = document.getElementById('dog-row');
    img.src = dog.responseJSON.url;
    img.alt = 'Dog';
    img.classList = 'col-11 p-0 dog';
    imgRow.appendChild(img);
  },
  error: error => console.log(error)
})
