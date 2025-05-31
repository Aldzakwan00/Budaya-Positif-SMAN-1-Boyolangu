import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getStudentViolation } from '../../services/api'

const Dashboard = () => {
    const { user } = useAuth();
    const id_student = user?.user?.id_student;
    const [isLoading, setIsLoading] = useState(false);
    const [siswa, setSiswa] = useState({ name: '', poin: 0 });


    useEffect(() => {
            const fetchData = async () => {
                if (!id_student) return;
    
                try {
                    setIsLoading(true);
                    const response = await getStudentViolation({ id_student });
                    if (response.status === 'success') {
                        const data = response.data;
                        setSiswa({
                            name: data.name,
                            poin: data.total_points
                        });
                    }
                } catch (error) {
                    console.error('Gagal mengambil data siswa:', error);
                    Swal.fire('Error', 'Gagal mengambil data siswa', 'error');
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchData();
        }, [id_student]);

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
      <div className="min-h-screen px-6 py-10">
        {/* Budaya Positif Header */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-[#186c7c]">
            Budaya <span className="text-[#ef5350]">Positif</span>
          </h1>
          <p className="text-lg text-gray-600 italic mt-2">
            Menumbuhkan semangat belajar, membentuk karakter mulia.
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Informasi Siswa */}
          <section className="space-y-6">
            {/* Tanggal dan Waktu */}
            <div>
              <p className="text-xl font-medium text-gray-700">{formatDate(time)}</p>
              <p className="text-4xl font-bold text-gray-800">{formatTime(time)}</p>
            </div>

            {/* Sapaan dan Poin */}
            <div className="text-gray-800 space-y-2">
              <p className="text-xl font-semibold">Halo, <span className="text-[#186c7c]">{siswa?.name}</span> 👋</p>
              <p className="text-md">Semoga hari ini penuh semangat dan berkah.</p>
              <p className="text-md">Jumlah Poin Positif: <span className="font-bold text-green-600 text-lg">{siswa?.poin}</span></p>
            </div>

            {/* Motivasi */}
            <div className="bg-[#e3f2fd] text-[#0d47a1] p-4 rounded-xl">
              <p className="text-md font-medium">📚 “Setiap hari adalah kesempatan untuk menjadi lebih baik dari kemarin.”</p>
            </div>

            {/* Aksi */}
            <div>
              <p className="text-gray-600 mb-2">Lihat perkembangan dan poin lengkapmu:</p>
              <Link
                to="/lihat-pelanggaran-siswa"
                state={{id_student: user?.user?.id_student}}
                className="inline-block px-6 py-2 bg-[#186c7c] text-white rounded-full hover:bg-[#145960] transition duration-200"
              >
                Cek Disini
              </Link>
            </div>
          </section>

          {/* Doa Section */}
          <section className="bg-[#fff3e0] text-[#4e342e] p-6 rounded-xl space-y-6 text-sm leading-relaxed">
            <h2 className="text-2xl font-bold mb-2 text-[#ef6c00]">📖 Doa Sebelum Belajar</h2>

            <p><b>اللهم صل على سيدنا محمد وعلى آل سيدنا محمد وصحبه أجمعين</b></p>
            <p>Ya Allah berikanlah rahmat atas junjungan kita Nabi Muhammad dan atas keluarga beliau serta para sahabat beliau seluruhnya.</p>

            <p><b>﴿٢٥﴾ رَبِّ اشْرَحْ لِي صَدْرِي ﴿٢٦﴾ وَيَسِّرْ لِي أَمْرِي ﴿٢٧﴾ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ﴿٢٨﴾ يَفْقَهُوا قَوْلِي</b></p>
            <p>“Ya Tuhanku, lapangkanlah untukku dadaku dan mudahkanlah untukku urusanku dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku.” (QS. Ta Ha: 25-28)</p>

            <p><b>رضيت بالله ربا وبالإسلام دينا وبمحمد نبيا ورسولا</b></p>
            <p>"Aku ridho Allah SWT sebagai Tuhanku, Islam sebagai agamaku, dan Nabi Muhammad SAW sebagai Nabi dan Rasul."</p>

            <p><b>اللهم زدني علما، وارزقني فهما، واجعلني من الصالحين</b></p>
            <p>"Ya Allah, tambahkanlah aku ilmu. Berilah aku karunia agar dapat memahaminya. Dan jadikanlah aku termasuk orang-orang yang saleh."</p>

            <p><b>رب اغفر لي ولوالدي، وارحمهما كما ربياني صغيرا</b></p>
            <p>"Tuhanku, ampunilah dosa-dosaku dan kedua orang tuaku, serta kasihanilah mereka berdua sebagaimana mereka telah mendidikku sewaktu kecil."</p>

            <p><b>اللهم انفعني بما علمتني، وعلمني ما ينفعني، وزدني علما، والحمد لله على كل حال</b></p>
            <p>"Ya Allah, berilah kemanfaatan atas segala ilmu yang Engkau ajarkan padaku. Berilah aku ilmu yang bermanfaat dan tambahkanlah ilmu padaku. Segala puji bagi Allah dalam setiap waktu."</p>

            <p><b>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ</b></p>
            <p>"Ya Allah, muliakanlah kami dengan cahaya kepahaman, dan bukakanlah pengertian ilmu kepada kami serta bukakanlah untuk kami pintu-pintu anugerah-Mu, wahai Zat Yang Maha Penyayang."</p>

            <hr className="border-t border-[#ef6c00]" />

            <h2 className="text-2xl font-bold text-[#ef6c00]">📘 Doa Sesudah Belajar</h2>

            <p>"Ya Allah, tunjukkanlah kebenaran kepada kami sebagai kebenaran dan karuniakanlah kepada kami untuk mengikutinya, serta tunjukkanlah kebatilan kepada kami sebagai kebatilan dan karuniakanlah kepada kami untuk menjauhinya."</p>

            <p><b>وَالْعَصْرِ، إِنَّ الْإِنسَانَ لَفِي خُسْرٍ، إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ</b></p>
            <p>Demi masa, sungguh manusia berada dalam kerugian kecuali yang beriman, beramal salih, dan saling menasihati dalam kebenaran dan kesabaran.</p>

            <p>"Ya Allah, anugerahkanlah padaku pemahaman para nabi, penjagaan para rasul, ilham malaikat muqarrabin, dengan rahmat-Mu wahai Tuhan Yang Maha Pengasih."</p>
          </section>
        </div>
      </div>
    )
}

export default Dashboard
