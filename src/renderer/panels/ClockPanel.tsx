import React, { useEffect, useState } from 'react';
import { Panel } from '../components/Panel';
import { clockTime } from '../lib/format';

interface Props {
  use24h: boolean;
  showSeconds: boolean;
}

export function ClockPanel({ use24h, showSeconds }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { main, seconds, suffix } = clockTime(now, use24h);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Panel title="Time" meta={<span>Week {isoWeek(now)}</span>}>
      <div className="clock__time">
        {main}
        {showSeconds ? <span className="clock__seconds">:{seconds}</span> : null}
        {suffix ? <span className="clock__seconds"> {suffix}</span> : null}
      </div>
      <div className="clock__date">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
      <div className="clock__zone">{zone}</div>
    </Panel>
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
