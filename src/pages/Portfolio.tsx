import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import PortfolioItem from "@/components/PortfolioItem";
import CTASection from "@/components/home/CTASection";
import { portfolio } from "@/lib/site-config";

const filters = ["All", "Software", "Mobile", "Web", "Design"] as const;

export default function Portfolio() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered =
    filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Portfolio"
        title="Work we have built"
        description="A selection of projects across software, mobile and web. More case studies are added as projects are completed and cleared for release."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <PortfolioItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want to see something similar for your business"
        description="Tell us what you have in mind and we will scope it with you."
      />
    </PageShell>
  );
}
