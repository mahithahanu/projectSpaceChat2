// socket.js
import { io } from "socket.io-client";

export let socket;

export const connectSocket = (user_id) => {
  return new Promise((resolve, reject) => {
    socket = io("http://localhost:3001", {
      query: { user_id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      resolve();  // 🔑 resolve when connected
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      reject(err);
    });
  });
};
