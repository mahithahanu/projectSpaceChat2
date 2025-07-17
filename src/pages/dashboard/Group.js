import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DiscussionFeed.module.css";
import axios from "axios";
import moment from "moment";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DiscussionFeed = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [quickMessage, setQuickMessage] = useState("");
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({});
  const [exceedsLineLimit, setExceedsLineLimit] = useState({});
  const [replyMessages, setReplyMessages] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const messageRefs = useRef({});
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const userEmail = localStorage.getItem("user_email");
  const userName = userEmail?.slice(0, 10);

  const API = "https://uconnect-gwif.onrender.com/discussion";

  useEffect(() => {
    fetchDiscussions();
    fetchCommunityName();
  }, [communityId]);

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(`${API}/get-discussions?communityId=${communityId}`);
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
      setDiscussions(sorted);
    } catch (error) {
      console.error("Failed to fetch discussions", error);
    }
  };

  const fetchCommunityName = async () => {
    try {
      const res = await axios.get(`https://uconnect-gwif.onrender.com/communities/${communityId}`);
      setCommunityName(res.data.name || "Community");
    } catch (error) {
      console.error("Failed to fetch community name", error);
    }
  };

  useEffect(() => {
    const limits = {};
    Object.keys(messageRefs.current).forEach((id) => {
      const el = messageRefs.current[id];
      if (el) {
        const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight || "20");
        const lineCount = el.scrollHeight / lineHeight;
        limits[id] = lineCount > 4;
      }
    });
    setExceedsLineLimit(limits);
  }, [discussions]);

  const handleQuickPostSubmit = async () => {
    if (!quickMessage.trim()) return;

    const newPost = {
      content: quickMessage,
      author: userName || "Anonymous",
      avatar: `https://ui-avatars.com/api/?name=${userName || "Anonymous"}`,
      communityId,
    };

    try {
      await axios.post(`${API}/get-discussions`, newPost);
      setQuickMessage("");
      setShowQuickPost(false);
      fetchDiscussions();
    } catch (error) {
      console.error("Error posting discussion", error);
    }
  };

  const handleSend = async (id) => {
    const replyText = replyMessages[id]?.trim();
    if (!replyText) return;

    const reply = {
      message: replyText,
      avatar: `https://ui-avatars.com/api/?name=${userName || "Anonymous"}`,
    };

    try {
      await axios.post(`${API}/${id}/reply`, reply);
      setReplyMessages({ ...replyMessages, [id]: "" });
      setActiveReply(null);
      fetchDiscussions();
    } catch (error) {
      console.error("Error sending reply", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  const toggleReplyBar = (id) => {
    setActiveReply((prev) => (prev === id ? null : id));
  };

  const handleSeeMessage = (discussion) => {
    navigate(`/app/discussion/${discussion._id}`, {
      state: { discussion, source: "discussions" },
    });
  };

  const filteredDiscussions = discussions.filter((d) =>
    d.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "1500%",
        height: "100vh",
        overflowY: "Scroll",
        bgcolor: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#e2e8f0" : "#1e293b",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <div className={`${styles.container} ${darkMode ? styles.darkContainer : ""}`}>
        <h2 className={`${styles.heading} ${darkMode ? styles.darkHeading : ""}`}>
          {communityName ? `${communityName} Discussions` : "Community Discussions"}
        </h2>

        <div className={styles.topBar}>
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${styles.searchBar} ${darkMode ? styles.darkInput : ""}`}
          />

          <div className={styles.actionsTop}>
            <button className={styles.postIcon} onClick={() => setShowQuickPost(true)}>
              <MdModeEdit />
            </button>

            <div className={styles.dropdownWrapper}>
              <BsThreeDotsVertical
                className={`${styles.menuIcon} ${darkMode ? styles.darkIcon : ""}`}
                onClick={() => setShowMenu((prev) => !prev)}
              />
              {showMenu && (
                <div className={`${styles.dropdownMenu} ${darkMode ? styles.darkDropdown : ""}`}>
                  <div onClick={() => navigate("/app/interviews")}>Interview</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showQuickPost && (
          <div className={styles.dialogOverlay}>
            <div className={`${styles.dialogBox} ${darkMode ? styles.darkDialogBox : ""}`}>
              <h3 className={darkMode ? styles.darkText : ""}>Post Something</h3>
              <textarea
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="Share a thought or update..."
                className={darkMode ? styles.darkTextarea : ""}
              />
              <div className={styles.dialogButtons}>
                <button onClick={handleQuickPostSubmit}>Send</button>
                <button onClick={() => setShowQuickPost(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {filteredDiscussions.length === 0 ? (
          <p className={`${styles.noResults} ${darkMode ? styles.darkNoResults : ""}`}>
            No discussions found.
          </p>
        ) : (
          filteredDiscussions.map((item) => (
            <div
              key={item._id}
              className={`${styles.post} ${darkMode ? styles.darkPost : ""}`}
            >
              <div className={styles.avatar}>
                <img src={item.avatar} alt="avatar" />
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
                    exceedsLineLimit[item._id]
                      ? darkMode
                        ? styles.darkSnippet
                        : styles.blueBackground
                      : ""
                  }`}
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
                      {expandedMessages[item._id] ? "Read Less" : "Read More"}{" "}
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
                    {item.author === userName && (
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
                          setReplyMessages({
                            ...replyMessages,
                            [item._id]: e.target.value,
                          })
                        }
                        className={darkMode ? styles.darkReplyInput : ""}
                      />
                      <button onClick={() => handleSend(item._id)}>Send</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Box>
  );
};

export default DiscussionFeed;
