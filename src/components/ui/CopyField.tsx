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
    <div className={`form-group ${className}`}>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2">
        <input
          type="text"
          value={value}
          readOnly
          className="form-input bg-light"
        />
        <button
          onClick={handleCopy}
          className={`btn ${copied ? "btn-success" : "btn-primary"}`}
        >
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
    </div>
  );
}
