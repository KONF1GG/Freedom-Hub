import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useRequestsStore } from "../../stores/requestsStore";
import BackButton from "../../components/ui/BackButton";
import TaskDetails from "../../components/tasks/TaskDetails";

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, fetchRequests } = useRequestsStore();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchRequests().then(() => {
        const foundTask = getById(id);
        setTask(foundTask);
      });
    }
  }, [id, fetchRequests, getById]);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main className="container-responsive py-6">
          <div className="text-center text-slate-400">Загрузка...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div className="flex items-center gap-4">
              <BackButton />
              <h1>Заявка №{task.id}</h1>
            </div>
          </div>
          <div className="content-layout">
            <div className="task-details-section">
              <div className="task-details-scroll-container">
                <TaskDetails task={task} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
