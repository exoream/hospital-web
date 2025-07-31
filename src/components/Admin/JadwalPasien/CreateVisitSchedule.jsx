import { useState, useEffect } from "react";
import { getToken } from "../../../utils/auth";
import Swal from 'sweetalert2';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];

export default function CreateVisitSchedule() {
    const [formData, setFormData] = useState({
        pasien_id: "",
        tanggal: "",
        jam: "",
        id_riwayat: "",
    });
    const [pasienList, setPasienList] = useState([]);
    const pasienUnik = pasienList.filter(
        (pasien, index, self) =>
            index === self.findIndex(p => p.pasien_id === pasien.pasien_id)
    );
    const keluhanList = pasienList.filter(p => String(p.pasien_id) === String(formData.pasien_id));


    // Fetch data pasien saat komponen dimuat
    useEffect(() => {
        const fetchPasien = async () => {
            try {

                const token = await getToken();
                const response = await fetch("http://localhost:3000/api/admin/pasien-konsultasi", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    console.log(result.data);
                    setPasienList(result.data);
                } else {
                    console.error("Gagal mengambil data pasien:", result.message);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data pasien:", error);
            }
        };

        fetchPasien();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            console.log(formData);
            // Kirim data jadwal kunjungan ke API
            const response = await fetch("http://localhost:3000/api/admin/jadwal-kunjungan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pasien_id: Number(formData.pasien_id),
                    tanggal_kunjungan: formData.tanggal,
                    waktu: formData.jam,
                    riwayat_id: Number(formData.id_riwayat),
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Jadwal kunjungan berhasil dibuat!',
                    confirmButtonColor: '#10B981'
                });

                setFormData({
                    pasien_id: "",
                    tanggal: "",
                    jam: "",
                    keterangan: "",
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message || 'Gagal membuat Jadwal.',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat membuat jadwal kunjungan:", error);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
            <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Buat Jadwal Kunjungan</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dropdown Nama Pasien */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasien</label>
                        <select
                            name="pasien_id"
                            value={formData.pasien_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                            <option value="">Pilih Nama Pasien</option>
                            {pasienUnik.map((pasien) => (
                                <option key={pasien.pasien_id} value={pasien.pasien_id}>
                                    {pasien.nama_lengkap}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* List keluhan berdasarkan pasien */}
                    {formData.pasien_id && keluhanList.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Pilih Keluhan</label>
                            <select
                                name="id_riwayat"
                                value={formData.id_riwayat}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            >
                                <option value="">Pilih keluhan</option>
                                {keluhanList.map((item) => (
                                    <option key={item.riwayat_id} value={item.riwayat_id}>
                                        {item.keluhan} — {new Date(item.riwayat_created_at).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tanggal & Jam Kunjungan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kunjungan</label>
                            <input
                                type="date"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                                min={minDate} // ⛔ Disable tanggal sebelum besok
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kunjungan</label>
                            <input
                                type="time"
                                name="jam"
                                value={formData.jam}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Input Keterangan */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            placeholder="Masukkan keterangan"
                        ></textarea>
                    </div> */}

                    {/* Tombol Submit */}
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow"
                        >
                            Simpan Jadwal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
