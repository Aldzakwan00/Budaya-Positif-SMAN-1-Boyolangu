import React, { useState } from 'react'
import HeaderGuru from './Guru/Header'
import SidebarGuru from './Guru/Sidebar'
import HeaderSiswa from './Siswa/Header'
import SidebarSiswa from './Siswa/Sidebar'
import { useAuth } from '../auth/AuthContext'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (!user) return null;

    const isSiswa = user.role === 'siswa';

    return (
        <div>
        {isSiswa ? (
            <>
            <HeaderSiswa toggleSidebar={toggleSidebar} />
            <SidebarSiswa open={sidebarOpen} />
            </>
        ) : (
            <>
            <HeaderGuru toggleSidebar={toggleSidebar} />
            <SidebarGuru open={sidebarOpen} />
            </>
        )}
        <main className="p-4 sm:ml-64 mt-16">
            <Outlet />
        </main>
        </div>
    );
}

export default Layout