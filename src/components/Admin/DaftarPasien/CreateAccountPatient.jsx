import { useState } from "react";
import { getToken } from "../../../utils/auth"
import Swal from 'sweetalert2';

export default function CreateAccountPatient({ activeMenu }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        nik: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        alamat: "",
        nama_lengkap: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "nik") {
            // Hanya izinkan angka dan batasi 16 digit
            const numericValue = value.replace(/\D/g, "").slice(0, 16);
            setFormData((prev) => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi sederhana
        console.log("Form data sebelum validasi:", formData);

        const requiredFields = ["username", "password", "nik", "tanggal_lahir", "jenis_kelamin", "alamat"];

        // Validasi: jika ada field yang kosong, tampilkan alert
        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === "") {
                alert(`Field ${field} wajib diisi.`);
                return;
            }
        }



        try {
            setIsSubmitting(true);
            const token = getToken();

            const response = await fetch("http://localhost:3000/api/admin/pasien", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Akun pasien berhasil dibuat.',
                    confirmButtonColor: '#10B981'
                });
                // Reset form
                setFormData({
                    username: "",
                    password: "",
                    nik: "",
                    tanggal_lahir: "",
                    jenis_kelamin: "",
                    alamat: "",
                    nama_lengkap: "",
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: data.message || 'Gagal membuat Pasien.',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menyimpan.");

            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{activeMenu}</h2>
                <div className="my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Buat Akun Pasien</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Nama Lengkap"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="NIK"
                            name="nik"
                            type="text"
                            inputMode="numeric"
                            maxLength={16}
                            value={formData.nik}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Tanggal Lahir"
                            type="date"
                            name="tanggal_lahir"
                            max={today}
                            value={formData.tanggal_lahir}
                            onChange={handleChange}
                            required
                        />
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
