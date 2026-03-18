import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const PROGRAM_FIELDS = [
  { label: "Age Group", value: "35" },
  { label: "Memory Focus", value: "Moderate" },
  { label: "Primary Goal", value: "Clarity" },
  { label: "Exercise Frequency", value: "3-4x" },
  { label: "Sleep Hours", value: "7h" },
  { label: "Stress Level", value: "6/10" },
];

export function ProfilePage() {
  const [medication, setMedication] = useState("");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Profile</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your health profile and account settings.</p>
      </div>

      <HowToUseBanner
        pageKey="ns-profile"
        steps={[
          "See your program day, streak and current level at a glance.",
          "Tap 'Update Questionnaire' to adjust your health profile and cognitive goals.",
          "Your profile information is used to personalise exercises and Dr. Marcus responses.",
        ]}
      />

      <div className="space-y-6">
        {/* User card */}
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent-text)] font-display font-bold text-lg shrink-0">
            1A
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[var(--color-text)] truncate">NeuroSharp User</p>
            <p className="text-sm text-[var(--color-text-muted)] truncate">user@example.com</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-success-soft)] text-[var(--color-success)]">
                Level 1
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                Day 2 of 90
              </span>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            Program Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROGRAM_FIELDS.map((f) => (
              <div key={f.label} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{f.label}</p>
                <p className="text-sm font-medium text-[var(--color-text)] mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 mt-4 mx-auto text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Update Questionnaire
          </button>
        </div>

        {/* Medications */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            Medications
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Track medications you're taking. This helps Dr. Marcus provide more relevant guidance.
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
      </div>
    </div>
  );
}
