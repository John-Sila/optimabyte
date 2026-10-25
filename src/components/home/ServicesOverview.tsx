import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/site-config";

export default function ServicesOverview() {
  const featured = services.filter((s) => s.category === "software");

  return (
    <section id="services" className="py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-text">Services</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">What we build</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Software, apps and websites, backed by database management and support once your project is live.
              </p>
            </div>
            <Link to="/services" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              View all services
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {featured.map((service, i) => (
            <Reveal key={service.id} delay={i * 70} className="[&>*]:h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
