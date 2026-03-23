import { useTranslation } from 'react-i18next'
import { getWeatherInfo } from '../services/weatherApi'
import './CurrentWeather.css'

function CurrentWeather({ data }) {
  const { t } = useTranslation()
  
  if (!data) {
    return (
      <div className="card current-weather">
        <h2 className="card-title">📍 {t('current.title')}</h2>
        <div className="loading">{t('app.loading')}</div>
      </div>
    )
  }

  const weatherInfo = getWeatherInfo(data.weather_code || 0)

  const getWindDirection = (degrees) => {
    if (degrees === undefined || degrees === null) return ''
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  return (
    <div className="card current-weather">
      <h2 className="card-title">📍 {t('current.title')}</h2>
      
      <div className="current-main">
        <div className="current-temp">
          <span className="temp-value">{Math.round(data.temperature_2m || 0)}</span>
          <span className="temp-unit">{t('units.celsius')}</span>
        </div>
        <div className="current-info">
          <div className="weather-desc">{weatherInfo.description}</div>
          <div className="feels-like">
            {t('current.feelsLike')}: {Math.round(data.apparent_temperature || 0)}{t('units.celsius')}
          </div>
        </div>
      </div>

      <div className="current-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-content">
            <span className="detail-label">{t('current.humidity')}</span>
            <span className="detail-value">{data.relative_humidity_2m || 0}{t('units.percent')}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-content">
            <span className="detail-label">{t('current.wind')}</span>
            <span className="detail-value">
              {Math.round(data.wind_speed_10m || 0)} {t('units.kmh')} {getWindDirection(data.wind_direction_10m)}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <div className="detail-content">
            <span className="detail-label">{t('current.pressure')}</span>
            <span className="detail-value">{Math.round(data.pressure_msl || 0)} {t('units.hPa')}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">☁️</span>
          <div className="detail-content">
            <span className="detail-label">Cloud Cover</span>
            <span className="detail-value">{data.cloud_cover || 0}{t('units.percent')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather
