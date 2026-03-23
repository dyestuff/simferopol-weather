import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import CurrentWeather from './components/CurrentWeather'
import HourlyForecast from './components/HourlyForecast'
import DailyForecast from './components/DailyForecast'
import WeatherAlerts from './components/WeatherAlerts'
import HistoricalData from './components/HistoricalData'
import { useTelegram } from './hooks/useTelegram'

// Mock data - matches API structure
const mockWeatherData = {
  current: {
    temperature_2m: 15,
    relative_humidity_2m: 65,
    apparent_temperature: 13,
    precipitation: 0,
    weather_code: 2,
    cloud_cover: 40,
    pressure_msl: 1015,
    wind_speed_10m: 12,
    wind_direction_10m: 180
  },
  hourly: {
    time: Array.from({length: 48}, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
    temperature_2m: Array.from({length: 48}, () => 10 + Math.random() * 10),
    precipitation_probability: Array.from({length: 48}, () => Math.floor(Math.random() * 30)),
    weather_code: Array.from({length: 48}, () => Math.floor(Math.random() * 4)),
    wind_speed_10m: Array.from({length: 48}, () => 5 + Math.random() * 15)
  },
  daily: {
    time: Array.from({length: 7}, (_, i) => new Date(Date.now() + i * 86400000).toISOString().split('T')[0]),
    weather_code: Array.from({length: 7}, () => Math.floor(Math.random() * 4)),
    temperature_2m_max: Array.from({length: 7}, () => 15 + Math.random() * 10),
    temperature_2m_min: Array.from({length: 7}, () => 5 + Math.random() * 8),
    sunrise: Array.from({length: 7}, (_, i) => new Date(Date.now() + i * 86400000).toISOString().split('T')[0] + 'T06:30'),
    sunset: Array.from({length: 7}, (_, i) => new Date(Date.now() + i * 86400000).toISOString().split('T')[0] + 'T18:30'),
    precipitation_sum: Array.from({length: 7}, () => Math.random() * 5),
    precipitation_probability_max: Array.from({length: 7}, () => Math.floor(Math.random() * 50)),
    wind_speed_10m_max: Array.from({length: 7}, () => 10 + Math.random() * 20)
  }
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const COORDS = { latitude: 44.9375, longitude: 34.125 }

function fetchWithTimeout(url, timeoutMs = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ])
}

async function fetchWeatherData() {
  const params = new URLSearchParams({
    ...COORDS,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    forecast_days: 7,
    timezone: 'auto'
  })
  
  const response = await fetchWithTimeout(`${BASE_URL}?${params}`)
  if (!response.ok) throw new Error('Failed')
  return response.json()
}

function App() {
  const { t } = useTranslation()
  const { themeParams, colorScheme, isTelegram, user } = useTelegram()
  
  const [theme, setTheme] = useState(() => {
    if (isTelegram) {
      return colorScheme === 'dark' ? 'dark' : 'light'
    }
    return localStorage.getItem('theme') || 'light'
  })
  
  const [weatherData, setWeatherData] = useState(mockWeatherData)

  useEffect(() => {
    if (isTelegram && themeParams) {
      const root = document.documentElement
      if (themeParams.bg_color) root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
      if (themeParams.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color)
      if (themeParams.text_color) root.style.setProperty('--tg-theme-text-color', themeParams.text_color)
      if (themeParams.hint_color) root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
      if (themeParams.link_color) root.style.setProperty('--tg-theme-link-color', themeParams.link_color)
      if (themeParams.button_color) root.style.setProperty('--tg-theme-button-color', themeParams.button_color)
      if (themeParams.button_text_color) root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color)
    }
  }, [isTelegram, themeParams])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (!isTelegram) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, isTelegram])

  useEffect(() => {
    fetchWeatherData().then(data => {
      setWeatherData(data)
    }).catch(err => {
      console.log('Using mock data:', err.message)
    })
  }, [])

  const toggleTheme = () => {
    if (isTelegram) return
    setTheme(prev => {
      const themes = ['light', 'dark', 'blue']
      const currentIndex = themes.indexOf(prev)
      return themes[(currentIndex + 1) % themes.length]
    })
  }

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} isTelegram={isTelegram} user={user} />
      <WeatherAlerts current={weatherData.current} />
      <CurrentWeather data={weatherData.current} />
      <HourlyForecast data={weatherData.hourly} />
      <DailyForecast data={weatherData.daily} />
      <HistoricalData />
    </div>
  )
}

export default App
