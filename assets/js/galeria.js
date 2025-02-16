// Selecciona elementos del DOM
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const galleryImages = document.querySelectorAll(".gallery-item img");

let currentIndex = 0; // Índice de la imagen actual

// Abre la ventana modal con la imagen seleccionada
galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        currentIndex = index;
        modal.style.display = "flex";
        modalImage.src = img.src;
        modalDescription.textContent = img.nextElementSibling.textContent; // Muestra la descripción
    });
});

// Cierra la ventana modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Navega a la imagen anterior
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImage.src = galleryImages[currentIndex].src;
    modalDescription.textContent = galleryImages[currentIndex].nextElementSibling.textContent;
});

// Navega a la imagen siguiente
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    modalImage.src = galleryImages[currentIndex].src;
    modalDescription.textContent = galleryImages[currentIndex].nextElementSibling.textContent;
});

// Cierra la ventana modal al hacer clic fuera de la imagen
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});