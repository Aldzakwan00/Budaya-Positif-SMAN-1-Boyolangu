import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaExclamationTriangle, FaBook } from 'react-icons/fa';

const Sidebar = ({ open }) => {
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
                            to="/dashboard-siswa"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/dashboard-siswa'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/rincian-pelanggaran"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/rincian-pelanggaran'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaExclamationTriangle className="text-lg" />
                            <span>Rincian Pelanggaran</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/materi-siswa"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                location.pathname === '/materi-siswa'
                                    ? activeClass
                                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaBook className="text-lg" />
                            <span>Materi</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
