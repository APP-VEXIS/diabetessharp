import { useState, useRef, useEffect } from "react";
import { HeartHandshake, Send } from "lucide-react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "How did your numbers go today?",
  "Did you take your medication?",
  "What did you eat for breakfast?",
  "I had a high reading this morning",
  "I'm struggling to stay on track",
  "What's a good snack for diabetes?",
  "I forgot to check my glucose",
  "How can I stay motivated?",
];

const EXPLANATION = `Sofia is your diabetes companion. She's here to chat about your routine, meals, meds, and how you're feeling. Share a win, a worry, or a question — she'll encourage you and point you to simple next steps. Not a substitute for your doctor, just a friendly support.`;

const WELCOME: Message = {
  role: "assistant",
  content: "Hi! I'm Sofia, your diabetes companion. Tell me how you're doing — your numbers, what you ate, whether you took your meds, or anything that's on your mind. Pick a prompt below or just type. I'm here to listen and help you stay on track.",
};

/** Context-aware: Sofia follows the conversation and gives topic-specific hints. */
function getSofiaReply(userText: string, context: ConversationContext): string {
  const lower = userText.toLowerCase();
  const dontRemember = /\b(don't|do not|didn't|can't|cannot|don’t)\s+remember\b|\bforgot\b|\bno\b|\bnot really\b|\bnot sure\b|\bi don't recall\b|\bhazy\b|\bblank\b/.test(lower);

  if (dontRemember && context.topic) {
    const hintsByTopic: Record<string, string[]> = {
      childhood: [
        "No rush. Maybe a smell or sound — like a kitchen, or a backyard. Or a person who was often there. Whatever floats up.",
        "That's fine. Was it a house, an apartment, or somewhere else? Sometimes the kind of place is the first thing that returns.",
        "Take your time. Think of a season — or a holiday you spent there. Even that can open the door a little.",
      ],
      trip: [
        "No problem. Who were you with? Sometimes the face of a travel companion brings the rest back.",
        "That's okay. Was it by the sea, in the mountains, or in a city? Just the type of place can help.",
        "Let it come. What did you eat there, or what was the weather like? Senses often lead the way.",
      ],
      family: [
        "All good. What did they look like — or what's one thing they always said? Even a phrase can bring them closer.",
        "No worries. Were they older or younger than you? Where did you usually see them?",
        "Whenever you're ready. A photo you might have, or a holiday you spent together — whatever feels close.",
      ],
      job: [
        "That's okay. Was it indoors or outside? Or a smell — an office, a workshop, a classroom?",
        "No rush. What was the first thing you did when you got there each day? Sometimes the routine comes first.",
        "Take your time. A colleague's name or face, or one task you did — even a small one.",
      ],
      happy: [
        "No problem. Was it with someone specific? Or in a particular place? One anchor can bring the rest.",
        "That's fine. Morning or evening? Inside or outside? Sometimes the when and where come first.",
        "Whenever it comes. A color, a sound, or a feeling — whatever feels true.",
      ],
      someone: [
        "All good. Where did you usually see them — at home, at work, on visits? The place can help.",
        "No worries. What did their voice sound like, or one thing they liked to do?",
        "Take your time. A holiday or a meal you shared — even a vague sense of it.",
      ],
      place: [
        "That's okay. Was it noisy or quiet? Hot or cold? The feel of the place can come back first.",
        "No rush. Who might have been there with you? Or what time of day you remember being there?",
        "Whenever you're ready. A corner of the room, or something you could see from the window.",
      ],
      celebration: [
        "No problem. Whose celebration was it, or what time of year? Sometimes that's enough to start.",
        "That's fine. Was it at someone's house, or somewhere else? Who was around the table?",
        "Take your time. A cake, a song, or a gift — any little piece of it.",
      ],
    };
    const hints = hintsByTopic[context.topic] ?? [
      "No rush. Sometimes one detail — who was there, or the time of year — is enough to bring more back.",
      "That's okay. A smell, a sound, or a place can open the door. Whatever comes to mind.",
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  }

  if (dontRemember && !context.topic) {
    return "No problem at all. Pick a topic above that feels close to you — childhood, a trip, family — and we can start from there. Or tell me in your own words what you'd like to remember.";
  }

  const sharedSomething = /\b(yes|was |were |we |i |my |had |went |remember|grandma|grandpa|mother|father|brother|sister|friend|house|beach|school|work)\b/i.test(lower) && lower.length > 8;
  if (sharedSomething) {
    const followUps = [
      "I like that. What else is there — a sound, a smell, or someone else who was there?",
      "Thanks for sharing that. What's one small detail that still feels clear when you think about it?",
      "That really helps. How do you feel when you bring that to mind now?",
      "Tell me a bit more about that — whatever comes up.",
      "What was the best part of that for you?",
    ];
    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  const openers: Record<string, string> = {
    high: "A single high reading isn't the whole story. Note what you ate or did before — that helps you and your doctor see patterns. Keep logging in the app.",
    forgot: "It happens. Don't double up unless your doctor said so. Set a daily reminder or use a pill box. Use the app to log so you have a record.",
    struggl: "You're not alone. Small steps count — one good meal, one walk, one check. Focus on today. I'm here whenever you want to talk.",
    snack: "Try nuts, cheese, veggie sticks with hummus, or a small apple with peanut butter. Check the Recipes section for more ideas.",
    motivat: "You're already here, and that matters. Set one small goal for today — one check-in, one walk, one balanced meal. I'm in your corner.",
    childhood: "Tell me about a place you loved as a child. Your house, a grandparent's home, or a favorite spot. What did it look like?",
    trip: "Think of a trip you took — near or far. Who were you with? What's the first thing you see when you think of it?",
    family: "Who is someone in your family you remember especially well? Can you describe one moment with them?",
    job: "Think of your first job or your school days. What's one thing you did there that you're proud of?",
    happy: "Recall a moment when you felt really happy. Where were you? Who was there?",
    someone: "Think of someone important to you. What's one thing they used to say or do that you remember?",
    place: "Describe a place you loved — a room, a street, a town. What made it special?",
    celebration: "Think of a celebration — a birthday, holiday, or wedding. What do you see first when you remember it?",
  };
  for (const [key, reply] of Object.entries(openers)) {
    if (lower.includes(key)) return reply;
  }

  const fallbacks = [
    "I'm following. Share a bit more when you're ready — a person, a place, or a moment. We can go from there.",
    "Whatever comes up is enough. A detail, a feeling, or a name — we'll build on it.",
    "Take your time. When something surfaces, even a small piece, just type it. No pressure.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

type ConversationContext = { topic?: string; turnCount: number };

function detectTopic(userText: string): string | undefined {
  const lower = userText.toLowerCase();
  if (lower.includes("number") || lower.includes("reading") || lower.includes("glucose") || lower.includes("blood sugar")) return "numbers";
  if (lower.includes("med") || lower.includes("medication") || lower.includes("pill") || lower.includes("insulin")) return "meds";
  if (lower.includes("breakfast") || lower.includes("lunch") || lower.includes("dinner") || lower.includes("ate") || lower.includes("eat")) return "breakfast";
  if (lower.includes("snack") || lower.includes("eat")) return "snack";
  if (lower.includes("motivat") || lower.includes("track") || lower.includes("struggl")) return "motivated";
  return undefined;
}

export function SofiaPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const topicFromInput = detectTopic(t);
    if (topicFromInput) setCurrentTopic(topicFromInput);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: t }]);
    setIsTyping(true);
    const turnCount = messages.filter((m) => m.role === "user").length + 1;
    const context: ConversationContext = { topic: topicFromInput ?? currentTopic, turnCount };
    setTimeout(() => {
      const reply = getSofiaReply(t, context);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Sofia</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your diabetes companion — routine, meals, and support.</p>
      </div>

      <HowToUseBanner
        pageKey="sofia"
        steps={[
          "Type your question or tap a suggested topic to start the conversation.",
          "Sofia is your daily wellness companion — ask about meals, stress, sleep or habits.",
          "Conversations stay private on your device and are never uploaded.",
        ]}
      />

      <div className="glass-card flex-1 flex flex-col min-h-0 overflow-hidden">
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center shrink-0">
                  <HeartHandshake size={18} className="text-[var(--color-accent)]" aria-hidden />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-[var(--color-accent)] text-white ml-auto"
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
                <HeartHandshake size={18} className="text-[var(--color-accent)]" aria-hidden />
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-2.5 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="mx-4 mb-3 p-4 rounded-2xl border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/50">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">{EXPLANATION}</p>
          <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Start with a topic:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                disabled={isTyping}
                className="text-left text-sm px-4 py-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--color-border)]">
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
              className="shrink-0 w-12 h-[44px] rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none transition-opacity"
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
