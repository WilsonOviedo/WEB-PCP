document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".clients-track");
    const prevBtn = document.querySelector(".clients-prev");
    const nextBtn = document.querySelector(".clients-next");

    if (!track) return;

    const originalSlides = Array.from(track.querySelectorAll(".client-slide"));
    if (originalSlides.length === 0) return;

    const getVisibleSlides = () => {
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1024) return 4;
        return 6;
    };
    const total = originalSlides.length;

    let visible = getVisibleSlides();
    let currentIndex = visible;
    let autoPlayInterval;

    const prependClones = originalSlides.slice(-visible).map((slide) => slide.cloneNode(true));
    const appendClones = originalSlides.slice(0, visible).map((slide) => slide.cloneNode(true));
    prependClones.forEach((clone) => track.prepend(clone));
    appendClones.forEach((clone) => track.append(clone));

    let slides = Array.from(track.querySelectorAll(".client-slide"));

    const updateCarousel = (withTransition = true) => {
        const slideWidth = 100 / visible;
        track.style.transition = withTransition ? "transform 0.55s ease" : "none";
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    };

    const rebuildForResponsive = () => {
        const newVisible = getVisibleSlides();
        if (newVisible === visible) return;

        const freshOriginal = Array.from(document.querySelectorAll(".clients-track .client-slide"))
            .slice(visible, visible + total);
        track.innerHTML = "";
        freshOriginal.forEach((slide) => track.append(slide));

        visible = newVisible;
        currentIndex = visible;

        const newPrependClones = freshOriginal.slice(-visible).map((slide) => slide.cloneNode(true));
        const newAppendClones = freshOriginal.slice(0, visible).map((slide) => slide.cloneNode(true));
        newPrependClones.forEach((clone) => track.prepend(clone));
        newAppendClones.forEach((clone) => track.append(clone));

        slides = Array.from(track.querySelectorAll(".client-slide"));
        updateCarousel(false);
    };

    const next = () => {
        currentIndex++;
        updateCarousel(true);
    };

    const prev = () => {
        currentIndex--;
        updateCarousel(true);
    };

    track.addEventListener("transitionend", () => {
        if (currentIndex >= total + visible) {
            currentIndex = visible;
            updateCarousel(false);
        } else if (currentIndex < visible) {
            currentIndex = total + visible - 1;
            updateCarousel(false);
        }
    });

    const startAutoplay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(next, 2600);
    };

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prev();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            next();
            startAutoplay();
        });
    }

    window.addEventListener("resize", () => {
        rebuildForResponsive();
        startAutoplay();
    });

    updateCarousel(false);
    startAutoplay();
});