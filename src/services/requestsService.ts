import { api } from "./api";

export const requestsService = {
  async list() {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки заявок:", error);
      return [];
    }
  },

  async getById(id: string) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки заявки:", error);
      return null;
    }
  },

  async addComment(id: string, message: string) {
    try {
      const response = await api.post(`/tasks/${id}/comment`, { message });
      return response.data;
    } catch (error) {
      console.error("Ошибка добавления комментария:", error);
      throw error;
    }
  },

  async addPhoto(id: string, file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(`/tasks/${id}/photo`, formData);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
      throw error;
    }
  },

  async updateCoords(id: string, lat: number, lng: number) {
    try {
      const response = await api.patch(`/tasks/${id}/coords`, { lat, lng });
      return response.data;
    } catch (error) {
      console.error("Ошибка обновления координат:", error);
      throw error;
    }
  },
};
