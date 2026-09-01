interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {eyebrow && (
          <p className="text-sm font-medium text-primary mb-3">{eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
