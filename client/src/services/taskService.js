import api from "./api";

export const taskService = {
    // 全タスク取得
    getAllTasks: async () => {
        try {
            const response = await api.get("/tasks");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "タスクの取得に失敗しました");
        }
    },

    // タスク作成
    createTask: async (taskData) => {
        try {
            const response = await api.post("/tasks", taskData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "タスクの作成に失敗しました");
        }
    },

    // タスク更新
    updateTask: async (taskId, taskData) => {
        try {
            const response = await api.put(`/tasks/${taskId}`, taskData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "タスクの更新に失敗しました");
        }
    },

    // タスク削除
    deleteTask: async (taskId) => {
        try {
            const response = await api.delete(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "タスクの削除に失敗しました");
        }
    },
};
