import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-2xl p-6 text-center space-y-6">
        {/* Tanggal & Jam */}
        <div className="text-gray-700">
          <p className="text-lg font-semibold">{formatDate(time)}</p>
          <p className="text-2xl font-bold">{formatTime(time)}</p>
        </div>

        {/* Judul */}
        <h1 className="text-4xl font-extrabold text-[#186c7c]">
          Budaya <span className="text-[#ef5350]">Positif</span>
        </h1>

        {/* Sapaan */}
        <p className="text-lg text-gray-700">Halo <span className="font-semibold">John Due</span>, bagaimana kabarnya hari ini?</p>
        <p className="text-md text-gray-600">Jumlah Poin saat ini: <span className="font-bold text-green-600">5</span></p>

        {/* Link */}
        <div>
          <p className="text-gray-600 mb-2">Cek selengkapnya di sini:</p>
          <Link
            to="/lihat-pelanggaran-siswa"
            className="inline-block px-6 py-2 bg-[#186c7c] text-white rounded-full hover:bg-[#145960] transition duration-200"
          >
            Cek Poin
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
