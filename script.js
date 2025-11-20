window.onload = function () {
  console.log("JS Loaded!");

  const secImages = document.getElementById("section-images");
  const secAB = document.getElementById("section-ab");
  const secGeneral = document.getElementById("section-general");
  const secFeedback = document.getElementById("section-feedback");
  const secEnd = document.getElementById("section-end");
  const abContainer = document.getElementById("ab-container");

  // 8 images rating
  const rateImages = [
    "images/img1.jpg",
    "images/img4.jpg",
    "images/img11.jpg",
    "images/img14.jpg",
    "images/img16.jpg",
    "images/img7.jpg",
    "images/img21.jpg",
    "images/img9.jpg"
  ];

  let imgIndex = 0;

  // A/B comparisons
  const abScreens = [
    {
      a: "images/img1.jpg",
      b: "images/img4.jpg",
      q: "Which message is more motivating?",
      name: "ab1"
    },
    {
      a: "images/img11.jpg",
      b: "images/img14.jpg",
      q: "Which message feels more relatable?",
      name: "ab2"
    },
    {
      a: "images/img16.jpg",
      b: "images/img7.jpg",
      q: "Which message would make you more likely to act?",
      name: "ab3"
    },
    {
      a: "images/img21.jpg",
      b: "images/img9.jpg",
      q: "Which message feels more trustworthy?",
      name: "ab4"
    }
  ];

  let abIndex = 0;

  const responses = {
    ratings: [],
    ab: {},
    general: {},
    feedback: ""
  };

  const rateImageEl = document.getElementById("rate-image");

  // ========== RATING SECTION ============

  function loadImage() {
    rateImageEl.src = rateImages[imgIndex];
  }
  loadImage();

  window.nextImage = function () {
    const act = document.querySelector("input[name='act']:checked");
    const mot = document.querySelector("input[name='mot']:checked");
    const trust = document.querySelector("input[name='trust']:checked");

    if (!act || !mot || !trust) {
      alert("Please answer all questions.");
      return;
    }

    responses.ratings.push({
      image: rateImages[imgIndex].replace("images/", ""),
      act: act.value,
      mot: mot.value,
      trust: trust.value,
    });

    // Clear
    document.querySelectorAll("input[name='act']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='mot']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='trust']").forEach(r => r.checked = false);

    imgIndex++;

    if (imgIndex < rateImages.length) {
      loadImage();
    } else {
      secImages.classList.add("hidden");
      secAB.classList.remove("hidden");
      loadAB();
    }
  };

  // ========== A/B SECTION ============

  function loadAB() {
    const data = abScreens[abIndex];

    abContainer.innerHTML = `
      <div class="section-title">${data.q}</div>
      <div class="ab-pair">
        <div class="ab-box">
          <img src="${data.a}">
          <div class="ab-label">A</div>
        </div>
        <div class="ab-box">
          <img src="${data.b}">
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
    const item = abScreens[abIndex];
    const sel = document.querySelector(`input[name='${item.name}']:checked`);

    if (!sel) {
      alert("Please choose an option.");
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

  // ========== GENERAL SECTION ============

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

  // ========== FEEDBACK SECTION ============

  window.finishSurvey = function () {
    responses.feedback = document.getElementById("feedback").value.trim();

    console.log("FINAL DATA:", responses);

    secFeedback.classList.add("hidden");
    secEnd.classList.remove("hidden");
  };
};
