import * as signalR from "@microsoft/signalr";

let connection = null;

export const startConnection = async (handlers) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7069/gamehub", {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();

  // ================= EVENTS =================
  connection.on("SessionStarted", handlers.onSessionStarted);
  connection.on("Countdown", handlers.onCountdown);
  connection.on("SessionResult", handlers.onSessionResult);
  connection.on("BetPlaced", handlers.onBetPlaced);
  connection.on("BetUpdated", handlers.onBetUpdated);

  await connection.start();
  console.log("SignalR Connected");

  return connection;
};

export const getConnection = () => connection;
