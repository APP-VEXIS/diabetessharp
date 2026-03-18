import { trpc } from "../../trpc";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const DEMO = { programDay: 2, scoreImprovement: 0, currentStreak: 1, badgesEarned: 0, totalXP: 65, levelXP: 500 };
const DEMO_SCORES = [
  { day: 1, score: 32 },
  { day: 2, score: 34 },
];
const RADAR_LABELS = ["Focus", "Memory", "Speed", "Recall", "Attention"];
const RADAR_VALUES = [65, 58, 52, 60, 55];
const ACHIEVEMENTS = [
  { id: "1", icon: "📈", title: "First Step", desc: "Complete your first check-in" },
  { id: "2", icon: "🔥", title: "Week Warrior", desc: "Complete 7 consecutive days" },
  { id: "3", icon: "👤", title: "Iron Will", desc: "Maintain a 30-day streak" },
  { id: "4", icon: "🧠", title: "Memory Master", desc: "Complete 10 memory sessions" },
];

export function ProgressPage() {
  const { data, isLoading, isError } = trpc.cognitive.getProgress.useQuery(undefined, { retry: false });
  const scores = isError ? DEMO_SCORES : (data?.scores ?? []).slice(0, 7).map((r: { date: string; cognitiveScore: number }, i: number) => ({ day: i + 1, score: r.cognitiveScore }));
  const displayScores = scores.length ? scores : DEMO_SCORES;
  const programDay = DEMO.programDay;
  const streak = data?.dailyStreak ?? DEMO.currentStreak;
  const totalXP = DEMO.totalXP;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Track your journey</p>
      </div>

      <HowToUseBanner
        pageKey="ns-progress"
        steps={[
          "Check your program day, streak, XP and cognitive score improvement in the metric cards.",
          "Scroll down to see your score history chart over the last 30 days.",
          "Unlock achievement badges by completing exercises and reaching cognitive milestones.",
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
              <div className="label">Score improvement</div>
              <div className="value">{DEMO.scoreImprovement > 0 ? `+${DEMO.scoreImprovement}` : DEMO.scoreImprovement}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">vs program start</div>
            </div>
            <div className="stat-card">
              <div className="label">Streak</div>
              <div className="value">{streak}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Days in a row</div>
            </div>
            <div className="stat-card">
              <div className="label">Badges earned</div>
              <div className="value">{DEMO.badgesEarned}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Total unlocked</div>
            </div>
          </div>

          {/* Level / XP bar */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              
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
              <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                Latest Performance Breakdown
              </h3>
              <div className="h-48 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full max-w-[200px] mx-auto">
                  {RADAR_LABELS.map((_, i) => {
                    const angle = (i * 360) / RADAR_LABELS.length - 90;
                    const rad = (angle * Math.PI) / 180;
                    const r = (RADAR_VALUES[i] / 100) * 40;
                    const x = 60 + r * Math.cos(rad);
                    const y = 60 + r * Math.sin(rad);
                    return (
                      <line
                        key={i}
                        x1="60"
                        y1="60"
                        x2={x}
                        y2={y}
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    );
                  })}
                  <polygon
                    points={RADAR_LABELS.map((_, i) => {
                      const angle = (i * 360) / RADAR_LABELS.length - 90;
                      const rad = (angle * Math.PI) / 180;
                      const r = (RADAR_VALUES[i] / 100) * 40;
                      return `${60 + r * Math.cos(rad)},${60 + r * Math.sin(rad)}`;
                    }).join(" ")}
                    fill="var(--color-accent)"
                    fillOpacity="0.25"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                  />
                  {RADAR_LABELS.map((label, i) => {
                    const angle = (i * 360) / RADAR_LABELS.length - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x = 60 + 48 * Math.cos(rad);
                    const y = 60 + 48 * Math.sin(rad);
                    return (
                      <text key={i} x={x} y={y} textAnchor="middle" fill="var(--color-text-muted)" fontSize="6">{label}</text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
              Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="glass-card p-4">
                  <span className="text-xl mb-2 block leading-none" aria-hidden="true">{a.icon}</span>
                  <div className="font-semibold text-[var(--color-text)] text-sm">{a.title}</div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
