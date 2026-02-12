import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import api from "../services/api";
import { startConnection, getConnection } from "../services/signalr";

export default function TaiXiuGame() {
  const [recentSessions, setRecentSessions] = useState([]);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showBowl, setShowBowl] = useState(true);
const [bowlPosition, setBowlPosition] = useState({ x: 0, y: 0 });


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
      const sorted = res.data.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );

      setRecentSessions(sorted);
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
          setTotalTai(0);
          setResult(null);
          setTotalXiu(0);
          loadBalance();
        },

        onCountdown: (time, phaseName) => {
          setCountdown(time);
          setPhase(phaseName);

          if (phaseName === "Rolling") {
            setIsRolling(true);
            setShowBowl(true); // úp bát lại
          }
        },


        onSessionResult: (session) => {
          setResult(session);
          setIsRolling(false);

          setTimeout(() => {
            setShowBowl(false); // kéo bát lên
          }, 500);

          if (session.total >= 15) {
            setShakeScreen(true);
            setTimeout(() => setShakeScreen(false), 600);
          }
          setTimeout(() => {
            loadRecent();
          }, 10000);


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
  useEffect(() => {
    if (result === null) {
      setShowBowl(true);   // úp bát lại
      setIsRolling(false); // đảm bảo không còn quay
            setBowlPosition({ x: 0, y: 0 });

    }
  }, [result]);


  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center p-4 md:p-6 ${shakeScreen ? "shake" : ""}`}>

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

        <div className="mt-6 text-center">

<div className="flex justify-center items-center 
gap-3 sm:gap-10 mt-6 sm:mt-10 w-full max-w-md sm:max-w-none">


  {/* TÀI */}
  <motion.div
    whileHover={{ scale: 1.05 }}
className="bg-red-600 rounded-2xl 
px-4 py-5 sm:px-10 sm:py-12
text-center shadow-xl 
w-24 sm:min-w-[180px]"
  >
<h2 className="text-lg sm:text-4xl font-bold mb-2 sm:mb-4">
TÀI</h2>
<p className="text-xs sm:text-xl">

      💰 {totalTai.toLocaleString()}
    </p>
  </motion.div>

{/* BÁT + DICE */}
<div className="relative 
w-36 h-36 sm:w-72 sm:h-72 
flex items-center justify-center">

  {/* Dice container */}
  <div className="flex flex-col items-center justify-center gap-6">
    <motion.div
      className="dice"
      animate={{ rotate: isRolling ? 720 : 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundPositionX: `${
          (
            isRolling
              ? Math.floor(Math.random() * 6)
              : (result?.dice1 ?? 1) - 1
          ) * 20
        }%`,
      }}
    />

    <div className="flex gap-6">
      {[2, 3].map((i) => {
        const faceIndex = isRolling
          ? Math.floor(Math.random() * 6)
          : (result?.[`dice${i}`]
              ? result[`dice${i}`] - 1
              : 0);

        return (
          <motion.div
            key={i}
            className="dice"
            animate={{ rotate: isRolling ? 720 : 0 }}
            transition={{ duration: 0.8 }}
            style={{
              backgroundPositionX: `${faceIndex * 20}%`,
            }}
          />
        );
      })}
    </div>
  </div>

  {/* BÁT */}
  <motion.div
    drag={!!result}
    dragMomentum={false}
    whileDrag={{ scale: 1.05 }}
      animate={result === null ? { x: 0, y: 0 } : {}}
    transition={{ type: "spring", stiffness: 150, damping: 15 }}
className="absolute 
w-28 h-28 sm:w-56 sm:h-56 
rounded-full
bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600
shadow-[0_10px_20px_rgba(0,0,0,0.6)]
border-2 sm:border-4 border-gray-500
flex items-start justify-center"

  >
    <div className="w-10 h-10 bg-gray-500 rounded-full mt-3 shadow-inner border border-gray-400" />
  </motion.div>

</div>


  {/* XỈU */}
  <motion.div
    whileHover={{ scale: 1.05 }}
className="bg-blue-600 rounded-2xl 
px-4 py-5 sm:px-10 sm:py-12
text-center shadow-xl 
w-24 sm:min-w-[180px]"
  >
   <h2 className="text-lg sm:text-4xl font-bold mb-2 sm:mb-4">
XỈU</h2>
<p className="text-xs sm:text-xl">

      💰 {totalXiu.toLocaleString()}
    </p>
  </motion.div>

</div>




          {/* {result && !isRolling && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xl md:text-3xl mt-6 font-bold
        ${result.result === 1
                  ? "text-red-500 drop-shadow-[0_0_15px_red]"
                  : "text-blue-500 drop-shadow-[0_0_15px_blue]"
                }
      `}
            >
              Tổng: {result.total} →{" "}
              {result.result === 1 ? "TÀI 🔥" : "XỈU 💎"}
            </motion.h2>
          )} */}

        </div>

        {/* 10 phiên gần nhất */}
        <div className="flex justify-center gap-2 mt-16 flex-wrap">
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
{/* QUICK ACTIONS */}
<div className="flex flex-wrap justify-center gap-2">

  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount((Number(amount) || 0) + 10000)}
    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold disabled:opacity-50"
  >
    +10k
  </button>

  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount((Number(amount) || 0) + 50000)}
    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold disabled:opacity-50"
  >
    +50k
  </button>

  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount((Number(amount) || 0) + 100000)}
    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold disabled:opacity-50"
  >
    +100k
  </button>

  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount((Number(amount) || 0) + 1000000)}
    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold disabled:opacity-50"
  >
    +1000k
  </button>
  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount(Math.floor(balance / 2))}
    className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-bold disabled:opacity-50"
  >
    1/2 tiền
  </button>

  <button
    type="button"
    disabled={!isBettingPhase}
    onClick={() => setAmount(balance)}
    className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold disabled:opacity-50"
  >
    ALL IN
  </button>

</div>

      {/* BET INPUT */}
      <div className="flex flex-col items-center mt-6 gap-4 w-full max-w-md">
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
