import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function Chat() {
  return (
    <Layout>
      <SEO
        title="Ask Nexus — Afrinexus Assistant"
        description="Get instant answers on verification, documented agreements, escrow and cross-border deal readiness from the Afrinexus assistant."
      />
      <section className="bg-navy-gradient py-14">
        <div className="container text-center">
          <span className="inline-block mb-4 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent ring-1 ring-accent/20">
            Assistant
          </span>
          <h1 className="font-serif text-3xl text-primary-foreground md:text-4xl">Ask Nexus</h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Platform questions, support triage, and practical guidance for cross-border deals — answered in plain terms.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl">
          <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
            <ChatPanel />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Nexus provides general guidance only and is not legal, tax, or financial advice.
          </p>
        </div>
      </section>
    </Layout>
  );
}
