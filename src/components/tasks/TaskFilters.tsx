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
    <div className="task-filters">
      <div className="filters-summary">
        <span>Всего: {totalCount}</span>
        <span>•</span>
        <span>Показано: {filteredCount}</span>
      </div>

      <div className="filters-controls">
        <input
          type="text"
          placeholder="Поиск..."
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="search-field"
        />

        <select
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value })
          }
          className="status-filter"
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
          className="priority-filter"
        >
          <option value="">Все приоритеты</option>
          <option value="true">Высокий</option>
          <option value="false">Обычный</option>
        </select>
      </div>
    </div>
  );
}
