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
        <div key={index} className="card-history">
          <div className="card-history-header">
            <span className="card-history-title">{entry.action}</span>
            <span className="card-history-time">
              {new Date(entry.timestamp).toLocaleString("ru-RU")}
            </span>
          </div>
          {entry.description && (
            <p className="card-history-description">{entry.description}</p>
          )}
          {entry.user && (
            <p className="card-history-user">Пользователь: {entry.user}</p>
          )}
        </div>
      ))}
    </div>
  );
}
