import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const SkeletonCard = () => (
  <div className="animate-pulse p-5 bg-white rounded-xl shadow">
    <div className="h-6 bg-gray-300 rounded w-3/5 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const IsiKelas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { namaKelas, siswa = [], violationData = [] } = location.state || {};

  const [sortType, setSortType] = useState('');
  const [siswaDenganPoin, setSiswaDenganPoin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mergedData = siswa.map((s) => {
      const pelanggaran = violationData.find(
        (v) => parseInt(v.id_student) === s.id
      );
      return {
        ...s,
        poin: pelanggaran ? parseInt(pelanggaran.total_points) : 0,
      };
    });

    setSiswaDenganPoin(mergedData);
    setLoading(false);
  }, [siswa, violationData]);

  const getSortedData = () => {
    let sorted = [...siswaDenganPoin];
    if (sortType === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'max') {
      sorted.sort((a, b) => b.poin - a.poin);
    } else if (sortType === 'min') {
      sorted.sort((a, b) => a.poin - b.poin);
    }
    return sorted;
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#186c7c]">
            Siswa Kelas {namaKelas || '-'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-[#186c7c] rounded-lg font-semibold border border-[#186c7c] transition 
              hover:text-white hover:bg-[#186c7c] focus:outline-none focus:ring-2 focus:ring-[#186c7c]/60"
            aria-label="Kembali"
          >
            ← Kembali
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label
            htmlFor="sort"
            className="font-medium text-[#186c7c]"
          >
            Urutkan:
          </label>
          <select
            id="sort"
            className="p-3 border border-[#186c7c] rounded-md shadow-sm text-[#186c7c] font-semibold
              focus:ring-[#186c7c] focus:border-[#186c7c]"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="">Default</option>
            <option value="az">Nama (A-Z)</option>
            <option value="max">Poin Tertinggi</option>
            <option value="min">Poin Terendah</option>
          </select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : getSortedData().length === 0 ? (
            <div className="text-gray-500 text-center text-lg">
              Tidak ada siswa di kelas ini.
            </div>
          ) : (
            getSortedData().map((s, index) => (
              <Link
                key={s.id || index}
                to="/hasil-siswa"
                state={{ id_student: s.id }}
                className="block p-5 bg-white rounded-xl shadow-md text-[#186c7c] font-semibold
                  transition transform hover:scale-[1.03] hover:underline hover:text-[#14565e]"
                aria-label={`Lihat hasil siswa ${s.name}`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg">{s.name}</div>
                  <div className="text-sm font-medium text-[#186c7c]">
                    Poin: {s.poin}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IsiKelas;
