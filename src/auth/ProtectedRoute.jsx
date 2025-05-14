import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles}) => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/" />
    };


    return children;
}

export default ProtectedRoute;