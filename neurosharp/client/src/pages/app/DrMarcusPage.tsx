import { useState, useRef, useEffect } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

type Message = { role: "user" | "assistant"; content: string };

/** Pre-made prompts: real patient-style reports, as if at a memory specialist. */
const QUICK_PROMPTS = [
  "I keep forgetting where I put my keys and glasses.",
  "I repeated the same question to my family several times today.",
  "I'm worried I might have early signs of Alzheimer's.",
  "I forget names of people I've known for years.",
  "I get confused about what day it is or what I was doing.",
  "My family says I've been repeating myself a lot.",
  "I forget appointments and important dates.",
  "I have trouble following conversations or multi-step instructions.",
  "I'm scared my memory is getting worse.",
  "I mix up words or can't find the right word when I'm talking.",
  "I forget whether I already took my medication.",
  "I sometimes get lost in places I know well.",
];

/** Mock doctor replies — replace with AI API later. */
function getDoctorReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const replies: Record<string, string[]> = {
    keys: [
      "Forgetting where you put everyday items like keys or glasses is very common and often linked to attention or routine, not necessarily serious memory disease. Try a fixed spot for keys and glasses and use the app's attention exercises. If it happens daily and affects your safety or independence, we can discuss an in-person evaluation.",
      "Many people have this — it can be stress, distraction, or sleep. Establishing one place for important items and doing short daily cognitive exercises often helps. If it's new, frequent, or worsening, note how often it happens and we can reassess.",
    ],
    repeated: [
      "Repeating the same question can be a sign to track: how often, and does the person remember asking? Sometimes it's stress or poor sleep. Keep a brief note of when it happens. The daily exercises in the app target working memory and may help. If it's several times a day and others are concerned, an in-person visit is a good next step.",
      "Noting how often you repeat questions is useful. It can relate to working memory or attention. Consistency with the program's exercises and good sleep often improve this. If it's increasing or your family is worried, a specialist can help rule out causes.",
    ],
    alzheimer: [
      "It's normal to worry. Many memory slips are due to stress, sleep, or aging — not Alzheimer's. What matters is whether symptoms affect daily life, safety, or get worse over time. The program can help with cognitive reserve. I recommend discussing your specific symptoms with a neurologist or geriatrician for a proper assessment.",
      "Your concern is valid. Early evaluation is helpful: a specialist can distinguish normal aging from something that needs treatment. In the meantime, staying active cognitively with this program, good sleep, and exercise supports brain health. Would you like to talk about what exactly you've noticed?",
    ],
    names: [
      "Forgetting names, especially of people you don't see daily, is common and often one of the first things people notice. It can be normal aging or attention. The name-and-face association exercises in the app are designed for this. If you're also forgetting who people are or confusing close family, that's worth bringing to an in-person visit.",
      "Name recall is a specific type of memory. Practice with the app's association exercises can help. If it's only names and not faces or relationships, we often see improvement with consistent training. If it's spreading to other areas, we should consider a full evaluation.",
    ],
    confused: [
      "Confusion about the day or what you were doing can stem from routine changes, sleep, or attention. Try keeping a simple daily log and a visible calendar. If you're often disoriented to time or place, or it's getting worse, a neurologist or geriatrician should evaluate you.",
      "Mild confusion about date or recent actions is common when we're tired or stressed. Good sleep and the app's orientation and attention exercises can help. If confusion is frequent, lasts a long time, or affects safety, please see a specialist in person.",
    ],
    repeating: [
      "When family notice repetition, it's worth paying attention. Note how often it happens and in what situations. The program's exercises target verbal and working memory — consistency here can help. If repetition is increasing or affecting relationships, an in-person assessment is recommended.",
      "Family observations are valuable. Repeating yourself can improve with working-memory exercises and better sleep. Track whether it's worse at certain times of day. If it's progressing or your family is concerned, a memory specialist can do a proper evaluation.",
    ],
    appointments: [
      "Forgetting appointments and dates is often about attention and organization rather than severe memory loss. Use a calendar (paper or phone) and set reminders. The app's exercises support planning and prospective memory. If you're missing critical appointments or losing track of entire days, we should consider an evaluation.",
      "Many people need more structure as they age. One calendar, one place for notes, and reminders can help a lot. The cognitive exercises in the program support this kind of memory. If missed appointments become frequent, mention it to your doctor in person.",
    ],
    following: [
      "Trouble following conversations or multi-step instructions can relate to attention, hearing, or working memory. Make sure hearing is checked. The app's attention and sequencing exercises are relevant here. If you lose the thread of normal chats often, an in-person assessment can clarify the cause.",
      "This often improves with targeted exercises for attention and working memory — both are in the program. In conversations, asking for one step at a time can help. If it's new or worsening, a specialist can distinguish normal aging from something that needs more support.",
    ],
    scared: [
      "It's understandable to be scared. The best step is to get a clear picture: track what specifically is changing and over what time. Many changes are manageable with lifestyle and cognitive training. A neurologist or geriatrician can give you a proper evaluation and peace of mind.",
      "Your feelings are valid. Not all memory changes mean serious disease — stress, sleep, and mood play a big role. Stick with the program and note what improves or worsens. If anxiety is high or symptoms are progressing, an in-person visit is important for diagnosis and next steps.",
    ],
    words: [
      "Mixing up words or struggling to find the right word is common and often stress- or fatigue-related. It can also be part of normal aging. The app's language and recall exercises can help. If it's frequent, worsening, or affecting your ability to communicate, a speech or memory evaluation may be useful.",
      "Word-finding difficulty is a specific type of recall. Many people see improvement with regular cognitive exercises and good sleep. If you're substituting wrong words often or losing the thread of sentences, an in-person assessment can rule out causes that need treatment.",
    ],
    medication: [
      "Forgetting whether you took your medication is a safety issue. Use a pill organizer or app reminder, and check off each dose. The program's prospective-memory exercises support this. If you've missed or doubled doses more than once, tell your prescribing doctor and consider a medication review.",
      "This is important to address. A daily pill box and phone alarms can help. If confusion about medications is frequent, your doctor or pharmacist can simplify your regimen. The cognitive exercises here support routine and memory for daily tasks.",
    ],
    lost: [
      "Getting lost in familiar places can be disorienting and deserves attention. Note how often it happens and whether you recognize the area once you're there. If it's new or increasing, a neurologist or geriatrician should evaluate you — they can check orientation and spatial memory.",
      "Even in known areas, occasional disorientation can happen with stress or fatigue. If it's recurring or you don't recognize familiar routes, that's a reason for an in-person assessment. In the meantime, avoid driving if you feel unsure, and use the app's orientation and attention exercises.",
    ],
  };

  for (const [key, options] of Object.entries(replies)) {
    if (lower.includes(key)) return options[Math.floor(Math.random() * options.length)];
  }

  const fallbacks = [
    "I hear you. Can you describe a bit more what you've noticed — when it started and how often it happens? That will help me guide you better.",
    "Thank you for sharing. Keep using the daily exercises and note any changes. If symptoms are new, frequent, or worsening, an in-person evaluation with a memory specialist is the right next step.",
    "Your concerns are valid. Many memory changes are manageable. If you'd like, we can focus on one specific symptom and what to do next, or you can type more about what you're experiencing.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm Dr. Marcus, your virtual doctor. I'm here 24/7 to answer questions about memory, cognitive exercises, and how you're feeling. Pick a question below or type anything you'd like.",
};

export function DrMarcusPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
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
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Dr. Marcus</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Your 24/7 virtual doctor — ask questions and talk about how you're feeling.
        </p>
      </div>

      <HowToUseBanner
        pageKey="ns-dr-marcus"
        steps={[
          "Type your question or choose a suggested topic to begin.",
          "Dr. Marcus uses your cognitive scores and exercise history for personalized guidance.",
          "Always confirm medical decisions with your own doctor.",
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
            <span className="text-[var(--color-accent)]">💬</span>
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
            Describe your symptoms, ask about memory or the program, or tap a question above. Dr. Marcus is available 24/7 for guidance — for emergencies or a formal diagnosis, please see a doctor in person.
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
