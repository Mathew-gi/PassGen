import { useState, useEffect, useRef } from "react";
import "../App.css";

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFocused && placeholderRef.current) {
      // запустить бесконечную анимацию через CSS
      placeholderRef.current.style.animationPlayState = "running";
    } else if (placeholderRef.current) {
      placeholderRef.current.style.animationPlayState = "paused";
    }
  }, [isFocused]);

  return (
    <div className="password-wrapper">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        id="password-display"
      />
      {!value && (
        <span className="placeholder-marquee" ref={placeholderRef}>
          {placeholder}
        </span>
      )}
    </div>
  );
};
