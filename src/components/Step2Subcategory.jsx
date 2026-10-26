import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { checkProfanity } from '../utils/profanityFilter';
import { checkMeaningfulText } from '../utils/textValidation';
import ProfanityAlert from './ProfanityAlert';
import DummyTextAlert from './DummyTextAlert';

export default function Step2Subcategory({
  category,
  selectedSubcategories,
  customProblem,
  onToggleSubcategory,
  onChangeCustomProblem,
  onBack,
  onNext,
  categoryIndex = 0,
  totalCategories = 1
}) {
  const [showCustomInput, setShowCustomInput] = useState(Boolean(customProblem));
  const [validationError, setValidationError] = useState(null);

  const profanityResult = checkProfanity(customProblem);
  const hasProfanity = profanityResult.hasProfanity;

  const dummyResult = checkMeaningfulText(customProblem, 4);

  const handleCustomProblemChange = (text) => {
    onChangeCustomProblem(text);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleNextClick = () => {
    if (hasProfanity) {
      setValidationError('Пожалуйста, удалите ненормативную лексику.');
      return;
    }

    const hasPredefined = selectedSubcategories.length > 0;
    const trimmedCustom = customProblem.trim();

    if (!hasPredefined && trimmedCustom.length === 0) {
      setValidationError('Пожалуйста, выберите хотя бы одну проблему из списка или опишите свою словами.');
      return;
    }

    if (trimmedCustom.length > 0 && !dummyResult.isValid) {
      setValidationError(dummyResult.reason);
      return;
    }

    setValidationError(null);
    onNext();
  };

  return (
    <div className="step-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div 
            className="category-icon-box" 
            style={{ width: '32px', height: '32px', background: category.accentColor, borderRadius: '8px' }}
          >
            <CategoryIcon name={category.icon} size={18} />
          </div>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {category.label}
          </span>
        </div>

        {totalCategories > 1 && (
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              background: 'var(--primary-light)',
              color: 'var(--primary-text)',
              border: '1px solid var(--border)'
            }}
          >
            Направление {categoryIndex + 1} из {totalCategories}
          </span>
        )}
      </div>

      <div className="step-heading">
        <span className="step-num-badge">2</span>
        <span>Какие проблемы волнуют больше всего?</span>
      </div>
      <p className="step-subtext">
        Отметьте один или несколько пунктов, с которыми вы реально сталкиваетесь в вузе
      </p>

      <div className="chips-container">
        {category.subcategories.map((sub, idx) => {
          const isActive = selectedSubcategories.includes(sub);

          return (
            <div
              key={idx}
              className={`chip-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (validationError) setValidationError(null);
                onToggleSubcategory(sub);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (validationError) setValidationError(null);
                  onToggleSubcategory(sub);
                }
              }}
            >
              <span>{sub}</span>
              <div className="chip-checkbox">
                {isActive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}

        {!showCustomInput ? (
          <button
            type="button"
            className="chip-item"
            style={{ borderStyle: 'dashed', color: 'var(--primary)', justifyContent: 'center' }}
            onClick={() => setShowCustomInput(true)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Добавить свой вариант проблемы
            </span>
          </button>
        ) : (
          <div className="custom-pain-wrapper">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Твоя конкретная проблема / ситуация:
            </label>
            <input
              type="text"
              className={`custom-input ${hasProfanity ? 'input-profanity-error' : validationError ? 'input-dummy-error' : ''}`}
              placeholder="Например: расписание не синхронизируется с календарем на телефоне..."
              value={customProblem}
              onChange={(e) => handleCustomProblemChange(e.target.value)}
              autoFocus
            />
            {hasProfanity && <ProfanityAlert />}
            {!hasProfanity && validationError && (
              <DummyTextAlert
                title="Обратите внимание"
                message={validationError}
              />
            )}
          </div>
        )}
      </div>

      <div className="actions-bar">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Назад</span>
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={handleNextClick}
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
