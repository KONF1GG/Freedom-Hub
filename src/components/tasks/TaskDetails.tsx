import { useState } from "react";
import CopyField from "../ui/CopyField";
import TaskPhotos from "./TaskPhotos";
import TaskHistory from "./TaskHistory";
import TaskCoordsEditor from "./TaskCoordsEditor";

interface TaskDetailsProps {
  task: any;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");

  const tabs = [
    { id: "details", label: "Детали", icon: "📋" },
    { id: "photos", label: "Фото", icon: "📸" },
    { id: "comments", label: "Комментарии", icon: "💬" },
    { id: "coords", label: "Координаты", icon: "📍" },
    { id: "history", label: "История", icon: "📜" },
  ];

  return (
    <div className="task-details">
      {/* Заголовок */}
      <div className="task-header-card">
        <div className="task-header-content">
          <div className="task-title-section">
            <h2 className="task-title">{task.title || "Без названия"}</h2>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
          <div className="task-status-indicators">
            <div
              className={`task-status ${task.status ? "completed" : "pending"}`}
            >
              {task.status ? "Выполнена" : "Не выполнена"}
            </div>
            <div
              className={`task-priority ${task.priority ? "high" : "normal"}`}
            >
              {task.priority ? "Высокий" : "Обычный"}
            </div>
          </div>
        </div>

        <div className="task-info-grid">
          <CopyField
            label="Номер заявки"
            value={task.contract_number || task.id}
          />
          <CopyField label="Клиент" value={task.client || "-"} />
          <CopyField label="Тип объекта" value={task.objectType || "-"} />
          <CopyField label="Тип услуги" value={task.serviceType || "-"} />
          {task.address && (
            <CopyField
              label="Адрес"
              value={task.address}
              className="task-address-field"
            />
          )}
        </div>
      </div>

      {/* Табы */}
      <div className="task-tabs">
        <div className="task-tabs-header">
          <nav className="task-tabs-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`task-tab-button ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <span className="task-tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="task-tabs-content">
          {activeTab === "details" && (
            <div className="task-details-content">
              <div className="task-dates-grid">
                <div className="task-date-field">
                  <label className="task-date-label">Дата начала</label>
                  <div className="task-date-value">
                    {task.begin_date
                      ? new Date(task.begin_date).toLocaleDateString("ru-RU")
                      : "-"}
                  </div>
                </div>
                <div className="task-date-field">
                  <label className="task-date-label">Дата окончания</label>
                  <div className="task-date-value">
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
            <div className="task-comments-placeholder">
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
  );
}
