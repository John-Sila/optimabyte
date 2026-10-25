import Reveal from "@/components/Reveal";

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
    <section className="border-t border-border bg-secondary/40 py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-text">Process</p>
          <h2 className="mb-14 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How a project runs</h2>
        </Reveal>
        <div className="relative grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-gold-text/60 via-border to-brandblue/60 xl:block" />
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 110}>
              <div className="relative">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-text bg-background text-sm font-bold text-gold-text">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
