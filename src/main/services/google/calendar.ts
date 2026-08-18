import type { CalendarData, CalendarEvent, GoogleAccountConfig } from '../../../shared/types';
import type { GoogleAuth } from './auth';

const CALENDAR = 'https://www.googleapis.com/calendar/v3';
const LOOKAHEAD_DAYS = 7;

const PALETTE = ['#7c9cff', '#5ad1a5', '#f2b45c', '#e97ab0', '#9d7cff', '#5ec6e6'];

function eventTime(value: any): { at: number; allDay: boolean } {
  if (value?.dateTime) return { at: new Date(value.dateTime).getTime(), allDay: false };
  if (value?.date) return { at: new Date(`${value.date}T00:00:00`).getTime(), allDay: true };
  return { at: 0, allDay: false };
}

async function fetchAccountEvents(
  auth: GoogleAuth,
  account: GoogleAccountConfig,
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  const list = await auth.apiGet(
    account.id,
    `${CALENDAR}/users/me/calendarList?minAccessRole=reader&maxResults=50`
  );

  const wanted: any[] = (list.items ?? []).filter((cal: any) => {
    if (account.calendarIds.length > 0) return account.calendarIds.includes(cal.id);
    // Default to the calendars the user actually keeps ticked in Google Calendar.
    return cal.selected !== false;
  });

  const perCalendar = await Promise.all(
    wanted.map(async (cal, index) => {
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '25',
      });
      const data = await auth
        .apiGet(account.id, `${CALENDAR}/calendars/${encodeURIComponent(cal.id)}/events?${params}`)
        .catch(() => ({ items: [] }));

      return (data.items ?? [])
        .filter((item: any) => item.status !== 'cancelled')
        .map((item: any): CalendarEvent => {
          const start = eventTime(item.start);
          const end = eventTime(item.end);
          const self = (item.attendees ?? []).find((a: any) => a.self);
          return {
            id: `${account.id}:${item.id}`,
            accountId: account.id,
            accountEmail: account.email,
            calendarId: cal.id,
            calendarName: cal.summaryOverride ?? cal.summary ?? cal.id,
            colour: cal.backgroundColor ?? PALETTE[index % PALETTE.length],
            title: item.summary ?? '(no title)',
            location: item.location ?? '',
            start: start.at,
            end: end.at || start.at,
            allDay: start.allDay,
            hangoutLink: item.hangoutLink ?? '',
            link: item.htmlLink ?? '',
            responseStatus: self?.responseStatus ?? 'accepted',
          };
        });
    })
  );

  return perCalendar.flat();
}

export async function fetchCalendar(
  auth: GoogleAuth,
  accounts: GoogleAccountConfig[]
): Promise<CalendarData> {
  const now = new Date();
  const timeMin = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + LOOKAHEAD_DAYS * 86_400_000).toISOString();

  const events: CalendarEvent[] = [];
  const errors: { accountId: string; message: string }[] = [];

  await Promise.all(
    accounts
      .filter((account) => account.enabled)
      .map(async (account) => {
        try {
          events.push(...(await fetchAccountEvents(auth, account, timeMin, timeMax)));
        } catch (error) {
          errors.push({
            accountId: account.id,
            message: error instanceof Error ? error.message : String(error),
          });
        }
      })
  );

  return {
    events: events.sort((a, b) => a.start - b.start).slice(0, 40),
    errors,
    updatedAt: Date.now(),
  };
}
