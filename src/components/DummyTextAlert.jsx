import React from 'react';

export default function DummyTextAlert({
  title = 'Ответ не может состоять только из цифр',
  message
}) {
  return (
    <div className="dummy-alert-banner" role="alert">
      <div className="dummy-alert-icon">⚠️</div>
      <div className="dummy-alert-content">
        <div className="dummy-alert-title">{title}</div>
        <div>
          {message || 'Пожалуйста, опишите проблему или мысль словами. Ответы из одних только цифр или случайных символов не помогут нам улучшить сервисы.'}
        </div>
      </div>
    </div>
  );
}
