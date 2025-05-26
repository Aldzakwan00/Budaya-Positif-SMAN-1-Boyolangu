import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, getClassViolation } from '../../services/api';

const Kelas = () => {
    const [kelas, setKelas] = useState([]);
    const [filteredKelas, setFilteredKelas] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [grades, setGrades] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const data = await getAllStudents();
                console.log('Data dari getAllStudents:', data);
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
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 text-center">Daftar Kelas</h1>

            <div className="mb-8">
                <label className="mr-2 font-medium text-gray-700">Filter berdasarkan grade:</label>
                <select
                    value={selectedGrade}
                    onChange={handleFilterChange}
                    className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                >
                    <option value="All">Semua</option>
                    {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {filteredKelas.map((item) => (
                    <div
                        key={`${item.id_class}-${item.name}`}
                        onClick={() => handleCardClick(item)}
                        className="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl p-6 text-center rounded-xl shadow-md text-white font-semibold"
                        style={{ backgroundColor: getRandomColor() }}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kelas;
