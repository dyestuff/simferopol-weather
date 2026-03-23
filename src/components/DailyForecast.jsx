import { useTranslation } from 'react-i18next'
import { getWeatherInfo } from '../services/weatherApi'
import './DailyForecast.css'

function DailyForecast({ data }) {
  const { t } = useTranslation()

  if (!data || !data.time) {
    return (
      <div className="card daily-forecast">
        <h2 className="card-title">📅 {t('daily.title')}</h2>
        <div className="loading">{t('app.loading')}</div>
      </div>
    )
  }

  const getDayName = (dateString, index) => {
    if (index === 0) return 'Today'
    const date = new Date(dateString)
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    return t(`days.${dayNames[date.getDay()]}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="card daily-forecast">
      <h2 className="card-title">📅 {t('daily.title')}</h2>
      
      <div className="daily-list">
        {data.time.map((date, i) => {
          const weatherInfo = getWeatherInfo(data.weather_code?.[i] || 0)
          const tempMax = Math.round(data.temperature_2m_max?.[i] || 0)
          const tempMin = Math.round(data.temperature_2m_min?.[i] || 0)
          
          return (
            <div key={i} className="daily-item">
              <div className="daily-day">
                <span className="day-name">{getDayName(date, i)}</span>
                <span className="day-date">{formatDate(date)}</span>
              </div>
              
              <div className="daily-weather">
                <span className="weather-icon">☀️</span>
                <span className="weather-desc">{weatherInfo.description}</span>
              </div>
              
              <div className="daily-temps">
                <span className="temp-high">{t('daily.high')} {tempMax}°</span>
                <span className="temp-low">{t('daily.low')} {tempMin}°</span>
              </div>
              
              <div className="daily-details">
                <span className="detail">💧 {Math.round(data.precipitation_probability_max?.[i] || 0)}%</span>
                <span className="detail">💨 {Math.round(data.wind_speed_10m_max?.[i] || 0)} {t('units.kmh')}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyForecast
