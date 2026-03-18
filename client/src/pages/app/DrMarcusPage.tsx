import { useState, useRef, useEffect } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

/** Pre-made prompts: questions about diabetes, blood sugar, diet, and meds. */
const QUICK_PROMPTS = [
  "My fasting glucose is often high. What can I do?",
  "Can I eat fruit if I have diabetes?",
  "I forgot to take my medication this morning. What now?",
  "What's a good snack that won't spike my blood sugar?",
  "How often should I check my blood sugar?",
  "I'm scared of starting insulin. What should I know?",
  "What are the best carbs for diabetes?",
  "Why do my numbers go up in the morning?",
];

/** Mock replies for diabetes Q&A — replace with AI API later. */
function getDoctorReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const replies: Record<string, string[]> = {
    fasting: [
      "High fasting glucose is common and can be influenced by the dawn phenomenon, what you ate the night before, or stress. Try a short walk after dinner, avoid late heavy meals, and keep a log of your fasting numbers. If it stays high, your doctor may adjust meds or suggest a different timing. This app's tracking can help you spot patterns.",
      "Fasting numbers can improve with consistent habits: regular sleep, light activity, and avoiding large or sugary snacks late at night. Log your readings here so you can see trends. Your doctor can use that to tailor your plan.",
    ],
    fruit: [
      "Yes, most people with diabetes can eat fruit in moderation. Choose whole fruit over juice, pair it with protein or a small amount of fat to blunt the spike, and watch portions. Berries and apples are often good choices. Check your glucose 1–2 hours after to see how you respond.",
      "Fruit has natural sugar but also fiber and nutrients. Stick to one small serving at a time and prefer lower-glycemic options. Use the app's recipes and meal ideas for balanced choices.",
    ],
    forgot: [
      "If you forgot one dose, check the leaflet or ask your pharmacist — some meds can be taken late, others not. Don't double up unless your doctor said so. Set a daily reminder or use a pill box to reduce the chance of missing again. Log it in the app so you have a record.",
      "Missing a dose occasionally happens. Follow your medication instructions: some are safe to take late, others need to be skipped. Use reminders and the app's check-in to stay on track. If you miss often, talk to your doctor about simplifying your regimen.",
    ],
    snack: [
      "Good options: nuts, cheese, veggie sticks with hummus, plain yogurt, or a small apple with peanut butter. Avoid sugary bars and juices. Portion size matters — use the app's shopping list and recipes for ideas.",
      "Choose snacks with protein and fiber and minimal added sugar. A handful of almonds, cucumber with guacamole, or a hard-boiled egg are simple choices that usually don't spike blood sugar much.",
    ],
    check: [
      "How often to check depends on your type of diabetes, treatment, and goals. Many people check fasting and 1–2 hours after main meals. Your doctor or educator can suggest a schedule. Use the Photos and Progress sections here to log and see trends.",
      "There's no one-size-fits-all. Typical patterns include fasting and post-meal. If you're on insulin or adjusting meds, you may need more frequent checks. Log your results in the app to share with your care team.",
    ],
    insulin: [
      "Starting insulin can feel scary, but for many it's a tool that brings numbers under control and reduces long-term risk. Your doctor or educator will show you how to inject, when to take it, and how to avoid lows. Ask them any question — no question is silly.",
      "Insulin is one of the most effective ways to lower blood sugar when diet and pills aren't enough. Your team will tailor the type and dose to you. Use this app to track your numbers and symptoms so you can work together on adjustments.",
    ],
    carbs: [
      "Focus on high-fiber, minimally processed carbs: whole grains, legumes, vegetables, and fruit in moderation. Pair carbs with protein and healthy fat to slow digestion. The app's recipes are designed with diabetes in mind.",
      "Best carbs are those that don't spike you quickly: whole oats, beans, lentils, quinoa, and non-starchy veggies. Portion size and what you eat with them matter. Check our Recipes section for balanced meal ideas.",
    ],
    morning: [
      "Morning highs can be the 'dawn phenomenon' (hormones raise glucose before you wake) or the 'foot to the floor' effect when you get up. A light walk before breakfast, consistent sleep, and not overdoing carbs at dinner can help. Log your fasting and pre-breakfast numbers to see the pattern.",
      "Rising glucose in the morning is common. It's often hormonal. Your doctor may suggest adjusting medication timing or type. Use the app to track fasting values over time so you can discuss with your care team.",
    ],
  };

  for (const [key, options] of Object.entries(replies)) {
    if (lower.includes(key)) return options[Math.floor(Math.random() * options.length)];
  }

  const fallbacks = [
    "Good question. Can you tell me a bit more — for example your recent numbers or what you've already tried? That way I can give you more relevant guidance.",
    "I'm here to help with day-to-day questions about diabetes. For specific doses or diagnosis, your doctor is the right person. You can use this app to track your numbers and habits to take to your next visit.",
    "Keep logging your meals and glucose in the app so we can spot patterns. If you'd like, ask something more specific — for example about a food, a reading, or your medication — and I'll do my best to guide you.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi, I’m Dr. James. Think of me as your calm diabetes coach — here 24/7 to talk about your numbers, meals, meds, and daily routine. Pick a question below or type what’s on your mind.",
};

export function DrMarcusPage() {
  const location = useLocation();
  const prefillFromState = (location.state as { prefill?: string } | null)?.prefill ?? "";
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState(prefillFromState);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setInput("");
    const userMsg: Message = { role: "user", content: t };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const reply = getDoctorReply(t);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const promptsToShow = messages.length <= 1 ? QUICK_PROMPTS.slice(0, 8) : QUICK_PROMPTS.slice(0, 4);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Talk to Dr. James</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          A safe space to ask about your blood sugar, food, medications, and fears. I give guidance — your own doctor is
          always the one to adjust treatment.
        </p>
      </div>

      <HowToUseBanner
        pageKey="dr-marcus"
        steps={[
          "Type your question or select a suggested topic to start the conversation.",
          "Dr. Marcus uses your logged data to give personalized guidance.",
          "Always confirm any medical decision with your own doctor.",
        ]}
      />

      <div className="glass-card flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Chat messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443h.007v8.014H12A55.38 55.38 0 0 1 6.75 15Z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-text)] ml-auto"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443h.007v8.014H12A55.38 55.38 0 0 1 6.75 15Z" />
                </svg>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-2.5 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts — prominent box */}
        <div className="mx-4 mb-3 p-4 rounded-2xl border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/50">
          <p className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <MessageCircle size={16} className="text-[var(--color-accent)] shrink-0" aria-hidden />
            {messages.length <= 1 ? "Start the conversation" : "More questions"}
          </p>
          <div className="flex flex-wrap gap-2">
            {promptsToShow.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                disabled={isTyping}
                className="text-left text-sm px-4 py-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] hover:shadow-sm transition-colors disabled:opacity-50 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Instruction for the patient */}
        <div className="px-4 pt-3 pb-1 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Ask about blood sugar, diet, medication, or routine. This is for education and support only — for emergencies or changes to your treatment, see your doctor.
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1 min-h-[44px]"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-12 h-[44px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none transition-opacity"
              aria-label="Send"
            >
              <Send size={18} aria-hidden />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
