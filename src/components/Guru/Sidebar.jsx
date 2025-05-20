import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaChevronDown, FaChevronUp, FaTachometerAlt, FaBookOpen, FaPlusCircle, FaUserCheck, FaUsers
} from 'react-icons/fa';

const Sidebar = ({ open }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-[#186c7c] dark:border-gray-700 ${
            open ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
        aria-label="Sidebar"
        >
        <div className="h-full px-4 pb-4 overflow-y-auto">
            <ul className="space-y-2 font-medium text-sm">
            <li>
                <Link
                to="/dashboard-guru"
                className="flex items-center gap-3 p-3 text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                <FaTachometerAlt className="text-lg" />
                <span>Dashboard</span>
                </Link>
            </li>
            <li>
                <Link
                to="/catat-pelanggaran"
                className="flex items-center gap-3 p-3 text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                className={`pl-10 pr-2 mt-1 space-y-1 text-sm transition-all duration-300 ease-in-out overflow-hidden ${
                    isDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
                >
                <li>
                    <Link
                    to="/individu"
                    className="block p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                    Individu
                    </Link>
                </li>
                <li>
                    <Link
                    to="/kelas"
                    className="block p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                    Kelas
                    </Link>
                </li>
                </ul>
            </li>
            <li>
                <Link
                to="/materi"
                className="flex items-center gap-3 p-3 text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                <FaPlusCircle className="text-lg" />
                <span>Tambah Materi</span>
                </Link>
            </li>
            </ul>
        </div>
        </aside>
    );
};

export default Sidebar;
