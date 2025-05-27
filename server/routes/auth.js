const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ユーザー登録
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // ユーザーの存在確認
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "ユーザー名は既に使用されています" });
        }

        // 新しいユーザーを作成
        const user = new User({ username, password });
        await user.save();

        // JWTトークンを生成
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "ユーザー登録が完了しました",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラーが発生しました", error: error.message });
    }
});

// ログイン
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // ユーザーの存在確認
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "ユーザー名またはパスワードが正しくありません" });
        }

        // パスワードの確認
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "ユーザー名またはパスワードが正しくありません" });
        }

        // JWTトークンを生成
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "ログインに成功しました",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラーが発生しました", error: error.message });
    }
});

// ユーザー情報取得
router.get("/me", auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
        },
    });
});

module.exports = router;
