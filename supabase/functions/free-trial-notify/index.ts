import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ALERT_TO_EMAIL = Deno.env.get("ALERT_TO_EMAIL") ?? "";
const ALERT_FROM_EMAIL = Deno.env.get("ALERT_FROM_EMAIL") ?? "onboarding@resend.dev";
const WEBHOOK_SECRET = Deno.env.get("FREE_TRIAL_WEBHOOK_SECRET") ?? "";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (WEBHOOK_SECRET) {
    const provided = req.headers.get("x-webhook-secret");
    if (provided !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  let payload;
  try {
    payload = await req.json();
  } catch (_error) {
    return new Response("Bad Request", { status: 400 });
  }

  const record = payload?.record ?? payload?.new ?? payload;
  const name = record?.name ?? "(missing)";
  const phone = record?.phone ?? "(missing)";
  const address = record?.address ?? "(missing)";
  const id = record?.id ?? "(missing)";
  const createdAt = record?.created_at ?? "(missing)";

  if (!RESEND_API_KEY || !ALERT_TO_EMAIL) {
    return new Response("Missing email configuration", { status: 500 });
  }

  const subject = "New free trial request";
  const text = [
    "A new free trial request was submitted.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    `Id: ${id}`,
    `Created: ${createdAt}`,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: ALERT_FROM_EMAIL,
      to: [ALERT_TO_EMAIL],
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("Resend failed:", resendResponse.status, errorText);
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("ok", { status: 200 });
});
