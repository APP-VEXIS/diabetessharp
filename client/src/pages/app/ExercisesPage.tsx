import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import { trpc } from "../../trpc";
import { DIABETES_EDUCATION, type DiabetesTopic } from "../../data/diabetesEducation";
import {
  BookOpen,
  Salad,
  Droplets,
  Pill,
  Leaf,
  LayoutGrid,
  RefreshCw,
  Play,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const FILTERS = [
  { id: "all", label: "All", Icon: LayoutGrid },
  { id: "nutrition", label: "Nutrition", Icon: Salad },
  { id: "monitoring", label: "Monitoring", Icon: Droplets },
  { id: "treatment", label: "Treatment", Icon: Pill },
  { id: "lifestyle", label: "Lifestyle", Icon: Leaf },
];

function TopicCard({
  topic,
  onComplete,
  isCompleted,
}: {
  topic: DiabetesTopic;
  onComplete: () => void;
  isCompleted: boolean;
  isDemo: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-4 p-4 flex-wrap">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center shrink-0 bg-[var(--color-accent-soft)]">
          <BookOpen size={20} className="text-[var(--color-accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--color-text)]">{topic.name}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] capitalize">
              {topic.category}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-[var(--color-text-muted)]">
            <span>About {topic.durationMinutes} min</span>
            <button type="button" onClick={() => setExpanded(!expanded)} className="text-[var(--color-accent)] hover:underline flex items-center gap-0.5">
              {expanded ? "Hide" : "Show"} details
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-success)]">
              <CheckCircle2 size={14} /> Done
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary py-2 px-4 rounded-lg text-sm font-medium min-h-0 flex items-center gap-1.5"
              onClick={() => { onComplete(); setExpanded(false); }}
            >
              <Play size={13} /> Read
            </button>
          )}
          <button type="button" onClick={() => setExpanded(!expanded)} className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)] space-y-4 pt-4">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{topic.description}</p>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">Time</h4>
            <p className="text-sm text-[var(--color-text-muted)]">
              About <strong className="text-[var(--color-text)]">{topic.durationMinutes} minutes</strong> to read. Revisit anytime.
            </p>
          </div>
          {topic.tips && topic.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide mb-2">Tips</h4>
              <ul className="text-sm text-[var(--color-text)] space-y-1.5">
                {topic.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--color-accent)] shrink-0">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

  const handleComplete = (topic: DiabetesTopic) => {
    if (isDemo) { setDemoCompletedIds((prev) => new Set(prev).add(topic.id)); return; }
    logExercise.mutate({ exerciseType: topic.id, difficulty: 5, successRate: 100, timeSpent: topic.durationMinutes * 60 });
  };

  const filtered = filter === "all" ? DIABETES_EDUCATION : DIABETES_EDUCATION.filter((t) => t.category === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Education</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Short lessons and tips to help you manage diabetes day to day.</p>
      </div>

      <HowToUseBanner
        pageKey="education"
        steps={[
          "Filter lessons by category using the pills — Diet, Monitoring, Lifestyle and more.",
          "Tap any lesson to expand it and mark it as done when finished.",
          "Completing all lessons in a category earns you XP towards your progress.",
        ]}
      />

      <div className="mb-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/20 px-4 py-3 flex flex-wrap items-start gap-3">
        <RefreshCw size={22} className="text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="font-semibold text-[var(--color-text)] text-sm">New topics every week</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            We add and update lessons on diet, monitoring, and lifestyle so you always have practical, evidence-based info.
          </p>
        </div>
      </div>

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
            <f.Icon size={14} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <span><span className="text-[var(--color-text-muted)]">Completed: </span><strong className="text-[var(--color-text)]">{completedIds.size} / {DIABETES_EDUCATION.length}</strong></span>
        <span><span className="text-[var(--color-text-muted)]">Time: </span><strong className="text-[var(--color-text)]">
          {Array.from(completedIds).reduce((sum, id) => sum + (DIABETES_EDUCATION.find((t) => t.id === id)?.durationMinutes ?? 0), 0)} min</strong></span>
      </div>

      <div className="space-y-4">
        {filtered.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onComplete={() => handleComplete(topic)}
            isCompleted={completedIds.has(topic.id)}
            isDemo={isDemo}
          />
        ))}
      </div>
    </div>
  );
}
