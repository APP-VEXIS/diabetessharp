import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  Droplets,
  Wheat,
  Pill,
  Moon,
  Sparkles,
  Salad,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "causes", label: "Causes" },
  { id: "treatments", label: "Treatments" },
  { id: "science", label: "Science" },
  { id: "mindset", label: "Mindset" },
  { id: "nutrition", label: "Nutrition" },
  { id: "lifestyle", label: "Lifestyle" },
];

const ARTICLES: {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  time: string;
  premium: boolean;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    id: "1",
    title: "Blood sugar basics: what to aim for",
    category: "Causes",
    categoryColor: "teal",
    time: "5m",
    premium: true,
    desc: "Target ranges for fasting and post-meal glucose, and what HbA1c means for you.",
    icon: <Droplets size={20} className="text-red-400" />,
  },
  {
    id: "2",
    title: "Carbs and diabetes: quality and quantity",
    category: "Science",
    categoryColor: "teal",
    time: "6m",
    premium: false,
    desc: "How to choose carbs that have less impact on your blood sugar.",
    icon: <Wheat size={20} className="text-amber-400" />,
  },
  {
    id: "2b",
    title: "Medication and insulin: when and why",
    category: "Treatments",
    categoryColor: "teal",
    time: "5m",
    premium: false,
    desc: "Understanding common diabetes medications and when insulin may be recommended.",
    icon: <Pill size={20} className="text-blue-400" />,
  },
  {
    id: "3",
    title: "Sleep and stress: their effect on glucose",
    category: "Lifestyle",
    categoryColor: "teal",
    time: "7m",
    premium: true,
    desc: "Why rest and stress management help keep your numbers more stable.",
    icon: <Moon size={20} className="text-indigo-400" />,
  },
  {
    id: "4",
    title: "Staying motivated with diabetes",
    category: "Mindset",
    categoryColor: "teal",
    time: "5m",
    premium: false,
    desc: "Practical ways to keep up with diet, activity, and monitoring over time.",
    icon: <Sparkles size={20} className="text-[var(--color-accent)]" />,
  },
  {
    id: "5",
    title: "Diabetes-friendly meals and snacks",
    category: "Nutrition",
    categoryColor: "teal",
    time: "6m",
    premium: false,
    desc: "Simple swaps and balanced plates that support better control.",
    icon: <Salad size={20} className="text-green-400" />,
  },
  {
    id: "6",
    title: "When to see your doctor",
    category: "Causes",
    categoryColor: "teal",
    time: "4m",
    premium: false,
    desc: "Signs that you should get your plan or medications reviewed.",
    icon: <Search size={20} className="text-[var(--color-text-muted)]" />,
  },
];

export function LearnPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter((a) => a.category.toLowerCase() === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Learn</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Short reads on diet, blood sugar, and habits that help you stay on track.</p>
      </div>

      <HowToUseBanner
        pageKey="learn"
        steps={[
          "Filter articles by topic using the category pills — Carbs, Medications, Exercise and more.",
          "Tap any article card to read it in full.",
          "Content is curated for diabetes management — bookmark key articles to review with your care team.",
        ]}
      />

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
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
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center shrink-0" aria-hidden>
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
