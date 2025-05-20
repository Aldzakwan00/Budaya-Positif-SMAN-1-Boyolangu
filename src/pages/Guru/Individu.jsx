import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents } from '../../services/api';

const Individu = () => {
    const [dataMap, setDataMap] = useState({});
    const [tingkat, setTingkat] = useState('');
    const [kelas, setKelas] = useState('');
    const [nama, setNama] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllStudents();

                const map = {};
                data.forEach(item => {
                    const grade = item.grade.toLowerCase(); // e.g., "x"
                    map[grade] = map[grade] || {};

                    item.class_name.forEach(cls => {
                        map[grade][cls.class_name] = cls.student;
                    });
                });

                setDataMap(map);
            } catch (err) {
                console.error('Gagal memuat data siswa:', err);
            }
        };

        fetchData();
    }, []);

    const getSiswaList = () => {
        if (tingkat && kelas && dataMap[tingkat] && dataMap[tingkat][kelas]) {
            return dataMap[tingkat][kelas];
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
                            {Object.keys(dataMap).map((t) => (
                                <option key={t} value={t}>{t.toUpperCase()}</option>
                            ))}
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
                            {tingkat && dataMap[tingkat] &&
                                Object.keys(dataMap[tingkat]).map((kls) => (
                                    <option key={kls} value={kls}>{kls}</option>
                                ))
                            }
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
                                        Poin: <span className="italic text-gray-500">[belum ada]</span>
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
