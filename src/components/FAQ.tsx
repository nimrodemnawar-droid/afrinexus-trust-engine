import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "How is Afrinexus different from a networking platform like LinkedIn?",
    a: "Networking platforms help you find people. Afrinexus helps you close deals. Every party is human-verified, every agreement is documented, and every action leaves an audit trail. We measure success in completed deals, not connections.",
  },
  {
    q: "Who verifies the parties on the platform?",
    a: "Our team manually reviews every applicant. We verify identity, business registration, and legitimacy before approval. No automated shortcuts, no algorithmic gatekeeping — real humans checking real businesses.",
  },
  {
    q: "Will my business information ever be public or shared?",
    a: "Never. There are no public profiles, no social feeds, and no third-party data sharing. Your deal terms and documents are visible only to the parties you choose to engage with. We do not monetize your data.",
  },
  {
    q: "How long does early access approval take?",
    a: "We aim to respond to every application within 48 hours with next steps or actionable feedback. Approval timelines depend on how quickly verification documents can be confirmed.",
  },
  {
    q: "What happens if a deal goes wrong?",
    a: "Because every agreement, revision, and milestone is documented, you have a complete audit trail to support dispute resolution. Escrow and smart-contract enforcement are on the roadmap for deeper protection.",
  },
  {
    q: "Is there a fee to apply?",
    a: "Applying for early access is free. Pricing for verified members will be communicated transparently before onboarding — no hidden costs, ever.",
  },
];

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container max-w-3xl">
        <SectionHeading
          label="FAQ"
          title="Common Questions, Direct Answers"
          description="Everything you need to know before applying."
        />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-sans text-base font-medium text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
