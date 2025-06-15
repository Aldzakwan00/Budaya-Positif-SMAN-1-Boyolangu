import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';


const SkeletonCard = () => (
  <div className="animate-pulse p-5 bg-white rounded-xl shadow">
    <div className="h-6 bg-gray-300 rounded w-3/5 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const IsiKelas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const { namaKelas, siswa = [], violationData = [] } = location.state || {};
  const [sortType, setSortType] = useState('');
  const [siswaDenganPoin, setSiswaDenganPoin] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Siswa ${namaKelas}`,
    pageStyle: `@media print { body { -webkit-print-color-adjust: exact; } }`,
    onAfterPrint: () => console.log('Print completed!'),
  });

  useEffect(() => {
    const merged = siswa.map((s) => {
      const pelanggaran = violationData.find(v => parseInt(v.id_student) === s.id);
      return { ...s, poin: pelanggaran ? parseInt(pelanggaran.total_points) : 0 };
    });
    setSiswaDenganPoin(merged);
    setLoading(false);
  }, [siswa, violationData]);

  const getSortedData = () => {
    let sorted = [...siswaDenganPoin];
    if (sortType === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortType === 'max') sorted.sort((a, b) => b.poin - a.poin);
    else if (sortType === 'min') sorted.sort((a, b) => a.poin - b.poin);
    return sorted;
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#186c7c]">
            Siswa Kelas {namaKelas || '-'}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-[#186c7c] border border-[#186c7c] rounded hover:bg-[#186c7c] hover:text-white"
            >
              ← Kembali
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label htmlFor="sort" className="text-[#186c7c] font-medium">Urutkan:</label>
          <select
            id="sort"
            className="p-3 border border-[#186c7c] rounded-md text-[#186c7c] font-semibold"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="">Default</option>
            <option value="az">Nama (A-Z)</option>
            <option value="max">Poin Tertinggi</option>
            <option value="min">Poin Terendah</option>
          </select>
        </div>

        <div ref={printRef} className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : getSortedData().length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada siswa.</p>
          ) : (
            getSortedData().map((s, i) => (
              <div
                key={s.id || i}
                className="p-4 bg-white rounded shadow flex justify-between"
              >
                <span>{s.name}</span>
                <span>Poin: {s.poin}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IsiKelas;

