import React, { useState } from 'react';

const Materi = () => {
    const [selectedGrade, setSelectedGrade] = useState('X');
    const [materiData, setMateriData] = useState({
        X: [],
        XI: [],
        XII: [],
    });

    const handleUpload = (e) => {
        e.preventDefault();
        const form = e.target;
        const newMateri = {
            title: form.title.value,
            description: form.description.value,
            file: form.file.files[0]?.name || '(tidak ada file)',
            uploadedAt: new Date().toLocaleString(),
        };

        setMateriData(prev => ({
            ...prev,
            [selectedGrade]: [...prev[selectedGrade], newMateri]
        }));

        form.reset();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Upload Materi Belajar</h1>

            <div className="flex space-x-3 mb-6">
                {['X', 'XI', 'XII'].map(grade => (
                    <button
                        key={grade}
                        className={`px-4 py-2 rounded-md font-semibold border ${selectedGrade === grade ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-indigo-600'}`}
                        onClick={() => setSelectedGrade(grade)}
                    >
                        Kelas {grade}
                    </button>
                ))}
            </div>

            <form onSubmit={handleUpload} className="mb-8 space-y-4 bg-gray-50 p-6 rounded-lg shadow">
                <div>
                    <label className="block font-medium">Judul Materi</label>
                    <input type="text" name="title" required className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block font-medium">Deskripsi</label>
                    <textarea name="description" rows="3" className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block font-medium">Upload File</label>
                    <input type="file" name="file" className="w-full" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Upload Materi
                </button>
            </form>

            <h2 className="text-xl font-bold mb-4 text-indigo-600">Materi Kelas {selectedGrade}</h2>
            <ul className="space-y-3">
                {materiData[selectedGrade].length === 0 ? (
                    <li className="text-gray-500 italic">Belum ada materi.</li>
                ) : (
                    materiData[selectedGrade].map((materi, index) => (
                        <li key={index} className="p-4 bg-white border rounded-md shadow-sm">
                            <div className="font-semibold text-lg">{materi.title}</div>
                            <div className="text-gray-700 text-sm">{materi.description}</div>
                            <div className="text-sm text-gray-500 mt-1">File: {materi.file}</div>
                            <div className="text-xs text-gray-400">Diunggah: {materi.uploadedAt}</div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Materi;
