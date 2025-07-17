import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ChatStyles.css';
import { clubSocket, connectClubSocket } from "../socket";

const Chat = ({ selectedClub }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const chatBoxRef = useRef(null);
  const clubRef = useRef(null);

  const userEmail = window.localStorage.getItem("user_email");
  const userName = userEmail ? userEmail.slice(0, -11) : "";

  // Connect socket and fetch messages when club changes
  useEffect(() => {
    if (!selectedClub) return;

    clubRef.current = selectedClub;

    connectClubSocket(); // Ensure socket is connected

    clubSocket.emit('joinRoom', selectedClub._id); // Join the room

    axios.get(`https://uconnect-gwif.onrender.com/clubschat/${selectedClub._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

  }, [selectedClub]);

  // Listen to incoming messages (once)
useEffect(() => {
  const socket = connectClubSocket();

  console.log("🧩 useEffect running, socket is:", socket);

  const handleIncomingMessage = (msg) => {
    console.log("📥 Socket received message:", msg);
    if (msg.clubId === clubRef.current?._id) {
      setMessages(prev => [...prev, msg]);
    }
  };

  if (socket) {
    console.log("📡 Attaching 'receiveMessage' listener");
    socket.on('receiveMessage', handleIncomingMessage);
  } else {
    console.warn("⚠️ socket is null, cannot attach listener");
  }

  return () => {
    if (socket) {
      socket.off('receiveMessage', handleIncomingMessage);
    }
  };
}, []);

 // listener runs once

  // Auto scroll on new message
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const sendMessage = async () => {
    if (newMsg.trim() === '' || !selectedClub) return;

    try {
      await axios.post('https://uconnect-gwif.onrender.com/send/send-message', {
        clubId: selectedClub._id,
        senderEmail: userEmail,
        senderName: userName,
        message: newMsg
      });

      setNewMsg('');
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  if (!selectedClub) {
    return <div className="noClub">Select a club to start chatting</div>;
  }

  const formatDate = (isoString) => {
    const msgDate = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return 'Today';
    if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return msgDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  let lastDate = null;

  connectClubSocket().on('receiveMessage', (msg) => {
  console.log("🔥 MANUAL Listener received message:", msg);
});


  return (
    <div className="chatContainer">
      <div className="chatHeader">
        <h2>{selectedClub.name}</h2>
      </div>

      <div className="chatBox" ref={chatBoxRef}>
        {messages.map((msg, index) => {
          const msgDate = formatDate(msg.timestamp);
          const showDateHeader = msgDate !== lastDate;
          lastDate = msgDate;

          return (
            <React.Fragment key={index}>
              {showDateHeader && (
                <div className="dateHeader">{msgDate}</div>
              )}
              <div className={msg.senderEmail === userEmail ? 'myMessage' : 'otherMessage'}>
                <div className="msgSender">{msg.senderName}:</div>
                <div className="msgContent">
                  <span className="msgText">{msg.message}</span>
                  <span className="msgTime">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="chatInput">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
