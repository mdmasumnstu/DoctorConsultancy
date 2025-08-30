const slides = document.querySelectorAll('.feature.slide');
const dots = document.querySelectorAll('.feature.dot');
let currentSlide = 0;
let slideInterval;

// এই ফাংশনটি নির্দিষ্ট স্লাইড এবং ডটকে সক্রিয় করে
function showSlide(n) {
    // আগের active ক্লাসগুলো সরানো হচ্ছে
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // নতুন স্লাইড ও ডট active করা হচ্ছে
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// পরের স্লাইডে যাওয়ার ফাংশন
function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

// স্লাইডার স্বয়ংক্রিয়ভাবে শুরু করার ফাংশন
function startSlider() {
    slideInterval = setInterval(nextSlide, 6000); // প্রতি ৩ সেকেন্ড পর পর স্লাইড পরিবর্তন হবে
}

// ডটগুলোতে ক্লিক করলে স্লাইড পরিবর্তন করার ইভেন্ট লিসেনার
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval); // স্বয়ংক্রিয় স্লাইড বন্ধ
        showSlide(index);
        startSlider(); // আবার স্লাইড চালু
    });
});

// প্রথমবার পেজ লোড হলে স্লাইডার শুরু হবে
startSlider();