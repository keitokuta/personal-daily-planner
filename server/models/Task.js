const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "タスク名は必須です"],
            trim: true,
            maxlength: [100, "タスク名は100文字以内である必要があります"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "詳細は500文字以内である必要があります"],
        },
        date: {
            type: Date,
            required: [true, "日付は必須です"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);
