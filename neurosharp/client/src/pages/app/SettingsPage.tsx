import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const THEME_KEY = "neurosharp_theme";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === "light" || s === "dark") return s;
  } catch {}
  return "dark";
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}

export function SettingsPage() {
  const [medication, setMedication] = useState("");
  const [supplement, setSupplement] = useState("");
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [pushEnabled, setPushEnabled] = useState(false);

  const handleThemeChange = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your account and preferences.</p>
      </div>

      <HowToUseBanner
        pageKey="ns-settings"
        steps={[
          "Add your medications to help Dr. Marcus give more accurate and personalised guidance.",
          "Toggle the app theme between light and dark to match your preference.",
          "Your settings are saved instantly and apply across the full app.",
        ]}
      />

      <div className="space-y-4">

        {/* Medications */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Medications</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Track medications you&apos;re taking. This helps Dr. Marcus provide more relevant guidance.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">No medications added.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add medication…"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="input-field flex-1 min-h-[44px]"
            />
            <button
              type="button"
              className="px-4 rounded-xl border text-[var(--color-text)] font-medium min-h-[44px] transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Supplements */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Supplements</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Track supplements you&apos;re taking to optimize your program.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">No supplements added.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add supplement…"
              value={supplement}
              onChange={(e) => setSupplement(e.target.value)}
              className="input-field flex-1 min-h-[44px]"
            />
            <button
              type="button"
              className="px-4 rounded-xl border text-[var(--color-text)] font-medium min-h-[44px] transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Subscription</h3>
          <p className="text-sm text-[var(--color-text)] font-medium mt-2">Free Plan</p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Upgrade to unlock all features</p>
          <button type="button" className="btn btn-primary w-full justify-center">
            Upgrade to Premium
          </button>
        </div>

        {/* Stats Summary */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Stats Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-display font-bold text-2xl text-[var(--color-accent)]">65</div>
              <div className="text-xs text-[var(--color-text-muted)]">Total XP</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-[var(--color-accent)]">1</div>
              <div className="text-xs text-[var(--color-text-muted)]">Best Streak</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-[var(--color-accent)]">0</div>
              <div className="text-xs text-[var(--color-text-muted)]">Exercises Done</div>
            </div>
          </div>
        </div>

        {/* Install app */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Add to Home Screen</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            On your phone, tap the <strong>&quot;Add to phone&quot;</strong> button in the bar above the bottom navigation to install NeuroSharp as an app icon.
          </p>
        </div>

        {/* Notifications */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Notifications</h3>
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Push Notifications</p>
              <p className="text-xs text-[var(--color-text-muted)]">Enable to receive daily reminders</p>
            </div>
            <button
              type="button"
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors min-h-[44px] ${
                pushEnabled
                  ? "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  : "bg-[var(--color-accent)] text-[var(--color-accent-text)]"
              }`}
            >
              {pushEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Appearance</h3>

          {/* Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Dark Mode</p>
              <p className="text-xs text-[var(--color-text-muted)]">Easy on the eyes in low-light environments</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
              className="relative w-14 h-8 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{ background: theme === "dark" ? "var(--color-accent)" : "var(--color-border)" }}
            >
              <span
                className="absolute top-1 w-6 h-6 rounded-full shadow-[var(--shadow-elevation-low)] transition-transform"
                style={{
                  background: "var(--color-surface-elevated)",
                  left: theme === "dark" ? "1.75rem" : "0.25rem",
                }}
                aria-hidden
              />
            </button>
          </div>

          {/* Theme selector */}
          <div className="grid grid-cols-2 gap-3">
            {(["light", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleThemeChange(t)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  theme === t
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]"
                }`}
                aria-pressed={theme === t}
              >
                <p className="text-sm font-medium text-[var(--color-text)] capitalize">{t}</p>
                <div className="flex gap-0.5 mt-2 h-1.5 rounded overflow-hidden">
                  <div
                    className="w-1/3 rounded"
                    style={{ background: t === "light" ? "#f8f9fa" : "#0d1117" }}
                    aria-hidden
                  />
                  <div className="w-1/3 rounded bg-[var(--color-accent)]" aria-hidden />
                  <div
                    className="w-1/3 rounded"
                    style={{ background: t === "light" ? "#6b7280" : "#374151" }}
                    aria-hidden
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
