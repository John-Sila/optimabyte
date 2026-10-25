import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { iconMap } from "@/lib/icon-map";
import type { ServiceDetail } from "@/lib/site-config";

interface ServiceCardProps {
  service: ServiceDetail;
  compact?: boolean;
}

export default function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const Icon = iconMap[service.icon];

  return (
    <div className="card-lift group flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 transition-colors duration-300 group-hover:bg-primary">
        {Icon && <Icon className="h-6 w-6 text-gold-text transition-colors duration-300 group-hover:text-primary-foreground" />}
      </div>
      <h3 className="mt-5 text-lg font-bold text-card-foreground">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
      {!compact && (
        <Link
          to={`/services#${service.id}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
