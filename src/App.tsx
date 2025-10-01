// src/App.tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { SettingsPanel } from "./components/SettingsPanel";
import type { PasswordSettings } from "./components/SettingsPanel";
import { generatePassword } from "./utils/generatePassword";
import { calculateStrength } from "./utils/calculateStrength";
import type { StrengthResult } from "./utils/calculateStrength";
import { PasswordInput } from "./components/PasswordInput";

// --- Иконки ---
const GenerateIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.2,5.77C8.61,6.01,8.08,6.33,7.58,6.71L5.19,5.75C4.97,5.68,4.72,5.75,4.6,5.97L2.68,9.29 c-0.11,0.2-0.06,0.47,0.12,0.61L4.83,11.48c-0.04,0.3-0.07,0.62-0.07,0.94c0,0.32,0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.96 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.36-2.96c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.12-0.2,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
  </svg>
);

function App() {
  const [password, setPassword] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    engUppercase: true,
    engLowercase: true,
    rusUppercase: false,
    rusLowercase: false,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = useState<StrengthResult | null>(null);

  const handleGeneratePassword = useCallback(() => {
    try {
      const pass = generatePassword(settings);
      setPassword(pass);

      const analysis = calculateStrength(pass);
      setStrength(analysis);
    } catch (err) {
      alert((err as Error).message);
    }
  }, [settings]);

  // useEffect(() => {
  //   handleGeneratePassword();
  // }, [handleGeneratePassword]);

  const handleSettingChange = (field: keyof PasswordSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="app-container">
      <h1>Генератор Паролей</h1>
      <div className="password-generator">
        <div className="main-controls">
          <PasswordInput
            value={password}
            placeholder="Нажмите 'Обновить' для генерации"
            onChange={(e) => {
              const newPass = e;
              setPassword(newPass);
              setStrength(calculateStrength(newPass));
            }}
          ></PasswordInput>

          <button
            className="icon-btn"
            onClick={handleGeneratePassword}
            title="Сгенерировать"
          >
            <GenerateIcon />
          </button>

          <button
            className={`icon-btn ${isSettingsOpen ? "open" : ""}`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Настройки"
          >
            <SettingsIcon />
          </button>
        </div>

        {/* --- Индикация надежности --- */}
        {strength && (
          <div className="strength-container">
            <div className="strength-meter">
              <div
                className="strength-bar"
                style={{
                  width: `${(strength.score / 4) * 100}%`,
                  backgroundColor:
                    strength.score >= 3
                      ? "#4ade80"
                      : strength.score === 2
                      ? "#facc15"
                      : "#f87171",
                }}
              ></div>
            </div>
            <div className="strength-text">{strength.label}</div>
            <motion.div layout className="strength-container">
              <AnimatePresence>
                {strength.reasons.map((reason, idx) => (
                  <motion.p
                    layout
                    key={reason + idx}
                    className="strength-reasons"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {reason}
                  </motion.p>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        <SettingsPanel
          isOpen={isSettingsOpen}
          settings={settings}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  );
}

export default App;
