import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

const stack = [
  { group: "Mobile", tools: "Flutter, native Android and iOS modules where needed" },
  { group: "Web", tools: "React, TypeScript, Tailwind CSS" },
  { group: "Backend and data", tools: "Firebase, PostgreSQL, Node.js" },
  { group: "Payments", tools: "M-Pesa integrations for POS and rider apps" },
  { group: "Design", tools: "Figma for interface and print design work" },
];

export default function About() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title={siteConfig.fullName}
        description={`Building software, applications and websites since ${siteConfig.founded}.`}
      />

      <section className="py-14 md:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-2 xl:gap-20">
          <div className="space-y-10">
            <Reveal>
              <h2 className="mb-4 text-2xl font-bold text-foreground">What we do</h2>
              <p className="leading-relaxed text-muted-foreground">
                {siteConfig.fullName} builds custom software, mobile applications and websites for businesses that
                need something purpose-built rather than a generic template. We build fleet and rider apps where
                riders report their earnings, point-of-sale systems for shops, ERP for hospitals, schools and
                businesses, and websites with working booking and contact flows.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mb-4 text-2xl font-bold text-foreground">How we work</h2>
              <p className="leading-relaxed text-muted-foreground">
                Every project starts with a scoping conversation, so the cost and timeline are agreed before
                development begins. Builds are delivered in stages rather than a single handover at the end, and
                every completed project can move onto a monthly retainer for maintenance and database management.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <h2 className="mb-4 text-2xl font-bold text-foreground">What you can expect</h2>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "A written scope and price before work starts",
                  "Regular progress updates while we build",
                  "A handover session so your team can use the system confidently",
                  "A direct line to the people who built it, after launch too",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-text" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Technology we use</h2>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {stack.map((item) => (
                <div key={item.group} className="grid gap-1 p-5 sm:grid-cols-[160px_1fr]">
                  <span className="text-sm font-bold text-foreground">{item.group}</span>
                  <span className="text-sm text-muted-foreground">{item.tools}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
