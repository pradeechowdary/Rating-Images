window.onload = function () {
  console.log("Survey JS loaded.");

  // 8 images to rate, in order
  const images = [
    "images/img1.jpg",
    "images/img4.jpg",
    "images/img11.jpg",
    "images/img14.jpg",
    "images/img16.jpg",
    "images/img7.jpg",
    "images/img21.jpg",
    "images/img9.jpg"
  ];

  const secImages   = document.getElementById("section-images");
  const secAB       = document.getElementById("section-ab");
  const secFeedback = document.getElementById("section-feedback");
  const secEnd      = document.getElementById("section-end");

  const imgEl      = document.getElementById("survey-image");
  const progressEl = document.getElementById("img-progress");

  let imgIndex = 0;

  // collected data
  const responses = {
    perImage: [],
    ab: {},
    feedback: ""
  };

  // ---------- IMAGE LOOP ----------

  function loadImage() {
    imgEl.src = images[imgIndex];
    progressEl.innerText = `Image ${imgIndex + 1} of ${images.length}`;
  }

  // start with first image
  loadImage();

  function getRadioValue(name, msg) {
    const sel = document.querySelector(`input[name='${name}']:checked`);
    if (!sel) {
      alert(msg);
      return null;
    }
    return sel.value;
  }

  window.nextImage = function () {
    const likely = getRadioValue(
      "img_likely",
      "Please rate how likely you are to act on this message."
    );
    if (!likely) return;

    const motivating = getRadioValue(
      "img_motivating",
      "Please rate how motivating this message is."
    );
    if (!motivating) return;

    const trust = getRadioValue(
      "img_trust",
      "Please rate how trustworthy this message is."
    );
    if (!trust) return;

    responses.perImage.push({
      image: images[imgIndex].replace("images/", ""),
      likely,
      motivating,
      trust
    });

    // clear selections
    document.querySelectorAll("input[name='img_likely']").forEach(r => (r.checked = false));
    document.querySelectorAll("input[name='img_motivating']").forEach(r => (r.checked = false));
    document.querySelectorAll("input[name='img_trust']").forEach(r => (r.checked = false));

    imgIndex++;

    if (imgIndex < images.length) {
      loadImage();
    } else {
      // go to A/B block
      secImages.classList.add("hidden");
      secAB.classList.remove("hidden");
    }
  };

  // ---------- A/B → FEEDBACK ----------

  window.goToFeedback = function () {
    const ab1 = document.querySelector("input[name='ab1']:checked");
    const ab2 = document.querySelector("input[name='ab2']:checked");
    const ab3 = document.querySelector("input[name='ab3']:checked");
    const ab4 = document.querySelector("input[name='ab4']:checked");

    if (!ab1 || !ab2 || !ab3 || !ab4) {
      alert("Please answer all A/B comparison questions.");
      return;
    }

    responses.ab = {
      moreMotivating: ab1.value,
      moreRelatable: ab2.value,
      moreLikelyToAct: ab3.value,
      moreTrustworthy: ab4.value
    };

    secAB.classList.add("hidden");
    secFeedback.classList.remove("hidden");
  };

  // ---------- FINAL SUBMIT ----------

  window.finishSurvey = function () {
    const fbText = document.getElementById("feedback").value.trim();
    responses.feedback = fbText;

    console.log("FINAL SURVEY DATA:", responses);

    // backend hook later:
    // fetch(API_URL, { method: "POST", body: JSON.stringify(responses) })

    secFeedback.classList.add("hidden");
    secEnd.classList.remove("hidden");
  };
};
