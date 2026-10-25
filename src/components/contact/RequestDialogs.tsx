import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";
import type { ReplyExpectation } from "@/lib/time";

export interface SentInfo {
  name: string;
  email: string;
  expectation: ReplyExpectation;
}

export function RequestSentDialog({
  info,
  onClose,
}: {
  info: SentInfo | null;
  onClose: () => void;
}) {
  const firstName = info?.name.trim().split(/\s+/)[0] ?? "";
  return (
    <Dialog open={!!info} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        {info && (
          <>
            <div className="relative mx-auto mt-2 flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/30" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 animate-pop">
                <CheckCircle2 className="h-11 w-11 text-emerald-600 dark:text-emerald-400" />
              </span>
            </div>
            <DialogHeader className="items-center sm:text-center">
              <DialogTitle className="text-2xl">Thank you, {firstName}</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Your request has been sent to the OptimaByte team.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We will reply to{" "}
              <span className="font-semibold text-foreground break-all">{info.email}</span>{" "}
              {info.expectation.late ? (
                <>
                  <span className="font-semibold text-foreground">{info.expectation.when}</span>,{" "}
                  <span className="font-semibold text-foreground">{info.expectation.date}</span>,
                  because it is already past 6:00 pm in Nairobi.
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{info.expectation.when}</span>{" "}
                  (<span className="font-semibold text-foreground">{info.expectation.date}</span>).
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Check your spam folder if you do not see our email.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={onClose}>Done</Button>
              <Button asChild variant="outline">
                <a
                  href={whatsappLink("Hello OptimaByte, I just sent a request through your website.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Also message us on WhatsApp
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function RateLimitDialog({
  retryAt,
  onClose,
}: {
  retryAt: Date | null;
  onClose: () => void;
}) {
  const time = retryAt
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(retryAt)
    : "";
  return (
    <Dialog open={!!retryAt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 animate-pop">
          <Clock className="h-9 w-9 text-amber-600 dark:text-amber-400" />
        </div>
        <DialogHeader className="items-center sm:text-center">
          <DialogTitle className="text-xl">You have reached the limit</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            To keep the form free of spam, each email and device can send 3 requests per hour.
            Please try again after <span className="font-semibold text-foreground">{time}</span>, or
            message us on WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={onClose}>Okay</Button>
          <Button asChild variant="outline">
            <a
              href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
