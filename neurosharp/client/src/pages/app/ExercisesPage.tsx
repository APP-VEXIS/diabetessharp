import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import { trpc } from "../../trpc";
import { MEMORY_EXERCISES, type MemoryExercise, type Difficulty } from "../../data/memoryExercises";

const FILTERS = [
  { id: "all", label: "All", icon: "🧠" },
  { id: "memory_palace", label: "Memory", icon: "🏛️" },
  { id: "chunking", label: "Chunking", icon: "📦" },
  { id: "dual_nback", label: "N-Back", icon: "🔄" },
  { id: "mindfulness_recall", label: "Mindfulness", icon: "🧘" },
  { id: "recall_after_reading", label: "Reading", icon: "📖" },
];

function DifficultyPill({ difficulty }: { difficulty: Difficulty }) {
  const c = difficulty === "beginner" ? "pill-beginner" : difficulty === "intermediate" ? "pill-intermediate" : "pill-advanced";
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c}`}>{label}</span>;
}

function ExerciseCard({
  exercise,
  onComplete,
  isCompleted,
  isDemo: _isDemo,
}: {
  exercise: MemoryExercise;
  onComplete: () => void;
  isCompleted: boolean;
  isDemo: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header row - like Vigronex */}
      <div className="flex items-center gap-4 p-4 flex-wrap">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-xl shrink-0 bg-[var(--color-surface)]" aria-hidden>
          🧠
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--color-text)]">{exercise.name}</h3>
            <DifficultyPill difficulty={exercise.difficulty} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-[var(--color-text-muted)]">
            <span>About {exercise.durationMinutes} min</span>
            <span>{exercise.id.replace(/_/g, " ")}</span>
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-[var(--color-accent)] hover:underline flex items-center gap-0.5">
              {expanded ? "Hide" : "Show"} instructions
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isCompleted ? (
            <span className="text-xs font-medium text-[var(--color-success)]">✓ Done</span>
          ) : (
            <button
              type="button"
              className="btn btn-primary py-2 px-4 rounded-lg text-sm font-medium min-h-0 flex items-center gap-1.5"
              onClick={() => { onComplete(); setExpanded(false); }}
            >
              ▶ Start
            </button>
          )}
          <button type="button" onClick={() => setExpanded(!expanded)} className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)] space-y-5 pt-4">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{exercise.description}</p>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">Time</h4>
            <p className="text-sm text-[var(--color-text-muted)]">
              About <strong className="text-[var(--color-text)]">{exercise.durationMinutes} minutes</strong> per session. Do once a day or as suggested in the instructions.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">How to do it (step by step)</h4>
            <ol className="list-decimal list-inside text-sm text-[var(--color-text)] space-y-2 pl-1">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="leading-relaxed pl-1">{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border)] p-3">
            <h4 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-2">Example</h4>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{exercise.example}</p>
          </div>
          {exercise.tips && exercise.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">Tips</h4>
              <ul className="text-sm text-[var(--color-text)] space-y-1.5">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--color-accent)] shrink-0">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">Benefits</h4>
            <ul className="text-sm text-[var(--color-text)] space-y-1">
              {exercise.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--color-success)]" aria-hidden>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExercisesPage() {
  const [filter, setFilter] = useState("all");
  const [demoCompletedIds, setDemoCompletedIds] = useState<Set<string>>(() => new Set());
  const isDemo = typeof window !== "undefined" && localStorage.getItem("neurosharp_token") === "demo";

  const { data: todayExercises = [], refetch: refetchToday } = trpc.cognitive.getTodayExercises.useQuery(undefined, { retry: false, enabled: !isDemo });
  const logExercise = trpc.cognitive.logExercise.useMutation({ onSuccess: () => refetchToday() });

  const completedIds = isDemo ? demoCompletedIds : new Set(todayExercises.map((e: { exerciseType: string }) => e.exerciseType));

  const handleComplete = (exercise: MemoryExercise) => {
    if (isDemo) { setDemoCompletedIds((prev) => new Set(prev).add(exercise.id)); return; }
    logExercise.mutate({ exerciseType: exercise.id, difficulty: 5, successRate: 100, timeSpent: exercise.durationMinutes * 60 });
  };

  const filtered = filter === "all" ? MEMORY_EXERCISES : MEMORY_EXERCISES.filter((e) => e.id === filter || e.id.startsWith(filter));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Exercises</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Daily training for peak memory performance.</p>
      </div>

      <HowToUseBanner
        pageKey="ns-exercises"
        steps={[
          "Filter exercises by difficulty or type using the category pills.",
          "Tap any exercise to start — complete it and mark it as done to earn XP.",
          "Aim to finish all exercises before midnight to maintain your daily streak.",
        ]}
      />

      {/* Weekly update notice — prominent at top */}
      <div className="mb-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/20 px-4 py-3 flex flex-wrap items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>🔄</span>
        <div>
          <p className="font-semibold text-[var(--color-text)] text-sm">New exercises every week</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            Each week we add and update exercises so you always have fresh, varied practice. Check back regularly for new techniques and challenges.
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              filter === f.id
                ? "nav-active text-[var(--color-accent-text)]"
                : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <span aria-hidden>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Today's report - compact */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <span><span className="text-[var(--color-text-muted)]">Completed: </span><strong className="text-[var(--color-text)]">{completedIds.size} / 10</strong></span>
        <span><span className="text-[var(--color-text-muted)]">Time: </span><strong className="text-[var(--color-text)]">
          {Array.from(completedIds).reduce((sum, id) => sum + (MEMORY_EXERCISES.find((e) => e.id === id)?.durationMinutes ?? 0), 0)} min</strong></span>
      </div>

      <div className="space-y-4">
        {filtered.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onComplete={() => handleComplete(exercise)}
            isCompleted={completedIds.has(exercise.id)}
            isDemo={isDemo}
          />
        ))}
      </div>
    </div>
  );
}
