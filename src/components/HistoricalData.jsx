import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getHistoricalWeather } from '../services/weatherApi'
import './HistoricalData.css'

function HistoricalData() {
  const { t } = useTranslation()
  const [historicalData, setHistoricalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getHistoricalWeather(days)
        setHistoricalData(data)
      } catch (error) {
        console.error('Failed to fetch historical data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [days])

  const formatDay = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const chartData = historicalData?.hourly?.time
    ?.filter((_, i) => i % 24 === 0)
    .map((time, i) => ({
      day: formatDay(time),
      temp: historicalData.hourly.temperature_2m[i * 24]
    })) || []

  return (
    <div className="card historical-data">
      <div className="historical-header">
        <h2 className="card-title">📊 {t('historical.title')}</h2>
        <div className="day-selector">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              className={`day-btn ${days === d ? 'active' : ''}`}
              onClick={() => setDays(d)}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="historical-loading">{t('app.loading')}</div>
      ) : (
        <div className="historical-content">
          <div className="historical-chart">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="var(--accent-color)" 
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                  name={`Temperature (${t('units.celsius')})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="historical-summary">
            {historicalData?.hourly?.temperature_2m && (
              <>
                <div className="summary-item">
                  <span className="summary-label">Average</span>
                  <span className="summary-value">
                    {(historicalData.hourly.temperature_2m.reduce((a, b) => a + b, 0) / historicalData.hourly.temperature_2m.length).toFixed(1)}°
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Max</span>
                  <span className="summary-value">{Math.max(...historicalData.hourly.temperature_2m).toFixed(1)}°</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Min</span>
                  <span className="summary-value">{Math.min(...historicalData.hourly.temperature_2m).toFixed(1)}°</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricalData
