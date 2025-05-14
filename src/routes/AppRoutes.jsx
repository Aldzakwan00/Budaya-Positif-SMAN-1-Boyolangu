import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../auth/Login';
import Layout from '../components/Layout';
import DashboardGuru from '../pages/Guru/Dashboard';
import CatatPelanggaran from '../pages/Guru/CatatPelanggaran';
import Individu from '../pages/Guru/Individu';
import Kelas from '../pages/Guru/Kelas';
import Materi from '../pages/Guru/Materi';
import DashboardSiswa from '../pages/Siswa/Dashboard';
import LihatPelanggaranSiswa from '../pages/Siswa/LihatPelanggaran';
import Profile from '../pages/Siswa/Profile';
import LihatMateri from '../pages/Siswa/LihatMateri';
import ProtectedRoute from '../auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-guru" element={<DashboardGuru />} />
        <Route path="/catat-pelanggaran" element={<CatatPelanggaran />} />
        <Route path="/individu" element={<Individu />} />
        <Route path="/kelas" element={<Kelas />} />
        <Route path="/materi" element={<Materi />} />

        <Route path="/dashboard-siswa" element={<DashboardSiswa />} />
        <Route path="/lihat-pelanggaran-siswa" element={<LihatPelanggaranSiswa />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lihat-materi" element={<LihatMateri />} />
      </Route>

      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
