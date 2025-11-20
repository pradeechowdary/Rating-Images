window.onload = function () {
  console.log("JS Loaded!");

  const API_URL = "https://script.google.com/macros/s/AKfycbxEMh4YZRFHI0JCqBipFZH0i04sffUHJBsJQjtMGaU2ey7Xrd4UGSZQ_V2xpKG82ZWPAw/exec";

  const userId = "user-" + Math.random().toString(36).substring(2, 10);
  const sessionId = "sess-" + Math.random().toString(36).substring(2, 10);

  const responses = {
    general: {},
    images: [],
    feedback: "",
    abChoice: ""
  };

  const images = Array.from({ length: 23 }, (_, i) => `images/img${i + 1}.jpg`);

  let imgIndex = 0;

  const secGeneral = document.getElementById("section-general");
  const secImages = document.getElementById("section-images");
  const secFeedback = document.getElementById("section-feedback");
  const secAB = document.getElementById("section-ab");
  const secEnd = document.getElementById("section-end");

  const imgEl = document.getElementById("survey-image");
  const progressEl = document.getElementById("img-progress");

  // ========== GENERAL → IMAGE LOOP ==========
  window.startImages = function () {
    const gen1 = document.querySelector("input[name='gen1']:checked");
    const gen3 = document.querySelector("input[name='gen3']:checked");

    if (!gen1) return alert("Please answer Question 1.");
    if (!gen3) return alert("Please answer Question 3.");

    const gen2 = [...document.querySelectorAll("#gen-q2 input:checked")].map(x => x.value);

    responses.general = {
      motivateMost: gen1.value,
      ignoreList: gen2.join(", "),
      frequency: gen3.value
    };

    secGeneral.classList.add("hidden");
    secImages.classList.remove("hidden");

    loadImage();
  };

  function loadImage() {
    imgEl.src = images[imgIndex];
    progressEl.innerText = `Image ${imgIndex + 1} of ${images.length}`;
  }

  // ========== NEXT IMAGE ==========
  window.nextImage = function () {
    const q1 = document.querySelector("input[name='img1']:checked");
    if (!q1) return alert("Select how the message made you feel.");

    const q2 = [...document.querySelectorAll("#img-q2 input:checked")].map(x => x.value);
    if (q2.length === 0) return alert("Select at least one standout point.");

    responses.images.push({
      image: images[imgIndex].replace("images/", ""),
      feeling: q1.value,
      standout: q2.join(", ")
    });

    document.querySelectorAll("input[name='img1']").forEach(x => (x.checked = false));
    document.querySelectorAll("#img-q2 input").forEach(x => (x.checked = false));

    imgIndex++;

    if (imgIndex < images.length) {
      loadImage();
    } else {
      secImages.classList.add("hidden");
      secAB.classList.remove("hidden");
    }
  };

  // ========== A/B → FEEDBACK ==========
  window.goToFeedback = function () {
    const abSel = document.querySelector("input[name='ab']:checked");
    if (!abSel) return alert("Select A or B.");

    responses.abChoice = abSel.value;

    secAB.classList.add("hidden");
    secFeedback.classList.remove("hidden");
  };

  // ========== FINAL SUBMISSION ==========
  window.finishSurvey = function () {
    responses.feedback = document.getElementById("feedback").value.trim();

    const payload = {
      user_id: userId,
      session_id: sessionId,
      ...responses
    };

    console.log("Sending payload:", payload);

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    secFeedback.classList.add("hidden");
    secEnd.classList.remove("hidden");
  };
};
