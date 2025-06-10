import React, { useState } from 'react';
import { updateSiswa, updateUserAccount } from '../../services/api';
import Swal from 'sweetalert2';

const UploadStudent = () => {
    const [excelFile, setExcelFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
        formData.append('excel_file', excelFile);

        setLoading(true);

        Swal.fire({
            title: 'Mohon tunggu...',
            text: 'Sedang memproses data',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await Promise.all([
                updateUserAccount(),
                updateSiswa(formData)
            ]);

            Swal.fire('Berhasil!', 'Update data siswa dan akun berhasil!', 'success');
            setExcelFile(null);
        } catch (err) {
            Swal.fire('Gagal', 'Terjadi kesalahan saat mengupdate.', 'error');
        } finally {
            setLoading(false);
            if (Swal.isLoading()) {
                Swal.close();
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-28 px-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-[#186c7c] mb-10 text-center">
                    Upload Data Siswa
                </h1>
                <form
                    onSubmit={handleExcelSubmit}
                    encType="multipart/form-data"
                    className="space-y-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                >
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#186c7c]"
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
    );
};

export default UploadStudent;
