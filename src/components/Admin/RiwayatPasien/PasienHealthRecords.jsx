import { useState, useEffect } from 'react';
import { getToken } from "../../../utils/auth";

export default function PasienHealthRecords({ onSelectDetail, activeMenu }) {
    const [search, setSearch] = useState('');
    const [pasienList, setPasienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPasien = async () => {
            try {
                setLoading(true);
                const token = getToken();
                const response = await fetch(`http://localhost:3000/api/admin/pasien?page=${page}&limit=${limit}&search=${search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    setPasienList(result.data.data);
                    setTotalPages(result.data.pagination.totalPages);
                } else {
                    alert('Gagal memuat data pasien.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Terjadi kesalahan saat mengambil data pasien.');
            } finally {
                setLoading(false);
            }
        };

        fetchPasien();
    }, [page, limit, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4 border-b-2 border-green-200 pb-2 flex items-center">
                {activeMenu}
            </h2>


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
                            ) : (
                                pasienList.map((pasien, index) => (
                                    <tr key={pasien.id} className="hover:bg-green-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-700">{(page - 1) * limit + index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{pasien.nama_lengkap}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{pasien.nik}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                                                onClick={() => onSelectDetail(pasien.id)}
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination */}
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
        </div>
    );
}
