import { Link } from "react-router-dom";

const IMG_HERO_BRAIN = "/alzheimer_impactante.png";
const IMG_BEFORE = "/senhora_lavando_roupa_vaso.png";
const IMG_AFTER = "/after_familia_feliz.png";
const IMG_PATRICIA = "/patricia_testimonial.png";
const IMG_DOCTOR = "/medico_shark_tank.png";

const STATS = [
  { value: "12,000+", label: "Users Worldwide" },
  { value: "89%", label: "Report Improvement by Week 6" },
  { value: "90", label: "Day Program" },
  { value: "4.9★", label: "Average Rating" },
];

const HOOKS_HERO = [
  "Don't wait until you forget a name — or worse.",
  "The damage starts 10–20 years before you notice. Act now.",
  "2 minutes to know your risk. Free. No commitment.",
];

const FEATURES = [
  {
    title: "Daily Memory Exercises",
    description: "Science-backed routines that strengthen recall, focus, and cognitive reserve in just 15 minutes a day.",
    icon: "🧠",
  },
  {
    title: "Dr. Marcus AI Coach",
    description: "Your personal AI physician available 24/7. Ask about memory, symptoms, or your program — get guidance and stay on track.",
    icon: "👨‍⚕️",
  },
  {
    title: "Progress Tracking",
    description: "Weekly cognitive scores, streak counters, and progress insights so you can see how your memory is improving.",
    icon: "📊",
  },
  {
    title: "Sofia — Memory Recall Companion",
    description: "Practice recalling past events with an AI that asks questions and gives gentle hints when you don't remember.",
    icon: "💬",
  },
  {
    title: "Brain-Friendly Nutrition",
    description: "Recipes, meal plans, and a shopping list designed to support memory and brain health — backed by research.",
    icon: "🥗",
  },
  {
    title: "Remember Where You Put Things",
    description: "Photo-based system to label where you store keys, glasses, and daily items so you never lose track again.",
    icon: "📷",
  },
  {
    title: "Learn Library",
    description: "Articles and guides on memory, cognitive health, and lifestyle habits that protect your brain.",
    icon: "📚",
  },
  {
    title: "Weekly Report",
    description: "Summary of your check-ins, exercises, and scores — plus insights to keep you motivated.",
    icon: "📈",
  },
];

const TESTIMONIALS = [
  {
    quote: "I was forgetting names and where I put my keys. Within 60 days my recall improved. My doctor said he'd never seen improvement like that.",
    author: "Patricia S., 58",
    location: "Miami, FL",
    badge: "+32 Memory Score in 90 Days",
  },
  {
    quote: "I was skeptical. By week 4 I was remembering conversations and appointments without writing everything down. This program gave me my confidence back.",
    author: "Robert M., 64",
    location: "Austin, TX",
    badge: "Regained Clarity After 2 Years",
  },
  {
    quote: "The daily exercises and Dr. Marcus made all the difference. I feel sharper at work and at home. My family noticed the change before I did.",
    author: "David K., 52",
    location: "Atlanta, GA",
    badge: "89% Improvement by Week 6",
  },
];

const FAQ_ITEMS = [
  { q: "Is NeuroSharp a substitute for medication or a doctor?", a: "No. NeuroSharp is a lifestyle and cognitive-training program. It does not replace medical advice, diagnosis, or treatment. Always consult your doctor for memory or health concerns." },
  { q: "How quickly will I see results?", a: "Many users report feeling more focused within 2–3 weeks. Meaningful memory and recall improvements often show by week 6–8 with consistent use. Results vary by individual." },
  { q: "Is my information private and secure?", a: "Yes. Your data is encrypted and stored securely. We do not share your health or usage data with third parties for marketing." },
  { q: "Do I need any equipment?", a: "No. You only need your phone or computer. The exercises are designed to be done anywhere in about 15 minutes a day." },
  { q: "What if the program doesn't work for me?", a: "We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund—no questions asked." },
  { q: "Is this suitable for people over 50?", a: "Yes. NeuroSharp is designed for adults who want to protect and improve memory, especially those 50+ who are proactive about cognitive health." },
];

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] app-bg text-[var(--color-text)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <Link to="/home" className="flex items-center gap-2 min-h-[44px] items-center touch-manipulation">
            <img src="/neurosharp-logo.png" alt="NeuroSharp" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
            <span className="font-display font-bold text-base sm:text-lg text-[var(--color-text)]">NeuroSharp</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/quiz"
              className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] min-h-[44px] flex items-center px-2 touch-manipulation"
            >
              Free Assessment
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold px-3 sm:px-4 py-2.5 min-h-[44px] flex items-center rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] touch-manipulation active:scale-[0.98] transition-transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-[env(safe-area-inset-bottom,0px)]">
        {/* Hero — with image and aggressive hooks */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-accent-soft),transparent)] pointer-events-none" />
          <div className="relative grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-xs sm:text-sm font-semibold text-[var(--color-accent)] mb-2 sm:mb-3 uppercase tracking-wider">
                Trusted by 12,000+ Users Worldwide
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-5">
                Restore Your Memory.
                <br />
                <span className="gradient-text">Reclaim Your Clarity.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed">
                The science-backed 90-day program that helps you strengthen recall and cognitive health — no pills, no embarrassment.
              </p>
              <ul className="text-left max-w-md mx-auto lg:mx-0 space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 text-[var(--color-text-muted)] text-xs sm:text-sm">
                {HOOKS_HERO.map((hook) => (
                  <li key={hook} className="flex items-start gap-2">
                    <span className="text-[var(--color-accent)] shrink-0">⚠</span>
                    <span>{hook}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4">
                <Link
                  to="/quiz"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-base sm:text-lg shadow-lg hover:opacity-95 transition-opacity border-2 border-transparent hover:border-[var(--color-accent-hover)] touch-manipulation active:scale-[0.98]"
                >
                  <span aria-hidden>🔥</span> Take the Free Assessment — 2 Min
                </Link>
                <Link
                  to="/advertorial"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3.5 sm:py-4 min-h-[52px] rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-colors touch-manipulation active:scale-[0.98]"
                >
                  Read the Science
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                100% private · 7-day money-back guarantee · Cancel anytime
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl max-w-md w-full aspect-[4/3] bg-[var(--color-card)]">
                <img
                  src={IMG_HERO_BRAIN}
                  alt="Brain health and memory — act before it's too late"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm font-medium">
                  Early action can slow or reverse decline. Don&apos;t wait.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency strip */}
        <section className="border-y border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/30 py-2.5 sm:py-3">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] px-1">
              🧠 Free assessment in 2 minutes — find out your cognitive risk. No credit card. <Link to="/quiz" className="text-[var(--color-accent)] underline hover:no-underline">Start now →</Link>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
          <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-accent)]">{s.value}</div>
                  <div className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Inside */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">What's Inside</h2>
          <p className="text-center text-[var(--color-text-muted)] max-w-2xl mx-auto mb-3 sm:mb-4 text-sm sm:text-base">
            A complete system designed by doctors and engineers for real, lasting results.
          </p>
          <p className="text-center text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-8 sm:mb-12">
            Stop guessing. Start your free assessment and get a personalized plan in 2 minutes.
          </p>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{f.icon}</div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text)] mb-1.5 sm:mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]"
            >
              Yes, I Want to Improve My Memory — Start Free
            </Link>
          </div>
        </section>

        {/* Before & After — transformation */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-2">The 90-Day Transformation</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-6 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Real people who took control of their cognitive health. The window to act is now — don&apos;t wait until you notice decline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl">
              <img src={IMG_BEFORE} alt="Before — struggling with memory" className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-text)]">Before</p>
                <p className="text-xs text-[var(--color-text-muted)]">Forgetting names, losing keys, feeling foggy. It doesn&apos;t have to stay that way.</p>
              </div>
            </div>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--color-accent)]/40 shadow-xl">
              <img src={IMG_AFTER} alt="After — clarity and connection" className="w-full aspect-[4/3] object-cover" />
              <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-accent)]">After 90 Days</p>
                <p className="text-xs text-[var(--color-text-muted)]">Sharper recall, more confidence, better connection with family. Start your journey today.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              Take the Free Assessment — See Your Plan
            </Link>
          </div>
        </section>

        {/* The App */}
        <section className="bg-[var(--color-surface)]/50 border-y border-[var(--color-border)] py-10 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">The App</h2>
            <p className="text-base sm:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-10">
              Built for Privacy. Designed for Results.
            </p>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
              A premium dark-themed app that feels as private as your journal and as powerful as a personal cognitive coach.
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2">✓ All data encrypted and stored securely</li>
              <li className="flex items-center gap-2">✓ Works on phone, tablet, or desktop</li>
              <li className="flex items-center gap-2">✓ Daily reminders keep you on track</li>
              <li className="flex items-center gap-2">✓ Dark, discreet interface</li>
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">Real Transformations</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-3 sm:mb-4 max-w-2xl mx-auto text-sm sm:text-base">
            People who took control of their cognitive health. Individual results may vary.
          </p>
          <p className="text-center text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-6 sm:mb-10">
            Join them. Take the free assessment — 2 minutes. No credit card.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.author} className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--color-border)]">
                {i === 0 ? (
                  <div className="flex justify-center mb-4">
                    <img src={IMG_PATRICIA} alt={t.author} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-accent)]/50" />
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center text-2xl text-[var(--color-text-muted)] font-bold">
                      {t.author.charAt(0)}
                    </div>
                  </div>
                )}
                <p className="text-[var(--color-text)] mb-4 italic text-sm">&quot;{t.quote}&quot;</p>
                <p className="text-xs font-semibold text-[var(--color-accent)] mb-1">{t.badge}</p>
                <p className="text-sm font-medium text-[var(--color-text)]">{t.author}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.location}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              Start My Free Assessment Now
            </Link>
          </div>
        </section>

        {/* Guarantee */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 py-10 sm:py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Zero Risk</h2>
            <p className="text-base sm:text-xl text-[var(--color-text-muted)] mb-3 sm:mb-4">7-Day Money-Back Guarantee</p>
            <p className="text-[var(--color-text-muted)] mb-6">
              We're so confident in NeuroSharp that we offer a complete, no-questions-asked refund within the first 7 days. If you don't feel a difference, you pay nothing.
            </p>
            <ul className="text-left max-w-sm mx-auto space-y-2 text-sm text-[var(--color-text-muted)] mb-8">
              <li>✓ Full refund within 7 days</li>
              <li>✓ No questions asked</li>
              <li>✓ Cancel anytime after that</li>
            </ul>
            <p className="text-[var(--color-accent)] font-semibold text-xs sm:text-sm mb-4 sm:mb-6">Nothing to lose. Everything to gain. Start your free assessment below.</p>
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              Take the Free Assessment — 2 Min
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-3 sm:mb-4">FAQ</h2>
          <p className="text-center text-[var(--color-text-muted)] text-xs sm:text-sm mb-6 sm:mb-10">Still unsure? Take the free 2-minute assessment — no commitment.</p>
          <div className="space-y-4 sm:space-y-6">
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.q} className="glass-card p-4 sm:p-5 rounded-xl border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition-opacity touch-manipulation active:scale-[0.98]">
              Start Free Assessment
            </Link>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-[var(--color-surface)]/50 border-y border-[var(--color-border)] py-10 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8">Our Story</h2>
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="w-full max-w-[240px] mx-auto md:mx-0 md:w-64 shrink-0">
                <img src={IMG_DOCTOR} alt="Medical expertise behind NeuroSharp" className="w-full rounded-2xl border border-[var(--color-border)] shadow-lg aspect-square object-cover" />
                <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Built by doctors & engineers</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  NeuroSharp was built by doctors and engineers who refused to accept that memory decline is inevitable. Dr. Marcus Chen — a neurologist with experience at leading medical centers — saw too many patients who were told to &quot;wait and see&quot; or given a pill. The research showed that lifestyle, exercise, and structured cognitive training could slow or even reverse early decline. He partnered with clinical psychologists and Silicon Valley engineers to create a 90-day program that combines the precision of clinical science with the accessibility of a daily app.
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  Today, NeuroSharp has helped over 12,000 people across the world protect and improve their memory. Our team continues to refine the program based on real user outcomes. We believe everyone deserves access to evidence-based cognitive care.
                </p>
                <p className="text-[var(--color-accent)] font-semibold">Take the first step: free assessment, 2 minutes, no obligation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,var(--color-accent-soft),transparent)] pointer-events-none" />
          <div className="relative">
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-4xl mb-3 sm:mb-4">Your Sharpest Years Can Be Ahead of You</h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-3 sm:mb-4 max-w-2xl mx-auto">
              Don&apos;t wait until you notice the first signs. The best time to protect your memory is now.
            </p>
            <p className="text-[var(--color-text-muted)] mb-6 sm:mb-8 max-w-xl mx-auto text-xs sm:text-sm">
              Join 12,000+ who took control. Free assessment — 2 minutes. No credit card. 7-day money-back guarantee.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-10 py-4 sm:py-5 min-h-[52px] rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-bold text-base sm:text-lg shadow-lg hover:opacity-95 transition-opacity border-2 border-transparent hover:border-[var(--color-accent-hover)] touch-manipulation active:scale-[0.98]"
            >
              Yes — I Want to Test My Cognitive Health (Free)
            </Link>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-4 sm:mt-6">100% private · Cancel anytime</p>
          </div>
        </section>

        {/* Sign In / Already a member */}
        <section className="border-t border-[var(--color-border)] py-10 sm:py-16 bg-[var(--color-surface)]/30">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-lg sm:text-xl mb-3 sm:mb-4">Already a Member?</h2>
            <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mb-4 sm:mb-6">
              Access your personalized program, track your progress, and continue your journey.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 sm:px-8 py-3 min-h-[48px] rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-surface-hover)] transition-colors touch-manipulation active:scale-[0.98]"
            >
              Sign In to My Account
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] mt-6">
              Don&apos;t have an account? <Link to="/quiz" className="text-[var(--color-accent)] font-semibold hover:underline">Take the free assessment and start your program →</Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--color-text-muted)]">
          <Link to="/privacy" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Privacy</Link>
          <Link to="/terms" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Terms</Link>
          <Link to="/contact" className="hover:text-[var(--color-text)] py-2 touch-manipulation">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
