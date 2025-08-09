
const monthNames = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const AnnualReportTemplate = ({ report }) => {

    return (
        <div className="p-8  bg-white text-black max-w-[800px] mx-auto print-area printable">
            {/* <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h2 className="text-xl font-bold">PUSKESMAS KECAMATAN</h2>
                <p className="text-sm">Jl. Contoh No. 123, Kota Sehat, Provinsi Indonesia</p>
                <p className="text-sm">Telp: (021) 1234567 | Email: puskesmas@dinkes.go.id</p>
                <h3 className="text-lg font-semibold underline underline-offset-4 mt-4">LAPORAN TAHUNAN KESEHATAN LANSIA</h3>
                <p className="text-sm">Tahun: {report?.tahun || new Date().getFullYear()}</p>
            </div> */}

            <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-6">

                <img src="/assets/LOGO_PEMPROV_MAROS.png" alt="Logo Kiri" class="h-16 w-16 object-contain" />

                <div class="text-center">
                    <h2 class="text-xl font-bold">PEMERINTAH KABUPATEN MAROS</h2>
                    <h2 class="text-xl font-bold">DINAS KESEHATAN</h2>
                    <h2 class="text-xl font-bold">UPTD PUSKESMAS CAMBA</h2>
                    <p class="text-sm">JL. Nurdin Djohan No.14 Kec. Camba Kode Pos: 90562, email: uptp.camba@gmail.com</p>
                </div>

                <img src='/assets/LOGO_PUSKESMAS_CAMBA.png' alt="Logo Kanan" class="h-20 w-20 object-contain" />
            </div>

            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold underline underline-offset-4 mt-4">LAPORAN TAHUNAN KESEHATAN LANSIA</h3>
                <p className="text-sm">Tahun: {report?.tahun || new Date().getFullYear()}</p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2 ">KATA PENGANTAR</h4>
                <p className="text-sm mb-2">Puji syukur kehadirat Allah SWT atas segala rahmat dan hidayah-Nya, sehingga kami dapat menyelesaikan Laporan Tahunan Kesehatan Lansia ini dengan baik.</p>
                <p className="text-sm">Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan program kesehatan lansia di wilayah kerja Puskesmas Kecamatan selama tahun {report?.tahun || new Date().getFullYear()}.</p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2 ">RINGKASAN EKSEKUTIF</h4>
                <div className="text-sm border border-black p-3">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-1 w-64">Total Pasien yang Diperiksa</td>
                                <td className="py-1">: {report?.total_pasien || 0} orang</td>
                            </tr>
                            <tr>
                                <td className="py-1">Jumlah Pasien Laki-laki</td>
                                <td className="py-1">: {report?.jumlah_jenis_kelamin?.L || 0} orang</td>
                            </tr>
                            <tr>
                                <td className="py-1">Jumlah Pasien Perempuan</td>
                                <td className="py-1">: {report?.jumlah_jenis_kelamin?.P || 0} orang</td>
                            </tr>
                            <tr>
                                <td className="py-1">Persentase Pasien Laki-laki</td>
                                <td className="py-1">: {report?.total_pasien ? Math.round((report?.jumlah_jenis_kelamin?.L || 0) / report.total_pasien * 100) : 0}%</td>
                            </tr>
                            <tr>
                                <td className="py-1">Persentase Pasien Perempuan</td>
                                <td className="py-1">: {report?.total_pasien ? Math.round((report?.jumlah_jenis_kelamin?.P || 0) / report.total_pasien * 100) : 0}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2 ">ANALISIS KUNJUNGAN PER BULAN</h4>
                <div className="text-sm border border-black p-3">
                    <p className="mb-2">Berikut adalah data kunjungan pasien lansia selama tahun {report?.tahun || new Date().getFullYear()}:</p>
                    {Array.isArray(report?.kunjungan_per_bulan) && report.kunjungan_per_bulan.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="text-left py-2">Bulan</th>
                                    <th className="text-right py-2">Jumlah Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.kunjungan_per_bulan.map((k, i) => (
                                    <tr key={i} className="border-b border-gray-300">
                                        <td className="py-1">{monthNames[k.bulan]}</td>
                                        <td className="text-right py-1">{k.jumlah} kunjungan</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Tidak ada data kunjungan yang tercatat.</p>
                    )}
                </div>
            </div>



            <div className="mb-6">
                <h4 className="font-semibold mb-2 ">PASIEN DENGAN KUNJUNGAN TERBANYAK</h4>
                <div className="text-sm border border-black p-3">
                    <p className="mb-2">Berikut adalah pasien lansia dengan frekuensi kunjungan tertinggi:</p>
                    {Array.isArray(report?.pasien_terbanyak) && report.pasien_terbanyak.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="text-left py-2">No.</th>
                                    <th className="text-left py-2">Nama Pasien</th>
                                    <th className="text-right py-2">Jumlah Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.pasien_terbanyak.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-300">
                                        <td className="py-1">{i + 1}</td>
                                        <td className="py-1">{p.nama_lengkap}</td>
                                        <td className="text-right py-1">{p.jumlah_kunjungan} kunjungan</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Tidak ada data pasien aktif yang tercatat.</p>
                    )}
                </div>
            </div>


            <div className="mb-6">
                <h4 className="font-semibold mb-2 underline">PENUTUP</h4>
                <p className="text-sm py-2">Demikian laporan tahunan kesehatan lansia ini kami susun sebagai bahan evaluasi dan perencanaan program kesehatan lansia di masa mendatang. Semoga laporan ini dapat bermanfaat bagi semua pihak yang berkepentingan.</p>
            </div>
            <div class="page-break">

                <div className="flex justify-between mt-5">
                    <div className="text-sm">
                        <p>Mengetahui,</p>
                        <p className="font-semibold">Kepala Puskesmas</p>
                        <div className="h-16"></div>
                        <p className="font-semibold underline">(......................................)</p>
                    </div>

                    <div className="text-sm">
                        <p>Kota Camba, {new Date().toLocaleDateString('id-ID')}</p>
                        <p className="font-semibold">Penanggung Jawab Program</p>
                        <div className="h-16"></div>
                        <p className="font-semibold underline">(......................................)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualReportTemplate;