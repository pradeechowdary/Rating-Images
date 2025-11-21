window.onload = function () {
  console.log("JS Loaded!");

  const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwUQPIKuGL6XSEIyJibjhAKLaxujlytg7186OjNVOnG-1qIjSFroc5dFIkSECvGm_cctA/exec";


  const secImages = document.getElementById("section-images");
  const secAB = document.getElementById("section-ab");
  const secGeneral = document.getElementById("section-general");
  const secFeedback = document.getElementById("section-feedback");
  const secEnd = document.getElementById("section-end");

  const abContainer = document.getElementById("ab-container");

  // NEW RATING IMAGE ORDER YOU WANTED
  const rateImages = [
    "images/img1.jpg",
    "images/img4.jpg",
    "images/img11.jpg",
    "images/img14.jpg",
    "images/img16.jpg",
    "images/img7.jpg",
    "images/img21.jpg",
    "images/img9.jpg",
    "images/img19.jpg",
    "images/img8.jpg",
  ];

  let imgIndex = 0;

  const abScreens = [
    { a: "images/img1.jpg",  b: "images/img4.jpg",  q: "Which message is more motivating?",    name: "ab1" },
    { a: "images/img11.jpg", b: "images/img14.jpg", q: "Which message feels more relatable?",   name: "ab2" },
    { a: "images/img16.jpg", b: "images/img7.jpg",  q: "Which message makes you more likely to act?", name: "ab3" },
    { a: "images/img21.jpg", b: "images/img9.jpg",  q: "Which message feels more trustworthy?", name: "ab4" }
  ];

  let abIndex = 0;

  const responses = {
    ratings: [],
    ab: {},
    general: {},
    feedback: ""
  };

  const rateImageEl = document.getElementById("rate-image");

  function loadImage() {
    rateImageEl.src = rateImages[imgIndex];
  }
  loadImage();

  window.nextImage = function () {

    const mot   = document.querySelector("input[name='mot']:checked");
    const trust = document.querySelector("input[name='trust']:checked");
    const act   = document.querySelector("input[name='act']:checked");

    if (!mot || !trust || !act) {
      alert("Please answer all three questions.");
      return;
    }

    responses.ratings.push({
      image: rateImages[imgIndex].replace("images/", ""),
      mot: mot.value,
      trust: trust.value,
      act: act.value
    });

    document.querySelectorAll("input[name='mot']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='trust']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='act']").forEach(r => r.checked = false);

    imgIndex++;

    if (imgIndex < rateImages.length) {
      loadImage();
    } else {
      secImages.classList.add("hidden");
      secAB.classList.remove("hidden");
      loadAB();
    }
  };

  function loadAB() {
    const item = abScreens[abIndex];
    abContainer.innerHTML = `
      <div class="section-title">${item.q}</div>
      <div class="ab-pair">
        <div class="ab-box"><img src="${item.a}"><div>A</div></div>
        <div class="ab-box"><img src="${item.b}"><div>B</div></div>
      </div>
      <label><input type="radio" name="${item.name}" value="A"> A</label>
      <label><input type="radio" name="${item.name}" value="B"> B</label>
      <label><input type="radio" name="${item.name}" value="Neither"> Neither</label>
    `;
  }

  window.nextAB = function () {
    const item = abScreens[abIndex];
    const sel = document.querySelector(`input[name="${item.name}"]:checked`);

    if (!sel) {
      alert("Choose an option");
      return;
    }

    responses.ab[item.name] = sel.value;

    abIndex++;

    if (abIndex < abScreens.length) {
      loadAB();
    } else {
      secAB.classList.add("hidden");
      secGeneral.classList.remove("hidden");
    }
  };

  window.goFeedback = function () { /* unchanged */ };
  window.finishSurvey = function () { /* unchanged */ };
};
