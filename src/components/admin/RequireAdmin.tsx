import type { ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/layout/PageShell";
import { useAuth } from "@/lib/auth";

/** Shows its children only to the signed-in admin; everyone else sees a sign-in prompt. */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, ready, openLogin } = useAuth();

  if (admin) return <>{children}</>;

  return (
    <PageShell>
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        {!ready ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
        ) : (
          <div className="animate-fade-up max-w-sm text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="h-8 w-8 text-gold-text" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin only</h1>
            <p className="mt-2 text-muted-foreground">Sign in as admin to view this page.</p>
            <Button className="mt-6" onClick={openLogin}>
              Admin sign-in
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
