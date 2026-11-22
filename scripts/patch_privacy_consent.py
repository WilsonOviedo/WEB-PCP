"""Parchea HTML: quita GTM/Pixel inline, agrega consent + links legales."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LEGAL_NAV = """            <nav class="footer-legal" aria-label="Información legal">
                <a href="/politica-privacidad">Política de Privacidad</a>
                <a href="/politica-cookies">Política de Cookies</a>
                <a href="/terminos-condiciones">Términos y Condiciones</a>
                <button type="button" class="footer-cookie-settings" data-cookie-settings>Configurar cookies</button>
            </nav>
"""

GTM_HEAD = re.compile(
    r"<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->\s*",
    re.DOTALL | re.IGNORECASE,
)
GTM_NOSCRIPT = re.compile(
    r"<!-- Google Tag Manager \(noscript\) -->.*?<!-- End Google Tag Manager \(noscript\) -->\s*",
    re.DOTALL | re.IGNORECASE,
)
META_BLOCK = re.compile(
    r"<!-- Meta Pixel Code -->.*?<!-- End Meta Pixel Code -->\s*",
    re.DOTALL | re.IGNORECASE,
)
# Variante sin comentarios (páginas de servicio)
META_SCRIPT_LOOSE = re.compile(
    r"<script>\s*!function\(f,b,e,v,n,t,s\).*?fbq\('track',\s*'PageView'\);\s*</script>\s*"
    r"(?:<noscript>.*?</noscript>\s*)?",
    re.DOTALL,
)
PRECONNECT_GTM = re.compile(
    r'\s*<link rel="preconnect" href="https://www\.googletagmanager\.com"[^>]*>\s*'
    r'(?:<link rel="dns-prefetch" href="https://www\.googletagmanager\.com"[^>]*>\s*)?',
    re.IGNORECASE,
)


def asset_prefix(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return "../" if rel.startswith("blog/") else ""


def ensure_css(text: str, prefix: str) -> str:
    href = f'{prefix}assets/css/cookie-consent.css'
    if "cookie-consent.css" in text:
        return text
    link = f'    <link rel="stylesheet" href="{href}">\n'
    if "footer.css" in text:
        return text.replace(
            f'<link rel="stylesheet" href="{prefix}assets/css/footer.css">',
            f'<link rel="stylesheet" href="{prefix}assets/css/footer.css">\n{link.rstrip()}',
            1,
        )
    return text.replace("</head>", link + "</head>", 1)


def ensure_js(text: str, prefix: str) -> str:
    src = f'{prefix}assets/js/cookie-consent.js'
    if "cookie-consent.js" in text:
        return text
    tag = f'    <script src="{src}" defer></script>\n'
    return text.replace("</body>", tag + "</body>", 1)


def ensure_footer_legal(text: str) -> str:
    if 'class="footer-legal"' in text or "footer-legal" in text:
        return text

    def inject(match: re.Match[str]) -> str:
        block = match.group(0)
        if "footer-legal" in block:
            return block
        return block.replace("</div>", LEGAL_NAV + "        </div>", 1)

    return re.sub(
        r'<div class="footer-bottom">.*?</div>',
        inject,
        text,
        count=1,
        flags=re.DOTALL,
    )


def strip_tracking(text: str) -> str:
    text = GTM_HEAD.sub("", text)
    text = GTM_NOSCRIPT.sub("", text)
    text = META_BLOCK.sub("", text)
    text = META_SCRIPT_LOOSE.sub("", text)
    text = PRECONNECT_GTM.sub("\n", text)
    return text


def patch_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text = original
    prefix = asset_prefix(path)

    text = strip_tracking(text)
    text = ensure_css(text, prefix)
    text = ensure_js(text, prefix)
    text = ensure_footer_legal(text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts:
            continue
        if patch_file(path):
            changed.append(path.relative_to(ROOT).as_posix())
    print(f"Updated {len(changed)} files:")
    for c in changed:
        print(" -", c)


if __name__ == "__main__":
    main()
