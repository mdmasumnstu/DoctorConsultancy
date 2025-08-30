const specialtiesSlider = document.querySelector(".specialties-grid");
let specialtiesAutoSlide;

// Function to get card width + gap
function getSpecialtyCardWidth() {
  const card = specialtiesSlider.querySelector(".card");
  const style = window.getComputedStyle(specialtiesSlider);
  const gap = parseInt(style.gap) || 20;
  return card.offsetWidth + gap;
}

// Slide Right
function slideSpecialtiesRight() {
  const cardWidth = getSpecialtyCardWidth();
  if (specialtiesSlider.scrollLeft + specialtiesSlider.clientWidth >= specialtiesSlider.scrollWidth - 1) {
    specialtiesSlider.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    specialtiesSlider.scrollBy({ left: cardWidth, behavior: "smooth" });
  }
}

// Slide Left
function slideSpecialtiesLeft() {
  const cardWidth = getSpecialtyCardWidth();
  if (specialtiesSlider.scrollLeft === 0) {
    specialtiesSlider.scrollTo({ left: specialtiesSlider.scrollWidth, behavior: "smooth" });
  } else {
    specialtiesSlider.scrollBy({ left: -cardWidth, behavior: "smooth" });
  }
}

// Auto Slide
function startSpecialtiesAutoSlide() {
  specialtiesAutoSlide = setInterval(slideSpecialtiesRight, 3000);
}

// Pause on hover
specialtiesSlider.addEventListener("mouseenter", () => clearInterval(specialtiesAutoSlide));
specialtiesSlider.addEventListener("mouseleave", startSpecialtiesAutoSlide);

// Start
startSpecialtiesAutoSlide();
