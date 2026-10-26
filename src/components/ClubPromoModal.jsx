import React, { useState, useEffect } from 'react';
import NeironLogo from './NeironLogo';
import CategoryIcon from './CategoryIcon';

export default function ClubPromoModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  
  useEffect(() => {
    if (!shouldRender || isClosing) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`promo-modal-overlay ${isClosing ? 'closing' : 'entering'}`}
      onClick={onClose}
      style={{ zIndex: 1000 }}
    >
      <div className="promo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="promo-modal-close"
          onClick={onClose}
          title="Закрыть окно"
          aria-label="Закрыть окно"
        >
          ✕
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: '150px', height: '36px', marginBottom: '0.75rem' }}>
            <NeironLogo />
          </div>
          <span className="promo-badge">
            Студенческий IT-клуб ДГТУ
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
            Привет! Мы — Команда «Нейрон»
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '460px', lineHeight: 1.5 }}>
            Спасибо, что уделил время этому опросу! Твой голос уже в нашей аналитике и помогает нам создавать полезные цифровые сервисы для студентов ДГТУ.
          </p>
        </div>

        <div className="promo-features-grid">
          <div className="promo-feature-card">
            <div
              className="category-icon-box"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CategoryIcon name="cpu" size={20} />
            </div>
            <div>
              <div className="promo-feature-title">Берём проблемы в разработку</div>
              <div className="promo-feature-desc">
                Мы анализируем реальные боли студентов и превращаем их в удобные Telegram-боты, веб-сервисы и мобильные инструменты.
              </div>
            </div>
          </div>

          <div className="promo-feature-card">
            <div
              className="category-icon-box"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CategoryIcon name="sparkles" size={20} />
            </div>
            <div>
              <div className="promo-feature-title">Хакатоны и реальные проекты</div>
              <div className="promo-feature-desc">
                Участвуем в крупнейших IT-чемпионатах, побеждаем, пополняем портфолио сильными кейсами и прокачиваем навыки в команде.
              </div>
            </div>
          </div>

          <div className="promo-feature-card">
            <div
              className="category-icon-box"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CategoryIcon name="users" size={20} />
            </div>
            <div>
              <div className="promo-feature-title">Сильное IT-комьюнити</div>
              <div className="promo-feature-desc">
                Разработчики, дизайнеры, аналитики, продакты и просто активные студенты ДГТУ. Учимся друг у друга и двигаем цифровой вуз вперед.
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Хочешь тестировать новые сервисы первым или разрабатывать их вместе с нами? Присоединяйся!
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <a
            href="https://t.me/DSTU_Neuron"
            target="_blank"
            rel="noopener noreferrer"
            className="promo-social-btn promo-tg-btn"
            title="Telegram канал Команды Нейрон"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
            </svg>
            <span>Наш Telegram</span>
          </a>

          <a
            href="https://vk.ru/club242417568"
            target="_blank"
            rel="noopener noreferrer"
            className="promo-social-btn promo-vk-btn"
            title="Группа ВКонтакте Команды Нейрон"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.072 2H8.928C3.805 2 2 3.805 2 8.928v6.144C2 20.195 3.805 22 8.928 22h6.144C20.195 22 22 20.195 22 15.072V8.928C22 3.805 20.195 2 15.072 2zm3.328 13.883h-1.637c-.62 0-.81-.493-1.927-1.61-.973-.95-1.405-1.072-1.646-1.072-.338 0-.435.097-.435.564v1.493c0 .397-.126.625-1.18.625-1.748 0-3.69-1.06-5.06-3.033-2.062-2.91-2.63-5.094-2.63-5.54 0-.244.096-.468.56-.468h1.637c.418 0 .573.19.734.643.806 2.348 2.163 4.403 2.723 4.403.21 0 .307-.097.307-.629v-2.45c-.066-.995-.584-1.08-.584-1.435 0-.17.145-.343.386-.343h2.569c.355 0 .48.187.48.597v3.315c0 .355.161.48.258.48.21 0 .386-.125.773-.515 1.208-1.353 2.062-3.428 2.062-3.428.113-.243.322-.468.74-.468h1.637c.49 0 .6.244.49.596-.21 1.015-2.256 3.85-2.352 4.01-.21.323-.145.469 0 .71.21.338.902 1.015 1.369 1.58.854 1.015 1.514 1.868 1.692 2.458.177.58-.096.87-.58.87z"/>
            </svg>
            <span>ВКонтакте</span>
          </a>
        </div>

        <div>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            style={{ fontSize: '0.85rem' }}
          >
            Вернуться к результатам опроса
          </button>
        </div>
      </div>
    </div>
  );
}
