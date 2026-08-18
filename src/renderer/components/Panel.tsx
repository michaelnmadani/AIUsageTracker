import React from 'react';

interface PanelProps {
  title: string;
  meta?: React.ReactNode;
  /** Last error for this data source, shown as a badge rather than swallowed. */
  problem?: string | null;
  className?: string;
  children: React.ReactNode;
}

export function Panel({ title, meta, problem, className = '', children }: PanelProps) {
  return (
    <section className={`panel ${problem ? 'panel--error ' : ''}${className}`}>
      <header className="panel__head">
        <h2 className="panel__title">{title}</h2>
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
