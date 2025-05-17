import React, { useRef, useState, useEffect } from 'react';
import fotoSiswa from '../../assets/img/Anak_Baik.jpeg';

const HasilSiswa = () => {
    const printRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [catatan, setCatatan] = useState('');

    useEffect(() => {
        const savedCatatan = localStorage.getItem('catatan');
        if (savedCatatan) {
            setCatatan(savedCatatan);
        } else {
            setCatatan(
                'Untuk mempertahankan perilaku baiknya, disarankan untuk terus mengikuti kegiatan ekstrakurikuler dan berpartisipasi dalam program-program positif di sekolah. Semangat terus dalam belajar dan memberi contoh baik kepada teman-teman!'
            );
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('catatan', catatan);
    }, [catatan]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="flex flex-col items-center p-5 min-h-screen ">
            {/* Tombol Kembali di Atas */}
            <div className="w-full max-w-4xl mb-4 print:hidden">
                <button
                    onClick={handleBack}
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-500 transition"
                >
                    ← Kembali
                </button>
            </div>

            <div
                ref={printRef}
                className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl print:shadow-none print:rounded-none print:p-0 print:bg-white"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-indigo-700 border-b pb-4">
                    Laporan Evaluasi Sikap Siswa
                </h1>

                <div className="flex flex-col md:flex-row gap-6 mt-6">
                    <div className="md:w-1/3 flex justify-center">
                        <img
                            src={fotoSiswa}
                            alt="Foto Siswa"
                            className="w-40 h-52 object-cover rounded-lg border-4 border-indigo-200 shadow-md"
                        />
                    </div>

                    <div className="md:w-2/3 space-y-2 text-lg text-gray-800">
                        <div>
                            <span className="font-semibold">Nama:</span> Denis
                        </div>
                        <div>
                            <span className="font-semibold">Kelas:</span> X-1
                        </div>
                        <div>
                            <span className="font-semibold">Jumlah Poin:</span> 5
                        </div>
                        <div>
                            <span className="font-semibold">Kategori:</span>{' '}
                            <span className="text-green-600 font-bold">Baik</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2 text-indigo-600">Keterangan</h2>
                    <p className="text-gray-700 text-justify leading-relaxed">
                        Selama mengikuti kegiatan belajar di sekolah, Denis menunjukkan sikap sangat baik dalam hal
                        kedisiplinan, tanggung jawab, dan kepatuhan terhadap peraturan. Jumlah poin pelanggaran yang rendah
                        mencerminkan kemampuan siswa dalam menjaga perilaku secara konsisten dan positif.
                    </p>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2 text-indigo-600">Catatan / Apresiasi Guru</h2>
                    {isEditing ? (
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-3 text-gray-800"
                            rows="4"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                        />
                    ) : (
                        <p className="text-gray-700 text-justify whitespace-pre-line">{catatan}</p>
                    )}

                    <div className="mt-3 flex gap-3 print:hidden">
                        {isEditing ? (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Simpan
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit Catatan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    Cetak Hasil
                </button>
            </div>
        </div>
    );
};

export default HasilSiswa;
