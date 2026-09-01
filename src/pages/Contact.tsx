import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/contact/BookingForm";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export default function Contact() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Start a project or ask a question"
        description="Fill in the form or reach us directly on WhatsApp, email or phone."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[1fr_1.3fr] gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Direct contact</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">WhatsApp</p>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Message us directly
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">{siteConfig.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                For changes or support on an existing project, message us on
                WhatsApp directly rather than using the form. It is faster
                and keeps a record of the request tied to your project.
              </p>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>
    </PageShell>
  );
}
