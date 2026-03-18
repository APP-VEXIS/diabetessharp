"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "../trpc";
import { playAnswerSound } from "../utils/sound";

interface QuizAnswers {
  demographics?: string;
  primary_concern?: string;
  symptom_severity?: string;
  memory_impact?: string;
  family_history?: string;
  current_habits?: string[];
  motivation?: string;
  goals?: string;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "demographics",
    question:
      "Hi! I'm Dr. Marcus, neuroscience specialist. First, what's your age range?",
    subtitle: "This helps me personalize the protocol for you.",
    type: "radio",
    options: [
      { value: "40-50", label: "40-50 years" },
      { value: "50-60", label: "50-60 years" },
      { value: "60-70", label: "60-70 years" },
      { value: "70+", label: "70+ years" },
    ],
    icon: "👤",
  },
  {
    id: 2,
    category: "primary_concern",
    question: "What is your MAIN concern about your memory?",
    subtitle: "Choose what bothers you most.",
    type: "radio",
    options: [
      { value: "forgetting_names", label: "Forgetting names and faces" },
      { value: "forgetting_tasks", label: "Forgetting tasks and appointments" },
      { value: "brain_fog", label: "Brain fog / Difficulty concentrating" },
      { value: "word_finding", label: "Difficulty finding words" },
      { value: "learning_new", label: "Difficulty learning new things" },
      { value: "alzheimer_prevention", label: "Alzheimer's / Dementia prevention" },
    ],
    icon: "🧠",
  },
  {
    id: 3,
    category: "symptom_severity",
    question: "How often do you experience these symptoms?",
    subtitle: "Be honest — this isn't judgment, it's diagnosis.",
    type: "radio",
    options: [
      { value: "occasional", label: "Occasionally (1-2x per week)" },
      { value: "frequent", label: "Frequently (3-5x per week)" },
      { value: "daily", label: "Daily" },
      { value: "severe", label: "Very severe (affects my life)" },
    ],
    icon: "📊",
  },
  {
    id: 4,
    category: "memory_impact",
    question: "How is this affecting your daily life?",
    subtitle: "Work, relationships, confidence?",
    type: "radio",
    options: [
      { value: "minimal", label: "Minimal impact" },
      { value: "moderate", label: "Moderate impact (affects some activities)" },
      { value: "significant", label: "Significant impact (affects many activities)" },
      { value: "severe", label: "Severe impact (affects my work/relationships)" },
    ],
    icon: "💼",
  },
  {
    id: 5,
    category: "family_history",
    question: "Do you have a family history of Alzheimer's or dementia?",
    subtitle: "This is important for risk assessment.",
    type: "radio",
    options: [
      { value: "no", label: "No" },
      { value: "distant", label: "Yes, distant relative (aunt, uncle, cousin)" },
      { value: "parent", label: "Yes, a parent" },
      { value: "multiple", label: "Yes, multiple family members" },
    ],
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: 6,
    category: "current_habits",
    question:
      "Which of these habits do you practice regularly? (Select all that apply)",
    subtitle: "These factors affect your cognitive health.",
    type: "checkbox",
    options: [
      { value: "exercise", label: "🏃 Regular physical exercise (3+ times/week)" },
      { value: "sleep", label: "😴 Sleep 7-9 hours per night" },
      { value: "meditation", label: "🧘 Meditation or mindfulness" },
      { value: "social", label: "👥 Regular social interaction" },
      { value: "learning", label: "📚 Continuous learning (courses, reading)" },
      { value: "diet", label: "🥗 Healthy diet (Mediterranean/MIND)" },
    ],
    icon: "✅",
  },
  {
    id: 7,
    category: "motivation",
    question: "What's your motivation level to regain your memory?",
    subtitle: "Honesty here is crucial.",
    type: "radio",
    options: [
      { value: "curious", label: "Curious, but not urgent" },
      { value: "motivated", label: "Motivated — I want to improve" },
      { value: "very_motivated", label: "Very motivated — this matters to me" },
      { value: "desperate", label: "I need help now" },
    ],
    icon: "🔥",
  },
  {
    id: 8,
    category: "goals",
    question: "What's your main goal for the next 90 days?",
    subtitle: "What do you want to achieve?",
    type: "radio",
    options: [
      { value: "basic_improvement", label: "Improve memory in general" },
      { value: "work_performance", label: "Improve performance at work" },
      { value: "family_time", label: "Be more present with family" },
      { value: "prevent_decline", label: "Prevent cognitive decline" },
      { value: "full_recovery", label: "Full memory recovery" },
    ],
    icon: "🎯",
  },
];

function calculateCognitiveScore(answers: QuizAnswers): number {
  let score = 100;

  if (answers.demographics === "70+") score -= 15;
  else if (answers.demographics === "60-70") score -= 10;
  else if (answers.demographics === "50-60") score -= 5;

  if (answers.symptom_severity === "severe") score -= 25;
  else if (answers.symptom_severity === "daily") score -= 20;
  else if (answers.symptom_severity === "frequent") score -= 15;
  else if (answers.symptom_severity === "occasional") score -= 5;

  if (answers.memory_impact === "severe") score -= 20;
  else if (answers.memory_impact === "significant") score -= 15;
  else if (answers.memory_impact === "moderate") score -= 10;

  if (answers.family_history === "multiple") score -= 15;
  else if (answers.family_history === "parent") score -= 10;
  else if (answers.family_history === "distant") score -= 5;

  if (Array.isArray(answers.current_habits)) {
    score += answers.current_habits.length * 3;
  }

  return Math.max(0, Math.min(100, score));
}

function getRiskLevel(score: number): {
  level: string;
  color: string;
  message: string;
  barClass: string;
  bgClass: string;
  borderClass: string;
  titleClass: string;
  textClass: string;
} {
  if (score >= 80)
    return {
      level: "Low Risk",
      color: "green",
      message: "Your cognitive health is in good shape.",
      barClass: "bg-green-500",
      bgClass: "bg-green-50",
      borderClass: "border-green-500",
      titleClass: "text-green-900",
      textClass: "text-green-700",
    };
  if (score >= 60)
    return {
      level: "Moderate Risk",
      color: "yellow",
      message: "You may benefit from preventive intervention.",
      barClass: "bg-yellow-500",
      bgClass: "bg-yellow-50",
      borderClass: "border-yellow-500",
      titleClass: "text-yellow-900",
      textClass: "text-yellow-700",
    };
  if (score >= 40)
    return {
      level: "Elevated Risk",
      color: "orange",
      message: "Immediate action is recommended.",
      barClass: "bg-orange-500",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-500",
      titleClass: "text-orange-900",
      textClass: "text-orange-700",
    };
  return {
    level: "High Risk",
    color: "red",
    message: "You're an ideal candidate for NeuroSharp.",
    barClass: "bg-red-500",
    bgClass: "bg-red-50",
    borderClass: "border-red-500",
    titleClass: "text-red-900",
    textClass: "text-red-700",
  };
}

function mapAnswersToBackend(answers: QuizAnswers): {
  age: number;
  primaryConcern: string;
  symptomSeverity: string;
  familyHistory: boolean;
  currentHabits: string;
  motivationLevel: string;
} {
  const ageMap: Record<string, number> = {
    "40-50": 45,
    "50-60": 55,
    "60-70": 65,
    "70+": 75,
  };
  const severityMap: Record<string, string> = {
    severe: "diagnosed",
    daily: "noticeable",
    frequent: "frequent",
    occasional: "occasional",
  };
  return {
    age: ageMap[answers.demographics ?? "50-60"] ?? 55,
    primaryConcern: answers.primary_concern ?? "memory_loss",
    symptomSeverity:
      severityMap[answers.symptom_severity ?? "occasional"] ?? "occasional",
    familyHistory: answers.family_history !== "no" && !!answers.family_history,
    currentHabits: Array.isArray(answers.current_habits)
      ? answers.current_habits.join(",")
      : "none",
    motivationLevel: answers.motivation ?? "moderately_motivated",
  };
}

export function Quiz() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [cognitiveScore, setCognitiveScore] = useState(0);
  const [leadData, setLeadData] = useState({ firstName: "", lastName: "", email: "" });
  const leadDataRef = useRef(leadData);
  leadDataRef.current = leadData;
  const confettiFired = useRef(false);

  useEffect(() => {
    if (showResults) {
      const prev = document.title;
      document.title = "Checkout — NeuroSharp | Your Cognitive Profile";
      return () => {
        document.title = prev;
      };
    }
  }, [showResults]);

  useEffect(() => {
    if (!showResults || confettiFired.current) return;
    confettiFired.current = true;
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [showResults]);

  const submitQuiz = trpc.funnel.submitQuiz.useMutation();

  const handleAnswer = (category: keyof QuizAnswers, value: string | string[]) => {
    playAnswerSound();
    setAnswers((prev) => ({ ...prev, [category]: value }));
  };

  const handleNext = async () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = leadData.firstName.trim();
    const last = leadData.lastName.trim();
    const email = leadData.email.trim();
    if (!first || !last || !email) return;
    setShowLeadForm(false);
    setIsProcessing(true);
    (async () => {
      await new Promise((r) => setTimeout(r, 2000));
      const score = calculateCognitiveScore(answers);
      setCognitiveScore(score);
      setIsProcessing(false);
      setShowResults(true);
    })();
  };

  const createCarpandaOrder = trpc.funnel.createCarpandaOrder.useMutation();
  const isRedirecting = createCarpandaOrder.isPending;

  const handleStartRecovery = async () => {
    const lead = leadDataRef.current;
    if (!lead.firstName?.trim() || !lead.lastName?.trim() || !lead.email?.trim()) return;
    try {
      const payload = mapAnswersToBackend(answers);
      const quizData = await submitQuiz.mutateAsync(payload);
      const orderData = await createCarpandaOrder.mutateAsync({
        firstName: lead.firstName.trim(),
        lastName: lead.lastName.trim(),
        email: lead.email.trim(),
        cognitiveProfile: "memory_loss",
        symptomSeverity: payload.symptomSeverity,
        familyHistory: payload.familyHistory,
        quizSessionId: quizData.sessionId,
        cognitiveRiskScore: quizData.cognitiveRiskScore,
        discountApplied: 20,
        refCode: searchParams.get("ref") ?? undefined,
      });
      window.location.href = orderData.url;
    } catch {
      // Error surfaced by mutation; button stays enabled for retry
    }
  };

  if (showLeadForm) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6 sm:py-12 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md w-full">
          <Card className="p-5 sm:p-8 shadow-lg">
            <div className="text-center mb-5 sm:mb-6">
              <span className="text-4xl mb-3 sm:mb-4 block">👨‍⚕️</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                One last step before your results
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your details to see your personalized cognitive profile and recommendation.
              </p>
            </div>
            <form onSubmit={handleLeadSubmit} className="space-y-4" data-form="lead-no-age">
              <p className="text-xs text-gray-500 -mt-1">
                Just tell us your name and email so we can prepare your personalized report.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={leadData.firstName}
                    onChange={(e) => setLeadData((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={leadData.lastName}
                    onChange={(e) => setLeadData((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={leadData.email}
                  onChange={(e) => setLeadData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none touch-manipulation"
                  placeholder="your@email.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full min-h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 text-base rounded-xl touch-manipulation active:scale-[0.98] transition-transform"
              >
                See my results
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your data is confidential and will only be used to send your results and personalized recommendation.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing your answers...
          </h2>
          <p className="text-gray-600">
            Dr. Marcus is calculating your personalized cognitive profile.
          </p>
        </div>
      </div>
    );
  }


  // After processing, skip the in-app results page and send the user
  // straight to the premium checkout (where the offer and CTA live).
  if (showResults) {
    if (typeof window !== "undefined") {
      window.location.href = "/checkout-premium.html";
    }
    return null;
  }

  const question = QUIZ_QUESTIONS[currentStep];
  const currentValue = answers[question.category as keyof QuizAnswers];
  const isAnswered =
    question.type === "checkbox"
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== undefined && currentValue !== "";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-white rounded-full p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
            <span className="text-4xl sm:text-5xl">👨‍⚕️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Consultation with Dr. Marcus
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Personalized Cognitive Assessment — Under 30 seconds</p>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">
              Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-colors duration-300"
              style={{
                width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card className="p-5 sm:p-8 shadow-lg mb-5 sm:mb-6">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{question.icon}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
            {question.question}
          </h2>
          <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">{question.subtitle}</p>

          <div className="space-y-2 sm:space-y-3">
            {question.type === "radio" &&
              question.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center min-h-[48px] py-3 px-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation select-none"
                >
                  <input
                    type="radio"
                    name={question.category}
                    value={option.value}
                    checked={currentValue === option.value}
                    onChange={() =>
                      handleAnswer(question.category as keyof QuizAnswers, option.value)
                    }
                    className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 shrink-0"
                  />
                  <span className="ml-3 text-gray-900 font-medium text-sm sm:text-base">
                    {option.label}
                  </span>
                </label>
              ))}

            {question.type === "checkbox" &&
              question.options.map((option) => {
                const arr = (currentValue as string[] | undefined) ?? [];
                const checked = arr.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center min-h-[48px] py-3 px-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation select-none"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={checked}
                      onChange={() => {
                        const updated = checked
                          ? arr.filter((v) => v !== option.value)
                          : [...arr, option.value];
                        handleAnswer(
                          question.category as keyof QuizAnswers,
                          updated
                        );
                      }}
                      className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 shrink-0"
                    />
                    <span className="ml-3 text-gray-900 font-medium text-sm sm:text-base">
                      {option.label}
                    </span>
                  </label>
                );
              })}
          </div>
        </Card>

        <div className="flex gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex-1 min-h-[48px] text-sm sm:text-base touch-manipulation rounded-xl"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base touch-manipulation rounded-xl active:scale-[0.98] transition-transform"
          >
            {currentStep === QUIZ_QUESTIONS.length - 1
              ? "See Results"
              : "Next →"}
          </Button>
        </div>

        <p className="text-center mt-5 sm:mt-6 text-sm font-medium text-gray-700 px-4 py-3 bg-amber-50 border-l-4 border-amber-500 rounded-r">
          {[
            "55+ million people worldwide live with dementia. Know your risk in 30 seconds.",
            "1 in 3 seniors dies with Alzheimer's or another dementia. Early action matters.",
            "12–18% of adults over 65 already have mild cognitive impairment. Most don't know it.",
            "By 2050, 152 million people could have dementia globally. Don't wait to check.",
            "10–15% of people with mild cognitive impairment progress to dementia every year.",
            "6.5 million Americans 65+ have Alzheimer's. Millions more have undiagnosed memory loss.",
            "Brain changes from Alzheimer's can start 10–20 years before symptoms appear.",
            "11 million Americans are unpaid caregivers for someone with memory loss. You're not alone.",
          ][currentStep]}
        </p>
      </div>
    </div>
  );
}
