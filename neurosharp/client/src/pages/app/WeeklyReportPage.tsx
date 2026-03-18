import { trpc } from "../../trpc";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const DEMO = { checkins: 1, exercises: 0, avgScore: 32, streak: 10, totalXP: 65, longestStreak: 1, programDay: 2 };

export function WeeklyReportPage() {
  const { data, isError } = trpc.cognitive.getProgress.useQuery(undefined, { retry: false });
  const scores = isError ? [] : (data?.scores ?? []);
  const programDay = DEMO.programDay;
  const avgScore = scores.length ? Math.round(scores.reduce((s: number, r: { cognitiveScore: number }) => s + r.cognitiveScore, 0) / scores.length) : DEMO.avgScore;
  const streak = data?.dailyStreak ?? DEMO.streak;

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl">🏆</span>
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Weekly Report</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Last 7 days of your program</p>
        </div>
      </div>

      <HowToUseBanner
        pageKey="ns-weekly-report"
        steps={[
          "Review your check-ins, exercises, cognitive score and streak for the last 7 days.",
          "The chart below shows how your score evolved through the week.",
          "Consistent daily training generates a stronger weekly report over time.",
        ]}
      />

      {/* 4 summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <span className="text-[var(--color-success)] text-lg">✓</span>
          <div className="font-display font-bold text-xl text-[var(--color-success)] mt-0.5">{DEMO.checkins}/7</div>
          <div className="text-xs text-[var(--color-text-muted)]">days</div>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[var(--color-text-muted)] text-lg">💪</span>
          <div className="font-display font-bold text-xl text-[var(--color-text)] mt-0.5">{DEMO.exercises}</div>
          <div className="text-xs text-[var(--color-text-muted)]">sessions</div>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[var(--color-accent)] text-lg">⚡</span>
          <div className="font-display font-bold text-xl text-[var(--color-accent)] mt-0.5">{avgScore}</div>
          <div className="text-xs text-[var(--color-text-muted)]">out of 100</div>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-[var(--color-warning)] text-lg">🔥</span>
          <div className="font-display font-bold text-xl text-[var(--color-warning)] mt-0.5">{streak}</div>
          <div className="text-xs text-[var(--color-text-muted)]">days in a row</div>
        </div>
      </div>

      {/* Score Evolution */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Score Evolution</h3>
          <span className="text-xs text-[var(--color-text-muted)]">- Stable</span>
        </div>
        <div className="h-36 flex items-end justify-around gap-1">
          {[32, 34, 33, 35].map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t bg-[var(--color-accent)] min-h-[4px]" style={{ height: `${s}%` }} />
              <span className="text-[10px] text-[var(--color-text-muted)] mt-1">D{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Program Progress */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Program Progress</h3>
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2">
          <span>Start</span>
          <span>Day 90</span>
        </div>
        <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${(programDay / 90) * 100}%` }} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[var(--color-text-muted)]">{Math.round((programDay / 90) * 100)}% complete</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-accent)] text-[var(--color-accent-text)]">Day {programDay} / 90</span>
        </div>
      </div>

      {/* Total XP + Longest Streak */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl">⚡</div>
          <div>
            <div className="font-display font-bold text-2xl text-[var(--color-text)]">{DEMO.totalXP}</div>
            <div className="text-xs text-[var(--color-text-muted)]">Total XP Accumulated</div>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-2xl">⭐</div>
          <div>
            <div className="font-display font-bold text-2xl text-[var(--color-text)]">{DEMO.longestStreak}</div>
            <div className="text-xs text-[var(--color-text-muted)]">Longest Streak (days)</div>
          </div>
        </div>
      </div>

      {/* Dr. Apex Analysis */}
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl">👨‍⚕️</div>
        <div>
          <h3 className="font-semibold text-[var(--color-text)]">Dr. Marcus Analysis</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Personalized summary of your week</p>
        </div>
      </div>
    </div>
  );
}
