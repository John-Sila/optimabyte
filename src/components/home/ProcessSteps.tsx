const steps = [
  {
    number: "01",
    title: "Scope the work",
    description:
      "We talk through what you need over WhatsApp or a call and confirm the scope and price before anything starts.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Development happens in stages, with progress shared as it happens rather than a single delivery at the end.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Your software, app or website goes live, with a handover session so your team knows how to use it.",
  },
  {
    number: "04",
    title: "Support",
    description:
      "Ongoing retainer covers monitoring and maintenance. Changes after launch are quoted and billed per request.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-20 md:py-24 border-t border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-12">
          How a project runs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-sm font-semibold text-primary">{step.number}</span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
