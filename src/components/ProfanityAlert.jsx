import React from 'react';

export default function ProfanityAlert({ message }) {
  return (
    <div className="profanity-alert-banner" role="alert">
      <div className="profanity-alert-icon">⚠️</div>
      <div className="profanity-alert-content">
        <div className="profanity-alert-title">Ай-ай-ай! Так делать не надо :)</div>
        <div>
          {message || 'Пожалуйста, убери ненормативную лексику. Давай общаться культурно и конструктивно, чтобы опрос принёс реальную пользу студентам ДГТУ.'}
        </div>
      </div>
    </div>
  );
}
