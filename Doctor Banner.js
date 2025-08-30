document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector(".doctor-image-slider-track");
  const slides = document.querySelectorAll(".doctor-image-slide");
  const dots = document.querySelectorAll(".slider-dot");
  let currentSlide = 0;

  function goToSlide(index) {
    if (index >= slides.length) {
      index = 0;
    }
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentSlide].classList.add("active");
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // Auto-play feature (optional)
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000); // Changes slide every 5 seconds
});