import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  getGlucoseLogs,
  addGlucoseLog,
  getRecentLogs,
  getTodayString,
  getTimeInRangePercent,
  estimateA1c,
  getAverageGlucose,
  GLUCOSE_CONTEXT_LABELS,
  type GlucoseContext,
} from "../../data/glucoseLogs";
import { getGoals } from "../../data/goals";
import { Link } from "react-router-dom";

const CONTEXTS: GlucoseContext[] = ["fasting", "post_breakfast", "post_lunch", "post_dinner", "bedtime", "other"];

const FASTING_CTXS = ["fasting", "bedtime", "other"];

function getTirDistribution(
  logs: { value: number; context: string }[],
  goals: { fastingMin: number; fastingMax: number; postMealMax: number }
) {
  if (logs.length === 0) return null;
  let below = 0, inRange = 0, above = 0;
  for (const e of logs) {
    const isFasting = FASTING_CTXS.includes(e.context);
    if (isFasting) {
      if (e.value < goals.fastingMin) below++;
      else if (e.value > goals.fastingMax) above++;
      else inRange++;
    } else {
      if (e.value > goals.postMealMax) above++;
      else inRange++;
    }
  }
  const n = logs.length;
  return {
    below: Math.round((below / n) * 100),
    inRange: Math.round((inRange / n) * 100),
    above: Math.round((above / n) * 100),
  };
}

function getReadingColor(e: { value: number; context: string }, goals: { fastingMin: number; fastingMax: number; postMealMax: number }) {
  const isFasting = FASTING_CTXS.includes(e.context);
  if (isFasting) {
    if (e.value < goals.fastingMin) return "var(--color-alert)";
    if (e.value > goals.fastingMax) return "var(--color-warning)";
  } else {
    if (e.value > goals.postMealMax) return "var(--color-warning)";
  }
  return "var(--color-success)";
}

function formatTime(): string {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

export function GlucosePage() {
  const [value, setValue] = useState("");
  const [context, setContext] = useState<GlucoseContext>("fasting");
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(formatTime());
  const [version, setVersion] = useState(0);

  const logs = getRecentLogs(90);
  const goals = getGoals();
  const timeInRange = getTimeInRangePercent(logs, goals.fastingMin, goals.fastingMax, goals.postMealMax);
  const avg14 = getAverageGlucose(14);
  const avg30 = getAverageGlucose(30);
  const estimatedA1c = avg30 !== null ? estimateA1c(avg30) : null;
  const hasData = logs.length > 0;
  const distribution = getTirDistribution(logs, goals);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value.trim(), 10);
    if (Number.isNaN(num) || num < 20 || num > 500) return;
    addGlucoseLog({ value: num, unit: "mg/dL", context, date, time });
    setValue("");
    setTime(formatTime());
    setDate(getTodayString());
    setVersion((v) => v + 1);
  };

  const exportCsv = () => {
    const rows = getGlucoseLogs().slice(0, 500);
    const headers = "Date,Time,Value (mg/dL),Context\n";
    const lines = rows.map((e) => `${e.date},${e.time ?? ""},${e.value},${GLUCOSE_CONTEXT_LABELS[e.context]}`).join("\n");
    const blob = new Blob([headers + lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glucose-log-${getTodayString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const last7 = getRecentLogs(7);
  const maxVal = Math.max(100, ...last7.map((e) => e.value), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">My Sugar</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            A calm place to watch your numbers and understand how your day is going.
          </p>
        </div>
        <Link
          to="/app/settings"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md px-1 py-1 min-h-[44px] inline-flex items-center"
        >
          Set target range →
        </Link>
      </div>

      <HowToUseBanner
        pageKey="glucose"
        steps={[
          "Enter your blood sugar value, choose the context (fasting, post-meal…) and tap Save.",
          "Your chart, stats and range distribution update automatically after each entry.",
          "Tap 'Export CSV' to download the full log and share it with your doctor.",
        ]}
      />

      {/* Summary stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Glucose summary">
        <div className="stat-card">
          <div className="label">Time in range</div>
          {timeInRange !== null ? (
            <>
              <div className="value">{timeInRange}%</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Last 90 days · goal ≥ 70%</div>
            </>
          ) : (
            <>
              <div className="value text-[var(--color-text-tertiary)]">—</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Log readings to see</div>
            </>
          )}
        </div>

        <div className="stat-card">
          <div className="label">Average</div>
          {avg14 !== null ? (
            <>
              <div className="value">{avg14}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">mg/dL · last 14 days</div>
            </>
          ) : (
            <>
              <div className="value text-[var(--color-text-tertiary)]">—</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Needs 7+ readings</div>
            </>
          )}
        </div>

        <div className="stat-card">
          <div className="label">Est. A1c</div>
          {estimatedA1c !== null ? (
            <>
              <div className="value">~{estimatedA1c}%</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Estimate — lab result is reference</div>
            </>
          ) : (
            <>
              <div className="value text-[var(--color-text-tertiary)]">—</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Needs 30 days of data</div>
            </>
          )}
        </div>

        <div className="stat-card">
          <div className="label">Readings logged</div>
          <div className="value">{logs.length}</div>
          <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1 leading-tight">Last 90 days</div>
        </div>
      </section>

      {/* Empty state — first time user */}
      {!hasData && (
        <div className="glass-card p-8 flex flex-col items-center text-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-surface-hover)" }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)] text-sm">No readings yet</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-relaxed max-w-xs">
              Add your first glucose reading below. Your summary stats will appear after a few entries.
            </p>
          </div>
        </div>
      )}

      {/* Range distribution bar — Apple Health / CGM style */}
      {hasData && distribution && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Range distribution</h2>
            <span className="text-[10px] text-[var(--color-text-tertiary)]">Last 90 days · {logs.length} readings</span>
          </div>
          <div className="flex rounded-full overflow-hidden h-2.5 mb-3 gap-px">
            {distribution.below > 0 && (
              <div
                style={{ width: `${distribution.below}%`, background: "var(--color-alert)" }}
                title={`Below range: ${distribution.below}%`}
              />
            )}
            {distribution.inRange > 0 && (
              <div
                style={{ width: `${distribution.inRange}%`, background: "var(--color-success)" }}
                title={`In range: ${distribution.inRange}%`}
              />
            )}
            {distribution.above > 0 && (
              <div
                style={{ width: `${distribution.above}%`, background: "var(--color-warning)" }}
                title={`Above range: ${distribution.above}%`}
              />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-alert)" }} />
              Below {distribution.below}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-success)" }} />
              In range {distribution.inRange}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-warning)" }} />
              Above {distribution.above}%
            </span>
          </div>
        </div>
      )}

      {/* Mini chart — last 7 readings */}
      {last7.length > 0 && (
        <div className="glass-card p-5 animate-in">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Last 7 readings</h2>
          <div className="h-36 w-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" aria-hidden>
              {/* Target range band */}
              {(() => {
                const bandTop = 10 + (1 - goals.fastingMax / maxVal) * 70;
                const bandBot = 10 + (1 - goals.fastingMin / maxVal) * 70;
                return bandTop < bandBot ? (
                  <rect x="0" y={bandTop} width="100" height={bandBot - bandTop} fill="var(--color-success)" fillOpacity="0.1" />
                ) : null;
              })()}
              <line x1="0" y1="90" x2="100" y2="90" stroke="var(--color-border-subtle)" strokeWidth="0.6" />
              {last7.map((e, idx) => {
                const x = (idx / Math.max(1, last7.length - 1)) * 100;
                const y = 10 + (1 - e.value / maxVal) * 70;
                const color =
                  goals &&
                  ((e.context === "fasting" && (e.value < goals.fastingMin || e.value > goals.fastingMax)) ||
                    (e.context !== "fasting" && e.value > goals.postMealMax))
                    ? "var(--color-alert)"
                    : "var(--color-success)";
                return <circle key={e.id} cx={x} cy={y} r={1.4} fill={color} />;
              })}
              <polyline
                fill="none"
                stroke="url(#glucoseLine)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={last7.map((e, idx) => {
                  const x = (idx / Math.max(1, last7.length - 1)) * 100;
                  const y = 10 + (1 - e.value / maxVal) * 70;
                  return `${x},${y}`;
                }).join(" ")}
              />
              <defs>
                <linearGradient id="glucoseLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-success)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Log form */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Add reading</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Value (mg/dL)</label>
              <input
                type="number"
                min={20}
                max={500}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 98"
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="form-label">Context</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as GlucoseContext)}
                className="input-field w-full"
              >
                {CONTEXTS.map((c) => (
                  <option key={c} value={c}>{GLUCOSE_CONTEXT_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-full" />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field w-full" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            Save reading
          </button>
        </form>
      </div>

      {/* Recent readings list */}
      {hasData && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Recent readings</h2>
            <button
              type="button"
              onClick={exportCsv}
              className="text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md px-1 py-1"
            >
              Export CSV
            </button>
          </div>
          <ul className="space-y-1 max-h-64 overflow-y-auto" role="list">
            {logs.slice(0, 50).map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center py-2.5 px-1 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <span className="text-xs text-[var(--color-text-tertiary)] w-28 shrink-0">{e.date} {e.time}</span>
                <span
                  className="font-semibold text-sm flex-1 text-center"
                  style={{ color: getReadingColor(e, goals) }}
                >
                  {e.value} <span className="font-normal text-xs" style={{ color: "var(--color-text-tertiary)" }}>mg/dL</span>
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)] w-28 text-right shrink-0">{GLUCOSE_CONTEXT_LABELS[e.context]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {void version}
    </div>
  );
}
