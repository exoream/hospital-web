

const HealthReportTemplate = ({ pasien, riwayat, kunjungan }) => {
    const formattedDate = pasien?.tanggal_lahir.split('T')[0];
    return (
        <div className="p-8 bg-white text-black max-w-[800px] mx-auto print-area printable">
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
                <h3 className="text-lg font-semibold underline mt-4 underline-offset-4">SURAT KETERANGAN KESEHATAN</h3>
                <p className="text-sm">Nomor: {pasien.id}/SKK/{new Date().getFullYear()}</p>
            </div>

            <p className="mb-4">Yang bertanda tangan di bawah ini, Dokter Penanggung Jawab Pelayanan Kesehatan pada Puskesmas Kecamatan, dengan ini menerangkan bahwa:</p>

            <table className="mb-6 text-sm">
                <tbody>
                    <tr>
                        <td className="pr-4 py-1 w-32">Nama</td>
                        <td className="py-1">: {pasien?.nama_lengkap || 'JOHN DOE'}</td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-1">NIK</td>
                        <td className="py-1">: {pasien?.nik || '1234567890123456'}</td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-1">Jenis Kelamin</td>
                        <td className="py-1">: {pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-1">Tanggal Lahir</td>
                        <td className="py-1">: {formattedDate || '01 Januari 1990'}</td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-1">Alamat</td>
                        <td className="py-1">: {pasien?.alamat || 'Jl. Contoh No. 123, Kota Sehat'}</td>
                    </tr>
                    {/* <tr>
                        <td className="pr-4 py-1">Pekerjaan</td>
                        <td className="py-1">: {pasien?.pekerjaan || 'Swasta'}</td>
                    </tr> */}
                </tbody>
            </table>

            <p className="mb-4 text-sm">Berdasarkan pemeriksaan kesehatan yang telah dilakukan dan catatan rekam medis yang ada, dengan ini kami menerangkan bahwa:</p>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">RIWAYAT KESEHATAN</h4>
                <div className="text-sm border border-black p-3">
                    {riwayat && riwayat.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {riwayat.map((r, i) => (
                                <li key={i} className="mb-1">
                                    Tanggal: {new Date(r.created_at).toLocaleDateString('id-ID')} -
                                    Keluhan: {r.keluhan} -
                                    Diagnosis: {r.penyakit} -
                                    Catatan: {r.catatan || 'Tidak ada catatan khusus'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Tidak ada riwayat penyakit yang tercatat atau pasien dalam keadaan sehat.</p>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">JADWAL KUNJUNGAN/KONTROL</h4>
                <div className="text-sm border border-black p-3">
                    {kunjungan && kunjungan.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {kunjungan.map((k, i) => (
                                <li key={i} className="mb-1">
                                    Tanggal: {new Date(k.tanggal_kunjungan).toLocaleDateString('id-ID')} -
                                    Waktu: {k.waktu} -
                                    Keterangan: {k.keterangan}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Tidak ada jadwal kunjungan yang tercatat.</p>
                    )}
                </div>
            </div>
            <p className="mb-6 text-sm">Demikian surat keterangan kesehatan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
            <div class="page-break">
                <div className="flex justify-end mt-5">
                    <div className="text-sm">
                        <p>Kota Sehat, {new Date().toLocaleDateString('id-ID')}</p>
                        <p className="font-semibold">Dokter Pemeriksa</p>
                        <div className="h-16"></div>
                        <p className="font-semibold underline">(......................................)</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="border-t border-black pt-2">
                        <p className="text-xs">Surat keterangan ini berlaku selama 3 (tiga) bulan sejak tanggal diterbitkan</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthReportTemplate;