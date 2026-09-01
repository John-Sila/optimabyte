import { ImageOff } from "lucide-react";
import type { PortfolioProject } from "@/lib/site-config";

interface PortfolioItemProps {
  project: PortfolioProject;
}

export default function PortfolioItem({ project }: PortfolioItemProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex h-40 items-center justify-center bg-secondary text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="h-6 w-6" />
          <span className="text-xs">
            {project.placeholder ? "Screenshot coming soon" : "Screenshot on request"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground mb-3">
          {project.category}
        </span>
        <h3 className="text-base font-semibold text-card-foreground">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
}
