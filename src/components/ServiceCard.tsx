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
    <div className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-card-foreground">{service.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.summary}</p>
      {!compact && (
        <Link
          to={`/services#${service.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
