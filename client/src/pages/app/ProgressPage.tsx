import { trpc } from "../../trpc";
import {
  TrendingUp,
  Flame,
  ShieldCheck,
  Target,
  Star,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import { evaluateAndStoreAchievements, getAchievements } from "../../data/achievements";
import { getCurrentStreak, getBestStreak } from "../../data/streak";
import { getRecentLogs, getTimeInRangePercent } from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";

const DEMO = { programDay: 2, scoreImprovement: 0, currentStreak: 1, badgesEarned: 0, totalXP: 65, levelXP: 500 };
const DEMO_SCORES = [
  { day: 1, score: 32 },
  { day: 2, score: 34 },
];

const ACHIEVEMENTS_CATALOG = [
  { id: "first_log",  icon: <Target size={20} className="text-[var(--color-accent)]" />,   title: "First Step",     desc: "Log your first blood sugar reading" },
  { id: "streak_7",  icon: <Flame size={20} className="text-orange-400" />,                title: "Week Warrior",   desc: "Complete 7 days in a row" },
  { id: "streak_30", icon: <ShieldCheck size={20} className="text-[var(--color-success)]" />, title: "Iron Will",   desc: "Maintain a 30-day streak" },
  { id: "tir_70",    icon: <TrendingUp size={20} className="text-[var(--color-success)]" />, title: "70% In Range", desc: "Reach 70% time in range" },
  { id: "tir_80",    icon: <Star size={20} className="text-yellow-400" />,                  title: "80% In Range",   desc: "Outstanding glucose control" },
];

export function ProgressPage() {
  const { data, isLoading, isError } = trpc.cognitive.getProgress.useQuery(undefined, { retry: false });
  const scores = isError ? DEMO_SCORES : (data?.scores ?? []).slice(0, 7).map((r: { date: string; cognitiveScore: number }, i: number) => ({ day: i + 1, score: r.cognitiveScore }));
  const displayScores = scores.length ? scores : DEMO_SCORES;
  const programDay = DEMO.programDay;
  const realStreak = getCurrentStreak();
  const bestStreak = getBestStreak();
  const streak = realStreak > 0 ? realStreak : (data?.dailyStreak ?? DEMO.currentStreak);
  const totalXP = DEMO.totalXP;

  // Use real glucose data for TIR display
  const goals = getGoals();
  const glucoseLogs = getRecentLogs(30);
  const tir = getTimeInRangePercent(glucoseLogs, goals.fastingMin, goals.fastingMax, goals.postMealMax);

  // Evaluate and get real achievements
  useEffect(() => { evaluateAndStoreAchievements(); }, []);
  const unlockedIds = new Set(getAchievements().map((a) => a.id));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Track your journey</p>
      </div>

      <HowToUseBanner
        pageKey="progress"
        steps={[
          "Check your program day, streak and time in range in the four metric cards.",
          "Scroll down to see your performance chart and blood sugar overview.",
          "Unlock achievement badges by reaching health milestones — they update automatically.",
        ]}
      />

      {isLoading && !isError ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6" aria-hidden>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton h-3 w-16 rounded mb-2" />
              <div className="skeleton h-7 w-10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 4 metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger-grid">
            <div className="stat-card">
              <div className="label">Program Day</div>
              <div className="value">{programDay}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">of 90 · Week {Math.ceil(programDay / 7)}</div>
            </div>
            <div className="stat-card">
              <div className="label">Streak</div>
              <div className="flex items-baseline gap-1.5">
                <div className="value">{streak}</div>
                {streak >= bestStreak && streak > 1 && (
                  <span className="text-[10px] font-semibold text-[var(--color-success)] uppercase tracking-wider">best</span>
                )}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                {bestStreak > streak ? `Best: ${bestStreak} days` : "Days in a row"}
              </div>
            </div>
            <div className="stat-card">
              <div className="label">Time in range</div>
              {tir !== null ? (
                <>
                  <div className="value">{tir}%</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Last 30 days</div>
                </>
              ) : (
                <>
                  <div className="value text-[var(--color-text-tertiary)]">—</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Log readings</div>
                </>
              )}
            </div>
            <div className="stat-card">
              <div className="label">Badges earned</div>
              <div className="value">{unlockedIds.size}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">of {ACHIEVEMENTS_CATALOG.length} total</div>
            </div>
          </div>

          {/* Level / XP bar */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-[var(--color-accent)]" aria-hidden />
              <span className="font-semibold text-[var(--color-text)]">Level 1</span>
              <span className="text-[var(--color-text-muted)] text-sm">65 total XP</span>
            </div>
            <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500 ease-out"
                style={{ width: `${(totalXP / DEMO.levelXP) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{totalXP}/500 XP to next level</p>
          </div>

          {/* Two main cards: Line chart + Radar */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                Performance Score Over Time
              </h3>
              <div className="h-48 flex items-end justify-around gap-1 px-2">
                {displayScores.map((p: { day: number; score: number }) => (
                  <div key={p.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[var(--color-accent)] min-h-[4px] transition-[height] duration-300 ease-out"
                      style={{ height: `${p.score}%` }}
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)]">Day {p.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-2 px-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">
                Blood Sugar Overview
              </h3>
              <div className="flex items-center justify-center gap-8">
                {/* TIR Ring */}
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 72 72" className="w-20 h-20" aria-hidden>
                    <circle cx="36" cy="36" r="28" fill="none" stroke="var(--color-border-subtle)" strokeWidth="6" />
                    {tir !== null && (
                      <circle
                        cx="36" cy="36" r="28" fill="none"
                        stroke={tir >= 70 ? "var(--color-success)" : tir >= 50 ? "var(--color-warning)" : "var(--color-alert)"}
                        strokeWidth="6"
                        strokeDasharray={`${(tir / 100) * 175.93} 175.93`}
                        strokeLinecap="round"
                        transform="rotate(-90 36 36)"
                      />
                    )}
                    <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-text-primary)">
                      {tir !== null ? `${tir}%` : "—"}
                    </text>
                  </svg>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] text-center leading-tight">
                    Time in range<br />last 30 days
                  </span>
                </div>

                {/* Side stats */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">Avg glucose</div>
                    <div className="font-display font-bold text-lg text-[var(--color-text-primary)]">
                      {glucoseLogs.length > 0
                        ? `${Math.round(glucoseLogs.reduce((s, e) => s + e.value, 0) / glucoseLogs.length)}`
                        : "—"}
                      <span className="text-xs font-normal text-[var(--color-text-tertiary)] ml-1">mg/dL</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">Readings</div>
                    <div className="font-display font-bold text-lg text-[var(--color-text-primary)]">
                      {glucoseLogs.length}
                      <span className="text-xs font-normal text-[var(--color-text-tertiary)] ml-1">/ 30 days</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">Target</div>
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {goals.fastingMin}–{goals.fastingMax}
                      <span className="text-xs font-normal text-[var(--color-text-tertiary)] ml-1">mg/dL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements — locked/unlocked like Apple Fitness+ */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Achievements</h3>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">{unlockedIds.size} / {ACHIEVEMENTS_CATALOG.length} unlocked</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {ACHIEVEMENTS_CATALOG.map((a) => {
                const unlocked = unlockedIds.has(a.id);
                return (
                  <div
                    key={a.id}
                    className="glass-card p-4 flex flex-col gap-2 transition-colors"
                    style={{ opacity: unlocked ? 1 : 0.45 }}
                    aria-label={`${a.title}: ${unlocked ? "Unlocked" : "Locked"}`}
                  >
                    <div className={unlocked ? "" : "grayscale"} aria-hidden>{a.icon}</div>
                    <div>
                      <div className="font-semibold text-xs text-[var(--color-text-primary)]">{a.title}</div>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 leading-snug">{a.desc}</p>
                    </div>
                    {unlocked && (
                      <span className="text-[9px] font-semibold text-[var(--color-success)] uppercase tracking-wider">
                        Unlocked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
