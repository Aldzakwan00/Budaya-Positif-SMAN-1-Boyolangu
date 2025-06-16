import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { updateUser } from '../services/api';
import Swal from 'sweetalert2';

const Gantipassword = () => {
    const { user } = useAuth();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const oldPassword = e.target.oldPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (oldPassword === newPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Tidak Boleh Sama',
                text: 'Password baru tidak boleh sama dengan password lama.',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Konfirmasi Password Tidak Cocok',
                text: 'Password baru dan konfirmasi tidak sama.',
            });
            return;
        }

        try {
            const response = await updateUser({
                id: user.user.id,
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            });

            if (response.message === 'User password updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Password berhasil diubah.',
                });
                e.target.reset(); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengubah Password',
                    text: response.message || 'Terjadi kesalahan saat mengubah password.',
                });
            }
        } catch (error) {
            const errMessage = error?.response?.data?.message;

            if (errMessage?.toLowerCase().includes("old password")) {
                Swal.fire({
                    icon: 'error',
                    title: 'Password Lama Salah',
                    text: 'Password lama yang Anda masukkan tidak sesuai.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan Server',
                    text: errMessage || 'Terjadi kesalahan saat mengubah password.',
                });
            }

            console.error("Error changing password:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4">
            <h1 className="text-3xl font-bold text-[#186c7c] my-8 text-center">Ganti Password</h1>
            <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleChangePassword} className='space-y-5'>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]"> Nama : {user?.user?.name}</label>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]"> Username : {user?.user?.username}</label>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="oldPassword"> Old Password : </label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            required
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="newPassword"> New Password : </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            required
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-[#186c7c]" htmlFor="confirmPassword"> Confirm Password : </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#186c7c] text-white py-3 rounded-xl hover:bg-[#155a66] transition duration-200"
                    >
                        Ganti Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Gantipassword;
