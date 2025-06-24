import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiscussionFeed.module.css";
import axios from "axios";
import moment from "moment";
import { GoChevronDown,GoChevronUp } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { Box, useTheme } from "@mui/material";


const Group=()=>{
    const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyMessages, setReplyMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
   const [expandedMessages, setExpandedMessages] = useState({});
  const dropdownRef = useRef();
  const theme=useTheme();

  const API = "http://localhost:3001/discussion/get-discussions";

  useEffect(() => {
    fetchDiscussions();
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

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(API);
    //   console.log(res);
      const sorted = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
      setDiscussions(sorted);
    } catch (error) {
      console.error("Failed to fetch discussions", error);
    }
  };

  const handleQuickPostSubmit = async () => {
    if (!quickMessage.trim()) return;

    // Do NOT hardcode author — it must come from the backend
    const newPost = {
      content: quickMessage,
      avatar: "https://ui-avatars.com/api/?name=Anonymous", // optional
    };

    try {
      await axios.post(API, newPost);
      fetchDiscussions(); // Will get updated post with correct author from DB
      setQuickMessage("");
      setShowQuickPost(false);
    } catch (error) {
      console.error("Error posting discussion", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting discussion", error);
    }
  };

  const toggleReplyBar = (id) => {
    setActiveReply((prev) => (prev === id ? null : id));
  };

  const handleSend = async (id) => {
    const replyText = replyMessages[id]?.trim();
    if (!replyText) return;

    const reply = {
      message: replyText,
      avatar: "https://ui-avatars.com/api/?name=Anonymous",
    };

    try {
      await axios.post(`http://localhost:3001/discussion/${id}/reply`, reply);
      setReplyMessages({ ...replyMessages, [id]: "" });
      setActiveReply(null);
      fetchDiscussions();
    } catch (error) {
      console.error("Error sending reply", error);
    }
  };

  const handleSeeMessage = (discussion) => {
  console.log("clicked");
  console.log(discussion._id);
  navigate(`/discussion/${discussion._id}`, {
    state: { discussion, source: "discussions" },
  });
};


  const filteredDiscussions = discussions.filter((d) =>
    d.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );




    return(
        <>
        <Box sx={{width:"1500%", height: "calc(100vh - 10px)",overflowY:"auto",scrollbarWidth:"none", }}>
            <div className={styles.container} style={{background:
      theme.palette.mode === "light"
        ? theme.palette.common.white
        : "#161C24",}}>
      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <button className={styles.postIcon} onClick={() => setShowQuickPost(true)}><MdModeEdit/></button>
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button className={styles.menuIcon} onClick={() => setDropdownOpen(!dropdownOpen)}>⋯</button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={() => navigate("/interviews")}>
                Interviews
              </div>
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
  <span className={styles.author}style={{color:
      theme.palette.mode === "light"
        ? "#1e293b"
        : theme.palette.primary.main,

  }}>{item.author || "Anonymous"}</span>
  <span className={styles.time}>{moment(item.time).fromNow()}</span>
</div>

<div className={styles.snippetLine}>
  <span>
    {item.content.length > 200 && !expandedMessages[item._id]
      ? item.content.slice(0, 200) + "..."
      : item.content}
    {item.content.length > 200 && (
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
        {expandedMessages[item._id] ? <GoChevronUp /> : <GoChevronDown  />}
      </span>
    )}
  </span>
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
        </>
    )
}

export default Group;