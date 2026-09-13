"""Optimiza imágenes para Core Web Vitals (WebP/AVIF + variantes responsive)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "assets" / "img"
REPORT: list[str] = []


def save_webp(im: Image.Image, dest: Path, quality: int = 78, method: int = 6) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGBA") if im.mode in ("P", "RGBA") else im.convert("RGB")
    if dest.suffix.lower() == ".webp" and rgb.mode == "RGBA":
        rgb.save(dest, "WEBP", quality=quality, method=method)
    else:
        rgb.convert("RGB").save(dest, "WEBP", quality=quality, method=method)


def try_avif(im: Image.Image, dest: Path, quality: int = 55) -> bool:
    try:
        rgb = im.convert("RGB")
        rgb.save(dest, "AVIF", quality=quality)
        return True
    except Exception as exc:  # noqa: BLE001
        REPORT.append(f"AVIF skip {dest.name}: {exc}")
        return False


def resize_max(im: Image.Image, max_w: int, max_h: int | None = None) -> Image.Image:
    w, h = im.size
    max_h = max_h or 10_000
    scale = min(max_w / w, max_h / h, 1.0)
    if scale >= 1:
        return im
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def optimize_hero() -> None:
    hero_dir = IMG / "hero"
    for path in sorted(hero_dir.glob("*.webp")):
        if "-w" in path.stem:
            continue
        with Image.open(path) as im:
            original = path.stat().st_size
            # Variantes responsive solo para LCP (hero5)
            if path.name == "hero5.webp":
                for width in (768, 1280, 1920):
                    variant = resize_max(im, width)
                    out = hero_dir / f"hero5-w{width}.webp"
                    save_webp(variant, out, quality=76 if width < 1920 else 78)
                    avif = hero_dir / f"hero5-w{width}.avif"
                    try_avif(variant, avif, quality=48)
                    REPORT.append(f"hero variant {out.name} {out.stat().st_size // 1024}KB")

            # Recomprimir original a max 1920
            recompressed = resize_max(im, 1920)
            tmp = path.with_suffix(".tmp.webp")
            q = 72 if path.stat().st_size > 200_000 else 78
            save_webp(recompressed, tmp, quality=q)
            if tmp.stat().st_size < original:
                tmp.replace(path)
                REPORT.append(
                    f"hero recompress {path.name}: {original // 1024}KB -> {path.stat().st_size // 1024}KB"
                )
            else:
                tmp.unlink(missing_ok=True)


def optimize_client_logos() -> None:
    logo_dir = IMG / "client_logo"
    for path in sorted(logo_dir.glob("*.webp")):
        with Image.open(path) as im:
            original = path.stat().st_size
            # Se muestran a ~58px alto; 240px de alto alcanza retina
            resized = resize_max(im, 480, 240)
            tmp = path.with_suffix(".tmp.webp")
            save_webp(resized, tmp, quality=80)
            if tmp.stat().st_size < original * 0.95:
                tmp.replace(path)
                REPORT.append(
                    f"logo {path.name}: {original // 1024}KB -> {path.stat().st_size // 1024}KB "
                    f"({resized.size[0]}x{resized.size[1]})"
                )
            else:
                tmp.unlink(missing_ok=True)


def optimize_folder(folder: Path, max_w: int = 1400, quality: int = 75) -> None:
    if not folder.exists():
        return
    for path in sorted(folder.glob("*.webp")):
        if "-w" in path.stem:
            continue
        with Image.open(path) as im:
            original = path.stat().st_size
            resized = resize_max(im, max_w)
            tmp = path.with_suffix(".tmp.webp")
            save_webp(resized, tmp, quality=quality)
            if tmp.stat().st_size < original * 0.92:
                tmp.replace(path)
                REPORT.append(
                    f"{folder.name}/{path.name}: {original // 1024}KB -> {path.stat().st_size // 1024}KB"
                )
            else:
                tmp.unlink(missing_ok=True)


def main() -> None:
    optimize_hero()
    optimize_client_logos()
    optimize_folder(IMG / "trabajos", max_w=1200, quality=74)
    optimize_folder(IMG / "fabrica_tableros", max_w=1200, quality=74)
    optimize_folder(IMG / "blog" / "yerba_mate", max_w=1400, quality=75)
    print("\n".join(REPORT) or "No changes")


if __name__ == "__main__":
    main()
