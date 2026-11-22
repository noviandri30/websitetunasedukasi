#!/usr/bin/env python3
"""Validate Tunas Edukasi multi-page static website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(ROOT.glob("*.html"))
assert len(PAGES) == 11, f"Expected 11 pages, got {len(PAGES)}"

class Inspect(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=set()
        self.links=[]
        self.assets=[]
        self.errors=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get("id"): self.ids.add(a["id"])
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "img":
            if not a.get("alt"): self.errors.append("image missing alt")
            if a.get("src"): self.assets.append(a["src"])
        if tag == "script" and a.get("src"): self.assets.append(a["src"])
        if tag == "link" and a.get("href") and a["href"].startswith("assets/"): self.assets.append(a["href"])

errors=[]
for page in PAGES:
    p=Inspect()
    content=page.read_text(encoding="utf-8")
    p.feed(content)
    errors.extend(f"{page.name}: {e}" for e in p.errors)
    if "<html lang=\"id\"" not in content: errors.append(f"{page.name}: missing language")
    for asset in p.assets:
        if asset.startswith(("http://","https://","data:")): continue
        if not (ROOT / asset).is_file(): errors.append(f"{page.name}: missing asset {asset}")
    for href in p.links:
        if href.startswith(("http://","https://","mailto:","tel:","data:")): continue
        base,_,fragment=href.partition("#")
        target=(ROOT / base) if base else page
        if not target.is_file(): errors.append(f"{page.name}: broken link {href}"); continue
        if fragment:
            destination=Inspect()
            destination.feed(target.read_text(encoding="utf-8"))
            if fragment not in destination.ids: errors.append(f"{page.name}: broken anchor {href}")
if errors:
    print("\n".join(errors))
    sys.exit(1)
subprocess.run(["node","--check",str(ROOT / "assets/app.js")],check=True)
print(f"PASS: {len(PAGES)} pages, internal links, assets, alt text, JavaScript syntax")
