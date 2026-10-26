import React, { useState } from 'react';
import { SEVERITY_LEVELS } from '../data/surveyData';
import { checkProfanity } from '../utils/profanityFilter';
import { checkMeaningfulText } from '../utils/textValidation';
import ProfanityAlert from './ProfanityAlert';
import DummyTextAlert from './DummyTextAlert';

export default function Step3Details({
  category,
  details,
  severity,
  onChangeDetails,
  onChangeSeverity,
  onBack,
  onNext,
  onSkip,
  categoryIndex = 0,
  totalCategories = 1
}) {
  const maxChars = 1000;
  const [validationError, setValidationError] = useState(null);

  const profanityResult = checkProfanity(details);
  const hasProfanity = profanityResult.hasProfanity;
  const dummyResult = checkMeaningfulText(details, 4);

  const handleDetailsChange = (text) => {
    onChangeDetails(text);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleNextClick = () => {
    if (hasProfanity) {
      setValidationError('Пожалуйста, удалите ненормативную лексику.');
      return;
    }

    const trimmed = details.trim();
    if (trimmed.length > 0 && !dummyResult.isValid) {
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
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Сфера: {category.label}
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
        <span className="step-num-badge">3</span>
        <span>Чего именно не хватает и как это решить?</span>
      </div>
      <p className="step-subtext">
        Опиши свою идею, идеальный сервис или конкретную ситуацию (до 1000 символов)
      </p>

      <div className="textarea-wrapper">
        <textarea
          className={`survey-textarea ${hasProfanity ? 'input-profanity-error' : validationError ? 'input-dummy-error' : ''}`}
          maxLength={maxChars}
          placeholder={category.placeholder || "Опиши идею или проблему, с которой сталкиваешься..."}
          value={details}
          onChange={(e) => handleDetailsChange(e.target.value)}
          autoFocus
        />
        <div className="char-counter">
          {details.length} / {maxChars}
        </div>
        {hasProfanity && <ProfanityAlert />}
        {!hasProfanity && validationError && (
          <DummyTextAlert
            title="Обратите внимание"
            message={validationError}
          />
        )}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
          Насколько эта проблема для тебя критична?
        </div>
        
        <div className="severity-grid">
          {SEVERITY_LEVELS.map((lvl) => {
            const isActive = severity === lvl.id;

            return (
              <div
                key={lvl.id}
                className={`severity-card ${isActive ? 'active' : ''}`}
                onClick={() => onChangeSeverity(lvl.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChangeSeverity(lvl.id); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="severity-title">{lvl.label}</span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lvl.color }} />
                </div>
                <span className="severity-desc">{lvl.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="actions-bar">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Назад</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              if (validationError) setValidationError(null);
              if (details) onChangeDetails('');
              onSkip();
            }}
            disabled={hasProfanity}
          >
            Пропустить
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleNextClick}
          >
            <span>
              {categoryIndex + 1 < totalCategories
                ? `К следующему направлению (${categoryIndex + 2} из ${totalCategories})`
                : 'Далее'}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
