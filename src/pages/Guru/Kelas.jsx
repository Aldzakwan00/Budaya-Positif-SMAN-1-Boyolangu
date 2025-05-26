import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, getClassViolation } from '../../services/api';

const SkeletonCard = () => (
  <div className="animate-pulse p-6 rounded-xl shadow-md bg-gray-300 h-20 w-full"></div>
);

const Kelas = () => {
  const [kelas, setKelas] = useState([]);
  const [filteredKelas, setFilteredKelas] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        setLoading(true);
        const data = await getAllStudents();
        const allKelas = data.flatMap((item) =>
          item.class_name.map((kelasItem) => ({
            grade: item.grade,
            id_class: kelasItem.id_class,
            name: kelasItem.class_name,
            student: kelasItem.student,
          }))
        );
        const uniqueGrades = [...new Set(allKelas.map(k => k.grade))];
        setKelas(allKelas);
        setFilteredKelas(allKelas);
        setGrades(uniqueGrades);
      } catch (error) {
        console.error('Gagal memuat kelas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  const handleCardClick = async (item) => {
    try {
      const response = await getClassViolation({ id_class: item.id_class });
      navigate(`/kelas/${item.id_class}`, {
        state: {
          id_class: item.id_class,
          namaKelas: item.name,
          siswa: item.student,
          violationData: response.data,
        },
      });
    } catch (error) {
      console.error('Gagal melakukan post pelanggaran kelas', error);
    }
  };

  const handleFilterChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    setFilteredKelas(grade === 'All' ? kelas : kelas.filter(k => k.grade === grade));
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 50 + 150);
    const g = Math.floor(Math.random() * 50 + 150);
    const b = Math.floor(Math.random() * 50 + 150);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#186c7c] mb-6 text-center">Daftar Kelas</h1>

      {/* Filter */}
      <div className="mb-8 w-full max-w-4xl flex flex-col sm:flex-row items-center gap-4">
        <label
          htmlFor="filterGrade"
          className="font-semibold text-gray-700 whitespace-nowrap"
        >
          Filter berdasarkan grade:
        </label>
        <select
          id="filterGrade"
          value={selectedGrade}
          onChange={handleFilterChange}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#186c7c] focus:border-transparent transition"
        >
          <option value="All">Semua</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Kelas Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          : filteredKelas.map((item) => (
              <div
                key={`${item.id_class}-${item.name}`}
                onClick={() => handleCardClick(item)}
                className="cursor-pointer p-6 rounded-xl shadow-md font-semibold text-white transition transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#209c88] select-none"
                style={{
                  backgroundColor: getRandomColor(),
                  userSelect: 'none',
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(item);
                  }
                }}
                aria-label={`Kelas ${item.name}, klik untuk melihat detail`}
              >
                {item.name}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Kelas;
