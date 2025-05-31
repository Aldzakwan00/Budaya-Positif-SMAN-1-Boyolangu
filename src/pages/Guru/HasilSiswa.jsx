import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getStudentViolation, addComment } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';

const HasilSiswa = () => {
    const { user } = useAuth();
    const printRef = useRef();
    const printRefRincian = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [catatan, setCatatan] = useState('');
    const [siswa, setSiswa] = useState(null);
    const [namaKelas, setNamaKelas] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showViolationDetails, setShowViolationDetails] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { id_student } = location.state || {};

    useEffect(() => {
        const fetchData = async () => {
            if (!id_student) return;
            try {
                setIsLoading(true);
                const response = await getStudentViolation({ id_student });
                if (response.status === 'success') {
                    const data = response.data;
                    setSiswa({
                        name: data.name,
                        poin: data.total_points,
                        violations: data.violation,
                        comment: data.comment,
                    });
                    setNamaKelas(data.class_name || '-');
                    setCatatan(data.comment || '');
                }
            } catch (error) {
                Swal.fire('Error', 'Gagal mengambil data siswa', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id_student]);

    const handleSaveComment = async (event) => {
        event.preventDefault();
        if (!catatan.trim()) {
            Swal.fire('Oops', 'Catatan tidak boleh kosong!', 'warning');
            return;
        }
        try {
            const response = await addComment({
                id_student,
                comment: catatan,
            });
            if (response.violation?.comment) {
                setCatatan(response.violation.comment);
                setSiswa((prev) => ({
                    ...prev,
                    comment: response.violation.comment,
                }));
                setIsEditing(false);
                Swal.fire('Berhasil', 'Catatan berhasil disimpan', 'success');
            } else {
                throw new Error('Response tidak valid');
            }
        } catch (error) {
            Swal.fire('Error', 'Terjadi kesalahan saat menyimpan catatan.', 'error');
        }
    };

    const handlePrint = (type = 'laporan') => {
        const printContent = type === 'laporan' ? printRef.current : printRefRincian.current;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const renderKategori = () => {
        if (!siswa) return '-';
        return siswa.poin < 5
            ? <span className="text-green-600 font-bold">Baik</span>
            : <span className="text-red-600 font-bold">Perlu Pembinaan</span>;
    };

    const renderKeterangan = () => {
        if (!siswa) return '';
        return siswa.poin < 5
            ? `${siswa.name} menunjukkan sikap disiplin yang sangat baik. Ia datang tepat waktu, mengikuti aturan dengan konsisten, dan menjadi contoh positif bagi teman-temannya.`
            : `${siswa.name} saat ini masih memerlukan perhatian lebih dalam hal kedisiplinan. Diharapkan peran aktif dari guru dan orang tua.`;
    };

    const LoadingSkeleton = () => (
        <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-6 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-6 bg-gray-300 rounded w-full" />
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-6 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-6 bg-gray-300 rounded w-full" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
            <div className="w-full max-w-3xl mb-4 print:hidden">
                <button onClick={() => navigate(-1)} className="px-4 py-2 text-[#186c7c] rounded-lg font-semibold border border-[#186c7c] hover:text-white hover:bg-[#186c7c]">
                    ← Kembali
                </button>
            </div>

            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {/* Cetak Laporan */}
                    <div ref={printRef} className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl print:shadow-none print:rounded-none print:p-0 print:m-0">
                        <h1 className="text-3xl font-bold text-center text-[#186c7c] mb-8 border-b pb-4 border-indigo-300">
                            Laporan Evaluasi Sikap Siswa
                        </h1>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
                            <div>
                                <div className="text-gray-500">Nama</div>
                                <div className="font-semibold">{siswa?.name || '-'}</div>
                                <div className="text-gray-500 mt-3">Kelas</div>
                                <div className="font-semibold">{namaKelas || '-'}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Jumlah Poin</div>
                                <div className="font-semibold">{siswa?.poin ?? 0}</div>
                                <div className="text-gray-500 mt-3">Kategori</div>
                                <div>{renderKategori()}</div>
                            </div>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Keterangan</h2>
                            <p className="text-justify">{renderKeterangan()}</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Catatan / Apresiasi Guru</h2>
                            <p className="text-justify whitespace-pre-line">{siswa?.comment ?? '-'}</p>
                        </section>
                    </div>

                    {/* Cetak Rincian */}
                    <div ref={printRefRincian} className="hidden print:block w-full max-w-3xl bg-white p-10">
                        <h2 className="text-3xl font-bold text-center text-[#186c7c] mb-6">Rincian Pelanggaran</h2>
                        <div className="text-lg mb-4">Nama: <span className="font-semibold">{siswa?.name}</span></div>
                        <div className="text-lg mb-6">Kelas: <span className="font-semibold">{namaKelas}</span></div>
                        {siswa?.violations?.length ? (
                            siswa.violations.map((violation) => (
                                <div key={violation.id} className="mb-6 border-b pb-4">
                                    <div className="font-semibold text-lg">{violation.violation}</div>
                                    <div className="text-sm text-gray-600">
                                        Waktu: {new Date(violation.created_at).toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-orange-600 font-bold">Poin: {violation.poin}</div>
                                    {violation.comment && (
                                        <div className="italic text-gray-700">Catatan: {violation.comment}</div>
                                    )}
                                    {violation.photo && (
                                        <img
                                            src={violation.photo}
                                            alt="Bukti Pelanggaran"
                                            className="mt-3 w-64 h-auto object-cover rounded border"
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Tidak ada pelanggaran tercatat.</p>
                        )}
                    </div>


                    {/* Tombol Aksi */}
                    <div className="flex gap-4 mt-4 print:hidden">
                        <button onClick={() => handlePrint('laporan')} className="bg-[#186c7c] text-white px-6 py-3 rounded-lg hover:bg-[#0f4f58]">
                            Cetak Laporan
                        </button>
                        <button onClick={() => setShowViolationDetails((prev) => !prev)} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
                            {showViolationDetails ? 'Sembunyikan Rincian Pelanggaran' : 'Lihat Rincian Pelanggaran'}
                        </button>
                        <button onClick={() => handlePrint('rincian')} className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-black">
                            Cetak Rincian
                        </button>
                    </div>

                    {/* Tampilan Violation */}
                    {showViolationDetails && (
                        <div className="w-full max-w-3xl bg-white p-6 rounded-xl mt-6 shadow border border-gray-300">
                            <h3 className="text-2xl font-semibold text-[#186c7c] mb-4">Rincian Pelanggaran</h3>
                            {siswa?.violations?.length ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {siswa.violations.map((violation) => (
                                        <div key={violation.id} className="flex gap-4 items-center border border-gray-200 rounded p-3 hover:shadow">
                                            <img src={violation.photo} alt="Pelanggaran" className="w-20 h-20 object-cover rounded" />
                                            <div className="flex flex-col flex-grow">
                                                <div className="font-semibold text-lg">{violation.violation}</div>
                                                <div className="text-sm text-gray-600">
                                                    Waktu: {new Date(violation.created_at).toLocaleString('id-ID')}
                                                </div>
                                                <div className="text-orange-600 font-bold mt-1">Poin: {violation.poin}</div>
                                                {violation.comment && (
                                                    <div className="italic text-gray-700 mt-1">Catatan: {violation.comment}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Tidak ada data pelanggaran.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HasilSiswa;
