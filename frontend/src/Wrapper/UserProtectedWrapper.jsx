import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UserProtectedWrapper = ({ children }) => {
    const token = localStorage.getItem("token");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false); // No async fetch assumed here
    }, []);

    if (isLoading) {
        return <div className="text-white text-center p-10">Loading...</div>;
    }

    if (!token || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
                    <p className="text-gray-400 mb-6">Please login to access all features</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default UserProtectedWrapper;
