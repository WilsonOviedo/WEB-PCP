(function () {
    function activateMap(facade) {
        if (!facade || facade.dataset.loaded === "1") return;
        var src = facade.getAttribute("data-map-src");
        if (!src) return;

        var iframe = document.createElement("iframe");
        iframe.title = facade.getAttribute("data-map-title") || "Mapa Power Control Paraguay";
        iframe.src = src;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.allowFullscreen = true;
        iframe.setAttribute("style", "border:0;");

        facade.innerHTML = "";
        facade.appendChild(iframe);
        facade.dataset.loaded = "1";
        facade.classList.add("is-loaded");
    }

    function setupFacade(facade) {
        var trigger = function () {
            activateMap(facade);
        };

        facade.addEventListener("click", trigger, { once: true });
        facade.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                trigger();
            }
        });

        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            // Carga al acercarse (no en el primer paint)
                            setTimeout(function () {
                                activateMap(facade);
                            }, 200);
                            io.unobserve(facade);
                        }
                    });
                },
                { rootMargin: "200px 0px" }
            );
            io.observe(facade);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".map-facade[data-map-src]").forEach(setupFacade);
    });
})();
