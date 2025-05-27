import React, { useState } from 'react';
import Header from './Header';
import { register, updateSiswa } from '../../services/api';
import Swal from 'sweetalert2';

const Admin = () => {
    const [registerData, setRegisterData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        id_role: '',
    });

    const [excelFile, setExcelFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        console.log("Data dikirim ke server:", registerData);
        setLoading(true);
        try {
            // Ubah id_role ke number supaya sesuai backend
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
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors || {};
                // Buat pesan error per field
                let messages = Object.entries(errors)
                    .map(([field, msgs]) => {
                        if(field === 'username' && msgs.includes('The username has already been taken.')) {
                            return 'Username sudah digunakan, silakan coba yang lain.';
                        }
                        return msgs.join(' ');
                    })
                    .join('\n');
                Swal.fire('Validasi Gagal', messages || 'Terjadi kesalahan validasi.', 'error');
            } else {
                Swal.fire('Gagal', 'Terjadi kesalahan saat mendaftar akun.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExcelChange = (e) => {
        setExcelFile(e.target.files[0]);
    };

    const handleExcelSubmit = async (e) => {
        e.preventDefault();
        if (!excelFile) {
            Swal.fire('Peringatan', 'Mohon pilih file Excel terlebih dahulu.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('file', excelFile);

        setLoading(true);
        try {
            await updateSiswa(formData);
            Swal.fire('Berhasil!', 'Update data siswa berhasil!', 'success');
            setExcelFile(null);
        } catch (err) {
            Swal.fire('Gagal', 'Gagal mengupdate data siswa.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="pt-28 px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#186c7c] mb-10 text-center">
                    Manajemen Budaya Positif SMAN 1 BOYOLANGU
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Form Pendaftaran Akun */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-[#186c7c] mb-4">Pendaftaran Akun</h2>
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="name">Nama</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Nama"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={registerData.username}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="password_confirmation">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi Password"
                                    value={registerData.password_confirmation}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="id_role">
                                    Role <br />
                                    <small className="text-gray-500 italic text-sm">
                                        admin = 1, guru = 2, guru_bk = 3, siswa = 4
                                    </small>
                                </label>
                                <input
                                    type="number"
                                    id="id_role"
                                    name="id_role"
                                    placeholder="Role (1/2/3/4)"
                                    value={registerData.id_role}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                                    min={1}
                                    max={4}
                                    required
                                />
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

                    {/* Form Upload Excel */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-[#186c7c] mb-4">Update Data Siswa via Excel</h2>
                        <form onSubmit={handleExcelSubmit} encType="multipart/form-data" className="space-y-4">
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleExcelChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#186c7c]"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#186c7c] text-white py-2 rounded-md hover:bg-[#145c6a] transition"
                            >
                                {loading ? 'Memproses...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
