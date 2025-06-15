import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getStudentViolation, addComment } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useReactToPrint } from 'react-to-print';

const HasilSiswa = () => {
  const { user } = useAuth();
  const contentRef = useRef(null);;
  const rincianRef = useRef(null);;
  const [isEditing, setIsEditing] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [siswa, setSiswa] = useState(null);
  const [namaKelas, setNamaKelas] = useState('-');
  const [isLoading, setIsLoading] = useState(true);
  const [showViolationDetails, setShowViolationDetails] = useState(false);
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
            violations: data.violation || [],
            comment: data.comment || '',
          });
          setNamaKelas(data.class_name || '-');
          setCatatan(data.comment || '');
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

  const handleSaveComment = async (e) => {
    e.preventDefault();

    if (!catatan.trim()) {
      Swal.fire('Oops', 'Catatan tidak boleh kosong!', 'warning');
      return;
    }

    try {
      const response = await addComment({ id_student, comment: catatan });

      if (response.violation?.comment) {
        setCatatan(response.violation.comment);
        setSiswa((prev) => ({ ...prev, comment: response.violation.comment }));
        setIsEditing(false);
        Swal.fire('Berhasil', 'Catatan berhasil disimpan', 'success');
      } else {
        throw new Error('Response tidak valid');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan saat menyimpan catatan.', 'error');
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `My_HeaderText_Print_`,
    onAfterPrint: () => console.log('Printing completed'),
  });
  
  const handlePrintRincian = useReactToPrint({
    contentRef: rincianRef,
    documentTitle: `Rincian_Pelanggaran_Siswa_`,
    onAfterPrint: () => console.log('Printing rincian completed'),  
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
    <div className="flex flex-col items-center p-6 min-h-screen">
      {/* Tombol Kembali */}
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
          {/* Laporan Evaluasi */}
          <div
            ref={contentRef}
            className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl print:shadow-none print:rounded-none print:p-8 print:m-auto print:w-[21cm]"
          >
            <h1 className="text-3xl font-bold text-center text-[#186c7c] mb-8 border-b pb-4 border-indigo-300">
              Laporan Evaluasi Sikap Siswa
            </h1>

            {/* Info Siswa */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
              <div>
                <p className="text-gray-500">Nama</p>
                <p className="font-semibold">{siswa?.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Kelas</p>
                <p className="font-semibold">{namaKelas}</p>
              </div>
              <div>
                <p className="text-gray-500">Jumlah Poin</p>
                <p className="font-semibold">{siswa?.poin ?? 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Kategori</p>
                {renderKategori()}
              </div>
            </section>

            {/* Keterangan */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Keterangan</h2>
              <p className="text-justify">{renderKeterangan()}</p>
            </section>

            {/* Catatan */}
            <section>
              <h2 className="text-xl font-semibold text-[#186c7c] mb-2">Catatan / Apresiasi Guru</h2>
              {isEditing ? (
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-800"
                  rows="4"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              ) : (
                <p className="text-justify whitespace-pre-line">{siswa?.comment || '-'}</p>
              )}
              {user?.role === 'guru_bk' && (
                isEditing ? (
                  <div className="flex gap-2 mt-2 print:hidden">
                    <button
                      onClick={handleSaveComment}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setCatatan(siswa?.comment || '');
                        setIsEditing(false);
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2 print:hidden"
                  >
                    Edit Catatan
                  </button>
                )
              )}
            </section>
          </div>

          {/* Tombol Cetak & Toggle Rincian */}
          <div className="flex flex-wrap gap-4 mt-6 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-[#186c7c] text-white px-6 py-3 rounded-lg hover:bg-[#0f4f58] transition"
            >
              Cetak Laporan
            </button>
            <button
              onClick={() => setShowViolationDetails(!showViolationDetails)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              {showViolationDetails ? 'Sembunyikan Rincian Pelanggaran' : 'Lihat Rincian Pelanggaran'}
            </button>
          </div>

          {/* Rincian Pelanggaran */}
          {showViolationDetails && (
            <div className="w-full max-w-3xl mt-6">
              <div className="print:hidden mb-4">
                <button
                  onClick={handlePrintRincian}
                  className="bg-[#186c7c] text-white px-6 py-3 rounded-lg hover:bg-[#0f4f58] transition"
                >
                  Cetak Rincian Pelanggaran
                </button>
              </div>

              <div
                ref={rincianRef}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 print:shadow-none print:rounded-none print:p-8 print:m-auto print:w-[21cm]"
>
                <h2 className="text-2xl font-bold text-center text-[#186c7c] mb-6 border-b pb-3 border-indigo-300">
                  Rincian Pelanggaran Siswa
                </h2>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800 mb-8">
                  <div>
                    <p className="text-gray-500">Nama</p>
                    <p className="font-semibold">{siswa?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Kelas</p>
                    <p className="font-semibold">{namaKelas}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jumlah Poin</p>
                    <p className="font-semibold">{siswa?.poin ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Kategori</p>
                    {renderKategori()}
                  </div>
                </section>

                {siswa?.violations?.length > 0 ? (
                  <div className="space-y-6">
                    {siswa.violations.map(({ id, photo, violation, created_at, poin, comment }) => (
                      <div
                        key={id}
                        className="flex flex-col md:flex-row gap-4 items-start border border-gray-200 rounded-lg p-4 hover:shadow transition"
                      >
                        <img
                          src={photo}
                          alt="Bukti pelanggaran"
                          className="w-32 h-24 object-cover rounded-lg border"
                          loading="lazy"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-lg text-[#186c7c]">{violation}</p>
                          <p className="text-gray-600 text-sm mb-1">{new Date(created_at).toLocaleString()}</p>
                          <p className="font-semibold text-red-600">Poin: {poin}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Tidak ada pelanggaran yang tercatat.</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HasilSiswa;
