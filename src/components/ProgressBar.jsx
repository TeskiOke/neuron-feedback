import React from 'react';

export default function ProgressBar({ currentStep, totalSteps = 4, categoryInfo = null }) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span>Шаг </span>
          <span className="progress-step-pill">{currentStep} из {totalSteps}</span>
          {categoryInfo && categoryInfo.total > 1 && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0.1rem 0.5rem',
                marginLeft: '0.2rem'
              }}
            >
              Сфера {categoryInfo.current} из {categoryInfo.total}
            </span>
          )}
        </div>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{percentage}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
