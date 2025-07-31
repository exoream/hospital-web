import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, ArrowRightIcon } from "lucide-react";
import { getUserRole } from "./utils/auth";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // if (!username || !password) {
    //   alert('Username dan password harus diisi');
    //   return;
    // }

    if (!username.trim() || !password.trim()) {
      Swal.fire("Gagal", "Username dan password wajib diisi.", "error");
      return;
    }

    setIsLoading(true);
    console.log(username, password);
    try {
      const response = await fetch(
        "https://hospital-be-chi.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Login Gagal", data.message || "Login gagal", "error");
        setIsLoading(false);
        return;
      }

      try {
        const expiryTime = new Date().getTime() + 12 * 60 * 60 * 1000;
        Cookies.set("expiryTime", expiryTime, { expires: 1 });
        Cookies.set("token", data.data.token, { expires: 1 });
        const role = getUserRole();
        switch (role) {
          case "admin":
            return navigate("/dashboard");
          case "pasien":
            return navigate("/user-dashboard");
          default:
            return navigate("/unauthorized");
        }
      } catch (error) {
        console.error("Token tidak valid:", error);
        Swal.fire(
          "Akses Ditolak",
          "Hanya admin yang bisa login ke halaman ini",
          "error"
        );
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat login:", error);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-green-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-blue-100">
        {/* Logo dan judul */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-200">
            <img
              src="/assets/LOGO_PUSKESMAS_CAMBA.png"
              alt="Logo Kanan"
              class="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Puskesmas Camba</h1>
          <p className="text-gray-600 font-medium">Kabupaten Maros</p>
          <div className="mt-2 h-1 w-16 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Form login */}
        <div className="mt-8 space-y-5">
          <div className="space-y-4">
            {/* Input Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Input Password */}
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Tombol Login */}
          <div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium transition-all duration-200"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Login
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRightIcon className="h-5 w-5" />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Sistem Informasi Kesehatan
        </div>
      </div>
    </div>
  );
}

export default App;
