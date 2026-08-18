import React, { useEffect, useRef, useState } from 'react';

interface PanelProps {
  title: string;
  meta?: React.ReactNode;
  /** Last error for this data source, shown as a badge rather than swallowed. */
  problem?: string | null;
  /** Changes whenever fresh data lands — flares the head glyph when it does. */
  pulse?: number;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function Panel({
  title,
  meta,
  problem,
  pulse,
  id,
  className = '',
  children,
}: PanelProps) {
  const [live, setLive] = useState(false);
  const previous = useRef(pulse);

  useEffect(() => {
    if (pulse === undefined || pulse === previous.current) return;
    previous.current = pulse;
    setLive(true);
    const timer = setTimeout(() => setLive(false), 900);
    return () => clearTimeout(timer);
  }, [pulse]);

  return (
    <section id={id} className={`panel ${problem ? 'panel--error ' : ''}${className}`}>
      <span className="panel__sweep" aria-hidden="true" />
      <header className="panel__head">
        <span className={`panel__glyph${live ? ' panel__glyph--live' : ''}`} aria-hidden="true" />
        <h2 className="panel__title">{title}</h2>
        <span className="panel__rule" aria-hidden="true" />
        {meta || problem ? (
          <div className="panel__meta">
            {meta}
            {problem ? (
              <span className="tag tag--bad" title={problem}>
                !
              </span>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="panel__empty">{children}</div>;
}
