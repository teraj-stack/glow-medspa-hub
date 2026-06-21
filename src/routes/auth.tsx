import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Konto pacjenta | Beauty & Mind Clinic" },
      { name: "description", content: "Logowanie do panelu pacjenta kliniki Beauty & Mind w Siedlcach." },
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
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    setError(null);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) {
      setError(res.error instanceof Error ? res.error.message : "Nie udało się zalogować przez Google.");
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
            onClick={onGoogle}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm hover:bg-secondary"
          >
            Kontynuuj przez Google
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
