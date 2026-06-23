// Server-only helper for Google Calendar via Lovable Connector Gateway.
// Do NOT import from client code (file is *.server.ts).

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

function gatewayHeaders(): HeadersInit {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gcalKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!gcalKey) throw new Error("GOOGLE_CALENDAR_API_KEY is not configured");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": gcalKey,
    "Content-Type": "application/json",
  };
}

export type BusyInterval = { start: string; end: string };

export async function freeBusy(
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<{ ok: true; busy: BusyInterval[] } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/freeBusy`, {
      method: "POST",
      headers: gatewayHeaders(),
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      }),
    });
    const json = (await res.json()) as any;
    if (!res.ok) {
      return { ok: false, error: json?.error?.message || `HTTP ${res.status}` };
    }
    const cal = json?.calendars?.[calendarId];
    if (cal?.errors?.length) {
      return { ok: false, error: cal.errors.map((e: any) => e.reason).join(", ") };
    }
    return { ok: true, busy: (cal?.busy ?? []) as BusyInterval[] };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export async function insertEvent(
  calendarId: string,
  event: {
    summary: string;
    description?: string;
    startISO: string;
    endISO: string;
    attendeeEmail?: string;
    attendeeName?: string;
  },
): Promise<{ ok: true; eventId: string } | { ok: false; error: string }> {
  try {
    const body: Record<string, unknown> = {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.startISO, timeZone: "Europe/Warsaw" },
      end: { dateTime: event.endISO, timeZone: "Europe/Warsaw" },
    };
    if (event.attendeeEmail) {
      body.attendees = [
        { email: event.attendeeEmail, displayName: event.attendeeName },
      ];
    }
    const res = await fetch(
      `${GATEWAY_URL}/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=none`,
      { method: "POST", headers: gatewayHeaders(), body: JSON.stringify(body) },
    );
    const json = (await res.json()) as any;
    if (!res.ok) {
      return { ok: false, error: json?.error?.message || `HTTP ${res.status}` };
    }
    return { ok: true, eventId: json.id as string };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export async function deleteEvent(
  calendarId: string,
  eventId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(
      `${GATEWAY_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
      { method: "DELETE", headers: gatewayHeaders() },
    );
    if (!res.ok && res.status !== 404 && res.status !== 410) {
      const json = (await res.json().catch(() => ({}))) as any;
      return { ok: false, error: json?.error?.message || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}
