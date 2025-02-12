document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    // Función para mostrar el slide actual
    const showSlide = (index) => {
        // Oculta todos los slides
        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        // Muestra el slide actual
        slides[index].classList.add("active");
    };

    // Función para cambiar al siguiente slide
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length; // Avanza al siguiente slide
        showSlide(currentSlide);
    };

    // Cambia de slide cada 5 segundos
    setInterval(nextSlide, 6000);

    // Muestra el primer slide al cargar la página
    showSlide(currentSlide);
});