import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getWeatherInfo } from '../services/weatherApi'
import './HourlyForecast.css'

function HourlyForecast({ data }) {
  const { t } = useTranslation()

  if (!data || !data.time) {
    return (
      <div className="card hourly-forecast">
        <h2 className="card-title">⏰ {t('hourly.title')}</h2>
        <div className="loading">{t('app.loading')}</div>
      </div>
    )
  }

  const formatHour = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const chartData = data.time.slice(0, 24).map((time, i) => ({
    time: formatHour(time),
    temp: data.temperature_2m?.[i] || 0,
    precip: data.precipitation_probability?.[i] || 0,
    weatherCode: data.weather_code?.[i] || 0
  }))

  return (
    <div className="card hourly-forecast">
      <h2 className="card-title">⏰ {t('hourly.title')}</h2>
      
      <div className="hourly-chart">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis 
              dataKey="time" 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="var(--accent-color)" 
              strokeWidth={2}
              dot={false}
              name={`Temperature (${t('units.celsius')})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="hourly-list">
        {chartData.slice(0, 12).map((item, i) => (
          <div key={i} className="hourly-item">
            <span className="hourly-time">{item.time}</span>
            <span className="hourly-icon">🌡️</span>
            <span className="hourly-temp">{Math.round(item.temp)}°</span>
            <span className="hourly-precip">💧 {item.precip}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HourlyForecast
