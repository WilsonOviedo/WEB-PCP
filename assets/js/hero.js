document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Función para mostrar un slide específico
    function showSlide(index) {
        // Remover clase active de todos los slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Asegurar que el índice esté dentro del rango
        currentSlide = (index + slides.length) % slides.length;
        
        // Agregar clase active al slide e indicador actual
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Función para retroceder al slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Iniciar el carrusel automático
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Detener el carrusel automático
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Event listeners para los botones
    prevBtn.addEventListener('click', () => {
        stopSlideShow();
        prevSlide();
        startSlideShow();
    });

    nextBtn.addEventListener('click', () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    });

    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    // Iniciar el carrusel
    startSlideShow();
});