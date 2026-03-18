import { useState } from "react";
import { X, Lightbulb } from "lucide-react";

interface HowToUseBannerProps {
  /** Unique key per page — used to persist dismissal in localStorage */
  pageKey: string;
  steps: string[];
}

export function HowToUseBanner({ pageKey, steps }: HowToUseBannerProps) {
  const storageKey = `howto_dismissed_${pageKey}`;

  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // ignore storage errors
    }
    setDismissed(true);
  };

  return (
    <div
      className="rounded-xl px-4 py-3.5 flex gap-3 animate-in"
      style={{
        background: "var(--color-surface-overlay)",
        border: "1px solid var(--color-border-subtle)",
      }}
      role="note"
      aria-label="How to use this page"
    >
      <Lightbulb
        size={15}
        className="shrink-0 mt-0.5"
        style={{ color: "var(--color-accent)" }}
        aria-hidden
      />

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
          How to use
        </p>
        <ol className="space-y-1.5">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] leading-snug">
              <span
                className="shrink-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center mt-0.5"
                style={{ background: "var(--color-accent)", color: "white" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        style={{ color: "var(--color-text-tertiary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        aria-label="Dismiss how to use"
      >
        <X size={13} />
      </button>
    </div>
  );
}
