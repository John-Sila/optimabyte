import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site-config";

interface CTASectionProps {
  title?: string;
  description?: string;
  message?: string;
}

export default function CTASection({
  title = "Ready to start a project",
  description = "Send us a request or message us on WhatsApp with what you need. We will confirm scope and price before any work begins.",
  message = "Hello OptimaByte, I would like to discuss a project.",
}: CTASectionProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="site-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 animate-blob rounded-full bg-gold/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 animate-blob rounded-full bg-brandblue/30 blur-3xl [animation-delay:-6s]" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
                <p className="mt-4 text-base leading-relaxed opacity-85 md:text-lg">{description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link to="/contact">
                    Send a request
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                >
                  <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
