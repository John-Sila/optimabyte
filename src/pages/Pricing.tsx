import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import PricingTable from "@/components/pricing/PricingTable";
import CTASection from "@/components/home/CTASection";

const notes = [
  "The retainer and database management fee applies from the second month onward.",
  "Changes and modifications are billed per request and are separate from, not included in, the monthly retainer.",
  "All fees are quoted in KES, exclusive of VAT.",
  "Larger builds outside this structure are quoted individually after scoping.",
];

export default function Pricing() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Pricing"
        title="Straightforward pricing for software projects"
        description="This is our standard structure for software builds. Larger or non-standard projects are scoped and quoted separately."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <PricingTable />

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Notes</h2>
            <ul className="space-y-2.5">
              {notes.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        title="Need a quote for a larger project"
        description="Tell us the scope on WhatsApp and we will send a fixed quote before any work begins."
        message="Hello OptimaByte, I would like a quote for a project outside your standard pricing."
      />
    </PageShell>
  );
}
