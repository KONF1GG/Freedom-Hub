import { useState } from "react";
import Header from "../../components/layout/Header";
import RequestsList from "./RequestsList";
import type { TaskFilters as TaskFiltersType } from "../../types/request";
import { useRequestsStore } from "../../stores/requestsStore";

export default function HomePage() {
  const [filters, setFilters] = useState<TaskFiltersType>({
    page: 1,
    limit: 20,
  });

  const { allRequests, filteredRequests } = useRequestsStore();

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h1>Заявки</h1>
          </div>
          <div className="content-layout">
            <div className="requests-section">
              <RequestsList
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={allRequests.length}
                filteredCount={filteredRequests.length}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
