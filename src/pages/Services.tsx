import { MessageCircle, Check } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";
import { services, whatsappLink, type ServiceDetail } from "@/lib/site-config";

function ServiceSection({ service }: { service: ServiceDetail }) {
  const Icon = iconMap[service.icon];

  return (
    <div
      id={service.id}
      className="card-lift flex h-full scroll-mt-24 flex-col rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
          {Icon && <Icon className="h-6 w-6 text-gold-text" />}
        </div>
        <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">{service.description}</p>
      <ul className="mt-5 space-y-2.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-text" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button asChild variant="outline" size="sm">
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
        description="Every service below is scoped and priced before work starts. Send us a request or message us on WhatsApp and we will confirm the details."
      />

      <section className="py-14 md:py-20">
        <div className="site-container">
          <Reveal>
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Software and digital</h2>
            <p className="mb-8 text-muted-foreground">Custom builds and the ongoing work that keeps them running.</p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {software.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 80} className="[&>*]:h-full">
                <ServiceSection service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-14 md:py-20">
        <div className="site-container">
          <Reveal>
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Design and print</h2>
            <p className="mb-8 text-muted-foreground">Supporting creative work for print and promotion.</p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {design.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 80} className="[&>*]:h-full">
                <ServiceSection service={service} />
              </Reveal>
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
