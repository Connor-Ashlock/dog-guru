const advice = $.ajax({
  url: "https://api.adviceslip.com/advice",
  success: data => console.log(advice)
})

const dog = $.ajax({
  url: "https://random.dog/woof.json",
  success: data => console.log(dog)
})

// function createImg() {

// }
