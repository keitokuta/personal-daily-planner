import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Login.css";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [showRegister, setShowRegister] = useState(false);

    const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 既にログイン済みの場合はダッシュボードにリダイレクト
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // エラーをクリア
    useEffect(() => {
        return () => clearError();
    }, []);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            return;
        }

        const result = showRegister ? await register(credentials) : await login(credentials);

        if (result.success) {
            navigate("/dashboard");
        }
    };

    const toggleMode = () => {
        setShowRegister(!showRegister);
        setCredentials({ username: "", password: "" });
        clearError();
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{showRegister ? "ユーザー登録" : "ログイン"}</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">ユーザー名:</label>
                    <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required disabled={isLoading} minLength={showRegister ? 3 : undefined} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">パスワード:</label>
                    <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required disabled={isLoading} minLength={showRegister ? 6 : undefined} />
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? "処理中..." : showRegister ? "登録" : "ログイン"}
                </button>

                <div className="toggle-mode">
                    <button type="button" onClick={toggleMode} className="toggle-button" disabled={isLoading}>
                        {showRegister ? "すでにアカウントをお持ちですか？ログイン" : "アカウントをお持ちでない方は新規登録"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
