import { useTranslation } from 'react-i18next'
import './Header.css'

function Header({ theme, toggleTheme, isTelegram, user }) {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'blue': return '🌊'
      default: return '☀️'
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">⛅ {t('app.title')}</h1>
        {user && (
          <div className="user-info">
            <span className="user-greeting">
              {user.first_name ? `👋 ${user.first_name}` : ''}
            </span>
          </div>
        )}
      </div>
      <div className="header-right">
        <button className="header-btn" onClick={toggleLanguage}>
          {i18n.language === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
        </button>
        {!isTelegram && (
          <button className="header-btn theme-btn" onClick={toggleTheme} title={t(`theme.${theme}`)}>
            {getThemeIcon()}
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
