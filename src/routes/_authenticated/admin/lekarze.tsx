import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  listAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  testDoctorCalendar,
  listWorkingHours,
  replaceWorkingHours,
} from "@/lib/doctors.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/lekarze")({
  component: AdminDoctorsPage,
});

const WEEKDAYS = ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."];

type Doctor = {
  id: string;
  slug: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  google_calendar_id: string | null;
  slot_minutes: number;
  buffer_minutes: number;
  default_price_cents: number | null;
  active: boolean;
  display_order: number;
};

function AdminDoctorsPage() {
  const list = useServerFn(listAllDoctors);
  const qc = useQueryClient();
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ["admin", "doctors"],
    queryFn: () => list(),
  });

  const [editing, setEditing] = useState<Partial<Doctor> | null>(null);

  if (isLoading) return <div className="p-8">Ładowanie…</div>;
  if (error) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-light mb-4">Panel — Lekarze</h1>
        <Card className="p-6 border-destructive">
          <p className="text-sm text-destructive">
            {(error as Error).message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Jeśli widzisz „Forbidden: admin role required", konto wymaga przypisania roli
            <code className="mx-1 px-1 bg-muted rounded">admin</code> w bazie. Skontaktuj się z developerem.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light">Panel — Lekarze</h1>
        <Button
          onClick={() =>
            setEditing({
              slug: "",
              full_name: "",
              slot_minutes: 30,
              buffer_minutes: 10,
              active: true,
              display_order: 0,
            })
          }
        >
          + Nowy lekarz
        </Button>
      </div>

      {editing && (
        <DoctorForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "doctors"] });
            setEditing(null);
          }}
        />
      )}

      <div className="space-y-3">
        {(doctors ?? []).map((d: Doctor) => (
          <DoctorRow key={d.id} doctor={d} onEdit={() => setEditing(d)} />
        ))}
        {(doctors ?? []).length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Brak lekarzy. Dodaj pierwszego, klikając „+ Nowy lekarz".
          </Card>
        )}
      </div>

      <div className="pt-8 text-xs text-muted-foreground">
        <Link to="/" className="underline">← Strona główna</Link>
      </div>
    </div>
  );
}

function DoctorRow({ doctor, onEdit }: { doctor: Doctor; onEdit: () => void }) {
  const test = useServerFn(testDoctorCalendar);
  const del = useServerFn(deleteDoctor);
  const qc = useQueryClient();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{doctor.full_name}</h3>
            {!doctor.active && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded">nieaktywny</span>
            )}
          </div>
          {doctor.title && <p className="text-sm text-muted-foreground">{doctor.title}</p>}
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Kalendarz:{" "}
            <code className="bg-muted px-1 rounded">
              {doctor.google_calendar_id || "— nie ustawiono —"}
            </code>
          </p>
          <p className="text-xs text-muted-foreground">
            Slot {doctor.slot_minutes} min + bufor {doctor.buffer_minutes} min
            {doctor.default_price_cents != null && (
              <> • Cena: {(doctor.default_price_cents / 100).toFixed(2)} zł</>
            )}
          </p>
          {testResult && (
            <p
              className={`text-xs mt-2 ${
                testResult.startsWith("OK") ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {testResult}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            disabled={!doctor.google_calendar_id || testing}
            onClick={async () => {
              setTesting(true);
              setTestResult(null);
              try {
                const r = await test({ data: { calendarId: doctor.google_calendar_id! } });
                setTestResult(r.ok ? `OK — widzę ${r.busyCount} zajętych przedziałów w najbliższych 7 dniach.` : `Błąd: ${r.error}`);
              } finally {
                setTesting(false);
              }
            }}
          >
            {testing ? "…" : "Testuj kalendarz"}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edytuj
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={async () => {
              if (!confirm(`Usunąć lekarza ${doctor.full_name}? Tej operacji nie można cofnąć.`)) return;
              try {
                await del({ data: { id: doctor.id } });
                qc.invalidateQueries({ queryKey: ["admin", "doctors"] });
                toast.success("Usunięto");
              } catch (e: any) {
                toast.error(e?.message ?? "Błąd usuwania");
              }
            }}
          >
            Usuń
          </Button>
        </div>
      </div>
      <WorkingHoursEditor doctorId={doctor.id} />
    </Card>
  );
}

function DoctorForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Partial<Doctor>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const create = useServerFn(createDoctor);
  const update = useServerFn(updateDoctor);
  const [form, setForm] = useState<Partial<Doctor>>(initial);
  const [saving, setSaving] = useState(false);

  const isNew = !initial.id;

  return (
    <Card className="p-6 space-y-4 border-primary/40">
      <h2 className="text-lg font-medium">{isNew ? "Nowy lekarz" : "Edytuj lekarza"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Imię i nazwisko *">
          <Input
            value={form.full_name ?? ""}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </Field>
        <Field label="Slug (do URL) *" hint="małe litery, cyfry, myślniki">
          <Input
            value={form.slug ?? ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </Field>
        <Field label="Tytuł / specjalizacja">
          <Input
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="ID kalendarza Google" hint="np. anna@bmclinics.pl">
          <Input
            value={form.google_calendar_id ?? ""}
            onChange={(e) => setForm({ ...form, google_calendar_id: e.target.value })}
          />
        </Field>
        <Field label="Długość slotu (min)">
          <Input
            type="number"
            value={form.slot_minutes ?? 30}
            onChange={(e) => setForm({ ...form, slot_minutes: Number(e.target.value) })}
          />
        </Field>
        <Field label="Bufor (min)">
          <Input
            type="number"
            value={form.buffer_minutes ?? 10}
            onChange={(e) => setForm({ ...form, buffer_minutes: Number(e.target.value) })}
          />
        </Field>
        <Field label="Cena domyślna (zł)" hint="zostawić puste, jeśli różna per zabieg">
          <Input
            type="number"
            step="0.01"
            value={form.default_price_cents != null ? form.default_price_cents / 100 : ""}
            onChange={(e) =>
              setForm({
                ...form,
                default_price_cents: e.target.value ? Math.round(Number(e.target.value) * 100) : null,
              })
            }
          />
        </Field>
        <Field label="URL zdjęcia">
          <Input
            value={form.photo_url ?? ""}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Bio (krótki opis)">
        <Textarea
          rows={3}
          value={form.bio ?? ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </Field>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active ?? true}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Aktywny (widoczny w rezerwacji)
        </label>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Anuluj
        </Button>
        <Button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              if (isNew) {
                await create({
                  data: {
                    slug: form.slug!,
                    full_name: form.full_name!,
                    title: form.title || null,
                    bio: form.bio || null,
                    photo_url: form.photo_url || null,
                    google_calendar_id: form.google_calendar_id || null,
                    slot_minutes: form.slot_minutes ?? 30,
                    buffer_minutes: form.buffer_minutes ?? 10,
                    default_price_cents: form.default_price_cents ?? null,
                    active: form.active ?? true,
                    display_order: form.display_order ?? 0,
                  },
                });
                toast.success("Dodano lekarza");
              } else {
                await update({
                  data: {
                    id: initial.id!,
                    slug: form.slug,
                    full_name: form.full_name,
                    title: form.title || null,
                    bio: form.bio || null,
                    photo_url: form.photo_url || null,
                    google_calendar_id: form.google_calendar_id || null,
                    slot_minutes: form.slot_minutes,
                    buffer_minutes: form.buffer_minutes,
                    default_price_cents: form.default_price_cents ?? null,
                    active: form.active,
                    display_order: form.display_order,
                  },
                });
                toast.success("Zapisano");
              }
              onSaved();
            } catch (e: any) {
              toast.error(e?.message ?? "Błąd zapisu");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Zapis…" : "Zapisz"}
        </Button>
      </div>
    </Card>
  );
}

function WorkingHoursEditor({ doctorId }: { doctorId: string }) {
  const list = useServerFn(listWorkingHours);
  const replace = useServerFn(replaceWorkingHours);
  const qc = useQueryClient();
  const { data: blocks } = useQuery({
    queryKey: ["admin", "working-hours", doctorId],
    queryFn: () => list({ data: { doctorId } }),
  });
  const [draft, setDraft] = useState<{ weekday: number; start_time: string; end_time: string }[] | null>(
    null,
  );

  const current = draft ?? (blocks ?? []).map((b: any) => ({
    weekday: b.weekday,
    start_time: b.start_time.slice(0, 5),
    end_time: b.end_time.slice(0, 5),
  }));

  return (
    <details className="mt-3 border-t pt-3">
      <summary className="cursor-pointer text-sm font-medium">Godziny pracy ({current.length} bloków)</summary>
      <div className="space-y-2 mt-3">
        {current.map((b, i) => (
          <div key={i} className="flex gap-2 items-center text-sm">
            <select
              className="border rounded px-2 py-1 bg-background"
              value={b.weekday}
              onChange={(e) => {
                const next = [...current];
                next[i] = { ...b, weekday: Number(e.target.value) };
                setDraft(next);
              }}
            >
              {WEEKDAYS.map((label, idx) => (
                <option key={idx} value={idx}>{label}</option>
              ))}
            </select>
            <Input
              type="time"
              value={b.start_time}
              className="w-28"
              onChange={(e) => {
                const next = [...current];
                next[i] = { ...b, start_time: e.target.value };
                setDraft(next);
              }}
            />
            <span>–</span>
            <Input
              type="time"
              value={b.end_time}
              className="w-28"
              onChange={(e) => {
                const next = [...current];
                next[i] = { ...b, end_time: e.target.value };
                setDraft(next);
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDraft(current.filter((_, j) => j !== i))}
            >
              ×
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setDraft([...current, { weekday: 1, start_time: "09:00", end_time: "17:00" }])
            }
          >
            + Blok
          </Button>
          {draft && (
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await replace({ data: { doctorId, blocks: draft } });
                  qc.invalidateQueries({ queryKey: ["admin", "working-hours", doctorId] });
                  setDraft(null);
                  toast.success("Zapisano godziny pracy");
                } catch (e: any) {
                  toast.error(e?.message ?? "Błąd zapisu");
                }
              }}
            >
              Zapisz godziny
            </Button>
          )}
        </div>
      </div>
    </details>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
