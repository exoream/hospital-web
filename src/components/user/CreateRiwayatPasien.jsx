import React, { useState } from "react";
import { getToken } from "../../utils/auth";
import Swal from 'sweetalert2';

const CreateRiwayatPasien = () => {
    const [formData, setFormData] = useState({
        keluhan: "",
        alamat: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();

            const response = await fetch(
              "https://hospital-be-chi.vercel.app/api/pasien/riwayat",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
              }
            );

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data berhasil disimpan!',
                    confirmButtonColor: '#10B981'
                });
                console.log("Respon:", data);
                setFormData({ keluhan: "", alamat: "" }); // Reset form
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal menyimpan data.',
                    confirmButtonColor: '#EF4444'
                });
                console.error("Error dari server:", data);
            }
        } catch (error) {
            alert("Terjadi kesalahan saat mengirim data.");
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
            <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Form Pendafataran Konsultasi
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Keluhan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keluhan
                        </label>
                        <textarea
                            name="keluhan"
                            value={formData.keluhan}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Masukkan keluhan pasien"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        ></textarea>
                    </div>

                    {/* Input alamat */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan alamat lengkap"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg text-white text-sm font-medium shadow ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRiwayatPasien;
