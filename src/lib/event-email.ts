import { getAppBaseUrl } from "@/config/constants";

export async function sendEventConfirmationEmail(input: {
  email: string;
  fullName: string;
  eventTitle: string;
  startsAt: Date | string;
  location?: string | null;
  checkInCode: string;
  finalAmount: number;
  paymentStatus: string;
  registrationId: string;
}) {
  try {
    const appUrl = getAppBaseUrl();
    await fetch(`${appUrl}/api/emails/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation",
        customer_email: input.email,
        customer_name: input.fullName,
        event_title: input.eventTitle,
        starts_at: input.startsAt,
        location: input.location ?? null,
        check_in_code: input.checkInCode,
        final_amount: input.finalAmount,
        payment_status: input.paymentStatus,
        registration_id: input.registrationId,
      }),
    });
  } catch (e) {
    console.error("Failed to send event confirmation email", e);
  }
}
