import { useEffect, useState } from 'react';
import { getToken } from "../../../utils/auth";
import Swal from 'sweetalert2';

export default function DataPatient({ onSelectDetail, activeMenu }) {
    const [pasienList, setPasienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPasien, setCurrentPasien] = useState(null);
    const [editedPasien, setEditedPasien] = useState({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Fetch pasien data with pagination
    const fetchPasien = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const res = await fetch(
                `http://localhost:3000/api/admin/pasien?page=${page}&limit=${limit}&search=${search}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (data.success) {
                // jika struktur: data.data.data
                const list = data.data.data || data.data;
                setPasienList(list);
                if (data.data.pagination) {
                    setTotalPages(data.data.pagination.totalPages);
                }
            } else {
                console.error('Gagal mengambil data pasien:', data.message);
            }
        } catch (err) {
            console.error('Error saat fetch data pasien:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // reset ke halaman 1 saat pencarian
    };

    useEffect(() => {
        fetchPasien();
    }, [page, limit, search]);

    const handleEditClick = (pasien) => {
        setCurrentPasien(pasien);
        // copy seluruh field, agar controlled inputs
        setEditedPasien({
            nama_lengkap: pasien.nama_lengkap,
            nik: pasien.nik,
            jenis_kelamin: pasien.jenis_kelamin,
            tanggal_lahir: pasien.tanggal_lahir?.split('T')[0] || '',
            alamat: pasien.alamat,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPasien(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPasien(prev => ({ ...prev, [name]: value }));
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleSaveChanges = async () => {
        if (!currentPasien) return;
        try {
            const token = getToken();
            const res = await fetch(
                `http://127.0.0.1:3000/api/admin/pasien/${currentPasien.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editedPasien),
                }
            );
            const result = await res.json();
            if (res.ok && result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Jadwal kunjungan berhasil diperbarui!',
                    confirmButtonColor: '#10B981'
                });
                closeModal();
                // refresh data
                setPage(1);
                fetchPasien();
            } else {
                console.error('Gagal mengubah data:', result.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Jadwal kunjungan gagal diperbarui!',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (err) {
            console.error('Error saat menyimpan perubahan:', err);
            alert('Terjadi kesalahan saat menyimpan data.');
        }
    };

    const confirmSaveChanges = () => {
        handleSaveChanges();
        closeConfirmModal();
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{activeMenu}</h2>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama pasien..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                />
            </div>

            <div className="bg-white rounded-xl shadow-md border-2 border-green-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Nama Lengkap</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">NIK</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Jenis Kelamin</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Tanggal Lahir</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Alamat</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="block text-sm">Memuat data pasien...</span>
                                    </td>
                                </tr>
                            ) : pasienList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="block text-sm">Tidak ada pasien ditemukan.</span>
                                    </td>
                                </tr>
                            ) : (pasienList.map((pasien, idx) => (
                                <tr key={pasien.id} className="hover:bg-green-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-700">{(page - 1) * limit + idx + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{pasien.nama_lengkap}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{pasien.nik}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{pasien.alamat}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button
                                            onClick={() => handleEditClick(pasien)}
                                            className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                                            onClick={() => onSelectDetail(pasien.id)}
                                        >
                                            Lihat Detail
                                        </button>
                                        {/* <button
                                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                                        >
                                            Hapus
                                        </button> */}
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination Controls */}
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

            {/* Modal Edit Pasien */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold mb-4">Edit Pasien</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    name="nama_lengkap"
                                    value={editedPasien.nama_lengkap}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                                <input
                                    name="nik"
                                    value={editedPasien.nik}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select
                                    name="jenis_kelamin"
                                    value={editedPasien.jenis_kelamin}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    name="tanggal_lahir"
                                    value={editedPasien.tanggal_lahir}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <input
                                    name="alamat"
                                    value={editedPasien.alamat}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={openConfirmModal}
                                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Konfirmasi Simpan?</h3>
                        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menyimpan perubahan ini?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmSaveChanges}
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
