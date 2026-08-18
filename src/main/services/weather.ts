import type {
  ForecastDay,
  GeocodeResult,
  WeatherConfig,
  WeatherData,
} from '../../shared/types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/** WMO weather interpretation codes → label + an icon key the renderer draws. */
const WMO: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'clear' },
  1: { label: 'Mainly clear', icon: 'mostly-clear' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { label: 'Overcast', icon: 'cloudy' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Heavy drizzle', icon: 'drizzle' },
  56: { label: 'Freezing drizzle', icon: 'sleet' },
  57: { label: 'Freezing drizzle', icon: 'sleet' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'sleet' },
  67: { label: 'Freezing rain', icon: 'sleet' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Light showers', icon: 'showers' },
  81: { label: 'Showers', icon: 'showers' },
  82: { label: 'Violent showers', icon: 'showers' },
  85: { label: 'Snow showers', icon: 'snow' },
  86: { label: 'Snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunder' },
  96: { label: 'Thunderstorm, hail', icon: 'thunder' },
  99: { label: 'Thunderstorm, hail', icon: 'thunder' },
};

function describe(code: number): { label: string; icon: string } {
  return WMO[code] ?? { label: 'Unknown', icon: 'cloudy' };
}

function weekdayFor(isoDate: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
}

async function getJson(url: string): Promise<any> {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const data = await getJson(url);
  return (data.results ?? []).map((r: any) => ({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeather(config: WeatherConfig): Promise<WeatherData> {
  const metric = config.units === 'metric';
  const params = new URLSearchParams({
    latitude: String(config.latitude),
    longitude: String(config.longitude),
    timezone: 'auto',
    forecast_days: '7',
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset',
    temperature_unit: metric ? 'celsius' : 'fahrenheit',
    wind_speed_unit: metric ? 'kmh' : 'mph',
    precipitation_unit: metric ? 'mm' : 'inch',
  });

  const data = await getJson(`${FORECAST_URL}?${params.toString()}`);
  const current = data.current ?? {};
  const daily = data.daily ?? {};
  const currentInfo = describe(current.weather_code ?? 0);

  const forecast: ForecastDay[] = (daily.time ?? []).map((date: string, i: number) => {
    const info = describe(daily.weather_code?.[i] ?? 0);
    return {
      date,
      weekday: weekdayFor(date, i),
      weatherCode: daily.weather_code?.[i] ?? 0,
      description: info.label,
      icon: info.icon,
      tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
      precipitationSum: daily.precipitation_sum?.[i] ?? 0,
      windMax: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
      sunrise: daily.sunrise?.[i] ?? '',
      sunset: daily.sunset?.[i] ?? '',
    };
  });

  return {
    locationName: config.locationName,
    units: config.units,
    temperatureUnit: metric ? '°C' : '°F',
    windUnit: metric ? 'km/h' : 'mph',
    now: {
      temperature: Math.round(current.temperature_2m ?? 0),
      apparentTemperature: Math.round(current.apparent_temperature ?? 0),
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: Math.round(current.wind_speed_10m ?? 0),
      windDirection: current.wind_direction_10m ?? 0,
      precipitation: current.precipitation ?? 0,
      isDay: (current.is_day ?? 1) === 1,
      weatherCode: current.weather_code ?? 0,
      description: currentInfo.label,
      icon: currentInfo.icon,
    },
    forecast,
    updatedAt: Date.now(),
  };
}
