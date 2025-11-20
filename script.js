// your backend API endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbwcHirjf_M06loW-6MhqJiFRxLfA_JkY12E_VWAu6fHO7JR0qZ3VdsAgjvMDOgNTYD8/exec";

// generate anonymous session ID
const session_id = "sess-" + Math.random().toString(36).substring(2, 10);

// your image list
const images = [
  "BCS.jpg",
  "BrBa.jpg",
  "friends.jpg",
  "GOT.jpg",
  "HIMYM.jpg",
  "PB.jpg",
  "ST.jpg",
  "suits.jpg",
  "YS.jpg"
];

let index = 0;

// load first image
document.getElementById("image").src = "images/" + images[index];

function rate(num) {

  const imgName = images[index];

  // send rating to backend
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      session_id: session_id,
      image_id: imgName,
      rating: num
    })
  });

  // move to next image
  index++;

  if (index >= images.length) {
    document.body.innerHTML = `
      <h1>All Done!</h1>
      <p>Thanks for rating 🙌</p>
    `;
  } else {
    document.getElementById("image").src = "images/" + images[index];
  }
}
