import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt, FaUserPlus, FaKey
} from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';

const Sidebar = ({ open }) => {
    const { user } = useAuth();
    const location = useLocation();

    const activeClass = "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-md";

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white dark:bg-[#186c7c] border-r border-gray-200 dark:border-gray-700 ${
                open ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
            }`}
            aria-label="Sidebar"
        >
            <div className="h-full px-4 pb-4 overflow-y-auto">
                <ul className="space-y-2 text-sm font-medium">
                    <li>
                        <Link
                            to="/upload-student"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/dashboard-guru'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaTachometerAlt className="text-lg" />
                            <span>Upload Data Siswa</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/buat-akun"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/catat-pelanggaran'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaUserPlus className="text-lg" />
                            <span>Buat Akun</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/forget-password"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/ganti-password'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaKey className="text-lg" />
                            <span>Lupa Password</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
