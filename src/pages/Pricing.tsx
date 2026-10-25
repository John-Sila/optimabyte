import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, LayoutGrid } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import PricingTable from "@/components/pricing/PricingTable";
import ServicePricing from "@/components/pricing/ServicePricing";
import CTASection from "@/components/home/CTASection";
import { iconMap } from "@/lib/icon-map";
import { pricingGuide, pricingGuideById } from "@/lib/pricing-data";
import { services, type ServiceDetail } from "@/lib/site-config";

const OVERVIEW = "overview";

const notes = [
  "The retainer and database management fee applies from the second month onward.",
  "Changes and modifications are billed per request and are separate from, not included in, the monthly retainer.",
  "All fees are quoted in KES, exclusive of VAT.",
  "Every figure on the service tabs is a guide range for Nairobi. A fixed price is confirmed before work begins.",
  "Larger builds outside this structure, such as hospital or school ERP, are quoted individually after scoping.",
];

interface Tab {
  id: string;
  label: string;
  group: "Start here" | "Software" | "Design";
  icon: typeof LayoutGrid;
}

const tabs: Tab[] = [
  { id: OVERVIEW, label: "Overview", group: "Start here", icon: LayoutGrid },
  ...services
    .filter((s) => pricingGuideById.has(s.id))
    .map((s) => ({
      id: s.id,
      label: s.title,
      group: (s.category === "design" ? "Design" : "Software") as Tab["group"],
      icon: iconMap[s.icon] ?? LayoutGrid,
    })),
];

const groups: Tab["group"][] = ["Start here", "Software", "Design"];
const serviceById = new Map<string, ServiceDetail>(services.map((s) => [s.id, s]));

export default function Pricing() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const userPicked = useRef(false);

  const requested = hash.replace(/^#/, "");
  const activeId = tabs.some((t) => t.id === requested) ? requested : OVERVIEW;
  const index = tabs.findIndex((t) => t.id === activeId);
  const prev = tabs[index - 1];
  const next = tabs[index + 1];

  const select = (id: string) => {
    userPicked.current = true;
    navigate({ hash: id === OVERVIEW ? "" : `#${id}` }, { replace: true });
  };

  // After a tab is chosen on a small screen, bring the content into view.
  useEffect(() => {
    if (!userPicked.current) return;
    userPicked.current = false;
    if (window.innerWidth < 1024) contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  const overviewRows = useMemo(
    () =>
      pricingGuide.map((p) => ({
        id: p.id,
        title: serviceById.get(p.id)?.title ?? p.id,
        from: p.from,
        summary: serviceById.get(p.id)?.summary ?? "",
      })),
    [],
  );

  const service = serviceById.get(activeId);
  const data = pricingGuideById.get(activeId);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Pricing"
        title="Straightforward pricing for every service"
        description="Pick a service to see what it costs in Nairobi, what changes the price, and where your project is likely to land."
      />

      <section className="py-10 md:py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-14">
          {/* Side navigation on large screens */}
          <aside className="hidden lg:block">
            <nav aria-label="Services" className="sticky top-24">
              {groups.map((g) => (
                <div key={g} className="mb-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">{g}</p>
                  <ul className="space-y-1 border-l border-border">
                    {tabs
                      .filter((t) => t.group === g)
                      .map((t) => {
                        const active = t.id === activeId;
                        return (
                          <li key={t.id}>
                            <button
                              type="button"
                              onClick={() => select(t.id)}
                              aria-current={active ? "page" : undefined}
                              className={`-ml-px flex w-full items-center gap-2.5 border-l-2 py-2 pl-4 pr-2 text-left text-sm transition-colors ${
                                active
                                  ? "border-gold-text font-semibold text-foreground"
                                  : "border-transparent text-muted-foreground hover:border-gold-text hover:text-foreground"
                              }`}
                            >
                              <t.icon className={`h-4 w-4 shrink-0 ${active ? "text-gold-text" : ""}`} />
                              {t.label}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Scrollable tabs on small screens */}
          <div className="overflow-x-auto pb-2 lg:hidden" role="tablist" aria-label="Services">
            <div className="flex w-max gap-2">
              {tabs.map((t) => {
                const active = t.id === activeId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => select(t.id)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-gold-text bg-gold/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={contentRef} className="min-w-0 scroll-mt-24">
            <div key={activeId} className="animate-fade-up">
              {activeId === OVERVIEW || !service || !data ? (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">How our pricing works</h2>
                    <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                      These are our standard rates for software builds. Each service tab shows a price guide for that
                      kind of work, with ranges and the factors that move the price up or down. Larger or non-standard
                      projects are scoped and quoted separately.
                    </p>
                  </div>

                  <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-12">
                    <PricingTable />
                    <aside className="h-fit rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                        <Info className="h-5 w-5 text-gold-text" />
                        Good to know
                      </h3>
                      <ul className="space-y-3">
                        {notes.map((note) => (
                          <li key={note} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-text" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gold-text">
                      Starting prices by service
                    </h3>
                    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                      {overviewRows.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => select(r.id)}
                          className="group flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-secondary/60"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">{r.title}</span>
                            <span className="block truncate text-sm text-muted-foreground">{r.summary}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-3">
                            <span className="text-sm font-bold text-gold-text">from {r.from}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <ServicePricing service={service} data={data} />
              )}
            </div>

            {/* Previous / next */}
            <nav aria-label="Pricing pages" className="mt-12 flex items-stretch justify-between gap-4 border-t border-border pt-6">
              {prev ? (
                <button
                  type="button"
                  onClick={() => select(prev.id)}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/60"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">Previous</span>
                    <span className="block truncate text-sm font-semibold text-foreground">{prev.label}</span>
                  </span>
                </button>
              ) : (
                <span className="flex-1" />
              )}
              {next ? (
                <button
                  type="button"
                  onClick={() => select(next.id)}
                  className="group flex min-w-0 flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 text-right transition-colors hover:bg-secondary/60"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">Next</span>
                    <span className="block truncate text-sm font-semibold text-foreground">{next.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <span className="flex-1" />
              )}
            </nav>
          </div>
        </div>
      </section>

      <CTASection
        title="Need a quote for a larger project"
        description="Tell us the scope and we will send a fixed quote before any work begins."
        message="Hello OptimaByte, I would like a quote for a project outside your standard pricing."
      />
    </PageShell>
  );
}
