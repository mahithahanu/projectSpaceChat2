
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatStyles.css';

const socket = io('http://localhost:3001/club');

const Chat = ({ selectedClub }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const chatBoxRef = useRef(null);

  const userEmail = window.localStorage.getItem("user_email");
const userName = userEmail ? userEmail.slice(0, -11) : "";


  useEffect(() => {
    if (!selectedClub) return;

    socket.emit('joinRoom', selectedClub._id);

    axios.get(`http://localhost:3001/clubschat/${selectedClub._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedClub]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMsg.trim() === '') return;

    socket.emit('sendMessage', {
      clubId: selectedClub._id,
      senderEmail: userEmail,
      senderName: userName,
      message: newMsg
    });

    setNewMsg('');
  };

  if (!selectedClub) {
    return <div className="noClub">Select a club to start chatting</div>;
  }

  // Helper function for date grouping
  const formatDate = (isoString) => {
    const msgDate = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = msgDate.toDateString() === today.toDateString();
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return msgDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  let lastDate = null;

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
                <div className="msgText">{msg.message}</div>
                <div className="msgTime">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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