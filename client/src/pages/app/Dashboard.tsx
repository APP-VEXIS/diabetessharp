import { Link, useNavigate } from "react-router-dom";
import {
  Share2,
  Flame,
  Eye,
  PartyPopper,
  ClipboardList,
  BarChart3,
  Footprints,
  Candy,
  CheckCircle2,
  Moon,
  Salad,
  Droplets,
  BedDouble,
  Utensils,
  Wind,
  Trophy,
  Star,
  Target,
  Medal,
  Stethoscope,
  MessageCircle,
  Bell,
  Camera,
  AlertTriangle,
  TrendingUp,
  FileText,
  BookOpen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { trpc } from "../../trpc";
import { getTotalsForDate, getTodayString } from "../../data/mealLogs";
import { getTodaysRemindersWithStatus } from "../../data/reminders";
import { getRecentLogs, getTimeInRangePercent } from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";
import {
  getCurrentStreak,
  getBestStreak,
  shouldShowDontBreakStreak,
  getMilestoneToCelebrate,
  getMilestoneMessage,
  setLastCelebratedMilestone,
  type MilestoneType,
} from "../../data/streak";
import { getTipOfTheDay } from "../../data/tipsOfTheDay";
import { getDailyMissions, toggleMissionDone } from "../../data/dailyMissions";
import { getSimpleInsights, getSmartAlerts } from "../../data/insights";
import { getCurrentChallenge, toggleChallengeToday } from "../../data/challenges";
import { getControlLevel } from "../../data/levels";
import { evaluateAndStoreAchievements, getAchievements } from "../../data/achievements";
import { getSmartNotification } from "../../data/smartNotifications";
import { getDailyCoachTips } from "../../data/dailyCoach";
import { getGlucosePredictions } from "../../data/glucosePrediction";
import { getWeekComparison } from "../../data/weekComparison";
import { HowToUseBanner } from "../../components/HowToUseBanner";

/** Maps legacy emoji icon strings (from data/*.ts) to lucide-react components. */
const DATA_ICON_MAP: Record<string, React.ReactNode> = {
  "🔥": <Flame size={16} aria-hidden />,
  "👀": <Eye size={16} aria-hidden />,
  "🎉": <PartyPopper size={16} aria-hidden />,
  "📋": <ClipboardList size={16} aria-hidden />,
  "📊": <BarChart3 size={16} aria-hidden />,
  "🚶": <Footprints size={16} aria-hidden />,
  "🍬": <Candy size={16} aria-hidden />,
  "✅": <CheckCircle2 size={16} aria-hidden />,
  "🌙": <Moon size={16} aria-hidden />,
  "🥗": <Salad size={16} aria-hidden />,
  "💧": <Droplets size={16} aria-hidden />,
  "😴": <BedDouble size={16} aria-hidden />,
  "🍽️": <Utensils size={16} aria-hidden />,
  "🦶": <Footprints size={16} aria-hidden />,
  "🧘": <Wind size={16} aria-hidden />,
  "🏆": <Trophy size={16} aria-hidden />,
  "⭐": <Star size={16} aria-hidden />,
  "🎯": <Target size={16} aria-hidden />,
  "🏅": <Medal size={16} aria-hidden />,
};

const BADGE_ICON_MAP: Record<string, React.ReactNode> = {
  streak_7: <Flame size={24} className="text-orange-400" aria-hidden />,
  streak_30: <Trophy size={24} className="text-amber-400" aria-hidden />,
  tir_70: <BarChart3 size={24} className="text-[var(--color-accent)]" aria-hidden />,
  tir_80: <Star size={24} className="text-amber-400" aria-hidden />,
  first_log: <Target size={24} className="text-[var(--color-success)]" aria-hidden />,
};

function renderDataIcon(icon: string): React.ReactNode {
  return DATA_ICON_MAP[icon] ?? <span aria-hidden>{icon}</span>;
}

const DEMO = { controlScore: 58, dailyStreak: 5, programDay: 2, checkInsDone: 0, bestStreak: 5 };

const TOOLS = [
  {
    id: "glucose",
    path: "/app/glucose",
    badge: "popular" as const,
    icon: <Droplets size={18} />,
    iconColor: "#60a5fa",
    iconBg: "rgba(59,130,246,0.15)",
    title: "Blood Sugar",
    desc: "Log and track your glucose readings",
  },
  {
    id: "dr-marcus",
    path: "/app/dr-marcus",
    badge: "featured" as const,
    icon: <Stethoscope size={18} />,
    iconColor: "var(--color-accent)",
    iconBg: "rgba(var(--color-accent-rgb,99,102,241),0.15)",
    title: "Dr. Marcus",
    desc: "AI doctor for personalized guidance",
  },
  {
    id: "sofia",
    path: "/app/sofia",
    badge: "new" as const,
    icon: <MessageCircle size={18} />,
    iconColor: "#34d399",
    iconBg: "rgba(52,211,153,0.15)",
    title: "Ask Sofia",
    desc: "Chat with your AI health coach",
  },
  {
    id: "nutrition",
    path: "/app/nutrition",
    badge: "popular" as const,
    icon: <Salad size={18} />,
    iconColor: "#4ade80",
    iconBg: "rgba(74,222,128,0.15)",
    title: "Nutrition",
    desc: "Meal planning and calorie tracking",
  },
  {
    id: "reminders",
    path: "/app/reminders",
    badge: null,
    icon: <Bell size={18} />,
    iconColor: "#fbbf24",
    iconBg: "rgba(251,191,36,0.15)",
    title: "Reminders",
    desc: "Meds, insulin and glucose alerts",
  },
  {
    id: "photos",
    path: "/app/photos",
    badge: null,
    icon: <Camera size={18} />,
    iconColor: "#f472b6",
    iconBg: "rgba(244,114,182,0.15)",
    title: "Photo Diary",
    desc: "Log meals with your camera",
  },
  {
    id: "progress",
    path: "/app/progress",
    badge: null,
    icon: <TrendingUp size={18} />,
    iconColor: "#a78bfa",
    iconBg: "rgba(167,139,250,0.15)",
    title: "Progress",
    desc: "Charts, XP and achievements",
  },
  {
    id: "weekly-report",
    path: "/app/weekly-report",
    badge: null,
    icon: <BarChart3 size={18} />,
    iconColor: "#38bdf8",
    iconBg: "rgba(56,189,248,0.15)",
    title: "Weekly Report",
    desc: "Your week in numbers",
  },
  {
    id: "learn",
    path: "/app/learn",
    badge: "new" as const,
    icon: <BookOpen size={18} />,
    iconColor: "#fb923c",
    iconBg: "rgba(251,146,60,0.15)",
    title: "Learn",
    desc: "Diabetes education & tips",
  },
  {
    id: "doctor-prep",
    path: "/app/doctor-prep",
    badge: null,
    icon: <FileText size={18} />,
    iconColor: "#94a3b8",
    iconBg: "rgba(148,163,184,0.15)",
    title: "Doctor Report",
    desc: "Prepare for your next visit",
  },
  {
    id: "emergency",
    path: "/app/emergency",
    badge: null,
    icon: <AlertTriangle size={18} />,
    iconColor: "#f87171",
    iconBg: "rgba(248,113,113,0.15)",
    title: "Emergency",
    desc: "Quick guide for low blood sugar",
  },
] as const;

const BADGE_STYLES = {
  featured: { bg: "rgba(var(--color-accent-rgb,99,102,241),0.18)", color: "var(--color-accent)", label: "Featured" },
  popular:  { bg: "rgba(251,146,60,0.18)",  color: "#fb923c", label: "Popular"  },
  new:      { bg: "rgba(52,211,153,0.18)",   color: "#34d399", label: "New"      },
} as const;

/** Skeleton screen: shimmer blocks only (Apple HIG); no spinner */
function DashboardSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-10 animate-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-6 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="label skeleton h-3 w-20 rounded" />
            <div className="value skeleton h-7 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass-card p-6 sm:p-8 flex flex-col items-center">
          <div className="skeleton h-4 w-32 mb-6" />
          <div className="skeleton w-36 h-36 rounded-full" />
          <div className="skeleton h-4 w-48 mt-6" />
          <div className="skeleton h-12 w-full mt-6 rounded-xl" />
        </div>
        <div className="glass-card p-6 sm:p-8">
          <div className="flex justify-between mb-6">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-12" />
          </div>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)]/50">
                <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                </div>
                <div className="skeleton h-10 w-14 rounded-lg shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


/** Hero emotional headline — human first, number second */
function getHeroEmotionalMessage(
  controlLevelId: string,
  streak: number,
  timeInRange: number | null
): string {
  if (streak >= 7 && (timeInRange === null || timeInRange >= 60))
    return "You're doing great 👏";
  if (controlLevelId === "high_performance") return "You're on track";
  if (streak >= 3) return "Keep going — you're building a strong habit";
  if (streak >= 1) return "You're building a new habit — one step at a time.";
  return "Let's make today count.";
}

/** Score emotional state: green / yellow / red + phrase */
function getScoreEmotionalState(score: number): {
  state: "great" | "attention" | "action";
  label: string;
  phrase: string;
} {
  if (score >= 70) return { state: "great", label: "Great control", phrase: "You're improving." };
  if (score >= 45) return { state: "attention", label: "Needs attention", phrase: "Let's make today even better." };
  return { state: "action", label: "Action needed", phrase: "Small steps today will add up." };
}

export function Dashboard() {
  const { data, isLoading, isError } = trpc.cognitive.getDashboard.useQuery(undefined, { retry: false });
  const realStreak = getCurrentStreak();
  const realBest = getBestStreak();
  const streak = realStreak > 0 ? realStreak : (data?.dailyStreak ?? DEMO.dailyStreak);
  const isDemo = isError;
  const programDay = DEMO.programDay;
  const score = data?.cognitiveScore ?? DEMO.controlScore;
  const checkInsDone = DEMO.checkInsDone;
  const bestStreak = realBest > 0 ? realBest : streak;
  const showDontBreak = shouldShowDontBreakStreak();
  const [celebrationMilestone, setCelebrationMilestone] = useState<MilestoneType | null>(null);
  const celebrationFired = useRef(false);
  const missions = getDailyMissions();
  const todayCount = missions.length;
  const doneCount = missions.filter((t) => t.done).length;
  const todayNutrition = getTotalsForDate(getTodayString());
  const todaysReminders = getTodaysRemindersWithStatus();
  const glucoseLogs = getRecentLogs(90);
  const goals = getGoals();
  const timeInRange = getTimeInRangePercent(glucoseLogs, goals.fastingMin, goals.fastingMax, goals.postMealMax);

  // TIR trend: current 7 days vs previous 7 days
  const tirTrend = (() => {
    const todayD = new Date();
    const fmt = (d: Date) =>
      d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const d7 = new Date(todayD); d7.setDate(d7.getDate() - 7);
    const d14 = new Date(todayD); d14.setDate(d14.getDate() - 14);
    const s7 = fmt(d7);
    const s14 = fmt(d14);
    const logs7 = glucoseLogs.filter((e) => e.date >= s7);
    const logsPrev7 = glucoseLogs.filter((e) => e.date >= s14 && e.date < s7);
    const t7 = getTimeInRangePercent(logs7, goals.fastingMin, goals.fastingMax, goals.postMealMax);
    const tp7 = getTimeInRangePercent(logsPrev7, goals.fastingMin, goals.fastingMax, goals.postMealMax);
    return t7 !== null && tp7 !== null ? t7 - tp7 : null;
  })();
  const navigate = useNavigate();
  const todayStr = getTodayString();
  const controlLevel = getControlLevel();
  const heroMessage = getHeroEmotionalMessage(controlLevel.id, streak, timeInRange);
  const scoreState = getScoreEmotionalState(score);
  const tipOfTheDay = getTipOfTheDay();
  const insights = getSimpleInsights().slice(0, 2);
  const challenge = getCurrentChallenge();
  const achievements = getAchievements().slice(0, 3);
  const smartNotification = getSmartNotification();
  const coachTips = getDailyCoachTips();
  const predictions = getGlucosePredictions();
  const smartAlerts = getSmartAlerts();
  const weekComparison = getWeekComparison();
  const { data: meData } = trpc.auth.me.useQuery(undefined, { retry: false });
  const displayName =
    meData?.user?.email != null
      ? ((meData.user as { name?: string }).name ?? meData.user.email.split("@")[0] ?? null)
      : isDemo
        ? "Guest"
        : null;

  const navTo = (path: string) => () => navigate(path);

  const handleShareProgress = () => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(1, "#0b1120");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Accent glow
    const accent = ctx.createLinearGradient(0, 0, width, 0);
    accent.addColorStop(0, "#2d7ff9");
    accent.addColorStop(1, "#22c55e");

    ctx.fillStyle = accent;
    ctx.fillRect(80, 220, width - 160, 4);

    ctx.fillStyle = "#f9fafb";
    ctx.font = "bold 54px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("DiabetesSharp Progress", 80, 180);

    // Health score
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Health Score", 80, 320);
    ctx.font = "bold 96px 'Outfit', system-ui";
    ctx.fillText(String(score), 80, 420);

    // Week comparison
    const firstTir = weekComparison?.firstWeekTir ?? null;
    const currentTir = weekComparison?.currentWeekTir ?? null;
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Week 1 vs Now", 80, 540);
    ctx.font = "400 32px 'Plus Jakarta Sans', system-ui";
    if (firstTir !== null && currentTir !== null) {
      ctx.fillText(`Week 1: ${firstTir}% time in range`, 80, 600);
      ctx.fillText(`This week: ${currentTir}% time in range`, 80, 650);
      const improvement = currentTir - firstTir;
      const msg =
        improvement > 0
          ? `Your glucose stability improved ${improvement}% 🎉`
          : improvement < 0
            ? `Your glucose has been more variable by ${Math.abs(improvement)}%. Small tweaks can help.`
            : "Your stability is similar to the first week — consistency matters.";
      ctx.fillText(msg, 80, 710);
    } else {
      ctx.fillText("Log at least 7 days to see your before/after view.", 80, 600);
    }

    // Streak + level
    ctx.font = "600 40px 'Plus Jakarta Sans', system-ui";
    ctx.fillText("Habits", 80, 840);
    ctx.font = "400 32px 'Plus Jakarta Sans', system-ui";
    ctx.fillText(`Streak: ${streak} days`, 80, 900);
    ctx.fillText(`Level: ${controlLevel.label}`, 80, 950);

    // Footer
    ctx.font = "400 28px 'Plus Jakarta Sans', system-ui";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Made with DiabetesSharp", 80, height - 140);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diabetessharp-progress-${todayStr}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  useEffect(() => {
    if (celebrationFired.current) return;
    const toCelebrate = getMilestoneToCelebrate(realStreak, timeInRange);
    if (!toCelebrate) return;
    celebrationFired.current = true;
    setCelebrationMilestone(toCelebrate);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    setLastCelebratedMilestone(toCelebrate);
  }, [realStreak, timeInRange]);

  useEffect(() => {
    evaluateAndStoreAchievements();
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10" role="main" aria-label="Dashboard">
      <HowToUseBanner
        pageKey="dashboard"
        steps={[
          "Scroll through 'Your Tools' above to jump directly to any feature.",
          "The overview cards (glucose, streak, nutrition) show your real-time data.",
          "Tap any card to log new data or explore that section in depth.",
        ]}
      />

      {/* Your Tools — hero do dashboard, sempre visível independente de loading */}
      <section aria-label="Quick access tools">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Your Tools</h2>
          <Link
            to="/app/tools"
            className="text-xs font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
          >
            See all →
          </Link>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {TOOLS.map((tool) => {
            const badge = tool.badge ? BADGE_STYLES[tool.badge] : null;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={navTo(tool.path)}
                className="glass-card shrink-0 w-36 p-4 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-xl"
                style={{ scrollSnapAlign: "start" }}
              >
                {badge && (
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-2"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                )}
                {!badge && <div className="h-4 mb-2" aria-hidden />}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: tool.iconBg, color: tool.iconColor }}
                  aria-hidden
                >
                  {tool.icon}
                </div>
                <div className="font-semibold text-xs text-[var(--color-text-primary)] leading-tight mb-1">
                  {tool.title}
                </div>
                <p className="text-[10px] text-[var(--color-text-tertiary)] leading-snug">
                  {tool.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Smart notification — retention-focused message + CTA */}
      {(smartNotification || showDontBreak) && (
        <div
          className="rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/40 text-[var(--color-text-primary)] text-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-2">
            {renderDataIcon(smartNotification?.icon ?? "🔥")}
            <span>{smartNotification?.message ?? "Don't break your streak! Log something today — glucose, a meal, or complete a reminder."}</span>
          </span>
          {smartNotification?.cta && (
            <button
              type="button"
              onClick={navTo(smartNotification.cta.path)}
              className="shrink-0 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {smartNotification.cta.label}
            </button>
          )}
        </div>
      )}

      {celebrationMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
          <div className="glass-card p-6 sm:p-8 max-w-sm w-full text-center animate-in">
            <p id="celebration-title" className="text-2xl mb-2" aria-hidden>🎉</p>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Goal reached!</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">{getMilestoneMessage(celebrationMilestone)}</p>
            <button
              type="button"
              onClick={() => setCelebrationMilestone(null)}
              className="btn btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {isLoading && !isDemo ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Hero — score, greeting, estado */}
          <section
            className="glass-card p-6 sm:p-8"
            aria-label="Health overview"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Good morning{displayName ? `, ${displayName}` : ""}
            </p>

            {/* Score */}
            <div className="flex items-end gap-4 mb-3">
              <p
                className="font-display font-bold leading-none"
                style={{
                  fontSize: "clamp(56px, 14vw, 72px)",
                  letterSpacing: "-0.04em",
                  color: scoreState.state === "great"
                    ? "var(--color-success)"
                    : scoreState.state === "attention"
                      ? "var(--color-warning)"
                      : "var(--color-alert)",
                }}
                aria-label={`Health score: ${score} out of 100`}
              >
                {score}
              </p>
              <div className="pb-2 space-y-0.5">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: scoreState.state === "great"
                      ? "var(--color-success)"
                      : scoreState.state === "attention"
                        ? "var(--color-warning)"
                        : "var(--color-alert)",
                  }}
                >
                  {scoreState.label}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Health Score · 0–100</p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
              {heroMessage}
            </p>

            {/* Context line: streak + day */}
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
              aria-label="Daily check-in"
              style={{ minHeight: "48px" }}
            >
              Daily check-in
            </Link>
          </section>

          {/* Report for doctor */}
          <section aria-label="Report for doctor">
            <button
              type="button"
              onClick={navTo("/app/doctor-prep")}
              className="btn btn-primary w-full justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-primary)]"
              style={{ minHeight: "52px" }}
            >
              Generate Doctor Report
            </button>
          </section>

          {/* Tip of the day */}
          <section className="glass-card p-5" aria-label="Tip of the day">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
              Tip of the day
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {tipOfTheDay}
            </p>
          </section>

          {/* Daily Coach — actionable tips */}
          {coachTips.length > 0 && (
            <section className="glass-card p-5" aria-label="Daily Coach">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                Daily Coach
              </p>
              <ul className="space-y-2.5">
                {coachTips.map((t) => (
                  <li key={t.id} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                    <span className="shrink-0 mt-0.5">{renderDataIcon(t.icon)}</span>
                    <span className="leading-snug">{t.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Smart alerts — pattern-based messages */}
          {smartAlerts.length > 0 && (
            <section className="glass-card p-5" aria-label="Smart alerts">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                Smart alerts
              </p>
              <ul className="space-y-2 mb-3">
                {smartAlerts.map((a) => (
                  <li
                    key={a.id}
                    className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                      a.type === "positive"
                        ? "text-[var(--color-success)]"
                        : a.type === "warning"
                          ? "text-[var(--color-warning)]"
                          : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {renderDataIcon(a.icon)}
                    <span>{a.message}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  const primary = smartAlerts[0];
                  let prefill = "I’d like help understanding my recent blood sugar patterns.";
                  if (primary?.id === "spike-lunch") {
                    prefill = "I’ve noticed my glucose tends to spike after lunch. Can you help me adjust my meals or routine around lunchtime?";
                  } else if (primary?.id === "levels-improved") {
                    prefill = "My time in range has improved recently. What should I keep doing, and is there anything simple I can improve further?";
                  } else if (primary?.id === "skipped-yesterday") {
                    prefill = "I’ve been skipping some tracking days. Can you help me create a simple routine so I don’t miss logs?";
                  }
                  navigate("/app/dr-marcus", { state: { prefill } });
                }}
                className="text-xs font-medium text-[var(--color-accent)] hover:underline mt-1"
              >
                Ask AI Doctor about this →
              </button>
            </section>
          )}

          {/* Glucose prediction — unicorn-level insight */}
          {predictions.length > 0 && (
            <section className="glass-card p-5" aria-label="Glucose prediction">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">
                Glucose forecast
              </p>
              <ul className="space-y-2">
                {predictions.map((p) => (
                  <li key={p.id} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    {renderDataIcon(p.icon)}
                    <span>{p.message}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Metrics — Apple Health style: label · value · context */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid" aria-label="Overview metrics">
            <div className="stat-card">
              <div className="label">Day on plan</div>
              <div className="value">{programDay}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">of 90 · Week {Math.ceil(programDay / 7)}</div>
            </div>
            <div className="stat-card">
              <div className="label">Check-ins</div>
              <div className="value">{checkInsDone}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">This week</div>
            </div>
            <div className="stat-card">
              <div className="label">Tasks done</div>
              <div className="value">{doneCount} / {todayCount}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Today's program</div>
            </div>
            <div className="stat-card">
              <div className="label">Streak</div>
              <div className="flex items-baseline gap-1.5">
                <div className="value">{streak}</div>
                {streak >= bestStreak && streak > 1 && (
                  <span className="text-[10px] font-semibold text-[var(--color-success)] uppercase tracking-wider">best</span>
                )}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">
                {bestStreak > streak ? `Best: ${bestStreak} days` : "Days in a row"}
              </div>
            </div>
          </section>

          {/* Nutrition — MyFitnessPal style: macro progress bars */}
          <section className="glass-card p-5" aria-label="Today's nutrition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Nutrition · Today
              </p>
              <Link
                to="/app/nutrition"
                className="text-xs font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
              >
                See all →
              </Link>
            </div>
            <div className="space-y-3.5">
              {[
                { label: "Calories", value: todayNutrition.calories, target: 2000, unit: "kcal", color: "var(--color-accent)" },
                { label: "Protein", value: todayNutrition.protein, target: 60, unit: "g", color: "var(--color-success)" },
                { label: "Sugar", value: todayNutrition.sugar, target: 50, unit: "g", color: todayNutrition.sugar > 50 ? "var(--color-warning)" : "var(--color-accent)" },
              ].map(({ label, value, target, unit, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      {value}{" "}
                      <span className="font-normal text-[var(--color-text-tertiary)]">/ {target} {unit}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-hover)" }}>
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.min(100, Math.round((value / target) * 100))}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-3">From photo analysis · estimated values</p>
          </section>

          {/* Time in range + Emergency + Doctor prep + Reminders — category colors */}
          {(timeInRange !== null || todaysReminders.length > 0) && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid" aria-label="Quick actions">
              {timeInRange !== null && (
                <button
                  type="button"
                  onClick={navTo("/app/glucose")}
                  className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <div className="label">Time in range</div>
                  <div className="flex items-center gap-2.5 mt-2">
                    {/* Apple Health–style arc ring */}
                    <svg viewBox="0 0 36 36" className="w-9 h-9 shrink-0" aria-hidden>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-border-subtle)" strokeWidth="3.5" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke={timeInRange >= 70 ? "var(--color-success)" : timeInRange >= 50 ? "var(--color-warning)" : "var(--color-alert)"}
                        strokeWidth="3.5"
                        strokeDasharray={`${(timeInRange / 100) * 87.96} 87.96`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-xl text-[var(--color-text-primary)]">{timeInRange}</span>
                        <span className="text-xs text-[var(--color-text-tertiary)]">%</span>
                        {tirTrend !== null && tirTrend !== 0 && (
                          <span className={`text-[9px] font-semibold ml-0.5 ${tirTrend > 0 ? "text-[var(--color-success)]" : "text-[var(--color-alert)]"}`}>
                            {tirTrend > 0 ? "↑" : "↓"}{Math.abs(tirTrend)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-tertiary)] leading-tight">Last 30 days</div>
                    </div>
                  </div>
                </button>
              )}
              <button
                type="button"
                onClick={navTo("/app/emergency")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Low blood sugar?</div>
                <div className="value text-[var(--color-alert)]">What to do</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Emergency guide</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/doctor-prep")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Doctor visit</div>
                <div className="value">Summary</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Prepare & print</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/reminders")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Reminders today</div>
                <div className="value">{todaysReminders.filter((r) => r.done).length} / {todaysReminders.length}</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Meds & glucose</div>
              </button>
            </section>
          )}

          {todaysReminders.length === 0 && timeInRange === null && (
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={navTo("/app/emergency")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Low blood sugar?</div>
                <div className="value text-[var(--color-alert)]">What to do</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/doctor-prep")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Doctor visit</div>
                <div className="value">Summary</div>
              </button>
              <button
                type="button"
                onClick={navTo("/app/reminders")}
                className="stat-card block w-full text-left cursor-pointer transition-base rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="label">Reminders</div>
                <div className="value">Set up</div>
              </button>
            </section>
          )}

          {/* Week 1 vs now — before/after view */}
          {weekComparison && (
            <section className="glass-card p-6 sm:p-8" aria-label="Week 1 vs now">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Week 1 vs now
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Based on your blood sugar time in range.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Week 1</p>
                  <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-[var(--color-border-default)]"
                      style={{ width: `${Math.min(100, Math.max(0, weekComparison.firstWeekTir))}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {weekComparison.firstWeekTir}% in range
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-1">This week</p>
                  <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full"
                      style={{ background: "var(--color-accent)", width: `${Math.min(100, Math.max(0, weekComparison.currentWeekTir))}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {weekComparison.currentWeekTir}% in range
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {weekComparison.improvement > 0 &&
                  `Your glucose stability improved ${weekComparison.improvement}%`}
                {weekComparison.improvement < 0 &&
                  `Your glucose has been more variable by ${Math.abs(
                    weekComparison.improvement
                  )}%. Small tweaks to meals, timing, or activity can help.`}
                {weekComparison.improvement === 0 &&
                  "Your stability is similar to the first week — staying consistent is powerful."}
              </p>
              <button
                type="button"
                onClick={handleShareProgress}
                className="btn btn-secondary w-full justify-center gap-2 mt-2"
              >
                <Share2 size={16} aria-hidden /> Share your progress
              </button>
            </section>
          )}

          {/* Today's program — full width */}
          <section
            className="glass-card p-6 sm:p-8"
            aria-label={`Today's program, ${doneCount} of ${todayCount} tasks completed`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] tracking-[var(--tracking-heading)]">
                Today&apos;s program
              </h2>
              <span className="text-xs text-[var(--color-text-tertiary)]" aria-live="polite">
                {doneCount}/{todayCount} done
              </span>
            </div>
            <ul className="space-y-4" role="list">
              {missions.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)]/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleMissionDone(task.id, !task.done)}
                    aria-label={task.done ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
                    aria-pressed={task.done}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 ${
                      task.done
                        ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                        : "border-[var(--color-text-tertiary)] hover:border-[var(--color-accent)]"
                    }`}
                  >
                    {task.done ? "✓" : ""}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm">{task.title}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  <Link
                    to={task.href}
                    className="btn btn-primary flex-shrink-0 py-2.5 px-5 text-sm min-h-[var(--touch-min)] w-full sm:w-auto justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)]"
                  >
                    Go
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Insights card — data/glucose tint */}
            <section className="glass-card p-6 sm:p-8" aria-label="Insights">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Insights from your last days
              </h2>
              {insights.length === 0 ? (
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed py-2">
                  Patterns will appear here as you log more readings and meals.
                </p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {insights.map((insight) => (
                    <li
                      key={insight.id}
                      className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]/60 p-3"
                    >
                      <p className="font-medium text-[var(--color-text-primary)] mb-1">{insight.title}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{insight.body}</p>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={navTo("/app/insights")}
                className="mt-4 text-xs font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)] rounded-md py-1"
              >
                See all insights →
              </button>
            </section>

            {/* Monthly challenge — success/green tint */}
            <section className="glass-card p-6 sm:p-8 relative overflow-hidden" aria-labelledby="challenge-title">
              <span
                className="absolute top-6 right-6 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-success-soft)] text-[var(--color-success)]"
                aria-hidden
              >
                {challenge.focus === "nutrition" ? "Nutrition" : challenge.focus === "activity" ? "Activity" : "Routine"}
              </span>
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Monthly challenge
              </p>
              <h3 id="challenge-title" className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                {challenge.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                {challenge.description}
              </p>
              <div className="mb-3">
                <div className="flex justify-between items-center text-xs text-[var(--color-text-tertiary)] mb-1">
                  <span>
                    {challenge.completedDays} / {challenge.totalDays} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ background: "var(--color-accent)", width: `${Math.min(100, (challenge.completedDays / challenge.totalDays) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mt-3">
                <span className="text-xs text-[var(--color-accent)] font-medium">
                  Did you complete it today?
                </span>
                <button
                  type="button"
                  onClick={() => toggleChallengeToday(!challenge.completedToday)}
                  className={`btn py-2.5 px-5 text-sm min-h-[var(--touch-min)] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-active)] ${
                    challenge.completedToday ? "btn-secondary" : "btn-primary"
                  }`}
                  aria-label="Mark monthly challenge complete for today"
                >
                  {challenge.completedToday ? "Marked" : "Mark today"}
                </button>
              </div>
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Control level */}
            <section className="glass-card p-6 sm:p-8" aria-label="Control level">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Control level
              </h2>
              <p className="text-lg font-display font-bold text-[var(--color-accent)] mb-1">
                {controlLevel.label}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {controlLevel.description}
              </p>
            </section>

            {/* Achievements feed */}
            <section className="glass-card p-6 sm:p-8" aria-label="Recent achievements">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 tracking-[var(--tracking-heading)]">
                Badges &amp; achievements
              </h2>
              {achievements.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  As you build streaks and spend more time in range, your achievements will appear here.
                </p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {achievements.map((a) => (
                    <li key={a.id} className="rounded-lg bg-[var(--color-surface-hover)]/60 p-3 flex items-start gap-3">
                      <span className="shrink-0">{BADGE_ICON_MAP[a.id] ?? <Medal size={24} className="text-[var(--color-text-muted)]" aria-hidden />}</span>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] mb-0.5">{a.title}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {a.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
