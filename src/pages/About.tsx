import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/home/CTASection";
import { siteConfig } from "@/lib/site-config";

const stack = [
  { group: "Mobile", tools: "Flutter, native Android and iOS modules where needed" },
  { group: "Web", tools: "React, TypeScript, Tailwind CSS" },
  { group: "Backend and data", tools: "Firebase, PostgreSQL, Node.js" },
  { group: "Design", tools: "Figma for interface and print design work" },
];

export default function About() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title={`${siteConfig.fullName}`}
        description={`Building software, applications and websites since ${siteConfig.founded}.`}
      />

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">What we do</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.fullName} builds custom software, mobile applications
              and websites for businesses that need something purpose-built
              rather than a generic template. Past work includes internal
              operations systems for tracking staff, assets and inventory,
              customer-facing mobile apps, and business websites with working
              booking and contact flows.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">How we work</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every project starts with a scoping conversation, usually over
              WhatsApp, so the cost and timeline are agreed before development
              begins. Builds are delivered in stages rather than a single
              handover at the end, and every completed project can move onto
              a monthly retainer for maintenance and database management.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Technology we use</h2>
            <div className="rounded-xl border border-border divide-y divide-border">
              {stack.map((item) => (
                <div key={item.group} className="grid sm:grid-cols-[140px_1fr] gap-1 p-4">
                  <span className="text-sm font-semibold text-foreground">{item.group}</span>
                  <span className="text-sm text-muted-foreground">{item.tools}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
