import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChevronDown, FaChevronUp, FaTachometerAlt, FaBookOpen,
    FaPlusCircle, FaUserCheck
} from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';

const Sidebar = ({ open }) => {
    const { user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                            to="/dashboard-guru"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/dashboard-guru'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaTachometerAlt className="text-lg" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/catat-pelanggaran"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/catat-pelanggaran'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaUserCheck className="text-lg" />
                            <span>Catat Pelanggaran</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-between w-full p-3 text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <FaBookOpen className="text-lg" />
                                <span>Lihat Pelanggaran</span>
                            </span>
                            {isDropdownOpen ? (
                                <FaChevronUp className="text-gray-500 dark:text-white" />
                            ) : (
                                <FaChevronDown className="text-gray-500 dark:text-white" />
                            )}
                        </button>
                        <ul
                            className={`mt-1 pl-6 pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                isDropdownOpen ? 'max-h-40' : 'max-h-0'
                            }`}
                        >
                            <li>
                                <Link
                                    to="/individu"
                                    className={`block p-2 rounded-lg transition-all ${
                                        location.pathname === '/individu'
                                            ? 'bg-cyan-600 text-white shadow'
                                            : 'text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Individu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/kelas"
                                    className={`block p-2 rounded-lg transition-all ${
                                        location.pathname === '/kelas'
                                            ? 'bg-cyan-600 text-white shadow'
                                            : 'text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Kelas
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {user?.role !== 'guru_bk' && (
                        <li>
                            <Link
                                to="/materi"
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                    location.pathname === '/materi'
                                        ? activeClass
                                        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <FaPlusCircle className="text-lg" />
                                <span>Tambah Materi</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
