import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRequestsStore } from "../../stores/requestsStore";
import type { TaskFilters } from "../../types/request";
import MapPreview from "../../components/ui/MapPreview";
import ClickableDataField from "../../components/ui/ClickableDataField";

function formatRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : undefined;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Проверяем, является ли дата сегодняшней или завтрашней
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = s.toDateString() === today.toDateString();
  const isTomorrow = s.toDateString() === tomorrow.toDateString();

  let datePrefix = "";
  if (isToday) {
    datePrefix = "Сегодня ";
  } else if (isTomorrow) {
    datePrefix = "Завтра ";
  }

  const ds = `${pad(s.getDate())}.${pad(
    s.getMonth() + 1
  )}.${s.getFullYear()} ${pad(s.getHours())}:${pad(s.getMinutes())}`;
  if (!e) return `${datePrefix}${ds}`;
  const de = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
  return `${datePrefix}${ds} - ${de}`;
}

interface RequestsListProps {
  filters: TaskFilters;
}

export default function RequestsList({ filters }: RequestsListProps) {
  const {
    filteredRequests,
    allRequests,
    isLoading,
    error,
    fetchRequests,
    updateFilters,
  } = useRequestsStore();

  useEffect(() => {
    console.log("🔄 Загружаем задачи");
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    console.log("🔍 Применяем фильтры:", filters);
    updateFilters(filters);
  }, [filters, updateFilters]);

  useEffect(() => {
    console.log("📊 Состояние задач:", {
      isLoading,
      error,
      count: filteredRequests.length,
      requests: filteredRequests.slice(0, 2), // Показываем только первые 2 для отладки
    });
  }, [filteredRequests, isLoading, error]);

  return (
    <div className="requests-scroll-container">
      <div className="requests-list">
        {isLoading && (
          <div className="card loading-state">
            <div className="card-body text-center">
              <div className="loading-icon mb-3" style={{ fontSize: "2.5rem" }}>
                ⏳
              </div>
              <div className="text-secondary">Загружаем задачи...</div>
              <div className="text-muted mt-2" style={{ fontSize: "0.875rem" }}>
                Пожалуйста, подождите
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="card error-state">
            <div className="card-body text-center">
              <div className="error-icon mb-3" style={{ fontSize: "3rem" }}>
                ⚠️
              </div>
              <h3 className="error-title mb-3">Не удалось загрузить задачи</h3>
              <div className="error-description text-secondary mb-4">
                {error}
              </div>
              <div className="error-suggestions">
                <div
                  className="text-muted mb-2"
                  style={{ fontSize: "0.875rem" }}
                >
                  <strong>Попробуйте:</strong>
                </div>
                <ul
                  className="empty-state-list text-start"
                  style={{ fontSize: "0.875rem" }}
                >
                  <li>Проверьте подключение к интернету</li>
                  <li>Потяните экран вниз для обновления</li>
                  <li>Перезапустите приложение</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {filteredRequests.length === 0 && !isLoading && !error && (
          <div className="card empty-state">
            <div className="card-body text-center">
              {allRequests.length === 0 ? (
                // Случай когда данных вообще нет
                <>
                  <div
                    className="empty-state-icon mb-4"
                    style={{ fontSize: "4rem" }}
                  >
                    📭
                  </div>
                  <h3 className="empty-state-title mb-3">Пока нет задач</h3>
                  <div className="empty-state-description text-secondary mb-4">
                    В системе пока нет ни одной задачи.
                    <br />
                    Они появятся здесь, как только будут созданы.
                  </div>
                  <div className="empty-state-suggestions">
                    <div
                      className="text-muted mb-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <strong>Возможные причины:</strong>
                    </div>
                    <ul
                      className="empty-state-list text-start"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <li>Задачи еще не были созданы</li>
                      <li>Проблемы с подключением к серверу</li>
                      <li>Потяните экран вниз для обновления</li>
                    </ul>
                  </div>
                </>
              ) : (
                // Случай когда данные есть, но фильтры ничего не возвращают
                <>
                  <div
                    className="empty-state-icon mb-4"
                    style={{ fontSize: "4rem" }}
                  >
                    🔍
                  </div>
                  <h3 className="empty-state-title mb-3">Задачи не найдены</h3>
                  <div className="empty-state-description text-secondary mb-4">
                    Попробуйте изменить параметры поиска или сбросить фильтры.
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {filteredRequests.map((task: any) => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="card request-card"
          >
            <div className="card-body">
              <div className="request-layout">
                {/* Левая часть - данные */}
                <div className="request-data">
                  {/* Заголовок с номером */}
                  <div className="request-header">
                    <div className="request-number">
                      <span className="text-primary">{task.id}</span>
                    </div>
                  </div>

                  {/* Время под ID */}
                  <div className="request-datetime">
                    <div className="datetime-value">
                      {formatRange(task.begin_date, task.due_date)}
                    </div>
                  </div>

                  <div className="request-details">
                    <div className="request-detail">
                      <span className="text-muted">Тип:</span>
                      <span className="text-primary">
                        {task.objectType || "-"}
                      </span>
                    </div>
                    <div className="request-detail">
                      <span className="text-muted">Услуга:</span>
                      <span className="text-primary">
                        {task.serviceType || "-"}
                      </span>
                    </div>
                    <div className="request-detail">
                      <span className="text-muted">Клиент:</span>
                      <span className="text-primary">{task.client || "-"}</span>
                    </div>
                    {task.contract_number && (
                      <div className="request-detail">
                        <span className="text-muted">Договор:</span>
                        <span className="text-primary">
                          {task.contract_number}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Правая часть - карта и статусы */}
                <div className="request-right">
                  {/* Статусы */}
                  <div className="request-statuses">
                    <div
                      className={`request-status ${
                        task.status ? "text-success" : "text-danger"
                      }`}
                    >
                      <div
                        className="status-dot"
                        style={{
                          backgroundColor: task.status
                            ? "var(--color-success)"
                            : "var(--color-danger)",
                        }}
                      ></div>
                      <span>{task.status ? "Выполнена" : "Не выполнена"}</span>
                    </div>

                    <div
                      className={`request-priority ${
                        task.priority ? "text-warning" : "text-muted"
                      }`}
                    >
                      <svg
                        width="12"
                        height="12"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{task.priority ? "Внеочередная" : "Обычная"}</span>
                    </div>
                  </div>

                  {/* Карта */}
                  {task.coordinates?.lat && task.coordinates?.lng && (
                    <div className="request-map-container">
                      {task.address && (
                        <ClickableDataField value={task.address} />
                      )}
                      <div className="request-map">
                        <MapPreview
                          lat={task.coordinates.lat}
                          lng={task.coordinates.lng}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
