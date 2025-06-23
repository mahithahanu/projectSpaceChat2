import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import styles from "./DiscussionFeed.module.css";

const Interviews = () => {
  const [posts, setPosts] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyMessages, setReplyMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const API = "http://localhost:3001/interview/get-interviews";

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API);
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
      setPosts(sorted);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuickPostSubmit = async () => {
    if (!quickMessage.trim()) return;

    const post = {
      content: quickMessage,
      time: new Date(), // Ensure backend stores time
      avatar: "https://ui-avatars.com/api/?name=Anonymous", // or skip if backend sets
    };

    try {
      await axios.post(API, post);
      fetchPosts();
      setQuickMessage("");
      setShowQuickPost(false);
    } catch (err) {
      console.error("Post failed", err);
    }
  };

  const handleSend = async (id) => {
    const msg = replyMessages[id]?.trim();
    if (!msg) return;

    const reply = {
      message: msg,
      avatar: "https://ui-avatars.com/api/?name=Anonymous", // optional
    };

    try {
      await axios.post(`${API}/${id}/reply`, reply);
      fetchPosts();
      setReplyMessages({ ...replyMessages, [id]: "" });
      setActiveReply(null);
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting interview", error);
    }
  };

  const toggleReplyBar = (id) => {
    setActiveReply((prev) => (prev === id ? null : id));
  };

  const handleSeeMessage = (post) => {
    navigate(`/discussion/${post._id}`, {
      state: { discussion: post, source: "interviews" },
    });
  };

  const filtered = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Search interviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <button className={styles.postIcon} onClick={() => setShowQuickPost(true)}>✏</button>
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button className={styles.menuIcon} onClick={() => setDropdownOpen(!dropdownOpen)}>⋯</button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={() => navigate("/")}>
                Discussions
              </div>
            </div>
          )}
        </div>
      </div>

      {showQuickPost && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <h3>Share Interview</h3>
            <textarea
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="Write your experience..."
            />
            <div className={styles.dialogButtons}>
              <button onClick={handleQuickPostSubmit}>Send</button>
              <button onClick={() => setShowQuickPost(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {filtered.map((item) => (
        <div key={item._id} className={styles.post}>
          <div className={styles.avatar}>
            {item.avatar ? (
              <img src={item.avatar} alt="avatar" />
            ) : (
              <div className={styles.defaultAvatar}>👤</div>
            )}
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.author}>{item.author || "Anonymous"}</span>
              <div className={styles.timeWrapper}>
                <span className={styles.time}>{moment(item.time).fromNow()}</span>
                <span className={styles.replyCount}>
                  {item.replies?.length || 0} {item.replies?.length === 1 ? "reply" : "replies"}
                </span>
              </div>
            </div>

            <div className={styles.snippet}>{item.content}</div>
            <div className={styles.actions}>
              <div className={styles.iconWrapper} onClick={() => handleSeeMessage(item)}>
                👁<span className={styles.tooltip}>See message</span>
              </div>
              <div className={styles.iconWrapper} onClick={() => toggleReplyBar(item._id)}>
                ✍<span className={styles.tooltip}>Write message</span>
              </div>
              {/* Show delete button only if your backend returns isOwner or use session */}
              {item.isOwner && (
                <div className={styles.iconWrapper} onClick={() => handleDelete(item._id)}>
                  🗑<span className={styles.tooltip}>Delete</span>
                </div>
              )}
            </div>

            {activeReply === item._id && (
              <div className={styles.replyBar}>
                <input
                  type="text"
                  placeholder="Write your message..."
                  value={replyMessages[item._id] || ""}
                  onChange={(e) =>
                    setReplyMessages({ ...replyMessages, [item._id]: e.target.value })
                  }
                />
                <button onClick={() => handleSend(item._id)}>Send</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Interviews;