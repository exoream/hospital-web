import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/SideBar";
import {
  Calendar,
  UserCircle,
  Search,
  Bell,
  Users,
  Activity,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  CheckCircle,
  PieChart,
  LineChart,
  LogOut,
} from "lucide-react";
import CreateRiwayatPasien from "../../components/user/CreateRiwayatPasien";
import NotePasien from "../../components/user/NotePasien";
import ScheduleTable from "../../components/user/ScheduleTable";
import { getUserRole, logout, getToken, getUserName } from "../../utils/auth";
import Cookies from "js-cookie";
import { formatTimeAgo } from "../../utils/notifUtils";

// Komponen Header
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]);
  const username = getUserName();
  const dropdownRef = useRef();
  const notifRef = useRef();
  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifikasi = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        "https://hospital-be-chi.vercel.app/api/pasien/notifikasi",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.success && json.data) {
        setNotifikasi(json.data.notifikasi || []);
      }
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    }
  };

  useEffect(() => {
    fetchNotifikasi();
  }, []);

  const markAllNotifikasiAsRead = async () => {
    try {
      const token = await getToken();
      await fetch(
        "https://hospital-be-chi.vercel.app/api/pasien/notifikasi/baca",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi sebagai dibaca:", err);
    }
  };

  const unreadCount = notifikasi.filter((n) => n.is_read === 0).length;

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full h-10 w-10 flex items-center justify-center shadow-md">
            <img
              src="/assets/LOGO_PUSKESMAS_CAMBA.png"
              alt="Logo Kanan"
              class="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            Puskesmas Camba
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifikasi */}
          <div className="relative" ref={notifRef}>
            <Bell
              className="h-5 w-5 text-gray-500 cursor-pointer hover:text-orange-500 transition-colors"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
                markAllNotifikasiAsRead();
              }}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* Dropdown Notifikasi */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="px-4 py-2 font-semibold text-sm border-b">
                  Notifikasi
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifikasi.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      Tidak ada notifikasi.
                    </div>
                  ) : (
                    notifikasi.map((item) => {
                      // Konfigurasi style berdasarkan status
                      let borderColor = "border-gray-200";
                      let bgColor = "bg-white";
                      let iconBg = "bg-gray-100";
                      let iconText = "text-gray-500";
                      let badgeStyle = "bg-gray-400 text-white";
                      let statusText = item.status;

                      if (item.status === "done") {
                        borderColor = "border-green-500";
                        bgColor = "bg-green-50";
                        iconBg = "bg-green-100";
                        iconText = "text-green-600";
                        badgeStyle = "bg-green-500 text-white";
                        statusText = "Selesai";
                      } else if (item.status === "pending") {
                        borderColor = "border-yellow-500";
                        bgColor = "bg-yellow-50";
                        iconBg = "bg-yellow-100";
                        iconText = "text-yellow-600";
                        badgeStyle = "bg-yellow-400 text-black";
                        statusText = "Menunggu";
                      } else if (item.status === "rescheduled") {
                        borderColor = "border-yellow-600";
                        bgColor = "bg-yellow-100";
                        iconBg = "bg-yellow-200";
                        iconText = "text-yellow-700";
                        badgeStyle = "bg-yellow-600 text-white";
                        statusText = "Dijadwal Ulang";
                      } else if (item.status === "canceled") {
                        borderColor = "border-red-500";
                        bgColor = "bg-red-50";
                        iconBg = "bg-red-100";
                        iconText = "text-red-600";
                        badgeStyle = "bg-red-500 text-white";
                        statusText = "Dibatalkan";
                      }

                      return (
                        <div
                          key={item.id}
                          className={`px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-l-4 ${borderColor} ${bgColor}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}
                            >
                              <Bell className={`w-4 h-4 ${iconText}`} />
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                Jadwal kunjungan: {item.tanggal_kunjungan} pukul{" "}
                                {item.waktu}
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                Keluhan: {item.keluhan}
                              </div>

                              <div className="text-xs mt-1 flex items-center gap-2">
                                <span className="text-gray-500">Status:</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}
                                >
                                  {statusText}
                                </span>
                              </div>

                              <div className="text-gray-400 text-xs mt-1">
                                {formatTimeAgo(item.created_at) ||
                                  new Date(item.created_at).toLocaleString(
                                    "id-ID"
                                  )}
                              </div>
                            </div>

                            {item.is_read === 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200 cursor-pointer hover:bg-gray-100"
            >
              <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                <UserCircle className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen StatCard
const StatCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
      <div className={`rounded-full p-3 mr-4 ${color}`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-xl font-bold text-gray-800">{value}</span>
          {trend && (
            <span
              className={`ml-2 text-xs font-medium ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Content = ({ activeMenu, setActiveMenu }) => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifikasi = async (page, limit, tanggalFilter) => {
    try {
      const token = getToken();
      const query = new URLSearchParams({
        page,
        limit,
        ...(tanggalFilter ? { tanggal: tanggalFilter } : {}),
      });
      const res = await fetch(
        `https://hospital-be-chi.vercel.app/api/pasien/all-notifikasi?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        console.log(result);
        setNotifikasi(result.data.notifikasi || []);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `https://hospital-be-chi.vercel.app/api/pasien/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    if (activeMenu === "Dashboard") {
      fetchNotifikasi(page, limit, tanggalFilter);
      fetchDashboardData();
    }
  }, [activeMenu, page, limit, tanggalFilter]);

  // Dashboard default
  if (activeMenu === "Dashboard") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Dashboard</h2>
          <p className="text-gray-500 text-sm">
            Selamat datang di Sistem Informasi Puskesmas Camba
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<PieChart className="h-5 w-5 text-purple-500" />}
            title="Total Riwayat"
            value={dashboardData?.total_riwayat ?? "-"}
            color="bg-purple-50"
          />
          <StatCard
            icon={<ClipboardList className="h-5 w-5 text-blue-500" />}
            title="Total Catatan Medis"
            value={dashboardData?.total_catatan ?? "-"}
            color="bg-blue-50"
          />
          <StatCard
            icon={<CalendarCheck className="h-5 w-5 text-green-500" />}
            title="Kunjungan Hari Ini"
            value={dashboardData?.kunjungan_hari_ini ?? "-"}
            color="bg-green-50"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
            title="Kunjungan Selesai"
            value={dashboardData?.total_kunjungan_selesai ?? "-"}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5 text-yellow-600" />}
            title="Jadwal Mendatang"
            value={dashboardData?.jadwal_mendatang ?? "-"}
            color="bg-yellow-50"
          />
        </div>

        {/* Notifications Section - Fixed Height */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Notifikasi Terbaru
            </h3>
            <div className="mb-4">
              <input
                type="date"
                placeholder="Cari berdasarkan nama pasien..."
                value={tanggalFilter}
                onChange={(e) => {
                  setTanggalFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
              />
            </div>
          </div>

          {notifikasi && notifikasi.length > 0 ? (
            <div className="space-y-3">
              {notifikasi.map((item) => (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-l-blue-500 hover:bg-gray-100 transition-colors">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                        ${
                                          item.status === "canceled"
                                            ? "bg-red-100"
                                            : item.status === "done"
                                            ? "bg-green-100"
                                            : item.status === "rescheduled"
                                            ? "bg-yellow-100"
                                            : "bg-blue-100"
                                        }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        item.status === "canceled"
                          ? "text-red-600"
                          : item.status === "done"
                          ? "text-green-600"
                          : item.status === "rescheduled"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {item.status === "canceled" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : item.tipe === "riwayat" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      )}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {item.tipe === "riwayat"
                            ? `Permintaan konsultasi dari ${item.nama_lengkap}`
                            : item.status === "done"
                            ? `Kunjungan ${item.nama_lengkap} telah selesai`
                            : item.status === "canceled"
                            ? `Kunjungan ${item.nama_lengkap} dibatalkan`
                            : `Jadwal kunjungan dari ${item.nama_lengkap}`}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          {item.tanggal_kunjungan
                            ? `Jadwal: ${item.tanggal_kunjungan} pukul ${item.waktu_kunjungan}`
                            : `Keluhan: ${item.keluhan || "Tidak tersedia"}`}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 ml-4 flex-shrink-0">
                        {new Date(item.waktu).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Sebelumnya
                </button>

                <span className="text-sm text-gray-500">
                  Halaman {page} dari {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                Tidak ada notifikasi saat ini
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Menentukan komponen berdasarkan menu yang dipilih
  const renderComponent = () => {
    console.log(activeMenu);
    switch (activeMenu) {
      //daftar Pasien
      case "Tambah Riwayat":
        return <CreateRiwayatPasien activeMenu={activeMenu} />;

      case "Notifikasi > Catatan Kesehatan":
        return <NotePasien />;

      case "Notifikasi > Jadwal Kunjungan":
        return <ScheduleTable />;

      default:
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {activeMenu}
              </h2>
              <p className="text-gray-500 text-sm">
                Menampilkan konten untuk {activeMenu}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    Konten untuk {activeMenu}
                  </div>
                  <div className="text-sm text-gray-500">
                    Halaman ini sedang dalam pengembangan
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderComponent();
};

// Komponen Dashboard Utama
export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const role = getUserRole();
  useEffect(() => {
    const token = Cookies.get("token");
    const expiryTime = Cookies.get("expiryTime");

    if (token && expiryTime) {
      const now = new Date().getTime();
      if (now > parseInt(expiryTime, 10)) {
        Cookies.remove("token");
        Cookies.remove("expiryTime");
        window.location.href = "/";
      }
    }
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header username="User" />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <Sidebar role={role} onMenuSelect={setActiveMenu} />
        </div>
        <div className="flex-grow overflow-y-auto">
          <Content activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>
      </div>
    </div>
  );
}
