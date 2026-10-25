import { techStack } from "@/lib/site-config";

export default function TechMarquee() {
  const row = [...techStack, ...techStack];
  return (
    <section aria-label="Technology we use" className="overflow-hidden border-b border-border bg-secondary/40 py-5">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= techStack.length}
            className="flex items-center gap-12 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-gold-text/70" />
          </span>
        ))}
      </div>
    </section>
  );
}
