// socket.js
import { io } from "socket.io-client";

export let socket=null;

export let clubSocket = null;

export const connectSocket = (user_id) => {
  return new Promise((resolve, reject) => {
    socket = io("https://uconnect-gwif.onrender.com", {
      query: { user_id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      resolve();  
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      reject(err);
    });
  });
};

export const connectClubSocket = () => {
  if (!clubSocket) {
    clubSocket = io("https://uconnect-gwif.onrender.com/club", {
      transports: ["websocket"],
    });

    clubSocket.on("connect", () => {
      console.log("✅ Club socket connected:", clubSocket.id);
    });
  }

  return clubSocket;
};
