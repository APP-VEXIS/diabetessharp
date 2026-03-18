import { getSimpleInsights } from "../../data/insights";
import { HowToUseBanner } from "../../components/HowToUseBanner";

export function InsightsPage() {
  const insights = getSimpleInsights();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Insights</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Simple patterns based on your recent blood sugar and meals. Use these to prepare changes and questions for
          your care team.
        </p>
      </div>

      <HowToUseBanner
        pageKey="insights"
        steps={[
          "Insights are generated automatically from your blood sugar and meal log data.",
          "Tap 'Ask Dr. Marcus' on any insight to explore it with AI guidance.",
          "New insights appear as you log more readings — aim for 7+ entries per week.",
        ]}
      />

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="glass-card p-4 border border-[var(--color-border-subtle)]"
          >
            <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{insight.title}</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

