import { Link, NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../trpc";

const THEME_KEY = "neurosharp_theme";
const FONT_SIZE_KEY = "neurosharp_font_size";
type Theme = "dark" | "light";
type FontSize = "normal" | "large";

function getStoredTheme(): Theme {
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === "light" || s === "dark") return s;
  } catch {}
  return "dark";
}

function getStoredFontSize(): FontSize {
  try {
    const s = localStorage.getItem(FONT_SIZE_KEY);
    if (s === "large" || s === "normal") return s;
  } catch {}
  return "normal";
}
import {
  IconHome,
  IconExercises,
  IconDrMarcus,
  IconNutrition,
  IconProgress,
  IconLearn,
  IconReport,
  IconPhotos,
  IconSofia,
  IconProfile,
  IconSettings,
  IconLogout,
} from "./NavIcons";
import { useAddToHomeScreen } from "./AddToHomeScreen";

const NAV_ITEMS = [
  { path: "/app/dashboard", label: "Dashboard", Icon: IconHome },
  { path: "/app/exercises", label: "Exercises", Icon: IconExercises },
  { path: "/app/dr-marcus", label: "Dr. Marcus", Icon: IconDrMarcus },
  { path: "/app/nutrition", label: "Nutrition", Icon: IconNutrition },
  { path: "/app/progress", label: "Progress", Icon: IconProgress },
  { path: "/app/learn", label: "Learn", Icon: IconLearn },
  { path: "/app/weekly-report", label: "Report", Icon: IconReport },
  { path: "/app/photos", label: "Photos", Icon: IconPhotos },
  { path: "/app/sofia", label: "Sofia", Icon: IconSofia },
  { path: "/app/profile", label: "Profile", Icon: IconProfile },
  { path: "/app/settings", label: "Settings", Icon: IconSettings },
];

// Bottom nav: main 4 + Photos so the Photos link is reachable on mobile
const BOTTOM_NAV_ITEMS = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[1], // Exercises
  NAV_ITEMS[2], // Dr. Marcus
  NAV_ITEMS[3], // Nutrition
  NAV_ITEMS[7], // Photos
];

function SidebarNavLink({ path, label, Icon }: { path: string; label: string; Icon: React.ComponentType }) {
  return (
    <NavLink
      to={path}
      end={false}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[44px] w-full text-left border border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-elevated)] ${
          isActive
            ? "nav-active text-[var(--color-accent-text)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
        }`
      }
      aria-current={undefined}
    >
      {({ isActive }) => (
        <>
          <span className="w-7 shrink-0 flex items-center justify-center [&_svg]:shrink-0 [&_svg]:text-current" aria-hidden>
            <Icon />
          </span>
          <span className="flex-1">{label}</span>
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-text)] opacity-80 shrink-0" aria-hidden />
          )}
        </>
      )}
    </NavLink>
  );
}

function BottomNavItem({ path, label, Icon }: { path: string; label: string; Icon: React.ComponentType }) {
  return (
    <NavLink
      to={path}
      end={false}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center gap-1 min-h-[56px] min-w-[44px] flex-1 rounded-2xl transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card)] ${
          isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] active:opacity-80"
        }`
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-opacity duration-200"
              style={{ background: "var(--color-accent)" }}
              aria-hidden
            />
          )}
          <span className="flex items-center justify-center [&_svg]:w-6 [&_svg]:h-6 [&_svg]:text-current" aria-hidden>
            <Icon />
          </span>
          <span className="text-[10px] font-semibold truncate max-w-full px-0.5">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [fontSize, setFontSize] = useState<FontSize>(getStoredFontSize);
  const [showAddToPhoneHint, setShowAddToPhoneHint] = useState(false);
  const { installPrompt, triggerInstall, isIOS, isStandalone } = useAddToHomeScreen();
  const { data: meData } = trpc.auth.me.useQuery(undefined, { retry: false });
  const isDemo = typeof window !== "undefined" && localStorage.getItem("neurosharp_token") === "demo";
  const userName =
    meData?.user?.email != null
      ? (meData.user as { name?: string }).name ?? meData.user.email.split("@")[0] ?? "User"
      : isDemo
        ? "Guest"
        : null;
  const displayName = userName ?? "User";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    try {
      localStorage.setItem(FONT_SIZE_KEY, fontSize);
    } catch {}
  }, [fontSize]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("neurosharp_token");
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex min-h-screen min-h-[100dvh] h-screen overflow-hidden app-bg">
      {/* Desktop sidebar — glassmorphism, 8px grid spacing */}
        <aside className="hidden lg:flex w-[260px] shrink-0 flex-col min-h-0 border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/80 backdrop-blur-[20px] backdrop-saturate-[180%]">
        <div className="p-6 border-b border-[var(--color-border-subtle)] shrink-0">
          <Link to="/app/dashboard" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shadow-[var(--shadow-elevation-low)] transition-transform duration-200 group-hover:scale-[1.02]">
              <img src="/neurosharp-logo.png" alt="NeuroSharp" className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-[var(--color-text)] text-base tracking-tight block">NeuroSharp</span>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5 font-medium">Memory Program</p>
              <p className="text-xs text-[var(--color-accent)] font-medium mt-1 truncate" title={displayName}>Hi, {displayName}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <SidebarNavLink key={item.path} path={item.path} label={item.label} Icon={item.Icon} />
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--color-border-subtle)] space-y-4 shrink-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[var(--color-text-muted)]">Theme</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                aria-label="Dark theme"
                className={`min-h-[44px] min-w-[44px] text-xs px-3 py-2 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-card)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                aria-label="Light theme"
                className={`min-h-[44px] min-w-[44px] text-xs px-3 py-2 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                  theme === "light"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-card)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Light
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[var(--color-text-secondary)]">Text size</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                aria-pressed={fontSize === "normal"}
                aria-label="Normal text size"
                className={`min-h-[44px] min-w-[44px] text-xs px-3 py-2 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                  fontSize === "normal"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-card)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                aria-pressed={fontSize === "large"}
                aria-label="Larger text for easier reading"
                className={`min-h-[44px] min-w-[44px] text-sm px-3 py-2 rounded-xl border transition-colors duration-200 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                  fontSize === "large"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]"
                    : "bg-[var(--color-card)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                A+
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] text-left transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-elevated)]"
          >
            <span className="w-7 shrink-0 flex items-center justify-center [&_svg]:shrink-0">
              <IconLogout />
            </span>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header
          className="lg:hidden flex items-center px-5 shrink-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-active)]/85 backdrop-blur-[20px] backdrop-saturate-[180%] safe-area-pt"
          style={{ paddingTop: "max(12px, var(--safe-top))", paddingBottom: "12px", minHeight: "56px" }}
          role="banner"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shadow-lg shrink-0">
              <img src="/neurosharp-logo.png" alt="NeuroSharp" className="w-7 h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-[var(--color-text)] text-lg block">NeuroSharp</span>
              <p className="text-[10px] text-[var(--color-accent)] font-medium truncate">Hi, {displayName}</p>
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden app-main p-4 sm:p-5 pb-36 md:p-8 lg:pb-0 max-w-4xl mx-auto w-full" role="main">
          <Outlet />
        </main>

        {/* Mobile: fixed bar with Theme + Text size + Add to phone above the bottom nav */}
        <div
          className="lg:hidden fixed left-0 right-0 z-40 flex flex-col gap-2 px-3 py-2 border-t border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-xl pointer-events-auto"
          style={{
            bottom: "calc(72px + max(0.75rem, var(--safe-bottom)))",
            paddingLeft: "max(1rem, calc(1rem + env(safe-area-inset-left)))",
            paddingRight: "max(1rem, calc(1rem + env(safe-area-inset-right)))",
          }}
        >
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Theme</span>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-label="Dark theme"
                className={`text-xs px-2.5 py-2 min-h-[40px] rounded-lg border transition-colors touch-manipulation ${
                  theme === "dark"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-label="Light theme"
                className={`text-xs px-2.5 py-2 min-h-[40px] rounded-lg border transition-colors touch-manipulation ${
                  theme === "light"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                Light
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Text</span>
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                aria-label="Normal text size"
                className={`text-xs px-2.5 py-2 min-h-[40px] rounded-lg border transition-colors touch-manipulation ${
                  fontSize === "normal"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)] font-medium"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                aria-label="Larger text"
                className={`text-sm px-2.5 py-2 min-h-[40px] rounded-lg border transition-colors font-bold touch-manipulation ${
                  fontSize === "large"
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
                title="Larger text"
              >
                A+
              </button>
            </div>
          </div>
          {!isStandalone && (
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (installPrompt) {
                    triggerInstall();
                  } else {
                    setShowAddToPhoneHint((v) => !v);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--color-accent-text)] font-semibold text-sm min-h-[44px]"
                style={{ background: "var(--color-accent)" }}
              >
                <span aria-hidden>📱</span>
                <span>{installPrompt ? "Add to phone" : "Add to Home Screen"}</span>
              </button>
              {showAddToPhoneHint && !installPrompt && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg text-center max-w-[260px]">
                  <p className="text-xs text-[var(--color-text)] font-medium">
                    {isIOS
                      ? "Tap the Share button below, then choose “Add to Home Screen”."
                      : "Open the browser menu (⋮) and choose “Add to Home screen” or “Install app”."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddToPhoneHint(false)}
                    className="mt-2 text-[10px] text-[var(--color-accent)] font-medium"
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
          style={{
            paddingLeft: "max(0.75rem, var(--safe-left))",
            paddingRight: "max(0.75rem, var(--safe-right))",
            paddingBottom: "max(0.75rem, var(--safe-bottom))",
          }}
        >
          <div className="pointer-events-auto flex items-stretch justify-around w-full max-w-lg mx-auto rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.25)] py-2 px-2">
            {BOTTOM_NAV_ITEMS.map((item) => (
              <BottomNavItem key={item.path} path={item.path} label={item.label} Icon={item.Icon} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
