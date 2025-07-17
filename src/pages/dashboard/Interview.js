import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiscussionFeed.module.css";
import axios from "axios";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Interviews = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [posts, setPosts] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyMessages, setReplyMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [exceedsLineLimit, setExceedsLineLimit] = useState({});
  const messageRefs = useRef({});
  const dropdownRef = useRef();

  const API = "https://uconnect-gwif.onrender.com/interview/get-interviews";

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

  useEffect(() => {
    const limits = {};
    Object.keys(messageRefs.current).forEach((id) => {
      const el = messageRefs.current[id];
      if (el) {
        const computedStyle = window.getComputedStyle(el);
        const lineHeight = parseFloat(computedStyle.lineHeight || "20");
        const lineCount = el.scrollHeight / lineHeight;
        limits[id] = lineCount > 4;
      }
    });
    setExceedsLineLimit(limits);
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API);
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
      setPosts(sorted);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
    }
  };

  const handleQuickPostSubmit = async () => {
    if (!quickMessage.trim()) return;

    const post = {
      content: quickMessage,
      avatar: "https://ui-avatars.com/api/?name=Anonymous",
    };

    try {
      await axios.post(API, post);
      fetchPosts();
      setQuickMessage("");
      setShowQuickPost(false);
    } catch (error) {
      console.error("Post failed", error);
    }
  };

  const handleSend = async (id) => {
    const msg = replyMessages[id]?.trim();
    if (!msg) return;

    const reply = {
      message: msg,
      avatar: "https://ui-avatars.com/api/?name=Anonymous",
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
      console.error("Error deleting post", error);
    }
  };

  const toggleReplyBar = (id) => {
    setActiveReply((prev) => (prev === id ? null : id));
  };

  const handleSeeMessage = (post) => {
    navigate(`/app/discussion-feed/${post._id}`, {
      state: { discussion: post, source: "interviews" },
    });
  };

  const filtered = posts.filter((post) =>
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "1500%",
        height: "100vh",
        overflowY: "scroll",
        bgcolor: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#e2e8f0" : "#1e293b",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <div className={`${styles.container} ${darkMode ? styles.darkContainer : ""}`}>
        <div className={styles.topBar}>
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${styles.searchBar} ${darkMode ? styles.darkInput : ""}`}
          />
          <button className={styles.postIcon} onClick={() => setShowQuickPost(true)}>
            <MdModeEdit />
          </button>
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              className={`${styles.menuIcon} ${darkMode ? styles.darkIcon : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              ⋯
            </button>
            {dropdownOpen && (
              <div className={`${styles.dropdown} ${darkMode ? styles.darkDropdown : ""}`}>
                <div className={styles.dropdownItem} onClick={() => navigate("/app/selectcommunity")}>
                  Discussions
                </div>
              </div>
            )}
          </div>
        </div>

        {showQuickPost && (
          <div className={styles.dialogOverlay}>
            <div className={`${styles.dialogBox} ${darkMode ? styles.darkDialogBox : ""}`}>
              <h3 className={darkMode ? styles.darkText : ""}>Share Interview</h3>
              <textarea
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Write your experience..."
                className={darkMode ? styles.darkTextarea : ""}
              />
              <div className={styles.dialogButtons}>
                <button onClick={handleQuickPostSubmit}>Send</button>
                <button onClick={() => setShowQuickPost(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {filtered.map((item) => (
          <div key={item._id} className={`${styles.post} ${darkMode ? styles.darkPost : ""}`}>
            <div className={styles.avatar}>
              {item.avatar ? (
                <img src={item.avatar} alt="avatar" />
              ) : (
                <div className={styles.defaultAvatar}>👤</div>
              )}
            </div>

            <div className={styles.content}>
              <div className={styles.headerLine}>
                <span className={`${styles.author} ${darkMode ? styles.darkAuthor : ""}`}>
                  {item.author || "Anonymous"}
                </span>
                <span className={`${styles.time} ${darkMode ? styles.darkTime : ""}`}>
                  {moment(item.time).fromNow()}
                </span>
              </div>

              <div
                className={`${styles.snippetLine} ${
                  exceedsLineLimit[item._id] ? styles.blueBackground : ""
                } ${darkMode ? styles.darkSnippet : ""}`}
              >
                <span
                  ref={(el) => (messageRefs.current[item._id] = el)}
                  className={`${styles.messageText} ${
                    !expandedMessages[item._id] && exceedsLineLimit[item._id]
                      ? styles.collapsedText
                      : ""
                  } ${darkMode ? styles.darkMessageText : ""}`}
                >
                  {item.content}
                </span>

                {exceedsLineLimit[item._id] && (
                  <span
                    className={`${styles.showMoreLess} ${
                      darkMode ? styles.darkShowMoreLess : ""
                    }`}
                    onClick={() =>
                      setExpandedMessages((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                  >
                    {expandedMessages[item._id] ? " Read Less" : " Read More"}{" "}
                    {expandedMessages[item._id] ? <GoChevronUp /> : <GoChevronDown />}
                  </span>
                )}
              </div>

              <div className={styles.bottomRow}>
                <div className={styles.actions}>
                  <div className={styles.iconWrapper} onClick={() => handleSeeMessage(item)}>
                    <AiOutlineEye />
                    <span className={styles.tooltip}>See message</span>
                  </div>

                  <div className={styles.iconWrapper} onClick={() => toggleReplyBar(item._id)}>
                    <FiEdit />
                    <span className={styles.tooltip}>Write message</span>
                  </div>

                  {item.author === localStorage.getItem("userName") && (
                    <div className={styles.iconWrapper} onClick={() => handleDelete(item._id)}>
                      <MdDelete />
                      <span className={styles.tooltip}>Delete message</span>
                    </div>
                  )}

                  <span className={styles.replyCountInline}>
                    · {item.replies?.length || 0}{" "}
                    {item.replies?.length === 1 ? "reply" : "replies"}
                  </span>
                </div>

                {activeReply === item._id && (
                  <div className={`${styles.replyBar} ${darkMode ? styles.darkReplyBar : ""}`}>
                    <input
                      type="text"
                      placeholder="Write your message..."
                      value={replyMessages[item._id] || ""}
                      onChange={(e) =>
                        setReplyMessages({ ...replyMessages, [item._id]: e.target.value })
                      }
                      className={darkMode ? styles.darkReplyInput : ""}
                    />
                    <button onClick={() => handleSend(item._id)}>Send</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default Interviews;
