// Enable Supabase Edge Runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { serve } from "std/server";
// ... (rest of your imports and type definitions) ...
import ResendPkg from "npm:resend";
import sendgridPkg from "npm:@sendgrid/mail";

// ------------------------------
// Types
// ------------------------------
type RequestBody = {
  brokerEmail: string;
  loadIdName: string;
  loadLink: string;
  brokerName?: string;
};

// ------------------------------
// Email Templates
// ------------------------------
const HTML_TEMPLATE = (reviewLink: string) => `
<!doctype html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; color:#111;">
    <h2>Quick 2-sec favor from your box truck people 🚚✨</h2>
    <p>We're sending out a quick review link so brokers who work with us can share their experience.</p>
    <p>
      <a href="${reviewLink}" style="
        display:inline-block;
        background:#0d9488;
        color:#fff;
        padding:10px 20px;
        border-radius:6px;
        text-decoration:none;
      ">Drop Your Review Here</a>
    </p>
    <p>Thank you — BTFS Team</p>
  </body>
</html>
`;

const PLAIN_TEMPLATE = (reviewLink: string, loadIdName?: string) => `
Quick 2-sec favor from your box truck people 🚚✨

We're sending out a quick review link so brokers can share their experience.

Review link:
${reviewLink}

${loadIdName ? `Load: ${loadIdName}\n\n` : ""}
Thank anks you — BTFS Team
`;

// ------------------------------
// ENV / Secrets
// ------------------------------
const EMAIL_PROVIDER = (Deno.env.get("EMAIL_PROVIDER") || "resend").toLowerCase();
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "BTFS Dispatch <operations@boxtruckfs.com>";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY") || "";
const DISABLE_EMAIL_SENDING = Deno.env.get("DISABLE_EMAIL_SENDING") === "true";
// --> RESTORED THIS LINE <--
const DISABLE_AUTH = Deno.env.get("DISABLE_AUTH") === "true";

// ------------------------------
// Configure Email Providers
// ------------------------------
const resend = RESEND_API_KEY ? new (ResendPkg as any)(RESEND_API_KEY) : null;
if (SENDGRID_API_KEY) {
  (sendgridPkg as any).setApiKey(SENDGRID_API_KEY);
}

// ------------------------------
// Main Function
// ------------------------------
serve(async (req) => {
  console.log("Function triggered. DISABLE_AUTH =", DISABLE_AUTH); // Log restored for debugging

  // ------------------------------
  // Authorization Check
  // ------------------------------

  // The following block is active and checks the DISABLE_AUTH env var
  if (!DISABLE_AUTH) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401 }
      );
    }
  }


  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
    }

    // ... (rest of the function logic is unchanged) ...
    const body: RequestBody = await req.json().catch(() => ({} as RequestBody));
    const { brokerEmail, loadIdName, loadLink } = body;

    if (!brokerEmail || !loadLink) {
      return new Response(JSON.stringify({ error: "brokerEmail and loadLink are required" }), { status: 400 });
    }

    const subject = "Quick 2-sec favor from your box truck people 🚚✨";
    const html = HTML_TEMPLATE(loadLink);
    const text = PLAIN_TEMPLATE(loadLink, loadIdName);

    // ------------------------------
    // Dev Mode: Skip actual send
    // ------------------------------
    if (DISABLE_EMAIL_SENDING) {
      console.log("[DEV MODE] Email sending disabled. Payload:", { brokerEmail, loadIdName, loadLink });
      return new Response(JSON.stringify({ ok: true, note: "Email sending disabled (DISABLE_EMAIL_SENDING=true)" }), { status: 200 });
    }

    // ------------------------------
    // Email Providers
    // ------------------------------
    if (EMAIL_PROVIDER === "resend") {
      if (!resend) return new Response(JSON.stringify({ error: "Resend API key not configured" }), { status: 500 });
      try {
        const resp = await resend.emails.send({ from: FROM_EMAIL, to: brokerEmail, subject, html, text });
        return new Response(JSON.stringify({ ok: true, provider: "resend", result: resp }), { status: 200 });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Resend send failed", details: String(err) }), { status: 500 });
      }
    }

    if (EMAIL_PROVIDER === "sendgrid") {
      if (!SENDGRID_API_KEY) return new Response(JSON.stringify({ error: "SendGrid key not configured" }), { status: 500 });
      try {
        const sgResp = await (sendgridPkg as any).send({ to: brokerEmail, from: FROM_EMAIL, subject, text, html });
        return new Response(JSON.stringify({ ok: true, provider: "sendgrid", result: sgResp }), { status: 200 });
      } catch (err) {
        return new Response(JSON.stringify({ error: "SendGrid send failed", details: String(err) }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ error: `Unknown provider ${EMAIL_PROVIDER}` }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected server error", details: String(err) }), { status: 500 });
  }
});
