import React from 'react';
import { Empty, Panel } from '../components/Panel';
import { WeatherGlyph } from '../components/WeatherGlyph';
import { relativeTime } from '../lib/format';
import type { WeatherData } from '../../shared/types';

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function WeatherPanel({
  weather,
  error,
}: {
  weather: WeatherData | null;
  error?: string | null;
}) {
  if (!weather) {
    return (
      <Panel title="Weather" problem={error}>
        <Empty>{error ?? 'Loading conditions…'}</Empty>
      </Panel>
    );
  }

  const { now } = weather;
  const bearing = COMPASS[Math.round(now.windDirection / 45) % 8];

  return (
    <Panel
      title="Weather"
      problem={error}
      meta={<span title={weather.locationName}>{relativeTime(weather.updatedAt)}</span>}
    >
      <div className="weather__now">
        <WeatherGlyph icon={now.icon} isDay={now.isDay} size={58} />
        <div>
          <div className="weather__temp">
            {now.temperature}
            {weather.temperatureUnit}
          </div>
          <div className="weather__desc">
            {now.description} · feels {now.apparentTemperature}
            {weather.temperatureUnit}
          </div>
        </div>
      </div>

      <div className="weather__grid">
        <div className="stat">
          <div className="stat__value" style={{ fontSize: 17 }}>
            {now.windSpeed}
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}> {weather.windUnit}</span>
          </div>
          <div className="stat__label">Wind {bearing}</div>
        </div>
        <div className="stat">
          <div className="stat__value" style={{ fontSize: 17 }}>
            {now.humidity}%
          </div>
          <div className="stat__label">Humidity</div>
        </div>
        <div className="stat">
          <div className="stat__value" style={{ fontSize: 17 }}>
            {now.precipitation}
          </div>
          <div className="stat__label">Precip {weather.units === 'metric' ? 'mm' : 'in'}</div>
        </div>
      </div>

      <div className="clock__zone" style={{ marginTop: 12 }}>
        {weather.locationName}
      </div>
    </Panel>
  );
}
