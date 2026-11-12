document.addEventListener("DOMContentLoaded", async () => {
  // ========================================
  // ELEMENTS
  // ========================================

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

  const music = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicToggle");

  // ========================================
  // SETTINGS
  // ========================================

  const letterFiles = [
    "letters/person1.html",
    "letters/person2.html",
    "letters/person3.html",
    "letters/person4.html",
    "letters/person5.html",
    "letters/person6.html",
    "letters/person7.html",
    "letters/person8.html",
    "letters/person9.html",
    "letters/person10.html",
    "letters/person11.html",
    "letters/person12.html",
    "letters/person13.html",
  ];

  let currentIndex = 0;
  let slides = [];
  let isOpening = false;

  // ========================================
  // BACKGROUND MUSIC
  // ========================================

  async function playMusic() {
    if (!music) {
      console.error("Audio element #bgMusic not found.");
      return;
    }

    music.volume = 0.3;

    try {
      await music.play();

      if (musicButton) {
        musicButton.textContent = "🔊 Music On";
      }

      console.log("Background music playing!");
    } catch (error) {
      console.error("Music playback failed:", error);
    }
  }

  function toggleMusic() {
    if (!music) return;

    if (music.paused) {
      playMusic();
    } else {
      music.pause();

      if (musicButton) {
        musicButton.textContent = "🔇 Music Off";
      }
    }
  }

  // Allow HTML onclick to access this function
  window.toggleMusic = toggleMusic;

  if (musicButton) {
    musicButton.addEventListener("click", toggleMusic);
  }

  // ========================================
  // LOAD LETTERS
  // ========================================

  async function loadLetters() {
    try {
      const responses = await Promise.all(
        letterFiles.map((file) => fetch(file)),
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        throw new Error("One or more letter files could not be loaded.");
      }

      const contents = await Promise.all(
        responses.map((response) => response.text()),
      );

      letterTrack.innerHTML = contents.join("");

      slides = Array.from(letterTrack.querySelectorAll(".letter-slide"));

      if (slides.length === 0) {
        throw new Error("No letters were found.");
      }

      createDots();
      updateSlider();

      console.log(`${slides.length} letters loaded.`);
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

  // ========================================
  // CREATE PAGINATION DOTS
  // ========================================

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

  // ========================================
  // UPDATE SLIDER
  // ========================================

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

  // ========================================
  // NEXT LETTER
  // ========================================

  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // ========================================
  // PREVIOUS LETTER
  // ========================================

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // ========================================
  // OPEN LETTERS
  // ========================================

  function openLetters() {
    if (isOpening || letterModal.classList.contains("active")) {
      return;
    }

    isOpening = true;

    // START MUSIC ON ENVELOPE CLICK
    playMusic();

    // ENVELOPE ANIMATION
    envelope.classList.add("open");

    // CELEBRATION
    createConfetti();

    setTimeout(() => {
      letterModal.classList.add("active");
      document.body.style.overflow = "hidden";

      isOpening = false;
    }, 650);
  }

  envelope.addEventListener("click", openLetters);
  openButton.addEventListener("click", openLetters);

  // ========================================
  // CLOSE LETTERS
  // ========================================

  function closeLetters() {
    if (!letterModal.classList.contains("active")) return;

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

  // ========================================
  // KEYBOARD CONTROLS
  // ========================================

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

  // ========================================
  // FLOATING PARTICLES
  // ========================================

  function createParticles() {
    if (!particles) return;

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

  // ========================================
  // CONFETTI
  // ========================================

  function createConfetti() {
    const colors = ["#e9bd65", "#ffe4a6", "#ffffff", "#a9bfdc", "#c69b59"];

    for (let i = 0; i < 90; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti";

      piece.style.left = Math.random() * 100 + "vw";

      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.animationDelay = Math.random() * 1.5 + "s";
      piece.style.animationDuration = Math.random() * 2 + 2.5 + "s";

      document.body.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }
  // ========================================
  // BACKGROUND MUSIC
  // ========================================

  async function playMusic() {
    if (!music) return;

    music.volume = 0.3;

    try {
      await music.play();

      if (musicButton) {
        musicButton.textContent = "🔊 Music On";
      }
    } catch (error) {
      console.error("Music playback failed:", error);
    }
  }

  function toggleMusic() {
    if (!music) return;

    if (music.paused) {
      playMusic();
    } else {
      music.pause();
      musicButton.textContent = "🔇 Music Off";
    }
  }

  if (musicButton) {
    musicButton.addEventListener("click", toggleMusic);
  }
  // ========================================
  // INITIALIZE
  // ========================================

  await loadLetters();
  createParticles();
});
