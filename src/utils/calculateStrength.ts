export interface StrengthResult {
  score: number;
  label: string;
  reasons: string[];
}

export function calculateStrength(password: string): StrengthResult {
  const warnings: string[] = [];
  const critical: string[] = [];
  const length = password.length;

  if (length === 0) {
    return { score: 0, label: "Пустой пароль", reasons: ["Пароль отсутствует"] };
  }

  // Уникальные символы (фактическое разнообразие)
  const uniqueChars = new Set(password).size;

  // Теоретический размер алфавита (на основе типов символов, которые использованы)
  let alphabetSize = 0;
  if (/[A-Z]/.test(password)) alphabetSize += 26;
  if (/[a-z]/.test(password)) alphabetSize += 26;
  if (/[А-ЯЁ]/.test(password)) alphabetSize += 33;
  if (/[а-яё]/.test(password)) alphabetSize += 33;
  if (/[0-9]/.test(password)) alphabetSize += 10;
  if (/[!@#$%^&*()_\-+\=\[\]{}|;:,.<>?]/.test(password)) alphabetSize += 30;

  const varietyCount = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[А-ЯЁ]/.test(password),
    /[а-яё]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_\-+\=\[\]{}|;:,.<>?]/.test(password),
  ].filter(Boolean).length;

  if (varietyCount < 2) warnings.push("Используется слишком мало разных типов символов");

  // length warnings (не критично — только рекомендация)
  if (length < 8) {
    critical.push("Слишком короткий пароль (< 8 символов)");
  } else if (length < 12) {
    warnings.push("Рекомендуется использовать хотя бы 12 символов");
  }

  // Повторы — критично
  if (/^(.)\1+$/.test(password)) {
    critical.push("Пароль состоит из одного повторяющегося символа");
  }

  // Частые шаблоны — критично
  const lower = password.toLowerCase();
  const commonPatterns = [
    "12345", "password", "qwerty", "admin", "letmein",
    "welcome", "iloveyou", "monkey", "dragon", "football",
    "111111", "abc123", "qwerty123", "asdfgh", "zaq12wsx",
    "qazwsx", "passw0rd", "root", "test", "user",
  ];
  if (commonPatterns.some(p => lower.includes(p))) {
    critical.push("Пароль содержит распространённую комбинацию или слово");
  }

  // Последовательности клавиатуры / цифр — критично (с учётом длины фрагмента)
  const sequences = [
    "qwertyuiop", "asdfghjkl", "zxcvbnm",
    "йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю",
    "1234567890", "0987654321",
  ];
  // проверим наличие длинных фрагментов последовательностей (>=4)
  const hasSeq = sequences.some(seq => {
    for (let len = 4; len <= seq.length; len++) {
      for (let i = 0; i + len <= seq.length; i++) {
        const frag = seq.slice(i, i + len);
        if (lower.includes(frag)) return true;
      }
    }
    return false;
  });
  if (hasSeq) {
    critical.push("Пароль содержит последовательность клавиатуры или цифр");
  }

  // === Энтропия с учётом реального разнообразия ===
  const safeAlphabet = Math.max(alphabetSize, 1); // чтобы не делить на 0
  const baseEntropy = length * Math.log2(safeAlphabet);

  // насколько фактическое уникальное разнообразие близко к максимуму возможному
  // максимум возможного уникальных символов в пароле = min(length, alphabetSize)
  const maxPossibleUnique = Math.min(length, safeAlphabet);
  const diversityRatio = maxPossibleUnique > 0 ? (uniqueChars / maxPossibleUnique) : 0;

  // ограничим ratio в [0.05, 1] чтобы полностью не обнулять энтропию
  const clampedRatio = Math.max(0.05, Math.min(1, diversityRatio));

  // скорректированная энтропия: базовая энтропия * коэффициент разнообразия
  const entropy = baseEntropy * clampedRatio;

  // === Балл по энтропии ===
  let score: number;
  if (entropy < 28) score = 0;
  else if (entropy < 36) score = 1;
  else if (entropy < 60) score = 2;
  else if (entropy < 80) score = 3;
  else score = 4;

  // === Коррекция по критическим проблемам ===
  if (critical.length > 0) {
    // Если есть критические проблемы — ограничим верхнюю границу (но не обязательно до 1)
    // например: если score >= 3 и есть критика — понижаем на 2 шага; если score 2 — делаем 1.
    if (score >= 3) score = Math.max(1, score - 2);
    else if (score === 2) score = 1;
    else score = Math.max(0, score);
  }

  const labels = ["Очень слабый", "Слабый", "Средний", "Хороший", "Отличный"];
  const reasons = [...critical, ...warnings]; // сначала критичные, затем предупреждения
  const label = labels[score];

  return { score, label, reasons };
}
