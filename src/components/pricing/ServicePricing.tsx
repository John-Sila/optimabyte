import { Link } from "react-router-dom";
import { ArrowRight, Check, MessageCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";
import { whatsappLink, type ServiceDetail } from "@/lib/site-config";
import type { ServicePricing as ServicePricingData } from "@/lib/pricing-data";

interface Props {
  service: ServiceDetail;
  data: ServicePricingData;
}

/** The content of one service tab on the Pricing page. */
export default function ServicePricing({ service, data }: Props) {
  const Icon = iconMap[service.icon];

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
            {Icon && <Icon className="h-6 w-6 text-gold-text" />}
          </span>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{service.title}</h2>
            <p className="text-sm text-muted-foreground">
              From <span className="font-semibold text-gold-text">{data.from}</span>, in Kenya shillings, excluding VAT
            </p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{data.intro}</p>
      </header>

      <section aria-label={`${service.title} price options`}>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gold-text">Price options</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {data.tiers.map((tier) => (
            <article
              key={tier.name}
              className={`card-lift relative flex flex-col rounded-2xl border bg-card p-6 ${
                tier.popular ? "border-gold-text/60 ring-1 ring-gold-text/30" : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-gold-text px-3 py-0.5 text-xs font-semibold text-background">
                  Most common
                </span>
              )}
              <h4 className="text-base font-bold text-foreground">{tier.name}</h4>
              <p className="mt-3 text-2xl font-extrabold leading-tight text-gold-text">{tier.price}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{tier.unit}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tier.bestFor}</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-text" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="What changes the price">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-[0.16em] text-gold-text">What changes the price</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Your project can land below or above the ranges, depending on these.
        </p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.factors.map((f) => (
            <div key={f.factor} className="grid gap-3 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] md:gap-6">
              <p className="text-sm font-semibold text-foreground">{f.factor}</p>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Lowers the price" />
                <span>{f.lower}</span>
              </p>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-label="Raises the price" />
                <span>{f.higher}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {data.notes.length > 0 && (
        <section aria-label="Good to know" className="rounded-2xl border border-border bg-secondary/40 p-6">
          <h3 className="mb-3 text-base font-bold text-foreground">Good to know</h3>
          <ul className="space-y-2.5">
            {data.notes.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-text" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div>
          <p className="text-lg font-bold">Want an exact figure for your project?</p>
          <p className="mt-1 text-sm opacity-85">These are guide ranges. We confirm a fixed price before any work begins.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <a href={whatsappLink(data.quoteMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/contact">
              Send a request
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}