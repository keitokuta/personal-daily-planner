const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// データベース接続
connectDB();

// ミドルウェア
app.use(
    cors({
        origin: "http://localhost:3000", // Reactアプリのポート
        credentials: true,
    })
);
app.use(express.json());

// ルート
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ヘルスチェック
app.get("/api/health", (req, res) => {
    res.json({ message: "サーバーは正常に動作しています" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
});
