import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from '../auth/Login';
import Layout from '../components/Layout';
import ProtectedRoute from '../auth/ProtectedRoute';

import GantiPassword from '../components/GantiPassword';

// Guru
import DashboardGuru from '../pages/Guru/Dashboard';
import CatatPelanggaran from '../pages/Guru/CatatPelanggaran';
import Individu from '../pages/Guru/Individu';
import Kelas from '../pages/Guru/Kelas';
import HasilSiswa from '../pages/Guru/HasilSiswa';
import IsiKelas from '../pages/Guru/IsiKelas';
import RincianSiswa from '../pages/Guru/RincianSiswa';
import Materi from '../pages/Guru/Materi';

// Siswa
import DashboardSiswa from '../pages/Siswa/Dashboard';
import RincianPelanggaran from '../pages/Siswa/RincianPelanggaran';
import LihatPelanggaranSiswa from '../pages/Siswa/LihatPelanggaran';
import MateriSiswa from '../pages/Siswa/Materi';
import LihatMateri from '../pages/Siswa/LihatMateri';

// Admin
import Admin from '../pages/Admin/Admin';
import UploadStudent from '../pages/Admin/UploadStudent';
import BuatAkun from '../pages/Admin/BuatAkun';
import ForgetPassword from '../pages/Admin/ForgetPassword';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.4 }}
    className="p-4"
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Route untuk semua user yang sudah login (semua role) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/ganti-password" element={<PageWrapper><GantiPassword /></PageWrapper>} />
        </Route>

        {/* Routes khusus Guru */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['guru']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard-guru" element={<PageWrapper><DashboardGuru /></PageWrapper>} />
          <Route path="/catat-pelanggaran" element={<PageWrapper><CatatPelanggaran /></PageWrapper>} />
          <Route path="/individu" element={<PageWrapper><Individu /></PageWrapper>} />
          <Route path="/rincian-siswa" element={<PageWrapper><RincianSiswa /></PageWrapper>} />
          <Route path="/kelas" element={<PageWrapper><Kelas /></PageWrapper>} />
          <Route path="/hasil-siswa" element={<PageWrapper><HasilSiswa /></PageWrapper>} />
          <Route path="/kelas/:namaKelas" element={<PageWrapper><IsiKelas /></PageWrapper>} />
          <Route path="/materi" element={<PageWrapper><Materi /></PageWrapper>} />
        </Route>

        {/* Routes khusus Siswa */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard-siswa" element={<PageWrapper><DashboardSiswa /></PageWrapper>} />
          <Route path="/rincian-pelanggaran" element={<PageWrapper><RincianPelanggaran /></PageWrapper>} />
          <Route path="/lihat-pelanggaran-siswa" element={<PageWrapper><LihatPelanggaranSiswa /></PageWrapper>} />
          <Route path="/materi-siswa" element={<PageWrapper><MateriSiswa /></PageWrapper>} />
          <Route path="/materi/:id" element={<PageWrapper><LihatMateri /></PageWrapper>} />
        </Route>

        {/* Routes khusus Admin */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/upload-student" element={<PageWrapper><UploadStudent /></PageWrapper>} />
          <Route path="/buat-akun" element={<PageWrapper><BuatAkun /></PageWrapper>} />
          <Route path="/forget-password" element={<PageWrapper><ForgetPassword /></PageWrapper>} />
        </Route>

        {/* Fallback jika route tidak ditemukan */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
