import { SITE } from "../../data/portfolio";

const MAX_REQUEST_BYTES = 12_000;
const MIN_COMPLETION_TIME_MS = 1_200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTENT_LABELS = {
  collaboration: "Product collaboration",
  contract: "Contract project",
  "full-time": "Full-time opportunity",
  other: "Something else",
} as const;

type ContactPayload = {
  email: string;
  intent: keyof typeof INTENT_LABELS;
  message: string;
  name: string;
  startedAt: number;
  website: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePayload(value: unknown): ContactPayload | null {
  if (!isRecord(value)) return null;

  const name =
    typeof value.name === "string"
      ? value.name.trim().replace(/\s+/g, " ")
      : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const intent = typeof value.intent === "string" ? value.intent.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const website = typeof value.website === "string" ? value.website.trim() : "";
  const startedAt =
    typeof value.startedAt === "number" ? value.startedAt : Number.NaN;

  if (
    name.length < 2 ||
    name.length > 80 ||
    /[\u0000-\u001f\u007f]/.test(name) ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !(intent in INTENT_LABELS) ||
    message.length < 20 ||
    message.length > 2000 ||
    !Number.isFinite(startedAt)
  ) {
    return null;
  }

  return {
    email,
    intent: intent as ContactPayload["intent"],
    message,
    name,
    startedAt,
    website,
  };
}

function json(body: Record<string, boolean | string>, status: number) {
  return Response.json(body, {
    headers: { "Cache-Control": "no-store" },
    status,
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.includes("application/json")) {
    return json({ error: "This endpoint accepts JSON only." }, 415);
  }

  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ error: "The message is too large." }, 413);
  }

  const requestOrigin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (requestOrigin && requestOrigin !== expectedOrigin) {
    return json({ error: "This request origin is not allowed." }, 403);
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return json({ error: "The request body is not valid JSON." }, 400);
  }

  const payload = parsePayload(rawPayload);

  if (!payload) {
    return json({ error: "Please check each field and try again." }, 400);
  }

  if (
    payload.website ||
    Date.now() - payload.startedAt < MIN_COMPLETION_TIME_MS
  ) {
    return json({ ok: true }, 200);
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? SITE.email;

  if (!apiKey || !fromEmail) {
    return json(
      {
        error:
          "Email delivery is not configured yet. Please use the direct email link.",
      },
      503,
    );
  }

  const intentLabel = INTENT_LABELS[payload.intent];
  const emailBody = [
    "New portfolio inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Intent: ${intentLabel}`,
    `Received: ${new Date().toISOString()}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  try {
    const sendGridResponse = await fetch(
      "https://api.sendgrid.com/v3/mail/send",
      {
        body: JSON.stringify({
          content: [{ type: "text/plain", value: emailBody }],
          from: { email: fromEmail, name: "Lenin Miranda Portfolio" },
          personalizations: [
            {
              subject: `[Portfolio] ${intentLabel} — ${payload.name}`,
              to: [{ email: toEmail }],
            },
          ],
          reply_to: { email: payload.email, name: payload.name },
        }),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!sendGridResponse.ok) {
      const providerError = await sendGridResponse.text();

      console.error("SendGrid rejected a portfolio message", {
        providerError,
        status: sendGridResponse.status,
      });

      return json(
        {
          error: "Email delivery is temporarily unavailable. Please try again.",
        },
        502,
      );
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error("SendGrid request failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return json(
      { error: "Email delivery is temporarily unavailable. Please try again." },
      502,
    );
  }
}
