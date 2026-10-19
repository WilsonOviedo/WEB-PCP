(function () {
    var widget = document.querySelector(".whatsapp-widget");
    if (!widget) return;

    var btn = widget.querySelector(".whatsapp-btn");
    var menu = widget.querySelector(".whatsapp-menu");
    if (!btn || !menu) return;

    function setOpen(open) {
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        widget.classList.toggle("is-open", open);
    }

    function toggle() {
        setOpen(menu.hidden);
    }

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle();
    });

    document.addEventListener("click", function (e) {
        if (!widget.contains(e.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            setOpen(false);
        }
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setOpen(false);
        });
    });
})();
