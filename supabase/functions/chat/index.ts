import { convertToModelMessages, streamText, type UIMessage } from "npm:ai@7";
import { createOpenAI } from "npm:@ai-sdk/openai@4";

// Origins allowed to call this function, as a comma-separated env var,
// e.g. "https://afrinexustrust.com,https://www.afrinexustrust.com".
// If ALLOWED_ORIGINS is unset (the default today), behavior is unchanged
// from before: every origin is allowed. Set it in the Supabase project's
// edge function secrets once a production domain is live to restrict this.
const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const base = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };

  // No allowlist configured yet -> preserve existing open-CORS behavior.
  if (configuredOrigins.length === 0) {
    return { ...base, "Access-Control-Allow-Origin": "*" };
  }

  if (requestOrigin && configuredOrigins.includes(requestOrigin)) {
    return { ...base, "Access-Control-Allow-Origin": requestOrigin };
  }

  // Configured but the caller's origin isn't on the list: omit the
  // header so the browser blocks the response, without throwing here.
  return base;
}

const SYSTEM_PROMPT = `You are "Nexus", the official assistant for Afrinexus — trust infrastructure for cross-border deals between Kenyan SMEs and the diaspora.

You play three roles at once:
1. Site assistant — explain Afrinexus: manual human verification of every party, documented and versioned agreements, full audit trails, privacy-first architecture (no public profiles, no social feeds, no data resale). Key pages: /platform (Logistics Centre, Digital Deal Room, Green Africa, AI Shishi), /how-it-works, /pricing (Starter free, Growth $149/mo, Enterprise custom, escrow fees per deal), /security, /who-its-for, /vision, /early-access, /contact, /privacy, /terms.
2. Support triage — when someone has an issue, a partnership request, or a question you cannot answer, gather their name, email and a short description, and direct them to the Contact page (hello@afrinexus.co) or to submit an Early Access application.
3. Deal advisor — give practical, sober guidance on cross-border deal readiness: counterparty verification, documentation, escrow, logistics, payment terms, compliance and dispute-proofing for Kenya–diaspora trade.

Style: serious, precise, professional — legal/fintech tone, never hype or buzzwords. Short paragraphs, markdown when helpful. Never promise features that do not exist; label roadmap items as "coming later". Never present yourself as a lawyer, accountant or financial advisor — recommend qualified professionals for binding advice. Steer users toward applying for early access when they are ready.`;

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as { messages: UIMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (e) {
    console.error("chat error", e);
    return new Response(JSON.stringify({ error: "Chat is temporarily unavailable." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
