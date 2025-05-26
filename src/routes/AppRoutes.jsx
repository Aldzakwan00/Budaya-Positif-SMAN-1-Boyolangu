import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from '../auth/Login';
import Layout from '../components/Layout';
import DashboardGuru from '../pages/Guru/Dashboard';
import CatatPelanggaran from '../pages/Guru/CatatPelanggaran';
import Individu from '../pages/Guru/Individu';
import Kelas from '../pages/Guru/Kelas';
import HasilSiswa from '../pages/Guru/HasilSiswa';
import IsiKelas from '../pages/Guru/IsiKelas';
import RincianSiswa from '../pages/Guru/RincianSiswa';
import Materi from '../pages/Guru/Materi';
import DashboardSiswa from '../pages/Siswa/Dashboard';
import RincianPelanggaran from '../pages/Siswa/RincianPelanggaran';
import LihatPelanggaranSiswa from '../pages/Siswa/LihatPelanggaran';
import Profile from '../pages/Siswa/Profile';
import MateriSiswa from '../pages/Siswa/Materi';
import LihatMateri from '../pages/Siswa/LihatMateri';
import ProtectedRoute from '../auth/ProtectedRoute';

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
        <Route path="/" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
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

          <Route path="/dashboard-siswa" element={<PageWrapper><DashboardSiswa /></PageWrapper>} />
          <Route path="/rincian-pelanggaran" element={<PageWrapper><RincianPelanggaran /></PageWrapper>} />
          <Route path="/lihat-pelanggaran-siswa" element={<PageWrapper><LihatPelanggaranSiswa /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/materi-siswa" element={<PageWrapper><MateriSiswa /></PageWrapper>} />
          <Route path="/materi/:id" element={<PageWrapper><LihatMateri /></PageWrapper>} />
        </Route>

        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
