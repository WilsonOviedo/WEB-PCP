/**
 * Consentimiento de cookies — Power Control Paraguay
 * No carga GTM / Meta Pixel hasta aceptación de categorías no esenciales.
 */
(function () {
    "use strict";

    var STORAGE_KEY = "pcp_cookie_consent_v1";
    var GTM_ID = "GTM-M98RFMP4";
    var META_PIXEL_ID = "765233952276065";

    var defaultConsent = {
        necessary: true,
        analytics: false,
        marketing: false,
        updatedAt: null
    };

    var marketingLoaded = false;

    function readConsent() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            return {
                necessary: true,
                analytics: !!parsed.analytics,
                marketing: !!parsed.marketing,
                updatedAt: parsed.updatedAt || null
            };
        } catch (e) {
            return null;
        }
    }

    function saveConsent(consent) {
        var payload = {
            necessary: true,
            analytics: !!consent.analytics,
            marketing: !!consent.marketing,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return payload;
    }

    function loadScript(src, attrs) {
        if (document.querySelector('script[src="' + src + '"]')) return;
        var s = document.createElement("script");
        s.src = src;
        s.async = true;
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                s.setAttribute(k, attrs[k]);
            });
        }
        document.head.appendChild(s);
    }

    function loadGTM() {
        if (window.__pcpGtmLoaded) return;
        window.__pcpGtmLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        loadScript("https://www.googletagmanager.com/gtm.js?id=" + GTM_ID, { "data-consent": "analytics" });
    }

    function loadMetaPixel() {
        if (window.__pcpMetaLoaded) return;
        window.__pcpMetaLoaded = true;
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        window.fbq("init", META_PIXEL_ID);
        window.fbq("track", "PageView");
    }

    function applyConsent(consent) {
        if ((consent.analytics || consent.marketing) && !marketingLoaded) {
            marketingLoaded = true;
            loadGTM();
            loadMetaPixel();
        }
        window.PCPConsent = window.PCPConsent || {};
        window.PCPConsent.current = consent;
        window.dispatchEvent(new CustomEvent("pcp:consent-updated", { detail: consent }));
    }

    function el(tag, className, html) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (html != null) node.innerHTML = html;
        return node;
    }

    function buildUI() {
        if (document.getElementById("pcp-cookie-banner")) return;

        var banner = el(
            "div",
            "pcp-cookie-banner",
            ""
        );
        banner.id = "pcp-cookie-banner";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-live", "polite");
        banner.setAttribute("aria-label", "Preferencias de cookies");
        banner.hidden = true;
        banner.innerHTML =
            '<div class="pcp-cookie-banner__inner">' +
            "<div class=\"pcp-cookie-banner__copy\">" +
            "<strong>Usamos cookies</strong>" +
            "<p>Utilizamos cookies necesarias para el sitio y, solo si nos das tu permiso, cookies de analítica y marketing (Google Tag Manager y Meta Pixel). Podés aceptarlas, rechazarlas o configurarlas. Más info en la <a href=\"/politica-cookies\">Política de Cookies</a>.</p>" +
            "</div>" +
            '<div class="pcp-cookie-banner__actions">' +
            '<button type="button" class="pcp-cookie-btn pcp-cookie-btn--primary" data-consent-accept>Aceptar todas</button>' +
            '<button type="button" class="pcp-cookie-btn" data-consent-reject>Rechazar no esenciales</button>' +
            '<button type="button" class="pcp-cookie-btn" data-consent-configure>Configurar</button>' +
            "</div></div>";

        var modal = el("div", "pcp-cookie-modal");
        modal.id = "pcp-cookie-modal";
        modal.hidden = true;
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "pcp-cookie-modal-title");
        modal.innerHTML =
            '<div class="pcp-cookie-modal__panel">' +
            '<button type="button" class="pcp-cookie-modal__close" data-consent-close aria-label="Cerrar">&times;</button>' +
            '<h2 id="pcp-cookie-modal-title">Configurar cookies</h2>' +
            "<p>Elegí qué categorías habilitás. Las cookies necesarias siempre están activas.</p>" +
            '<label class="pcp-cookie-option"><input type="checkbox" checked disabled> <span><strong>Necesarias</strong><small>Imprescindibles para seguridad y funcionamiento básico del sitio.</small></span></label>' +
            '<label class="pcp-cookie-option"><input type="checkbox" id="pcp-consent-analytics"> <span><strong>Analítica</strong><small>Nos ayudan a entender el uso del sitio (p. ej. vía Google Tag Manager).</small></span></label>' +
            '<label class="pcp-cookie-option"><input type="checkbox" id="pcp-consent-marketing"> <span><strong>Marketing</strong><small>Publicidad y medición (p. ej. Meta Pixel).</small></span></label>' +
            '<div class="pcp-cookie-modal__actions">' +
            '<button type="button" class="pcp-cookie-btn pcp-cookie-btn--primary" data-consent-save>Guardar preferencias</button>' +
            '<button type="button" class="pcp-cookie-btn" data-consent-close>Cancelar</button>' +
            "</div>" +
            '<p class="pcp-cookie-modal__links"><a href="/politica-privacidad">Privacidad</a> · <a href="/politica-cookies">Cookies</a></p>' +
            "</div>";

        document.body.appendChild(banner);
        document.body.appendChild(modal);

        banner.querySelector("[data-consent-accept]").addEventListener("click", function () {
            var c = saveConsent({ analytics: true, marketing: true });
            applyConsent(c);
            hideBanner();
            hideModal();
        });
        banner.querySelector("[data-consent-reject]").addEventListener("click", function () {
            var c = saveConsent({ analytics: false, marketing: false });
            applyConsent(c);
            hideBanner();
            hideModal();
        });
        banner.querySelector("[data-consent-configure]").addEventListener("click", openModal);

        modal.querySelectorAll("[data-consent-close]").forEach(function (btn) {
            btn.addEventListener("click", hideModal);
        });
        modal.querySelector("[data-consent-save]").addEventListener("click", function () {
            var c = saveConsent({
                analytics: document.getElementById("pcp-consent-analytics").checked,
                marketing: document.getElementById("pcp-consent-marketing").checked
            });
            applyConsent(c);
            hideBanner();
            hideModal();
        });
        modal.addEventListener("click", function (e) {
            if (e.target === modal) hideModal();
        });
    }

    function showBanner() {
        var banner = document.getElementById("pcp-cookie-banner");
        if (banner) banner.hidden = false;
    }

    function hideBanner() {
        var banner = document.getElementById("pcp-cookie-banner");
        if (banner) banner.hidden = true;
    }

    function openModal() {
        var consent = readConsent() || defaultConsent;
        var analytics = document.getElementById("pcp-consent-analytics");
        var marketing = document.getElementById("pcp-consent-marketing");
        if (analytics) analytics.checked = !!consent.analytics;
        if (marketing) marketing.checked = !!consent.marketing;
        var modal = document.getElementById("pcp-cookie-modal");
        if (modal) modal.hidden = false;
    }

    function hideModal() {
        var modal = document.getElementById("pcp-cookie-modal");
        if (modal) modal.hidden = true;
    }

    function bindSettingsTriggers() {
        document.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-cookie-settings]");
            if (!btn) return;
            e.preventDefault();
            buildUI();
            openModal();
        });
    }

    function init() {
        buildUI();
        bindSettingsTriggers();
        var consent = readConsent();
        if (!consent) {
            showBanner();
            window.PCPConsent = { current: defaultConsent, openSettings: openModal };
            return;
        }
        applyConsent(consent);
        window.PCPConsent = {
            current: consent,
            openSettings: openModal
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
