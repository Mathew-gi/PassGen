import React from "react";
import { ToggleSwitch } from "./ToggleSwitch";

export interface PasswordSettings {
  length: number;
  engUppercase: boolean;
  rusUppercase: boolean;
  engLowercase: boolean;
  rusLowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  settings: PasswordSettings;
  onSettingChange: (field: keyof PasswordSettings, value: any) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  settings,
  onSettingChange,
}) => {
  return (
    <div className={`settings ${isOpen ? "open" : ""}`}>
      <div className="setting length-setting">
        <div className="length-header">
          <label htmlFor="length">Длина пароля</label>
          <span id="length-value">{settings.length}</span>
        </div>
        <input
          type="range"
          id="length"
          min="4"
          max="32"
          value={settings.length}
          onChange={(e) =>
            onSettingChange("length", parseInt(e.target.value, 10))
          }
        />
      </div>

      <div className="settings-grid">
        <div className="setting">
          <label htmlFor="engUppercase" data-short="A-Z">
            Заглавные английские буквы (A-Z)
          </label>
          <ToggleSwitch
            id="engUppercase"
            checked={settings.engUppercase}
            onChange={(e) => onSettingChange("engUppercase", e.target.checked)}
          />
        </div>
        <div className="setting">
          <label htmlFor="engLowercase" data-short="a-z">
            Строчные английские буквы (a-z)
          </label>
          <ToggleSwitch
            id="engLowercase"
            checked={settings.engLowercase}
            onChange={(e) => onSettingChange("engLowercase", e.target.checked)}
          />
        </div>
        <div className="setting">
          <label htmlFor="rusUppercase" data-short="А-Я">
            Заглавные русские буквы (А-Я)
          </label>
          <ToggleSwitch
            id="rusUppercase"
            checked={settings.rusUppercase}
            onChange={(e) => onSettingChange("rusUppercase", e.target.checked)}
          />
        </div>
        <div className="setting">
          <label htmlFor="rusLowercase" data-short="а-я">
            Строчные русские буквы (а-я)
          </label>
          <ToggleSwitch
            id="rusLowercase"
            checked={settings.rusLowercase}
            onChange={(e) => onSettingChange("rusLowercase", e.target.checked)}
          />
        </div>
        <div className="setting">
          <label htmlFor="numbers" data-short="0-9">
            Цифры (0-9)
          </label>
          <ToggleSwitch
            id="numbers"
            checked={settings.numbers}
            onChange={(e) => onSettingChange("numbers", e.target.checked)}
          />
        </div>
        <div className="setting">
          <label htmlFor="symbols" data-short="!-$^?">
            Символы (!-$^?)
          </label>
          <ToggleSwitch
            id="symbols"
            checked={settings.symbols}
            onChange={(e) => onSettingChange("symbols", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};
