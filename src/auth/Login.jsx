import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/SMAN_1_BOYOLANGU_LOGO.png';
import background from "../assets/img/background.jpg";
import Swal from 'sweetalert2';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error] = useState("");
    const [isLoading, setIsLoading] = useState(false); // NEW

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Tidak Lengkap',
                text: 'Username dan password tidak boleh kosong!',
            });
            return;
        }

        setIsLoading(true); // Mulai loading

        const result = await login({ username, password });

        setIsLoading(false); // Selesai loading

        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: result.error,
            });
            return;
        }

        const role = result.role;
        console.log('Login successful, role:', role);

        if (role === "guru" || role === "guru_bk") {
            navigate("/dashboard-guru");
        } else if (role === "siswa") {
            navigate("/dashboard-siswa");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Peran Tidak Dikenali',
                text: 'Silakan hubungi administrator.',
            });
        }
    };

    return (
        <section className="h-screen dark:bg-[#186c7c] flex items-center justify-center transition-all duration-500 ease-in-out">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl  w-[80%] lg:flex transform transition-all duration-300">
                <div className="w-full lg:w-1/2 px-10 md:py-20 py-10">
                    <div className="text-center mb-6">
                        <img className="mx-auto w-40 transition-all duration-300" src={logo} alt="logo" />
                        <h4 className="mt-4 text-xl font-semibold">Konsekuensi Poin Budaya Positif</h4>
                    </div>
                    <form onSubmit={handleLogin}>
                        <p className="mb-4 text-center">Silahkan Login Terlebih Dahulu</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                placeholder="Masukkan username"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                placeholder="Masukkan password"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mb-10 py-2 rounded text-white font-semibold bg-[#186c7c] hover:opacity-90 transition-all duration-300 ease-in-out flex items-center justify-center ${
                                isLoading ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>
                </div>

                <div
                    className="w-full lg:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${background})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>
        </section>
    );
};

export default Login;
