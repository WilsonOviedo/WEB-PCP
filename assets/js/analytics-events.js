(function () {
    function track(eventName, params) {
        if (typeof gtag === "function") {
            gtag("event", eventName, params || {});
        }
    }

    document.addEventListener("click", function (e) {
        var el = e.target.closest("a");
        if (!el || !el.href) return;

        var href = el.getAttribute("href") || "";

        if (href.indexOf("wa.me/") !== -1 || href.indexOf("whatsapp.com") !== -1) {
            track("whatsapp_click", { event_category: "conversion", event_label: href });
            return;
        }

        if (href.indexOf("tel:") === 0) {
            track("phone_click", { event_category: "conversion", event_label: href });
            return;
        }

        if (href.indexOf("mailto:") === 0) {
            track("email_click", { event_category: "conversion", event_label: href });
            return;
        }

        if (href.indexOf("tools.pcp.com.py") !== -1) {
            track("tools_click", { event_category: "engagement", event_label: href });
        }
    });

    document.addEventListener("submit", function (e) {
        var form = e.target;
        if (!form || form.tagName !== "FORM") return;
        if ((form.getAttribute("action") || "").indexOf("formspree.io") !== -1) {
            track("form_submit", { event_category: "conversion", event_label: "contact_form" });
        }
    });
})();
