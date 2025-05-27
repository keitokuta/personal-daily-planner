import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>読み込み中...</p>
        </div>
    );
};

export default LoadingSpinner;
