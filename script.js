const API_URL =
  "https://script.google.com/macros/s/AKfycbwcHirjf_M06loW-6MhqJiFRxLfA_JkY12E_VWAu6fHO7JR0qZ3VdsAgjvMDOgNTYD8/exec";

const sessionId = "sess-" + Math.random().toString(36).substring(2, 10);

// 23 images auto from img1.jpg → img23.jpg
const images = Array.from({ length: 23 }, (_, i) => `img${i + 1}.jpg`);

let index = 0;

const imgEl = document.getElementById("survey-image");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");

loadImage();

function loadImage() {
  imgEl.src = `https://raw.githubusercontent.com/pradeechowdary/Rating-Images/main/images/${images[index]}`;
  progress.innerText = `Image ${index + 1} of ${images.length}`;
}

nextBtn.addEventListener("click", () => {
  const q1 = document.querySelector("input[name='q1']:checked");
  if (!q1) {
    alert("Please answer Question 1");
    return;
  }

  // collect Q2 multi-select
  const q2Selections = [];
  document.querySelectorAll("#q2-options input:checked").forEach(cb => {
    q2Selections.push(cb.value);
  });

  if (q2Selections.length === 0) {
    alert("Please select at least one option in Question 2");
    return;
  }

  const q2 = q2Selections.join(", ");

  // save to Google Sheet
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      image_id: images[index],
      q1: q1.value,
      q2: q2
    })
  });

  // clear selections
  document.querySelectorAll("input[name='q1']").forEach(r => (r.checked = false));
  document.querySelectorAll("#q2-options input").forEach(cb => (cb.checked = false));

  // next image
  index++;

  if (index < images.length) {
    loadImage();
  } else {
    document.body.innerHTML = `
      <div style="text-align:center; padding:40px; font-family:Segoe UI;">
        <h2>Thank you!</h2>
        <p>Your responses have been recorded.</p>
      </div>
    `;
  }
});
