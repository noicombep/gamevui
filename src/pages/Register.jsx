import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import api from "../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await api.post("/auth/register", {
        username,
        password,
      });

      toast.success("🎉 Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const data = error.response?.data;
      let formattedErrors = [];

      if (Array.isArray(data)) {
        // Nếu backend trả về IdentityError [{code, description}]
        formattedErrors = data.map((e) =>
          typeof e === "string" ? e : e.description
        );
      } else if (typeof data === "string") {
        formattedErrors = [data];
      } else if (data?.message) {
        formattedErrors = [data.message];
      } else {
        formattedErrors = ["Đã có lỗi xảy ra"];
      }

      setErrors(formattedErrors);
      toast.error("❌ Đăng ký thất bại!");
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
          🎰 Casino Register
        </h2>

        <form onSubmit={register} className="space-y-5">

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

          {/* Error list */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-red-400 text-sm space-y-1">
              {errors.map((err, index) => (
                <p key={index}>• {err}</p>
              ))}
            </div>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-purple-500/50 transition"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
