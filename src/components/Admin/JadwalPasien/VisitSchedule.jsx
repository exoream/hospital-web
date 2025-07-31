import { useEffect, useState } from "react";
import { getToken } from "../../../utils/auth";
import Swal from 'sweetalert2';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];

export default function JadwalKunjungan({ activeMenu }) {
    const [jadwalList, setJadwalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nama: "",
        tanggal: "",
        jam: "",
    });
    const [modal, setModal] = useState({ open: false, action: null });
    const [isConfirm, setIsConfirm] = useState(false);
    const [confirmKeterangan, setConfirmKeterangan] = useState({
        id: null,
        keterangan: "",
    });

    // Fetch jadwal data with pagination
    const fetchJadwal = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(
                `http://localhost:3000/api/admin/jadwal-kunjungan?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (result.success) {
                const mappedData = result.data.data.map((item) => ({
                    id: item.id,
                    nama: item.nama_lengkap || "Tidak ada nama",
                    keluhan_riwayat: item.keluhan_riwayat,
                    status: item.status,
                    tanggal: item.tanggal_kunjungan.split("T")[0],
                    jam: item.waktu.slice(0, 5),
                }));
                console.log(mappedData);
                setJadwalList(mappedData);
                if (result.data.pagination) {
                    setTotalPages(result.data.pagination.totalPages);
                }
            } else {
                console.error("Gagal memuat data:", result.message);
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Call fetchJadwal on component mount or page change
    useEffect(() => {
        fetchJadwal();
    }, [page]);

    const handleEdit = (id) => {
        const pasien = jadwalList.find((item) => item.id === id);
        setFormData({ ...pasien });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ id: null, nama: "", tanggal: "", jam: "" });
    };

    const handleCancelConfirm = () => {
        setIsConfirm(false);
        setConfirmKeterangan({ id: null, keterangan: "" });
    };


    const handleSave = async () => {
        try {
            const token = await getToken();
            console.log({
                tanggal_kunjungan: formData.tanggal,
                waktu: formData.jam,
                keterangan: formData.keterangan,
                status: null,
            });
            const response = await fetch(`http://localhost:3000/api/admin/jadwal-kunjungan/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tanggal_kunjungan: formData.tanggal,
                    waktu: formData.jam,
                    keterangan: formData.keterangan,
                    status: null,
                }),
            });

            const result = await response.json();

            if (result.success) {

                // const updatedData = jadwalList.map((item) =>
                //     item.id === formData.id ? { ...formData } : item
                // );
                // setJadwalList(updatedData);
                await fetchJadwal();
                setIsEditing(false);
                setFormData({ id: null, nama: "", keterangan: "", tanggal: "", jam: "" });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Jadwal kunjungan berhasil diupdate!',
                    confirmButtonColor: '#10B981'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: result.message || 'Gagal membuat Jadwal.',
                    confirmButtonColor: '#EF4444'
                });
                console.error("Gagal menyimpan perubahan:", result.message);
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat menyimpan perubahan:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to open the modal
    const openModal = (action) => {
        setModal({ open: true, action });
    };

    // Function to close the modal
    const closeModal = () => {
        setModal({ open: false, action: null });
    };

    const handleConfirm = (id) => {
        const pasien = jadwalList.find((item) => item.id === id);
        if (!pasien) return;

        // const now = new Date();
        // const kunjunganDateTime = new Date(`${pasien.tanggal}T${pasien.jam}`);

        // if (now < kunjunganDateTime) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Belum Saatnya',
        //         text: 'Kunjungan ini belum bisa dikonfirmasi karena belum waktunya.',
        //         confirmButtonColor: '#f59e0b',
        //     });
        //     return;
        // }
        setConfirmKeterangan({
            id: id,
            keterangan: "",
        });
        setIsConfirm(true);
    };

    // Function to confirm action
    const confirmAction = async () => {
        if (modal.action === "save") {
            await handleSave();
        } else if (modal.action === "confirm") {
            await handleSaveWithStatus("done", confirmKeterangan.keterangan, confirmKeterangan.id);
        }
        closeModal();
    };

    // New function to handle saving with a specific status
    const handleSaveWithStatus = async (status, keterangan, id) => {
        try {
            const token = await getToken();
            console.log(status, keterangan);
            const response = await fetch(`http://localhost:3000/api/admin/jadwal-kunjungan/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status,
                    keterangan: keterangan,
                }),
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Jadwal kunjungan berhasil diperbarui!',
                    confirmButtonColor: '#10B981'
                });
                await fetchJadwal();
                setIsConfirm(false);
                setConfirmKeterangan({ id: null, keterangan: "" });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: result.message || 'Gagal memperbarui jadwal',
                    confirmButtonColor: '#EF4444'
                });
                console.error("Gagal menyimpan perubahan:", result.message);
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat menyimpan perubahan:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{activeMenu}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">No</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Nama Pasien</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Keluhan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Tanggal Kunjungan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Jam Kunjungan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500 text-sm">Loading...</td>
                            </tr>
                        ) : jadwalList.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500 text-sm">Tidak ada data jadwal kunjungan.</td>
                            </tr>
                        ) : (
                            jadwalList.map((item, index) => (
                                <tr key={item.id} className="hover:bg-green-50">
                                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{item.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{item.keluhan_riwayat}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{item.tanggal}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{item.status}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{item.jam}</td>
                                    <td className="px-4 py-3">
                                        {item.status === "confirmed" ? (
                                            <button
                                                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg mr-2"
                                                onClick={() => handleConfirm(item.id)}
                                            >
                                                Done
                                            </button>
                                        ) : item.status === "done" || item.status === "canceled" ? (
                                            <span>
                                                -
                                            </span>
                                        ) : (
                                            <>
                                                <button
                                                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg mr-2"
                                                    onClick={() => handleEdit(item.id)}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 flex items-center bg-white border-2 border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Sebelumnya
                </button>
                <div className="px-4 py-1 bg-green-100 border border-green-300 rounded-full text-sm text-green-800 font-medium">
                    Halaman {page} dari {totalPages}
                </div>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 flex items-center bg-white border-2 border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Berikutnya
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Jadwal Kunjungan</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kunjungan</label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={handleInputChange}
                                    min={minDate}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kunjungan</label>
                                <input
                                    type="time"
                                    name="jam"
                                    value={formData.jam}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => openModal("save")}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirm && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-10">
                    <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            Konfirmasi Kunjungan Selesai
                        </h3>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Laporan Hasil Kunjungan
                        </label>
                        <textarea
                            rows={4}
                            value={confirmKeterangan.keterangan}
                            onChange={(e) =>
                                setConfirmKeterangan({ ...confirmKeterangan, keterangan: e.target.value })
                            }
                            placeholder="Contoh: Pasien sudah selesai dikunjungi dengan hasil..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            required></textarea>

                        <div className="flex justify-end mt-6 space-x-2">
                            <button
                                onClick={() => {
                                    const trimmed = confirmKeterangan.keterangan.trim();
                                    if (trimmed.length <= 19) {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Keterangan terlalu pendek',
                                            text: 'Keterangan wajib diisi minimal 20 karakter.',
                                            confirmButtonColor: '#16a34a', // warna hijau (Tailwind green-600)
                                        });
                                        return;
                                    }
                                    openModal("confirm")
                                }}
                                className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Simpan
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                className="px-5 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {modal.open && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">
                            {modal.action === "save" ? "Konfirmasi Simpan?" : "Konfirmasi Tindakan?"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {modal.action === "save"
                                ? "Apakah Anda yakin ingin menyimpan perubahan ini?"
                                : "Apakah Anda yakin ingin melanjutkan tindakan ini?"}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAction}
                                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                            >
                                Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
