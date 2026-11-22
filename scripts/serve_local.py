"""Servidor estático local con URLs limpias (como nginx try_files)."""
from __future__ import annotations

import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PORT = 8080


class CleanURLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):  # noqa: N802
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        query = f"?{parsed.query}" if parsed.query else ""

        candidates = []
        if path.endswith("/"):
            candidates.append(path + "index.html")
        else:
            bare = path.rstrip("/")
            name = bare.rsplit("/", 1)[-1]
            if name.endswith(".html"):
                name = name[:-5]
            candidates.extend(
                [
                    path,
                    f"{bare}.html" if not bare.endswith(".html") else bare,
                    f"{bare}/index.html",
                    # artículos del blog también resolubles desde la raíz
                    f"/blog/{name}.html",
                    f"/blog/{name}",
                ]
            )

        seen = set()
        for candidate in candidates:
            rel = candidate.lstrip("/")
            if not rel or rel in seen:
                continue
            seen.add(rel)
            file_path = (ROOT / rel).resolve()
            try:
                file_path.relative_to(ROOT)
            except ValueError:
                continue
            if file_path.is_file():
                self.path = "/" + rel.replace("\\", "/") + query
                return SimpleHTTPRequestHandler.do_GET(self)

        self.send_error(404, "File not found")


def main() -> None:
    mimetypes.add_type("image/webp", ".webp")
    mimetypes.add_type("image/avif", ".avif")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), CleanURLHandler)
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/")
    print("Clean URLs enabled (e.g. /blog/articulo -> articulo.html)")
    server.serve_forever()


if __name__ == "__main__":
    main()
