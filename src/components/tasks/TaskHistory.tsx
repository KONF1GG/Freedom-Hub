import { RequestHistoryEntry } from "../../types/request";

interface TaskHistoryProps {
  history: RequestHistoryEntry[];
}

export default function TaskHistory({ history }: TaskHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        История изменений пуста
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry, index) => (
        <div
          key={index}
          className="bg-slate-700 rounded-lg p-4 border border-slate-600"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-200">
              {entry.action}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(entry.timestamp).toLocaleString("ru-RU")}
            </span>
          </div>
          {entry.description && (
            <p className="text-sm text-slate-300">{entry.description}</p>
          )}
          {entry.user && (
            <p className="text-xs text-slate-400 mt-1">
              Пользователь: {entry.user}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
