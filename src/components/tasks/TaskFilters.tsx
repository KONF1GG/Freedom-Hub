import type { TaskFilters as TaskFiltersType } from "../../types/request";
import CustomSelect from "../ui/CustomSelect";

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
    <div className="card filters-card">
      <div className="card-body">
        <div className="filters-content">
          <div className="filters-stats">
            <span className="text-secondary">Всего: {totalCount}</span>
            <span className="text-muted">•</span>
            <span className="text-secondary">Показано: {filteredCount}</span>
          </div>

          <div className="filters-controls">
            <input
              type="text"
              placeholder="Поиск..."
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="form-input search-input"
            />

            <div className="filters-selects">
              <CustomSelect
                value={filters.priority || ""}
                onChange={(value) =>
                  onFiltersChange({ ...filters, priority: value })
                }
                options={[
                  { value: "", label: "Все" },
                  { value: "true", label: "Срочная" },
                  { value: "false", label: "Обычная" },
                ]}
                className="filter-select"
              />

              <CustomSelect
                value={filters.due_date || ""}
                onChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    due_date: value as any,
                  })
                }
                options={[
                  { value: "", label: "Время" },
                  { value: "current", label: "Текущие" },
                  { value: "future", label: "Будущие" },
                ]}
                className="filter-select"
              />

              <CustomSelect
                value={filters.status || ""}
                onChange={(value) =>
                  onFiltersChange({ ...filters, status: value })
                }
                options={[
                  { value: "", label: "Статус" },
                  { value: "false", label: "Открыта" },
                  { value: "true", label: "Закрыта" },
                ]}
                className="filter-select"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
