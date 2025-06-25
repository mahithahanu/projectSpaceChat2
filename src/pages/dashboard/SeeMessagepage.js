import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./SeeMessagePage.module.css";
import axios from "axios";
import moment from "moment";
import { Box } from "@mui/material";

const SeeMessagePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [discussion, setDiscussion] = useState(location.state?.discussion || null);

  const API = `http://localhost:3001/discussions/get-discussions`;

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
     <Box sx={{width:"1500%",height:"100vh",overflowY: "Scroll"}}>
    <div className={styles.container}>
      <div className={styles.postBox}>
        <img className={styles.avatar} src={discussion.avatar} alt="avatar" />
        <div className={styles.postContentBox}>
          <div className={styles.headerRow}>
            <span className={styles.username}>{discussion.author}</span>
            <span className={styles.time}>{moment(discussion.time).fromNow()}</span>
          </div>
          <p className={styles.message}>{discussion.content}</p>
        </div>
      </div>

      <h3 className={styles.replyTitle}>Replies</h3>
      {discussion.replies.length === 0 ? (
        <p className={styles.noReplies}>No replies yet.</p>
      ) : (
        discussion.replies.map((reply, idx) => (
          <div key={idx} className={styles.replyBox}>
            <img className={styles.avatar} src={reply.avatar} alt="reply avatar" />
            <div className={styles.replyContentBox}>
              <div className={styles.headerRow}>
                <span className={styles.username}>{reply.author || "Anonymous"}</span>
                <span className={styles.time}>{moment(reply.time).fromNow()}</span>
              </div>
              <p className={styles.message}>{reply.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
    </Box>
  );
};

export default SeeMessagePage;