// Selecciona el header
const header = document.querySelector('header');

// Define la función para manejar el scroll
function handleScroll() {
    if (window.scrollY > 50) { // Si el scroll es mayor a 50px
        header.classList.add('shrink'); // Aplica la clase shrink
    } else {
        header.classList.remove('shrink'); // Quita la clase shrink
    }
}

// Escucha el evento de scroll
window.addEventListener('scroll', handleScroll);