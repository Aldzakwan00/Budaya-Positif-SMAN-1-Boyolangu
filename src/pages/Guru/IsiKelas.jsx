import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const dummyData = [
    { name: 'Ahmad', poin: 15 },
    { name: 'Budi', poin: 3 },
    { name: 'Chandra', poin: 8 },
    { name: 'Dewi', poin: 20 },
    { name: 'Eka', poin: 6 },
    { name: 'Farhan', poin: 10 },
    { name: 'Gita', poin: 2 },
    { name: 'Hadi', poin: 12 },
    { name: 'Intan', poin: 4 },
    { name: 'Joko', poin: 7 },
];

const IsiKelas = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { namaKelas } = location.state || {};
    const [sortType, setSortType] = useState('');

    const getSortedData = () => {
        let sorted = [...dummyData];
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
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">Siswa Kelas {namaKelas || ''}</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition shadow-sm"
                    >
                        ← Kembali
                    </button>
                </div>

                <div className="mb-6">
                    <label className="mr-3 font-medium text-gray-700">Urutkan:</label>
                    <select
                        className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="az">Nama (A-Z)</option>
                        <option value="max">Poin Tertinggi</option>
                        <option value="min">Poin Terendah</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {getSortedData().map((siswa, index) => (
                        <Link
                            key={index}
                            to="/hasil-siswa"
                            className="block p-5 bg-white rounded-xl shadow hover:shadow-md hover:bg-gray-100 transition transform hover:scale-[1.02]"
                        >
                            <div className="flex justify-between items-center">
                                <div className="text-lg font-semibold text-gray-800">{siswa.name}</div>
                                <div className="text-sm font-medium text-indigo-600">Poin: {siswa.poin}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IsiKelas;
