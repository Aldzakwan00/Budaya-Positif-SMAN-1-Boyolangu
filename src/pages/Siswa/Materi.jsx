// src/pages/Materi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaterial } from '../../services/api';

const Materi = () => {
    const [selectedGrade, setSelectedGrade] = useState('X');
    const [materiData, setMateriData] = useState({ X: [], XI: [], XII: [] });
    const navigate = useNavigate();

    const gradeMap = { X: '1', XI: '2', XII: '3' };

    const fetchMaterial = async () => {
        try {
            const res = await getMaterial();
            const grouped = { X: [], XI: [], XII: [] };

            res.data.forEach(item => {
                if (item.id_grade === '1') grouped.X.push(item);
                else if (item.id_grade === '2') grouped.XI.push(item);
                else if (item.id_grade === '3') grouped.XII.push(item);
            });

            setMateriData(grouped);
        } catch (err) {
            console.error('❌ Failed to fetch materials: ', err);
        }
    };

    useEffect(() => {
        fetchMaterial();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Materi Belajar</h1>

            <div className="flex space-x-3 mb-6">
                {['X', 'XI', 'XII'].map(grade => (
                    <button
                        key={grade}
                        className={`px-4 py-2 rounded-md font-semibold border ${
                            selectedGrade === grade
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 border-indigo-600'
                        }`}
                        onClick={() => setSelectedGrade(grade)}
                    >
                        Kelas {grade}
                    </button>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-4 text-indigo-600">Materi Kelas {selectedGrade}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {materiData[selectedGrade].length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada materi.</p>
                ) : (
                    materiData[selectedGrade].map((materi) => (
                        <div
                            key={materi.id}
                            onClick={() => navigate(`/materi/${materi.id}`)}
                            className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between"
                        >
                            <h3 className="font-semibold text-lg text-indigo-700 mb-2">{materi.name}</h3>
                            <p className="text-sm text-gray-500">Klik untuk melihat detail</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Materi;
