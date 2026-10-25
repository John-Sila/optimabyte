import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, Smartphone, Receipt, Stethoscope, GraduationCap, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

const chips = [
  { icon: Bike, label: "Fleet apps" },
  { icon: Receipt, label: "POS" },
  { icon: Stethoscope, label: "Hospital ERP" },
  { icon: GraduationCap, label: "School ERP" },
  { icon: Smartphone, label: "Android & iOS" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] animate-blob rounded-full bg-gold/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] animate-blob rounded-full bg-brandblue/20 blur-3xl [animation-delay:-7s]" />

      <div className="site-container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] xl:gap-20 2xl:py-32">
        <div>
          <p className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-gold-text/30 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-text">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-text" />
            Software, apps and systems from Nairobi
          </p>
          <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground [animation-delay:80ms] md:text-6xl 2xl:text-7xl">
            Software that runs <span className="text-gradient-gold">your operation.</span>
          </h1>
          <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted-foreground [animation-delay:160ms] md:text-xl">
            Android and iOS apps, POS systems and ERP for fleets, shops, hospitals, schools and growing businesses.
            Built around how you work, then kept running with ongoing support.
          </p>

          <ul className="mt-7 flex animate-fade-up flex-wrap gap-2.5 [animation-delay:220ms]">
            {chips.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-sm font-medium text-foreground backdrop-blur"
              >
                <Icon className="h-4 w-4 text-gold-text" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex animate-fade-up flex-wrap gap-4 [animation-delay:300ms]">
            <Button asChild size="lg" className="group">
              <Link to="/contact">
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Message us on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <div className="relative hidden animate-fade-up [animation-delay:200ms] lg:block" aria-hidden="true">
          <div className="animate-float">
            <svg viewBox="0 0 520 440" className="h-auto w-full drop-shadow-xl" role="img" aria-label="">
              <rect x="10" y="20" width="380" height="260" rx="16" className="fill-card" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <rect x="10" y="20" width="380" height="42" rx="16" className="fill-secondary" />
              <circle cx="36" cy="41" r="6" fill="#B8862E" opacity="0.8" />
              <circle cx="58" cy="41" r="6" fill="#3B82F6" opacity="0.8" />
              <circle cx="80" cy="41" r="6" className="fill-muted-foreground" opacity="0.35" />
              <rect x="34" y="88" width="150" height="14" rx="4" fill="hsl(var(--primary))" />
              <rect x="34" y="112" width="250" height="9" rx="4" className="fill-muted-foreground" opacity="0.3" />
              <rect x="34" y="130" width="200" height="9" rx="4" className="fill-muted-foreground" opacity="0.3" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={34 + i * 116} y="162" width="104" height="84" rx="10" className="fill-secondary" />
                  <rect x={48 + i * 116} y="178" width="56" height="10" rx="3" fill={i === 1 ? "#3B82F6" : "#B8862E"} opacity="0.85" />
                  <rect x={48 + i * 116} y="198" width="76" height="7" rx="3" className="fill-muted-foreground" opacity="0.3" />
                  <rect x={48 + i * 116} y="212" width="44" height="7" rx="3" className="fill-muted-foreground" opacity="0.3" />
                  <rect x={48 + i * 116} y="226" width={30 + i * 14} height="6" rx="3" fill="#B8862E" opacity="0.35" />
                </g>
              ))}

              <g className="animate-float [animation-delay:-3s]">
                <rect x="318" y="110" width="170" height="320" rx="28" className="fill-card" stroke="hsl(var(--border))" strokeWidth="2" />
                <rect x="332" y="138" width="142" height="276" rx="12" className="fill-secondary" />
                <rect x="384" y="122" width="38" height="8" rx="4" className="fill-muted-foreground" opacity="0.35" />
                <rect x="348" y="156" width="90" height="12" rx="4" fill="hsl(var(--primary))" />
                <rect x="348" y="182" width="110" height="52" rx="10" className="fill-card" />
                <rect x="360" y="194" width="50" height="9" rx="3" fill="#3B82F6" opacity="0.85" />
                <rect x="360" y="212" width="76" height="7" rx="3" className="fill-muted-foreground" opacity="0.3" />
                <rect x="348" y="244" width="110" height="52" rx="10" className="fill-card" />
                <rect x="360" y="256" width="50" height="9" rx="3" fill="#B8862E" opacity="0.85" />
                <rect x="360" y="274" width="76" height="7" rx="3" className="fill-muted-foreground" opacity="0.3" />
                <rect x="348" y="306" width="110" height="52" rx="10" className="fill-card" />
                <rect x="360" y="318" width="50" height="9" rx="3" fill="#3B82F6" opacity="0.85" />
                <rect x="360" y="336" width="76" height="7" rx="3" className="fill-muted-foreground" opacity="0.3" />
                <circle cx="403" cy="388" r="11" fill="#B8862E" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
