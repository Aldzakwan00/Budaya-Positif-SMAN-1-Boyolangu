import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const Sidebar = ({ open }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-[#186c7c] dark:border-gray-700 ${
                open ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
            }`}
            aria-label="Sidebar"
            >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-[#186c7c]">
                <ul className="space-y-2 font-medium">
                <li>
                    <Link to="/dashboard-guru" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ms-3">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/catat-pelanggaran" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ms-3">Catat Pelanggaran</span>
                    </Link>
                </li>
                <li>
                    <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <span className="ms-3">Lihat Pelanggaran</span>
                        {isDropdownOpen ? (
                            <FaChevronUp className="ml-2 text-gray-500 dark:text-white" />
                        ) : (
                            <FaChevronDown className="ml-2 text-gray-500 dark:text-white" />
                        )}
                    </button>
                    <ul
                    className={`pl-5 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                        isDropdownOpen ? 'max-h-[500px]' : 'max-h-0'
                    }`}
                    >
                    <li>
                        <Link to="/individu" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Individu</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/kelas" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ms-3">Kelas</span>
                        </Link>
                    </li>
                    </ul>
                </li>
                <li>
                    <Link to="/materi" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ms-3">Tambah Materi</span>
                    </Link>
                </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar