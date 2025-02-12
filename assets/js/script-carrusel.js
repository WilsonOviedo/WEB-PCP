document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    // Obtener todas las imágenes originales
    const originalSlides = Array.from(document.querySelectorAll(".carousel-slide"));

    // Clonar las dos primeras imágenes y añadirlas al final
    const firstClone = originalSlides[0].cloneNode(true);
    const secondClone = originalSlides[1].cloneNode(true);
    track.append(firstClone, secondClone);

    // Clonar las dos últimas imágenes y añadirlas al principio
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    const secondLastClone = originalSlides[originalSlides.length - 2].cloneNode(true);
    track.prepend(secondLastClone, lastClone);

    // Actualizar la lista de slides (incluyendo clones)
    const allSlides = Array.from(document.querySelectorAll(".carousel-slide"));

    let currentIndex = 2; // Empezamos en el primer slide original
    let autoPlayInterval; // Variable para el intervalo de desplazamiento automático

    // Función para actualizar el carrusel
    const updateCarousel = () => {
        const offset = -currentIndex * (100 / 3); // Mueve el track
        track.style.transform = `translateX(${offset}%)`;

        // Resalta la foto del medio
        allSlides.forEach((slide, index) => {
            if (index === currentIndex + 1) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });
    };

    // Función para mover al siguiente slide
    const nextSlide = () => {
        if (currentIndex < allSlides.length - 3) {
            currentIndex++;
        } else {
            // Si estamos al final, saltamos al principio (sin transición)
            track.style.transition = "none";
            currentIndex = 1; // Saltamos a los clones del principio
            updateCarousel();
            // Forzamos un reflow para reiniciar la transición
            void track.offsetWidth;
            track.style.transition = "transform 0.5s ease-in-out";
            currentIndex++; // Movemos una posición más
        }
        updateCarousel();
    };

    // Función para mover al slide anterior
    const prevSlide = () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // Si estamos al principio, saltamos al final (sin transición)
            track.style.transition = "none";
            currentIndex = allSlides.length - 4; // Saltamos a los clones del final
            updateCarousel();
            // Forzamos un reflow para reiniciar la transición
            void track.offsetWidth;
            track.style.transition = "transform 0.5s ease-in-out";
            currentIndex--; // Movemos una posición más
        }
        updateCarousel();
    };

    // Botón "Anterior"
    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoPlay(); // Reiniciar el autoplay al interactuar manualmente
    });

    // Botón "Siguiente"
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoPlay(); // Reiniciar el autoplay al interactuar manualmente
    });

    // Desplazamiento automático
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 3000); // Mover cada 3 segundos
    };

    // Reiniciar el autoplay
    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Iniciar el autoplay al cargar la página
    startAutoPlay();

    // Responsividad: Ajustar el número de slides visibles
    const handleResponsive = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            // Mostrar 2 slides en móviles
            allSlides.forEach((slide) => {
                slide.style.flex = "0 0 50%";
            });
        } else {
            // Mostrar 3 slides en desktop
            allSlides.forEach((slide) => {
                slide.style.flex = "0 0 33.33%";
            });
        }
        updateCarousel(); // Actualizar el carrusel después del cambio
    };

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener("resize", handleResponsive);

    // Inicializar el carrusel y la responsividad
    updateCarousel();
    handleResponsive();
});