const SIMFEROPOL_COORDS = {
  latitude: 44.9375,
  longitude: 34.125
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function getCurrentWeather() {
  const params = new URLSearchParams({
    latitude: SIMFEROPOL_COORDS.latitude,
    longitude: SIMFEROPOL_COORDS.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
    timezone: 'auto'
  })

  const response = await fetch(`${BASE_URL}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch current weather')
  return response.json()
}

export async function getHourlyForecast() {
  const params = new URLSearchParams({
    latitude: SIMFEROPOL_COORDS.latitude,
    longitude: SIMFEROPOL_COORDS.longitude,
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    forecast_days: 2,
    timezone: 'auto'
  })

  const response = await fetch(`${BASE_URL}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch hourly forecast')
  return response.json()
}

export async function getDailyForecast() {
  const params = new URLSearchParams({
    latitude: SIMFEROPOL_COORDS.latitude,
    longitude: SIMFEROPOL_COORDS.longitude,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto'
  })

  const response = await fetch(`${BASE_URL}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch daily forecast')
  return response.json()
}

export async function getHistoricalWeather(days = 7) {
  const params = new URLSearchParams({
    latitude: SIMFEROPOL_COORDS.latitude,
    longitude: SIMFEROPOL_COORDS.longitude,
    hourly: 'temperature_2m,precipitation,weather_code',
    past_days: days,
    forecast_days: 1,
    timezone: 'auto'
  })

  const response = await fetch(`${BASE_URL}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch historical weather')
  return response.json()
}

export const weatherCodes = {
  0: { description: 'Clear sky', icon: '01d' },
  1: { description: 'Mainly clear', icon: '02d' },
  2: { description: 'Partly cloudy', icon: '03d' },
  3: { description: 'Overcast', icon: '04d' },
  45: { description: 'Fog', icon: '50d' },
  48: { description: 'Depositing rime fog', icon: '50d' },
  51: { description: 'Light drizzle', icon: '09d' },
  53: { description: 'Moderate drizzle', icon: '09d' },
  55: { description: 'Dense drizzle', icon: '09d' },
  61: { description: 'Slight rain', icon: '10d' },
  63: { description: 'Moderate rain', icon: '10d' },
  65: { description: 'Heavy rain', icon: '10d' },
  66: { description: 'Light freezing rain', icon: '13d' },
  67: { description: 'Heavy freezing rain', icon: '13d' },
  71: { description: 'Slight snow', icon: '13d' },
  73: { description: 'Moderate snow', icon: '13d' },
  75: { description: 'Heavy snow', icon: '13d' },
  77: { description: 'Snow grains', icon: '13d' },
  80: { description: 'Slight rain showers', icon: '09d' },
  81: { description: 'Moderate rain showers', icon: '09d' },
  82: { description: 'Violent rain showers', icon: '09d' },
  85: { description: 'Slight snow showers', icon: '13d' },
  86: { description: 'Heavy snow showers', icon: '13d' },
  95: { description: 'Thunderstorm', icon: '11d' },
  96: { description: 'Thunderstorm with hail', icon: '11d' },
  99: { description: 'Thunderstorm with heavy hail', icon: '11d' }
}

export function getWeatherInfo(code) {
  return weatherCodes[code] || { description: 'Unknown', icon: '01d' }
}
