import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || "Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Đăng nhập</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>
      <br /><br />

      <button onClick={() => navigate("/register")}>
        Đăng ký
      </button>
    </div>
  );
}

export default Login;
