import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import PortfolioItem from "@/components/PortfolioItem";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/Reveal";
import { portfolio } from "@/lib/site-config";
import { usePortfolioImages } from "@/lib/content";

const filters = ["All", "Software", "Mobile", "Web", "Design"] as const;

export default function Portfolio() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const { images, applyLocal } = usePortfolioImages();

  const filtered = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Portfolio"
        title="Systems we build and deliver"
        description="Fleet and rider apps, point of sale, hospital and school ERP, websites and print design. Here is what each one does."
      />

      <section className="py-14 md:py-20">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div key={filter} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={i * 70} className="[&>*]:h-full">
                <PortfolioItem project={project} imageUrl={images[project.id]} onImageSaved={applyLocal} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want something like this for your business"
        description="Tell us what you have in mind and we will scope it with you."
      />
    </PageShell>
  );
}
