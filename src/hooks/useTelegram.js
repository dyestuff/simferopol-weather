import { useState, useEffect } from 'react'

const tg = window.Telegram?.WebApp

export function useTelegram() {
  const [themeParams, setThemeParams] = useState(tg?.themeParams || {})
  const [platform, setPlatform] = useState(tg?.platform || 'unknown')
  const [colorScheme, setColorScheme] = useState(tg?.colorScheme || 'light')

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
      
      setThemeParams(tg.themeParams || {})
      setPlatform(tg.platform || 'unknown')
      setColorScheme(tg.colorScheme || 'light')

      const handleThemeChange = () => {
        setThemeParams(tg.themeParams || {})
        setColorScheme(tg.colorScheme || 'light')
      }

      tg.onEvent('themeChanged', handleThemeChange)
      
      return () => {
        tg.offEvent('themeChanged', handleThemeChange)
      }
    }
  }, [])

  const close = () => {
    if (tg) {
      tg.close()
    }
  }

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback)
    } else {
      const result = confirm(message)
      callback(result)
    }
  }

  const setHeaderColor = (color) => {
    if (tg) {
      tg.setHeaderColor(color)
    }
  }

  const setBackgroundColor = (color) => {
    if (tg) {
      tg.setBackgroundColor(color)
    }
  }

  return {
    tg,
    themeParams,
    platform,
    colorScheme,
    isTelegram: !!tg,
    close,
    showAlert,
    showConfirm,
    setHeaderColor,
    setBackgroundColor,
    user: tg?.initDataUnsafe?.user || null
  }
}
