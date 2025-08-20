import { useState } from "react";
import Header from "../../components/layout/Header";
import RequestsList from "./RequestsList";
import TaskFilters from "../../components/tasks/TaskFilters";
import type { TaskFilters as TaskFiltersType } from "../../types/request";
import { useRequestsStore } from "../../stores/requestsStore";

export default function HomePage() {
  const [filters, setFilters] = useState<TaskFiltersType>({
    page: 1,
    limit: 20,
  });

  const { allRequests, filteredRequests } = useRequestsStore();

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container-responsive py-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="heading-responsive text-white">Запросы</h1>
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={allRequests.length}
              filteredCount={filteredRequests.length}
            />
          </div>
          <RequestsList filters={filters} />
        </div>
      </main>
    </div>
  );
}
