import React, { useState } from 'react';
import { register } from '../../services/api';
import Swal from 'sweetalert2';

const BuatAkun = () => {
    const [registerData, setRegisterData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        id_role: '',
    });

    const [loading, setLoading] = useState(false);

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...registerData,
                id_role: Number(registerData.id_role),
            };

            await register(dataToSend);
            Swal.fire('Berhasil!', 'Pendaftaran akun berhasil!', 'success');
            setRegisterData({
                name: '',
                username: '',
                password: '',
                password_confirmation: '',
                id_role: '',
            });
        } catch (err) {
            console.error("Error registering user:", err);
            if (err.response?.status === 422) {
                const errors = err.response.data.errors || {};
                let messages = Object.entries(errors).map(([field, msgs]) => {
                    if (field === 'username' && msgs.includes('The username has already been taken.')) {
                        return 'Username sudah digunakan, silakan coba yang lain.';
                    }
                    return msgs.join(' ');
                }).join('\n');
                Swal.fire('Validasi Gagal', messages || 'Terjadi kesalahan validasi.', 'error');
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan saat mendaftar akun.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-28 px-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-[#186c7c] mb-10 text-center">
                    Pendaftaran Akun
                </h1>
                <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="name">Nama</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="password_confirmation">Konfirmasi Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={registerData.password_confirmation}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="id_role">Role</label>
                        <select
                            id="id_role"
                            name="id_role"
                            value={registerData.id_role}
                            onChange={handleRegisterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                            required
                        >
                            <option value="">Pilih Role</option>
                            <option value="2">Guru</option>
                            <option value="3">Guru BK</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#186c7c] text-white py-2 rounded-md hover:bg-[#145c6a] transition"
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuatAkun;
