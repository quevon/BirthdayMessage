// Open birthday letter
let isOpening = false;

function openLetter() {
  if (isOpening) return;

  isOpening = true;

  const envelope = document.getElementById("envelope");
  const modal = document.getElementById("letterModal");

  envelope.classList.add("open");

  createConfetti();

  setTimeout(() => {
    modal.classList.add("show");
    isOpening = false;
  }, 1100);
}
document.addEventListener("DOMContentLoaded", async () => {
  // ELEMENTS
  const envelope = document.getElementById("envelope");
  const openButton = document.getElementById("openButton");
  const letterModal = document.getElementById("letterModal");
  const closeButton = document.getElementById("closeButton");

  const letterTrack = document.getElementById("letterTrack");
  const prevButton = document.getElementById("prevLetter");
  const nextButton = document.getElementById("nextLetter");

  const sliderDots = document.getElementById("sliderDots");
  const pageIndicator = document.getElementById("pageIndicator");

  const particles = document.getElementById("particles");

  // ADD NEW LETTER FILES HERE
  const letterFiles = [
    "letters/person1.html",
    "letters/person2.html",
    "letters/person3.html",
    "letters/person4.html",
  ];

  let currentIndex = 0;
  let slides = [];

  // LOAD LETTERS FROM SEPARATE HTML FILES
  async function loadLetters() {
    try {
      const responses = await Promise.all(
        letterFiles.map((file) => fetch(file)),
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        throw new Error("One or more letter files could not be loaded.");
      }

      const letterContents = await Promise.all(
        responses.map((response) => response.text()),
      );

      letterTrack.innerHTML = letterContents.join("");

      slides = Array.from(letterTrack.querySelectorAll(".letter-slide"));

      if (slides.length === 0) {
        throw new Error("No letters were found.");
      }

      createDots();
      updateSlider();
    } catch (error) {
      console.error("Letter loading error:", error);

      letterTrack.innerHTML = `
                <div class="letter-slide">
                    <h2>Oops!</h2>
                    <p>
                        We couldn't load the letters.
                        Please check your file names and folder structure.
                    </p>
                </div>
            `;

      pageIndicator.textContent = "Error";
    }
  }

  // CREATE PAGINATION DOTS
  function createDots() {
    sliderDots.innerHTML = "";

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to letter ${index + 1}`);

      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });

      sliderDots.appendChild(dot);
    });
  }

  // UPDATE SLIDER
  function updateSlider() {
    if (!slides.length) return;

    letterTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = sliderDots.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    pageIndicator.textContent = `${currentIndex + 1} / ${slides.length}`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  }

  // NEXT LETTER
  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // PREVIOUS LETTER
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // OPEN LETTERS
  function openLetters() {
    envelope.classList.add("open");
    createConfetti();

    setTimeout(() => {
      letterModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 650);
  }

  envelope.addEventListener("click", openLetters);
  openButton.addEventListener("click", openLetters);

  // CLOSE LETTERS
  function closeLetters() {
    letterModal.classList.remove("active");
    document.body.style.overflow = "";

    setTimeout(() => {
      envelope.classList.remove("open");
    }, 300);
  }

  closeButton.addEventListener("click", closeLetters);

  letterModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeLetters();
    }
  });

  // KEYBOARD CONTROLS
  document.addEventListener("keydown", (event) => {
    if (!letterModal.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeLetters();
    }

    if (event.key === "ArrowRight") {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlider();
      }
    }

    if (event.key === "ArrowLeft") {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }
  });

  // FLOATING PARTICLES
  function createParticles() {
    const symbols = ["✦", "✧", "·", "✴"];

    setInterval(() => {
      const particle = document.createElement("span");

      particle.className = "particle";
      particle.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      particle.style.left = Math.random() * 100 + "%";
      particle.style.fontSize = Math.random() * 12 + 8 + "px";
      particle.style.animationDuration = Math.random() * 8 + 7 + "s";

      particles.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 16000);
    }, 500);
  }

  // CONFETTI
  function createConfetti() {
    const confettiColors = [
      "#e9bd65",
      "#ffe4a6",
      "#ffffff",
      "#a9bfdc",
      "#c69b59",
    ];

    for (let i = 0; i < 90; i++) {
      const confetti = document.createElement("span");

      confetti.className = "confetti";

      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.background =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];

      confetti.style.animationDelay = Math.random() * 1.5 + "s";
      confetti.style.animationDuration = Math.random() * 2 + 2.5 + "s";

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // INITIALIZE
  await loadLetters();
  createParticles();
});

// Close birthday letter
function closeLetter() {
  const envelope = document.getElementById("envelope");
  const modal = document.getElementById("letterModal");

  modal.classList.remove("show");

  setTimeout(() => {
    envelope.classList.remove("open");
  }, 500);
}

// Close by clicking outside
document.getElementById("letterModal").addEventListener("click", (e) => {
  if (e.target.id === "letterModal") {
    closeLetter();
  }
});

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLetter();
  }
});

// Floating gold particles
function createParticle() {
  const particle = document.createElement("div");

  particle.className = "particle";
  particle.textContent = Math.random() > 0.5 ? "✦" : "•";

  particle.style.left = Math.random() * 100 + "vw";
  particle.style.fontSize = 8 + Math.random() * 15 + "px";
  particle.style.animationDuration = 5 + Math.random() * 8 + "s";

  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 14000);
}

setInterval(createParticle, 450);

// Gold confetti celebration
function createConfetti() {
  const colors = ["#e9bd65", "#fff0c8", "#ffffff", "#b28a45", "#7186a6"];

  for (let i = 0; i < 130; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.width = 5 + Math.random() * 7 + "px";
    piece.style.height = 7 + Math.random() * 10 + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDuration = 2.5 + Math.random() * 3 + "s";

    piece.style.animationDelay = Math.random() * 1.5 + "s";

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 6500);
  }
}
