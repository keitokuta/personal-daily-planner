import api from "./api";

export const authService = {
    // ログイン
    login: async (credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);
            const { token, user } = response.data;

            // トークンとユーザー情報をローカルストレージに保存
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || "ログインに失敗しました");
        }
    },

    // ユーザー登録
    register: async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            const { token, user } = response.data;

            // トークンとユーザー情報をローカルストレージに保存
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || "ユーザー登録に失敗しました");
        }
    },

    // ログアウト
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // 現在のユーザー情報を取得
    getCurrentUser: async () => {
        try {
            const response = await api.get("/auth/me");
            return response.data.user;
        } catch (error) {
            throw new Error("ユーザー情報の取得に失敗しました");
        }
    },

    // ローカルストレージからユーザー情報を取得
    getStoredUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    // トークンの存在確認
    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },
};
