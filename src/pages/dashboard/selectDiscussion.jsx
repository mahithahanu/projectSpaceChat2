import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import styles from "./selectDiscussion.module.css";
import { Box } from "@mui/material";

const SelectDiscussion = () => {
  const location = useLocation();
  const navigate = useNavigate();
   const theme = useTheme();
const communities = JSON.parse(localStorage.getItem("joinedCommunities")) || [];
const isDarkMode = theme.palette.mode === "dark";

  return (
      <Box sx={{width:"1500%",height:"100vh",overflowY: "Scroll", scrollbarWidth: "none", // Firefox
    '&::-webkit-scrollbar': { display: 'none' },}}>
    <div className={styles.selectionPage}>
      <h2 className={styles.selectTitle}
       style={{ color: isDarkMode ? "#f8fafc" : "#1e293b" }}>Select a Community to Discuss</h2>

      {communities.length === 0 ? (
        <p style={{ marginTop: "1rem" ,
          color: isDarkMode ? "#cbd5e1" : "#475569",
        }}>
          You haven't joined any communities yet.
        </p>
      ) : (
        <div className={styles.buttonGrid}>
          {communities.map((comm) => (
            <button
              key={comm._id}
              className={styles.categoryBtn}
              onClick={() => navigate(`/app/discussion-feed/${comm._id}`)}
            >
              {comm.name}
            </button>
          ))}

        </div>
      )}
    </div>
    </Box>
  );
};

export default SelectDiscussion;