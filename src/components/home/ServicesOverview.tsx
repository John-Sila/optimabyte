import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/site-config";

export default function ServicesOverview() {
  const featured = services.filter((s) => s.category === "software");

  return (
    <section id="services" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              What we build
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Software, apps and websites, backed by database management and
              support once your project is live.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
