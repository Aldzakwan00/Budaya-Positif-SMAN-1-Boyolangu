import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { getAllStudents, getViolation, postViolation } from '../../services/api';

const CatatPelanggaran = () => {
    const [violations, setViolations] = useState([]);
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [kelas, setKelas] = useState('');
    const [tingkat, setTingkat] = useState('');
    const [nama, setNama] = useState('');
    const [dataMap, setDataMap] = useState({});
    const [grades, setGrades] = useState([]);
    const [bukti, setBukti] = useState(null);
    const [tanggal, setTanggal] = useState('');
    const [hari, setHari] = useState('');
    const [jam, setJam] = useState('');
    const [useCamera, setUseCamera] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (tanggal) {
            const date = new Date(tanggal);
            const options = { weekday: 'long' };
            const dayName = date.toLocaleDateString('id-ID', options).toLowerCase(); 
            setHari(dayName);
        }
    }, [tanggal]);
    
      

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentData = await getAllStudents();
                const allKelas = studentData.flatMap((item) =>
                    item.class_name.map((kelasItem) => ({
                        grade: item.grade,
                        name: kelasItem.class_name,
                        student: kelasItem.student,
                    }))
                );
                setKelas('');
                const map = {};
                allKelas.forEach(k => {
                    if (!map[k.grade]) map[k.grade] = {};
                    map[k.grade][k.name] = k.student;
                });
                setDataMap(map);
                setGrades([...new Set(allKelas.map(k => k.grade))]);

                const violationData = await getViolation();
                setViolations(violationData.data);
            } catch (err) {
                console.error('Gagal mengambil data:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (useCamera) {
            const constraints = {
                video: {
                    facingMode: { exact: "environment" }  
                }
            };
    
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    videoRef.current.play();
                })
                .catch(err => {
                    console.warn("Kamera belakang tidak tersedia, mencoba kamera default...", err);
    
                    // Fallback ke kamera default jika kamera belakang tidak tersedia
                    navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => {
                            videoRef.current.srcObject = stream;
                            streamRef.current = stream;
                            videoRef.current.play();
                        })
                        .catch(err2 => {
                            console.error("Gagal akses kamera:", err2);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Kamera',
                                text: 'Tidak dapat mengakses kamera. Pastikan izin sudah diberikan.',
                            });
                            setUseCamera(false);
                        });
                });
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setBukti(null); 
        }
    }, [useCamera]);
    
    

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                const file = new File([blob], 'camera_capture.png', { type: 'image/png' });
                setBukti(file);
            }, 'image/png');
        }
    };

    const getSiswaList = () => {
        if (tingkat && kelas && dataMap[tingkat] && dataMap[tingkat][kelas]) {
            return dataMap[tingkat][kelas];
        }
        return [];
    };

    const violationOptions = violations.map(v => ({
        value: v.id,
        label: `${v.name} (Poin: ${v.poin})`
    }));

    const getSelectedStudentId = () => {
        const siswaList = getSiswaList();
        const siswa = siswaList.find(s => s.name === nama);
        return siswa ? siswa.id : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

        const id_student = getSelectedStudentId();
        if (!id_student || !selectedViolation || !bukti) {
            alert('Harap lengkapi semua data terlebih dahulu!');
            return;
        }

        const formData = new FormData();
        formData.append('photo', bukti);
        formData.append('id_student', id_student);
        formData.append('id_violation', selectedViolation.value);
        formData.append('tanggal', tanggal);
        formData.append('hari', hari);
        formData.append('jam', jam);

        try {
            await postViolation(formData); 

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Pelanggaran berhasil dicatat.',
                showConfirmButton: true,
                timer: 2000
            });

            setTingkat('');
            setKelas('');
            setNama('');
            setSelectedViolation(null);
            setBukti(null);
            setTanggal('');
            setHari('');
            setJam('');
            setUseCamera(false);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal mencatat pelanggaran. Silakan coba lagi.',
            });
        }
    };

    return (
        <div className='flex flex-col items-center p-5 text-center min-h-screen'>
            <h1 className='text-3xl font-semibold text-[#186c7c] mb-10'>KONSEKUENSI POIN BUDAYA POSITIF</h1>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    {/* Tanggal dan Jam dalam 1 baris */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex-1'>
                            <label htmlFor="tanggal" className='block text-sm font-medium text-gray-700'>Tanggal *</label>
                            <input
                                type="date"
                                id="tanggal"
                                name="tanggal"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                required
                                className='mt-1 p-3 w-full border border-gray-300 rounded-lg'
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="jam" className='block text-sm font-medium text-gray-700'>Jam *</label>
                            <input
                                type="time"
                                id="jam"
                                name="jam"
                                value={jam}
                                onChange={(e) => setJam(e.target.value)}
                                required
                                className='mt-1 p-3 w-full border border-gray-300 rounded-lg'
                            />
                        </div>
                    </div>

                    {/* Hari */}
                    <div>
                        <label htmlFor="hari" className='block text-sm font-medium text-gray-700'>Hari *</label>
                        <input
                            type="text"
                            id="hari"
                            name="hari"
                            value={hari.charAt(0).toUpperCase() + hari.slice(1)} // Kapitalisasi pertama
                            readOnly
                            className='mt-1 p-3 w-full border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed'
                        />

                    </div>

                    {/* Tingkat */}
                    <div>
                        <label htmlFor="tingkat" className='block text-sm font-medium text-gray-700'>Tingkat Kelas *</label>
                        <select
                            id="tingkat"
                            value={tingkat}
                            onChange={(e) => { setTingkat(e.target.value); setKelas(''); setNama(''); }}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value=""> Pilih Tingkat </option>
                            {Object.keys(dataMap).map((t) => (
                                <option key={t} value={t}>{t.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kelas */}
                    <div>
                        <label htmlFor="kelas" className='block text-sm font-medium text-gray-700'>Kelas *</label>
                        <select
                            id="kelas"
                            value={kelas}
                            onChange={(e) => { setKelas(e.target.value); setNama(''); }}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value=""> Pilih Kelas </option>
                            {tingkat && dataMap[tingkat] &&
                                Object.keys(dataMap[tingkat]).map((kls) => (
                                    <option key={kls} value={kls}>{kls}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Nama Siswa */}
                    <div>
                        <label htmlFor="nama" className='block text-sm font-medium text-gray-700'>Nama Siswa *</label>
                        <select
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value=""> Pilih Nama Siswa </option>
                            {getSiswaList().map((s, idx) => (
                                <option key={idx} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Pelanggaran */}
                    <div>
                        <label htmlFor="pelanggaran" className='block text-sm font-medium text-gray-700 mb-1'>Pelanggaran *</label>
                        <Select
                            id="pelanggaran"
                            options={violationOptions}
                            value={selectedViolation}
                            onChange={setSelectedViolation}
                            placeholder="Pilih satu pelanggaran"
                            isSearchable
                            className="text-left"
                            classNamePrefix="select"
                        />
                    </div>

                    {/* Pilihan Upload / Kamera */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Upload atau Ambil Foto Bukti *</label>
                        <div className='flex gap-6 mb-3'>
                            <label className='inline-flex items-center cursor-pointer'>
                                <input
                                    type="radio"
                                    name="photoOption"
                                    value="upload"
                                    checked={!useCamera}
                                    onChange={() => setUseCamera(false)}
                                    className="form-radio"
                                />
                                <span className='ml-2'>Upload Gambar</span>
                            </label>
                            <label className='inline-flex items-center cursor-pointer'>
                                <input
                                    type="radio"
                                    name="photoOption"
                                    value="camera"
                                    checked={useCamera}
                                    onChange={() => setUseCamera(true)}
                                    className="form-radio"
                                />
                                <span className='ml-2'>Ambil Gambar</span>
                            </label>
                        </div>

                        {/* Upload file */}
                        {!useCamera && (
                            <input
                                type="file"
                                id="bukti"
                                name="bukti"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        setBukti(e.target.files[0]);
                                    } else {
                                        setBukti(null);
                                    }
                                }}
                                required
                                className='block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                            />
                        )}

                        {/* Kamera */}
                        {useCamera && (
                            <div className='flex flex-col items-center'>
                                <video
                                    ref={videoRef}
                                    className="w-full max-w-xs rounded border border-gray-300 mb-3"
                                    autoPlay
                                    muted
                                />
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="mb-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Ambil Foto
                                </button>
                                <canvas ref={canvasRef} className="hidden" />
                                {bukti && (
                                    <div className="mb-3">
                                        <img
                                            src={URL.createObjectURL(bukti)}
                                            alt="Preview Bukti"
                                            className="max-w-xs rounded border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-[#186c7c] hover:bg-[#209c88] text-white font-semibold py-3 rounded transition-colors'
                    >
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CatatPelanggaran;
