import React, { useState, useEffect } from 'react';
import { getMaterial } from '../../services/api';

const Materi = () => {
    const [selectedGrade, setSelectedGrade] = useState('X');
    const [materiData, setMateriData] = useState({ X: [], XI: [], XII: [] });
    const [isLoading, setIsLoading] = useState(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterial();
    }, []);

    const renderSkeletons = (count = 6) =>
        Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="animate-pulse p-4 bg-gray-200 rounded-lg h-32"
            ></div>
        ));

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#186c7c' }}>
                Materi Belajar
            </h1>

            <div className="flex space-x-3 mb-6">
                {['X', 'XI', 'XII'].map(grade => (
                    <button
                        key={grade}
                        className={`px-4 py-2 rounded-md font-semibold border ${selectedGrade === grade
                            ? 'text-white'
                            : 'text-[#186c7c] border-[#186c7c]'
                            }`}
                        style={{
                            backgroundColor: selectedGrade === grade ? '#186c7c' : 'white',
                        }}
                        onClick={() => setSelectedGrade(grade)}
                    >
                        Kelas {grade}
                    </button>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-4" style={{ color: '#186c7c' }}>
                Materi Kelas {selectedGrade}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {isLoading ? (
                    renderSkeletons()
                ) : materiData[selectedGrade].length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada materi.</p>
                ) : (
                    materiData[selectedGrade].map((materi, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
                        >
                            <h3 className="font-bold text-lg mb-3" style={{ color: '#186c7c' }}>
                                {materi.name}
                            </h3>
                            <a
                                href={materi.url_material}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white text-center px-3 py-2 rounded mt-auto"
                                style={{
                                    backgroundColor: '#186c7c',
                                    alignSelf: 'stretch',
                                }}
                            >
                                Download
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Materi;
