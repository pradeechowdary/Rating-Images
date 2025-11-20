// ========= CONFIG =========
const API_URL = "https://script.google.com/macros/s/AKfycbxEMh4YZRFHI0JCqBipFZH0i04sffUHJBsJQjtMGaU2ey7Xrd4UGSZQ_V2xpKG82ZWPAw/exec";

// Anonymous user + session IDs
const userId = "user-" + Math.random().toString(36).substring(2, 10);
const sessionId = "sess-" + Math.random().toString(36).substring(2, 10);

// --- GLOBAL STORAGE ---
const responses = {
  general: {},
  images: [],
  feedback: "",
  abChoice: ""
};

// --- IMAGE LIST (23 images in /images) ---
const images = Array.from({ length: 23 }, (_, i) => `images/img${i + 1}.jpg`);

let imgIndex = 0;

// --- DOM ELEMENTS ---
const secGeneral = document.getElementById("section-general");
const secImages = document.getElementById("section-images");
const secFeedback = document.getElementById("section-feedback");
const secAB = document.getElementById("section-ab");
const secEnd = document.getElementById("section-end");
const imgEl = document.getElementById("survey-image");
const progressEl = document.getElementById("img-progress");

// --- START IMAGE LOOP ---
function startImages() {
  const gen1 = document.querySelector("input[name='gen1']:checked");
  const gen3 = document.querySelector("input[name='gen3']:checked");

  if (!gen1) return alert("Please answer Question 1 (motivation).");
  if (!gen3) return alert("Please answer Question 3 (frequency).");

  const gen2 = [...document.querySelectorAll("#gen-q2 input:checked")].map(x => x.value);

  responses.general = {
    motivateMost: gen1.value,
    ignoreList: gen2.join(", "),
    frequency: gen3.value
  };

  secGeneral.classList.add("hidden");
  secImages.classList.remove("hidden");

  loadImage();
}

// --- LOAD IMAGE ---
function loadImage() {
  imgEl.src = images[imgIndex];
  progressEl.innerText = `Image ${imgIndex + 1} of ${images.length}`;
}

// --- NEXT IMAGE ---
function nextImage() {
  const q1 = document.querySelector("input[name='img1']:checked");
  if (!q1) return alert("Please answer how the message made you feel.");

  const q2 = [...document.querySelectorAll("#img-q2 input:checked")].map(x => x.value);
  if (q2.length === 0) return alert("Please select at least one thing that stood out.");

  responses.images.push({
    image: images[imgIndex].replace("images/", ""), // store just "imgX.jpg"
    feeling: q1.value,
    standout: q2.join(", ")
  });

  // Reset controls
  document.querySelectorAll("input[name='img1']").forEach(x => (x.checked = false));
  document.querySelectorAll("#img-q2 input").forEach(x => (x.checked = false));

  imgIndex++;

  if (imgIndex < images.length) {
    loadImage();
  } else {
    secImages.classList.add("hidden");
    secAB.classList.remove("hidden");
  }
}

// --- A/B → FEEDBACK ---
function goToFeedback() {
  const abSel = document.querySelector("input[name='ab']:checked");
  if (!abSel) return alert("Please choose A or B.");

  responses.abChoice = abSel.value;

  secAB.classList.add("hidden");
  secFeedback.classList.remove("hidden");
}

// --- FINAL SUBMISSION ---
function finishSurvey() {
  const feedbackText = document.getElementById("feedback").value.trim();
  responses.feedback = feedbackText;

  const payload = {
    user_id: userId,
    session_id: sessionId,
    ...responses
  };

  console.log("FINAL RESPONSES (about to send):", payload);

  // Send to Google Apps Script
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(txt => {
      console.log("Sheet response:", txt);
    })
    .catch(err => {
      console.error("Error sending to sheet:", err);
    });

  secFeedback.classList.add("hidden");
  secEnd.classList.remove("hidden");
}
