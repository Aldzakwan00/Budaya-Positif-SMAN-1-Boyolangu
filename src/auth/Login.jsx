import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/SMAN_1_BOYOLANGU_LOGO.png';
import background from "../assets/img/background.jpg";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login data:', { username, password }); // Debug log
      
        if (!username || !password) {
          setError("Username dan password tidak boleh kosong");
          return;
        }
      
        const result = await login({ username, password });
        if (result.error) {
          setError(result.error);
          return;
        }

        console.log('Login successful, role:', result); // Debug log
      
        if (result === "guru") {
          navigate("/dashboard-guru");
        }
        else if (result === "guru_bk") {
            navigate("/dashboard-guru");
         } 
        
        else if (result === "siswa") {
          navigate("/dashboard-siswa");
        } else {
          setError("Peran tidak dikenali");
        }
      };
      
    

    return (
        <section className="min-h-screen dark:bg-[#186c7c] flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full lg:flex">
                <div className="w-full lg:w-1/2 px-10 py-12">
                    <div className="text-center mb-6">
                        <img className="mx-auto w-40" src={logo} alt="logo" />
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
                            className="w-full mb-10 py-2 rounded text-white font-semibold bg-[#186c7c] hover:opacity-90 transition"
                        >
                            Masuk
                        </button>
                    </form>
                </div>

                <div
                    className="w-full lg:w-1/2 flex items-center justify-center"
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
