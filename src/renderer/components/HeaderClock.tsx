import React, { useEffect, useState } from 'react';

interface Props {
  use24h: boolean;
  showSeconds: boolean;
  operator: string;
}

function greeting(hour: number): string {
  if (hour < 5) return 'Good night,';
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

/** The header readout: greeting on the left, live clock on the right. */
export function HeaderClock({ use24h, showSeconds, operator }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours24 = now.getHours();
  const hours = use24h ? hours24 : hours24 % 12 || 12;
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <>
      <div>
        <div className="hud-head__greeting">
          {greeting(hours24)}
          <span className="hud-head__name">{operator}</span>
        </div>
        <div className="hud-head__tagline">
          Systems online · Telemetry nominal · Standing by
        </div>
      </div>

      <div className="hud-head__right">
        <div className="hud-clock">
          {use24h ? pad(hours) : hours}
          <span className="hud-clock__colon">:</span>
          {pad(now.getMinutes())}
          {showSeconds ? <span className="hud-clock__sec">:{pad(now.getSeconds())}</span> : null}
          {!use24h ? (
            <span className="hud-clock__suffix"> {hours24 < 12 ? 'AM' : 'PM'}</span>
          ) : null}
        </div>
        <div className="hud-clock__date">
          {now.toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {' · W'}
          {isoWeek(now)}
        </div>
      </div>
    </>
  );
}

function isoWeek(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO weeks run Monday–Sunday and week 1 always contains the 4th of January.
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}
