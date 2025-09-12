import { useState, useRef } from "react";
import ClickableDataField from "../ui/ClickableDataField";
import TaskPhotos from "./TaskPhotos";
import TaskHistory from "./TaskHistory";
import TaskCoordsEditor from "./TaskCoordsEditor";

interface TaskDetailsProps {
  task: any;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const tabsCardRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "details", label: "Детали", icon: "📋" },
    { id: "photos", label: "Фото", icon: "📸" },
    { id: "comments", label: "Комментарии", icon: "💬" },
    { id: "coords", label: "Координаты", icon: "📍" },
    { id: "history", label: "История", icon: "📜" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Прокручиваем к карточке с вкладками плавно
    requestAnimationFrame(() => {
      if (tabsCardRef.current) {
        tabsCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    });
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Заголовок */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="flex-grow-1">
              <h2 className="card-title">{task.title || "Без названия"}</h2>
              {task.description && (
                <p className="card-description">{task.description}</p>
              )}
            </div>
            <div className="d-flex flex-column gap-2">
              {/* Статус */}
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

              {/* Приоритет */}
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
          </div>

          <div className="task-data-table">
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="data-label">Номер заявки</td>
                  <td className="data-value">
                    <ClickableDataField value={task.id} />
                  </td>
                </tr>
                {task.contract_number && (
                  <tr>
                    <td className="data-label">Номер договора</td>
                    <td className="data-value">
                      <ClickableDataField value={task.contract_number} />
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="data-label">Клиент</td>
                  <td className="data-value">
                    <ClickableDataField value={task.client || "-"} />
                  </td>
                </tr>
                <tr>
                  <td className="data-label">Тип объекта</td>
                  <td className="data-value">
                    <ClickableDataField value={task.objectType || "-"} />
                  </td>
                </tr>
                <tr>
                  <td className="data-label">Тип услуги</td>
                  <td className="data-value">
                    <ClickableDataField value={task.serviceType || "-"} />
                  </td>
                </tr>
                {task.address && (
                  <tr>
                    <td className="data-label">Адрес</td>
                    <td className="data-value">
                      <ClickableDataField value={task.address} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="card" ref={tabsCardRef}>
        <div className="card-header">
          <nav className="tabs-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id
                    ? "tab-button-active"
                    : "tab-button-inactive"
                }`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="card-body">
          <div className="tab-content">
            {activeTab === "details" && (
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label">Дата начала</label>
                    <div className="form-input bg-light">
                      {task.begin_date
                        ? new Date(task.begin_date).toLocaleDateString("ru-RU")
                        : "-"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Дата окончания</label>
                    <div className="form-input bg-light">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString("ru-RU")
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <TaskPhotos
                photos={task.photos || []}
                onPhotoUpload={async (file) => {
                  // Здесь будет логика загрузки фото
                  console.log("Загрузка фото:", file);
                }}
              />
            )}

            {activeTab === "comments" && (
              <div className="text-center text-secondary py-6">
                Функция комментариев в разработке
              </div>
            )}

            {activeTab === "coords" && (
              <TaskCoordsEditor
                lat={task.coordinates?.lat}
                lng={task.coordinates?.lng}
                onSave={async (lat, lng) => {
                  // Здесь будет логика сохранения координат
                  console.log("Сохранение координат:", { lat, lng });
                }}
              />
            )}

            {activeTab === "history" && (
              <TaskHistory history={task.history || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
