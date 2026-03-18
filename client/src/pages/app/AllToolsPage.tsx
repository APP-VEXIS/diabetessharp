import { useNavigate } from "react-router-dom";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  Droplets,
  Stethoscope,
  MessageCircle,
  Salad,
  Bell,
  Camera,
  TrendingUp,
  BarChart3,
  BookOpen,
  FileText,
  AlertTriangle,
} from "lucide-react";

const TOOLS = [
  {
    id: "glucose",
    path: "/app/glucose",
    badge: "popular" as const,
    icon: <Droplets size={22} />,
    iconColor: "#60a5fa",
    iconBg: "rgba(59,130,246,0.15)",
    title: "Blood Sugar",
    desc: "Log and track your glucose readings",
  },
  {
    id: "dr-marcus",
    path: "/app/dr-marcus",
    badge: "featured" as const,
    icon: <Stethoscope size={22} />,
    iconColor: "var(--color-accent)",
    iconBg: "rgba(99,102,241,0.15)",
    title: "Dr. Marcus",
    desc: "AI doctor for personalized guidance",
  },
  {
    id: "sofia",
    path: "/app/sofia",
    badge: "new" as const,
    icon: <MessageCircle size={22} />,
    iconColor: "#34d399",
    iconBg: "rgba(52,211,153,0.15)",
    title: "Ask Sofia",
    desc: "Chat with your AI health coach",
  },
  {
    id: "nutrition",
    path: "/app/nutrition",
    badge: "popular" as const,
    icon: <Salad size={22} />,
    iconColor: "#4ade80",
    iconBg: "rgba(74,222,128,0.15)",
    title: "Nutrition",
    desc: "Meal planning and calorie tracking",
  },
  {
    id: "reminders",
    path: "/app/reminders",
    badge: null,
    icon: <Bell size={22} />,
    iconColor: "#fbbf24",
    iconBg: "rgba(251,191,36,0.15)",
    title: "Reminders",
    desc: "Meds, insulin and glucose alerts",
  },
  {
    id: "photos",
    path: "/app/photos",
    badge: null,
    icon: <Camera size={22} />,
    iconColor: "#f472b6",
    iconBg: "rgba(244,114,182,0.15)",
    title: "Photo Diary",
    desc: "Log meals with your camera",
  },
  {
    id: "progress",
    path: "/app/progress",
    badge: null,
    icon: <TrendingUp size={22} />,
    iconColor: "#a78bfa",
    iconBg: "rgba(167,139,250,0.15)",
    title: "Progress",
    desc: "Charts, XP and achievements",
  },
  {
    id: "weekly-report",
    path: "/app/weekly-report",
    badge: null,
    icon: <BarChart3 size={22} />,
    iconColor: "#38bdf8",
    iconBg: "rgba(56,189,248,0.15)",
    title: "Weekly Report",
    desc: "Your week in numbers",
  },
  {
    id: "learn",
    path: "/app/learn",
    badge: "new" as const,
    icon: <BookOpen size={22} />,
    iconColor: "#fb923c",
    iconBg: "rgba(251,146,60,0.15)",
    title: "Learn",
    desc: "Diabetes education & tips",
  },
  {
    id: "doctor-prep",
    path: "/app/doctor-prep",
    badge: null,
    icon: <FileText size={22} />,
    iconColor: "#94a3b8",
    iconBg: "rgba(148,163,184,0.15)",
    title: "Doctor Report",
    desc: "Prepare for your next visit",
  },
  {
    id: "emergency",
    path: "/app/emergency",
    badge: null,
    icon: <AlertTriangle size={22} />,
    iconColor: "#f87171",
    iconBg: "rgba(248,113,113,0.15)",
    title: "Emergency",
    desc: "Quick guide for low blood sugar",
  },
] as const;

const BADGE_STYLES = {
  featured: { bg: "rgba(99,102,241,0.18)",  color: "var(--color-accent)", label: "Featured" },
  popular:  { bg: "rgba(251,146,60,0.18)",   color: "#fb923c",             label: "Popular"  },
  new:      { bg: "rgba(52,211,153,0.18)",   color: "#34d399",             label: "New"      },
} as const;

export function AllToolsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[var(--color-text-primary)]">All Tools</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">
          {TOOLS.length} features available in your plan
        </p>
      </div>

      <HowToUseBanner
        pageKey="all-tools"
        steps={[
          "Tap any card to navigate directly to that feature.",
          "Cards marked 'Popular' are the most used by members — a great place to start.",
          "Cards marked 'New' have features added recently — explore them.",
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {TOOLS.map((tool) => {
          const badge = tool.badge ? BADGE_STYLES[tool.badge] : null;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => navigate(tool.path)}
              className="glass-card p-4 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-xl animate-in-up"
            >
              {badge ? (
                <span
                  className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-3"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badge.label}
                </span>
              ) : (
                <div className="h-4 mb-3" aria-hidden />
              )}

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: tool.iconBg, color: tool.iconColor }}
                aria-hidden
              >
                {tool.icon}
              </div>

              <div className="font-semibold text-sm text-[var(--color-text-primary)] leading-tight mb-1">
                {tool.title}
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] leading-snug">
                {tool.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
