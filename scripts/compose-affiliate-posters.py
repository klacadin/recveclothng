"""Compose affiliate invite posters using official REVE + NOBODY logos."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
REVE = ROOT / "src" / "assets" / "reve-logo.jpg"
NOBODY = ROOT / "src" / "assets" / "nobody-logo.png"
OUT_DIR = ROOT / "public" / "marketing"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BLACK = (8, 8, 8)
WHITE = (245, 245, 245)
MUTED = (180, 180, 180)
RED = (180, 40, 40)


def load_font(size: int, bold: bool = False):
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def prepare_logo(path: Path, max_w: int, max_h: int) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    # Keep black logos readable on black bg by ensuring contrast crop
    img = ImageOps.contain(img, (max_w, max_h), method=Image.Resampling.LANCZOS)
    return img


def paste_center(base: Image.Image, overlay: Image.Image, cy: int):
    x = (base.width - overlay.width) // 2
    y = cy - overlay.height // 2
    base.alpha_composite(overlay, (x, y))


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill, width: int):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]


def make_poster(size: tuple[int, int], out_name: str, story: bool = False):
    w, h = size
    canvas = Image.new("RGBA", (w, h), BLACK + (255,))
    draw = ImageDraw.Draw(canvas)

    # Soft vignette
    vignette = Image.new("L", (w, h), 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-w // 4, -h // 8, w + w // 4, h + h // 8), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new("RGBA", (w, h), (0, 0, 0, 90))
    canvas = Image.composite(canvas, dark, ImageOps.invert(vignette))
    draw = ImageDraw.Draw(canvas)

    # Brand logos
    if story:
        reve = prepare_logo(REVE, int(w * 0.55), int(h * 0.20))
        nobody = prepare_logo(NOBODY, int(w * 0.72), int(h * 0.07))
        paste_center(canvas, reve, int(h * 0.16))
        x_font = load_font(int(h * 0.032), bold=True)
        draw_centered(draw, "×", int(h * 0.28), x_font, WHITE, w)
        paste_center(canvas, nobody, int(h * 0.34))
        lockup_y = int(h * 0.41)
        headline_y = int(h * 0.49)
        support_y = int(h * 0.57)
        cta_y = int(h * 0.78)
    else:
        reve = prepare_logo(REVE, int(w * 0.40), int(h * 0.26))
        nobody = prepare_logo(NOBODY, int(w * 0.62), int(h * 0.08))
        paste_center(canvas, reve, int(h * 0.20))
        x_font = load_font(int(h * 0.045), bold=True)
        draw_centered(draw, "×", int(h * 0.36), x_font, WHITE, w)
        paste_center(canvas, nobody, int(h * 0.45))
        lockup_y = int(h * 0.54)
        headline_y = int(h * 0.62)
        support_y = int(h * 0.70)
        cta_y = int(h * 0.82)

    lockup_font = load_font(int(h * (0.024 if story else 0.028)), bold=True)
    draw_centered(draw, "REVE CLOTHING  x  NOBODY", lockup_y, lockup_font, WHITE, w)

    headline_font = load_font(int(h * (0.048 if story else 0.055)), bold=True)
    draw_centered(draw, "Earn 10% sharing REVE", headline_y, headline_font, WHITE, w)

    support_font = load_font(int(h * (0.022 if story else 0.024)))
    support = (
        "Free to join. Share your unique link.\nEarn on confirmed paid orders."
        if story
        else "Join our affiliate program. Share your link.\nGet paid on confirmed orders."
    )
    # multi-line support
    lines = support.split("\n")
    y = support_y
    for line in lines:
        lh = draw_centered(draw, line, y, support_font, MUTED, w)
        y += lh + int(h * 0.01)

    # CTA bar
    pad_x = int(w * 0.12)
    bar_h = int(h * (0.08 if story else 0.09))
    bar = Image.new("RGBA", (w - 2 * pad_x, bar_h), RED + (255,))
    canvas.alpha_composite(bar, (pad_x, cta_y))
    cta_font = load_font(int(h * 0.028), bold=True)
    url_font = load_font(int(h * 0.018))
    draw_centered(draw, "Become an affiliate", cta_y + int(bar_h * 0.18), cta_font, WHITE, w)
    draw_centered(
        draw,
        "reveclothingxnobody.com/affiliate/join",
        cta_y + int(bar_h * 0.55),
        url_font,
        WHITE,
        w,
    )

    out = OUT_DIR / out_name
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Wrote {out}")


if __name__ == "__main__":
    make_poster((1080, 1080), "reve-affiliate-invite-square.png", story=False)
    make_poster((1080, 1920), "reve-affiliate-invite-story.png", story=True)
