import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import Swal from "sweetalert2";
const TabelJadwalKunjungan = () => {
  const [jadwalList, setJadwalList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null, action: null });
  const fetchJadwal = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `https://hospital-be-chi.vercel.app/api/pasien/jadwal-kunjungan?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setJadwalList(data.data.data);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        console.error("Gagal memuat data jadwal:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [page]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = getToken();
      const response = await fetch(
        `https://hospital-be-chi.vercel.app/api/pasien/jadwal-kunjungan/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Jadwal kunjungan berhasil diperbarui!",
          confirmButtonColor: "#10B981",
        });
        fetchJadwal(); // refresh data
        closeModal(); // tutup modal setelah sukses
      } else {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Jadwal kunjungan gagal diperbarui!",
          confirmButtonColor: "#EF4444",
        });
        console.error("Gagal menyimpan perubahan:", result.message);
      }
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      alert("Gagal memperbarui status: " + error.message);
    }
  };

  // Fungsi-fungsi untuk modal
  const openModal = (id, action) => {
    setModal({ open: true, id, action });
  };

  const closeModal = () => {
    setModal({ open: false, id: null, action: null });
  };

  const confirmAction = () => {
    handleStatusUpdate(modal.id, modal.action);
  };

  const renderAksi = (status, id) => {
    const finalized = ["confirmed", "canceled", "done"];
    if (finalized.includes(status)) {
      return <span className="text-gray-400 italic">-</span>;
    }

    return (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => openModal(id, "confirmed")}
          className="bg-green-500 text-white text-sm px-3 py-1 rounded-md hover:bg-green-600 transition-colors shadow-sm"
        >
          Konfirmasi
        </button>
        <button
          onClick={() => openModal(id, "canceled")}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600 transition-colors shadow-sm"
        >
          Batalkan
        </button>
      </div>
    );
  };

  // Format tanggal menjadi format Indonesia
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Status badge dengan warna yang sesuai
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, statusText;

    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        statusText = "Menunggu";
        break;
      case "confirmed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        statusText = "Dikonfirmasi";
        break;
      case "canceled":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        statusText = "Dibatalkan";
        break;
      case "done":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        statusText = "Selesai";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        statusText = status;
    }

    return (
      <span
        className={`px-3 py-1 ${bgColor} ${textColor} rounded-full text-xs font-medium`}
      >
        {statusText}
      </span>
    );
  };

  return (
    <div className="p-6 bg-green-50 rounded-xl">
      <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
        <div className="flex items-center mb-6">
          <div className="h-10 w-1 bg-green-500 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-green-800">
            Daftar Jadwal Kunjungan
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex space-x-2">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
            <span className="ml-3 text-green-700">Memuat data jadwal...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider w-24">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                    Keluhan
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {jadwalList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(item.tanggal_kunjungan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.waktu}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-xs break-words">
                        {item.keluhan || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderAksi(item.status, item.id)}
                    </td>
                  </tr>
                ))}

                {jadwalList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg
                          className="w-12 h-12 text-green-200 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="font-medium">
                          Tidak ada jadwal kunjungan tersedia
                        </p>
                        <p className="text-sm mt-1">
                          Jadwal kunjungan yang telah dibuat akan muncul di sini
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination dengan nuansa hijau */}
        {!loading && totalPages > 0 && (
          <div className="flex justify-between items-center mt-6 px-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center px-4 py-2 bg-white border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Sebelumnya
            </button>

            <div className="flex items-center">
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                Halaman {page} dari {totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center px-4 py-2 bg-white border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Konfirmasi */}
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {modal.action === "confirmed"
                  ? "Konfirmasi Jadwal?"
                  : "Batalkan Jadwal?"}
              </h3>
              <p className="text-gray-600 mb-6">
                {modal.action === "confirmed"
                  ? "Apakah Anda yakin ingin mengkonfirmasi jadwal kunjungan ini? Tindakan ini akan memberi tahu admin bahwa jadwal telah disetujui."
                  : "Apakah Anda yakin ingin membatalkan jadwal kunjungan ini? Tindakan ini tidak bisa dibatalkan dan admin akan diberi tahu bahwa jadwal dibatalkan."}
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
                  className={`px-4 py-2 rounded-md text-sm text-white ${
                    modal.action === "confirmed"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabelJadwalKunjungan;
