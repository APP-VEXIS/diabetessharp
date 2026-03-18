import { useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";
import {
  MEMORY_RECIPES,
  MEAL_PLAN_7_DAY,
  SHOPPING_LIST_ITEMS,
  type MealType,
  type MemoryRecipe,
} from "../../data/memoryRecipes";
import { CHECKLIST_BY_MEAL } from "../../data/nutritionChecklist";
import { getRecipeImageUrl } from "../../assets/recipeImages";

const TABS = [
  { id: "recipes", label: "Recipes", icon: "🍽️" },
  { id: "mealplan", label: "Meal Plan", icon: "📅" },
  { id: "shopping", label: "Shopping", icon: "🛒" },
  { id: "checklist", label: "Checklist", icon: "✅" },
  { id: "ai", label: "AI Recipe", icon: "✨" },
  { id: "today", label: "Today", icon: "🕐" },
  { id: "history", label: "History", icon: "📊" },
];

const MEAL_FILTERS: { value: MealType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snacks" },
];

function RecipeDetail({ recipe, onClose }: { recipe: MemoryRecipe; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[var(--color-text)]">{recipe.title}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]" aria-label="Close">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] capitalize">{recipe.mealType}</span>
            <span className="px-2 py-0.5 rounded bg-[var(--color-accent-soft)] text-[var(--color-accent)]">🕐 {recipe.prepTime}</span>
            <span className="text-[var(--color-text-muted)]">🔥 {recipe.kcal} kcal · ⚡ {recipe.protein} protein</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">{recipe.desc}</p>
          <p className="text-xs text-[var(--color-accent)]">{recipe.benefits}</p>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-sm text-[var(--color-text-muted)] space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing.amount ? `${ing.amount} ${ing.name}` : ing.name}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <h4 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Ingredient tips</h4>
            <p className="text-xs text-[var(--color-text-muted)]">{recipe.ingredientTips}</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <h4 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Quick prep</h4>
            <p className="text-xs text-[var(--color-text-muted)]">{recipe.quickPrepTip}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Steps</h4>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--color-text)]">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-text)] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mock AI: match user ingredients to a recipe by keywords. */
function suggestRecipeFromIngredients(text: string): MemoryRecipe | null {
  const lower = text.toLowerCase().replace(/,/g, " ").split(/\s+/).filter(Boolean);
  if (lower.length === 0) return null;
  let best: { recipe: MemoryRecipe; score: number } | null = null;
  for (const recipe of MEMORY_RECIPES) {
    let score = 0;
    for (const word of lower) {
      if (recipe.keywords.some((k) => k.includes(word) || word.includes(k))) score++;
    }
    if (score > 0 && (!best || score > best.score)) best = { recipe, score };
  }
  return best?.recipe ?? null;
}

/** Mock estimate from "analyzed" dish image. In production you'd call a nutrition vision API. */
function estimateCaloriesFromImage(): { calories: number; protein: number } {
  const calories = 250 + Math.floor(Math.random() * 350);
  const protein = 8 + Math.floor(Math.random() * 22);
  return { calories, protein };
}

export function NutritionPage() {
  const [activeTab, setActiveTab] = useState("recipes");
  const [mealFilter, setMealFilter] = useState<MealType | "all">("all");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shoppingChecked, setShoppingChecked] = useState<Record<string, boolean>>({});
  const [customShoppingItems, setCustomShoppingItems] = useState<string[]>([]);
  const [customShoppingChecked, setCustomShoppingChecked] = useState<Record<number, boolean>>({});
  const [newShoppingItem, setNewShoppingItem] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState<MemoryRecipe | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayProtein, setTodayProtein] = useState(0);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [analyzeImage, setAnalyzeImage] = useState<string | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<{ calories: number; protein: number } | null>(null);
  const photoInputId = "nutrition-analyze-photo-input";

  const filteredRecipes = mealFilter === "all" ? MEMORY_RECIPES : MEMORY_RECIPES.filter((r) => r.mealType === mealFilter);
  const selectedRecipe = selectedRecipeId ? MEMORY_RECIPES.find((r) => r.id === selectedRecipeId) : null;

  const toggleCheck = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleShopping = (id: string) => setShoppingChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCustomShopping = (index: number) => setCustomShoppingChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  const addCustomItem = () => {
    const t = newShoppingItem.trim();
    if (!t) return;
    setCustomShoppingItems((prev) => [...prev, t]);
    setNewShoppingItem("");
  };
  const removeCustomItem = (index: number) => {
    setCustomShoppingItems((prev) => prev.filter((_, i) => i !== index));
    setCustomShoppingChecked((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const openPrintShoppingList = () => {
    const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const byCategory = SHOPPING_LIST_ITEMS.reduce<Record<string, string[]>>((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item.name);
      return acc;
    }, {});
    const customList = customShoppingItems.map(esc);
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Shopping List - NeuroSharp</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; color: #1a1a1a; }
  h1 { font-size: 1.5rem; margin-bottom: 8px; }
  .sub { color: #666; font-size: 0.875rem; margin-bottom: 24px; }
  section { margin-bottom: 20px; }
  h2 { font-size: 1rem; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { padding: 6px 0; display: flex; align-items: center; gap: 10px; }
  li::before { content: "☐"; font-size: 1.1rem; }
  @media print { body { padding: 16px; } }
</style></head><body>
  <h1>🛒 Shopping List</h1>
  <p class="sub">NeuroSharp – Memory support meal plan. Check off as you shop.</p>
  ${Object.entries(byCategory).map(([cat, names]) => `
  <section><h2>${esc(cat)}</h2><ul>${names.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>`).join("")}
  ${customList.length ? `<section><h2>My items</h2><ul class="my-items">${customList.map((n) => `<li>${n}</li>`).join("")}</ul></section>` : ""}
  <script>window.onload=function(){setTimeout(function(){window.print();},250);}</script>
</body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleGenerateRecipe = () => {
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const recipe = suggestRecipeFromIngredients(aiInput);
      setAiResult(recipe);
      setAiLoading(false);
    }, 600);
  };

  const getRecipeById = (id: string) => MEMORY_RECIPES.find((r) => r.id === id);

  const closeAnalyzeModal = () => {
    setAnalyzeOpen(false);
    setAnalyzeImage(null);
    setAnalyzeLoading(false);
    setAnalyzeResult(null);
    const input = document.getElementById(photoInputId) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const onPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAnalyzeOpen(true);
    setAnalyzeResult(null);
    setAnalyzeLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAnalyzeImage(reader.result as string);
      setTimeout(() => {
        setAnalyzeResult(estimateCaloriesFromImage());
        setAnalyzeLoading(false);
      }, 1800);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addAnalysisToToday = () => {
    if (analyzeResult) {
      setTodayCalories((c) => c + analyzeResult.calories);
      setTodayProtein((p) => p + analyzeResult.protein);
    }
    closeAnalyzeModal();
  };

  const shoppingByCategory = SHOPPING_LIST_ITEMS.reduce<Record<string, typeof SHOPPING_LIST_ITEMS>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Nutrition</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Memory-friendly recipes, meal plan, and shopping list.</p>
        </div>
        <input
          id={photoInputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          aria-label="Select or take a photo of your dish"
          onChange={onPhotoSelected}
        />
        <label
          htmlFor={photoInputId}
          className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span aria-hidden>📷</span> Analyze Photo
        </label>
      </div>

      {/* Analyze Photo modal — only after a photo was selected */}
      {analyzeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAnalyzeModal} role="dialog" aria-modal="true" aria-labelledby="analyze-photo-title">
          <div
            className="glass-card max-h-[90vh] w-full max-w-md overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
              <h2 id="analyze-photo-title" className="font-display font-bold text-lg text-[var(--color-text)]">Analyze dish photo</h2>
              <button type="button" onClick={closeAnalyzeModal} className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]" aria-label="Close">✕</button>
            </div>
            <div className="p-4 space-y-4">
              {!analyzeImage && (
                <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">Loading photo…</p>
              )}
              {analyzeImage && (
                <>
                  <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-black aspect-video">
                    <img src={analyzeImage} alt="Your dish" className="w-full h-full object-contain" />
                  </div>
                  {analyzeLoading && (
                    <div className="flex flex-col items-center gap-2 py-4 text-[var(--color-text-muted)] text-sm">
                      <span className="inline-block w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" aria-hidden />
                      Analyzing your dish…
                    </div>
                  )}
                  {analyzeResult && !analyzeLoading && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-center">
                          <div className="text-2xl font-display font-bold text-[var(--color-accent)]">{analyzeResult.calories}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">Est. calories</div>
                        </div>
                        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-center">
                          <div className="text-2xl font-display font-bold text-[var(--color-accent)]">{analyzeResult.protein}g</div>
                          <div className="text-xs text-[var(--color-text-muted)]">Est. protein</div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">This is an estimate. Add these values to your daily totals?</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={addAnalysisToToday} className="flex-1 btn btn-primary py-3">
                          Add to today
                        </button>
                        <button type="button" onClick={closeAnalyzeModal} className="flex-1 btn btn-secondary py-3">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <HowToUseBanner
        pageKey="ns-nutrition"
        steps={[
          "Browse the tabs: Recipes, Meal Plan, and Shopping List.",
          "Take a food photo to get an AI estimate of calories and brain-health nutrients.",
          "Brain-friendly recipes are rich in omega-3, antioxidants and anti-inflammatory foods.",
        ]}
      />

      {/* Weekly recipes update notice */}
      <div className="mb-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/20 px-4 py-3 flex flex-wrap items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>🔄</span>
        <div>
          <p className="font-semibold text-[var(--color-text)] text-sm">New recipes every week</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            We update our recipe collection every week so you always have fresh, brain-friendly ideas. Check back regularly for new dishes and tips.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-lg mb-0.5">🔥</div>
          <div className="font-display font-bold text-lg text-[var(--color-text)]">{todayCalories}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">Today&apos;s Calories</div>
        </div>
        <div className="glass-card p-4 text-center">
          
          <div className="font-display font-bold text-lg text-[var(--color-text)]">{todayProtein}g</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">Protein</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-lg mb-0.5">✅</div>
          <div className="font-display font-bold text-lg text-[var(--color-text)]">{Object.values(checked).filter(Boolean).length}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">Checklist</div>
        </div>
      </div>

      <div className="flex items-stretch justify-center gap-1 pb-2 mb-4 flex-nowrap overflow-x-auto scrollbar-hide min-h-[64px]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            aria-label={tab.label}
            className={`shrink-0 flex flex-col items-center justify-center min-w-[56px] w-14 py-2 rounded-xl transition-colors ${
              activeTab === tab.id ? "nav-active text-[var(--color-accent-text)]" : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <span className="text-xl leading-none mb-1" aria-hidden>{tab.icon}</span>
            <span className="text-[10px] font-medium leading-tight text-center max-w-full truncate px-0.5">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Recipes */}
      {activeTab === "recipes" && (
        <>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">Tap a recipe for full steps, ingredient tips, and quick prep. Prep time shown for each.</p>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {MEAL_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setMealFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  mealFilter === f.value ? "nav-active text-[var(--color-accent-text)]" : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredRecipes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRecipeId(r.id)}
                className="glass-card overflow-hidden hover:border-[var(--color-accent)]/40 transition-colors text-left"
              >
                <div className="p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden flex items-center justify-center shrink-0">
                    {getRecipeImageUrl(r.id) && <img src={getRecipeImageUrl(r.id)} alt={r.title} className="w-full h-full object-cover" />}
                    {!getRecipeImageUrl(r.id) && <span className="w-full h-full flex items-center justify-center text-2xl bg-[var(--color-accent-soft)]" aria-hidden>🍽️</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--color-text)]">{r.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] capitalize">{r.mealType}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{r.desc}</p>
                    <p className="text-[10px] text-[var(--color-accent)] mt-1">{r.benefits}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-[var(--color-text-muted)]">
                      <span>🕐 <strong>{r.prepTime}</strong></span>
                      <span>🔥 {r.kcal} kcal</span>
                      <span>⚡ {r.protein} prot</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Meal Plan */}
      {activeTab === "mealplan" && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            7-day meal program for memory support. Each meal uses recipes from our list—tap to see full instructions.
          </p>
          {MEAL_PLAN_7_DAY.map((day) => (
            <div key={day.day} className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 font-semibold text-[var(--color-text)]">
                Day {day.day}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 p-4">
                <MealRow label="Breakfast" recipeId={day.breakfast} getRecipe={getRecipeById} onSelect={setSelectedRecipeId} />
                <MealRow label="Lunch" recipeId={day.lunch} getRecipe={getRecipeById} onSelect={setSelectedRecipeId} />
                <MealRow label="Dinner" recipeId={day.dinner} getRecipe={getRecipeById} onSelect={setSelectedRecipeId} />
                <MealRow label="Snack" recipeId={day.snack} getRecipe={getRecipeById} onSelect={setSelectedRecipeId} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shopping List */}
      {activeTab === "shopping" && (
        <div className="space-y-4">
          {/* Instructions */}
          <div className="glass-card p-4 border-l-4 border-[var(--color-accent)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">How to use this list</h3>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
              <li>Check off each item as you add it to your cart at the store.</li>
              <li>Add your own items below if you need something not on the list.</li>
              <li>Use <strong>Print / Save as PDF</strong> to take the list with you or print it.</li>
              <li>In the print window, choose &quot;Save as PDF&quot; to download a PDF, or print on paper.</li>
            </ul>
          </div>

          {/* Download PDF */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPrintShoppingList}
              className="btn btn-primary text-sm"
            >
              <span className="text-lg">📄</span>
              <span>Download your list as PDF here</span>
            </button>
          </div>

          {/* Add your own items */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Add your own items</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">Type an item and tap Add to include it in your list and in the printable PDF.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newShoppingItem}
                onChange={(e) => setNewShoppingItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
                placeholder="e.g. dish soap, paper towels"
                className="input-field flex-1 min-h-[44px]"
              />
              <button
                type="button"
                onClick={addCustomItem}
                disabled={!newShoppingItem.trim()}
                className="shrink-0 px-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-hover)] disabled:opacity-50 min-h-[44px]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Predefined list by category */}
          {Object.entries(shoppingByCategory).map(([category, items]) => (
            <div key={category} className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 font-semibold text-[var(--color-text)]">
                {category}
              </div>
              <ul className="divide-y divide-[var(--color-border)]">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleShopping(item.id)}
                      className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        shoppingChecked[item.id] ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]" : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      {shoppingChecked[item.id] && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`text-sm ${shoppingChecked[item.id] ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]"}`}>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* My items */}
          {customShoppingItems.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 font-semibold text-[var(--color-text)]">
                My items
              </div>
              <ul className="divide-y divide-[var(--color-border)]">
                {customShoppingItems.map((name, index) => (
                  <li key={index} className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleCustomShopping(index)}
                      className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        customShoppingChecked[index] ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]" : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      {customShoppingChecked[index] && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${customShoppingChecked[index] ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]"}`}>
                      {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCustomItem(index)}
                      className="shrink-0 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Food Checklist */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            Check off memory-friendly foods as you eat them. Aim for variety across breakfast, lunch, dinner, and snacks.
          </p>
          {CHECKLIST_BY_MEAL.map((section) => (
            <div key={section.meal} className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 flex items-center gap-2">
                <span className="text-lg">
                  {section.meal === "breakfast" ? "🌅" : section.meal === "lunch" ? "☀️" : section.meal === "dinner" ? "🌙" : "🥜"}
                </span>
                <h3 className="font-semibold text-[var(--color-text)]">{section.label}</h3>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                  {section.items.filter((i) => checked[i.id]).length}/{section.items.length}
                </span>
              </div>
              <ul className="divide-y divide-[var(--color-border)]">
                {section.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-card-hover)]/50 transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleCheck(item.id)}
                      className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        checked[item.id] ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]" : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      {checked[item.id] && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className={`text-sm font-medium ${checked[item.id] ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]"}`}>{item.name}</span>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.benefit}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* AI Recipe Generator */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            List ingredients you have at home (e.g. eggs, avocado, salmon, oats). We&apos;ll suggest a memory-friendly recipe you can make.
          </p>
          <div className="glass-card p-4 space-y-3">
            <label className="block text-sm font-medium text-[var(--color-text)]">Ingredients I have</label>
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g. eggs, avocado, bread, salmon, oats, blueberries"
              className="input-field w-full min-h-[44px]"
            />
            <button
              type="button"
              onClick={handleGenerateRecipe}
              disabled={!aiInput.trim() || aiLoading}
              className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-text)] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-[var(--color-accent-text)] border-t-transparent animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate recipe</>
              )}
            </button>
          </div>
          {aiResult && (
            <div className="glass-card overflow-hidden">
              <div className="px-4 py-2 border-b border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                Suggested recipe based on your ingredients
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[var(--color-text)]">{aiResult.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{aiResult.desc}</p>
                <p className="text-xs text-[var(--color-accent)] mt-1">🕐 {aiResult.prepTime} · {aiResult.benefits}</p>
                <button
                  type="button"
                  onClick={() => { setSelectedRecipeId(aiResult.id); setAiResult(null); }}
                  className="mt-3 text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  See full recipe (steps & tips) →
                </button>
              </div>
            </div>
          )}
          {!aiResult && !aiLoading && aiInput.trim() && (
            <p className="text-xs text-[var(--color-text-muted)]">Try adding more ingredients (e.g. salmon, oats, spinach) for a better match.</p>
          )}
        </div>
      )}

      {(activeTab === "today" || activeTab === "history") && (
        <div className="glass-card p-8 text-center text-[var(--color-text-muted)] text-sm">
          {activeTab === "today" && "Log your meals here or use the checklist to track memory-friendly foods."}
          {activeTab === "history" && "Your nutrition history will appear here."}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipeId(null)} />
      )}
    </div>
  );
}

function MealRow({
  label,
  recipeId,
  getRecipe,
  onSelect,
}: {
  label: string;
  recipeId: string;
  getRecipe: (id: string) => MemoryRecipe | undefined;
  onSelect: (id: string) => void;
}) {
  const recipe = getRecipe(recipeId);
  return (
    <button
      type="button"
      onClick={() => recipe && onSelect(recipeId)}
      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 text-left transition-colors"
    >
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--color-text)] truncate">{recipe?.title ?? "—"}</span>
      {recipe && <span className="text-[var(--color-accent)] shrink-0">→</span>}
    </button>
  );
}
