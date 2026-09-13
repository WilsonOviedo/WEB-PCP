// Selecciona el header
const header = document.querySelector('header');

if (header) {
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}
