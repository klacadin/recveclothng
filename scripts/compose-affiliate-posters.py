"""Overlay official REVE + NOBODY logos onto the original affiliate invite posters."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
REVE = ROOT / "src" / "assets" / "reve-logo.jpg"
NOBODY = ROOT / "src" / "assets" / "nobody-logo.png"
OUT_DIR = ROOT / "public" / "marketing"
BASE_SQUARE = OUT_DIR / "_base-affiliate-invite-square.png"
BASE_STORY = OUT_DIR / "_base-affiliate-invite-story.png"
OUT_DIR.mkdir(parents=True, exist_ok=True)

WHITE = (245, 245, 245)
MUTED = (200, 200, 200)


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
    return ImageOps.contain(img, (max_w, max_h), method=Image.Resampling.LANCZOS)


def paste_center(base: Image.Image, overlay: Image.Image, cy: int):
    x = (base.width - overlay.width) // 2
    y = cy - overlay.height // 2
    base.alpha_composite(overlay, (x, max(0, y)))


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill, width: int):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]


def cover_top_brand(canvas: Image.Image, cover_bottom_y: int):
    """Fully mask the original wordmark zone so real logos read cleanly."""
    w, _h = canvas.size
    veil = Image.new("RGBA", (w, cover_bottom_y), (0, 0, 0, 255))
    fade_h = max(16, cover_bottom_y // 12)
    fade = Image.new("RGBA", (w, fade_h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fade)
    for i in range(fade_h):
        alpha = int(255 * (1 - i / fade_h))
        fd.line([(0, i), (w, i)], fill=(0, 0, 0, alpha))
    canvas.alpha_composite(veil, (0, 0))
    canvas.alpha_composite(fade, (0, cover_bottom_y))


def compose(base_path: Path, out_name: str, story: bool):
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    canvas = base.copy()

    if story:
        cover_y = int(h * 0.195)
        cover_top_brand(canvas, cover_y)
        reve = prepare_logo(REVE, int(w * 0.40), int(h * 0.11))
        nobody = prepare_logo(NOBODY, int(w * 0.68), int(h * 0.042))
        paste_center(canvas, reve, int(h * 0.075))
        draw = ImageDraw.Draw(canvas)
        x_font = load_font(int(h * 0.026), bold=True)
        draw_centered(draw, "×", int(h * 0.125), x_font, WHITE, w)
        paste_center(canvas, nobody, int(h * 0.155))
        lockup_font = load_font(int(h * 0.015), bold=True)
        draw_centered(draw, "Reve Clothing x Nobody", int(h * 0.185), lockup_font, MUTED, w)
    else:
        # Kill original REVE CLOTHING + GAWANG block; keep mountain + EARN 10%
        cover_y = int(h * 0.455)
        cover_top_brand(canvas, cover_y)
        reve = prepare_logo(REVE, int(w * 0.30), int(h * 0.13))
        nobody = prepare_logo(NOBODY, int(w * 0.56), int(h * 0.045))
        paste_center(canvas, reve, int(h * 0.11))
        draw = ImageDraw.Draw(canvas)
        x_font = load_font(int(h * 0.028), bold=True)
        draw_centered(draw, "×", int(h * 0.19), x_font, WHITE, w)
        paste_center(canvas, nobody, int(h * 0.24))
        lockup_font = load_font(int(h * 0.02), bold=True)
        draw_centered(draw, "Reve Clothing x Nobody", int(h * 0.295), lockup_font, MUTED, w)
        line_y = int(h * 0.34)
        draw.rectangle([int(w * 0.28), line_y, int(w * 0.72), line_y + 3], fill=(180, 40, 40, 255))
        tag_font = load_font(int(h * 0.016), bold=True)
        draw_centered(draw, "Nobody by Reve Clothing", int(h * 0.36), tag_font, MUTED, w)

    out = OUT_DIR / out_name
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Wrote {out} ({w}x{h})")


if __name__ == "__main__":
    # Prefer committed bases; fall back to restored _old copies if needed
    square_base = BASE_SQUARE if BASE_SQUARE.exists() else OUT_DIR / "_old-square.png"
    story_base = BASE_STORY if BASE_STORY.exists() else OUT_DIR / "_old-story.png"
    if not square_base.exists() or not story_base.exists():
        raise SystemExit(
            "Missing base posters. Expected "
            f"{BASE_SQUARE.name} / {BASE_STORY.name} (or _old-*.png)."
        )
    # Normalize names for future runs
    if square_base != BASE_SQUARE:
        Image.open(square_base).save(BASE_SQUARE, "PNG")
        square_base = BASE_SQUARE
    if story_base != BASE_STORY:
        Image.open(story_base).save(BASE_STORY, "PNG")
        story_base = BASE_STORY

    compose(square_base, "reve-affiliate-invite-square.png", story=False)
    compose(story_base, "reve-affiliate-invite-story.png", story=True)
