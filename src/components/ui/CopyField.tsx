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
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
        />
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
    </div>
  );
}
