import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { forgetPassword, getUsername, deleteUserAccount } from '../../services/api';

const ForgetPassword = () => {
  const [usernameList, setUsernameList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const data = await getUsername();
        const options = data.user.map(user => ({
          label: user.name,
          value: user.username,
          id: user.id,
        }));
        setUsernameList(options);
      } catch (err) {
        Swal.fire('Error', 'Gagal mengambil daftar user', 'error');
      }
    };
    fetchUsernames();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      Swal.fire('Peringatan', 'Pilih nama terlebih dahulu.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await forgetPassword({ username: selectedUser.value, new_password: password });
      Swal.fire('Sukses', 'Password berhasil diubah.', 'success');
      setPassword('');
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat mengganti password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedUser) {
      Swal.fire('Peringatan', 'Pilih nama terlebih dahulu.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Yakin ingin menghapus akun ini?',
      text: 'Tindakan ini tidak dapat dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      setDeleting(true);
      try {
        await deleteUserAccount({ id: selectedUser.id });

        // Hapus user dari daftar dan reset jika yang dipilih dihapus
        const updatedList = usernameList.filter(user => user.id !== selectedUser.id);
        setUsernameList(updatedList);
        setSelectedUser(null);
        setPassword('');

        Swal.fire('Sukses', 'Akun berhasil dihapus.', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus akun.', 'error');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-[#186c7c] mb-6 text-center">Ganti Password / Hapus Akun</h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-[#186c7c]">Pilih Nama</label>
            <Select
              options={usernameList}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Pilih nama pengguna..."
              isSearchable
            />
          </div>

          {selectedUser && (
            <div>
              <label className="block mb-1 text-sm font-medium text-[#186c7c]">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                required
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#186c7c] text-white py-2 rounded-md hover:bg-green-700 transition"
              disabled={loading || !selectedUser}
            >
              {loading ? 'Memproses...' : 'Ganti Password'}
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
              disabled={!selectedUser || deleting}
            >
              {deleting ? 'Menghapus...' : 'Hapus Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
  
};

export default ForgetPassword;
