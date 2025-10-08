import type { PasswordSettings } from "../components/SettingsPanel";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const RUS_UPPERCASE_CHARS = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
const RUS_LOWERCASE_CHARS = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function generatePassword(settings: PasswordSettings): string {
  let availableChars = "";
  const guaranteedChars: string[] = [];

  const addCategory = (chars: string, enabled: boolean) => {
    if (!enabled) return;
    availableChars += chars;
    // Добавляем гарантированный символ только если ещё есть место
    if (guaranteedChars.length < settings.length) {
      guaranteedChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  };

  addCategory("ABCDEFGHIJKLMNOPQRSTUVWXYZ", settings.engUppercase);
  addCategory("abcdefghijklmnopqrstuvwxyz", settings.engLowercase);
  addCategory("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ", settings.rusUppercase);
  addCategory("абвгдеёжзийклмнопрстуфхцчшщъыьэюя", settings.rusLowercase);
  addCategory("0123456789", settings.numbers);
  addCategory("!@#$%^&*()_+-=[]{}|;:,.<>?", settings.symbols);

  if (availableChars.length === 0) {
    throw new Error("Не выбран ни один набор символов для генерации пароля.");
  }

  const remainingLength = Math.max(settings.length - guaranteedChars.length, 0);
  const passwordArray = [...guaranteedChars];

  for (let i = 0; i < remainingLength; i++) {
    passwordArray.push(
      availableChars[Math.floor(Math.random() * availableChars.length)]
    );
  }

  // Тасуем
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.slice(0, settings.length).join(""); // на всякий случай
}
