export interface StrengthResult {
  score: number; // 0–4
  label: string; // текстовая оценка
  reasons: string[]; // причины слабости
}

export function calculateStrength(password: string): StrengthResult {
  const reasons: string[] = [];
  const length = password.length;

  // Определяем, какие алфавиты реально используются
  let alphabetSize = 0;

  if (/[A-Z]/.test(password)) alphabetSize += 26; // латиница верхний
  if (/[a-z]/.test(password)) alphabetSize += 26; // латиница нижний
  if (/[А-ЯЁ]/.test(password)) alphabetSize += 33; // русские верхний
  if (/[а-яё]/.test(password)) alphabetSize += 33; // русские нижний
  if (/[0-9]/.test(password)) alphabetSize += 10; // цифры
  if (/[!@#$%^&*()_\-+\=\[\]{}|;:,.<>?]/.test(password)) alphabetSize += 30; // спецсимволы (условно)

  if (length === 0) {
    return {
      score: 0,
      label: "Пустой пароль",
      reasons: ["Пароль отсутствует"],
    };
  }

  // Если только один вид символов → слабое разнообразие
  const varietyCount = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[А-ЯЁ]/.test(password),
    /[а-яё]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_\-+\=\[\]{}|;:,.<>?]/.test(password),
  ].filter(Boolean).length;

  if (varietyCount < 2) {
    reasons.push("Используется слишком мало разных типов символов");
  }

  if (length < 8) {
    reasons.push("Слишком короткий пароль (< 8 символов)");
  } else if (length < 12) {
    reasons.push("Рекомендуется использовать хотя бы 12 символов");
  }

  // Энтропия (в битах)
  const entropy = length * Math.log2(alphabetSize || 1);

  // Градации (можно подогнать под реальные требования)
  let score: number;
  if (entropy < 28) score = 0; // очень слабый
  else if (entropy < 36) score = 1; // слабый
  else if (entropy < 60) score = 2; // средний
  else if (entropy < 80) score = 3; // хороший
  else score = 4; // отличный

  const labels = ["Очень слабый", "Слабый", "Средний", "Хороший", "Отличный"];
  const label = labels[score];

  return { score, label, reasons };
}
