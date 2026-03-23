import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import CurrentWeather from './components/CurrentWeather'
import HourlyForecast from './components/HourlyForecast'
import DailyForecast from './components/DailyForecast'
import WeatherAlerts from './components/WeatherAlerts'
import HistoricalData from './components/HistoricalData'
import { getCurrentWeather, getHourlyForecast, getDailyForecast } from './services/weatherApi'
import { useTelegram } from './hooks/useTelegram'

// Mock data for fallback
const mockCurrent = {
  temperature_2m: 15,
  relative_humidity_2m: 65,
  apparent_temperature: 13,
  precipitation: 0,
  weather_code: 2,
  cloud_cover: 40,
  pressure_msl: 1015,
  wind_speed_10m: 12,
  wind_direction_10m: 180
}

const mockHourly = {
  time: Array.from({length: 48}, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
  temperature_2m: Array.from({length: 48}, () => 10 + Math.random() * 10),
  precipitation_probability: Array.from({length: 48}, () => Math.floor(Math.random() * 30)),
  weather_code: Array.from({length: 48}, () => Math.floor(Math.random() * 4)),
  wind_speed_10m: Array.from({length: 48}, () => 5 + Math.random() * 15)
}

const mockDaily = {
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

function App() {
  const { t } = useTranslation()
  const { themeParams, colorScheme, isTelegram, setHeaderColor, setBackgroundColor, user } = useTelegram()
  
  const [theme, setTheme] = useState(() => {
    if (isTelegram) {
      return colorScheme === 'dark' ? 'dark' : 'light'
    }
    return localStorage.getItem('theme') || 'light'
  })
  
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Apply Telegram theme
  useEffect(() => {
    if (isTelegram && themeParams) {
      const root = document.documentElement
      if (themeParams.bg_color) {
        root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
        root.style.setProperty('--bg-primary', themeParams.bg_color)
      }
      if (themeParams.secondary_bg_color) {
        root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color)
        root.style.setProperty('--bg-card', themeParams.secondary_bg_color)
      }
      if (themeParams.text_color) {
        root.style.setProperty('--tg-theme-text-color', themeParams.text_color)
        root.style.setProperty('--text-primary', themeParams.text_color)
      }
      if (themeParams.hint_color) {
        root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
        root.style.setProperty('--text-muted', themeParams.hint_color)
      }
      if (themeParams.link_color) {
        root.style.setProperty('--tg-theme-link-color', themeParams.link_color)
        root.style.setProperty('--accent-color', themeParams.link_color)
      }
      if (themeParams.button_color) {
        root.style.setProperty('--tg-theme-button-color', themeParams.button_color)
      }
      if (themeParams.button_text_color) {
        root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color)
      }
    }
  }, [isTelegram, themeParams])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (!isTelegram) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, isTelegram])

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        const [current, hourly, daily] = await Promise.all([
          getCurrentWeather(),
          getHourlyForecast(),
          getDailyForecast()
        ])
        setWeatherData({ current, hourly, daily })
        setError(null)
      } catch (err) {
        console.error('Weather fetch error:', err)
        // Use mock data as fallback
        setWeatherData({
          current: { current: mockCurrent },
          hourly: { hourly: mockHourly },
          daily: { daily: mockDaily }
        })
        setError(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
    
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    if (isTelegram) {
      // In Telegram, we can only switch between light/dark based on Telegram's theme
      return
    }
    setTheme(prev => {
      const themes = ['light', 'dark', 'blue']
      const currentIndex = themes.indexOf(prev)
      return themes[(currentIndex + 1) % themes.length]
    })
  }

  if (loading) {
    return (
      <div className="app">
        <Header theme={theme} toggleTheme={toggleTheme} isTelegram={isTelegram} user={user} />
        <div className="loading">{t('app.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header theme={theme} toggleTheme={toggleTheme} isTelegram={isTelegram} user={user} />
        <div className="error">{t('app.error')}: {error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} isTelegram={isTelegram} user={user} />
      <WeatherAlerts current={weatherData.current.current} />
      <CurrentWeather data={weatherData.current.current} />
      <HourlyForecast data={weatherData.hourly.hourly} />
      <DailyForecast data={weatherData.daily.daily} />
      <HistoricalData />
    </div>
  )
}

export default App
