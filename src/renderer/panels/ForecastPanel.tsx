import React from 'react';
import { Empty, Panel } from '../components/Panel';
import { WeatherGlyph } from '../components/WeatherGlyph';
import type { WeatherData } from '../../shared/types';

export function ForecastPanel({
  weather,
  error,
}: {
  weather: WeatherData | null;
  error?: string | null;
}) {
  if (!weather || weather.forecast.length === 0) {
    return (
      <Panel title="7-day forecast" problem={error}>
        <Empty>{error ?? 'Loading forecast…'}</Empty>
      </Panel>
    );
  }

  return (
    <Panel
      title="7-day forecast"
      problem={error}
      pulse={weather.updatedAt}
      meta={<span>{weather.locationName}</span>}
    >
      <div className="forecast">
        {weather.forecast.map((day, index) => (
          <div
            key={day.date}
            className={`forecast__day${index === 0 ? ' forecast__day--today' : ''}`}
            title={`${day.description} · wind to ${day.windMax} ${weather.windUnit}`}
          >
            <div className="forecast__label">{day.weekday}</div>
            <WeatherGlyph icon={day.icon} size={30} />
            <div className="forecast__range">
              <b>
                {day.tempMax}
                {weather.temperatureUnit}
              </b>{' '}
              <span>
                {day.tempMin}
                {weather.temperatureUnit}
              </span>
            </div>
            <div className="forecast__rain">
              {day.precipitationProbability > 0 ? `${day.precipitationProbability}%` : '—'}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
