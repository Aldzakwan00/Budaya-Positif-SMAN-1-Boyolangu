import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { forgetPassword, getUsername } from '../../services/api';

const ForgetPassword = () => {
    const [usernameList, setUsernameList] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accountFound, setAccountFound] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsernames = async () => {
        try {
            const data = await getUsername();
            setUsernameList(data.user || []);
        } catch (err) {
            Swal.fire('Error', 'Gagal mengambil daftar user', 'error');
        }
        };
        fetchUsernames();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const found = usernameList.find(user => user.username === username.trim());
        if (found) {
        setAccountFound(true);
        Swal.fire('Berhasil', `Akun "${username}" ditemukan. Silakan masukkan password baru.`, 'success');
        } else {
        setAccountFound(false);
        Swal.fire('Tidak Ditemukan', `Username "${username}" tidak ditemukan.`, 'error');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        await forgetPassword({ username, new_password: password });
        Swal.fire('Sukses', 'Password berhasil diubah.', 'success');
        setUsername('');
        setPassword('');
        setAccountFound(false);
        } catch (err) {
        Swal.fire('Gagal', 'Terjadi kesalahan saat mengganti password.', 'error');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-28 px-4 sm:px-8">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <h1 className="text-2xl font-bold text-[#186c7c] mb-6 text-center">
            Cari Akun dan Ganti Password
            </h1>

            <form onSubmit={accountFound ? handleChangePassword : handleSearch} className="space-y-5">
            <div>
                <label className="block mb-1 text-sm font-medium text-[#186c7c]">Username</label>
                <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                required
                disabled={accountFound}
                />
            </div>

            {accountFound && (
                <div>
                <label className="block mb-1 text-sm font-medium text-[#186c7c]">Password Baru</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                    required
                />
                </div>
            )}

            {!accountFound ? (
                <button
                type="submit"
                className="w-full bg-[#186c7c] text-white py-2 rounded-md hover:bg-[#145c6a] transition"
                >
                Cari Akun
                </button>
            ) : (
                <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                disabled={loading}
                >
                {loading ? 'Memproses...' : 'Ganti Password'}
                </button>
            )}
            </form>
        </div>
        </div>
    );
};

export default ForgetPassword;
