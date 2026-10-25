import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import PortfolioItem from "@/components/PortfolioItem";
import { portfolio } from "@/lib/site-config";
import { usePortfolioImages } from "@/lib/content";

export default function FeaturedWork() {
  const { images, applyLocal } = usePortfolioImages();
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-text">Portfolio</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Recent work</h2>
            </div>
            <Link to="/portfolio" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              See all projects
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
          {portfolio.slice(0, 4).map((project, i) => (
            <Reveal key={project.id} delay={i * 90} className="[&>*]:h-full">
              <PortfolioItem
                project={project}
                imageUrl={images[project.id]}
                onImageSaved={applyLocal}
                compact
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
