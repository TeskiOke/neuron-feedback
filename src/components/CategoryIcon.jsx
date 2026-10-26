import React from 'react';

export default function CategoryIcon({ name, size = 22 }) {
  switch (name) {
    case 'book':
      return (
        <div className="cat-icon-anim cat-anim-study" title="Учёба и расписание">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="8.5" y1="7" x2="15.5" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="cat-book-line l1" />
            <line x1="8.5" y1="11" x2="13.5" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="cat-book-line l2" />
            <path d="M12 2v6l2-1.5 2 1.5V2" fill="rgba(255,255,255,0.3)" stroke="currentColor" strokeWidth="1.2" className="cat-book-ribbon" />
            <circle cx="17.5" cy="17.5" r="2" fill="#ffffff" className="cat-book-pulse" />
          </svg>
        </div>
      );

    case 'file':
      return (
        <div className="cat-icon-anim cat-anim-docs" title="Документы и справки">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="15.5" cy="16.5" r="3" fill="rgba(255,255,255,0.25)" stroke="currentColor" strokeWidth="1.2" className="cat-doc-seal" />
            <path d="M14.5 16.5l1 1 2-2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="cat-doc-laser" />
        </div>
      );

    case 'building':
      return (
        <div className="cat-icon-anim cat-anim-campus" title="Кампус и общежития">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="5" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <rect x="6.5" y="8" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="cat-win w1" />
            <rect x="15" y="8" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="cat-win w2" />
            <rect x="6.5" y="13" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="cat-win w3" />
            <rect x="15" y="13" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="cat-win w4" />
            <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="2" r="1.5" fill="#ffffff" className="cat-antenna-dot" />
            <path d="M8 2a5 5 0 0 1 8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="cat-wifi-wave wave-1" />
            <path d="M6 0a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="cat-wifi-wave wave-2" />
          </svg>
        </div>
      );

    case 'users':
      return (
        <div className="cat-icon-anim cat-anim-life" title="Студ. жизнь и движ">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="2" />
            <path d="M3 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" opacity="0.85" />
            <path d="M15 14.5a3.5 3.5 0 0 1 3.5-1h.5a3 3 0 0 1 3 3V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
            <circle cx="16" cy="3" r="1.5" fill="#ffffff" className="cat-life-spark spark-1" />
            <circle cx="20" cy="5" r="1" fill="#ffffff" className="cat-life-spark spark-2" />
            <line x1="12" y1="5" x2="14" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="cat-connect-beam" />
          </svg>
        </div>
      );

    case 'cpu':
      return (
        <div className="cat-icon-anim cat-anim-it" title="Цифровые сервисы и IT">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="5" y="5" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="rgba(255,255,255,0.25)" stroke="currentColor" strokeWidth="1.6" className="cat-cpu-core" />
            <line x1="9" y1="1" x2="9" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="15" y1="1" x2="15" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="9" y1="19" x2="9" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="15" y1="19" x2="15" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="1" y1="9" x2="5" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="1" y1="15" x2="5" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="19" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="19" y1="15" x2="23" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1.5" fill="#ffffff" className="cat-cpu-dot" />
          </svg>
        </div>
      );

    case 'sparkles':
    default:
      return (
        <div className="cat-icon-anim cat-anim-idea" title="Своя идея или проблема">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l2.3 6.3 6.7 1.7-5 4.6 1.4 6.9-6.4-3.5-6.4 3.5 1.4-6.9-5-4.6 6.7-1.7L12 2z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="rgba(255,255,255,0.2)"
              className="cat-star-main"
            />
            <circle cx="4.5" cy="5.5" r="1.5" fill="#ffffff" className="cat-star-spark s1" />
            <circle cx="19.5" cy="18.5" r="1.5" fill="#ffffff" className="cat-star-spark s2" />
            <circle cx="19.5" cy="5.5" r="1" fill="currentColor" className="cat-star-spark s3" />
          </svg>
        </div>
      );
  }
}
