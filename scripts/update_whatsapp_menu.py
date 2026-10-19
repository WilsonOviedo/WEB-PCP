"""Reemplaza el botón flotante de WhatsApp por un menú Proyectos/Ventas."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

WIDGET = """
    <div class="whatsapp-widget">
        <div class="whatsapp-menu" id="whatsapp-menu" hidden>
            <p class="whatsapp-menu-title">¿Con quién hablás?</p>
            <a href="https://wa.me/595973623941?text=Hola%2C%20quiero%20consultar%20sobre%20un%20proyecto"
               class="whatsapp-menu-item" target="_blank" rel="noopener">
                <strong>Proyectos</strong>
                <span>+595 973 623 941</span>
            </a>
            <a href="https://wa.me/595974126305?text=Hola%2C%20quiero%20hablar%20con%20Ventas"
               class="whatsapp-menu-item" target="_blank" rel="noopener">
                <strong>Ventas</strong>
                <span>+595 974 126 305</span>
            </a>
        </div>
        <button type="button" class="whatsapp-btn" aria-expanded="false" aria-controls="whatsapp-menu" aria-label="Abrir menú de WhatsApp">
            <i class="fab fa-whatsapp" aria-hidden="true"></i>
        </button>
    </div>
""".strip()

BTN_RE = re.compile(
    r'<a\s+href="https://wa\.me/595973623941"[^>]*class="whatsapp-btn"[^>]*>\s*'
    r'(?:<i class="fab fa-whatsapp"[^>]*></i>\s*)?</a>',
    re.IGNORECASE | re.DOTALL,
)


def script_tag(html_path: Path) -> str:
    prefix = "../" if "blog" in html_path.parts and html_path.parent.name == "blog" else ""
    return f'<script src="{prefix}assets/js/whatsapp-menu.js" defer></script>'


def update_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    if "whatsapp-widget" not in text:
        text, n = BTN_RE.subn(WIDGET, text, count=1)
        if n == 0:
            print(f"skip (no floating btn): {path.relative_to(ROOT)}")
            return False

    tag = script_tag(path)
    if "whatsapp-menu.js" not in text:
        if "analytics-events.js" in text:
            text = re.sub(
                r'(<script src="(?:\.\./)?assets/js/analytics-events\.js" defer></script>)',
                tag + r"\n    \1",
                text,
                count=1,
            )
        else:
            text = text.replace("</body>", f"    {tag}\n</body>")

    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"ok {path.relative_to(ROOT)}")
        return True

    print(f"unchanged {path.relative_to(ROOT)}")
    return False


def main() -> None:
    files = list(ROOT.glob("*.html")) + list((ROOT / "blog").glob("*.html"))
    for path in sorted(files):
        update_file(path)


if __name__ == "__main__":
    main()
