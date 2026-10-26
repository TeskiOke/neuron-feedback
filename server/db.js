import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkMeaningfulText } from '../src/utils/textValidation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'votes.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_SEED = [
  {
    id: "seed_1",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    category: "study_schedule",
    categoryLabel: "Учёба и расписание",
    subcategories: [
      "Расписание постоянно меняется и не обновляется вовремя",
      "Нужно логиниться на 5 разных сайтов"
    ],
    customProblem: "",
    details: "Сделайте нормального бота в Telegram или виджет на iOS/Android! Преподы меняют аудитории за 10 минут до пары, а в старой системе это видно только через 2 часа.",
    severity: "critical",
    isAnonymous: true,
    contactName: "",
    contactUsername: ""
  },
  {
    id: "seed_2",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: "documents_office",
    categoryLabel: "Документы и справки",
    subcategories: [
      "Очереди в деканат за обычной справкой об обучении",
      "Непонятно, какие документы нужны для стипендии"
    ],
    customProblem: "",
    details: "Хочется подавать заявку на справку в 1 клик и получать PDF с электронной подписью, а не стоять в очереди в 8 корпус в обеденный перерыв.",
    severity: "annoying",
    isAnonymous: false,
    contactName: "Алексей С.",
    contactUsername: "@alex_dstu"
  },
  {
    id: "seed_3",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    category: "campus_infrastructure",
    categoryLabel: "Кампус и общежития",
    subcategories: [
      "Wi-Fi в корпусах и общагах отваливается каждые 15 минут",
      "Пропускная система: вечно забываешь пластиковый пропуск"
    ],
    customProblem: "",
    details: "Было бы круто добавить цифровой пропуск в Apple Wallet / Google Wallet или по QR-коду в приложении Нейрон.",
    severity: "annoying",
    isAnonymous: true,
    contactName: "",
    contactUsername: ""
  }
];

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SEED, null, 2), 'utf-8');
}

export function isCompleteVote(vote) {
  if (!vote || typeof vote !== 'object') return false;
  if (vote.isCompleted === false) return false;

  const entries = Array.isArray(vote.categories) && vote.categories.length > 0
    ? vote.categories
    : [vote];

  return entries.every(entry => {
    
    if (!entry.category || typeof entry.category !== 'string' || entry.category.trim() === '') {
      return false;
    }

    
    const hasSub = Array.isArray(entry.subcategories) && entry.subcategories.length > 0;
    const hasCustom = typeof entry.customProblem === 'string' && entry.customProblem.trim().length > 0;
    if (!hasSub && !hasCustom) {
      return false;
    }

    
    if (hasCustom && !checkMeaningfulText(entry.customProblem, 4).isValid) {
      return false;
    }

    
    if (typeof entry.details === 'string' && entry.details.trim().length > 0) {
      if (!checkMeaningfulText(entry.details, 4).isValid) {
        return false;
      }
    }

    
    if (!entry.severity || !['mild', 'annoying', 'critical'].includes(entry.severity)) {
      return false;
    }

    return true;
  });
}

export function purgeIncompleteVotes() {
  try {
    if (!fs.existsSync(DB_FILE)) return;
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const all = JSON.parse(raw);
    const completeOnly = all.filter(isCompleteVote);
    if (completeOnly.length !== all.length) {
      console.log(`[DB] Cleaned up ${all.length - completeOnly.length} incomplete votes from database.`);
      fs.writeFileSync(DB_FILE, JSON.stringify(completeOnly, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[DB] Error purging incomplete votes:', err);
  }
}

purgeIncompleteVotes();

export function getAllVotes(includeIncomplete = false) {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (includeIncomplete) {
      return parsed;
    }
    return parsed.filter(isCompleteVote);
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
}

export function saveVote(vote) {
  if (!isCompleteVote(vote)) {
    throw new Error('Анкета не завершена до конца. Все шаги обязательны для сохранения.');
  }

  const raw = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) : [];
  
  const votes = raw.filter(isCompleteVote);

  const newVote = {
    id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    isCompleted: true,
    ...vote
  };

  votes.unshift(newVote);

  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(votes, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);

  return newVote;
}

export function getStats() {
  const votes = getAllVotes();
  const totalVotes = votes.length;

  const categoryCounts = {};
  const severityCounts = {
    mild: 0,
    annoying: 0,
    critical: 0
  };
  const subcategoryCounts = {};

  for (const v of votes) {
    const entries = Array.isArray(v.categories) && v.categories.length > 0
      ? v.categories
      : [v];

    for (const entry of entries) {
      
      const cat = entry.categoryLabel || entry.category || 'Другое';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      
      if (entry.severity && severityCounts[entry.severity] !== undefined) {
        severityCounts[entry.severity]++;
      }

      
      if (Array.isArray(entry.subcategories)) {
        for (const sub of entry.subcategories) {
          subcategoryCounts[sub] = (subcategoryCounts[sub] || 0) + 1;
        }
      }
    }
  }

  
  let topCategory = 'Учёба и расписание';
  let maxCount = -1;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  }

  return {
    totalVotes,
    topCategory,
    categoryCounts,
    severityCounts,
    topSubcategories: Object.entries(subcategoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  };
}

export function resetVotes() {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  return true;
}

export function deleteVote(id) {
  const votes = getAllVotes();
  const filtered = votes.filter(v => v.id !== id);
  fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

const VIEWERS_FILE = path.join(DATA_DIR, 'viewers.json');

if (!fs.existsSync(VIEWERS_FILE)) {
  fs.writeFileSync(VIEWERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export function getAllViewers() {
  try {
    if (!fs.existsSync(VIEWERS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(VIEWERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading viewers file:', err);
    return [];
  }
}

export function saveViewer({ name, key }) {
  const viewers = getAllViewers();
  const newViewer = {
    id: `viewer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: (name || 'Гость').trim(),
    key: (key || '').trim(),
    createdAt: new Date().toISOString(),
    role: 'viewer'
  };

  viewers.unshift(newViewer);
  fs.writeFileSync(VIEWERS_FILE, JSON.stringify(viewers, null, 2), 'utf-8');
  return newViewer;
}

export function deleteViewer(id) {
  const viewers = getAllViewers();
  const filtered = viewers.filter(v => v.id !== id);
  fs.writeFileSync(VIEWERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export function findViewerByKey(key) {
  if (!key) return null;
  const viewers = getAllViewers();
  return viewers.find(v => v.key === key) || null;
}

