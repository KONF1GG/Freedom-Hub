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
    <div className="d-flex flex-column gap-4">
      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4" style={{ fontSize: "3rem" }}>
            📜
          </div>
          <div className="text-secondary">История изменений пуста</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {history.map((entry, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="font-semibold text-lg">{entry.action}</div>
                  <div className="text-muted text-sm">
                    {new Date(entry.timestamp).toLocaleString("ru-RU")}
                  </div>
                </div>
                {entry.description && (
                  <div className="text-secondary mb-3">{entry.description}</div>
                )}
                {entry.user && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Пользователь:</span>
                    <span className="text-primary font-medium">
                      {entry.user}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
