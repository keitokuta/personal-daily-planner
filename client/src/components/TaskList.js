import React, { useState } from "react";
import { useTask } from "../contexts/TaskContext";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import "../styles/TaskList.css";

const TaskList = () => {
    const { tasks, deleteTask, isLoading } = useTask();
    const [editingTask, setEditingTask] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("このタスクを削除しますか？")) {
            await deleteTask(taskId);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTask(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (isLoading) {
        return <div className="task-list-loading">タスクを読み込み中...</div>;
    }

    if (tasks.length === 0) {
        return (
            <div className="task-list-empty">
                <p>まだタスクがありません。</p>
                <p>「タスク追加」ボタンから新しいタスクを作成してください。</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {sortedTasks.map((task) => (
                <div key={task._id} className="task-item">
                    <div className="task-content">
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-date">{formatDate(task.date)}</p>
                        {task.description && <p className="task-description">{task.description}</p>}
                    </div>
                    <div className="task-actions">
                        <button onClick={() => handleEdit(task)} className="edit-button" disabled={isLoading}>
                            編集
                        </button>
                        <button onClick={() => handleDelete(task._id)} className="delete-button" disabled={isLoading}>
                            削除
                        </button>
                    </div>
                </div>
            ))}

            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="タスクを編集">
                <TaskForm task={editingTask} onClose={closeEditModal} />
            </Modal>
        </div>
    );
};

export default TaskList;
