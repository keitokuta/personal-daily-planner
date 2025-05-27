import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

// 初期状態
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// アクションタイプ
const actionTypes = {
    LOGIN_START: "LOGIN_START",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILURE: "LOGIN_FAILURE",
    LOGOUT: "LOGOUT",
    SET_LOADING: "SET_LOADING",
    CLEAR_ERROR: "CLEAR_ERROR",
};

// リデューサー
const authReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error,
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// コンテキストの作成
const AuthContext = createContext();

// AuthProviderコンポーネント
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // アプリ起動時に認証状態をチェック
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const user = await authService.getCurrentUser();
                    dispatch({
                        type: actionTypes.LOGIN_SUCCESS,
                        payload: { user },
                    });
                } else {
                    dispatch({ type: actionTypes.SET_LOADING, payload: false });
                }
            } catch (error) {
                authService.logout();
                dispatch({
                    type: actionTypes.LOGIN_FAILURE,
                    payload: { error: "セッションが無効です" },
                });
            }
        };

        checkAuthStatus();
    }, []);

    // ログイン関数
    const login = async (credentials) => {
        dispatch({ type: actionTypes.LOGIN_START });
        try {
            const { user } = await authService.login(credentials);
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { user },
            });
            return { success: true };
        } catch (error) {
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: { error: error.message },
            });
            return { success: false, error: error.message };
        }
    };

    // ユーザー登録関数
    const register = async (userData) => {
        dispatch({ type: actionTypes.LOGIN_START });
        try {
            const { user } = await authService.register(userData);
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { user },
            });
            return { success: true };
        } catch (error) {
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: { error: error.message },
            });
            return { success: false, error: error.message };
        }
    };

    // ログアウト関数
    const logout = () => {
        authService.logout();
        dispatch({ type: actionTypes.LOGOUT });
    };

    // エラークリア関数
    const clearError = () => {
        dispatch({ type: actionTypes.CLEAR_ERROR });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// カスタムフック
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
