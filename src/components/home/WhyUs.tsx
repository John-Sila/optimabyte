import { ShieldCheck, Clock, Wallet, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";

const points = [
  {
    icon: ShieldCheck,
    title: "Scope confirmed up front",
    description: "You get a clear price before work starts, and before any change is made after launch.",
  },
  {
    icon: Clock,
    title: "Direct communication",
    description: "No account managers in between. You reach the people building your software directly.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description: "Published rates for retainer, database management and changes, listed on our pricing page.",
  },
  {
    icon: MessageCircle,
    title: "Support after launch",
    description: "A monthly retainer keeps your software monitored and maintained once it is live.",
  },
];

export default function WhyUs() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-text">Why OptimaByte</p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Why work with us</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 80} className="[&>*]:h-full">
              <div className="card-lift h-full rounded-2xl border border-border bg-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandblue/10">
                  <point.icon className="h-6 w-6 text-brandblue-dark dark:text-brandblue" />
                </span>
                <h3 className="mt-5 text-base font-bold text-foreground">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
