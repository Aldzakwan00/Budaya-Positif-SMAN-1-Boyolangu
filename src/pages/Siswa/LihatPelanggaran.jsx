import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStudentViolation } from '../../services/api';

const DEFAULT_CATATAN = 'Untuk mempertahankan perilaku baiknya...';

const LihatPelanggaran = () => {
  const printRef = useRef();
  const [catatan, setCatatan] = useState(DEFAULT_CATATAN);
  const [siswa, setSiswa] = useState(null);
  const [namaKelas, setNamaKelas] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
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
            Comment: data.comment
          });
          setNamaKelas(data.class_name);
        }
      } catch (error) {
        console.error('Gagal mengambil data siswa:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id_student]);

  useEffect(() => {
    const savedCatatan = localStorage.getItem('catatan');
    if (savedCatatan) setCatatan(savedCatatan);
  }, []);

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleBack = () => window.history.back();

  const renderKategori = () => {
    if (!siswa) return '-';
    return siswa.poin < 5
      ? <span className="text-green-600 font-bold">Baik</span>
      : <span className="text-red-600 font-bold">Perlu Pembinaan</span>;
  };

  const renderKeterangan = () => {
    if (!siswa) return '';
    return siswa.poin < 5
      ? `${siswa.name} menunjukkan sikap sangat baik dalam hal kedisiplinan.`
      : `${siswa.name} perlu mendapatkan perhatian lebih dalam hal kedisiplinan.`;
  };

  const LoadingSkeleton = () => (
    <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow animate-pulse space-y-6">
      {/* Skeleton Placeholder */}
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl mb-4 print:hidden">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
        >
          ← Kembali
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div
          ref={printRef}
          className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl print:shadow-none print:rounded-none print:p-0 print:m-0"
        >
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8 border-b pb-4 border-indigo-300">
            Laporan Evaluasi Sikap Siswa
          </h1>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
            <div className="space-y-3">
              <div>
                <div className="text-gray-500">Nama</div>
                <div className="font-semibold">{siswa?.name || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Kelas</div>
                <div className="font-semibold">{namaKelas || '-'}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-gray-500">Jumlah Poin</div>
                <div className="font-semibold">{siswa?.poin ?? 0}</div>
              </div>
              <div>
                <div className="text-gray-500">Kategori</div>
                <div>{renderKategori()}</div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Keterangan</h2>
            <p className="text-justify">{renderKeterangan()}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Catatan / Apresiasi Guru</h2>
            <p className="text-justify whitespace-pre-line">{siswa?.comment ?? "-"}</p>
          </section>
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Cetak Hasil
          </button>
        </div>
      )}
    </div>
  );
};

export default LihatPelanggaran;
