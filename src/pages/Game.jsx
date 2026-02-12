import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import api from "../services/api";
import { startConnection, getConnection } from "../services/signalr";

export default function TaiXiuGame() {
  const [recentSessions, setRecentSessions] = useState([]);

  const [sessionId, setSessionId] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [phase, setPhase] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [result, setResult] = useState(null);
  const [totalTai, setTotalTai] = useState(0);
  const [totalXiu, setTotalXiu] = useState(0);
  const [username, setUsername] = useState("");
const loadRecent = async () => {
  try {
    const res = await api.get("/game/recent");
    setRecentSessions(res.data);
  } catch (err) {
    console.log("Lỗi load recent", err);
  }
};

  const isBettingPhase = phase === "Betting";

  const loadBalance = async () => {
    try {
      const res = await api.get("/auth/me");
      setBalance(res.data.balance);
      setUsername(res.data.username);
    } catch { }
  };

  useEffect(() => {
    let connection;

    const connect = async () => {
      connection = await startConnection({
        onSessionStarted: (id) => {
          setSessionId(id);
          setResult(null);
          setTotalTai(0);
          setTotalXiu(0);
          loadBalance();
        },

        onCountdown: (time, phaseName) => {
          setCountdown(time);
          setPhase(phaseName);
        },

        onSessionResult: (session) => {
          setResult(session);
            loadRecent();
        },

        onBetPlaced: (data) => {
          setBalance(data.balance);
          setAmount("");
        },

        onBetUpdated: (data) => {
          setTotalTai(data.totalTai);
          setTotalXiu(data.totalXiu);
        },
      });
    };

    connect();
    return () => connection?.stop();
  }, []);

  useEffect(() => {
    loadRecent();
    loadBalance();
  }, []);

  const placeBet = async (choice) => {
    if (!sessionId) return alert("Chưa có phiên!");
    if (!isBettingPhase) return alert("Hết thời gian!");

    const betAmount = Number(amount);
    if (!betAmount || betAmount <= 0)
      return alert("Nhập tiền hợp lệ!");

    try {
      const connection = getConnection();
      await connection.invoke("PlaceBet", sessionId, choice, betAmount);
    } catch {
      alert("Lỗi đặt cược!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center w-full max-w-6xl mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            🎲 TÀI XỈU REALTIME
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Session: {sessionId}
          </p>
        </div>
<p className="text-green-400 font-semibold">
  👤 {username}
</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full shadow-lg text-sm md:text-base">
            <Wallet size={16} />
            {balance.toLocaleString()} VNĐ
          </div>
    
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-800 rounded-xl text-xs md:text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* BET PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-6xl mb-8">

        {/* TÀI */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-red-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">TÀI</h2>
          <p className="text-lg md:text-2xl">
            💰 {totalTai.toLocaleString()} VNĐ
          </p>
        </motion.div>

        {/* XỈU */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">XỈU</h2>
          <p className="text-lg md:text-2xl">
            💰 {totalXiu.toLocaleString()} VNĐ
          </p>
        </motion.div>
      </div>

      {/* COUNTDOWN + RESULT */}
      <div className="text-center mb-8">
        <h2 className="text-sm md:text-xl text-gray-400">
          Phase: {phase}
        </h2>

        <motion.h1
          key={countdown}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-4xl md:text-6xl font-bold text-yellow-400"
        >
          {countdown}s
        </motion.h1>

        {result && (
          <div className="mt-6">
            <h2 className="text-2xl md:text-4xl">
              🎲 {result.dice1} - {result.dice2} - {result.dice3}
            </h2>
            <h2 className="text-lg md:text-2xl mt-2">
              Tổng: {result.total} →{" "}
              {result.result === 1 ? "TÀI" : "XỈU"}
            </h2>
          </div>
        )}
        {/* 10 phiên gần nhất */}
<div className="flex justify-center gap-2 mt-4 flex-wrap">
  {recentSessions.map((item) => (
    <div
      key={item.id}
      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
        ${item.result === 1 ? "bg-red-600" : "bg-blue-600"}
      `}
    >
      {item.result === 1 ? "T" : "X"}
    </div>
  ))}
</div>
      </div>

      {/* BET INPUT */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <input
          type="number"
          placeholder="Nhập số tiền"
          value={amount}
          disabled={!isBettingPhase}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 md:px-6 py-3 rounded-xl text-black w-full text-center text-base md:text-lg"
        />

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <button
            disabled={!isBettingPhase}
            onClick={() => placeBet(1)}
            className="w-full px-6 md:px-10 py-3 md:py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-lg md:text-xl font-bold shadow-xl disabled:opacity-50"
          >
            CƯỢC TÀI
          </button>

          <button
            disabled={!isBettingPhase}
            onClick={() => placeBet(2)}
            className="w-full px-6 md:px-10 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-lg md:text-xl font-bold shadow-xl disabled:opacity-50"
          >
            CƯỢC XỈU
          </button>
        </div>
      </div>
    </div>
  );
}
