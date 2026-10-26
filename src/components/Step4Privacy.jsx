import React from 'react';
import { SEVERITY_LEVELS } from '../data/surveyData';
import { checkProfanity } from '../utils/profanityFilter';
import { checkValidContactName, checkValidContactUsername } from '../utils/textValidation';
import ProfanityAlert from './ProfanityAlert';
import DummyTextAlert from './DummyTextAlert';

export default function Step4Privacy({
  answers = [],
  category,
  subcategories,
  customProblem,
  details,
  severity,
  isAnonymous,
  contactName,
  contactUsername,
  onToggleAnonymous,
  onChangeContactName,
  onChangeContactUsername,
  onBack,
  onSubmit,
  isSubmitting
}) {
  const answersList = answers.length > 0
    ? answers
    : [{ category, subcategories: subcategories || [], customProblem: customProblem || '', details: details || '', severity: severity || 'annoying' }];

  const nameProfane = !isAnonymous && checkProfanity(contactName).hasProfanity;
  const usernameProfane = !isAnonymous && checkProfanity(contactUsername).hasProfanity;
  const hasProfanity = nameProfane || usernameProfane;

  const nameDummy = !isAnonymous && contactName.trim().length > 0 && !checkValidContactName(contactName).isValid;
  const usernameDummy = !isAnonymous && contactUsername.trim().length > 0 && !checkValidContactUsername(contactUsername).isValid;
  const hasDummyContacts = nameDummy || usernameDummy;

  return (
    <div className="step-wrapper">
      <div className="step-heading">
        <span className="step-num-badge">4</span>
        <span>Проверь ответы и формат отправки</span>
      </div>
      <p className="step-subtext">
        Всё ли указано верно? Выбери, хочешь ли ты оставить контакты для участия в тестах
      </p>

      <div className="summary-box">
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.03em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Резюме ответа</span>
          {answersList.length > 1 && (
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'none', fontSize: '0.75rem' }}>
              {answersList.length} направления
            </span>
          )}
        </div>

        {answersList.map((ans, idx) => {
          const sevObj = SEVERITY_LEVELS.find(s => s.id === ans.severity);
          const pains = [...(ans.subcategories || []), ans.customProblem].filter(Boolean);

          return (
            <div
              key={idx}
              style={{
                borderTop: idx > 0 ? '1px dashed var(--border)' : 'none',
                paddingTop: idx > 0 ? '0.75rem' : '0',
                marginTop: idx > 0 ? '0.75rem' : '0'
              }}
            >
              <div className="summary-row">
                <span className="summary-label">
                  {answersList.length > 1 ? `Сфера ${idx + 1}:` : 'Сфера:'}
                </span>
                <span className="summary-value" style={{ fontWeight: 700 }}>
                  {ans.category?.label || ans.categoryLabel || 'Не выбрано'}
                </span>
              </div>

              {pains.length > 0 && (
                <div className="summary-row" style={{ alignItems: 'flex-start' }}>
                  <span className="summary-label">Боли:</span>
                  <span className="summary-value" style={{ fontWeight: 500, fontSize: '0.84rem' }}>
                    {pains.join('; ')}
                  </span>
                </div>
              )}

              {ans.details && (
                <div className="summary-row" style={{ alignItems: 'flex-start' }}>
                  <span className="summary-label">Идея:</span>
                  <span className="summary-value" style={{ fontWeight: 400, fontSize: '0.84rem' }}>
                    «{ans.details.length > 120 ? ans.details.slice(0, 120) + '...' : ans.details}»
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Критичность:</span>
                <span className="summary-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sevObj?.color }} />
                  <span>{sevObj?.label}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="privacy-toggle-box"
        onClick={() => onToggleAnonymous(!isAnonymous)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleAnonymous(!isAnonymous); }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
            100% анонимный ответ
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {isAnonymous 
              ? 'Без имени и контактов. Ответ виден только в общей обезличенной статистике.' 
              : 'Ты сможешь оставить Telegram или телефон для связи.'}
          </div>
        </div>

        <div className={`toggle-switch ${isAnonymous ? 'active' : ''}`}>
          <div className="toggle-knob" />
        </div>
      </div>

      {!isAnonymous && (
        <div className="contact-fields">
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Контакты для связи (по желанию):
          </div>

          <input
            type="text"
            className={`custom-input ${nameProfane ? 'input-profanity-error' : nameDummy ? 'input-dummy-error' : ''}`}
            placeholder="Твое имя или никнейм"
            value={contactName}
            onChange={(e) => onChangeContactName(e.target.value)}
          />

          <input
            type="text"
            className={`custom-input ${usernameProfane ? 'input-profanity-error' : usernameDummy ? 'input-dummy-error' : ''}`}
            placeholder="Telegram @username или телефон"
            value={contactUsername}
            onChange={(e) => onChangeContactUsername(e.target.value)}
          />

          {hasProfanity && <ProfanityAlert />}
          {!hasProfanity && hasDummyContacts && (
            <DummyTextAlert
              title="Проверьте контактные данные"
              message="Имя или контакт не могут состоять только из цифр или случайных знаков."
            />
          )}
        </div>
      )}

      <div className="actions-bar">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={isSubmitting}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Назад</span>
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onSubmit}
          disabled={isSubmitting || hasProfanity || hasDummyContacts}
          title={hasProfanity ? "Уберите ненормативную лексику для отправки" : hasDummyContacts ? "Проверьте корректность имени и контакта" : ""}
        >
          {isSubmitting ? (
            <span>Отправка ответа...</span>
          ) : (
            <>
              <span>Отправить отзыв</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
