import React from 'react';

export default function WelcomeScreen({ onStart, stats }) {
  const totalVotes = stats?.totalVotes || 4;

  return (
    <div className="card-main welcome-card step-wrapper">
      <div className="welcome-badge">
        <span className="pulse-dot" />
        <span>Инициатива студентов ДГТУ • Опрос 2026</span>
      </div>

      <h1 className="welcome-title">
        Каких сервисов не хватает <br />
        <span className="accent-highlight">студентам ДГТУ?</span>
      </h1>

      <p className="welcome-description">
        Мы устали от неудобных сайтов, очередей за справками и потерянных пар. Пройди короткий опрос и расскажи, что болит именно у тебя — а команда Нейрон разработает решения.
      </p>

      <div className="welcome-features-grid">
        <div className="welcome-feature-card">
          <div className="anim-widget anim-timer">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--border)" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="9" stroke="var(--primary)" strokeWidth="1.8" strokeDasharray="56" strokeDashoffset="18" className="anim-timer-progress" />
              <line x1="12" y1="12" x2="12" y2="6.5" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" className="anim-timer-needle" />
              <circle cx="12" cy="12" r="2" fill="var(--primary)" />
              <circle cx="12" cy="3" r="1.2" fill="var(--primary)" className="anim-timer-blinker" />
            </svg>
          </div>
          <div className="welcome-feature-text">
            <div className="welcome-feature-title">2–3 минуты</div>
            <div className="welcome-feature-desc">Всего 4 простых шага без лишней бюрократии</div>
          </div>
        </div>

        <div className="welcome-feature-card">
          <div className="anim-widget anim-shield">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--primary)" strokeWidth="1.8" fill="var(--primary-light)" className="anim-shield-frame" />
              <path d="M9 12l2 2 4-4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="anim-shield-check" />
            </svg>
            <div className="anim-scan-laser" />
          </div>
          <div className="welcome-feature-text">
            <div className="welcome-feature-title">100% анонимно</div>
            <div className="welcome-feature-desc">Контакты не требуются, ответы обезличены</div>
          </div>
        </div>

        <div className="welcome-feature-card">
          <div className="anim-widget anim-target">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--border)" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="6" stroke="var(--primary)" strokeWidth="1.5" opacity="0.4" />
              <line x1="12" y1="2" x2="12" y2="5" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="2" y1="12" x2="5" y2="12" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="anim-sonar-wave wave-1" />
            <span className="anim-sonar-wave wave-2" />
            <span className="anim-sonar-core" />
          </div>
          <div className="welcome-feature-text">
            <div className="welcome-feature-title">Прямое влияние</div>
            <div className="welcome-feature-desc">Лучшие идеи пойдут в реальную разработку</div>
          </div>
        </div>

        <div className="welcome-feature-card">
          <div className="anim-widget anim-equalizer">
            <span className="anim-eq-bar bar-1" />
            <span className="anim-eq-bar bar-2" />
            <span className="anim-eq-bar bar-3" />
            <span className="anim-eq-bar bar-4" />
          </div>
          <div className="welcome-feature-text">
            <div className="welcome-feature-title">Live-статистика</div>
            <div className="welcome-feature-desc">Увидишь общие результаты сразу после ответа</div>
          </div>
        </div>
      </div>

      <div className="welcome-counter-wrap">
        <div className="welcome-counter-banner">
          <div className="anim-beacon-widget">
            <span className="beacon-ring ring-1" />
            <span className="beacon-ring ring-2" />
            <span className="beacon-dot" />
          </div>
          <span>
            Уже <strong>{totalVotes}</strong> {totalVotes === 1 ? 'студент поделился' : (totalVotes >= 2 && totalVotes <= 4) ? 'студента поделились' : 'студентов поделились'} мнением
          </span>
        </div>
      </div>

      <div className="welcome-action-wrap">
        <button
          type="button"
          className="btn-primary btn-start-survey"
          onClick={onStart}
        >
          <span>Начать опрос</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="welcome-note">
          Не требуется регистрация • Защита от накрутки
        </div>
      </div>
    </div>
  );
}
