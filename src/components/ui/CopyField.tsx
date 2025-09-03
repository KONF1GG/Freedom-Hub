import { useState } from "react";
import { useUIStore } from "../../stores/uiStore";

interface CopyFieldProps {
  label: string;
  value: string;
  className?: string;
}

export default function CopyField({
  label,
  value,
  className = "",
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast("Скопировано в буфер обмена");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("Ошибка копирования");
    }
  }

  return (
    <div className={`copy-field ${className}`}>
      <label className="copy-field-label">{label}</label>
      <div className="copy-field-container">
        <input
          type="text"
          value={value}
          readOnly
          className="copy-field-input"
        />
        <button
          onClick={handleCopy}
          className={`copy-button ${copied ? "copied" : "default"}`}
        >
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
    </div>
  );
}
