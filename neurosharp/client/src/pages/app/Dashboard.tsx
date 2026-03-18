import { Link } from "react-router-dom";
import { trpc } from "../../trpc";
import { MEMORY_EXERCISES } from "../../data/memoryExercises";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const DEMO = { cognitiveScore: 58, dailyStreak: 5, programDay: 2, totalXP: 65, exercisesDone: 0, bestStreak: 1 };

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in">
      <div className="glass-card p-6 sm:p-8">
        <div className="skeleton h-4 w-32 mb-6" />
        <div className="skeleton h-16 w-24 mb-3" />
        <div className="skeleton h-4 w-48 mb-5" />
        <div className="skeleton h-5 w-36 mb-6" />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="skeleton h-3 w-16 mb-2" />
            <div className="skeleton h-7 w-20" />
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <div className="flex justify-between mb-5">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-3 w-12" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError } = trpc.cognitive.getDashboard.useQuery(undefined, { retry: false });
  const { data: todayExercises = [] } = trpc.cognitive.getTodayExercises.useQuery(undefined, { retry: false, enabled: !isError });
  const score = data?.cognitiveScore ?? DEMO.cognitiveScore;
  const streak = data?.dailyStreak ?? DEMO.dailyStreak;
  const isDemo = isError;
  const programDay = DEMO.programDay;
  const totalXP = DEMO.totalXP;
  const exercisesDone = isDemo ? todayExercises.length : (data ? todayExercises.length : DEMO.exercisesDone);
  const bestStreak = streak;

  const todayTasks = [
    { id: "checkin", title: "Daily Performance Check-In", desc: "Rate your energy, mood, sleep, and focus to track your progress.", cta: "Check In", href: "/app/dashboard", done: false },
    { id: "ex1", title: MEMORY_EXERCISES[0].name, desc: MEMORY_EXERCISES[0].description, cta: "Start", href: "/app/exercises", done: todayExercises.some((e: { exerciseType: string }) => e.exerciseType === MEMORY_EXERCISES[0].id) },
    { id: "ex2", title: MEMORY_EXERCISES[2].name, desc: MEMORY_EXERCISES[2].description, cta: "Start", href: "/app/exercises", done: todayExercises.some((e: { exerciseType: string }) => e.exerciseType === MEMORY_EXERCISES[2].id) },
    { id: "read", title: "Read Today's Article", desc: "Expand your knowledge with today's educational content.", cta: "Read", href: "/app/learn", done: false },
  ];
  const todayCount = todayTasks.length;
  const doneCount = todayTasks.filter((t) => t.done).length;

  const scorePhrase = score >= 70
    ? "Strong foundation — keep going."
    : score >= 45
      ? "Building momentum — one session at a time."
      : "Every exercise counts. You're making progress.";

  return (
    <div className="space-y-5 sm:space-y-8" role="main" aria-label="Dashboard">

      <HowToUseBanner
        pageKey="ns-dashboard"
        steps={[
          "Your cognitive score at the top reflects your last training session and daily streak.",
          "Complete the exercises shown below to improve your score and maintain your streak.",
          "Tap any metric card to see detailed charts and historical data.",
        ]}
      />

      {isLoading && !isDemo ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Hero — cognitive score + greeting + streak */}
          <section className="glass-card p-6 sm:p-8" aria-label="Cognitive overview">
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Good morning
            </p>

            <div className="flex items-end gap-4 mb-3">
              <p
                className="font-display font-bold leading-none"
                style={{
                  fontSize: "clamp(56px, 14vw, 72px)",
                  letterSpacing: "-0.04em",
                  color: "var(--color-accent)",
                }}
                aria-label={`Cognitive score: ${score} out of 100`}
              >
                {score}
              </p>
              <div className="pb-2 space-y-0.5">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Cognitive Score</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">0–100 · performance</p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
              {scorePhrase}
            </p>

            <div className="flex items-center gap-2 text-sm mb-6">
              {streak > 0 && (
                <>
                  <span className="text-amber-400 font-medium">🔥 {streak} day streak</span>
                  <span className="text-[var(--color-border-default)]">·</span>
                </>
              )}
              <span className="text-[var(--color-text-tertiary)]">Day {programDay} of 90</span>
            </div>

            <Link
              to="/app/dashboard"
              className="btn btn-primary w-full justify-center"
              style={{ minHeight: "48px" }}
            >
              Daily Check-in
            </Link>
          </section>

          {/* Metrics — Apple Health style: label · value · context */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-grid" aria-label="Overview metrics">
            <div className="stat-card">
              <div className="label">Program Day</div>
              <div className="value">{programDay}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">of 90 · Week {Math.ceil(programDay / 7)}</div>
            </div>
            <div className="stat-card">
              <div className="label">Total XP</div>
              <div className="value">{totalXP}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Accumulated</div>
            </div>
            <div className="stat-card">
              <div className="label">Sessions</div>
              <div className="value">{exercisesDone}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Today</div>
            </div>
            <div className="stat-card">
              <div className="label">Streak</div>
              <div className="flex items-baseline gap-1.5">
                <div className="value">{bestStreak}</div>
                {bestStreak >= streak && bestStreak > 1 && (
                  <span className="text-[10px] font-semibold text-[var(--color-success)] uppercase tracking-wider">best</span>
                )}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Days in a row</div>
            </div>
          </section>

          {/* Today's program — full width */}
          <section
            className="glass-card p-6 sm:p-8"
            aria-label={`Today's program, ${doneCount} of ${todayCount} completed`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
                Today&apos;s Program
              </h2>
              <span className="text-xs text-[var(--color-text-tertiary)]" aria-live="polite">
                {doneCount}/{todayCount} done
              </span>
            </div>
            <ul className="space-y-3" role="list">
              {todayTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: "var(--color-surface-hover)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs ${
                      task.done
                        ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                        : "border-[var(--color-text-tertiary)]"
                    }`}
                    aria-hidden
                  >
                    {task.done ? "✓" : ""}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm">{task.title}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1 line-clamp-2 leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                  <Link
                    to={task.href}
                    className="btn btn-primary flex-shrink-0 py-2 px-4 text-xs w-full sm:w-auto justify-center touch-manipulation"
                    style={{ minHeight: "44px" }}
                  >
                    {task.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Dr. Marcus */}
            <section className="glass-card p-6 sm:p-8" aria-label="Dr. Marcus tip">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 tracking-tight">
                Dr. Marcus
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                Good morning! Focus on building a strong foundation. Try 5–10 minutes of a memory exercise first thing — it helps set your brain for the day.
              </p>
              <Link
                to="/app/dr-marcus"
                className="text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md"
              >
                Chat with Dr. Marcus →
              </Link>
            </section>

            {/* Daily Challenge */}
            <section className="glass-card p-6 sm:p-8 relative overflow-hidden" aria-label="Daily Challenge">
              <span
                className="absolute top-5 right-5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}
                aria-hidden
              >
                Nutrition
              </span>
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">
                Daily Challenge
              </p>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">
                Eat one brain-boosting meal
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5 leading-relaxed">
                Include foods rich in omega-3s, antioxidants, or B vitamins today.
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-[var(--color-accent)]">+50 XP</span>
                <button
                  type="button"
                  className="btn btn-primary py-2 px-5 text-xs"
                  style={{ minHeight: "44px" }}
                >
                  Mark complete
                </button>
              </div>
            </section>
          </div>

        </>
      )}
    </div>
  );
}
