import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserRole } from "../utils/auth";

// Fungsi untuk melindungi route berdasarkan role
const ProtectedRoute = ({ allowedRoles, children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        const role = getUserRole();

        if (!token) {
            navigate("/login");
            return;
        }

        if (allowedRoles && !allowedRoles.includes(role)) {
            // console.log(allowedRoles);
            // console.log(role);
            // console.log(allowedRoles.includes(role));
            navigate("/unauthorized");
            return;
        }

        setIsAuthenticated(true);
        setLoading(false);
    }, [navigate, allowedRoles]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>Redirecting...</div>;
    }

    return <>{children}</>;  // Render children jika validasi lulus
};

// Fungsi untuk mengarahkan user berdasarkan role
const RedirectByRole = () => {
    const navigate = useNavigate();
    const token = getToken();
    const role = getUserRole();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (role === "admin") {
            navigate("/dashboard");
        } else if (role === "pasien") {
            navigate("/user-dashboard");
        } else {
            navigate("/unauthorized");
        }
    }, [token, role, navigate]);

    return null;  // Tidak perlu merender apapun
};

const LoginRedirectWrapper = ({ children }) => {
    const token = getToken();
    const role = getUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (role === "admin") {
                navigate("/dashboard");
            } else if (role === "pasien") {
                navigate("/user-dashboard");
            } else {
                navigate("/unauthorized");
            }
        }
    }, [token, role, navigate]);

    // Kalau belum login, tampilkan halaman login
    return !token ? children : null;
};

export { ProtectedRoute, RedirectByRole, LoginRedirectWrapper };
