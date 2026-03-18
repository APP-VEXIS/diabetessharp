import { useState, useEffect } from "react";
import {
  Pill,
  Target,
  Zap,
  Shield,
  User,
  Smartphone,
  Bell,
  Palette,
  Moon,
  Sun,
} from "lucide-react";
import { getGoals, saveGoals, type GlucoseGoals } from "../../data/goals";
import { HowToUseBanner } from "../../components/HowToUseBanner";

export function SettingsPage() {
  const [medication, setMedication] = useState("");
  const [supplement, setSupplement] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [goals, setGoalsState] = useState<GlucoseGoals>(() => getGoals());

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const updateGoal = (key: keyof GlucoseGoals, value: number) => {
    setGoalsState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your account and preferences.</p>
      </div>

      <HowToUseBanner
        pageKey="settings"
        steps={[
          "Set your blood sugar target range to personalise your Time in Range stats.",
          "Add your medications to help Dr. Marcus give more accurate guidance.",
          "Choose your app theme and notification preferences — changes apply instantly.",
        ]}
      />

      <div className="space-y-6">
        {/* Medications */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Pill size={16} className="text-[var(--color-accent)] shrink-0" /> Medications
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Track medications you're taking. This helps Dr. James provide more relevant guidance.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">No medications added.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add medication..."
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="input-field flex-1 min-h-[44px]"
            />
            <button type="button" className="px-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-hover)] min-h-[44px]">
              Add
            </button>
          </div>
        </div>

        {/* Blood sugar targets — for time-in-range % */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Target size={16} className="text-[var(--color-accent)] shrink-0" /> Blood sugar targets (mg/dL)
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Used for &quot;time in range&quot; on the glucose log. Fasting: between min and max; after meals: below post-meal max.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Fasting min</label>
              <input
                type="number"
                min={60}
                max={130}
                value={goals.fastingMin}
                onChange={(e) => updateGoal("fastingMin", parseInt(e.target.value, 10) || 70)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Fasting max</label>
              <input
                type="number"
                min={70}
                max={180}
                value={goals.fastingMax}
                onChange={(e) => updateGoal("fastingMax", parseInt(e.target.value, 10) || 130)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Post-meal max</label>
              <input
                type="number"
                min={100}
                max={250}
                value={goals.postMealMax}
                onChange={(e) => updateGoal("postMealMax", parseInt(e.target.value, 10) || 180)}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        {/* Supplements */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Zap size={16} className="text-[var(--color-accent)] shrink-0" /> Supplements
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Track supplements you're taking to optimize your program.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">No supplements added.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add supplement..."
              value={supplement}
              onChange={(e) => setSupplement(e.target.value)}
              className="input-field flex-1 min-h-[44px]"
            />
            <button type="button" className="px-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-hover)] min-h-[44px]">
              Add
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Shield size={16} className="text-[var(--color-accent)] shrink-0" /> Subscription
          </h3>
          <p className="text-sm text-[var(--color-text)] font-medium mt-2">Free Plan</p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Upgrade to unlock all features</p>
          <button type="button" className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-semibold hover:opacity-95 transition-opacity">
            Upgrade to Premium
          </button>
        </div>

        {/* Stats Summary */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
            <User size={16} className="text-[var(--color-accent)] shrink-0" /> Stats Summary
          </h3>
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

        {/* Install app on phone */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Smartphone size={16} className="text-[var(--color-accent)] shrink-0" /> Add to Home Screen
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            On your phone, tap the <strong>&quot;Add to phone&quot;</strong> button in the bar above the bottom navigation to install NeuroSharp as an app icon for quick access.
          </p>
        </div>

        {/* Notifications */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Bell size={16} className="text-[var(--color-accent)] shrink-0" /> Notifications
          </h3>
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
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-1">
            <Palette size={16} className="text-[var(--color-accent)] shrink-0" /> Appearance
          </h3>
          <div className="flex items-center justify-between mt-3 mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Dark Mode</p>
              <p className="text-xs text-[var(--color-text-muted)]">Easy on the eyes in low-light environments</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={darkMode}
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${
                darkMode ? "bg-[var(--color-accent)]" : "bg-[var(--color-surface)]"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform flex items-center justify-center ${
                  darkMode ? "left-7" : "left-1"
                }`}
              >
                {darkMode
                  ? <Moon size={14} className="text-[var(--color-accent)]" />
                  : <Sun size={14} className="text-amber-500" />
                }
              </span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-3 rounded-xl border text-left transition-colors ${
                theme === "light"
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <Sun size={18} className="text-amber-500" />
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">Light</p>
              <div className="flex gap-0.5 mt-2 h-1.5 rounded overflow-hidden">
                <div className="w-1/3 bg-white rounded" />
                <div className="w-1/3 bg-[var(--color-accent)] rounded" />
                <div className="w-1/3 bg-[var(--color-text-muted)] rounded" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-3 rounded-xl border text-left transition-colors ${
                theme === "dark"
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <Moon size={18} className="text-[var(--color-info)]" />
              <p className="text-sm font-medium text-[var(--color-text)] mt-1">Dark</p>
              <div className="flex gap-0.5 mt-2 h-1.5 rounded overflow-hidden">
                <div className="w-1/3 bg-[var(--color-surface)] rounded" />
                <div className="w-1/3 bg-[var(--color-accent)] rounded" />
                <div className="w-1/3 bg-[var(--color-surface)] rounded" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
