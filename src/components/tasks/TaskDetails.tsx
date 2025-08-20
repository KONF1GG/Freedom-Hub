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
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {task.title || "Без названия"}
            </h2>
            {task.description && (
              <p className="text-slate-300">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {task.status ? "Выполнена" : "Не выполнена"}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.priority
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
              }`}
            >
              {task.priority ? "Высокий" : "Обычный"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="md:col-span-2"
            />
          )}
        </div>
      </div>

      {/* Табы */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Дата начала
                  </label>
                  <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
                    {task.begin_date
                      ? new Date(task.begin_date).toLocaleDateString("ru-RU")
                      : "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Дата окончания
                  </label>
                  <div className="px-3 py-2 bg-slate-700 rounded-lg text-white">
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
            <div className="text-center text-slate-400 py-8">
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
