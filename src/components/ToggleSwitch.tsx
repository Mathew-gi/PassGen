import React from "react";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
}) => {
  return (
    <label htmlFor={id} className="switch">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );
};
