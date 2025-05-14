import React from 'react'
import { Link } from 'react-router-dom'


const Sidebar = ({ open }) => {
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
                    <Link to="/dashboard-siswa" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="ms-3">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/lihat-pelanggaran-siswa" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="ms-3">Lihat Pelanggaran</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="ms-3">Profile</span>
                    </Link>
                </li>
                <li>
                    <Link to="/materi" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="ms-3">Materi</span>
                    </Link>
                </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar