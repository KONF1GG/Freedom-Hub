export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TariffLine {
  line: string;
  status: string;
}

export interface Service {
  service: string;
  type: string;
  begin: string;
  end: string;
}

export interface ResponsibleUse {
  device: string;
  sum: number;
  date: string;
}

export interface ClientInfo {
  login: string;
  pass: string;
  contract: string;
  balance: number;
  organization: string;
  tariff_lines: TariffLine[];
  services: Service[];
  responsible_use: ResponsibleUse[];
  CPE_signal: string;
  grafana_link: string;
  execution_result: string;
}

export interface RequestTicket {
  id: string;
  title: string;
  description: string;
  status: "bul"; // Выполнена/не выполнена
  priority: "bul"; // Внеочередная/обычная
  address: string | null;
  coordinates: Coordinates | null;
  due_date: string;
  client: string;
  flat: string;
  begin_date: string;
  due_time: string;
  contract_number: string;
  objectType: "Абонент" | "Авария" | "Видеокамера";
  serviceType: "Подключение" | "Авария" | "Сервис" | "Допродажа";
  phones: string[];
  updated_at: string;
  client_info?: ClientInfo; // Только для objectType = 'Абонент'
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  due_date?: "today" | "week" | "month" | "overdue" | "current" | "future";
  created_by?: string;
  location?: string;
  tags?: string;
  sort_by?: "created_at" | "due_date" | "priority" | "status";
  sort_order?: "asc" | "desc";
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: "низкий" | "средний" | "высокий" | "критический";
  assigned_to: string;
  location: string;
  address?: string | null;
  coordinates?: Coordinates;
  due_date: string;
  estimated_duration: number;
  tags: string[];
  client_info?: {
    name: string;
    phone?: string | null;
    email?: string | null;
    company?: string | null;
    address?: string | null;
    notes?: string | null;
  };
}

export interface RequestHistoryEntry {
  id: string;
  type: "comment" | "status_change" | "photo" | "coords_update";
  content: string;
  message: string;
  timestamp: string;
  createdAt: string;
  author: string;
  actor?: string;
  // Добавляем недостающие поля
  action?: string;
  description?: string;
  user?: string;
}

export interface RequestPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  timestamp: string;
  author: string;
  // Добавляем недостающее поле
  description?: string;
}
