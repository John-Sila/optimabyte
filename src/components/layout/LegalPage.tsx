import type { ReactNode } from "react";
import PageShell from "./PageShell";
import PageHeader from "./PageHeader";
import Reveal from "@/components/Reveal";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

export default function LegalPage({ eyebrow, title, description, updated, sections }: LegalPageProps) {
  return (
    <PageShell>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="py-14 md:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">On this page</p>
              <ul className="space-y-1 border-l border-border">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-gold-text hover:text-foreground"
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="max-w-3xl">
            <p className="mb-10 text-sm text-muted-foreground">Last updated {updated}</p>
            <div className="space-y-12">
              {sections.map((s, i) => (
                <Reveal key={s.id}>
                  <section id={s.id} className="scroll-mt-24">
                    <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
                      {i + 1}. {s.title}
                    </h2>
                    <div className="space-y-4 leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_strong]:text-foreground">
                      {s.body}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
