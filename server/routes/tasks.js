const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// 全タスク取得
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ date: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "サーバーエラーが発生しました", error: error.message });
    }
});

// タスク作成
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, date } = req.body;

        const task = new Task({
            title,
            description,
            date,
            user: req.user._id,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "タスクの作成に失敗しました", error: error.message });
    }
});

// タスク更新
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, description, date, completed } = req.body;

        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { title, description, date, completed }, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).json({ message: "タスクが見つかりません" });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: "タスクの更新に失敗しました", error: error.message });
    }
});

// タスク削除
router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ message: "タスクが見つかりません" });
        }

        res.json({ message: "タスクが削除されました" });
    } catch (error) {
        res.status(500).json({ message: "タスクの削除に失敗しました", error: error.message });
    }
});

module.exports = router;
