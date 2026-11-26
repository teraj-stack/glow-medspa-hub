import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, LoaderCircle, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { consultationInput, type QuestionEvent } from "@/lib/consultation-ai/input";

export function ConsultationQuestions() {
  const [needs, setNeeds] = useState("");
  const [consent, setConsent] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const parsed = consultationInput.safeParse({ needs, consent });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Sprawdź opis."); return; }
    const controller = new AbortController();
    abort.current = controller;
    setBusy(true); setError(""); setText(""); setComplete(false); setCopied(false);
    try {
      const response = await fetch("/api/public/consultation-questions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(typeof body.error === "string" ? body.error : "Usługa AI jest niedostępna.");
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Brak odpowiedzi z AI.");
      const decoder = new TextDecoder();
      let pending = "";
      let done = false;
      const consume = (line: string) => {
        if (!line.trim()) return;
        const event = JSON.parse(line) as QuestionEvent;
        if (event.type === "delta") setText((old) => old + event.text);
        else if (event.type === "done") { done = true; setComplete(true); }
        else if (event.type === "error") throw new Error(event.message);
      };
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        pending += decoder.decode(chunk.value, { stream: true });
        const lines = pending.split("\n");
        pending = lines.pop() ?? "";
        lines.forEach(consume);
      }
      pending += decoder.decode();
      consume(pending);
      if (!done) throw new Error("Lista jest nieukończona. Możesz rozpocząć nowe przygotowanie pytań.");
    } catch (error) {
      setError(controller.signal.aborted ? "Zatrzymano przygotowanie pytań. Lista jest nieukończona." : error instanceof Error ? error.message : "Nie udało się przygotować pytań.");
    } finally { setBusy(false); abort.current = null; }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(text + "\n\nLista przygotowana z pomocą AI; nie jest diagnozą ani zaleceniem leczenia."); setCopied(true); }
    catch { setError("Nie udało się skopiować. Zaznacz tekst listy i skopiuj go ręcznie."); }
  }

  return <section id="pytania-do-konsultacji" className="border-y border-border bg-secondary/30 py-16 md:py-24">
    <div className="container-luxury">
      <div className="mb-10 max-w-3xl">
        <span className="text-xs uppercase text-champagne">Przed wizytą · AI</span>
        <h2 className="mt-4 font-serif text-ink">Twoje pytania do specjalisty</h2>
      </div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <form onSubmit={generate} className="space-y-5">
          <label htmlFor="consultation-needs" className="block text-base font-medium text-foreground">Co chciałabyś omówić podczas konsultacji?</label>
          <Textarea id="consultation-needs" value={needs} onChange={(e) => setNeeds(e.target.value)} minLength={20} maxLength={3000} required disabled={busy} rows={7} className="bg-background text-base leading-relaxed" placeholder="Np. mam przebarwienia, zależy mi na naturalnym efekcie i obawiam się długiej rekonwalescencji…" aria-describedby="needs-privacy" />
          <div className="flex items-start justify-between gap-4 text-xs text-muted-foreground"><p id="needs-privacy">Nie wpisuj imienia, nazwiska, numeru telefonu ani innych danych identyfikujących.</p><span className="shrink-0">{needs.length}/3000</span></div>
          <div className="flex items-start gap-3">
            <Checkbox id="consultation-ai-consent" checked={consent} disabled={busy} onCheckedChange={(value) => setConsent(value === true)} className="mt-1" />
            <label htmlFor="consultation-ai-consent" className="text-sm leading-relaxed text-muted-foreground">Wyrażam zgodę na przekazanie mojego opisu, w tym informacji o zdrowiu, do usługi AI przez Lovable AI Gateway wyłącznie w celu przygotowania pytań. Zgoda jest dobrowolna; mogę umówić konsultację bez korzystania z AI. <Link to="/polityka-prywatnosci" className="underline underline-offset-4">Polityka prywatności</Link>.</label>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={busy || !consent || needs.trim().length < 20} className="h-12 px-5">{busy ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{busy ? "Przygotowuję pytania…" : "Przygotuj pytania"}</Button>
            {busy && <Button type="button" variant="outline" className="h-12" onClick={() => abort.current?.abort()}><Square />Zatrzymaj</Button>}
          </div>
          {error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}
        </form>
        <div className="min-w-0 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-busy={busy}>
          <div className="mb-6 flex items-center justify-between gap-3"><h3 className="font-serif text-2xl text-ink">Do omówienia na wizycie</h3>{complete && <Button type="button" variant="ghost" size="icon" onClick={copy} title={copied ? "Skopiowano" : "Kopiuj pytania"} aria-label={copied ? "Skopiowano" : "Kopiuj pytania"}>{copied ? <Check /> : <Copy />}</Button>}</div>
          {text ? <div className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{text}</div> : <p role="status" className="text-sm leading-relaxed text-muted-foreground">{busy ? "Przygotowywanie pytań do Twojej konsultacji…" : "Twoje cele. Twoje obawy. Twoja rozmowa ze specjalistą."}</p>}
          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">AI może się mylić. Lista służy przygotowaniu rozmowy; nie jest diagnozą, kwalifikacją do zabiegu ani zaleceniem leczenia. W nagłym zagrożeniu życia dzwoń pod 112.</p>
          <Button asChild variant="link" className="mt-5 h-auto px-0"><Link to="/konsultacja">Umów konsultację<ArrowRight /></Link></Button>
        </div>
      </div>
    </div>
  </section>;
}