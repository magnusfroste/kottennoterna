#!/usr/bin/env python3
"""Ritar appikoner, favicon, og-bild och manifest för Kotten och nöterna.
Ingen tredjepart. Ikonen: två staplar av olika höjd – 'fler eller färre' – vilket
är appens mekanik och överlever 48 px (två tjocka former, inga tunna streck)."""
import json
import pathlib

from PIL import Image, ImageDraw, ImageFont

P = pathlib.Path(__file__).parent / "public"
P.mkdir(exist_ok=True)
ACCENT = (47, 125, 90, 255)     # tallgrön, Kotten-familjens accent
PAPPER = (250, 247, 242, 255)
BLACK = (20, 24, 31, 255)


def staplar(d, N, fg):
    """Två staplar: hög till vänster, låg till höger (flest vs färst)."""
    w = N * 0.20
    bas = N * 0.80
    d.rounded_rectangle([N * 0.20, N * 0.22, N * 0.20 + w, bas], radius=w * 0.30, fill=fg)
    d.rounded_rectangle([N * 0.60, N * 0.46, N * 0.60 + w, bas], radius=w * 0.30, fill=fg)


def ikon(N):
    ss = 4
    im = Image.new("RGBA", (N * ss, N * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N * ss - 1, N * ss - 1], radius=N * ss * 0.23, fill=ACCENT)
    staplar(d, N * ss, (255, 255, 255, 255))
    return im.resize((N, N), Image.LANCZOS)


def favicon():
    N = 512
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N - 1, N - 1], radius=N * 0.23, fill=ACCENT)
    staplar(d, N, (255, 255, 255, 255))
    im.save(P / "favicon.png")
    (P / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
        '<rect width="100" height="100" rx="23" fill="#2f7d5a"/>'
        '<g fill="#fff"><rect x="20" y="22" width="20" height="58" rx="6"/>'
        '<rect x="60" y="46" width="20" height="34" rx="6"/></g></svg>',
        encoding="utf-8")


def og():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), PAPPER)
    d = ImageDraw.Draw(im)
    ico = ikon(160)
    im.paste(ico, (int(W / 2 - 80), 60), ico)
    font = small = None
    for path in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if pathlib.Path(path).exists():
            font = ImageFont.truetype(path, 92)
            small = ImageFont.truetype(path, 38)
            break
    if font:
        for t, y, f, col in (
            ("Kotten och nöterna", 260, font, BLACK),
            ("Vilken sida har flest? · matematik FK–2", 380, small, (74, 82, 96)),
            ("Gratis · ingen inloggning · skolappar.com", 460, small, (120, 126, 136)),
        ):
            d.text((W / 2 - d.textlength(t, font=f) / 2, y), t, fill=col, font=f)
    im.save(P / "og.png")


def main():
    favicon()
    ikon(192).save(P / "icon-192.png")
    ikon(512).save(P / "icon-512.png")
    ikon(512).convert("RGB").resize((512, 512), Image.LANCZOS).save(P / "icon-maskable-512.png")
    ikon(180).save(P / "apple-touch-icon.png")
    og()
    (P / "site.webmanifest").write_text(json.dumps({
        "name": "Kotten och nöterna – vilken sida har flest?",
        "short_name": "Nöterna",
        "lang": "sv",
        "start_url": "/",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#faf7f2",
        "theme_color": "#2f7d5a",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (P / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: https://kottennoterna.skolappar.com/sitemap.xml\n", encoding="utf-8")
    (P / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        '<url><loc>https://kottennoterna.skolappar.com/</loc></url>\n</urlset>\n', encoding="utf-8")
    print("skrev ikoner, favicon, og.png, manifest, robots, sitemap till", P)


if __name__ == "__main__":
    main()
