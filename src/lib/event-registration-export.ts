import type { Event, EventRegistration } from "@/types/app-database";
import { souvenirPromoSummary } from "@/lib/event-management";

export type RunnerExportFormat = "csv" | "xlsx";

export const RUNNER_EXPORT_COLUMNS = [
  "Event",
  "Name",
  "Runner number",
  "Gender",
  "Age",
  "Singlet size",
  "Finisher t-shirt size",
  "Shirt size",
  "Croptop",
  "Email",
  "Phone",
  "Company",
  "Distance",
  "Payment status",
  "Registration fee",
  "Convenience fee",
  "Amount due",
  "Subtotal",
  "Discount",
  "Promo code",
  "Promo eligible",
  "Promo rank",
  "Free souvenir shirt",
  "Check-in code",
  "Checked in",
  "Checked in at",
  "Notes",
  "Registered at",
  "Paid at",
  "Promo qualified at",
  "Payment reference",
] as const;

export type RunnerExportRow = Record<(typeof RUNNER_EXPORT_COLUMNS)[number], string | number>;

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-PH", { hour12: false });
}

export function slugForExportFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "runners";
}

export function first150SouvenirRecipients(registrations: EventRegistration[]) {
  return [...registrations]
    .filter((reg) =>
      reg.payment_status === "paid" &&
      reg.free_souvenir_shirt &&
      (reg.promo_rank ?? 0) > 0
    )
    .sort((a, b) => (a.promo_rank ?? 0) - (b.promo_rank ?? 0) || a.full_name.localeCompare(b.full_name, "en", { sensitivity: "base" }));
}

export function buildRunnerExportRows(
  registrations: EventRegistration[],
  eventTitleById: Map<string, string>,
  options?: { sort?: "name" | "promo_rank" }
): RunnerExportRow[] {
  const sorted = [...registrations];
  if (options?.sort === "promo_rank") {
    sorted.sort((a, b) => (a.promo_rank ?? 9999) - (b.promo_rank ?? 9999) || a.full_name.localeCompare(b.full_name, "en", { sensitivity: "base" }));
  } else {
    sorted.sort((a, b) => a.full_name.localeCompare(b.full_name, "en", { sensitivity: "base" }));
  }

  return sorted.map((reg) => {
    const promo = souvenirPromoSummary(reg);
    return {
      Event: eventTitleById.get(reg.event_id) || "",
      Name: reg.full_name,
      "Runner number": reg.runner_number || "",
      Gender: reg.gender || "",
      Age: reg.age ?? "",
      "Singlet size": reg.singlet_size || "",
      "Finisher t-shirt size": reg.finisher_shirt_size || "",
      "Shirt size": reg.shirt_size || reg.finisher_shirt_size || "",
      Croptop: reg.crop_top_size ? "Yes" : "No",
      Email: reg.email,
      Phone: reg.phone || "",
      Company: reg.company || "",
      Distance: reg.ticket_name || "",
      "Payment status": reg.payment_status,
      "Registration fee": Number((reg.subtotal ?? 0) - (reg.discount_amount ?? 0)),
      "Convenience fee": Number(reg.convenience_fee ?? 0),
      "Amount due": Number(reg.final_amount ?? 0),
      Subtotal: Number(reg.subtotal ?? 0),
      Discount: Number(reg.discount_amount ?? 0),
      "Promo code": reg.promo_code_used || "",
      "Promo eligible": promo.applicable ? "Yes" : "No",
      "Promo rank": reg.promo_rank ?? "",
      "Free souvenir shirt": promo.applicable ? promo.shirtLabel : "Not applicable",
      "Check-in code": reg.check_in_code,
      "Checked in": reg.checked_in ? "Yes" : "No",
      "Checked in at": formatDate(reg.checked_in_at),
      Notes: reg.notes || "",
      "Registered at": formatDate(reg.created_at),
      "Paid at": formatDate(reg.paid_at),
      "Promo qualified at": formatDate(reg.promo_qualified_at),
      "Payment reference": reg.payment_reference || "",
    };
  });
}

export function toCsv(rows: RunnerExportRow[]) {
  const escape = (value: string | number) => {
    const text = String(value ?? "");
    if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };
  return [
    RUNNER_EXPORT_COLUMNS.join(","),
    ...rows.map((row) => RUNNER_EXPORT_COLUMNS.map((column) => escape(row[column])).join(",")),
  ].join("\r\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadRunnerExport(input: {
  registrations: EventRegistration[];
  events?: Pick<Event, "id" | "title" | "slug">[];
  event?: Pick<Event, "id" | "title" | "slug">;
  format: RunnerExportFormat;
  sort?: "name" | "promo_rank";
  filenameSuffix?: string;
}) {
  const eventTitleById = new Map(
    (input.events ?? []).map((event) => [event.id, event.title] as const)
  );
  if (input.event) eventTitleById.set(input.event.id, input.event.title);

  const rows = buildRunnerExportRows(input.registrations, eventTitleById, { sort: input.sort });
  const stamp = new Date().toISOString().slice(0, 10);
  const base = slugForExportFilename(input.event?.slug || input.event?.title || "all-events");
  const extra = input.filenameSuffix ? `-${input.filenameSuffix}` : "";
  const filename = `${base}${extra}-runners-${stamp}.${input.format}`;

  if (input.format === "csv") {
    triggerDownload(new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8;" }), filename);
    return rows.length;
  }

  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...RUNNER_EXPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Runners");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  triggerDownload(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    filename
  );
  return rows.length;
}
