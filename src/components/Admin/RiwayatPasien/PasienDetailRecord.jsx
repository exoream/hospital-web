import { useState, useEffect } from "react";
import { getToken } from "../../../utils/auth";
import Swal from "sweetalert2";

export default function PasienDetail({ id }) {
  const [pasien, setPasien] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");
  const [loadingCatatan, setLoadingCatatan] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        const resPasien = await fetch(
          `https://hospital-be-chi.vercel.app/api/admin/pasien/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataPasien = await resPasien.json();
        if (dataPasien.success) {
          setPasien(dataPasien.data);
        } else {
          console.error("Gagal mengambil data pasien:", dataPasien.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchRiwayat = async () => {
    try {
      const token = getToken();
      const resRiwayat = await fetch(
        `https://hospital-be-chi.vercel.app/api/admin/konsultasi-pasien/${id}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataRiwayat = await resRiwayat.json();

      console.log(dataRiwayat);
      if (dataRiwayat.success) {
        setRiwayat(dataRiwayat.data.data);
        const total = dataRiwayat.data.pagination.totalPages;
        setTotalPages(total > 0 ? total : 1);
      } else {
        setRiwayat([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching riwayat:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRiwayat();
    }
  }, [id, page]);

  const handleCatatanChange = (e) => {
    setCatatan(e.target.value);
  };

  const handleCreateCatatan = async () => {
    if (!catatan.trim()) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Catatan tidak boleh kosong",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    if (catatan.trim().length < 15) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Catatan minimal 15 karakter",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    setLoadingCatatan(true);

    try {
      const token = getToken();
      const response = await fetch(
        `http://127.0.0.1:3000/api/admin/notify-patient/${selectedRiwayat.riwayat_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ catatan }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Catatan berhasil dibuat!",
          confirmButtonColor: "#10B981",
        });
        setCatatan("");
        setIsModalOpen(false);
        fetchRiwayat(); // ⬅️ Tambahkan ini untuk refresh data riwayat
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message || "Gagal membuat catatan.",
          confirmButtonColor: "#EF4444", // warna merah seperti Tailwind bg-red-500
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error || "Terjadi kesalahan saat membuat catatan",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoadingCatatan(false);
    }
  };

  const openModal = (riwayatId) => {
    const riwayatItem = riwayat.find((r) => r.riwayat_id === riwayatId);
    setSelectedRiwayat(riwayatItem);
    setCatatan(riwayatItem.catatan || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCatatan("");
    setSelectedRiwayat(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Memuat data pasien...</div>
    );
  }

  if (!pasien) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Data pasien tidak ditemukan.
      </div>
    );
  }

  return (
    <>
      {/* Modal Loading */}
      {loadingCatatan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-700 text-sm">Menyimpan catatan...</p>
          </div>
        </div>
      )}

      <div className="p-6 bg-white min-h-screen">
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-200 pb-2">
            Detail Pasien
          </h2>

          {/* Card profil pasien yang diperbaiki */}
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
            <div className="flex flex-col md:flex-row">
              {/* Avatar/Icon Pasien */}
              <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Detail informasi pasien */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                    Nama Lengkap
                  </div>
                  <div className="text-gray-800 font-medium">
                    {pasien[0].nama_lengkap}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                    NIK
                  </div>
                  <div className="text-gray-800 font-medium">
                    {pasien[0].nik}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                    Jenis Kelamin
                  </div>
                  <div className="text-gray-800 font-medium flex items-center">
                    {pasien[0].jenis_kelamin === "L" ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Laki-laki
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1 text-pink-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Perempuan
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                    Tanggal Lahir
                  </div>
                  <div className="text-gray-800 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-600"
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
                    {new Date(pasien[0].tanggal_lahir).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100 md:col-span-2">
                  <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                    Alamat
                  </div>
                  <div className="text-gray-800 font-medium flex">
                    <svg
                      className="w-4 h-4 mr-1 text-green-600 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{pasien[0].alamat}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-green-800 mb-4 border-b-2 border-green-200 pb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Daftar Konsultasi
          </h3>
          <div className="bg-white rounded-xl shadow-md border-2 border-green-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-green-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Keluhan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-100">
                  {riwayat.length > 0 ? (
                    riwayat.map((r, idx) => (
                      <tr
                        key={r.riwayat_id}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {r.alamat}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {r.keluhan}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(r.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openModal(r.riwayat_id)}
                            className={`px-3 py-1 text-sm ${
                              r.catatan
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 ${
                              r.catatan
                                ? "focus:ring-green-500"
                                : "focus:ring-yellow-400"
                            }`}
                          >
                            {r.catatan ? "Lihat Catatan" : "Buat Catatan"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500"
                      >
                        <svg
                          className="w-12 h-12 mx-auto text-gray-300 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="block text-sm">
                          Belum ada riwayat kesehatan.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 flex items-center bg-white border-2 border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div className="px-4 py-1 bg-green-100 border border-green-300 rounded-full text-sm text-green-800 font-medium">
              Halaman {page} dari {totalPages}
            </div>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 flex items-center bg-white border-2 border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
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
        </div>

        {/* Modal dengan desain yang ditingkatkan */}
        {isModalOpen && selectedRiwayat && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 border-b-2 border-green-100 pb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {selectedRiwayat.catatan ? "Lihat Catatan" : "Buat Catatan"}
              </h3>

              <div className="space-y-3 mb-4 bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="flex">
                  <span className="text-xs text-green-600 uppercase font-semibold w-24">
                    Keluhan:
                  </span>
                  <span className="text-gray-800">
                    {selectedRiwayat.keluhan}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-xs text-green-600 uppercase font-semibold w-24">
                    Tanggal:
                  </span>
                  <span className="text-gray-800">
                    {new Date(selectedRiwayat.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              <label className="block text-sm font-medium text-green-700 mb-2">
                Catatan Medis:
              </label>
              <textarea
                value={catatan}
                onChange={handleCatatanChange}
                className={`w-full p-3 border-2 ${
                  selectedRiwayat.catatan
                    ? "border-green-200 bg-green-50"
                    : "border-green-300 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400"
                } rounded-lg text-gray-700 transition-colors ${
                  selectedRiwayat.catatan ? "" : "focus:outline-none"
                }`}
                rows={4}
                disabled={!!selectedRiwayat.catatan}
                placeholder={
                  selectedRiwayat.catatan
                    ? ""
                    : "Masukkan catatan medis di sini..."
                }
              />

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Tutup
                </button>

                {!selectedRiwayat.catatan && (
                  <button
                    onClick={handleCreateCatatan}
                    disabled={loadingCatatan}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingCatatan ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan Catatan"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
