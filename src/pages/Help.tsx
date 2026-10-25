import { Link } from "react-router-dom";
import { Clock, FileText, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, siteConfig, whatsappLink } from "@/lib/site-config";

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Fastest for support on an existing project.",
    action: "Open WhatsApp",
    href: whatsappLink("Hello OptimaByte, I need some help."),
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    text: siteConfig.email,
    action: "Send an email",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    title: "Phone",
    text: siteConfig.phone,
    action: "Call us",
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
];

export default function Help() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Help"
        title="How can we help?"
        description="Answers to common questions, and the quickest ways to reach us."
      />

      <section className="py-14 md:py-20">
        <div className="site-container">
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card-lift group block h-full rounded-2xl border border-border bg-card p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                    <c.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-foreground">{c.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                  <p className="mt-4 text-sm font-medium text-primary">{c.action} &rarr;</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-20">
            <Reveal>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <Clock className="h-4 w-4 text-gold-text" />
                    Reply times
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Request sent before 6:00 pm Nairobi time: we reply later the same day, in the evening.
                    Request sent after 6:00 pm: we reply early the next morning. Replies come to the email you
                    give on the form.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-gold-text" />
                    Form not working?
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>Fill in your name, a valid email, a service and at least a sentence of details.</li>
                    <li>Tick &ldquo;I&apos;m not a robot&rdquo; before sending.</li>
                    <li>Limit: 3 requests per hour for each email and device. Wait a little, or use WhatsApp.</li>
                    <li>Check your connection, then try again.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <FileText className="h-4 w-4 text-gold-text" />
                    Policies
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Read our <Link to="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>{" "}
                    and <Link to="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title="Still need help?"
        description="Send us a message and a real person will get back to you."
        message="Hello OptimaByte, I need some help."
      />
    </PageShell>
  );
}
