import { useState } from "react";
import { motion } from "framer-motion";

export default function TestDicePage() {
  const [dice, setDice] = useState([1, 1, 1]);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);

    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setRolling(false);
    }, 1000);
  };

  const total = dice.reduce((a, b) => a + b, 0);
  const result = total >= 11 ? "TÀI" : "XỈU";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white p-6 ${
      total >= 15 && !rolling ? "shake" : ""
    }`}>
      <div className="bg-gray-800/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-8">🎲 Test Xúc Xắc (Sprite CSS)</h1>

        {/* Layout tam giác: 1 trên - 2 dưới */}
        <div className="flex flex-col items-center gap-6 mb-8">
          {/* Dice trên */}
          <motion.div
            animate={{ rotate: rolling ? 720 : 0, scale: rolling ? 1.2 : 1 }}
            transition={{ duration: 0.8 }}
            className="dice"
            style={{
              backgroundPositionX: `100%`,
            }}
          />

          {/* 2 Dice dưới */}
          <div className="flex gap-10">
            {[dice[1], dice[2]].map((value, index) => (
              <motion.div
                key={index}
                animate={{ rotate: rolling ? 720 : 0, scale: rolling ? 1.2 : 1 }}
                transition={{ duration: 0.8 }}
                className="dice"
                style={{
                  backgroundPositionX: `${(value - 1) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="mb-6">
          <p className="text-lg text-gray-400">Tổng: {total}</p>
          <p
            className={`text-2xl font-bold mt-2 ${
              result === "TÀI" ? "text-red-500" : "text-blue-400"
            }`}
          >
            {result}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={rollDice}
          className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl shadow-xl"
        >
          🎲 Lắc Xúc Xắc
        </motion.button>
      </div>
    </div>
  );
}
