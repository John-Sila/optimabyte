import { MessageCircle, Check } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";
import { services, whatsappLink, type ServiceDetail } from "@/lib/site-config";

function ServiceSection({ service }: { service: ServiceDetail }) {
  const Icon = iconMap[service.icon];

  return (
    <div id={service.id} className="scroll-mt-24 py-10 border-b border-border last:border-b-0">
      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary shrink-0">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
            {service.description}
          </p>
          <ul className="mt-5 space-y-2.5">
            {service.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-6">
            <a
              href={whatsappLink(`Hello OptimaByte, I would like to ask about ${service.title.toLowerCase()}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Ask about this service
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const software = services.filter((s) => s.category === "software");
  const design = services.filter((s) => s.category === "design");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Services"
        title="Software, apps, websites and the design work around them"
        description="Every service below is scoped and priced before work starts. Message us on WhatsApp with what you need and we will confirm the details."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Software and digital</h2>
          <p className="text-muted-foreground mb-4">
            Custom builds and the ongoing work that keeps them running.
          </p>
          <div>
            {software.map((service) => (
              <ServiceSection key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Design and print</h2>
          <p className="text-muted-foreground mb-4">
            Supporting creative work for print and promotion.
          </p>
          <div>
            {design.map((service) => (
              <ServiceSection key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure which service fits"
        description="Describe what you are trying to build and we will tell you the right approach and an estimated cost."
        message="Hello OptimaByte, I am not sure which service fits my project. Can you help?"
      />
    </PageShell>
  );
}
