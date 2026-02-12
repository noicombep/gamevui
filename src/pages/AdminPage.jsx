import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    //baseURL: "https://localhost:7069/api",
    baseURL: "https://noicombep-bdgba7fhbzdfencp.southeastasia-01.azurewebsites.net/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const handleDeposit = async () => {
  if (!username || !amount) {
    return alert("Nhập đủ thông tin");
  }

  try {
    const res = await api.post("/admin/deposit", {
      username,
      amount: Number(amount),
    });

    alert(res.data.message || "Nạp tiền thành công");

    setUsername("");
    setAmount("");
    fetchUsers();

  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 404) {
        alert("Không tìm thấy user.");
      } else if (status === 400) {
        alert(error.response.data || "Dữ liệu không hợp lệ.");
      } else if (status === 403) {
        alert("Bạn không có quyền Admin.");
      } else {
        alert("Lỗi server.");
      }

      console.error("Server error:", error.response.data);

    } else if (error.request) {
      alert("Không thể kết nối server.");
      console.error("No response:", error.request);

    } else {
      alert("Có lỗi xảy ra.");
      console.error("Error:", error.message);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Deposit Form */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl mb-4">Nạp tiền cho user</h2>

        <input
          className="w-full p-2 mb-3 text-black rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 text-black rounded"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleDeposit}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Nạp tiền
        </button>
      </div>

      {/* User List */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl mb-4">Danh sách user</h2>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Username</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="py-2">{u.userName}</td>
                <td>{u.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
