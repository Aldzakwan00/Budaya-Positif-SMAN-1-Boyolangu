import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { addMaterial, getMaterial, deleteMateri } from '../../services/api';

const Materi = () => {
    const [selectedGrade, setSelectedGrade] = useState('X');
    const [materiData, setMateriData] = useState({ X: [], XI: [], XII: [] });
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const gradeMap = { X: '1', XI: '2', XII: '3' };

    const fetchMaterial = async () => {
        try {
            setIsLoading(true);
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

        setIsUploading(true);

        try {
            await addMaterial(formData);
            Swal.fire('Berhasil!', 'Materi berhasil diunggah.', 'success');
            fetchMaterial();
            form.reset();
        } catch (err) {
            console.error('❌ Failed to upload material:', err);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat mengunggah.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Yakin ingin menghapus materi ini?',
            text: 'Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        });
    
        if (confirm.isConfirmed) {
            try {
                await deleteMateri({ id: id }); // Kirim objek data sesuai API
                Swal.fire('Terhapus!', 'Materi berhasil dihapus.', 'success');
                fetchMaterial(); // Refresh list materi
            } catch (err) {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error');
            }
        }
    };
    

    const renderSkeleton = (count = 6) => {
        return Array.from({ length: count }).map((_, index) => (
            <div
                key={index}
                className="animate-pulse bg-white border rounded-lg shadow p-4 space-y-4"
            >
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-8 bg-gray-300 rounded w-full mt-auto"></div>
            </div>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#186c7c' }}>Upload Materi Belajar</h1>

            <div className="flex space-x-3 mb-6">
                {['X', 'XI', 'XII'].map(grade => (
                    <button
                        key={grade}
                        className={`px-4 py-2 rounded-md font-semibold border ${selectedGrade === grade
                            ? 'text-white'
                            : 'text-[#186c7c] border-[#186c7c]'}`
                        }
                        style={{
                            backgroundColor: selectedGrade === grade ? '#186c7c' : 'white',
                        }}
                        onClick={() => setSelectedGrade(grade)}
                    >
                        Kelas {grade}
                    </button>
                ))}
            </div>

            <form
                onSubmit={handleUpload}
                className="mb-8 mt-6 border p-6 rounded-xl shadow-lg"
                style={{
                    backgroundColor: '#e0f3f5',
                    borderColor: '#a6cfd4',
                }}
            >
                <h2 className="text-lg font-bold mb-4" style={{ color: '#186c7c' }}>Form Upload Materi</h2>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Judul Materi</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                        style={{ outlineColor: '#186c7c' }}
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
                    className="px-4 py-2 rounded-md transition text-white"
                    style={{
                        backgroundColor: isUploading ? '#9fc6cc' : '#186c7c',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isUploading ? 'Mengunggah...' : 'Upload Materi'}
                </button>
            </form>

            <h2 className="text-xl font-bold mb-4" style={{ color: '#186c7c' }}>Materi Kelas {selectedGrade}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {isLoading ? (
                    renderSkeleton()
                ) : materiData[selectedGrade].length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada materi.</p>
                ) : (
                    materiData[selectedGrade].map((materi, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
                        >
                            <h3 className="font-bold text-lg mb-3" style={{ color: '#186c7c' }}>{materi.name}</h3>

                            <a
                                href={materi.url_material}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white text-center px-3 py-2 rounded"
                                style={{
                                    backgroundColor: '#186c7c',
                                    alignSelf: 'stretch',
                                }}
                            >
                                Download
                            </a>

                            <button
                                onClick={() => handleDelete(materi.id)}
                                className="text-sm text-white text-center px-3 py-2 rounded mt-2"
                                style={{
                                    backgroundColor: '#d9534f',
                                    alignSelf: 'stretch',
                                }}
                            >
                                Hapus
                            </button>
                        </div>

                    ))
                )}
            </div>
        </div>
    );
};

export default Materi;
