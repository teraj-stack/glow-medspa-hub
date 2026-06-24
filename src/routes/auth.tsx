import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Konto pacjenta | BMClinics.ai" },
      { name: "description", content: "Logowanie do panelu pacjenta kliniki BMClinics.ai w Siedlcach." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled && data.user) navigate({ to: "/" });
    });
    return () => { cancelled = true; };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        // Welcome/confirmation email is sent by the Supabase auth signup template.
        // We don't trigger an additional transactional email from the client to
        // avoid exposing a user-driven send endpoint.
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd.");
    } finally {
      setLoading(false);
    }
  }

  async function onOAuth(provider: "google" | "apple") {
    setLoading(true);
    setError(null);
    const res = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (res.error) {
      setError(res.error instanceof Error ? res.error.message : `Nie udało się zalogować przez ${provider === "google" ? "Google" : "Apple"}.`);
      setLoading(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <section className="container-luxury py-20 md:py-28">
      <div className="mx-auto max-w-md">
        <SectionHeading
          eyebrow={mode === "login" ? "Logowanie" : "Rejestracja"}
          title={mode === "login" ? "Witamy ponownie" : "Konto pacjenta"}
          as="h1"
        />
        <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 shadow-soft">
          {mode === "signup" && (
            <label className="grid gap-1.5 text-sm">
              <span>Imię i nazwisko</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 rounded-md border border-input bg-background px-3"
              />
            </label>
          )}
          <label className="grid gap-1.5 text-sm">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-md border border-input bg-background px-3"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span>Hasło</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-11 rounded-md border border-input bg-background px-3"
            />
          </label>

          {error && <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm tracking-wide text-alabaster disabled:opacity-60"
          >
            {loading ? "Proszę czekać…" : mode === "login" ? "Zaloguj się" : "Załóż konto"}
          </button>

          <div className="relative my-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="bg-card px-3">lub</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>

          <button
            type="button"
            onClick={() => onOAuth("google")}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm hover:bg-secondary"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-4.9c-2 1.4-4.4 2.4-6.9 2.4-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6 4.9C40.9 35.7 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
            Kontynuuj przez Google
          </button>

          <button
            type="button"
            onClick={() => onOAuth("apple")}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-black px-5 text-sm text-white hover:bg-black/90"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.43 2.25-1.14 3.06-.78.9-2.05 1.58-3.08 1.5-.13-1.11.45-2.27 1.14-3.04.78-.88 2.13-1.54 3.08-1.52zM20.5 17.27c-.58 1.34-.86 1.94-1.6 3.13-1.04 1.66-2.5 3.73-4.31 3.75-1.62.02-2.04-1.05-4.24-1.04-2.2.01-2.66 1.06-4.28 1.04-1.81-.03-3.2-1.9-4.24-3.56-2.91-4.67-3.21-10.16-1.42-13.08C2.66 5.4 4.83 4.07 6.87 4.07c2.08 0 3.39 1.14 5.11 1.14 1.67 0 2.69-1.14 5.09-1.14 1.82 0 3.74 1 5.11 2.72-4.49 2.46-3.76 8.87-1.68 10.48z"/></svg>
            Kontynuuj przez Apple
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "login" ? "Nie masz konta? Załóż konto" : "Masz już konto? Zaloguj się"}
          </button>
        </form>
      </div>
    </section>
  );
}
