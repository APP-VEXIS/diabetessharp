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
  return "light";
}

function getStoredFontSize(): FontSize {
  try {
    const s = localStorage.getItem(FONT_SIZE_KEY);
    if (s === "large" || s === "normal") return s;
  } catch {}
  return "normal";
}

const SIDEBAR_KEY = "neurosharp_sidebar_open";
function getStoredSidebarOpen(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== "false";
  } catch {}
  return true;
}
import {
  IconHome,
  IconExercises,
  IconDrMarcus,
  IconNutrition,
  IconProgress,
  IconDroplet,
  IconBell,
  IconLearn,
  IconReport,
  IconPhotos,
  IconSofia,
  IconProfile,
  IconSettings,
  IconLogout,
} from "./NavIcons";
import { useAddToHomeScreen } from "./AddToHomeScreen";
import { Smartphone, PanelLeftClose, PanelLeftOpen, Sun, Moon, Pin } from "lucide-react";

const NAV_ITEMS = [
  { path: "/app/dashboard", label: "Home", Icon: IconHome },
  { path: "/app/exercises", label: "Learn", Icon: IconExercises },
  { path: "/app/dr-marcus", label: "AI Doctor", Icon: IconDrMarcus },
  { path: "/app/nutrition", label: "Meals", Icon: IconNutrition },
  { path: "/app/progress", label: "My Progress", Icon: IconProgress },
  { path: "/app/glucose", label: "My Sugar", Icon: IconDroplet },
  { path: "/app/reminders", label: "Reminders", Icon: IconBell },
  { path: "/app/learn", label: "Library", Icon: IconLearn },
  { path: "/app/weekly-report", label: "Reports", Icon: IconReport },
  { path: "/app/photos", label: "Photos", Icon: IconPhotos },
  { path: "/app/sofia", label: "Sofia", Icon: IconSofia },
  { path: "/app/profile", label: "Profile", Icon: IconProfile },
  { path: "/app/settings", label: "Settings", Icon: IconSettings },
];

// Bottom nav: main 4 + Photos for mobile
const BOTTOM_NAV_ITEMS = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[1], // Education
  NAV_ITEMS[2], // Dr. James
  NAV_ITEMS[3], // Recipes & List
  NAV_ITEMS[9], // Photos
];

function SidebarNavLink({
  path,
  label,
  Icon,
  collapsed,
}: {
  path: string;
  label: string;
  Icon: React.ComponentType;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={path}
      end={false}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-4"} py-2 rounded-xl text-sm font-medium min-h-[40px] w-full text-left border border-transparent transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-elevated)] ${
          isActive
            ? "nav-active sidebar-nav-active text-[var(--color-accent-text)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-subtle)]"
        }`
      }
      aria-current={undefined}
    >
      {({ isActive }) => (
        <>
          <span className="w-7 shrink-0 flex items-center justify-center [&_svg]:shrink-0 [&_svg]:text-current" aria-hidden>
            <Icon />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1">{label}</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent-text)] opacity-80 shrink-0" aria-hidden />
              )}
            </>
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(getStoredSidebarOpen);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const isExpanded = sidebarOpen || sidebarHovered;
  const [showAddToPhoneHint, setShowAddToPhoneHint] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(true);
  const fabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    try {
      localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
    } catch {}
  }, [sidebarOpen]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  // FAB: expande ao navegar para nova página, colapsa após 2.5s
  useEffect(() => {
    setFabExpanded(true);
    fabTimerRef.current = setTimeout(() => setFabExpanded(false), 2500);
    return () => {
      if (fabTimerRef.current) clearTimeout(fabTimerRef.current);
    };
  }, [location.pathname]);

  // FAB: colapsa ao rolar o conteúdo
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 60) {
        if (fabTimerRef.current) clearTimeout(fabTimerRef.current);
        setFabExpanded(false);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("neurosharp_token");
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex min-h-screen min-h-[100dvh] h-screen overflow-hidden app-bg">
      {/* Desktop sidebar — spacer que reserva o espaço no layout */}
      <aside
        className={`hidden lg:block ${sidebarOpen ? "w-[260px]" : "w-[72px]"} shrink-0 min-h-0 relative transition-[width] duration-300 ease-in-out`}
        onMouseEnter={() => { if (!sidebarOpen) setSidebarHovered(true); }}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Painel visual — se expande como overlay ao hover sem deslocar conteúdo */}
        <div
          className={`absolute inset-y-0 left-0 flex flex-col ${isExpanded ? "w-[260px]" : "w-[72px]"} border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/90 backdrop-blur-[20px] backdrop-saturate-[180%] transition-[width] duration-300 ease-in-out overflow-hidden z-20 ${
            sidebarHovered && !sidebarOpen
              ? "shadow-[4px_0_32px_rgba(0,0,0,0.22)]"
              : ""
          }`}
        >
          {/* Logo header */}
          <div className={`${isExpanded ? "p-6" : "p-3"} border-b border-[var(--color-border-subtle)] shrink-0 transition-[padding] duration-300`}>
            <Link
              to="/app/dashboard"
              className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"} group`}
              title={isExpanded ? undefined : "DiabetesSharp"}
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] flex items-center justify-center overflow-hidden shadow-[var(--shadow-elevation-low)] transition-transform duration-200 ease-[var(--ease-spring)] group-hover:scale-[1.02] shrink-0">
                <img src="/diabetessharp-logo.png" alt="DiabetesSharp" className="w-8 h-8 object-contain" />
              </div>
              {isExpanded && (
                <div className="min-w-0">
                  <span className="font-display font-bold text-[var(--color-text)] text-base tracking-tight block">DiabetesSharp</span>
                  <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5 font-medium">Your calm space for diabetes care</p>
                  <p className="text-xs text-[var(--color-accent)] font-medium mt-1 truncate" title={displayName}>Hi, {displayName}</p>
                </div>
              )}
            </Link>
          </div>

          {/* Toggle — acima dos itens de menu */}
          <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] shrink-0">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen((v) => !v);
                setSidebarHovered(false);
              }}
              aria-label={
                sidebarOpen ? "Recolher menu" : sidebarHovered ? "Fixar menu aberto" : "Expandir menu"
              }
              aria-expanded={sidebarOpen}
              className={`flex items-center gap-2 w-full min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                isExpanded ? "" : "justify-center px-0"
              }`}
            >
              {isExpanded ? (
                sidebarOpen ? (
                  <>
                    <PanelLeftClose size={16} aria-hidden />
                    <span>Recolher</span>
                  </>
                ) : (
                  <>
                    <Pin size={16} aria-hidden />
                    <span>Fixar aberto</span>
                  </>
                )
              ) : (
                <PanelLeftOpen size={16} aria-hidden />
              )}
            </button>
          </div>

          {/* Nav items — com fade hint indicando scroll */}
          <div className="flex-1 min-h-0 relative">
            <nav className="h-full p-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <SidebarNavLink key={item.path} path={item.path} label={item.label} Icon={item.Icon} collapsed={!isExpanded} />
              ))}
            </nav>
            {/* Fade sutil indicando que há mais itens abaixo */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--color-surface-elevated)] to-transparent opacity-70"
              aria-hidden
            />
          </div>

          {/* Footer compacto — tema + fonte + logout em uma única linha */}
          <div className="px-3 py-2 border-t border-[var(--color-border-subtle)] shrink-0">
            {isExpanded ? (
              <div className="flex items-center gap-1">
                {/* Toggle de tema */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
                  title={theme === "dark" ? "Tema claro" : "Tema escuro"}
                  className="flex items-center gap-1.5 flex-1 min-h-[36px] px-2 py-1.5 rounded-lg text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {theme === "dark" ? <Moon size={13} aria-hidden /> : <Sun size={13} aria-hidden />}
                  <span>{theme === "dark" ? "Dark" : "Light"}</span>
                </button>

                <span className="w-px h-4 bg-[var(--color-border-subtle)] shrink-0" aria-hidden />

                {/* Toggle de tamanho de fonte */}
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
                  aria-label={fontSize === "normal" ? "Aumentar texto" : "Texto normal"}
                  title={fontSize === "normal" ? "Texto maior" : "Texto normal"}
                  className="flex items-center justify-center min-h-[36px] min-w-[36px] px-2 py-1.5 rounded-lg text-[11px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {fontSize === "normal" ? "A" : "A+"}
                </button>

                <span className="w-px h-4 bg-[var(--color-border-subtle)] shrink-0" aria-hidden />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair"
                  title="Sair"
                  className="flex items-center justify-center min-h-[36px] min-w-[36px] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <span className="[&_svg]:w-[15px] [&_svg]:h-[15px] [&_svg]:shrink-0">
                    <IconLogout />
                  </span>
                </button>
              </div>
            ) : (
              /* Collapsed: 3 ícones empilhados, compactos */
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
                  title={theme === "dark" ? "Tema claro" : "Tema escuro"}
                  className="flex items-center justify-center w-full min-h-[36px] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {theme === "dark" ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
                  aria-label={fontSize === "normal" ? "Aumentar texto" : "Texto normal"}
                  title={fontSize === "normal" ? "Texto maior" : "Texto normal"}
                  className="flex items-center justify-center w-full min-h-[36px] rounded-lg text-[10px] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {fontSize === "normal" ? "A" : "A+"}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair"
                  title="Sair"
                  className="flex items-center justify-center w-full min-h-[36px] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <span className="[&_svg]:w-[15px] [&_svg]:h-[15px] [&_svg]:shrink-0">
                    <IconLogout />
                  </span>
                </button>
              </div>
            )}
          </div>
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
              <img src="/diabetessharp-logo.png" alt="DiabetesSharp" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-[var(--color-text)] text-lg block">DiabetesSharp</span>
              <p className="text-[10px] text-[var(--color-accent)] font-medium truncate">Hi, {displayName}</p>
            </div>
          </div>
        </header>

        <main
          ref={mainRef}
          className={`flex-1 overflow-y-auto overflow-x-hidden app-main p-4 sm:p-5 pb-36 md:p-8 lg:pb-0 ${sidebarOpen ? "max-w-4xl" : "max-w-6xl"} mx-auto w-full relative transition-[max-width] duration-300 ease-in-out`}
          role="main"
        >
          <Outlet />
        </main>

        {/* FAB — AI Doctor: oculto na própria página do AI Doctor */}
        {location.pathname !== "/app/dr-marcus" && (
          <button
            type="button"
            onClick={() => navigate("/app/dr-marcus")}
            onMouseEnter={() => {
              if (fabTimerRef.current) clearTimeout(fabTimerRef.current);
              setFabExpanded(true);
            }}
            onMouseLeave={() => setFabExpanded(false)}
            aria-label="Falar com AI Doctor"
            className={`fixed z-50 flex items-center rounded-full text-white font-semibold select-none
              transition-all duration-300 ease-in-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              active:scale-95
              right-4 bottom-[calc(170px+max(0.5rem,var(--safe-bottom)))]
              lg:right-6 lg:bottom-6
              ${fabExpanded ? "pl-4 pr-5 py-3.5 gap-2.5" : "p-[14px] gap-0"}`}
            style={{
              background: "linear-gradient(135deg, #3b8cf8 0%, #1a5ec8 100%)",
              boxShadow: fabExpanded
                ? "0 8px 32px rgba(45,127,249,0.50), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "0 4px 20px rgba(45,127,249,0.40), 0 2px 6px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Ícone com dot de "online" */}
            <span className="relative flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span
                className="absolute -top-[5px] -right-[5px] w-[9px] h-[9px] rounded-full bg-emerald-400 border-[1.5px] border-white"
                aria-hidden
              />
            </span>

            {/* Label com colapso suave */}
            <span
              className={`text-sm font-semibold whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out ${
                fabExpanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
              }`}
              aria-hidden={!fabExpanded}
            >
              Ask AI Doctor
            </span>
          </button>
        )}

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
                className={`text-xs px-2.5 py-2 min-h-[44px] rounded-lg border transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
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
                className={`text-xs px-2.5 py-2 min-h-[44px] rounded-lg border transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
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
                className={`text-xs px-2.5 py-2 min-h-[44px] rounded-lg border transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
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
                className={`text-sm px-2.5 py-2 min-h-[44px] rounded-lg border transition-colors duration-200 font-bold touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm min-h-[44px]"
                style={{ background: "var(--color-accent)" }}
              >
                <Smartphone size={16} aria-hidden />
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
