// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import styles from "./SeeMessagePage.module.css";
// import axios from "axios";
// import moment from "moment";

// const SeeMessagePage = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const [discussion, setDiscussion] = useState(location.state?.discussion || null);
//   const [likes, setLikes] = useState(0);
//   const [liked, setLiked] = useState(false);

//   const source = location.state?.source || "discussions"; 
//   const API_BASE = http://localhost:5000/api/${source};

//   useEffect(() => {
//     const fetchDiscussion = async () => {
//       try {
//         const res = await axios.get(${API_BASE}/${id});
//         setDiscussion(res.data);
//         setLikes(res.data.likes || 0);
//       } catch (error) {
//         console.error("Failed to fetch discussion", error);
//       }
//     };

//     if (!discussion) {
//       fetchDiscussion();
//     } else {
//       setLikes(discussion.likes || 0);
//     }
//   }, [id]);

//   const handleLike = async () => {
//     if (liked) return;

//     try {
//       setLikes(prev => prev + 1);
//       setLiked(true);

//       await axios.post(${API_BASE}/${id}/like);
//     } catch (err) {
//       console.error("Error liking the post", err);
//     }
//   };

//   if (!discussion) return <p>Loading...</p>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.postBox}>
//         <img
//           className={styles.avatar}
//           src={discussion.avatar || "https://ui-avatars.com/api/?name=User"}
//           alt="avatar"
//         />
//         <div className={styles.postContentBox}>
//           <div className={styles.headerRow}>
//             <span className={styles.username}>{discussion.author}</span>
//             <span className={styles.time}>{moment(discussion.time).fromNow()}</span>
//           </div>
//           <div className={styles.title}>{discussion.title}</div>
//           <p className={styles.message}>{discussion.content}</p>

//                   </div>
//       </div>

//       {discussion.replies.map((reply, index) => (
//         <div key={index} className={styles.replyBox}>
//           <img className={styles.avatar} src={reply.avatar} alt="avatar" />
//           <div className={styles.replyContentBox}>
//             <div className={styles.headerRow}>
//               <span className={styles.username}>{reply.author}</span>
//               <span className={styles.time}>{moment(reply.time).fromNow()}</span>
//             </div>
//             <div className={styles.replyTo}>
//               Reply to <span className={styles.mention}>{discussion.author}</span>
//             </div>
//             <p className={styles.message}>{reply.message}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SeeMessagePage;



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
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const messageRef = useRef(null);

  const source = location.state?.source || "discussions";
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

  useEffect(() => {
    const checkLines = () => {
      if (messageRef.current) {
        const el = messageRef.current;
        const computedStyle = window.getComputedStyle(el);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        if (!lineHeight || isNaN(lineHeight)) return;
        const lineCount = el.clientHeight / lineHeight;
        setIsLong(lineCount > 4);
      }
    };

    const timer = setTimeout(checkLines, 50);
    return () => clearTimeout(timer);
  }, [discussion, expanded]);

  const handleLike = async () => {
    if (liked) return;

    try {
      setLikes((prev) => prev + 1);
      setLiked(true);
      await axios.post(`${API_BASE}/${id}/like`);
    } catch (err) {
      console.error("Error liking the post", err);
    }
  };

  if (!discussion) return <p>Loading...</p>;

  return (
    <Box sx={{width:"1500%"}}>
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

          <p
            ref={messageRef}
            className={`${styles.message} ${isLong ? styles.blueBackground : ""} ${
              !expanded && isLong ? styles.collapsedText : ""
            }`}
          >
            {discussion.content}
          </p>

          {isLong && (
            <span
              className={styles.readMoreToggle}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Read Less" : "Read More"}
            </span>
          )}
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