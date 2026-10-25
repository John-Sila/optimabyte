import { useEffect, useId, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface VerifyBoxProps {
  onChange: (verified: boolean) => void;
  /** Change this number to reset the box (e.g. after a successful send). */
  resetKey?: number;
  invalid?: boolean;
}

type Phase = "idle" | "checking" | "done";

/**
 * "I'm not a robot" checkbox. It is a deterrent against simple scripts (needs a
 * real click or key press, then a short check). The real protection against
 * floods is the server-side rate limit in firestore.rules.
 */
export default function VerifyBox({ onChange, resetKey = 0, invalid = false }: VerifyBoxProps) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<number>();

  useEffect(() => {
    setPhase("idle");
    onChange(false);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ignore synthetic events fired by scripts.
    if (!e.nativeEvent.isTrusted || phase !== "idle") return;
    setPhase("checking");
    timer.current = window.setTimeout(
      () => {
        setPhase("done");
        onChange(true);
      },
      700 + Math.random() * 700,
    );
  };

  return (
    <div
      className={`flex h-[78px] w-full max-w-[320px] items-center justify-between rounded-[3px] border bg-[#f9f9f9] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:bg-card ${
        invalid ? "border-destructive" : "border-[#d3d3d3] dark:border-border"
      }`}
    >
      <label htmlFor={id} className="flex cursor-pointer select-none items-center gap-4">
        <span className="relative flex h-7 w-7 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={phase === "done"}
            onChange={handle}
            disabled={phase !== "idle"}
            aria-busy={phase === "checking"}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
          />
          {phase !== "checking" && (
            <span
              aria-hidden="true"
              className={`absolute inset-0 rounded-[2px] border-2 bg-white transition-colors dark:bg-background ${
                phase === "done"
                  ? "border-transparent"
                  : "border-[#c1c1c1] peer-hover:border-[#8f8f8f] peer-focus-visible:border-brandblue peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
              }`}
            />
          )}
          {phase === "checking" && (
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-spin rounded-full border-[3px] border-brandblue/25 border-t-brandblue"
            />
          )}
          {phase === "done" && (
            <svg
              aria-hidden="true"
              viewBox="0 0 28 28"
              className="absolute inset-0 h-7 w-7 animate-pop"
              fill="none"
              stroke="#0f9d58"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15 L11 22 L24 6" strokeDasharray="30" className="animate-draw-check" />
            </svg>
          )}
        </span>
        <span className="text-[15px] text-foreground">I&apos;m not a robot</span>
      </label>

      <div className="flex flex-col items-center gap-0.5 text-center leading-none text-muted-foreground">
        <ShieldCheck className="h-8 w-8 text-gold-text" aria-hidden="true" />
        <span className="text-[10px] font-medium">Human check</span>
        <span className="text-[8px]">
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Privacy
          </a>{" "}
          -{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Terms
          </a>
        </span>
      </div>
    </div>
  );
}
