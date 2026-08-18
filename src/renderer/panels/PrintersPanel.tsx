import React from 'react';
import { Empty, Panel } from '../components/Panel';
import { ProgressRing } from '../components/ProgressRing';
import { duration, relativeTime } from '../lib/format';
import type { PrinterState, PrintersData, PrinterStatus } from '../../shared/types';

const STATE_COLOUR: Record<PrinterState, string> = {
  offline: 'var(--text-faint)',
  idle: 'var(--text-dim)',
  printing: 'var(--accent)',
  paused: 'var(--warn)',
  finished: 'var(--good)',
  error: 'var(--bad)',
  connecting: 'var(--text-dim)',
};

function temp(current: number | null, target: number | null): string {
  if (current === null) return '—';
  const rounded = Math.round(current);
  return target && target > 0 ? `${rounded}/${Math.round(target)}°` : `${rounded}°`;
}

function PrinterCard({ printer }: { printer: PrinterStatus }) {
  const colour = STATE_COLOUR[printer.state];
  const isPrinting = printer.state === 'printing' || printer.state === 'paused';

  return (
    <div className="printer">
      <div className="printer__ring">
        <ProgressRing
          progress={isPrinting ? printer.progress : printer.state === 'finished' ? 100 : 0}
          colour={colour}
          active={printer.state === 'printing'}
          label={isPrinting ? `${Math.round(printer.progress)}%` : printer.stateLabel}
          sublabel={
            isPrinting && printer.totalLayers
              ? `${printer.layer ?? 0}/${printer.totalLayers}`
              : printer.brand === 'bambu'
                ? 'Bambu'
                : 'Elegoo'
          }
        />
      </div>
      <div className="printer__body">
        <div className="printer__name">
          <span className="dot" style={{ background: colour }} />
          {printer.name}
          <span className="tag">{printer.model}</span>
        </div>
        <div className="printer__job">
          {printer.jobName ?? (printer.state === 'offline' ? printer.host : 'No active job')}
        </div>
        <div className="printer__stats">
          <span>
            Nozzle <b>{temp(printer.nozzleTemp, printer.nozzleTarget)}</b>
          </span>
          <span>
            Bed <b>{temp(printer.bedTemp, printer.bedTarget)}</b>
          </span>
          {printer.chamberTemp !== null ? (
            <span>
              Chamber <b>{Math.round(printer.chamberTemp)}°</b>
            </span>
          ) : null}
          {printer.remainingSeconds !== null && isPrinting ? (
            <span>
              ETA <b>{duration(printer.remainingSeconds)}</b>
            </span>
          ) : null}
          {printer.speedLevel ? (
            <span>
              Speed <b>{printer.speedLevel}</b>
            </span>
          ) : null}
          {printer.filament ? (
            <span>
              Filament <b>{printer.filament}</b>
            </span>
          ) : null}
        </div>
        {printer.error ? <div className="printer__error">{printer.error}</div> : null}
      </div>
    </div>
  );
}

export function PrintersPanel({
  printers,
  error,
  onOpenSettings,
}: {
  printers: PrintersData | null;
  error?: string | null;
  onOpenSettings: () => void;
}) {
  if (!printers || printers.printers.length === 0) {
    return (
      <Panel title="3D printers" problem={error}>
        <Empty>
          {error ?? 'No printers configured.'}
          <br />
          <button className="btn btn--primary" style={{ marginTop: 10 }} onClick={onOpenSettings}>
            Add a printer
          </button>
        </Empty>
      </Panel>
    );
  }

  const active = printers.printers.filter((printer) => printer.state === 'printing').length;

  return (
    <Panel
      title="3D printers"
      problem={error}
      pulse={printers.updatedAt}
      meta={
        <>
          <span>
            {active} printing · {printers.printers.length} total
          </span>
          <span>·</span>
          <span>{relativeTime(printers.updatedAt)}</span>
        </>
      }
    >
      <div className="list">
        {printers.printers.map((printer) => (
          <PrinterCard key={printer.id} printer={printer} />
        ))}
      </div>
    </Panel>
  );
}
