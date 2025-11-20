// === Backend endpoint (Google Apps Script) ===
const API_URL =
  "https://script.google.com/macros/s/AKfycbwcHirjf_M06loW-6MhqJiFRxLfA_JkY12E_VWAu6fHO7JR0qZ3VdsAgjvMDOgNTYD8/exec";

// Anonymous session id (no user info, just grouping)
const sessionId = "sess-" + Math.random().toString(36).substring(2, 10);

// Image list (filenames in your /images folder)
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

let currentIndex = 0;
const totalImages = images.length;

// DOM elements
const introCard = document.getElementById("intro-card");
const ratingCard = document.getElementById("rating-card");
const finishCard = document.getElementById("finish-card");

const startBtn = document.getElementById("start-btn");
const imageEl = document.getElementById("rating-image");
const imageLabel = document.getElementById("image-label");
const progressText = document.getElementById("progress-text");
const percentText = document.getElementById("percent-text");
const progressBar = document.getElementById("progress-bar");
const ratingButtons = document.querySelectorAll(".rating-buttons .btn");

// --- Init ---
startBtn.addEventListener("click", () => {
  introCard.classList.add("hidden");
  ratingCard.classList.remove("hidden");
  loadImage(currentIndex);
  updateProgress();
});

ratingButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = parseInt(btn.getAttribute("data-rating"), 10);
    handleRating(value);
  });
});

// Load image with fade-in
function loadImage(index) {
  const filename = images[index];
  imageEl.classList.remove("visible");
  imageEl.src = "images/" + filename;
  imageLabel.textContent = `Image ${index + 1}`;
  // ensure fade-in after load
  imageEl.onload = () => {
    requestAnimationFrame(() => {
      imageEl.classList.add("visible");
    });
  };
}

// Update progress bar + text
function updateProgress() {
  const current = Math.min(currentIndex + 1, totalImages);
  const percent = Math.round((current / totalImages) * 100);
  progressText.textContent = `Image ${current} of ${totalImages}`;
  percentText.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

// Handle rating click
function handleRating(value) {
  const imageId = images[currentIndex];

  // Optimistically move to next image for UX
  const thisIndex = currentIndex;
  const isLast = thisIndex === totalImages - 1;

  // Disable buttons briefly to avoid spam-click
  setButtonsDisabled(true);

  // Fire-and-forget to backend
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      image_id: imageId,
      rating: value
    })
  }).catch((err) => {
    console.error("Failed to send rating", err);
  });

  // Move forward
  currentIndex++;

  if (isLast) {
    ratingCard.classList.add("hidden");
    finishCard.classList.remove("hidden");
  } else {
    loadImage(currentIndex);
    updateProgress();
    setButtonsDisabled(false);
  }
}

function setButtonsDisabled(disabled) {
  ratingButtons.forEach((btn) => {
    btn.disabled = disabled;
  });
}
