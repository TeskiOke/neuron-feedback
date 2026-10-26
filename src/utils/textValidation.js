

export function checkMeaningfulText(text, minLetters = 4) {
  if (!text || typeof text !== 'string') {
    return { isValid: true, isDummy: false, reason: null };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { isValid: true, isDummy: false, reason: null };
  }

  
  const lettersMatch = trimmed.match(/[a-zA-Zа-яА-ЯёЁ]/g) || [];
  const letterCount = lettersMatch.length;

  if (letterCount === 0) {
    return {
      isValid: false,
      isDummy: true,
      reason: 'Ответ не может состоять только из цифр или знаков. Опишите мысль словами.'
    };
  }

  const lower = trimmed.toLowerCase();
  const allowedShort = ['wifi', 'вайфай', 'бот', 'душ', 'свет', 'еда', 'тир', 'спорт', 'зал', 'тихо', 'шум'];
  const cleanAlpha = lower.replace(/[^a-zа-яё]/g, '');
  const isAllowedShort = allowedShort.includes(cleanAlpha);

  
  if (letterCount < minLetters && !isAllowedShort) {
    return {
      isValid: false,
      isDummy: true,
      reason: `Слишком короткий ответ (нужно написать хотя бы одно-два слова, от ${minLetters} букв)`
    };
  }

  
  const digitsMatch = trimmed.match(/\d/g) || [];
  const digitCount = digitsMatch.length;
  if (digitCount >= 4 && letterCount < 4) {
    return {
      isValid: false,
      isDummy: true,
      reason: 'Слишком много цифр и недостаточно слов для описания'
    };
  }
  if (digitCount > letterCount * 2 && letterCount < 6) {
    return {
      isValid: false,
      isDummy: true,
      reason: 'Ответ в основном состоит из цифр. Пожалуйста, опишите проблему словами'
    };
  }

  
  if (/(.)\1{4,}/.test(trimmed)) {
    return {
      isValid: false,
      isDummy: true,
      reason: 'Обнаружен повторяющийся набор одинаковых символов'
    };
  }

  
  const dummyKeyboardSequences = [
    'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'wsxedc', 'edcrfv',
    'йцукен', 'фывапр', 'ячсмит', 'йфячыв', 'цывувс',
    'test', 'тест', 'проверка', 'проверить', 'скип', 'skip',
    'блабла', 'хз', 'хзхз', 'лол', 'кек', 'фыва', 'вапы'
  ];

  for (const seq of dummyKeyboardSequences) {
    if (cleanAlpha === seq || (cleanAlpha.startsWith(seq) && cleanAlpha.length <= seq.length + 2)) {
      return {
        isValid: false,
        isDummy: true,
        reason: 'Бессмысленный набор клавиш или заглушка. Опишите реальную проблему'
      };
    }
  }

  
  const cleanDigits = trimmed.replace(/\D/g, '');
  if (cleanDigits.length >= 3 && cleanAlpha.length < 4) {
    const digitSequences = ['0123456789', '1234567890', '9876543210', '123123', '121212', '1234', '4321'];
    for (const dseq of digitSequences) {
      if (dseq.includes(cleanDigits) || cleanDigits.includes(dseq)) {
        return {
          isValid: false,
          isDummy: true,
          reason: 'Обнаружена последовательность цифр'
        };
      }
    }
  }

  return { isValid: true, isDummy: false, reason: null };
}

export function checkValidContactName(name) {
  if (!name || typeof name !== 'string') return { isValid: false, reason: 'Укажите ваше имя' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { isValid: false, reason: 'Имя должно содержать хотя бы 2 буквы' };
  const letters = trimmed.match(/[a-zA-Zа-яА-ЯёЁ]/g) || [];
  if (letters.length < 2) return { isValid: false, reason: 'Имя не может состоять только из цифр' };
  if (/^\d+$/.test(trimmed)) return { isValid: false, reason: 'Имя не может состоять только из цифр' };
  return { isValid: true, reason: null };
}

export function checkValidContactUsername(username) {
  if (!username || typeof username !== 'string') return { isValid: false, reason: 'Укажите ваш контакт' };
  const trimmed = username.trim().replace(/^@/, '');
  if (trimmed.length < 2) return { isValid: false, reason: 'Контакт слишком короткий' };
  if (/^\d{1,4}$/.test(trimmed)) return { isValid: false, reason: 'Контакт не может состоять из 1-3 случайных цифр' };
  return { isValid: true, reason: null };
}
