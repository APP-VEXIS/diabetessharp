import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { trpc } from "../trpc";

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.ok && data.token && data.user) {
        localStorage.setItem("neurosharp_token", data.token);
        if (redirectTo?.startsWith("/")) {
          navigate(redirectTo);
        } else if (data.user.role === "admin") {
          navigate("/admin/orders");
        } else if (data.user.role === "affiliate") {
          navigate("/affiliates");
        } else {
          navigate("/app/dashboard");
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const testEmail = email.trim().toLowerCase();
    const testPass = password.trim();
    if (
      (testEmail === "test@neurosharp.com" || testEmail === "test@diabetessharp.com") &&
      testPass === "Test123!"
    ) {
      localStorage.setItem("neurosharp_token", "demo");
      navigate(redirectTo?.startsWith("/") ? redirectTo : "/app/dashboard");
      return;
    }
    login.mutate({ email, password });
  };

  const hasError = login.isSuccess && !login.data?.ok;
  const errorMessage =
    login.data && !login.data.ok ? login.data.error : "Incorrect email or password.";

  return (
    <>
      {/* Video background — fora de qualquer container posicionado para garantir z-index no iOS Safari */}
      <video
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{ zIndex: 1, background: "rgba(0,0,0,0.62)" }}
      />

      <div
        className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 relative"
        style={{
          zIndex: 2,
          paddingTop: "max(2rem, env(safe-area-inset-top))",
          paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
        }}
      >

      <div className="relative w-full max-w-[380px] animate-in-up">

        {/* Brand mark */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/home" className="group flex flex-col items-center gap-3">
            <div
              className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04]"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border-subtle)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.24)",
              }}
            >
              <img src="/diabetessharp-logo.png" alt="" className="w-8 h-8 object-contain" aria-hidden />
            </div>
            <span className="font-display font-semibold text-[var(--color-text-primary)] text-[17px] tracking-tight">
              DiabetesSharp
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[28px] text-[var(--color-text-primary)] mb-1.5 tracking-[-0.02em]">
            Sign in
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Use the email and password from your purchase.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          <div className="space-y-1.5">
            <label htmlFor="ds-email" className="form-label">Email</label>
            <input
              id="ds-email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ds-password" className="form-label">Password</label>
            <div className="relative">
              <input
                id="ds-password"
                type={showPassword ? "text" : "password"}
                className="input-field"
                style={{ paddingRight: "3rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          {hasError && (
            <p className="text-sm text-[var(--color-warning)]" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={login.isPending}
            style={{ minHeight: "52px", marginTop: "8px" }}
          >
            {login.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : "Sign in"}
          </button>

        </form>

        {/* Test credentials */}
        <button
          type="button"
          onClick={() => { setEmail("test@diabetessharp.com"); setPassword("Test123!"); }}
          className="w-full mt-5 rounded-xl px-4 py-3 text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px dashed rgba(255,255,255,0.20)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
            Credenciais de teste — clique para preencher
          </p>
          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>
            test@diabetessharp.com
          </p>
          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>
            Test123!
          </p>
        </button>

        {/* Footer links */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            className="text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            onClick={() => {}}
          >
            Forgot password?
          </button>
          <Link
            to="/"
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            ← Back to home
          </Link>
        </div>

      </div>
      </div>
    </>
  );
}
