import { pricing } from "@/lib/site-config";

export default function PricingTable() {
  return (
    <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-1">
      {pricing.map((item) => (
        <div
          key={item.title}
          className="card-lift grid gap-4 rounded-2xl border border-border bg-card p-6 md:p-8 xl:grid-cols-[1.1fr_auto_1.4fr] xl:items-center xl:gap-10"
        >
          <div>
            <p className="text-lg font-bold text-foreground">{item.title}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.cadence}</p>
          </div>
          <p className="text-2xl font-extrabold text-gold-text xl:text-3xl">{item.price}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
