// var imgIdUrl = "";
// var textId = "";

// // check if ids are in the cache
// // if they are there {
//   // imgId = "https://random.dog/c5841007-73ab-4794-82e4-48a4763b0aec.jpg" - in cache;
//   // textId = "Don't eat non-snow-coloured snow." - in cache;
// //}


// if (imgIdUrl !== "" && textId !== ""){
//   const pRow = document.getElementById('advice-row');
//   const p = document.createElement('P');
//   p.textContent = textId;
//   p.classList = 'col-11 p-3 quote text-center';
//   pRow.appendChild(p);


//   const img = document.createElement('IMG');
//   const imgRow = document.getElementById('dog-row');
//   img.src = imgIdUrl;
//   img.alt = 'Dog';
//   img.classList = 'col-11 p-0 dog';
//   imgRow.appendChild(img);

// } else {
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

      // add advice to cache
    },
    error: error => console.log(error)
  })

  const dog = $.ajax({
    url: "https://random.dog/woof.json?filter=mp4,webm",
    success: () => {
      console.log(dog)
      const img = document.createElement('IMG');
      const imgRow = document.getElementById('dog-row');
      img.src = dog.responseJSON.url;
      img.alt = 'Dog';
      img.classList = 'col-11 p-0 dog';
      imgRow.appendChild(img);

      // add img url to cache
    },
    error: error => console.log(error)
  })
//}
