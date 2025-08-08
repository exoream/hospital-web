// File: pages/ReportPage.jsx

import { useState, useEffect } from "react";
import { getToken } from "../../../utils/auth";
import HealthReportTemplate from "../../templates/HealthReportTemplate";
import AnnualReportTemplate from "../../templates/AnnualReportTemplate";
import MonthlyReportTemplate from "../../templates/MonthlyReportTemplate";

const ReportPage = () => {
  const [mode, setMode] = useState(""); // 'individual' | 'annual' |  'monthly'
  const [pasienList, setPasienList] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (mode === "individual") {
      const fetchPasien = async () => {
        try {
          const token = await getToken();
          const res = await fetch(
            "https://hospital-be-chi.vercel.app/api/admin/all-pasien",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();

          const list = Array.isArray(data.data?.data)
            ? data.data.data.map((p) => ({
                id: p.id,
                nama_lengkap: p.nama_lengkap || "Tidak diketahui",
              }))
            : [];

          console.log("Pasien list:", list);
          setPasienList(list);
        } catch (err) {
          console.error("Gagal mengambil data pasien:", err);
        }
      };

      fetchPasien();
    }
  }, [mode]);

  const fetchReport = async () => {
    try {
      const token = await getToken();
      if (mode === "individual") {
        const res = await fetch(
          `https://hospital-be-chi.vercel.app/api/admin/per-pasien/${selectedPasien}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success && data.data) {
          console.log(data);
          setReport(data.data);
          console.log("data:", report);
        } else {
          console.warn("Data kosong atau tidak valid");
          setReport(null);
        }
      } else if (mode === "annual") {
        const res = await fetch(
          `https://hospital-be-chi.vercel.app/api/admin/tahunan/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success && data.data) {
          console.log(data.data);
          setReport(data.data);
          console.log("data:", report);
        } else {
          console.warn("Data kosong atau tidak valid");
          setReport(null);
        }
      } else if (mode === "monthly") {
        const res = await fetch(
          `https://hospital-be-chi.vercel.app/api/admin/bulanan/${selectedYear}/${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success && data.data) {
          setReport(data.data);
        } else {
          console.warn("Data kosong atau tidak valid");
          setReport(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (report !== null) {
      console.log("Report berhasil di-set:", report);
    }
  }, [report]);

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="mb-6 no-print">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Laporan Kesehatan
        </h2>
        <p className="text-gray-500 text-sm">
          Kelola laporan kesehatan pasien dan data tahunan
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 no-print">
        <button
          onClick={() => {
            setMode("individual");
            setReport(null);
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            mode === "individual"
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="font-medium mb-1">Laporan Individual</div>
          <div className="text-sm text-gray-500">
            Lihat riwayat kesehatan per pasien
          </div>
        </button>

        <button
          onClick={() => {
            setMode("monthly");
            setReport(null);
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            mode === "monthly"
              ? "bg-yellow-50 border-yellow-200 text-yellow-700"
              : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="font-medium mb-1">Laporan Bulanan</div>
          <div className="text-sm text-gray-500">
            Lihat ringkasan data bulanan
          </div>
        </button>

        <button
          onClick={() => {
            setMode("annual");
            setReport(null);
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            mode === "annual"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="font-medium mb-1">Laporan Tahunan</div>
          <div className="text-sm text-gray-500">
            Lihat ringkasan data tahunan
          </div>
        </button>
      </div>

      {/* Individual Report Form */}
      {mode === "individual" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 no-print">
          <h3 className="font-medium text-gray-700 mb-4">Laporan Individual</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Pasien
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedPasien}
                onChange={(e) => setSelectedPasien(e.target.value)}
              >
                <option value="">-- Pilih Pasien --</option>
                {pasienList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchReport}
              disabled={!selectedPasien}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPasien
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Tampilkan Laporan
            </button>
          </div>
        </div>
      )}

      {mode === "monthly" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 no-print">
          <h3 className="font-medium text-gray-700 mb-4">Laporan Bulanan</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tahun
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                placeholder="Masukkan tahun"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Bulan
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchReport}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Tampilkan Laporan
            </button>
          </div>
        </div>
      )}

      {/* Annual Report Form */}
      {mode === "annual" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 no-print">
          <h3 className="font-medium text-gray-700 mb-4">Laporan Tahunan</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tahun
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                placeholder="Masukkan tahun"
              />
            </div>

            <button
              onClick={fetchReport}
              disabled={!selectedYear}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedYear
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Tampilkan Laporan
            </button>
          </div>
        </div>
      )}

      {/* Report Display */}
      {report && mode === "individual" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 print-plain">
          <div className="p-6 border-b border-gray-100 no-print">
            <h3 className="font-medium text-gray-700">
              Laporan Kesehatan Individual
            </h3>
          </div>
          {/* <div className="p-6 a4-container" id="report-content"> */}
          <div className="a4-container">
            <HealthReportTemplate
              pasien={report.pasien}
              riwayat={report.riwayat}
              kunjungan={report.kunjungan}
            />
          </div>
          <div className="m-4 no-print">
            <button
              // onClick={() => handleDownloadPDF('report-content', `Laporan-${report?.pasien?.nama_lengkap || 'pasien'}.pdf`)}
              onClick={() => window.print()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 no-print"
            >
              Simpan sebagai PDF
            </button>
          </div>
        </div>
      )}

      {report && mode === "monthly" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">
              Laporan Bulanan{" "}
              {new Date(0, selectedMonth - 1).toLocaleString("id-ID", {
                month: "long",
              })}{" "}
              {selectedYear}
            </h3>
          </div>
          <div className="a4-container">
            <MonthlyReportTemplate report={report} />
          </div>
          <div className="m-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 no-print"
            >
              Simpan sebagai PDF
            </button>
          </div>
        </div>
      )}

      {report && mode === "annual" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">
              Laporan Tahunan {selectedYear}
            </h3>
          </div>
          {/* <div className="p-6 a4-container" id="report-content"> */}
          <div className=" a4-container">
            <AnnualReportTemplate report={report} />
          </div>
          <div className="m-4">
            <button
              // onClick={() => handleDownloadPDF('report-content', `Laporan-Tahunan-${selectedYear}.pdf`)}
              onClick={() => window.print()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 no-print"
            >
              Simpan sebagai PDF
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!mode && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 .no-print">
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="text-center">
              <div className="text-gray-400 mb-2">Pilih Jenis Laporan</div>
              <div className="text-sm text-gray-500">
                Pilih laporan individual atau tahunan untuk memulai
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
