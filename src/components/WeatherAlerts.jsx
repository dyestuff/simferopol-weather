import { useTranslation } from 'react-i18next'
import './WeatherAlerts.css'

function WeatherAlerts({ current }) {
  const { t } = useTranslation()

  if (!current) {
    return (
      <div className="card alerts-card no-alerts">
        <h2 className="card-title">🔔 {t('alerts.title')}</h2>
        <div className="no-alerts-message">
          <span className="success-icon">✅</span>
          <span>{t('alerts.noAlerts')}</span>
        </div>
      </div>
    )
  }

  const alerts = []

  // Check for extreme cold (below -10°C)
  if (current.temperature_2m < -10) {
    alerts.push({
      type: 'extremeCold',
      severity: 'danger',
      icon: '🥶'
    })
  }

  // Check for extreme heat (above 35°C)
  if (current.temperature_2m > 35) {
    alerts.push({
      type: 'extremeHeat',
      severity: 'danger',
      icon: '🔥'
    })
  }

  // Check for high wind (above 50 km/h)
  if (current.wind_speed_10m > 50) {
    alerts.push({
      type: 'highWind',
      severity: 'warning',
      icon: '💨'
    })
  }

  // Check for heavy rain/snow
  if (current.precipitation > 5) {
    alerts.push({
      type: 'heavyRain',
      severity: 'warning',
      icon: '🌧️'
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="card alerts-card no-alerts">
        <h2 className="card-title">🔔 {t('alerts.title')}</h2>
        <div className="no-alerts-message">
          <span className="success-icon">✅</span>
          <span>{t('alerts.noAlerts')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card alerts-card">
      <h2 className="card-title">🔔 {t('alerts.title')}</h2>
      <div className="alerts-list">
        {alerts.map((alert, i) => (
          <div key={i} className={`alert-item alert-${alert.severity}`}>
            <span className="alert-icon">{alert.icon}</span>
            <span className="alert-message">{t(`alerts.${alert.type}`)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherAlerts
