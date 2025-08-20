import type { TaskFilters as TaskFiltersType } from "../../types/request";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  totalCount: number;
  filteredCount: number;
}

export default function TaskFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Всего: {totalCount}</span>
        <span>•</span>
        <span>Показано: {filteredCount}</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Поиск..."
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value })
          }
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все статусы</option>
          <option value="true">Выполнено</option>
          <option value="false">Не выполнено</option>
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, priority: e.target.value })
          }
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все приоритеты</option>
          <option value="true">Высокий</option>
          <option value="false">Обычный</option>
        </select>
      </div>
    </div>
  );
}
