import React from 'react';
import { Empty, Panel } from '../components/Panel';
import { api } from '../lib/api';
import { dayLabel, relativeTime, timeOfDay } from '../lib/format';
import type { CalendarData, CalendarEvent } from '../../shared/types';

function groupByDay(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayLabel(event.start);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }
  return [...groups.entries()];
}

export function CalendarPanel({
  calendar,
  error,
  onOpenSettings,
}: {
  calendar: CalendarData | null;
  error?: string | null;
  onOpenSettings: () => void;
}) {
  if (!calendar) {
    return (
      <Panel title="Upcoming" problem={error}>
        <Empty>
          {error ?? 'Connect a Google account to see your calendar.'}
          <br />
          <button className="btn btn--primary" style={{ marginTop: 10 }} onClick={onOpenSettings}>
            Connect Calendar
          </button>
        </Empty>
      </Panel>
    );
  }

  const now = Date.now();
  const upcoming = calendar.events.filter((event) => event.end >= now);
  const next = upcoming[0];

  return (
    <Panel
      title="Upcoming"
      problem={error}
      meta={
        <>
          {next ? <span>Next {relativeTime(next.start)}</span> : null}
          <span>·</span>
          <span>{relativeTime(calendar.updatedAt)}</span>
        </>
      }
    >
      {calendar.errors.length > 0 ? (
        <div className="item__sub" style={{ color: 'var(--bad)', marginBottom: 8 }}>
          {calendar.errors.map((error) => error.message).join(' · ')}
        </div>
      ) : null}

      {upcoming.length === 0 ? (
        <Empty>Nothing scheduled in the next 7 days.</Empty>
      ) : (
        groupByDay(upcoming).map(([day, events]) => (
          <div key={day} style={{ marginBottom: 12 }}>
            <div className="stat__label" style={{ marginBottom: 6 }}>
              {day}
            </div>
            <div className="list">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="item item--clickable"
                  onClick={() => event.link && void api.openExternal(event.link)}
                  title={`${event.calendarName} · ${event.accountEmail}`}
                >
                  <div className="todo__priority" style={{ background: event.colour }} />
                  <div className="item__main">
                    <div className="item__title">{event.title}</div>
                    <div className="item__sub">
                      {event.allDay
                        ? 'All day'
                        : `${timeOfDay(event.start)} – ${timeOfDay(event.end)}`}
                      {event.location ? ` · ${event.location}` : ''}
                      {event.hangoutLink ? ' · Meet' : ''}
                    </div>
                  </div>
                  {event.responseStatus === 'needsAction' ? (
                    <span className="tag">RSVP</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Panel>
  );
}
