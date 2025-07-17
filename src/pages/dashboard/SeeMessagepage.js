import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./SeeMessagePage.module.css";
import axios from "axios";
import moment from "moment";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SeeMessagePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [discussion, setDiscussion] = useState(location.state?.discussion || null);

  const API = "https://uconnect-gwif.onrender.com/discussions/get-discussions";

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setDiscussion(res.data);
      } catch (error) {
        console.error("Failed to fetch discussion", error);
      }
    };

    if (!discussion) fetchDiscussion();
  }, [id]);

  if (!discussion) return <p>Loading...</p>;

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
        <div className={`${styles.postBox} ${darkMode ? styles.darkPostBox : ""}`}>
          <img className={styles.avatar} src={discussion.avatar} alt="avatar" />
          <div className={styles.postContentBox}>
            <div className={styles.headerRow}>
              <span className={`${styles.username} ${darkMode ? styles.darkUsername : ""}`}>
                {discussion.author}
              </span>
              <span className={`${styles.time} ${darkMode ? styles.darkTime : ""}`}>
                {moment(discussion.time).fromNow()}
              </span>
            </div>
            <p className={`${styles.message} ${darkMode ? styles.darkMessage : ""}`}>
              {discussion.content}
            </p>
          </div>
        </div>

        <h3 className={`${styles.replyTitle} ${darkMode ? styles.darkReplyTitle : ""}`}>
          Replies
        </h3>

        {discussion.replies.length === 0 ? (
          <p className={`${styles.noReplies} ${darkMode ? styles.darkNoReplies : ""}`}>
            No replies yet.
          </p>
        ) : (
          discussion.replies.map((reply, idx) => (
            <div key={idx} className={`${styles.replyBox} ${darkMode ? styles.darkReplyBox : ""}`}>
              <img className={styles.avatar} src={reply.avatar} alt="reply avatar" />
              <div className={styles.replyContentBox}>
                <div className={styles.headerRow}>
                  <span className={`${styles.username} ${darkMode ? styles.darkUsername : ""}`}>
                    {reply.author || "Anonymous"}
                  </span>
                  <span className={`${styles.time} ${darkMode ? styles.darkTime : ""}`}>
                    {moment(reply.time).fromNow()}
                  </span>
                </div>
                <p className={`${styles.message} ${darkMode ? styles.darkMessage : ""}`}>
                  {reply.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Box>
  );
};

export default SeeMessagePage;
