import { describe, expect, it } from "vitest";
import type { EventRegistration } from "@/types/app-database";
import { buildRunnerExportRows, first150SouvenirRecipients, slugForExportFilename, toCsv } from "./event-registration-export";

function registration(overrides: Partial<EventRegistration> = {}): EventRegistration {
  return {
    id: "r1",
    event_id: "e1",
    full_name: "Ana Cruz",
    email: "ana@example.com",
    phone: "09171234567",
    company: null,
    shirt_size: "M",
    singlet_size: "M",
    finisher_shirt_size: "L",
    crop_top_size: "S",
    gender: "Female",
    age: 29,
    notes: null,
    ticket_slug: "10km",
    ticket_name: "10km",
    promo_code_used: null,
    subtotal: 2000,
    discount_amount: 0,
    convenience_fee: 50,
    final_amount: 2050,
    payment_status: "paid",
    payment_reference: null,
    check_in_code: "AB12CD",
    runner_number: "12-001",
    checked_in: false,
    checked_in_at: null,
    paid_at: "2026-08-01T01:05:00.000Z",
    promo_eligible: false,
    promo_rank: null,
    promo_qualified_at: null,
    free_souvenir_shirt: false,
    created_at: "2026-08-01T01:00:00.000Z",
    updated_at: "2026-08-01T01:00:00.000Z",
    ...overrides,
  };
}

describe("runner export", () => {
  it("sorts runners by name and maps the race-day columns", () => {
    const rows = buildRunnerExportRows(
      [
        registration({ id: "r2", full_name: "Ben Santos", ticket_name: "5km" }),
        registration({ id: "r1", full_name: "Ana Cruz", checked_in: true, checked_in_at: "2026-08-17T00:00:00.000Z" }),
      ],
      new Map([["e1", "Test Trail Run"]])
    );

    expect(rows.map((row) => row.Name)).toEqual(["Ana Cruz", "Ben Santos"]);
    expect(rows[0].Event).toBe("Test Trail Run");
    expect(rows[0].Distance).toBe("10km");
    expect(rows[0].Gender).toBe("Female");
    expect(rows[0].Age).toBe(29);
    expect(rows[0]["Singlet size"]).toBe("M");
    expect(rows[0]["Finisher t-shirt size"]).toBe("L");
    expect(rows[0].Croptop).toBe("Yes");
    expect(rows[0]["Runner number"]).toBe("12-001");
    expect(rows[0]["Check-in code"]).toBe("AB12CD");
    expect(rows[0]["Checked in"]).toBe("Yes");
    expect(rows[1]["Checked in"]).toBe("No");
    expect(rows[0]["Amount due"]).toBe(2050);
    expect(rows[0]["Convenience fee"]).toBe(50);
    expect(rows[0]["Free souvenir shirt"]).toBe("Not applicable");
  });

  it("exports the first 150 shirt list by promo rank", () => {
    const list = first150SouvenirRecipients([
      registration({ id: "r3", full_name: "Later", ticket_slug: "12km", ticket_name: "12km", promo_rank: 150, free_souvenir_shirt: true, promo_eligible: true }),
      registration({ id: "r2", full_name: "Second", ticket_slug: "25km", ticket_name: "25km", promo_rank: 2, free_souvenir_shirt: true, promo_eligible: true }),
      registration({ id: "r1", full_name: "First", ticket_slug: "12km", ticket_name: "12km", promo_rank: 1, free_souvenir_shirt: true, promo_eligible: true }),
      registration({ id: "r4", full_name: "No shirt", ticket_slug: "12km", ticket_name: "12km", promo_rank: 151, free_souvenir_shirt: false, promo_eligible: true }),
      registration({ id: "r5", full_name: "Cancelled", ticket_slug: "12km", ticket_name: "12km", promo_rank: 3, free_souvenir_shirt: true, promo_eligible: true, payment_status: "cancelled" }),
    ]);
    expect(list.map((row) => row.full_name)).toEqual(["First", "Second", "Later"]);
  });

  it("quotes commas and quotes in CSV", () => {
    const rows = buildRunnerExportRows(
      [registration({ full_name: 'Cruz, "Ana"', notes: "needs bib, shirt" })],
      new Map([["e1", "Test Trail Run"]])
    );
    const csv = toCsv(rows);
    expect(csv).toContain('"Cruz, ""Ana"""');
    expect(csv).toContain('"needs bib, shirt"');
    expect(csv.split("\r\n")[0]).toContain("Check-in code");
  });

  it("builds a safe download slug", () => {
    expect(slugForExportFilename("Test Trail Run")).toBe("test-trail-run");
    expect(slugForExportFilename("  ")).toBe("runners");
  });
});
