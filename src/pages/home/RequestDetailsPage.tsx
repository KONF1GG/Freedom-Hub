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
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="container-responsive py-6">
          <div className="text-center text-slate-400">Загрузка...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container-responsive py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="heading-responsive text-white">
              Заявка №{task.contract_number || task.id}
            </h1>
          </div>
          <TaskDetails task={task} />
        </div>
      </main>
    </div>
  );
}
