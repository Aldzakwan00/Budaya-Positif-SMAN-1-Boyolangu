import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

  return (
    <div>
        <h1>Dashboard Siswa</h1>
        <button
            onClick={handleLogout}
        >
            Log Out
        </button>
    </div>
  )
}

export default Dashboard