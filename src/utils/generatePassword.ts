import type { PasswordSettings } from "../components/SettingsPanel";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const RUS_UPPERCASE_CHARS = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
const RUS_LOWERCASE_CHARS = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Генерация пароля по настройкам
 */
export function generatePassword(settings: PasswordSettings): string {
  let availableChars = "";
  const guaranteedChars: string[] = [];

  if (settings.engUppercase) {
    availableChars += UPPERCASE_CHARS;
    guaranteedChars.push(
      UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]
    );
  }
  if (settings.engLowercase) {
    availableChars += LOWERCASE_CHARS;
    guaranteedChars.push(
      LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]
    );
  }
  if (settings.rusUppercase) {
    availableChars += RUS_UPPERCASE_CHARS;
    guaranteedChars.push(
      RUS_UPPERCASE_CHARS[Math.floor(Math.random() * RUS_UPPERCASE_CHARS.length)]
    );
  }
  if (settings.rusLowercase) {
    availableChars += RUS_LOWERCASE_CHARS;
    guaranteedChars.push(
      RUS_LOWERCASE_CHARS[Math.floor(Math.random() * RUS_LOWERCASE_CHARS.length)]
    );
  }
  if (settings.numbers) {
    availableChars += NUMBER_CHARS;
    guaranteedChars.push(
      NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]
    );
  }
  if (settings.symbols) {
    availableChars += SYMBOL_CHARS;
    guaranteedChars.push(
      SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]
    );
  }

  if (availableChars.length === 0) {
    throw new Error("Не выбран ни один набор символов для генерации пароля.");
  }

  const remainingLength = settings.length - guaranteedChars.length;
  let passwordArray = [...guaranteedChars];

  for (let i = 0; i < remainingLength; i++) {
    passwordArray.push(
      availableChars[Math.floor(Math.random() * availableChars.length)]
    );
  }

  // 🔀 Перемешиваем символы (Fisher–Yates shuffle)
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}
