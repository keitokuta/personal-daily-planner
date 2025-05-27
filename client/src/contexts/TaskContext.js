import React, { createContext, useContext, useReducer, useEffect } from "react";
import { taskService } from "../services/taskService";
import { useAuth } from "./AuthContext";

// 初期状態
const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
};

// アクションタイプ
const actionTypes = {
    SET_LOADING: "SET_LOADING",
    SET_TASKS: "SET_TASKS",
    ADD_TASK: "ADD_TASK",
    UPDATE_TASK: "UPDATE_TASK",
    DELETE_TASK: "DELETE_TASK",
    SET_ERROR: "SET_ERROR",
    CLEAR_ERROR: "CLEAR_ERROR",
};

// リデューサー
const taskReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case actionTypes.SET_TASKS:
            return {
                ...state,
                tasks: action.payload,
                isLoading: false,
                error: null,
            };
        case actionTypes.ADD_TASK:
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
                isLoading: false,
                error: null,
            };
        case actionTypes.UPDATE_TASK:
            return {
                ...state,
                tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
                isLoading: false,
                error: null,
            };
        case actionTypes.DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter((task) => task._id !== action.payload),
                isLoading: false,
                error: null,
            };
        case actionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
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
const TaskContext = createContext();

// TaskProviderコンポーネント
export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);
    const { isAuthenticated } = useAuth();

    // 認証済みの場合にタスクを取得
    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated]);

    // タスク一覧取得
    const fetchTasks = async () => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        try {
            const tasks = await taskService.getAllTasks();
            dispatch({ type: actionTypes.SET_TASKS, payload: tasks });
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        }
    };

    // タスク作成
    const createTask = async (taskData) => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        try {
            const newTask = await taskService.createTask(taskData);
            dispatch({ type: actionTypes.ADD_TASK, payload: newTask });
            return { success: true, task: newTask };
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // タスク更新
    const updateTask = async (taskId, taskData) => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        try {
            const updatedTask = await taskService.updateTask(taskId, taskData);
            dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });
            return { success: true, task: updatedTask };
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // タスク削除
    const deleteTask = async (taskId) => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        try {
            await taskService.deleteTask(taskId);
            dispatch({ type: actionTypes.DELETE_TASK, payload: taskId });
            return { success: true };
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
            return { success: false, error: error.message };
        }
    };

    // エラークリア
    const clearError = () => {
        dispatch({ type: actionTypes.CLEAR_ERROR });
    };

    const value = {
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        clearError,
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// カスタムフック
export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
};
