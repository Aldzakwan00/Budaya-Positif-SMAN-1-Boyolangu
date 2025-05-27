import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getStudentViolation } from '../../services/api';

const RincianPelanggaran = ({ id_student: propIdStudent }) => {
    const [siswa, setSiswa] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const id_student = propIdStudent || user?.user?.id_student;

        if (!id_student) {
            console.warn('id_student tidak ditemukan');
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getStudentViolation({ id_student });
                if (response.status === 'success') {
                    const data = response.data;
                    setSiswa({
                        name: data.name,
                        poin: data.total_points,
                        violations: data.violation,
                    });
                }
            } catch (error) {
                console.error('Gagal mengambil data siswa:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [propIdStudent, user?.user?.id_student]);

    const skeletonCard = (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow p-4 animate-pulse">
            <div className="w-full md:w-32 h-32 bg-gray-200 rounded-md mb-4 md:mb-0 md:mr-4"></div>
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#186c7c' }}>
                    Rincian Pelanggaran
                </h1>

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="text-center animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
                        </div>
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <div key={idx}>{skeletonCard}</div>
                        ))}
                    </div>
                ) : siswa ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold" style={{ color: '#186c7c' }}>{siswa.name}</h2>
                            <p className="text-red-600 text-lg font-bold mt-1">Total Poin: {siswa.poin}</p>
                        </div>

                        <div className="space-y-6">
                            {siswa.violations.map((v, index) => (
                                <div
                                    key={v.id}
                                    className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow p-4 hover:shadow-md transition"
                                >
                                    <img
                                        src={v.photo}
                                        alt={`Bukti ${index + 1}`}
                                        className="w-full md:w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
                                    />
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-lg font-semibold text-gray-800">{v.violation}</p>
                                        <p className="text-sm font-medium text-[#186c7c]">Poin: {v.poin}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(v.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 mt-10">Data tidak tersedia.</p>
                )}
            </div>
        </div>
    );
};

export default RincianPelanggaran;
