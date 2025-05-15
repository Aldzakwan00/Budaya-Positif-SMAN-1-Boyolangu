import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const dummyData = {
    x: {
        1: [
            { name: 'Ahmad', poin: 10 },
            { name: 'Budi', poin: 5 },
        ],
        2: [
            { name: 'Chandra', poin: 7 },
            { name: 'Dewi', poin: 8 },
        ],
        },
    xi: {
        1: [
            { name: 'Eka', poin: 3 },
            { name: 'Farhan', poin: 12 },
        ],
        3: [
            { name: 'Gita', poin: 9 },
            { name: 'Hadi', poin: 4 },
        ],
        },
    xii: {
        2: [
            { name: 'Intan', poin: 6 },
            { name: 'Joko', poin: 11 },
        ]
    },
};

const Individu = () => {
    const [tingkat, setTingkat] = useState('');
    const [kelas, setKelas] = useState('');
    const [nama, setNama] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const getSiswaList = () => {
        if (tingkat && kelas) {
            return dummyData[tingkat][kelas] || [];
        }
        return [];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        const siswa = getSiswaList().find((s) => s.name === nama);
        setSelectedSiswa(siswa || null);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4">
            <h1 className="text-3xl font-bold text-indigo-700 my-8 text-center">Lihat Poin Siswa</h1>

            <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-2xl shadow-lg transition-all">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Tingkat Kelas */}
                    <div>
                        <label htmlFor="tingkat" className="text-gray-700 font-medium text-sm">Tingkat Kelas *</label>
                        <select
                            id="tingkat"
                            value={tingkat}
                            onChange={(e) => {
                            setTingkat(e.target.value);
                            setKelas('');
                            setNama('');
                            setSelectedSiswa(null);
                            setSubmitted(false);
                            }}
                            required
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        >
                            <option value="">-- Pilih Tingkat --</option>
                            <option value="x">X</option>
                            <option value="xi">XI</option>
                            <option value="xii">XII</option>
                        </select>
                    </div>

                {/* Kelas */}
                <div>
                    <label htmlFor="kelas" className="text-gray-700 font-medium text-sm">Kelas *</label>
                    <select
                        id="kelas"
                        value={kelas}
                        onChange={(e) => {
                        setKelas(e.target.value);
                        setNama('');
                        setSelectedSiswa(null);
                        setSubmitted(false);
                        }}
                        required
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {tingkat && Object.keys(dummyData[tingkat] || {}).map((k) => (
                        <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>

                {/* Nama */}
                <div>
                    <label htmlFor="nama" className="text-gray-700 font-medium text-sm">Nama Siswa *</label>
                    <select
                        id="nama"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    >
                        <option value="">-- Pilih Nama Siswa --</option>
                        {getSiswaList().map((s, idx) => (
                        <option key={idx} value={s.name}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
                <div className="text-center pt-2">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition font-medium"
                    >
                        Lihat Poin
                    </button>
                </div>
            </form>
            </div>

            {/* Result */}
            {submitted && (
            <div className="w-full max-w-xl mt-8 transition-all">
                {selectedSiswa ? (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Hasil:</h2>
                    <Link
                    to="/hasil-siswa"
                    className="block p-5 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md hover:bg-gray-50 transition"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="text-lg font-bold text-indigo-600">{selectedSiswa.name}</div>
                                <div className="text-sm text-gray-500">Tingkat: {tingkat.toUpperCase()} - Kelas: {kelas}</div>
                            </div>
                                <div className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full font-semibold">
                                Poin: {selectedSiswa.poin}
                            </div>
                        </div>
                    </Link>
                </div>
                ) : (
                <div className="text-red-500 font-medium text-center">Siswa tidak ditemukan. Periksa kembali input yang dimasukkan.</div>
                )}
            </div>
            )}
        </div>
    );
};

export default Individu;
