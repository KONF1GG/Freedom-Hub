import { useState } from "react";
import { useUIStore } from "../../stores/uiStore";

interface ClickableDataFieldProps {
  value: string;
  className?: string;
}

export default function ClickableDataField({
  value,
  className = "",
}: ClickableDataFieldProps) {
  const [copied, setCopied] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast("Скопировано в буфер обмена", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("Ошибка копирования", "error");
    }
  }

  return (
    <div
      className={`clickable-data-field ${copied ? "copied" : ""} ${className}`}
      onClick={handleCopy}
      title="Нажмите для копирования"
    >
      <span className="data-field-value">{value}</span>
      <div className="data-field-icon">
        {copied ? (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        )}
      </div>
    </div>
  );
}
