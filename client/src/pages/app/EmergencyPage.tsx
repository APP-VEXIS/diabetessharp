import { Link } from "react-router-dom";
import { HowToUseBanner } from "../../components/HowToUseBanner";

export function EmergencyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Low blood sugar (hypoglycemia)</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">What to do — keep this page handy</p>
        </div>
        <Link to="/app/dashboard" className="text-sm text-[var(--color-accent)] hover:underline">← Dashboard</Link>
      </div>

      <HowToUseBanner
        pageKey="emergency"
        steps={[
          "Follow the numbered steps in order when you feel symptoms of low blood sugar.",
          "Keep glucose tablets, juice or candy within reach as your fast-acting option.",
          "Call emergency services if symptoms persist after 15 minutes or if you lose consciousness.",
        ]}
      />

      <div className="rounded-xl bg-[var(--color-error)]/15 border-2 border-[var(--color-error)]/50 p-4">
        <p className="font-semibold text-[var(--color-text)]">This is not medical advice. In an emergency, call 911 or your local emergency number.</p>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Signs of low blood sugar</h2>
        <ul className="list-disc list-inside text-sm text-[var(--color-text-muted)] space-y-1">
          <li>Shaking, sweating, fast heartbeat</li>
          <li>Confusion, dizziness, weakness</li>
          <li>Hunger, blurred vision</li>
          <li>Sleepiness, difficulty speaking</li>
        </ul>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">15-15 rule</h2>
        <ol className="list-decimal list-inside text-sm text-[var(--color-text-muted)] space-y-2">
          <li>Eat or drink <strong className="text-[var(--color-text)]">15 grams</strong> of fast-acting carbohydrate (see list below).</li>
          <li>Wait <strong className="text-[var(--color-text)]">15 minutes</strong>, then check your blood sugar again.</li>
          <li>If still low, repeat. If you don’t feel better or can’t check, call for help.</li>
        </ol>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Fast-acting carbs (~15 g)</h2>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          <li>4 glucose tablets</li>
          <li>1/2 cup fruit juice (e.g. orange)</li>
          <li>1 tablespoon sugar or honey</li>
          <li>3–4 hard candies (not sugar-free)</li>
          <li>1 small box of raisins</li>
        </ul>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">When to call 911</h2>
        <ul className="list-disc list-inside text-sm text-[var(--color-text-muted)] space-y-1">
          <li>You can’t eat or drink safely (seizure, unconscious)</li>
          <li>Someone with you doesn’t know what to do</li>
          <li>Blood sugar stays low after 2–3 rounds of 15-15</li>
          <li>You have glucagon and someone can give it — use it, then still call 911</li>
        </ul>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">
        Talk to your doctor about a personal hypo plan and whether you need a glucagon kit.
      </p>
    </div>
  );
}
