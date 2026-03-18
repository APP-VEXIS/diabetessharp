import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "causes", label: "Causes" },
  { id: "treatments", label: "Treatments" },
  { id: "science", label: "Science" },
  { id: "mindset", label: "Mindset" },
  { id: "nutrition", label: "Nutrition" },
  { id: "lifestyle", label: "Lifestyle" },
];

const ARTICLES = [
  { id: "1", title: "The Vascular Truth About Memory Decline", category: "Causes", categoryColor: "teal", time: "5m", premium: true, desc: "How blood flow and brain health are connected — and what you can do about it.", icon: "❤️" },
  { id: "2", title: "Memory Exercises: The Science Behind the Practice", category: "Science", categoryColor: "teal", time: "6m", premium: false, desc: "Evidence-based techniques used in cognitive rehabilitation and brain training.", icon: "🧠" },
  { id: "2b", title: "Cognitive Training: What Works", category: "Treatments", categoryColor: "teal", time: "5m", premium: false, desc: "Overview of evidence-based interventions for memory and focus.", icon: "💊" },
  { id: "3", title: "Stress, Sleep, and Your Brain", category: "Lifestyle", categoryColor: "teal", time: "7m", premium: true, desc: "Why rest and stress management are essential for memory and focus.", icon: "🌙" },
  { id: "4", title: "Mindset and Cognitive Resilience", category: "Mindset", categoryColor: "teal", time: "5m", premium: false, desc: "Building a growth mindset to support long-term brain health.", icon: "✨" },
  { id: "5", title: "Foods That Fuel Your Brain", category: "Nutrition", categoryColor: "teal", time: "6m", premium: false, desc: "Omega-3s, antioxidants, and other nutrients that support memory.", icon: "🥗" },
  { id: "6", title: "Early Signs and When to Act", category: "Causes", categoryColor: "teal", time: "4m", premium: false, desc: "Recognizing subtle changes and taking proactive steps.", icon: "🔍" },
];

export function LearnPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter((a) => a.category.toLowerCase() === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Learn</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Evidence-based education on memory and brain health.</p>
      </div>

      <HowToUseBanner
        pageKey="ns-learn"
        steps={[
          "Filter articles by topic using the category pills — Causes, Lifestyle, Treatment and more.",
          "Tap any article to read the full content.",
          "Recommended content is updated weekly based on your training and cognitive score.",
        ]}
      />

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              filter === c.id ? "nav-active text-[var(--color-accent-text)]" : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Article cards grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="glass-card p-4 hover:border-[var(--color-border-strong)] transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center text-lg shrink-0">
                {a.icon}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-[var(--color-text-muted)]">{a.time}</span>
                {a.premium && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--color-accent)] text-[var(--color-accent-text)]">Premium</span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-[var(--color-text)] text-sm mb-1">{a.title}</h3>
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">{a.desc}</p>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)]">
              {a.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
