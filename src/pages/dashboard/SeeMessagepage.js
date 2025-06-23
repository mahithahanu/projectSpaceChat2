import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./SeeMessagePage.module.css";
import axios from "axios";
import moment from "moment";
import { Box } from "@mui/material";

const SeeMessagePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [discussion, setDiscussion] = useState(location.state?.discussion || null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const source = location.state?.source || "discussions"; // fallback to discussions
  const API_BASE = `http://localhost:3001/api/${source}`;

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        setDiscussion(res.data);
        setLikes(res.data.likes || 0);
      } catch (error) {
        console.error("Failed to fetch discussion", error);
      }
    };

    if (!discussion) {
      fetchDiscussion();
    } else {
      setLikes(discussion.likes || 0);
    }
  }, [id]);

  const handleLike = async () => {
    if (liked) return;

    try {
      setLikes(prev => prev + 1);
      setLiked(true);

      await axios.post(`${API_BASE}/${id}/like`);
    } catch (err) {
      console.error("Error liking the post", err);
    }
  };

  if (!discussion) return <p>Loading...</p>;

  return (
    <Box sx={{width:"1500%",border:"1px solid red"}}>
        <div className={styles.container}>
      <div className={styles.postBox}>
        <img
          className={styles.avatar}
          src={discussion.avatar || "https://ui-avatars.com/api/?name=User"}
          alt="avatar"
        />
        <div className={styles.postContentBox}>
          <div className={styles.headerRow}>
            <span className={styles.username}>{discussion.author}</span>
            <span className={styles.time}>{moment(discussion.time).fromNow()}</span>
          </div>
          <div className={styles.title}>{discussion.title}</div>
          <p className={styles.message}>{discussion.content}</p>

          {/* <div className={styles.likeRow}>
            <button
              onClick={handleLike}
              disabled={liked}
              className={styles.likeButton}
              title={liked ? "Already liked" : "Like this post"}
            >
              ❤ {likes}
            </button>
          </div> */}
        </div>
      </div>

      {discussion.replies.map((reply, index) => (
        <div key={index} className={styles.replyBox}>
          <img className={styles.avatar} src={reply.avatar} alt="avatar" />
          <div className={styles.replyContentBox}>
            <div className={styles.headerRow}>
              <span className={styles.username}>{reply.author}</span>
              <span className={styles.time}>{moment(reply.time).fromNow()}</span>
            </div>
            <div className={styles.replyTo}>
              Reply to <span className={styles.mention}>{discussion.author}</span>
            </div>
            <p className={styles.message}>{reply.message}</p>
          </div>
        </div>
      ))}
    </div>
    </Box>
  );
};

export default SeeMessagePage;