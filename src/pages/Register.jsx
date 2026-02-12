import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", {
        username,
        password
      });

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
  setErrors(error.response?.data || []);
}
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Đăng ký</h2>

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
{errors.length > 0 && (
  <div style={{ color: "red" }}>
    {errors.map((err, index) => (
      <p key={index}>{err.description}</p>
    ))}
  </div>
)}

      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
