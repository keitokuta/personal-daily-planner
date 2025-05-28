import React, { useState, useEffect } from "react";
import { useTask } from "../contexts/TaskContext";
import "../styles/TaskForm.css";

const TaskForm = ({ onClose, task = null, defaultDate = "" }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: defaultDate,
    });
    const [errors, setErrors] = useState({});

    const { createTask, updateTask, isLoading, error, clearError } = useTask();

    // ローカル時間で日付文字列を生成する関数
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 編集モードの場合、既存のタスクデータを設定
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                date: task.date ? formatDateForInput(new Date(task.date)) : defaultDate,
            });
        } else if (defaultDate) {
            setFormData((prev) => ({
                ...prev,
                date: defaultDate,
            }));
        }
    }, [task, defaultDate]);

    // エラーをクリア
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // エラーをクリア
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "タスク名は必須です";
        } else if (formData.title.length > 100) {
            newErrors.title = "タスク名は100文字以内で入力してください";
        }

        if (formData.description.length > 500) {
            newErrors.description = "詳細は500文字以内で入力してください";
        }

        if (!formData.date) {
            newErrors.date = "日付は必須です";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const taskData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            date: formData.date,
        };

        const result = task ? await updateTask(task._id, taskData) : await createTask(taskData);

        if (result.success) {
            onClose();
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="title">タスク名 *</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} disabled={isLoading} className={errors.title ? "error" : ""} placeholder="タスク名を入力してください" />
                {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="date">日付 *</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} disabled={isLoading} className={errors.date ? "error" : ""} />
                {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="description">詳細</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isLoading} className={errors.description ? "error" : ""} placeholder="タスクの詳細を入力してください（任意）" rows="4" />
                {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-button" disabled={isLoading}>
                    キャンセル
                </button>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? "保存中..." : task ? "更新" : "保存"}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
