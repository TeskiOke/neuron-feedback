import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Step1Category from './components/Step1Category';
import Step2Subcategory from './components/Step2Subcategory';
import Step3Details from './components/Step3Details';
import Step4Privacy from './components/Step4Privacy';
import SuccessScreen from './components/SuccessScreen';
import AlreadyVotedScreen from './components/AlreadyVotedScreen';
import WelcomeScreen from './components/WelcomeScreen';
import AdminModal from './components/AdminModal';
import { checkProfanity } from './utils/profanityFilter';
import { checkMeaningfulText, checkValidContactName, checkValidContactUsername } from './utils/textValidation';

export default function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categoryAnswers, setCategoryAnswers] = useState({});

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactUsername, setContactUsername] = useState('');

  const [stats, setStats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const activeCategory = selectedCategories[currentCategoryIndex] || null;
  const activeAnswer = (activeCategory && categoryAnswers[activeCategory.id]) || {
    subcategories: [],
    customProblem: '',
    details: '',
    severity: 'annoying'
  };

  const updateActiveAnswer = (updates) => {
    if (!activeCategory) return;
    setCategoryAnswers((prev) => ({
      ...prev,
      [activeCategory.id]: {
        category: activeCategory,
        categoryLabel: activeCategory.label,
        subcategories: [],
        customProblem: '',
        details: '',
        severity: 'annoying',
        ...(prev[activeCategory.id] || {}),
        ...updates
      }
    }));
  };

  
  const hasProfanity =
    Object.values(categoryAnswers).some(
      (ans) =>
        checkProfanity(ans?.customProblem).hasProfanity ||
        checkProfanity(ans?.details).hasProfanity
    ) ||
    (!isAnonymous && checkProfanity(contactName).hasProfanity) ||
    (!isAnonymous && checkProfanity(contactUsername).hasProfanity);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' ||
      path === '/results' ||
      path.startsWith('/admin') ||
      hash === '#admin' ||
      hash === '#results'
    );
  };

  
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  
  useEffect(() => {
    const hasVotedLocal = localStorage.getItem('unio_survey_voted');
    const hasVotedCookie = document.cookie.includes('unio_voted=1');

    if (hasVotedLocal || hasVotedCookie) {
      setCurrentStep('already_voted');
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Could not fetch stats yet:', err);
    }
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((c) => c.id === cat.id);
      if (exists) {
        const filtered = prev.filter((c) => c.id !== cat.id);
        setCategoryAnswers((old) => {
          const copy = { ...old };
          delete copy[cat.id];
          return copy;
        });
        return filtered;
      } else {
        setCategoryAnswers((old) => ({
          ...old,
          [cat.id]: old[cat.id] || {
            category: cat,
            categoryLabel: cat.label,
            subcategories: [],
            customProblem: '',
            details: '',
            severity: 'annoying'
          }
        }));
        return [...prev, cat];
      }
    });
  };

  const handleToggleSubcategory = (sub) => {
    const prevSubs = activeAnswer.subcategories || [];
    const nextSubs = prevSubs.includes(sub)
      ? prevSubs.filter((item) => item !== sub)
      : [...prevSubs, sub];
    updateActiveAnswer({ subcategories: nextSubs });
  };

  const handleStep1Next = () => {
    if (selectedCategories.length === 0) return;
    setCurrentCategoryIndex(0);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Back = () => {
    if (currentCategoryIndex === 0) {
      setCurrentStep(1);
    } else {
      setCurrentCategoryIndex((prev) => prev - 1);
      setCurrentStep(3);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Next = () => {
    if (currentCategoryIndex < selectedCategories.length - 1) {
      
      setCurrentCategoryIndex((prev) => prev + 1);
      setCurrentStep(2);
    } else {
      
      setCurrentStep(4);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep4Back = () => {
    setCurrentCategoryIndex(selectedCategories.length - 1);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitVote = async () => {
    if (selectedCategories.length === 0) {
      alert('Пожалуйста, выберите хотя бы одно направление.');
      return;
    }

    for (const cat of selectedCategories) {
      const ans = categoryAnswers[cat.id] || {};
      const hasPredefined = Array.isArray(ans.subcategories) && ans.subcategories.length > 0;
      const customProb = (ans.customProblem || '').trim();
      const customProbCheck = checkMeaningfulText(customProb, 4);

      if (customProb.length > 0 && !customProbCheck.isValid) {
        alert(`В сфере «${cat.label}» свой вариант проблемы описан некорректно: ${customProbCheck.reason}`);
        return;
      }

      if (!hasPredefined && (!customProb || !customProbCheck.isValid)) {
        alert(`Пожалуйста, выберите проблему или опишите её словами для сферы «${cat.label}». Ответы из одних цифр не принимаются.`);
        return;
      }

      const det = (ans.details || '').trim();
      if (det.length > 0) {
        const detCheck = checkMeaningfulText(det, 4);
        if (!detCheck.isValid) {
          alert(`В сфере «${cat.label}» предложение/комментарий некорректно: ${detCheck.reason}`);
          return;
        }
      }
    }

    if (!isAnonymous) {
      if (contactName.trim().length > 0 && !checkValidContactName(contactName).isValid) {
        alert('Пожалуйста, укажите настоящее имя.');
        return;
      }
      if (contactUsername.trim().length > 0 && !checkValidContactUsername(contactUsername).isValid) {
        alert('Пожалуйста, укажите корректный контакт (Telegram или телефон).');
        return;
      }
    }

    if (hasProfanity) {
      alert('Пожалуйста, удалите ненормативную лексику перед отправкой ответа.');
      return;
    }

    setIsSubmitting(true);

    try {
      const entries = selectedCategories.map((cat) => {
        const ans = categoryAnswers[cat.id] || {};
        return {
          category: cat.id,
          categoryLabel: cat.label,
          subcategories: ans.subcategories || [],
          customProblem: (ans.customProblem || '').trim(),
          details: (ans.details || '').trim(),
          severity: ans.severity || 'annoying'
        };
      });

      const first = entries[0];
      const payload = {
        categories: entries,
        category: first.category,
        categoryLabel: first.categoryLabel,
        subcategories: first.subcategories,
        customProblem: first.customProblem,
        details: first.details,
        severity: first.severity,
        isAnonymous,
        contactName: isAnonymous ? '' : contactName.trim(),
        contactUsername: isAnonymous ? '' : contactUsername.trim(),
        isCompleted: true
      };

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('unio_survey_voted', 'true');
        document.cookie = 'unio_voted=1; path=/; max-age=31536000';
        setStats(data.stats);
        setCurrentStep('success');
      } else {
        alert(data.error || 'Ошибка при сохранении ответа');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      
      localStorage.setItem('unio_survey_voted', 'true');
      setCurrentStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTest = () => {
    localStorage.removeItem('unio_survey_voted');
    document.cookie = 'unio_voted=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setSelectedCategories([]);
    setCurrentCategoryIndex(0);
    setCategoryAnswers({});
    setIsAnonymous(true);
    setContactName('');
    setContactUsername('');
    setCurrentStep('welcome');
    fetchStats();
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (checkIsAdminRoute()) {
      window.history.pushState({}, '', '/');
    }
  };

  
  const totalProgressSteps =
    selectedCategories.length > 1 ? 2 + selectedCategories.length * 2 : 4;

  let computedCurrentStep = 1;
  if (currentStep === 1) {
    computedCurrentStep = 1;
  } else if (currentStep === 2) {
    computedCurrentStep =
      selectedCategories.length > 1 ? 1 + currentCategoryIndex * 2 + 1 : 2;
  } else if (currentStep === 3) {
    computedCurrentStep =
      selectedCategories.length > 1 ? 1 + currentCategoryIndex * 2 + 2 : 3;
  } else if (currentStep === 4) {
    computedCurrentStep = totalProgressSteps;
  }

  const categoryInfo =
    (currentStep === 2 || currentStep === 3) && selectedCategories.length > 1
      ? { current: currentCategoryIndex + 1, total: selectedCategories.length }
      : null;

  return (
    <div className="app-container">
      <Header isProfanityAlert={hasProfanity} />

      <main style={{ flex: 1 }}>
        {currentStep === 'already_voted' ? (
          <AlreadyVotedScreen
            onResetForTest={handleResetForTest}
          />
        ) : currentStep === 'welcome' ? (
          <WelcomeScreen
            onStart={() => setCurrentStep(1)}
            stats={stats}
          />
        ) : currentStep === 'success' ? (
          <SuccessScreen
            stats={stats}
            onResetForTest={handleResetForTest}
          />
        ) : (
          <div className="card-main">
            <ProgressBar
              currentStep={computedCurrentStep}
              totalSteps={totalProgressSteps}
              categoryInfo={categoryInfo}
            />

            {currentStep === 1 && (
              <Step1Category
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onNext={handleStep1Next}
              />
            )}

            {currentStep === 2 && activeCategory && (
              <Step2Subcategory
                category={activeCategory}
                selectedSubcategories={activeAnswer.subcategories || []}
                customProblem={activeAnswer.customProblem || ''}
                onToggleSubcategory={handleToggleSubcategory}
                onChangeCustomProblem={(text) => updateActiveAnswer({ customProblem: text })}
                onBack={handleStep2Back}
                onNext={handleStep2Next}
                categoryIndex={currentCategoryIndex}
                totalCategories={selectedCategories.length}
              />
            )}

            {currentStep === 3 && activeCategory && (
              <Step3Details
                category={activeCategory}
                details={activeAnswer.details || ''}
                severity={activeAnswer.severity || 'annoying'}
                onChangeDetails={(text) => updateActiveAnswer({ details: text })}
                onChangeSeverity={(sev) => updateActiveAnswer({ severity: sev })}
                onBack={handleStep3Back}
                onNext={handleStep3Next}
                onSkip={handleStep3Next}
                categoryIndex={currentCategoryIndex}
                totalCategories={selectedCategories.length}
              />
            )}

            {currentStep === 4 && (
              <Step4Privacy
                answers={selectedCategories.map((cat) => ({
                  category: cat,
                  categoryLabel: cat.label,
                  subcategories: categoryAnswers[cat.id]?.subcategories || [],
                  customProblem: categoryAnswers[cat.id]?.customProblem || '',
                  details: categoryAnswers[cat.id]?.details || '',
                  severity: categoryAnswers[cat.id]?.severity || 'annoying'
                }))}
                isAnonymous={isAnonymous}
                contactName={contactName}
                contactUsername={contactUsername}
                onToggleAnonymous={setIsAnonymous}
                onChangeContactName={setContactName}
                onChangeContactUsername={setContactUsername}
                onBack={handleStep4Back}
                onSubmit={handleSubmitVote}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-credits">
          <span className="footer-team-text">Сделано Командой Нейрон</span>
          <div className="footer-social-links">
            <a
              href="https://t.me/DSTU_Neuron"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn footer-tg-btn"
              title="Telegram канал Команды Нейрон"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
              </svg>
              <span>Telegram</span>
            </a>

            <a
              href="https://vk.ru/club242417568"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn footer-vk-btn"
              title="Группа ВКонтакте Команды Нейрон"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.072 2H8.928C3.805 2 2 3.805 2 8.928v6.144C2 20.195 3.805 22 8.928 22h6.144C20.195 22 22 20.195 22 15.072V8.928C22 3.805 20.195 2 15.072 2zm3.328 13.883h-1.637c-.62 0-.81-.493-1.927-1.61-.973-.95-1.405-1.072-1.646-1.072-.338 0-.435.097-.435.564v1.493c0 .397-.126.625-1.18.625-1.748 0-3.69-1.06-5.06-3.033-2.062-2.91-2.63-5.094-2.63-5.54 0-.244.096-.468.56-.468h1.637c.418 0 .573.19.734.643.806 2.348 2.163 4.403 2.723 4.403.21 0 .307-.097.307-.629v-2.45c-.066-.995-.584-1.08-.584-1.435 0-.17.145-.343.386-.343h2.569c.355 0 .48.187.48.597v3.315c0 .355.161.48.258.48.21 0 .386-.125.773-.515 1.208-1.353 2.062-3.428 2.062-3.428.113-.243.322-.468.74-.468h1.637c.49 0 .6.244.49.596-.21 1.015-2.256 3.85-2.352 4.01-.21.323-.145.469 0 .71.21.338.902 1.015 1.369 1.58.854 1.015 1.514 1.868 1.692 2.458.177.58-.096.87-.58.87z"/>
              </svg>
              <span>VK</span>
            </a>

            <a
              href="https://github.com/TeskiOke/neuron-feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn footer-gh-btn"
              title="Исходный код на GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="footer-anon-note">
          <span>Все ответы собираются анонимно</span>
        </div>
      </footer>

      <AdminModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
