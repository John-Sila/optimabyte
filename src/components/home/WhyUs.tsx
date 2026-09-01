import { ShieldCheck, Clock, Wallet, MessageCircle } from "lucide-react";

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
    <section className="py-20 md:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-12">
          Why work with us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point) => (
            <div key={point.title}>
              <point.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-base font-semibold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
