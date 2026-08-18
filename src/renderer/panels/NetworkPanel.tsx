import React, { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { Empty, Panel } from '../components/Panel';
import { api } from '../lib/api';
import { bitrate, bytes, relativeTime } from '../lib/format';
import type { NetworkData } from '../../shared/types';

export function NetworkPanel({ network }: { network: NetworkData | null }) {
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    try {
      await api.runSpeedTest();
    } finally {
      setTesting(false);
    }
  };

  if (!network) {
    return (
      <Panel title="Network">
        <Empty>Sampling interface counters…</Empty>
      </Panel>
    );
  }

  const down = bitrate(network.downloadBps);
  const up = bitrate(network.uploadBps);
  const chart = network.history.map((sample) => ({
    t: sample.timestamp,
    down: sample.downloadBps / 1e6,
    up: sample.uploadBps / 1e6,
  }));

  return (
    <Panel
      title="Network"
      meta={
        <>
          <span>{network.interfaceName}</span>
          <button className="btn btn--icon" disabled={testing} onClick={() => void runTest()}>
            {testing ? 'Testing…' : 'Speed test'}
          </button>
        </>
      }
    >
      <div className="net__readings">
        <div className={`net__reading${network.downloadBps > 50_000 ? ' net__reading--active' : ''}`}>
          <div className="stat__label" style={{ color: 'var(--down)' }}>
            ↓ Download
          </div>
          <div className="net__value">
            {down.value}
            <span className="net__unit">{down.unit}</span>
          </div>
          <div className="item__sub">
            peak {bitrate(network.peakDownloadBps).value} {bitrate(network.peakDownloadBps).unit} ·{' '}
            {bytes(network.totalDownloadBytes)} this session
          </div>
        </div>
        <div className={`net__reading${network.uploadBps > 50_000 ? ' net__reading--active' : ''}`}>
          <div className="stat__label" style={{ color: 'var(--up)' }}>
            ↑ Upload
          </div>
          <div className="net__value">
            {up.value}
            <span className="net__unit">{up.unit}</span>
          </div>
          <div className="item__sub">
            peak {bitrate(network.peakUploadBps).value} {bitrate(network.peakUploadBps).unit} ·{' '}
            {bytes(network.totalUploadBytes)} this session
          </div>
        </div>
      </div>

      <div className="net__chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="downFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ec6e6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#5ec6e6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="upFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb547" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#ffb547" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{
                background: 'rgba(8, 19, 31, 0.9)',
                border: '1px solid rgba(94,214,255,0.35)',
                borderRadius: 3,
                fontFamily: 'var(--mono)',
                fontSize: 11,
              }}
              labelFormatter={() => ''}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} Mb/s`,
                name === 'down' ? 'Download' : 'Upload',
              ]}
            />
            <Area
              type="monotone"
              dataKey="down"
              stroke="#5ec6e6"
              strokeWidth={1.6}
              fill="url(#downFill)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="up"
              stroke="#ffb547"
              strokeWidth={1.6}
              fill="url(#upFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {network.lastSpeedTest ? (
        <div className="item__sub" style={{ marginTop: 8 }}>
          Last test: {network.lastSpeedTest.downloadMbps.toFixed(1)} Mb/s down ·{' '}
          {network.lastSpeedTest.uploadMbps.toFixed(1)} Mb/s up ·{' '}
          {network.lastSpeedTest.latencyMs} ms · {relativeTime(network.lastSpeedTest.ranAt)}
        </div>
      ) : null}
    </Panel>
  );
}
