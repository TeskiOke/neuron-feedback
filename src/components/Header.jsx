import React, { useState, useEffect } from 'react';
import { ACCENT_COLORS, PROFANITY_ALERT_COLOR, applyAccentColor } from '../data/accentColors';
import NeironLogo from './NeironLogo';

export default function Header({ isProfanityAlert = false }) {
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('unio_theme_mode') || 'dark';
  });

  
  const [colorIndex, setColorIndex] = useState(() => {
    return Math.floor(Math.random() * ACCENT_COLORS.length);
  });

  
  const [arrowRotation, setArrowRotation] = useState(0);

  const currentColor = ACCENT_COLORS[colorIndex];

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('unio_theme_mode', theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }, [theme]);

  
  useEffect(() => {
    if (isProfanityAlert) {
      applyAccentColor(PROFANITY_ALERT_COLOR);
    } else {
      applyAccentColor(currentColor);
    }
  }, [isProfanityAlert, colorIndex, currentColor]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCycleColor = () => {
    setColorIndex((prev) => (prev + 1) % ACCENT_COLORS.length);
    setArrowRotation((prev) => prev + 360);
  };

  return (
    <header className="app-header">
      <div className="brand-wrapper" onClick={() => window.location.reload()} title="На главную / Обновить страницу">
        <div className="brand-logo-col">
          <NeironLogo className="brand-logo-svg" />
          <span className="brand-tag">Студенческая инициатива • ДГТУ</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="badge-anon" title="Все ответы собираются анонимно">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Анонимно</span>
        </div>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={handleToggleTheme}
          title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
          aria-label="Сменить тему оформления"
        >
          <div className="theme-icon-container">
            <div className={`theme-icon sun-icon ${theme === 'dark' ? 'visible' : 'hidden'}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>

            <div className={`theme-icon moon-icon ${theme === 'light' ? 'visible' : 'hidden'}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>
        </button>

        <button
          type="button"
          className="color-cycle-btn"
          onClick={handleCycleColor}
          title={`Акцент: ${currentColor.name} (нажми для смены на следующий цвет)`}
          aria-label="Сменить цвет акцента"
        >
          <span
            className="color-cycle-dot"
            style={{ backgroundColor: currentColor.hex }}
          />
          <svg
            className="color-cycle-arrow"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: `rotate(${arrowRotation}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
      </div>
    </header>
  );
}
