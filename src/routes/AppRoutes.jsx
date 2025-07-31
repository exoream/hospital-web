import React from "react";
import { Routes, Route } from "react-router-dom";
import { RedirectByRole, ProtectedRoute, LoginRedirectWrapper } from "../components/ProctectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/UserDashboard";
import App from "../App";  // Halaman login
import Unauthorized from "../pages/Unathorized";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Redirect berdasarkan role */}
            <Route path="/" element={<RedirectByRole />} />

            {/* Halaman login */}
            <Route path="/login" element={<LoginRedirectWrapper><App /></LoginRedirectWrapper>} />

            {/* Halaman Unauthorized */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Halaman untuk admin */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Halaman untuk user */}
            <Route
                path="/user-dashboard"
                element={
                    <ProtectedRoute allowedRoles={['pasien']}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
