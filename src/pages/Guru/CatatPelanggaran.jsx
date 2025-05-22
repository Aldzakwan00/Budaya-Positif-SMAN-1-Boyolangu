import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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
            console.log('Data yang dikirim:');
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
        
            const result = await postViolation(formData);
            console.log('Response dari server:', result);
        
            alert('Pelanggaran berhasil dicatat!');
            setTingkat('');
            setKelas('');
            setNama('');
            setSelectedViolation(null);
            setBukti(null);
            setTanggal('');
            setHari('');
            setJam('');
        } catch (err) {
            console.error('Gagal mencatat pelanggaran:', err.response?.data || err.message);
            alert('Gagal mencatat pelanggaran. Silakan coba lagi.');
        }
        
    };

    return (
        <div className='flex flex-col items-center h-screen p-5 text-center'>
            <h1 className='text-3xl font-semibold text-gray-800 mb-10'>KONSEKUENSI POIN BUDAYA POSITIF</h1>
            <p className='text-lg text-gray-600 mb-12'>Guru dan staf Karyawan dapat memberikan poin konsekuensi kepada siswa</p>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    {/* Tanggal */}
                    <div>
                        <label htmlFor="tanggal" className='block text-sm font-medium text-gray-700'>Tanggal *</label>
                        <input type="date" id="tanggal" name="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required className='mt-1 p-3 w-full border border-gray-300 rounded-lg' />
                    </div>

                    {/* Hari */}
                    <div>
                        <label htmlFor="hari" className='block text-sm font-medium text-gray-700'>Hari *</label>
                        <select id="hari" name="hari" value={hari} onChange={(e) => setHari(e.target.value)} required className='mt-1 p-3 w-full border border-gray-300 rounded-lg'>
                            <option value="">-- Pilih Hari --</option>
                            <option value="senin">Senin</option>
                            <option value="selasa">Selasa</option>
                            <option value="rabu">Rabu</option>
                            <option value="kamis">Kamis</option>
                            <option value="jumat">Jumat</option>
                            <option value="sabtu">Sabtu</option>
                            <option value="minggu">Minggu</option>
                        </select>
                    </div>

                    {/* Jam */}
                    <div>
                        <label htmlFor="jam" className='block text-sm font-medium text-gray-700'>Jam *</label>
                        <input type="time" id="jam" name="jam" value={jam} onChange={(e) => setJam(e.target.value)} required className='mt-1 p-3 w-full border border-gray-300 rounded-lg' />
                    </div>

                    {/* Tingkat */}
                    <div>
                        <label htmlFor="tingkat" className='block text-sm font-medium text-gray-700'>Tingkat Kelas *</label>
                        <select id="tingkat" value={tingkat} onChange={(e) => { setTingkat(e.target.value); setKelas(''); setNama(''); }} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg">
                            <option value="">-- Pilih Tingkat --</option>
                            {Object.keys(dataMap).map((t) => (
                                <option key={t} value={t}>{t.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kelas */}
                    <div>
                        <label htmlFor="kelas" className='block text-sm font-medium text-gray-700'>Kelas *</label>
                        <select id="kelas" value={kelas} onChange={(e) => { setKelas(e.target.value); setNama(''); }} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg">
                            <option value="">-- Pilih Kelas --</option>
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
                        <select id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg">
                            <option value="">-- Pilih Nama Siswa --</option>
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

                    {/* Bukti Foto */}
                    <div>
                        <label htmlFor="bukti" className='block text-sm font-medium text-gray-700'>Upload Foto Bukti *</label>
                        <input type="file" id="bukti" name="bukti" accept="image/*" onChange={(e) => setBukti(e.target.files[0])} required className='mt-1 p-3 w-full border border-gray-300 rounded-lg' />
                    </div>

                    {/* Submit */}
                    <div className='flex justify-center'>
                        <button type="submit" className='mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CatatPelanggaran;
