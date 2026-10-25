import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/contact/BookingForm";
import Reveal from "@/components/Reveal";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-gold-text";

export default function Contact() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Start a project or ask a question"
        description="Send us a request and we reply by email, or reach us directly on WhatsApp, email or phone."
      />

      <section className="py-14 md:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] xl:gap-20">
          <Reveal>
            <div className="space-y-8">
              <div>
                <h2 className="mb-5 text-xl font-bold text-foreground">Direct contact</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                      <MessageCircle className="h-5 w-5 text-gold-text" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        Message us directly
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                      <Mail className="h-5 w-5 text-gold-text" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                        {siteConfig.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                      <Phone className="h-5 w-5 text-gold-text" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Phone</p>
                      <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className={linkClass}>
                        {siteConfig.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                      <MapPin className="h-5 w-5 text-gold-text" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-gold-text" />
                  When we reply
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Requests sent before 6:00 pm Nairobi time get a reply later the same day. Requests after 6:00 pm
                  get a reply early the next morning.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For changes or support on an existing project, message us on WhatsApp directly. It is faster and
                  keeps a record tied to your project. Questions? See our{" "}
                  <Link to="/help" className="font-medium text-primary hover:underline">Help page</Link>.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
