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
    

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center mb-6">Rincian Pelanggaran</h1>

            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-6"></div>
                    {[...Array(2)].map((_, idx) => (
                        <div key={idx} className="flex items-center space-x-4 bg-white p-4 rounded shadow">
                            <div className="w-24 h-24 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : siswa ? (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold">{siswa.name}</h2>
                        <p className="text-red-600 font-medium">Total Poin: {siswa.poin}</p>
                    </div>

                    <div className="space-y-4">
                        {siswa.violations.map((v, index) => (
                            <div key={v.id} className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow p-4 transition hover:shadow-md">
                                <img
                                    src={v.photo}
                                    alt={`Bukti ${index + 1}`}
                                    className="w-full md:w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
                                />
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-lg font-semibold text-gray-800">{v.violation}</p>
                                    <p className="text-sm text-gray-500">Poin: {v.poin}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(v.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">Data tidak tersedia.</p>
            )}
        </div>
    );
};

export default RincianPelanggaran;
