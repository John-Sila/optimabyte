import Reveal from "@/components/Reveal";
import { iconMap } from "@/lib/icon-map";
import { industries } from "@/lib/site-config";

export default function Industries() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-primary py-20 text-primary-foreground md:py-28">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 animate-blob rounded-full bg-brandblue/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 animate-blob rounded-full bg-gold/30 blur-3xl [animation-delay:-5s]" />
      <div className="site-container relative">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-light">Who we build for</p>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            Systems for the businesses that keep Kenya moving
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {industries.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    {Icon && <Icon className="h-6 w-6 text-gold-light" />}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-80">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
