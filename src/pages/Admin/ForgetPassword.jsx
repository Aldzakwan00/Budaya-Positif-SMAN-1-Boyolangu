import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { forgetPassword, getUsername } from '../../services/api';

const ForgetPassword = () => {
  const [usernameList, setUsernameList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const data = await getUsername();
        const options = data.user.map(user => ({
          label: user.name,
          value: user.username
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
      setSelectedUser(null);
      setPassword('');
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat mengganti password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-28 px-4 sm:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
        <h1 className="text-2xl font-bold text-[#186c7c] mb-6 text-center">
          Ganti Password Akun
        </h1>

        <form onSubmit={handleChangePassword} className="space-y-5">
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
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#186c7c]"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#186c7c] text-white py-2 rounded-md hover:bg-green-700 transition"
            disabled={loading || !selectedUser}
          >
            {loading ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
