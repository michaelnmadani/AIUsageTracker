import React from 'react';

interface Props {
  icon: string;
  isDay?: boolean;
  size?: number;
}

/** Small inline SVG set so the app needs no icon font or network images. */
export function WeatherGlyph({ icon, isDay = true, size = 44 }: Props) {
  const sun = '#ffc95c';
  const moon = '#cfd8ef';
  const cloud = '#aeb9d0';
  const rain = '#5ec6e6';
  const snow = '#dceaff';
  const bolt = '#ffd93d';

  const body = () => {
    switch (icon) {
      case 'clear':
        return isDay ? (
          <>
            <circle cx="24" cy="24" r="9" fill={sun} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="24"
                y1="6"
                x2="24"
                y2="11"
                stroke={sun}
                strokeWidth="2.6"
                strokeLinecap="round"
                transform={`rotate(${angle} 24 24)`}
              />
            ))}
          </>
        ) : (
          <path
            d="M30 30a11 11 0 0 1-11-15 12 12 0 1 0 15 15 11 11 0 0 1-4 0Z"
            fill={moon}
          />
        );
      case 'mostly-clear':
      case 'partly-cloudy':
        return (
          <>
            {isDay ? (
              <circle cx="19" cy="18" r="7" fill={sun} />
            ) : (
              <path d="M24 22a8 8 0 0 1-8-11 9 9 0 1 0 11 11 8 8 0 0 1-3 0Z" fill={moon} />
            )}
            <path
              d="M17 36h16a6.5 6.5 0 0 0 .6-13A9 9 0 0 0 16 25a5.5 5.5 0 0 0 1 11Z"
              fill={cloud}
            />
          </>
        );
      case 'fog':
        return (
          <>
            <path d="M15 26h18a6 6 0 0 0 .6-12A9 9 0 0 0 14 16a5 5 0 0 0 1 10Z" fill={cloud} />
            {[32, 37, 42].map((y, i) => (
              <line
                key={y}
                x1={10 + i * 2}
                y1={y}
                x2={38 - i * 2}
                y2={y}
                stroke={cloud}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity={0.8 - i * 0.18}
              />
            ))}
          </>
        );
      case 'drizzle':
      case 'rain':
      case 'showers':
        return (
          <>
            <path d="M15 28h18a6.5 6.5 0 0 0 .6-13A9 9 0 0 0 14 17a5.5 5.5 0 0 0 1 11Z" fill={cloud} />
            {[16, 24, 32].map((x, i) => (
              <line
                key={x}
                x1={x}
                y1={33 + (i % 2)}
                x2={x - 3}
                y2={41 + (i % 2)}
                stroke={rain}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            ))}
          </>
        );
      case 'sleet':
      case 'snow':
        return (
          <>
            <path d="M15 28h18a6.5 6.5 0 0 0 .6-13A9 9 0 0 0 14 17a5.5 5.5 0 0 0 1 11Z" fill={cloud} />
            {[16, 24, 32].map((x) => (
              <g key={x} stroke={snow} strokeWidth="2" strokeLinecap="round">
                <line x1={x} y1="34" x2={x} y2="41" />
                <line x1={x - 3} y1="36" x2={x + 3} y2="39" />
                <line x1={x + 3} y1="36" x2={x - 3} y2="39" />
              </g>
            ))}
          </>
        );
      case 'thunder':
        return (
          <>
            <path d="M15 27h18a6.5 6.5 0 0 0 .6-13A9 9 0 0 0 14 16a5.5 5.5 0 0 0 1 11Z" fill={cloud} />
            <path d="M25 30l-7 9h5l-2 8 9-11h-5l3-6Z" fill={bolt} />
          </>
        );
      default:
        return <path d="M15 32h18a7 7 0 0 0 .6-14A9.5 9.5 0 0 0 14 20a6 6 0 0 0 1 12Z" fill={cloud} />;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {body()}
    </svg>
  );
}
