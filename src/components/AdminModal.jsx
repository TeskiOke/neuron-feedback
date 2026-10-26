import React, { useState, useEffect } from 'react';
import { SURVEY_CATEGORIES, SEVERITY_LEVELS } from '../data/surveyData';

export default function AdminModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const [activeTab, setActiveTab] = useState('analytics');

  const [votes, setVotes] = useState([]);
  const [stats, setStats] = useState(null);

  
  const [viewers, setViewers] = useState([]);
  const [newViewerName, setNewViewerName] = useState('');
  const [newViewerKey, setNewViewerKey] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [creatingViewer, setCreatingViewer] = useState(false);

  
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    if (isOpen) {
      const savedKey = sessionStorage.getItem('unio_admin_key');
      if (savedKey) {
        verifyPassword(savedKey);
      }
    }
  }, [isOpen]);

  const verifyPassword = async (inputPassword) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUserRole(data.role || 'viewer');
        setUserName(data.name || '');
        sessionStorage.setItem('unio_admin_key', inputPassword);
        fetchData(inputPassword);
        if (data.role === 'admin') {
          fetchViewers(inputPassword);
        }
      } else {
        setError(data.error || 'Неверный ключ доступа');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (activeKey) => {
    try {
      const keyToUse = activeKey || sessionStorage.getItem('unio_admin_key');
      const res = await fetch('/api/admin/votes', {
        headers: { 'x-admin-key': keyToUse }
      });
      const data = await res.json();
      if (data.success) {
        setVotes(data.votes);
        setStats(data.stats);
        if (data.role) setUserRole(data.role);
        if (data.userName) setUserName(data.userName);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchViewers = async (activeKey) => {
    try {
      const keyToUse = activeKey || sessionStorage.getItem('unio_admin_key');
      const res = await fetch('/api/admin/viewers', {
        headers: { 'x-admin-key': keyToUse }
      });
      const data = await res.json();
      if (data.success) {
        setViewers(data.viewers || []);
      }
    } catch (err) {
      console.error('Error fetching viewers:', err);
    }
  };

  const handleCreateViewer = async (e) => {
    e.preventDefault();
    if (!newViewerName.trim()) return;
    setCreatingViewer(true);
    try {
      const keyToUse = sessionStorage.getItem('unio_admin_key');
      const res = await fetch('/api/admin/viewers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': keyToUse
        },
        body: JSON.stringify({
          name: newViewerName.trim(),
          key: newViewerKey.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewViewerName('');
        setNewViewerKey('');
        fetchViewers(keyToUse);
      } else {
        alert(data.error || 'Ошибка при создании аккаунта');
      }
    } catch (err) {
      alert('Ошибка при обращении к серверу');
    } finally {
      setCreatingViewer(false);
    }
  };

  const handleDeleteViewer = async (id, name) => {
    if (!window.confirm(`Отозвать доступ для «${name}»?`)) return;
    try {
      const keyToUse = sessionStorage.getItem('unio_admin_key');
      const res = await fetch(`/api/admin/viewers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': keyToUse }
      });
      if (res.ok) {
        fetchViewers(keyToUse);
      }
    } catch (err) {
      alert('Ошибка при удалении доступа');
    }
  };

  const handleCopyKey = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const generateRandomKey = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const symbols = '!@#$%^&*()_+-=';
    const all = upper + lower + digits + symbols;

    const array = new Uint32Array(30);
    window.crypto.getRandomValues(array);

    const pwd = [
      upper[array[0] % upper.length],
      lower[array[1] % lower.length],
      digits[array[2] % digits.length],
      symbols[array[3] % symbols.length]
    ];

    for (let i = 4; i < 30; i++) {
      pwd.push(all[array[i] % all.length]);
    }

    
    for (let i = pwd.length - 1; i > 0; i--) {
      const j = array[i] % (i + 1);
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }

    setNewViewerKey(pwd.join(''));
  };

  const handleDeleteVote = async (id) => {
    if (userRole !== 'admin') {
      alert('У вас режим только для чтения');
      return;
    }
    if (!window.confirm('Точно удалить этот отзыв?')) return;
    try {
      const keyToUse = sessionStorage.getItem('unio_admin_key');
      const res = await fetch(`/api/admin/votes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': keyToUse }
      });
      if (res.ok) {
        fetchData(keyToUse);
      }
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleClearAll = async () => {
    if (userRole !== 'admin') {
      alert('У вас режим только для чтения');
      return;
    }
    if (!window.confirm('ВНИМАНИЕ! Это действие удалит ВСЕ сохраненные ответы. Продолжить?')) return;
    try {
      const keyToUse = sessionStorage.getItem('unio_admin_key');
      const res = await fetch('/api/admin/clear', {
        method: 'POST',
        headers: { 'x-admin-key': keyToUse }
      });
      if (res.ok) {
        fetchData(keyToUse);
      }
    } catch (err) {
      alert('Ошибка при очистке данных');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('unio_admin_key');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    setPassword('');
  };

  if (!isOpen) return null;

  
  const filteredVotes = votes.filter(v => {
    if (categoryFilter !== 'all') {
      const matchCat = (v.categories && v.categories.length > 0)
        ? v.categories.some(c => c.category === categoryFilter)
        : v.category === categoryFilter;
      if (!matchCat) return false;
    }
    if (severityFilter !== 'all') {
      const matchSev = (v.categories && v.categories.length > 0)
        ? v.categories.some(c => c.severity === severityFilter)
        : v.severity === severityFilter;
      if (!matchSev) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const allText = (v.categories && v.categories.length > 0)
        ? v.categories.map(c => `${c.details || ''} ${c.categoryLabel || ''} ${(c.subcategories || []).join(' ')} ${c.customProblem || ''}`).join(' ')
        : `${v.details || ''} ${v.categoryLabel || ''} ${(v.subcategories || []).join(' ')} ${v.customProblem || ''}`;
      const matchText = allText.toLowerCase().includes(q);
      const matchContact = (v.contactName || '').toLowerCase().includes(q) || (v.contactUsername || '').toLowerCase().includes(q);
      if (!matchText && !matchContact) return false;
    }
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div className="modal-title">
              <span>📊</span>
              <span>Панель результатов «Нейрон»</span>
            </div>

            {isAuthenticated && (
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: userRole === 'admin' ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  color: userRole === 'admin' ? 'var(--primary-text)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                {userRole === 'admin' ? 'Администратор' : `Наблюдатель (${userName || 'Только чтение'})`}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAuthenticated && (
              <button
                type="button"
                className="btn-ghost"
                onClick={handleLogout}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                title="Выйти из аккаунта"
              >
                Выйти
              </button>
            )}
            <button className="modal-close" onClick={onClose} title="Закрыть">×</button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div style={{ maxWidth: '380px', margin: '2rem auto', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Вход для команды
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Введите ключ доступа администратора или аккаунта наблюдателя
            </p>

            <form onSubmit={(e) => { e.preventDefault(); verifyPassword(password); }}>
              <input
                type="password"
                className="custom-input"
                style={{ textAlign: 'center', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '0.85rem' }}
                placeholder="Вставьте ключ доступа..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && (
                <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: '0.85rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading || !password.trim()}
              >
                {loading ? 'Проверка ключа...' : 'Войти в панель'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {userRole === 'admin' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <button
                  type="button"
                  className={activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  onClick={() => setActiveTab('analytics')}
                >
                  Аналитика и ответы ({votes.length})
                </button>
                <button
                  type="button"
                  className={activeTab === 'viewers' ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  onClick={() => { setActiveTab('viewers'); fetchViewers(); }}
                >
                  Гостевые доступы ({viewers.length})
                </button>
              </div>
            )}

            {userRole === 'viewer' && (
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>ℹ️</span>
                <span>
                  <strong>Режим наблюдателя:</strong> вы можете просматривать статистику, искать и скачивать отчеты. Удаление записей отключено.
                </span>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a
                      href={`/api/admin/export/csv?key=${sessionStorage.getItem('unio_admin_key')}`}
                      className="btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
                      download
                    >
                      📥 Скачать CSV (Excel)
                    </a>
                    <a
                      href={`/api/admin/export/json?key=${sessionStorage.getItem('unio_admin_key')}`}
                      className="btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
                      download
                    >
                      📥 Скачать JSON
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => fetchData()}
                      style={{ fontSize: '0.82rem' }}
                    >
                      🔄 Обновить
                    </button>

                    {userRole === 'admin' && (
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={handleClearAll}
                        style={{ color: 'var(--danger)', fontSize: '0.82rem' }}
                      >
                        🗑 Очистить всё
                      </button>
                    )}
                  </div>
                </div>

                {stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div className="stat-metric">
                      <div className="stat-number">{stats.totalVotes}</div>
                      <div className="stat-label">Завершённых анкет (100%)</div>
                    </div>
                    <div className="stat-metric">
                      <div className="stat-number" style={{ color: '#ef4444' }}>{stats.severityCounts?.critical || 0}</div>
                      <div className="stat-label">Критичные боли (🔥)</div>
                    </div>
                    <div className="stat-metric">
                      <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.severityCounts?.annoying || 0}</div>
                      <div className="stat-label">Очень бесит (😤)</div>
                    </div>
                    <div className="stat-metric">
                      <div className="stat-number" style={{ color: '#10b981' }}>{stats.severityCounts?.mild || 0}</div>
                      <div className="stat-label">Терпимо (👌)</div>
                    </div>
                  </div>
                )}

                {stats && stats.categoryCounts && Object.keys(stats.categoryCounts).length > 0 && (
                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
                      Распределение по направлениям:
                    </div>
                    {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                      const pct = Math.round((count / (stats.totalVotes || 1)) * 100);
                      return (
                        <div key={cat} style={{ marginBottom: '0.55rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                            <span>{cat}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '999px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="custom-input"
                    style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                    placeholder="Поиск по тексту или контакту..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <select
                    className="custom-input"
                    style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Все категории ({votes.length})</option>
                    {SURVEY_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  <select
                    className="custom-input"
                    style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <option value="all">Любая важность</option>
                    <option value="critical">🔥 Критично</option>
                    <option value="annoying">😤 Очень бесит</option>
                    <option value="mild">👌 Терпимо</option>
                  </select>
                </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredVotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)', fontSize: '0.92rem' }}>
                      Ответов по заданным фильтрам пока нет.
                    </div>
                  ) : (
                    filteredVotes.map((v) => {
                      const categoriesList = (v.categories && v.categories.length > 0)
                        ? v.categories
                        : [{
                            category: v.category,
                            categoryLabel: v.categoryLabel,
                            subcategories: v.subcategories,
                            customProblem: v.customProblem,
                            details: v.details,
                            severity: v.severity
                          }];
                      const isMulti = categoriesList.length > 1;

                      return (
                        <div key={v.id} className="response-card">
                          <div className="response-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {isMulti ? (
                                <span className="response-category-pill" style={{ background: 'var(--primary)', color: '#fff' }}>
                                  🎯 {categoriesList.length} направления
                                </span>
                              ) : (
                                <span className="response-category-pill">
                                  {categoriesList[0]?.categoryLabel || categoriesList[0]?.category}
                                </span>
                              )}
                              {!isMulti && (() => {
                                const sevObj = SEVERITY_LEVELS.find(s => s.id === categoriesList[0]?.severity);
                                return sevObj ? (
                                  <span 
                                    className="response-severity-badge"
                                    style={{ 
                                      background: categoriesList[0]?.severity === 'critical' ? '#fee2e2' : categoriesList[0]?.severity === 'annoying' ? '#fef3c7' : '#dcfce7',
                                      color: categoriesList[0]?.severity === 'critical' ? '#b91c1c' : categoriesList[0]?.severity === 'annoying' ? '#b45309' : '#15803d'
                                    }}
                                  >
                                    {sevObj.emoji} {sevObj.label}
                                  </span>
                                ) : null;
                              })()}
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  color: '#15803d',
                                  background: 'rgba(34, 197, 94, 0.12)',
                                  border: '1px solid rgba(34, 197, 94, 0.25)',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '6px'
                                }}
                              >
                                ✓ Завершено {isMulti ? `(${categoriesList.length} сфер)` : '(4/4)'}
                              </span>
                            </div>

                            {userRole === 'admin' && (
                              <button
                                type="button"
                                className="modal-close"
                                style={{ width: '24px', height: '24px', fontSize: '0.85rem' }}
                                title="Удалить отзыв"
                                onClick={() => handleDeleteVote(v.id)}
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {categoriesList.map((catItem, idx) => {
                            const sevObj = SEVERITY_LEVELS.find(s => s.id === catItem.severity);
                            return (
                              <div
                                key={idx}
                                style={{
                                  marginTop: isMulti && idx > 0 ? '0.85rem' : '0.5rem',
                                  paddingTop: isMulti && idx > 0 ? '0.75rem' : '0',
                                  borderTop: isMulti && idx > 0 ? '1px dashed var(--border)' : 'none'
                                }}
                              >
                                {isMulti && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                      {idx + 1}. {catItem.categoryLabel || catItem.category}
                                    </span>
                                    {sevObj && (
                                      <span 
                                        className="response-severity-badge"
                                        style={{ 
                                          fontSize: '0.68rem',
                                          padding: '0.1rem 0.45rem',
                                          background: catItem.severity === 'critical' ? '#fee2e2' : catItem.severity === 'annoying' ? '#fef3c7' : '#dcfce7',
                                          color: catItem.severity === 'critical' ? '#b91c1c' : catItem.severity === 'annoying' ? '#b45309' : '#15803d'
                                        }}
                                      >
                                        {sevObj.emoji} {sevObj.label}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {(catItem.subcategories?.length > 0 || catItem.customProblem) && (
                                  <div className="response-subtags">
                                    {catItem.subcategories?.map((s, sIdx) => (
                                      <span key={sIdx} className="subtag-pill">{s}</span>
                                    ))}
                                    {catItem.customProblem && (
                                      <span className="subtag-pill" style={{ background: '#fef08a', color: '#854d0e' }}>
                                        ✍️ {catItem.customProblem}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {catItem.details ? (
                                  <div className="response-text">
                                    {catItem.details}
                                  </div>
                                ) : (
                                  <div style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                                    (Без развернутого комментария)
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <div className="response-footer" style={{ marginTop: '0.85rem' }}>
                            <div>
                              {v.isAnonymous ? (
                                <span style={{ color: '#64748b' }}>🛡️ Анонимный студент</span>
                              ) : (
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                  👤 {v.contactName || 'Студент'} • {v.contactUsername || 'Контакт не указан'}
                                </span>
                              )}
                            </div>
                            <div>
                              {new Date(v.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'viewers' && userRole === 'admin' && (
              <div>
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                    Создать доступ для наблюдателя
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Пользователь с этим ключом сможет смотреть всю статистику и читать отзывы в режиме «только чтение», без возможности удаления или очистки.
                  </p>

                  <form onSubmit={handleCreateViewer} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Кому выдан (Имя / Роль):
                        </label>
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Например: Дима Team lead, Катя..."
                          value={newViewerName}
                          onChange={(e) => setNewViewerName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Ключ доступа:
                          </label>
                          <button
                            type="button"
                            onClick={generateRandomKey}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Сгенерировать случайный
                          </button>
                        </div>
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Оставьте пустым для автогенерации"
                          value={newViewerKey}
                          onChange={(e) => setNewViewerKey(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={creatingViewer || !newViewerName.trim()}
                        style={{ fontSize: '0.88rem', padding: '0.55rem 1.25rem' }}
                      >
                        {creatingViewer ? 'Создание...' : '+ Создать ключ наблюдателя'}
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Активные ключи наблюдателей ({viewers.length}):
                  </h4>

                  {viewers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                      Пока не создано ни одного гостевого ключа.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {viewers.map((viewer) => (
                        <div
                          key={viewer.id}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span>👤</span>
                              <span>{viewer.name}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                              Создан: {new Date(viewer.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                              background: 'var(--bg-subtle)',
                              border: '1px solid var(--border)',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.82rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {viewer.key}
                            </div>

                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleCopyKey(viewer.id, viewer.key)}
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                            >
                              {copiedId === viewer.id ? '✓ Скопировано' : 'Скопировать'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteViewer(viewer.id, viewer.name)}
                              style={{
                                background: '#fee2e2',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                borderRadius: '6px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Отозвать ключ"
                            >
                              Отозвать
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
