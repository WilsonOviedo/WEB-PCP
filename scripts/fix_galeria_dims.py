from pathlib import Path
import re

p = Path("galeria.html")
text = p.read_text(encoding="utf-8")

def repl(match: re.Match[str]) -> str:
    tag = match.group(0)
    if "width=" in tag:
        return tag
    return tag[:-1] + ' width="800" height="800">'

updated = re.sub(r'<img src="assets/img/trabajos/[^"]+"[^>]*>', repl, text)
p.write_text(updated, encoding="utf-8")
print("galeria dims ok")
