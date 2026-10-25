import { useState } from "react";
import { Check, ImagePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUrlDialog from "@/components/admin/ImageUrlDialog";
import { iconMap } from "@/lib/icon-map";
import { useAuth } from "@/lib/auth";
import type { PortfolioProject } from "@/lib/site-config";

interface PortfolioItemProps {
  project: PortfolioProject;
  /** Screenshot address chosen by the admin, if any. */
  imageUrl?: string;
  /** Called after the admin saves a new screenshot address (null = removed). */
  onImageSaved?: (id: string, url: string | null) => void;
  compact?: boolean;
}

export default function PortfolioItem({ project, imageUrl, onImageSaved, compact = false }: PortfolioItemProps) {
  const { admin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const Icon = iconMap[project.icon] ?? iconMap.Code2;
  const showImage = imageUrl && failed !== imageUrl;

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {showImage ? (
          <img
            src={imageUrl}
            alt={`${project.title} screenshot`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(imageUrl)}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-brand-light">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gold/30 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-brandblue/30 blur-2xl" />
            <div className="bg-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Icon className="h-10 w-10 text-gold-light" />
            </span>
          </div>
        )}

        {admin && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setEditing(true)}
            className="absolute right-3 top-3 shadow-md"
            aria-label={`Edit screenshot for ${project.title}`}
          >
            {imageUrl ? <Pencil className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
            {imageUrl ? "Edit image" : "Add image"}
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-text">
            {project.category}
          </span>
          {project.stack.map((s) => (
            <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold text-card-foreground">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        {!compact && (
          <ul className="mt-4 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-text" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {admin && (
        <ImageUrlDialog
          open={editing}
          onOpenChange={setEditing}
          project={project}
          current={imageUrl ?? ""}
          onSaved={(url) => onImageSaved?.(project.id, url)}
        />
      )}
    </article>
  );
}
