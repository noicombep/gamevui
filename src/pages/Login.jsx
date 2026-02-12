import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);

      toast.success("🎉 Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Sai tài khoản hoặc mật khẩu";

      toast.error("❌ " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 border border-purple-500/30"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          🎰 Casino Login
        </h2>

        <form onSubmit={login} className="space-y-5">

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold shadow-lg transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </motion.button>

          {/* Register Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full text-purple-400 hover:text-purple-300 transition"
          >
            Chưa có tài khoản? Đăng ký
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
