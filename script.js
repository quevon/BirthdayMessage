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
