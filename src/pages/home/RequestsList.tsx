import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRequestsStore } from "../../stores/requestsStore";
import type { TaskFilters } from "../../types/request";

function formatRange(start?: string, end?: string) {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  const ds = `${pad(s.getDate())}.${pad(
    s.getMonth() + 1
  )}.${s.getFullYear()} ${pad(s.getHours())}:${pad(s.getMinutes())}`;
  if (!e) return ds;
  const de = `${pad(e.getHours())}:${pad(s.getMinutes())}`;
  return `${ds} - ${de}`;
}

interface RequestsListProps {
  filters: TaskFilters;
}

export default function RequestsList({ filters }: RequestsListProps) {
  const { filteredRequests, isLoading, error, fetchRequests, updateFilters } =
    useRequestsStore();

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
    <div className="space-y-3">
      {isLoading && <div className="text-sm text-slate-300">Загрузка…</div>}
      {error && <div className="text-sm text-red-400">Ошибка: {error}</div>}
      {filteredRequests.length === 0 && !isLoading && (
        <div className="text-center py-8 text-slate-400">
          <div className="text-lg mb-2">📋 Нет задач</div>
          <div className="text-sm">
            Попробуйте изменить фильтры или создать новую задачу
          </div>
        </div>
      )}

      {filteredRequests.map((task: any) => (
        <Link
          key={task.id}
          to={`/tasks/${task.id}`}
          className="block rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 active:scale-[0.995] transition-transform"
        >
          <div className="p-4">
            {/* Заголовок с номером и индикаторами */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                ЗАЯВКА № {task.contract_number || task.id}
              </div>

              {/* Индикаторы статуса и приоритета */}
              <div className="flex items-center gap-2">
                {/* Статус */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    task.status
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  {task.status ? "Выполнена" : "Не выполнена"}
                </div>

                {/* Приоритет */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 ${
                      task.priority ? "text-orange-400" : "text-slate-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {task.priority ? "Внеочередная" : "Обычная"}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 mb-2">
              {formatRange(task.begin_date, task.due_date)}
            </div>
            <div className="font-medium mb-1 text-white">
              {task.title || task.description || "Без названия"}
            </div>
            {task.description && task.description !== task.title && (
              <div className="text-sm text-slate-300 mb-2">
                {task.description}
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <div className="truncate">
                <span className="text-slate-500">Тип:</span>{" "}
                {task.objectType || "-"}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Услуга:</span>{" "}
                {task.serviceType || "-"}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Клиент:</span>{" "}
                {task.client || "-"}
              </div>
            </div>
            {task.address && (
              <div className="mt-2 text-xs text-slate-400">
                <svg
                  className="inline w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {task.address}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
