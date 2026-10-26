import React from 'react';

export default function AlreadyVotedScreen({ onResetForTest }) {
  return (
    <div className="card-main success-card">
      <div className="success-icon-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
        ✓
      </div>

      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
        Твой голос уже учтён!
      </h2>

      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
        Твой ответ уже зафиксирован в системе «Нейрон». Повторные ответы с одного устройства ограничены, чтобы статистика оставалась честной и объективной.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onResetForTest}
          style={{ fontSize: '0.85rem' }}
        >
          Сбросить локальную отметку (для теста)
        </button>
      </div>
    </div>
  );
}
