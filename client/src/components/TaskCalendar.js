import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import { useTask } from "../contexts/TaskContext";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import "../styles/TaskCalendar.css";
import "react-calendar/dist/Calendar.css";

const TaskCalendar = () => {
    const { tasks } = useTask();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDateTasks, setSelectedDateTasks] = useState([]);
    const [showTasksModal, setShowTasksModal] = useState(false);

    // 日付ごとのタスク数を計算
    const tasksByDate = useMemo(() => {
        const taskMap = {};
        tasks.forEach((task) => {
            const dateKey = new Date(task.date).toDateString();
            if (!taskMap[dateKey]) {
                taskMap[dateKey] = [];
            }
            taskMap[dateKey].push(task);
        });
        return taskMap;
    }, [tasks]);

    // 日付が選択されたときの処理
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateKey = date.toDateString();
        const tasksForDate = tasksByDate[dateKey] || [];
        setSelectedDateTasks(tasksForDate);

        if (tasksForDate.length > 0) {
            setShowTasksModal(true);
        }
    };

    // カレンダーの日付にタスク数を表示
    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const dateKey = date.toDateString();
            const tasksForDate = tasksByDate[dateKey] || [];

            if (tasksForDate.length > 0) {
                return (
                    <div className="task-indicator">
                        <span className="task-count">{tasksForDate.length}</span>
                    </div>
                );
            }
        }
        return null;
    };

    // カレンダーの日付にクラス名を追加
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateKey = date.toDateString();
            const tasksForDate = tasksByDate[dateKey] || [];

            if (tasksForDate.length > 0) {
                return "has-tasks";
            }
        }
        return null;
    };

    // 新しいタスクを追加（選択された日付で）
    const handleAddTask = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeTasksModal = () => {
        setShowTasksModal(false);
        setSelectedDateTasks([]);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTaskDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            month: "short",
            day: "numeric",
        });
    };

    // ローカル時間で日付文字列を生成する関数
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="task-calendar">
            <div className="calendar-header">
                <h3>カレンダー</h3>
                <button className="add-task-calendar-button" onClick={handleAddTask}>
                    選択日にタスク追加
                </button>
            </div>

            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    locale="ja-JP"
                    formatShortWeekday={(locale, date) => {
                        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
                        return weekdays[date.getDay()];
                    }}
                />
            </div>

            <div className="selected-date-info">
                <p>選択日: {formatDate(selectedDate)}</p>
                {tasksByDate[selectedDate.toDateString()] && <p>タスク数: {tasksByDate[selectedDate.toDateString()].length}件</p>}
            </div>

            {/* 新しいタスク追加モーダル */}
            <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title={`${formatDate(selectedDate)}のタスクを追加`}>
                <TaskForm onClose={closeAddModal} defaultDate={formatDateForInput(selectedDate)} />
            </Modal>

            {/* 選択日のタスク一覧モーダル */}
            <Modal isOpen={showTasksModal} onClose={closeTasksModal} title={`${formatDate(selectedDate)}のタスク`}>
                <div className="date-tasks-list">
                    {selectedDateTasks.map((task) => (
                        <div key={task._id} className="date-task-item">
                            <h4>{task.title}</h4>
                            {task.description && <p className="task-description">{task.description}</p>}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default TaskCalendar;
