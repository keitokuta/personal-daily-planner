const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "ユーザー名は必須です"],
            unique: true,
            trim: true,
            minlength: [3, "ユーザー名は3文字以上である必要があります"],
        },
        password: {
            type: String,
            required: [true, "パスワードは必須です"],
            minlength: [6, "パスワードは6文字以上である必要があります"],
        },
    },
    {
        timestamps: true,
    }
);

// パスワードをハッシュ化するミドルウェア
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// パスワード比較メソッド
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
