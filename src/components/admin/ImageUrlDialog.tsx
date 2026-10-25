import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isSafeImageUrl } from "@/lib/content";
import type { PortfolioProject } from "@/lib/site-config";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: PortfolioProject;
  current: string;
  onSaved: (url: string | null) => void;
}

export default function ImageUrlDialog({ open, onOpenChange, project, current, onSaved }: Props) {
  const [url, setUrl] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewOk, setPreviewOk] = useState(true);

  useEffect(() => {
    if (open) {
      setUrl(current);
      setError("");
      setPreviewOk(true);
    }
  }, [open, current]);

  const save = async (next: string | null) => {
    setBusy(true);
    setError("");
    try {
      const { setPortfolioImage } = await import("@/lib/admin-data");
      await setPortfolioImage(project.id, next);
      onSaved(next);
      toast.success(next ? "Screenshot updated" : "Screenshot removed");
      onOpenChange(false);
    } catch {
      setError("Could not save. Check that you are signed in as admin and that the Firestore rules are deployed.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    if (!isSafeImageUrl(value)) {
      setError("Enter a full image address starting with https://");
      return;
    }
    void save(value);
  };

  const trimmed = url.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Screenshot for {project.title}</DialogTitle>
          <DialogDescription>
            Paste the address of an image. It is shown on this card for every visitor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="img-url" className="mb-1.5 block text-sm font-medium">
              Image URL
            </label>
            <input
              id="img-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPreviewOk(true);
                if (error) setError("");
              }}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {trimmed && isSafeImageUrl(trimmed) && (
            <div className="overflow-hidden rounded-lg border border-border bg-secondary">
              {previewOk ? (
                <img
                  src={trimmed}
                  alt="Preview"
                  onError={() => setPreviewOk(false)}
                  className="aspect-[16/10] w-full object-cover object-top"
                />
              ) : (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  This address did not load as an image. Check the link.
                </p>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={busy || !current}
              onClick={() => void save(null)}
              className="text-destructive hover:text-destructive"
            >
              Remove image
            </Button>
            <Button type="submit" disabled={busy || !trimmed}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
