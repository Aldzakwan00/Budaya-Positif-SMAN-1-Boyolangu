import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getAllStudents, getStudentViolation } from '../../services/api';
import { Link } from 'react-router-dom';

const Individu = () => {
    const [students, setStudents] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [siswaData, setSiswaData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getAllStudents();
                const flatStudents = [];

                data.forEach(item => {
                    item.class_name.forEach(cls => {
                        cls.student.forEach(s => {
                            flatStudents.push({
                                value: s.id,
                                label: s.name,
                                grade: item.grade.toUpperCase(),
                                class_name: cls.class_name
                            });
                        });
                    });
                });

                setStudents(flatStudents);
            } catch (err) {
                console.error('Gagal memuat data siswa:', err);
            }
        };

        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOption) return;

        setLoading(true);
        setSubmitted(true);
        setSiswaData(null);

        try {
            const response = await getStudentViolation({ id_student: selectedOption.value });
            if (response.status === 'success') {
                setSiswaData({
                    name: response.data.name,
                    total_points: response.data.total_points,
                });
            } else {
                setSiswaData(null);
            }
        } catch (error) {
            console.error('Gagal mengambil data pelanggaran:', error);
            setSiswaData(null);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4">
            <h1 className="text-3xl font-bold text-[#186c7c] my-8 text-center">Lihat Poin Siswa</h1>

            <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="nama" className="text-gray-700 font-medium text-sm">Cari Nama Siswa *</label>
                        <Select
                            inputId="nama"
                            options={students}
                            value={selectedOption}
                            onChange={(selected) => {
                                setSelectedOption(selected);
                                setSiswaData(null);
                                setSubmitted(false);
                            }}
                            placeholder="Ketik nama siswa..."
                            isClearable
                        />
                    </div>

                    <div className="text-center pt-2">
                        <button
                            type="submit"
                            className="bg-[#186c7c] text-white px-6 py-2 rounded-xl hover:bg-[#209c88] transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedOption}
                        >
                            Lihat Poin
                        </button>
                    </div>
                </form>
            </div>

            {submitted && (
                <div className="w-full max-w-xl mt-8">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#186c7c]"></div>
                        </div>
                    ) : selectedOption && siswaData ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hasil:</h2>
                            <Link
                                to="/hasil-siswa"
                                state={{ id_student: selectedOption.value }}
                                className="block p-5 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md hover:bg-gray-50 transition"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="text-lg font-bold text-[#186c7c]">{siswaData.name}</div>
                                        <div className="text-sm text-gray-500">Tingkat: {selectedOption.grade} - Kelas: {selectedOption.class_name}</div>
                                    </div>
                                    <div className="border-[#e0f3f5] text-[#186c7c] px-4 py-1 rounded-full font-semibold">
                                        Poin : {siswaData.total_points}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-red-500 font-medium text-center">
                            Siswa tidak ditemukan atau tidak memiliki pelanggaran.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Individu;
