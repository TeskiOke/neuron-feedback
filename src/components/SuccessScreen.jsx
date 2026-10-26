import React, { useState, useEffect } from 'react';
import ClubPromoModal from './ClubPromoModal';
import CategoryIcon from './CategoryIcon';
import { SURVEY_CATEGORIES } from '../data/surveyData';

export default function SuccessScreen({ stats, onResetForTest }) {
  const [showTops, setShowTops] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const totalVotes = stats?.totalVotes || 1;
  const topCategory = stats?.topCategory || 'Учёба и расписание';
  const topSubcategories = stats?.topSubcategories || [];
  const categoryCounts = stats?.categoryCounts || {};

  
  const getProblemCategory = (problemName) => {
    const found = SURVEY_CATEGORIES.find((cat) =>
      cat.subcategories.some(
        (sub) => sub === problemName || (problemName && problemName.toLowerCase().includes(sub.toLowerCase()))
      )
    );
    return found || SURVEY_CATEGORIES[0];
  };

  
  const getStudentsWord = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return 'студентов ответили';
    if (mod10 === 1) return 'студент ответил';
    if (mod10 >= 2 && mod10 <= 4) return 'студента ответили';
    return 'студентов ответили';
  };

  
  useEffect(() => {
    if (hasAutoOpened || isPromoOpen) return;

    let timer = null;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setIsPromoOpen(true);
        setHasAutoOpened(true);
      }, 30000);
    };

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel'
    ];

    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [hasAutoOpened, isPromoOpen]);

  return (
    <div className="card-main success-card">
      <div className="success-icon-badge">
        ✓
      </div>

      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
        Твой отзыв сохранён!
      </h2>

      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
        Спасибо за вклад в проект «Нейрон». Каждый ответ студентов ДГТУ помогает нам приоритизировать разработку цифровых решений.
      </p>

      <div className="stats-card">
        <div className="stats-title">
          <span className="stats-title-text">Сводка опроса</span>
          <span className="stats-live-badge">
            <span className="stats-live-dot" />
            <span>В реальном времени</span>
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat-metric">
            <div className="stat-number">{totalVotes}</div>
            <div className="stat-label">{getStudentsWord(totalVotes)}</div>
          </div>

          <div className="stat-metric">
            <div className="stat-number" style={{ fontSize: '1rem', color: 'var(--primary)', paddingTop: '0.2rem' }}>
              {topCategory}
            </div>
            <div className="stat-label">Главная боль по ответам</div>
          </div>
        </div>

        <button
          type="button"
          className={`toggle-tops-btn ${showTops ? 'active' : ''}`}
          onClick={() => setShowTops((prev) => !prev)}
        >
          <span>{showTops ? 'Скрыть рейтинг проблем' : 'Развернуть и посмотреть топы самых частых проблем'}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showTops ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className={`tops-accordion-wrapper ${showTops ? 'open' : ''}`}>
          <div className="tops-accordion-inner">
            <div className="tops-container">
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                Топ самых частых проблем студентов:
              </div>

              {topSubcategories.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  Рейтинг формируется по мере ответов студентов.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {topSubcategories.map((item, idx) => {
                    const maxCount = topSubcategories[0]?.count || 1;
                    const pct = Math.round((item.count / maxCount) * 100);
                    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
                    const catObj = getProblemCategory(item.name);

                    return (
                      <div key={idx} className="top-problem-item">
                        <div className="top-problem-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                            <span className={`top-problem-rank ${rankClass}`}>
                              {idx + 1}
                            </span>
                            <div
                              className="category-icon-box"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: catObj.accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <CategoryIcon name={catObj.icon} size={16} />
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                              {item.name}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                            {item.count} {item.count === 1 ? 'студент' : item.count < 5 ? 'студента' : 'студентов'}
                          </span>
                        </div>
                        <div className="top-problem-bar-track">
                          <div
                            className="top-problem-bar-fill"
                            style={{ width: `${Math.max(8, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {Object.keys(categoryCounts).length > 0 && (
                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Распределение по сферам:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {Object.entries(categoryCounts).map(([catName, count], cIdx) => (
                      <div key={cIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{catName}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.35rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn-club-promo"
          onClick={() => setIsPromoOpen(true)}
          title="Узнать больше о Команде Нейрон"
        >
          <svg className="btn-club-promo-ring" aria-hidden="true">
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="10"
              className="btn-club-promo-rect"
            />
          </svg>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>О клубе «Нейрон» и наших соцсетях</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={onResetForTest}
          style={{ fontSize: '0.82rem' }}
        >
          Пройти ещё раз (для теста)
        </button>
      </div>

      <ClubPromoModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
      />
    </div>
  );
}
