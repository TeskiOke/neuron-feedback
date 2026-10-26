import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllVotes,
  saveVote,
  getStats,
  resetVotes,
  deleteVote,
  getAllViewers,
  saveViewer,
  deleteViewer
} from './db.js';
import { checkProfanity } from '../src/utils/profanityFilter.js';
import { checkMeaningfulText, checkValidContactName, checkValidContactUsername } from '../src/utils/textValidation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (k && !process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_SECRET = process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY || 'Unio#DstU$2026!k9XvM8_qL3pZ7wA';

function timingSafeCompare(candidate, secret) {
  if (typeof candidate !== 'string' || typeof secret !== 'string') return false;
  if (candidate.length === 0 || secret.length === 0) return false;
  const candidateHash = crypto.createHash('sha256').update(candidate).digest();
  const secretHash = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(candidateHash, secretHash);
}

function authenticateKey(candidate) {
  if (!candidate || typeof candidate !== 'string') return null;

  if (timingSafeCompare(candidate, ADMIN_SECRET)) {
    return { role: 'admin', name: 'Главный администратор' };
  }

  const viewers = getAllViewers();
  for (const v of viewers) {
    if (timingSafeCompare(candidate, v.key)) {
      return { role: 'viewer', name: v.name, id: v.id };
    }
  }

  return null;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkSurveyRateLimit(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length <= MAX_REQUESTS_PER_WINDOW;
}

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
  }
});

app.post('/api/vote', (req, res) => {
  try {
    const clientIp = getClientIp(req);

    if (!checkSurveyRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Слишком много запросов. Пожалуйста, подождите минуту.'
      });
    }

    const {
      categories: rawCategories,
      category,
      categoryLabel,
      subcategories,
      customProblem,
      details,
      severity,
      isAnonymous,
      contactName,
      contactUsername,
      isCompleted
    } = req.body;

    if (isCompleted !== true && isCompleted !== 'true') {
      return res.status(400).json({
        success: false,
        error: 'Анкета не завершена: опрос не был пройден до конца.'
      });
    }

    const entries = Array.isArray(rawCategories) && rawCategories.length > 0
      ? rawCategories
      : [{
          category,
          categoryLabel,
          subcategories,
          customProblem,
          details,
          severity
        }];

    const validatedEntries = [];
    for (const [idx, entry] of entries.entries()) {
      if (!entry.category || typeof entry.category !== 'string' || entry.category.trim() === '') {
        return res.status(400).json({
          success: false,
          error: `Анкета не завершена: пожалуйста, выберите сферу проблемы (направление ${idx + 1}).`
        });
      }

      const validSubcategories = Array.isArray(entry.subcategories)
        ? entry.subcategories.filter(s => typeof s === 'string' && s.trim().length > 0)
        : [];
      const trimmedCustom = (entry.customProblem || '').trim();

      if (validSubcategories.length === 0) {
        if (trimmedCustom.length === 0) {
          return res.status(400).json({
            success: false,
            error: `Анкета не завершена: выберите хотя бы один пункт или опишите проблему для сферы «${entry.categoryLabel || entry.category}».`
          });
        }
        const customCheck = checkMeaningfulText(trimmedCustom, 4);
        if (!customCheck.isValid) {
          return res.status(400).json({
            success: false,
            error: `В сфере «${entry.categoryLabel || entry.category}» свой вариант проблемы описан некорректно: ${customCheck.reason}`
          });
        }
      } else if (trimmedCustom.length > 0) {
        const customCheck = checkMeaningfulText(trimmedCustom, 4);
        if (!customCheck.isValid) {
          return res.status(400).json({
            success: false,
            error: `В сфере «${entry.categoryLabel || entry.category}» свой вариант проблемы описан некорректно: ${customCheck.reason}`
          });
        }
      }

      const trimmedDetails = (entry.details || '').trim();
      if (trimmedDetails.length > 0) {
        const detailsCheck = checkMeaningfulText(trimmedDetails, 4);
        if (!detailsCheck.isValid) {
          return res.status(400).json({
            success: false,
            error: `В сфере «${entry.categoryLabel || entry.category}» комментарий описан некорректно: ${detailsCheck.reason}`
          });
        }
      }

      const entrySeverity = entry.severity || 'annoying';
      if (!['mild', 'annoying', 'critical'].includes(entrySeverity)) {
        return res.status(400).json({
          success: false,
          error: `Анкета не завершена: укажите уровень критичности для сферы «${entry.categoryLabel || entry.category}».`
        });
      }

      const textFields = [trimmedCustom, trimmedDetails].filter(Boolean);
      for (const text of textFields) {
        if (checkProfanity(text).hasProfanity) {
          return res.status(400).json({
            success: false,
            error: 'Ай-ай-ай! В ответе обнаружена ненормативная лексика. Пожалуйста, пишите культурно.'
          });
        }
      }

      validatedEntries.push({
        category: entry.category,
        categoryLabel: entry.categoryLabel || 'Общее',
        subcategories: validSubcategories,
        customProblem: trimmedCustom,
        details: trimmedDetails,
        severity: entrySeverity
      });
    }

    if (!isAnonymous) {
      if (contactName && !checkValidContactName(contactName).isValid) {
        return res.status(400).json({
          success: false,
          error: 'Пожалуйста, укажите настоящее имя в контактах (не только цифры).'
        });
      }
      if (contactUsername && !checkValidContactUsername(contactUsername).isValid) {
        return res.status(400).json({
          success: false,
          error: 'Пожалуйста, укажите корректный контакт (Telegram или телефон).'
        });
      }
    }

    const contactFields = [contactName, contactUsername].filter(Boolean);
    for (const text of contactFields) {
      if (checkProfanity(text).hasProfanity) {
        return res.status(400).json({
          success: false,
          error: 'Ай-ай-ай! В контактах обнаружена ненормативная лексика. Пожалуйста, пишите культурно.'
        });
      }
    }

    const first = validatedEntries[0];
    const voteRecord = saveVote({
      categories: validatedEntries,
      category: first.category,
      categoryLabel: first.categoryLabel,
      subcategories: first.subcategories,
      customProblem: first.customProblem,
      details: first.details,
      severity: first.severity,
      isAnonymous: Boolean(isAnonymous),
      contactName: isAnonymous ? '' : (contactName || '').trim(),
      contactUsername: isAnonymous ? '' : (contactUsername || '').trim(),
      isCompleted: true,
      ipMasked: clientIp.replace(/:\d+$/, '').slice(0, 10) + '***',
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    res.cookie('unio_voted', '1', {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      vote: voteRecord,
      stats: getStats()
    });
  } catch (err) {
    console.error('Vote submission error:', err);
    res.status(500).json({
      success: false,
      error: 'Ошибка при сохранении ответа'
    });
  }
});

function requireAccess(req, res, next) {
  const clientIp = getClientIp(req);
  const attemptData = loginAttempts.get(clientIp);
  const now = Date.now();

  if (attemptData && attemptData.lockedUntil > now) {
    const remainingMin = Math.ceil((attemptData.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Доступ заблокирован. Попробуйте через ${remainingMin} мин.`
    });
  }

  const candidate = req.headers['x-admin-key'] || req.headers['x-admin-pin'] || req.query.key || req.query.pin;
  const user = authenticateKey(candidate);

  if (user) {
    req.user = user;
    return next();
  }
  return res.status(401).json({ success: false, error: 'Доступ запрещен' });
}

function requireSuperAdmin(req, res, next) {
  const candidate = req.headers['x-admin-key'] || req.headers['x-admin-pin'] || req.query.key || req.query.pin;
  const user = authenticateKey(candidate);

  if (user && user.role === 'admin') {
    req.user = user;
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Действие доступно только главному администратору'
  });
}

app.post('/api/admin/login', async (req, res) => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  let attemptData = loginAttempts.get(clientIp);

  if (attemptData && attemptData.lockedUntil > 0 && attemptData.lockedUntil <= now) {
    loginAttempts.delete(clientIp);
    attemptData = null;
  }

  if (attemptData && attemptData.lockedUntil > now) {
    const remainingMin = Math.ceil((attemptData.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Слишком много неверных попыток. Доступ заблокирован на ${remainingMin} мин.`
    });
  }

  await new Promise(r => setTimeout(r, 500));

  const candidate = req.body.password || req.body.key || req.body.pin;
  const user = authenticateKey(candidate);

  if (user) {
    loginAttempts.delete(clientIp);
    return res.json({
      success: true,
      role: user.role,
      name: user.name,
      message: 'Авторизация успешна'
    });
  } else {
    const newCount = (attemptData?.failedCount || 0) + 1;
    const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - newCount);

    if (newCount >= MAX_FAILED_ATTEMPTS) {
      loginAttempts.set(clientIp, {
        failedCount: newCount,
        lockedUntil: now + LOCKOUT_DURATION_MS
      });
      return res.status(429).json({
        success: false,
        error: 'Превышен лимит попыток. Доступ временно заблокирован на 15 минут.'
      });
    } else {
      loginAttempts.set(clientIp, {
        failedCount: newCount,
        lockedUntil: 0
      });
      return res.status(401).json({
        success: false,
        error: `Неверный ключ доступа. Осталось попыток: ${remainingAttempts}`
      });
    }
  }
});

app.get('/api/admin/votes', requireAccess, (req, res) => {
  try {
    const votes = getAllVotes();
    const stats = getStats();
    res.json({
      success: true,
      votes,
      stats,
      role: req.user.role,
      userName: req.user.name
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch votes' });
  }
});

app.delete('/api/admin/votes/:id', requireSuperAdmin, (req, res) => {
  try {
    const { id } = req.params;
    deleteVote(id);
    res.json({ success: true, message: 'Отзыв удален' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

app.post('/api/admin/clear', requireSuperAdmin, (req, res) => {
  try {
    resetVotes();
    res.json({ success: true, message: 'Все ответы очищены' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to clear' });
  }
});

app.get('/api/admin/viewers', requireSuperAdmin, (req, res) => {
  try {
    const viewers = getAllViewers();
    res.json({ success: true, viewers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to list viewers' });
  }
});

function generateComplexPassword(length = 30) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*()_+-=';
  const all = upper + lower + digits + symbols;

  const bytes = crypto.randomBytes(length);
  const pwd = [
    upper[bytes[0] % upper.length],
    lower[bytes[1] % lower.length],
    digits[bytes[2] % digits.length],
    symbols[bytes[3] % symbols.length]
  ];

  for (let i = 4; i < length; i++) {
    pwd.push(all[bytes[i] % all.length]);
  }

  for (let i = pwd.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }

  return pwd.join('');
}

app.post('/api/admin/viewers', requireSuperAdmin, (req, res) => {
  try {
    const { name, key } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Укажите имя или назначение аккаунта' });
    }

    const finalKey = (key && key.trim())
      ? key.trim()
      : generateComplexPassword(30);

    const created = saveViewer({
      name: name.trim(),
      key: finalKey
    });

    res.json({ success: true, viewer: created });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create viewer' });
  }
});

app.delete('/api/admin/viewers/:id', requireSuperAdmin, (req, res) => {
  try {
    const { id } = req.params;
    deleteViewer(id);
    res.json({ success: true, message: 'Учетная запись удалена' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete viewer' });
  }
});

app.get('/api/admin/export/csv', requireAccess, (req, res) => {
  try {
    const votes = getAllVotes();
    const headers = ['ID', 'Дата', 'Категория', 'Подкатегории', 'Своя проблема', 'Текст идеи', 'Важность', 'Анонимно', 'Имя', 'Контакт'];
    
    const rows = votes.map(v => [
      v.id,
      v.createdAt,
      `"${(v.categoryLabel || '').replace(/"/g, '""')}"`,
      `"${((v.subcategories || []).join('; ')).replace(/"/g, '""')}"`,
      `"${(v.customProblem || '').replace(/"/g, '""')}"`,
      `"${(v.details || '').replace(/"/g, '""')}"`,
      v.severity,
      v.isAnonymous ? 'Да' : 'Нет',
      `"${(v.contactName || '').replace(/"/g, '""')}"`,
      `"${(v.contactUsername || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="unio-survey-results.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).send('Error exporting CSV');
  }
});

app.get('/api/admin/export/json', requireAccess, (req, res) => {
  try {
    const votes = getAllVotes();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="unio-survey-results.json"');
    res.send(JSON.stringify(votes, null, 2));
  } catch (err) {
    res.status(500).send('Error exporting JSON');
  }
});

app.listen(PORT, () => {
  console.log(`[Unio Survey Backend] Server running on http://localhost:${PORT}`);
});
