import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { addMaterial, getMaterial } from '../../services/api';

const Materi = () => {
    const [selectedGrade, setSelectedGrade] = useState('X');
    const [materiData, setMateriData] = useState({ X: [], XI: [], XII: [] });
    const [isUploading, setIsUploading] = useState(false); // ✅ efek loading

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

    const handleUpload = async (e) => {
        e.preventDefault();
        const form = e.target;
        const file = form.file.files[0];
        const name = form.title.value;
        const id_grade = gradeMap[selectedGrade];

        if (!file || !name) {
            Swal.fire('Oops!', 'Judul atau file belum diisi.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('material', file);
        formData.append('id_grade', id_grade);

        setIsUploading(true); // mulai loading

        try {
            const res = await addMaterial(formData);
            console.log('✅ Material uploaded:', res);

            Swal.fire('Berhasil!', 'Materi berhasil diunggah.', 'success');

            fetchMaterial(); // refresh list materi
            form.reset();
        } catch (err) {
            console.error('❌ Failed to upload material:', err);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengunggah.', 'error');
        } finally {
            setIsUploading(false); // selesai loading
        }
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

            <form 
                onSubmit={handleUpload} 
                className="mb-8 mt-6 border border-indigo-300 bg-indigo-50 p-6 rounded-xl shadow-lg"
            >
                <h2 className="text-lg font-bold text-indigo-700 mb-4">Form Upload Materi</h2>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Judul Materi</label>
                    <input 
                        type="text" 
                        name="title" 
                        required 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Upload File</label>
                    <input 
                        type="file" 
                        name="file" 
                        required 
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-md transition text-white ${isUploading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isUploading ? 'Mengunggah...' : 'Upload Materi'}
                </button>
            </form>

            <h2 className="text-xl font-bold mb-4 text-indigo-600">Materi Kelas {selectedGrade}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {materiData[selectedGrade].length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada materi.</p>
                ) : (
                    materiData[selectedGrade].map((materi, index) => (
                        <div key={index} className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-indigo-700">{materi.name}</h3>
                                <a
                                    href={materi.url_material}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Materi;
