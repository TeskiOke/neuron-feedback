import React from 'react';
import { SURVEY_CATEGORIES } from '../data/surveyData';
import CategoryIcon from './CategoryIcon';

export default function Step1Category({
  selectedCategories = [],
  onToggleCategory,
  onNext
}) {
  const hasSelection = selectedCategories.length > 0;

  return (
    <div className="step-wrapper">
      <div className="survey-hero">
        <h1 className="survey-title">
          Чего не хватает студентам ДГТУ?
        </h1>
        <p className="survey-subtitle">
          Расскажи, какой сервис, бот или инструмент сделал бы учёбу и жизнь в кампусе удобнее. Мы собираем реальные проблемы, чтобы разработать полезные решения.
        </p>
      </div>

      <div className="step-heading">
        <span className="step-num-badge">1</span>
        <span>Какие направления цифровых сервисов важнее всего?</span>
      </div>
      <p className="step-subtext">
        Можно выбрать одно или сразу несколько направлений — опрос последовательно спросит о каждом
      </p>

      <div className="category-grid">
        {SURVEY_CATEGORIES.map((cat) => {
          const selectedIndex = selectedCategories.findIndex((c) => c.id === cat.id);
          const isSelected = selectedIndex !== -1;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleCategory(cat)}
            >
              <div className="category-card-top">
                <div 
                  className="category-icon-box" 
                  style={{ background: cat.accentColor }}
                >
                  <CategoryIcon name={cat.icon} size={20} />
                </div>

                <div className={`category-check ${isSelected ? 'checked' : ''}`}>
                  {isSelected && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', lineHeight: 1 }}>
                      {selectedCategories.length > 1 ? (
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                          {selectedIndex + 1}
                        </span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="category-content">
                <div className="category-title">{cat.label}</div>
                <div className="category-desc">{cat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="actions-bar">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {selectedCategories.length === 0 && 'Выберите хотя бы одно направление'}
          {selectedCategories.length === 1 && `Выбрано 1 направление: ${selectedCategories[0].label}`}
          {selectedCategories.length > 1 && `Выбрано ${selectedCategories.length} направлений`}
        </span>
        <button
          type="button"
          className="btn-primary"
          disabled={!hasSelection}
          onClick={onNext}
        >
          <span>Продолжить</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
