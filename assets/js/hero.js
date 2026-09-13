document.addEventListener('DOMContentLoaded', function () {
    const bgSlides = document.querySelectorAll('.hero-bg-slide');
    if (!bgSlides.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let current = 0;
    const changeSlide = () => {
        bgSlides[current].classList.remove('active');
        current = (current + 1) % bgSlides.length;
        bgSlides[current].classList.add('active');
    };

    setInterval(changeSlide, 4500);
});
