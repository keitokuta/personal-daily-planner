import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { TaskProvider } from "../contexts/TaskContext";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskCalendar from "../components/TaskCalendar";
import "../styles/Dashboard.css";

const DashboardContent = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>パーソナルデイリープランナー</h1>
                <div className="user-info">
                    <span>こんにちは、{user?.username}さん</span>
                    <button className="logout-button" onClick={handleLogout}>
                        ログアウト
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-actions">
                    <button className="add-task-button" onClick={openAddModal}>
                        タスク追加
                    </button>
                </div>

                <div className="dashboard-content">
                    <div className="calendar-section">
                        <TaskCalendar />
                    </div>

                    <div className="task-list-section">
                        <h2>タスク一覧</h2>
                        <TaskList />
                    </div>
                </div>
            </main>

            <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="新しいタスクを追加">
                <TaskForm onClose={closeAddModal} />
            </Modal>
        </div>
    );
};

const Dashboard = () => {
    return (
        <TaskProvider>
            <DashboardContent />
        </TaskProvider>
    );
};

export default Dashboard;
