

const WHITELIST_WORDS = [
  'употреблять', 'употребление', 'употребляет', 'употребляют', 'употребить',
  'оскорблять', 'оскорбление', 'оскорбляет', 'оскорбляют', 'оскорбить',
  'хлеб', 'хлеба', 'хлебом', 'хлебобулочный',
  'колебания', 'колебание', 'колебаться', 'колеблется',
  'потребность', 'потребности', 'потребитель',
  'стебель', 'стебля', 'стебли',
  'рубль', 'рубля', 'рублей',
  'гребля', 'влюблен', 'влюбленный', 'влюбленность',
  'сабля', 'ястреб', 'ястребы',
  'терапевт', 'терапия',
  'страхование', 'страховка', 'страх',
  'психолог', 'психология',
  'художник', 'художественный', 'художество',
  'худой', 'похудеть', 'худеть',
  'худший', 'хуже',
  'команда', 'команды', 'команде', 'командой', 'командами', 'командир', 'командировка',
  'мандарин', 'мандарины', 'мандаринов', 'мандаринка',
  'мандат', 'мандаты', 'мандатом',
  'мудрый', 'мудрость', 'мудрец', 'мудрецы',
  'педагог', 'педагогика', 'педиатрия',
  'шаблон', 'шаблоны', 'шаблоном',
  'скраб', 'скрабы',
  'душа', 'душевный', 'душ',
  'сукно', 'суксун', 'барсук',
  'простой', 'просто', 'просить',
  'сбор', 'сборы', 'сборная',
  'сцена', 'сценарий', 'сценарии'
];

function visualHomoglyphs(str) {
  const map = {
    'a': 'а', '@': 'а', '4': 'а',
    'b': 'б', '6': 'б',
    'c': 'с', 's': 'с', '$': 'с',
    'd': 'д',
    'e': 'е', 'ё': 'е', '3': 'е',
    'g': 'г',
    'h': 'х', 'x': 'х',
    'i': 'и', '1': 'и', '!': 'и', '|': 'и', 'j': 'й',
    'k': 'к',
    'l': 'л',
    'm': 'м',
    'n': 'н',
    'o': 'о', '0': 'о',
    'p': 'п',
    'r': 'р',
    't': 'т', '7': 'т',
    'u': 'у', 'y': 'у',
    'v': 'в', 'w': 'в',
    'z': 'з'
  };
  return str.split('').map(c => map[c] || c).join('');
}

function phoneticTranslit(str) {
  let s = str
    .replace(/shch/g, 'щ')
    .replace(/sh/g, 'ш')
    .replace(/ch/g, 'ч')
    .replace(/zh/g, 'ж')
    .replace(/ya/g, 'я')
    .replace(/yu/g, 'ю')
    .replace(/yo/g, 'ё')
    .replace(/ye/g, 'е')
    .replace(/kh/g, 'х')
    .replace(/ts/g, 'ц');

  const map = {
    'a': 'а', 'b': 'б', 'c': 'с', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г',
    'h': 'х', 'i': 'и', 'j': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
    'o': 'о', 'p': 'п', 'q': 'к', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
    'v': 'в', 'w': 'в', 'x': 'х', 'y': 'й', 'z': 'з'
  };
  return s.split('').map(c => map[c] || c).join('');
}

function collapseRepeats(str) {
  return str.replace(/(.)\1+/g, '$1');
}

const WORD_PATTERNS = [
  
  /^(на|по|до|ни|за|о|от|вы|не|с)?х[уy][йиеёяюea]/iu,
  /х[уy][йиеёяюea]/iu,
  /^хер/iu,

  
  /п[иi1е]зд/iu,

  
  /^(за|вы|от|по|пере|под|на|про|до|с|раз|об|из|в|при|не|вз|у)?(е|ё)б/iu,
  /(долбо|долба)(е|ё)б/iu,
  /(е|ё)бл[оаяие]/iu,
  /^(е|ё)пт[а]?/iu,

  
  /^(б|6)л[яе]/iu,
  /^выбл[яе]д/iu,

  
  /^с[уu]к[аиоыеёя]/iu,
  /^с[уu]чк/iu,
  /^с[уu]ч[ая]/iu,

  
  /^муд[аио][кйл]/iu,
  /^мудоз/iu,

  
  /^п[иеi]д[оа]р/iu,
  /^педр?[ие]л/iu,
  /^пед[ие]к/iu,

  
  /^г[ао]нд[оа]н/iu,

  
  /^шл[юу]х/iu,
  /^шал[ао]в/iu,

  
  /^др[оа]ч/iu,
  /^задр[оа]т/iu,

  
  /^зал[уо]п/iu,

  
  /^г[ао]вн/iu,

  
  /^(за|вы|на|обо|об|по|под|про)?ср[аяуеио]/iu,
  /^(за|на|обо|об)?дри[сщ]/iu,

  
  /^(за|вы|на|обо|об|по)?сс[аыуеи]/iu,
  /^сц[ауы]/iu,
  /^сцы/iu,

  
  /^(от|за|по)?манд[ауеоы]/iu,

  
  /^елд[ао]/iu,
  /^елдак/iu,

  
  /^бзд[еиюоа]/iu,

  
  /^(fuck|fucking|fucker|fucked|motherfucker|bitch|shit|bullshit|cunt|dick|cock|asshole|whore|slut|bastard|pussy|faggot|retard)/iu
];

export function checkProfanity(text) {
  if (!text || typeof text !== 'string') return { hasProfanity: false };
  const raw = text.toLowerCase().trim();
  if (!raw) return { hasProfanity: false };

  
  if (/\b(fuck|fucking|fucker|fucked|motherfucker|bitch|shit|bullshit|cunt|dick|cock|asshole|whore|slut|bastard|pussy|faggot|retard)\b/i.test(raw)) {
    return { hasProfanity: true, word: text };
  }

  
  const words = raw.split(/[\s,.;:!?_—\-+=*/\\|()\[\]{}"'«»~`^@#$%&<>]+/);

  for (const word of words) {
    if (!word || word.length < 2) continue;

    if (WHITELIST_WORDS.includes(word)) continue;

    const matchedWhitelist = WHITELIST_WORDS.find(w => word.includes(w));
    if (matchedWhitelist) {
      const rem = word.replace(matchedWhitelist, '');
      if (!rem || rem.length < 3) continue;
    }

    const visual = visualHomoglyphs(word);
    const phonetic = phoneticTranslit(word);
    const visCollapsed = collapseRepeats(visual);
    const phonCollapsed = collapseRepeats(phonetic);
    const wordCollapsed = collapseRepeats(word);

    const candidates = [word, wordCollapsed, visual, visCollapsed, phonetic, phonCollapsed];

    for (const cand of candidates) {
      for (const rx of WORD_PATTERNS) {
        if (rx.test(cand)) {
          if (!WHITELIST_WORDS.some(w => cand.includes(w))) {
            return { hasProfanity: true, word };
          }
        }
      }
    }
  }

  const stripped = raw.replace(/[^a-zа-я0-9]/gi, '');
  if (stripped.length >= 3 && stripped.length <= 40) {
    if (!WHITELIST_WORDS.some(w => stripped.includes(w))) {
      const vis = collapseRepeats(visualHomoglyphs(stripped));
      const phon = collapseRepeats(phoneticTranslit(stripped));
      for (const cand of [vis, phon]) {
        for (const rx of WORD_PATTERNS) {
          if (rx.test(cand)) {
            return { hasProfanity: true, word: text };
          }
        }
      }
    }
  }

  return { hasProfanity: false };
}
