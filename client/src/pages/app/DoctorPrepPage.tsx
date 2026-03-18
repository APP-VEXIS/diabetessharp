import { Link } from "react-router-dom";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import { getAverageGlucose, estimateA1c, getRecentLogs, getTimeInRangePercent } from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";
import { getReminders, getCompletionsForDate } from "../../data/reminders";
import { getMealLogs } from "../../data/mealLogs";

const QUESTIONS = [
  "How are my blood sugar numbers compared to my target?",
  "Should I adjust my medication or insulin?",
  "Do I need any new tests (e.g. kidney, eyes, feet)?",
  "What should I do if I have a low (hypo)?",
  "Are my current meal choices okay for my goals?",
];

export function DoctorPrepPage() {
  const logs = getRecentLogs(30);
  const goals = getGoals();
  const timeInRange = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  const avg30 = getAverageGlucose(30);
  const estimatedA1c = avg30 !== null ? estimateA1c(avg30) : null;
  const mealLogs = getMealLogs();
  const reminders = getReminders();
  let adherenceCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const done = getCompletionsForDate(dateStr);
    reminders.filter((r) => r.enabled).forEach((r) => { if (done.has(r.id)) adherenceCount++; });
  }

  const printSummary = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Doctor visit summary - DiabetesSharp</title>
<style>body{font-family:system-ui,sans-serif;padding:24px;max-width:600px;margin:0 auto;color:#1a1a1a}
h1{font-size:1.25rem;margin-bottom:16px}h2{font-size:1rem;margin-top:20px;margin-bottom:8px}
ul{list-style:none;padding:0}li{padding:4px 0}
</style></head><body>
<h1>Visit summary — DiabetesSharp</h1>
<p>Generated ${new Date().toLocaleDateString()}.</p>
<h2>Blood sugar (last 30 days)</h2>
<ul>
<li>Readings logged: ${logs.length}</li>
<li>Average glucose: ${avg30 ?? "—"} mg/dL</li>
<li>Estimated A1c: ${estimatedA1c != null ? "~" + estimatedA1c + "% (lab is definitive)" : "—"}</li>
<li>Time in range: ${timeInRange != null ? timeInRange + "%" : "—"}</li>
</ul>
<h2>Meals & reminders</h2>
<ul>
<li>Meal photos/logs (recent): ${mealLogs.length}</li>
<li>Reminders followed (last 7 days): ${adherenceCount} completed</li>
</ul>
<h2>Questions to ask my doctor</h2>
<ul>${QUESTIONS.map((q) => `<li>${q}</li>`).join("")}</ul>
<script>window.onload=function(){setTimeout(window.print,300)}</script>
</body></html>`;
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Prepare for your visit</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Summary and questions to take to your doctor</p>
        </div>
        <Link to="/app/dashboard" className="text-sm text-[var(--color-accent)] hover:underline">← Dashboard</Link>
      </div>

      <HowToUseBanner
        pageKey="doctor-prep"
        steps={[
          "Review your 30-day summary of glucose, medications and meal logs below.",
          "Print or share the report using the button at the bottom of the page.",
          "Bring the suggested questions to guide your conversation with your doctor.",
        ]}
      />

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Last 30 days summary</h2>
        <ul className="space-y-2 text-sm">
          <li><span className="text-[var(--color-text-muted)]">Readings logged:</span> <strong className="text-[var(--color-text)]">{logs.length}</strong></li>
          <li><span className="text-[var(--color-text-muted)]">Average glucose:</span> <strong className="text-[var(--color-text)]">{avg30 ?? "—"} mg/dL</strong></li>
          <li><span className="text-[var(--color-text-muted)]">Estimated A1c:</span> <strong className="text-[var(--color-text)]">{estimatedA1c != null ? "~" + estimatedA1c + "%" : "—"}</strong> <span className="text-xs text-[var(--color-text-muted)]">(lab is definitive)</span></li>
          <li><span className="text-[var(--color-text-muted)]">Time in range:</span> <strong className="text-[var(--color-text)]">{timeInRange != null ? timeInRange + "%" : "—"}</strong></li>
          <li><span className="text-[var(--color-text-muted)]">Meal logs (photos):</span> <strong className="text-[var(--color-text)]">{mealLogs.length}</strong></li>
          <li><span className="text-[var(--color-text-muted)]">Reminders completed (last 7 days):</span> <strong className="text-[var(--color-text)]">{adherenceCount}</strong></li>
        </ul>
      </div>

      <div className="glass-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Questions to ask</h2>
        <ul className="space-y-2">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="text-[var(--color-accent)]">•</span> {q}
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={printSummary} className="btn btn-primary w-full py-3">
        Print / save summary
      </button>
    </div>
  );
}
