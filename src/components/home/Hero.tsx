import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-primary mb-4">
            Software development and digital services
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Software, apps and websites built around your business
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            We design and build custom software, Android and iOS apps, and
            business websites, then keep them running with ongoing database
            management and support after launch.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a
                href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Message us on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">
                View our services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          <svg viewBox="0 0 480 380" className="w-full h-auto" role="img" aria-label="Illustration of a browser window and a mobile app screen">
            <rect x="20" y="20" width="340" height="230" rx="10" className="fill-secondary" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="20" y="20" width="340" height="34" rx="10" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <circle cx="42" cy="37" r="5" className="fill-muted-foreground" opacity="0.4"/>
            <circle cx="60" cy="37" r="5" className="fill-muted-foreground" opacity="0.4"/>
            <circle cx="78" cy="37" r="5" className="fill-muted-foreground" opacity="0.4"/>
            <rect x="42" y="76" width="140" height="10" rx="2" fill="hsl(var(--primary))"/>
            <rect x="42" y="98" width="220" height="8" rx="2" className="fill-muted-foreground" opacity="0.35"/>
            <rect x="42" y="116" width="180" height="8" rx="2" className="fill-muted-foreground" opacity="0.35"/>
            <rect x="42" y="146" width="90" height="60" rx="6" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="146" y="146" width="90" height="60" rx="6" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="250" y="146" width="90" height="60" rx="6" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="58" y="160" width="58" height="8" rx="2" fill="hsl(38 60% 45%)" opacity="0.8"/>
            <rect x="58" y="176" width="40" height="6" rx="2" className="fill-muted-foreground" opacity="0.3"/>
            <rect x="162" y="160" width="58" height="8" rx="2" fill="hsl(var(--primary))" opacity="0.8"/>
            <rect x="162" y="176" width="40" height="6" rx="2" className="fill-muted-foreground" opacity="0.3"/>
            <rect x="266" y="160" width="58" height="8" rx="2" fill="hsl(38 60% 45%)" opacity="0.8"/>
            <rect x="266" y="176" width="40" height="6" rx="2" className="fill-muted-foreground" opacity="0.3"/>

            <rect x="300" y="130" width="130" height="230" rx="20" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1.5"/>
            <rect x="312" y="150" width="106" height="180" rx="4" className="fill-secondary"/>
            <rect x="330" y="166" width="70" height="10" rx="2" fill="hsl(var(--primary))"/>
            <rect x="330" y="186" width="70" height="34" rx="4" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="330" y="228" width="70" height="34" rx="4" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="330" y="270" width="70" height="34" rx="4" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1"/>
            <circle cx="365" cy="342" r="8" fill="hsl(38 60% 45%)"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
