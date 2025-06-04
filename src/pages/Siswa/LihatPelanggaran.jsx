import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getStudentViolation } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useReactToPrint } from 'react-to-print';

const HasilSiswa = () => {
  const { user } = useAuth();
  const contentRef = useRef(null);
  const [siswa, setSiswa] = useState(null);
  const [namaKelas, setNamaKelas] = useState('-');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id_student } = location.state || {};

  useEffect(() => {
    if (!id_student) {
      Swal.fire('Error', 'Data siswa tidak ditemukan', 'error');
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentViolation({ id_student });
        if (response.status === 'success' && response.data) {
          const data = response.data;
          setSiswa({
            name: data.name || '-',
            poin: data.total_points ?? 0,
            comment: data.comment || '-',
          });
          setNamaKelas(data.class_name || '-');
        } else {
          throw new Error('Data siswa tidak valid');
        }
      } catch (error) {
        Swal.fire('Error', 'Gagal mengambil data siswa', 'error');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id_student, navigate]);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Laporan_Siswa`,
    onAfterPrint: () => console.log('Printing completed'),
  });

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
      : `${siswa.name} saat ini masih memerlukan perhatian lebih dalam hal kedisiplinan. Beberapa pelanggaran yang dilakukan menunjukkan perlunya bimbingan dan arahan agar dapat berkembang.`;
  };

  const LoadingSkeleton = () => (
    <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow animate-pulse space-y-6">
      <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col} className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-6 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-6 bg-gray-300 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="h-6 bg-gray-300 rounded w-1/3" />
      <div className="h-24 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6 min-h-screen ">
      <div className="w-full max-w-3xl mb-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-[#186c7c] rounded-lg font-semibold border border-[#186c7c] hover:bg-[#186c7c] hover:text-white transition"
        >
          ← Kembali
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div
            ref={contentRef}
            className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl print:shadow-none print:rounded-none print:p-8 print:m-auto print:w-[21cm]"
          >
            <h1 className="text-3xl font-bold text-center text-[#186c7c] mb-8 border-b pb-4 border-indigo-300">
              Laporan Evaluasi Sikap Siswa
            </h1>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
              <div>
                <p className="text-gray-500">Nama</p>
                <p className="font-semibold">{siswa?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Kelas</p>
                <p className="font-semibold">{namaKelas}</p>
              </div>
              <div>
                <p className="text-gray-500">Jumlah Poin</p>
                <p className="font-semibold">{siswa?.poin}</p>
              </div>
              <div>
                <p className="text-gray-500">Kategori</p>
                {renderKategori()}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Keterangan</h2>
              <p className="text-justify">{renderKeterangan()}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Catatan / Apresiasi Guru</h2>
              <p className="text-justify whitespace-pre-line">{siswa?.comment}</p>
            </section>
          </div>

          <div className="mt-6 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-[#186c7c] text-white px-6 py-3 rounded-lg hover:bg-[#0f4f58] transition"
            >
              Cetak Laporan
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HasilSiswa;
