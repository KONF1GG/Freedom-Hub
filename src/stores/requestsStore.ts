import { create } from "zustand";
import { RequestTicket, TaskFilters } from "../types/request";
import { requestsService } from "../services/requestsService";

type RequestsState = {
  allRequests: RequestTicket[]; // Все заявки с сервера
  filteredRequests: RequestTicket[]; // Отфильтрованные заявки
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  fetchRequests: () => Promise<void>;
  updateFilters: (filters: TaskFilters) => void;
  getById: (id: string) => RequestTicket | undefined;
  addComment: (id: string, message: string) => Promise<any>;
  addPhoto: (id: string, file: File) => Promise<any>;
  updateCoords: (id: string, lat: number, lng: number) => Promise<any>;
};

export const useRequestsStore = create<RequestsState>((set, get) => ({
  allRequests: [],
  filteredRequests: [],
  filters: {},
  isLoading: false,
  error: null,
  fetchRequests: async () => {
    console.log("🚀 Store: Начинаем загрузку задач");
    set({ isLoading: true, error: null });
    try {
      const response = await requestsService.list();
      console.log("✅ Store: Получили ответ:", response);

      // Проверяем структуру ответа
      let allRequests: RequestTicket[] = [];
      if (Array.isArray(response)) {
        allRequests = response;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.tasks)
      ) {
        allRequests = response.data.tasks;
      } else if (response && Array.isArray(response.tasks)) {
        allRequests = response.tasks;
      } else if (response && Array.isArray(response.data)) {
        allRequests = response.data;
      } else {
        console.warn("Неожиданная структура ответа:", response);
        allRequests = [];
      }

      console.log("✅ Store: Обработанные задачи:", allRequests);

      // Применяем текущие фильтры
      const filteredRequests = applyFilters(allRequests, get().filters);

      set({ allRequests, filteredRequests });
    } catch (e: any) {
      console.error("❌ Store: Ошибка загрузки:", e);
      set({ error: e?.message ?? "Не удалось загрузить заявки" });
    } finally {
      set({ isLoading: false });
    }
  },
  updateFilters: (filters) => {
    console.log("🔍 Store: Обновляем фильтры:", filters);
    const filteredRequests = applyFilters(get().allRequests, filters);
    set({ filters, filteredRequests });
  },
  getById: (id) => get().allRequests.find((r) => r.id === id),
  addComment: async (id, message) => {
    const result = await requestsService.addComment(id, message);
    return result;
  },
  addPhoto: async (id, file) => {
    const result = await requestsService.addPhoto(id, file);
    return result;
  },
  updateCoords: async (id, lat, lng) => {
    const result = await requestsService.updateCoords(id, lat, lng);
    return result;
  },
}));

// Функция фильтрации на фронтенде
function applyFilters(
  requests: RequestTicket[],
  filters: TaskFilters
): RequestTicket[] {
  if (!Array.isArray(requests)) {
    console.error("applyFilters: requests не является массивом:", requests);
    return [];
  }

  let filtered = [...requests];

  // Поиск по названию и описанию
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.client?.toLowerCase().includes(searchLower) ||
        task.contract_number?.toLowerCase().includes(searchLower)
    );
  }

  // Фильтр по статусу
  if (filters.status !== undefined && filters.status !== "") {
    const statusValue = filters.status === "true";
    filtered = filtered.filter((task) => Boolean(task.status) === statusValue);
  }

  // Фильтр по приоритету
  if (filters.priority !== undefined && filters.priority !== "") {
    const priorityValue = filters.priority === "true";
    filtered = filtered.filter(
      (task) => Boolean(task.priority) === priorityValue
    );
  }

  console.log("🔍 Применены фильтры:", filters, "Результат:", filtered.length);
  return filtered;
}
