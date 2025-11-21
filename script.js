window.onload = function () {
  console.log("JS Loaded!");

  const secImages = document.getElementById("section-images");
  const secAB = document.getElementById("section-ab");
  const secGeneral = document.getElementById("section-general");
  const secFeedback = document.getElementById("section-feedback");
  const secEnd = document.getElementById("section-end");
  const abContainer = document.getElementById("ab-container");

  // Generate scale buttons (1–5)
  function makeScaleHTML(name) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `
        <label class="pill">
          <input type="radio" name="${name}" value="${i}">
          <span>${i}</span>
        </label>`;
    }
    return html;
  }

  document.getElementById("scale-act").innerHTML = makeScaleHTML("act");
  document.getElementById("scale-mot").innerHTML = makeScaleHTML("mot");
  document.getElementById("scale-trust").innerHTML = makeScaleHTML("trust");

  // FINAL ORDER YOU CONFIRMED
  const ratingFlow = [
    "img1.jpg", "img4.jpg",
    "img11.jpg", "img14.jpg",
    "img16.jpg", "img7.jpg",
    "img21.jpg", "img9.jpg",
    "img19.jpg", "img8.jpg"
  ];

  // A/B comparisons in between
  const abPairs = [
    { a: "img1.jpg", b: "img4.jpg", q: "Which message is more motivating?", name: "ab1" },
    { a: "img11.jpg", b: "img14.jpg", q: "Which message feels more relatable?", name: "ab2" },
    { a: "img16.jpg", b: "img7.jpg", q: "Which message would make you more likely to act?", name: "ab3" },
    { a: "img21.jpg", b: "img9.jpg", q: "Which message feels more trustworthy?", name: "ab4" }
  ];

  let imgIndex = 0;
  let abIndex = 0;

  const responses = {
    ratings: [],
    ab: {},
    general: {},
    feedback: ""
  };

  const rateImageEl = document.getElementById("rate-image");

  // ========== LOAD FIRST IMAGE ==========
  function loadImage() {
    rateImageEl.src = "images/" + ratingFlow[imgIndex];
  }
  loadImage();

  // ========== NEXT IMAGE LOGIC ==========
  window.nextImage = function () {
    const act = document.querySelector("input[name='act']:checked");
    const mot = document.querySelector("input[name='mot']:checked");
    const trust = document.querySelector("input[name='trust']:checked");

    if (!act || !mot || !trust) {
      alert("Please answer all questions.");
      return;
    }

    responses.ratings.push({
      image: ratingFlow[imgIndex],
      act: act.value,
      mot: mot.value,
      trust: trust.value,
    });

    // Clear selections
    document.querySelectorAll("input[name='act']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='mot']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='trust']").forEach(r => r.checked = false);

    imgIndex++;

    // Insert A/B after every 2 images — BUT only for the first 8 images
    if (imgIndex % 2 === 0 && imgIndex <= 8) {
      loadAB();
      secImages.classList.add("hidden");
      secAB.classList.remove("hidden");
      return;
    }

    // If more rating images left, load next
    if (imgIndex < ratingFlow.length) {
      loadImage();
    } else {
      // Done → go to general questions
      secImages.classList.add("hidden");
      secGeneral.classList.remove("hidden");
    }
  };

  // ========== A/B SECTION ==========
  function loadAB() {
    const data = abPairs[abIndex];

    abContainer.innerHTML = `
      <div class="section-title">${data.q}</div>
      <div class="ab-pair">
        <div class="ab-box">
          <img src="images/${data.a}">
          <div class="ab-label">A</div>
        </div>
        <div class="ab-box">
          <img src="images/${data.b}">
          <div class="ab-label">B</div>
        </div>
      </div>

      <div class="options">
        <label><input type="radio" name="${data.name}" value="A"> A</label>
        <label><input type="radio" name="${data.name}" value="B"> B</label>
        <label><input type="radio" name="${data.name}" value="Neither"> Neither</label>
      </div>
    `;
  }

  window.nextAB = function () {
    const item = abPairs[abIndex];
    const sel = document.querySelector(`input[name='${item.name}']:checked`);

    if (!sel) {
      alert("Please choose an option.");
      return;
    }

    responses.ab[item.name] = sel.value;

    abIndex++;

    secAB.classList.add("hidden");
    secImages.classList.remove("hidden");

    if (imgIndex < ratingFlow.length) {
      loadImage();
    } else {
      secImages.classList.add("hidden");
      secGeneral.classList.remove("hidden");
    }
  };

  // ========== GENERAL QUESTIONS ==========
  window.goFeedback = function () {
    const g1 = document.querySelector("input[name='gen1']:checked");
    const g3 = document.querySelector("input[name='gen3']:checked");

    if (!g1 || !g3) {
      alert("Please complete the required questions.");
      return;
    }

    const ignoreList = [];
    document.querySelectorAll("#section-general input[type='checkbox']:checked")
      .forEach(c => ignoreList.push(c.value));

    responses.general = {
      motivatesMost: g1.value,
      ignore: ignoreList.join(", "),
      frequency: g3.value
    };

    secGeneral.classList.add("hidden");
    secFeedback.classList.remove("hidden");
  };

  // ========== FEEDBACK ==========
  window.finishSurvey = function () {
    responses.feedback = document.getElementById("feedback").value.trim();

    console.log("FINAL DATA:", responses);

    secFeedback.classList.add("hidden");
    secEnd.classList.remove("hidden");
  };
};
