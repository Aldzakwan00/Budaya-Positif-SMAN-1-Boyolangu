import React, { useState } from 'react';
import HeaderGuru from './Guru/Header';
import SidebarGuru from './Guru/Sidebar';
import HeaderSiswa from './Siswa/Header';
import SidebarSiswa from './Siswa/Sidebar';
import HeaderAdmin from './Admin/Header';       
import SidebarAdmin from './Admin/Sidebar';    
import { useAuth } from '../auth/AuthContext';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (!user) return null;

    const isSiswa = user.role === 'siswa';
    const isGuru = user.role === 'guru' || user.role === 'guru_bk';
    const isAdmin = user.role === 'admin';

    return (
        <div>
            {isSiswa ? (
                <>
                    <HeaderSiswa toggleSidebar={toggleSidebar} />
                    <SidebarSiswa open={sidebarOpen} />
                </>
            ) : isGuru ? (
                <>
                    <HeaderGuru toggleSidebar={toggleSidebar} />
                    <SidebarGuru open={sidebarOpen} />
                </>
            ) : isAdmin ? (
                <>
                    <HeaderAdmin toggleSidebar={toggleSidebar} />
                    <SidebarAdmin open={sidebarOpen} />
                </>
            ) : null}
            <main className="p-4 sm:ml-64 mt-16">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
