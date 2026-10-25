interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/40">
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 animate-blob rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 animate-blob rounded-full bg-brandblue/15 blur-3xl [animation-delay:-6s]" />
      <div className="site-container relative py-16 md:py-24">
        {eyebrow && (
          <p className="mb-3 animate-fade-up text-sm font-semibold uppercase tracking-[0.18em] text-gold-text">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl animate-fade-up text-3xl font-bold tracking-tight text-foreground [animation-delay:80ms] md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:160ms] md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
