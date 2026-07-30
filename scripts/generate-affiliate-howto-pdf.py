"""Generate a simple HOW TO USE AFFILIATE PDF for REVE Clothing."""
from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parents[1] / "public" / "REVE-Affiliate-How-To-Use.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

# Brand-ish dark + red accent (print-safe)
BLACK = (20, 20, 20)
GRAY = (90, 90, 90)
LIGHT = (245, 245, 245)
ACCENT = (180, 40, 40)
WHITE = (255, 255, 255)


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*GRAY)
        self.cell(0, 8, "REVE Clothing  |  How to Use Affiliate", align="L")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*GRAY)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}  |  reveclothingxnobody.com", align="C")


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
    # Ensure room for the box
    needed = 18 + len(lines) * 6
    if pdf.get_y() + needed > pdf.h - 25:
        pdf.add_page()

    x = pdf.l_margin
    y = pdf.get_y()
    w = pdf.epw

    # Soft background
    pdf.set_fill_color(*LIGHT)
    pdf.rect(x, y, w, needed, style="F")

    # Number circle-ish
    pdf.set_xy(x + 4, y + 4)
    pdf.set_fill_color(*ACCENT)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(10, 10, str(number), align="C", fill=True)

    pdf.set_xy(x + 18, y + 4)
    pdf.set_text_color(*BLACK)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")

    pdf.set_x(x + 18)
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
    pdf = GuidePDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(18, 18, 18)
    pdf.add_page()

    # Cover / title
    pdf.set_fill_color(*BLACK)
    pdf.rect(0, 0, 210, 52, style="F")
    pdf.set_y(16)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 6, "REVE CLOTHING", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(0, 10, "How to Use Affiliate", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, "Simple guide for partners  |  Earn 10% on confirmed paid orders", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_y(60)
    section_title(pdf, "What is this?")
    body(
        pdf,
        "The REVE Affiliate program lets you share a personal link. When someone buys through your link "
        "and the order is paid/confirmed, you earn commission (default 10% of the product subtotal).",
    )
    muted(
        pdf,
        "Website: https://www.reveclothingxnobody.com\n"
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
            "REVE admin must approve you before your link works for commission.",
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

    section_title(pdf, "Best practices (easy wins)")
    body(
        pdf,
        "1. Always share YOUR link (not the plain homepage).\n"
        "2. Tell people what to buy and why you like REVE.\n"
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
        "A: Contact REVE Clothing support to ask about reactivation.\n\n"
        "Q: Who do I contact for help?\n"
        "A: Use the website contact form, or message REVE on Facebook.",
    )

    section_title(pdf, "Need help?")
    body(
        pdf,
        "Website: https://www.reveclothingxnobody.com\n"
        "Affiliate join: /affiliate/join\n"
        "Affiliate login: /affiliate/login\n"
        "Affiliate dashboard: /affiliate/dashboard",
    )
    muted(pdf, "Thank you for sharing REVE with your community. Timing is Everything.")

    pdf.output(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
