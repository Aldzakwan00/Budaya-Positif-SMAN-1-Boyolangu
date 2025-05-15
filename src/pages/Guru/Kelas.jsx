import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Kelas = () => {
    const [tingkatKelas, setTingkatKelas] = useState('');

    const handleFilterChange = (e) => {
        setTingkatKelas(e.target.value);
    };

    const kelasData = {
        x: ['X-1', 'X-2', 'X-3'],
        xi: ['XI-1', 'XI-2', 'XI-3'],
        xii: ['XII-1', 'XII-2', 'XII-3'],
    };

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 50 + 150);
        const g = Math.floor(Math.random() * 50 + 150);
        const b = Math.floor(Math.random() * 50 + 150);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const filteredKelas = tingkatKelas
        ? kelasData[tingkatKelas]
        : [...kelasData.x, ...kelasData.xi, ...kelasData.xii];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-10 text-center">Daftar Kelas</h1>

            <div className="mb-8">
                <select
                    id="tingkat"
                    name="tingkat"
                    value={tingkatKelas}
                    onChange={handleFilterChange}
                    className="p-3 w-[12rem] border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value="">Tampilkan Semua</option>
                    <option value="x">X</option>
                    <option value="xi">XI</option>
                    <option value="xii">XII</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {filteredKelas.map((kelas) => (
                    <Link
                        to="/kelas/:namaKelas"
                        state={{ namaKelas: kelas }}
                        key={kelas}
                        className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl p-6 text-center rounded-xl shadow-md text-white font-semibold"
                        style={{ backgroundColor: getRandomColor() }}
                    >
                        {kelas}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Kelas;
