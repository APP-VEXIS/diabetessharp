import { trpc } from "../../trpc";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Zap,
  Flame,
  Star,
  Stethoscope,
} from "lucide-react";

const DEMO = { checkins: 1, exercises: 0, avgScore: 32, streak: 10, totalXP: 65, longestStreak: 1, programDay: 2 };

export function WeeklyReportPage() {
  const { data, isError } = trpc.cognitive.getProgress.useQuery(undefined, { retry: false });
  const scores = isError ? [] : (data?.scores ?? []);
  const programDay = DEMO.programDay;
  const avgScore = scores.length ? Math.round(scores.reduce((s: number, r: { cognitiveScore: number }) => s + r.cognitiveScore, 0) / scores.length) : DEMO.avgScore;
  const streak = data?.dailyStreak ?? DEMO.streak;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <CalendarDays size={24} className="text-[var(--color-accent)] shrink-0" aria-hidden />
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">My week with diabetes</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            A gentle overview of your last 7 days so you and your doctor can see the story behind the numbers.
          </p>
        </div>
      </div>

      <HowToUseBanner
        pageKey="weekly-report"
        steps={[
          "Review your check-ins, glucose trends and key stats for the last 7 days.",
          "Share the report with your care team using the export button at the bottom.",
          "Consistent weekly data helps identify patterns your doctor can act on.",
        ]}
      />

      {/* 4 summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <CheckCircle2 size={20} className="text-[var(--color-success)] mx-auto" aria-hidden />
          <div className="font-display font-bold text-xl text-[var(--color-success)] mt-0.5">{DEMO.checkins}/7</div>
          <div className="text-xs text-[var(--color-text-muted)]">days</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Dumbbell size={20} className="text-[var(--color-text-muted)] mx-auto" aria-hidden />
          <div className="font-display font-bold text-xl text-[var(--color-text)] mt-0.5">{DEMO.exercises}</div>
          <div className="text-xs text-[var(--color-text-muted)]">activities</div>
        </div>
        <div className="glass-card p-4 text-center border border-[var(--color-glucose)]/35 bg-[var(--color-glucose)]/5">
          <Zap size={20} className="text-[var(--color-accent)] mx-auto" aria-hidden />
          <div className="font-display font-bold text-xl text-[var(--color-accent)] mt-0.5">{avgScore}</div>
          <div className="text-xs text-[var(--color-text-muted)]">control score (out of 100)</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Flame size={20} className="text-orange-400 mx-auto" aria-hidden />
          <div className="font-display font-bold text-xl text-[var(--color-warning)] mt-0.5">{streak}</div>
          <div className="text-xs text-[var(--color-text-muted)]">days in a row</div>
        </div>
      </div>

      {/* Score Evolution — softer bars with accent gradient */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Control score trend</h3>
          <span className="text-xs text-[var(--color-text-muted)]">small ups and downs are normal</span>
        </div>
        <div className="h-36 flex items-end justify-around gap-1">
          {[32, 34, 33, 35].map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t bg-[var(--color-accent)] min-h-[6px] transition-colors"
                style={{ height: `${s}%` }}
              />
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
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center">
            <Zap size={24} className="text-[var(--color-accent)]" aria-hidden />
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-[var(--color-text)]">{DEMO.totalXP}</div>
            <div className="text-xs text-[var(--color-text-muted)]">Total XP Accumulated</div>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] flex items-center justify-center">
            <Star size={24} className="text-amber-400" aria-hidden />
          </div>
          <div>
            <div className="font-display font-bold text-2xl text-[var(--color-text)]">{DEMO.longestStreak}</div>
            <div className="text-xs text-[var(--color-text-muted)]">Longest Streak (days)</div>
          </div>
        </div>
      </div>

      {/* Dr. James Analysis */}
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center">
          <Stethoscope size={24} className="text-[var(--color-accent)]" aria-hidden />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-text)]">Dr. James Analysis</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Use this view with your doctor to talk about what&apos;s working and what feels hard this week.
          </p>
        </div>
      </div>
    </div>
  );
}
