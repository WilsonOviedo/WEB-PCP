document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // En móvil, cerrar el menú al seleccionar un enlace.
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove("active");
            }
        });
    });
});