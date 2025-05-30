import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if(user.role === 'admin') {
        return <Navigate to="/admin" replace />;
        } else if(user.role === 'guru') {
        return <Navigate to="/dashboard-guru" replace />;
        } else if(user.role === 'siswa') {
        return <Navigate to="/dashboard-siswa" replace />;
        } else {
        return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
