import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import logo from '../../assets/img/SMAN_1_BOYOLANGU_LOGO.png'

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setProfileOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
        <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-[#186c7c] dark:border-gray-700 px-5 shadow">
            <div className="flex items-center justify-between px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center">
                <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700"
                >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0
                    10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010
                    1.5h-7.5a.75.75 0 01-.75-.75zM2
                    10a.75.75 0 01.75-.75h14.5a.75.75 0
                    010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
                </button>
                <a href="#" className="flex items-center ms-2 md:me-24">
                <img src={logo} className="h-8 me-3" alt="SMAN 1 Logo" />
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap dark:text-white">
                    SMAN 1 BOYOLANGU
                </span>
                </a>
            </div>

            {/* USER DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
                <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-white bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition duration-150"
                >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                    {user?.user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline">{user?.user?.name || "User"}</span>
                <svg className="w-4 h-4 ml-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                </button>

                {/* Dropdown content */}
                {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">{user?.user?.name || "User"}</h2>
                            <p className="text-sm text-gray-600">{user?.user?.username || ""}</p>
                        </div>
                    </div>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="p-4 space-y-2">
                        
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-150"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </header>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Logout</h2>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari akun?</p>
                <div className="flex justify-end space-x-3">
                <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    Batal
                </button>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                    Logout
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    )
}

export default Header
