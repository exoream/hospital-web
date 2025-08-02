import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { formatTimeAgo } from "../../utils/notifUtils";
export default function NotePasien() {
    const [riwayatList, setRiwayatList] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRiwayat = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const response = await fetch(
                  `https://hospital-be-chi.vercel.app/api/pasien/riwayat?page=${page}&limit=${limit}&search=${encodeURIComponent(
                    searchTerm
                  )}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Gagal memuat riwayat");
                }

                setRiwayatList(result.data.data);
                setTotalPages(result.data.pagination.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRiwayat();
    }, [page, limit, searchTerm]);

    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    // Format tanggal menjadi lebih mudah dibaca
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Riwayat Konsultasi Medis</h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {riwayatList.length} Riwayat Ditemukan
                </div>
            </div>

            {/* 🔍 Input Search SELALU tampil */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Cari berdasarkan keluhan, catatan, atau hasil pemeriksaan..."
                    className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-gray-600 font-medium">Memuat riwayat medis...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Terjadi Kesalahan</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {riwayatList.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Riwayat</h3>
                    <p className="text-gray-500">Belum ada riwayat konsultasi ditemukan.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {riwayatList.map((item) => (
                            <div
                                key={item.riwayat_id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                {/* Header Card */}
                                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${item.catatan_id ? 'bg-green-500 shadow-sm' : 'bg-amber-500 shadow-sm'}`}></div>
                                            <span className={`font-semibold ${item.catatan_id ? 'text-green-700' : 'text-amber-700'}`}>
                                                {item.catatan_id ? 'Konsultasi Selesai' : 'Menunggu Konsultasi'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                                            {formatDate(item.riwayat_created_at)}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-5">
                                    {/* Keluhan */}
                                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-blue-800">Keluhan Pasien</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed ml-11">{item.keluhan}</p>
                                    </div>

                                    {/* Catatan */}
                                    <div className={`rounded-lg p-4 border-l-4 ${item.catatan ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300'}`}>
                                        <div className="flex items-center mb-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.catatan ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                <svg className={`w-4 h-4 ${item.catatan ? 'text-green-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className={`font-semibold ${item.catatan ? 'text-green-800' : 'text-gray-700'}`}>
                                                Catatan Medis
                                            </h3>
                                        </div>

                                        {item.catatan ? (
                                            <div className="ml-11">
                                                <p className="text-gray-700 leading-relaxed">{item.catatan}</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center ml-11 text-amber-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm italic">Menunggu hasil pemeriksaan dokter...</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Jadwal Selesai */}
                                    {item.tanggal_kunjungan && item.waktu && (
                                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-semibold text-blue-800">Informasi Kunjungan</h3>
                                            </div>
                                            <div className="ml-11 space-y-2">
                                                <div className="flex items-center text-gray-700">
                                                    <span className="font-medium w-32">Tanggal:</span>
                                                    <span>{formatDate(item.tanggal_kunjungan)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <span className="font-medium w-32">Waktu:</span>
                                                    <span>{item.waktu}</span>
                                                </div>
                                                {item.jadwal_keterangan && (
                                                    <div className="flex text-gray-700 mt-1">
                                                        <span className="font-medium w-32 pt-1">Hasil Pemeriksaan:</span>
                                                        <div className="flex-1 break-words whitespace-pre-line">{item.jadwal_keterangan}</div>
                                                    </div>
                                                )}
                                                {item.jadwal_updated_at && (
                                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                                                        Terakhir diperbarui: {formatDate(item.jadwal_updated_at)} {formatTimeAgo(item.jadwal_updated_at)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePrevious}
                            disabled={page === 1}
                            className="px-6 py-2 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Sebelumnya
                        </button>

                        <div className="flex items-center space-x-2">
                            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                Halaman {page} dari {totalPages}
                            </span>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={page === totalPages}
                            className="px-6 py-2 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Selanjutnya
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}