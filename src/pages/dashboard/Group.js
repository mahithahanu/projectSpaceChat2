import React, { useEffect, useState, useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import styles from "./DiscussionFeed.module.css";
import axios from "axios";
import moment from "moment";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Box } from "@mui/material";

const DiscussionFeed = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyMessages, setReplyMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const messageRefs = useRef({});
  const [exceedsLineLimit, setExceedsLineLimit] = useState({});
  const dropdownRef = useRef();
  const { category } = useParams();


  const API = "http://localhost:3001/discussion/get-discussions";

  useEffect(() => {
 fetchDiscussions();
},[]);

  
 const fetchDiscussions = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/discussion/get-discussions`);
    console.log(res);
    const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
    setDiscussions(sorted);
  } catch (error) {
    console.error("Failed to fetch discussions", error);
  }
};


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
  }, [discussions]);
  
  


  const handleQuickPostSubmit = async () => {
    if (!quickMessage.trim()) return;

    const newPost = {
      content: quickMessage,
      avatar: "https://ui-avatars.com/api/?name=Anonymous",
    };

    try {
      await axios.post(API, newPost);
      fetchDiscussions();
      setQuickMessage("");
      setShowQuickPost(false);
    } catch (error) {
      console.error("Error posting discussion", error);
    }
  };

  const toggleReplyBar = (id) => {
    setActiveReply((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  const handleSend = async (id) => {
    const replyText = replyMessages[id]?.trim();
    if (!replyText) return;

    const reply = {
      message: replyText,
      avatar: "https://ui-avatars.com/api/?name=Anonymous",
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

  const handleSeeMessage = (discussion) => {
    navigate(`/discussion/${discussion._id}`, {
      state: { discussion, source: "discussions" },
    });
  };

  const filteredDiscussions = discussions.filter((d) =>
    d.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{width:"1500%"}}>
    <div className={styles.container}>
      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <button className={styles.postIcon} onClick={() => setShowQuickPost(true)}>
          <MdModeEdit />
        </button>
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button className={styles.menuIcon} onClick={() => setDropdownOpen(!dropdownOpen)}>
            ⋯
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={() => navigate("/interviews")}>Interviews</div>
            </div>
          )}
        </div>
      </div>

      {showQuickPost && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <h3>Post Something</h3>
            <textarea
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="Share a thought or update..."
            />
            <div className={styles.dialogButtons}>
              <button onClick={handleQuickPostSubmit}>Send</button>
              <button onClick={() => setShowQuickPost(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {filteredDiscussions.map((item) => (
        <div key={item._id} className={styles.post}>
          <div className={styles.avatar}>
            {item.avatar ? (
              <img src={item.avatar} alt="avatar" />
            ) : (
              <div className={styles.defaultAvatar}>👤</div>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.headerLine}>
              <span className={styles.author}>{item.author || "Anonymous"}</span>
              <span className={styles.time}>{moment(item.time).fromNow()}</span>
            </div>

            <div
              className={`${styles.snippetLine} ${
                exceedsLineLimit[item._id] ? styles.blueBackground : ""
              }`}
            >
              <span
                ref={(el) => (messageRefs.current[item._id] = el)}
                className={`${styles.messageText} ${
                  !expandedMessages[item._id] && exceedsLineLimit[item._id]
                    ? styles.collapsedText
                    : ""
                }`}
              >
                {item.content}
              </span>

              {exceedsLineLimit[item._id] && (
                <span
                  className={styles.showMoreLess}
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
                  · {item.replies?.length || 0} {item.replies?.length === 1 ? "reply" : "replies"}
                </span>
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
        </div>
      ))}
    </div>
    </Box>
  );
};

export default DiscussionFeed;