import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMaterial } from '../../services/api';
import { ArrowLeftCircle } from 'lucide-react';

const LihatMateri = () => {
    const { id } = useParams();
    const [materi, setMateri] = useState(null);

    useEffect(() => {
        const fetchSingleMateri = async () => {
            try {
                const res = await getMaterial();
                const found = res.data.find((item) => String(item.id) === String(id));
                setMateri(found || null);
            } catch (err) {
                console.error('❌ Failed to fetch material:', err);
            }
        };

        fetchSingleMateri();
    }, [id]);

    if (!materi) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p>Materi tidak ditemukan.</p>
                <Link
                    to="/materi-siswa"
                    className="inline-flex items-center mt-4 text-indigo-600 hover:text-indigo-800 transition"
                >
                    <ArrowLeftCircle className="mr-2" />
                    Kembali ke daftar materi
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="flex items-center mb-6">
                <Link
                    to="/materi-siswa"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition"
                >
                    <ArrowLeftCircle className="mr-2 h-5 w-5" />
                    Kembali ke daftar materi
                </Link>
            </div>

            <div className="bg-white border border-indigo-100 shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-bold text-indigo-700 mb-2">{materi.name}</h1>
                <p className="text-sm text-gray-500 mb-4">Kelas: {materi.id_grade === '1' ? 'X' : materi.id_grade === '2' ? 'XI' : 'XII'}</p>

                <div className="aspect-video border rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        title={materi.name}
                        src={materi.url_material}
                        className="w-full h-full"
                        frameBorder="0"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default LihatMateri;
