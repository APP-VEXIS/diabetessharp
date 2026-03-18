import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
  getTodaysRemindersWithStatus,
  setReminderDone,
  getTodayString,
  type Reminder,
  type ReminderType,
} from "../../data/reminders";

export function RemindersPage() {
  const [version, setVersion] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newType, setNewType] = useState<ReminderType>("medication");

  const today = getTodayString();
  const todaysList = getTodaysRemindersWithStatus();
  const allReminders = getReminders();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    addReminder({ type: newType, label, time: newTime, enabled: true });
    setNewLabel("");
    setNewTime("08:00");
    setShowAdd(false);
    setVersion((v) => v + 1);
  };

  const toggleDone = (reminderId: string, done: boolean) => {
    setReminderDone(today, reminderId, !done);
    setVersion((v) => v + 1);
  };

  const toggleEnabled = (r: Reminder) => {
    updateReminder(r.id, { enabled: !r.enabled });
    setVersion((v) => v + 1);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this reminder?")) {
      deleteReminder(id);
      setVersion((v) => v + 1);
    }
  };

  void version;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Reminders</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Medication and blood sugar check reminders. Mark done when you complete them.</p>
      </div>

      <HowToUseBanner
        pageKey="reminders"
        steps={[
          "Tap the '+' button at the bottom to create a medication or glucose check reminder.",
          "Toggle the switch to enable or disable a reminder without deleting it.",
          "Mark each reminder as done after completing it — your streak counts on it.",
        ]}
      />

      {/* Today's checklist */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Today&apos;s reminders</h2>
        {todaysList.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No reminders set. Add one below.</p>
        ) : (
          <ul className="space-y-2">
            {todaysList.map(({ reminder, done }) => (
              <li key={reminder.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => toggleDone(reminder.id, done)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    done ? "bg-[var(--color-success)] border-[var(--color-success)] text-white" : "border-[var(--color-text-muted)]"
                  }`}
                  aria-label={done ? "Mark not done" : "Mark done"}
                >
                  {done ? "✓" : ""}
                </button>
                <span className="font-medium text-sm text-[var(--color-text)]">{reminder.label}</span>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">{reminder.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add reminder form */}
      {showAdd ? (
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">New reminder</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value as ReminderType)} className="input-field w-full">
                <option value="medication">Medication</option>
                <option value="glucose">Blood sugar check</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Metformin morning"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Time</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="input-field w-full" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <button type="button" onClick={() => setShowAdd(true)} className="btn btn-primary w-full py-3">
          + Add reminder
        </button>
      )}

      {/* All reminders list - enable/disable, delete */}
      {allReminders.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">All reminders</h2>
          <ul className="space-y-2">
            {allReminders.map((r) => (
              <li key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => toggleEnabled(r)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${r.enabled ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]" : "border-[var(--color-text-tertiary)] opacity-50"}`}
                  title={r.enabled ? "Disable" : "Enable"}
                >
                  {r.enabled ? "✓" : ""}
                </button>
                <span className={`text-sm ${r.enabled ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>{r.label}</span>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">{r.time}</span>
                <button type="button" onClick={() => handleDelete(r.id)} className="text-[var(--color-error)] text-xs hover:underline">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
