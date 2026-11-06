"""Generate HOW TO USE AFFILIATE PDF with official logos."""
from pathlib import Path

from fpdf import FPDF
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "REVE-Affiliate-How-To-Use.pdf"
DOCS_OUT = ROOT / "docs" / "REVE-Affiliate-How-To-Use.pdf"
REVE_LOGO = ROOT / "src" / "assets" / "reve-logo.jpg"
NOBODY_LOGO = ROOT / "src" / "assets" / "nobody-logo.png"
TMP = ROOT / "scripts" / ".tmp-pdf-assets"
OUT.parent.mkdir(parents=True, exist_ok=True)
DOCS_OUT.parent.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

BRAND = "Reve Clothing x Nobody"
BRAND_ALT = "Nobody by Reve Clothing"
BLACK = (20, 20, 20)
GRAY = (90, 90, 90)
LIGHT = (245, 245, 245)
ACCENT = (180, 40, 40)
WHITE = (255, 255, 255)


def prep_logo(src: Path, name: str, max_w: int, max_h: int) -> Path:
    """Save a RGB/PNG suitable for fpdf on white or dark contexts."""
    img = Image.open(src).convert("RGBA")
    img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    # Place on white card so black-bg logos stay visible in PDF
    canvas = Image.new("RGB", (img.width + 16, img.height + 16), (255, 255, 255))
    canvas.paste(img, (8, 8), img)
    dest = TMP / name
    canvas.save(dest, "PNG")
    return dest


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*GRAY)
        self.cell(0, 8, f"{BRAND}  |  How to Use Affiliate", align="L")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*GRAY)
        self.cell(
            0,
            10,
            f"Page {self.page_no()}/{{nb}}  |  {BRAND}  |  reveclothingxnobody.com",
            align="C",
        )


def section_title(pdf: GuidePDF, text: str):
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(*BLACK)
    pdf.ln(4)
    pdf.cell(0, 10, text, new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.6)
    y = pdf.get_y()
    pdf.line(pdf.l_margin, y, pdf.l_margin + 40, y)
    pdf.ln(6)


def body(pdf: GuidePDF, text: str, size=11):
    pdf.set_font("Helvetica", "", size)
    pdf.set_text_color(*BLACK)
    pdf.multi_cell(0, 6, text)
    pdf.ln(2)


def muted(pdf: GuidePDF, text: str):
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*GRAY)
    pdf.multi_cell(0, 5.5, text)
    pdf.ln(2)


def step_box(pdf: GuidePDF, number: int, title: str, lines: list[str]):
    needed = 18 + len(lines) * 6
    if pdf.get_y() + needed > pdf.h - 25:
        pdf.add_page()

    x = pdf.l_margin
    y = pdf.get_y()
    w = pdf.epw

    pdf.set_fill_color(*LIGHT)
    pdf.rect(x, y, w, needed, style="F")

    pdf.set_xy(x + 4, y + 4)
    pdf.set_fill_color(*ACCENT)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(10, 10, str(number), align="C", fill=True)

    pdf.set_xy(x + 18, y + 4)
    pdf.set_text_color(*BLACK)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*BLACK)
    for line in lines:
        pdf.set_x(x + 18)
        pdf.multi_cell(w - 22, 5.5, f"- {line}")

    pdf.set_y(y + needed + 4)


def tip_box(pdf: GuidePDF, title: str, text: str):
    if pdf.get_y() + 28 > pdf.h - 25:
        pdf.add_page()
    x = pdf.l_margin
    y = pdf.get_y()
    w = pdf.epw
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.8)
    pdf.set_fill_color(255, 248, 248)
    pdf.rect(x, y, w, 26, style="FD")
    pdf.set_xy(x + 4, y + 3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(x + 4)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*BLACK)
    pdf.multi_cell(w - 8, 5, text)
    pdf.set_y(y + 30)


def main():
    reve_png = prep_logo(REVE_LOGO, "reve-logo-pdf.png", 420, 420)
    nobody_png = prep_logo(NOBODY_LOGO, "nobody-logo-pdf.png", 520, 160)

    pdf = GuidePDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(18, 18, 18)
    pdf.add_page()

    # Cover bar
    pdf.set_fill_color(*BLACK)
    pdf.rect(0, 0, 210, 62, style="F")

    # Logos on white cards inside the dark header area
    pdf.image(str(reve_png), x=28, y=8, h=28)
    pdf.set_xy(78, 16)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(*WHITE)
    pdf.cell(20, 12, "x", align="C")
    pdf.image(str(nobody_png), x=100, y=14, h=16)

    pdf.set_y(40)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 6, BRAND, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 6, BRAND_ALT, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 9, "How to Use Affiliate", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(
        0,
        6,
        "Simple guide for partners  |  Earn 10% on confirmed paid orders",
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.set_y(70)
    section_title(pdf, "What is this?")
    body(
        pdf,
        f"The {BRAND} Affiliate program lets you share a personal link. When someone buys "
        "through your link and the order is paid/confirmed, you earn commission "
        "(default 10% of the product subtotal).",
    )
    muted(
        pdf,
        "Website: https://www.reveclothingxnobody.com\n"
        "Guide: https://www.reveclothingxnobody.com/affiliate/guide\n"
        "Join: https://www.reveclothingxnobody.com/affiliate/join\n"
        "Login: https://www.reveclothingxnobody.com/affiliate/login\n"
        "Dashboard: https://www.reveclothingxnobody.com/affiliate/dashboard",
    )

    section_title(pdf, "Quick start (5 steps)")
    step_box(
        pdf,
        1,
        "Create your account",
        [
            "Open the Join page (link above).",
            "Enter your name, email, and password.",
            "Enter the email verification code if asked.",
        ],
    )
    step_box(
        pdf,
        2,
        "Apply as an affiliate",
        [
            "After login, choose an 8-character code (letters/numbers only).",
            "Example code: reve2026",
            "Submit your application.",
        ],
    )
    step_box(
        pdf,
        3,
        "Wait for approval",
        [
            "Your status starts as PENDING.",
            f"{BRAND} admin must approve you before your link earns commission.",
            "You will see ACTIVE when approved.",
        ],
    )
    step_box(
        pdf,
        4,
        "Copy your unique link",
        [
            "Go to Affiliate Dashboard.",
            "Click Copy next to your link.",
            "Your link looks like: https://www.reveclothingxnobody.com/affiliate/YOURCODE",
        ],
    )
    step_box(
        pdf,
        5,
        "Share and earn",
        [
            "Share your link on Facebook, Instagram, Messenger, TikTok, SMS, etc.",
            "Use the official invite posters from /affiliate/guide.",
            "When a shopper clicks your link, they are remembered for 30 days.",
            "You earn when their order is confirmed paid (not when they only click).",
        ],
    )

    pdf.add_page()
    section_title(pdf, "How earnings work")
    body(
        pdf,
        "Commission is based on product subtotal (items only).\n"
        "Shipping and convenience fees are NOT included in commission.\n"
        "Default rate is 10%. Your exact rate is shown in your dashboard.",
    )
    muted(
        pdf,
        "Example:\n"
        "  Customer buys items totaling PHP 1,000 (product subtotal).\n"
        "  Your rate is 10%.\n"
        "  You earn PHP 100 when the order is confirmed paid.",
    )

    tip_box(
        pdf,
        "Important",
        "Clicks alone do not pay. Only confirmed paid orders attributed to your link count.",
    )

    section_title(pdf, "Dashboard basics")
    body(
        pdf,
        "On your dashboard you can:\n"
        "- Copy your affiliate link\n"
        "- See your status (pending / active / inactive)\n"
        "- See confirmed orders, total sales, and total earnings\n"
        "- See a list of recent commissions\n"
        "- Change your 8-character code (if available)",
    )

    section_title(pdf, "Share assets")
    body(
        pdf,
        "Download ready-made posters from the Affiliate Guide page:\n"
        "https://www.reveclothingxnobody.com/affiliate/guide\n\n"
        "- Square poster for Facebook / Instagram feed\n"
        "- Story poster for Instagram / Facebook Stories\n"
        "Always pair posters with YOUR unique affiliate link.",
    )

    section_title(pdf, "Best practices (easy wins)")
    body(
        pdf,
        "1. Always share YOUR link (not the plain homepage).\n"
        "2. Tell people what to buy and why you like Nobody by Reve Clothing.\n"
        "3. Ask shoppers to check out on the same phone/browser within 30 days.\n"
        "4. Keep your code short and memorable (8 characters).\n"
        "5. Check your dashboard weekly for earnings.",
    )

    tip_box(
        pdf,
        "Tip",
        "If someone opens your link, then buys later on the same device/browser within 30 days, the order can still count for you.",
    )

    section_title(pdf, "Common questions")
    body(
        pdf,
        "Q: Why am I pending?\n"
        "A: New affiliates need admin approval. This is normal.\n\n"
        "Q: When do I get paid commission credit?\n"
        "A: After the customer's order is confirmed paid/completed in the system.\n\n"
        "Q: Can I change my code?\n"
        "A: Yes, from the dashboard (must be exactly 8 letters/numbers).\n\n"
        "Q: What if my account is inactive?\n"
        f"A: Contact {BRAND} support to ask about reactivation.\n\n"
        "Q: Who do I contact for help?\n"
        "A: Use the website contact form, or message REVE on Facebook.",
    )

    section_title(pdf, "Need help?")
    body(
        pdf,
        f"{BRAND}\n"
        "Website: https://www.reveclothingxnobody.com\n"
        "Guide: /affiliate/guide\n"
        "Join: /affiliate/join\n"
        "Login: /affiliate/login\n"
        "Dashboard: /affiliate/dashboard",
    )
    muted(pdf, f"Thank you for sharing {BRAND} with your community. Timing is Everything.")

    pdf.output(OUT)
    pdf.output(DOCS_OUT)
    print(f"Wrote {OUT}")
    print(f"Wrote {DOCS_OUT}")


if __name__ == "__main__":
    main()
