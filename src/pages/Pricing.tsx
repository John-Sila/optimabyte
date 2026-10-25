import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import PricingTable from "@/components/pricing/PricingTable";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/Reveal";
import { Info } from "lucide-react";

const notes = [
  "The retainer and database management fee applies from the second month onward.",
  "Changes and modifications are billed per request and are separate from, not included in, the monthly retainer.",
  "All fees are quoted in KES, exclusive of VAT.",
  "Larger builds outside this structure, such as hospital or school ERP, are quoted individually after scoping.",
];

export default function Pricing() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Pricing"
        title="Straightforward pricing for software projects"
        description="This is our standard structure for software builds. Larger or non-standard projects are scoped and quoted separately."
      />

      <section className="py-14 md:py-20">
        <div className="site-container grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-16">
          <Reveal>
            <PricingTable />
          </Reveal>

          <Reveal delay={120}>
            <aside className="rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <Info className="h-5 w-5 text-gold-text" />
                Good to know
              </h2>
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-text" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Need a quote for a larger project"
        description="Tell us the scope and we will send a fixed quote before any work begins."
        message="Hello OptimaByte, I would like a quote for a project outside your standard pricing."
      />
    </PageShell>
  );
}
