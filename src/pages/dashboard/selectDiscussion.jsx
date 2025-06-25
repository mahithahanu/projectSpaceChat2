import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./selectDiscussion.module.css";
import { Box } from "@mui/material";

const SelectDiscussion = () => {
  const location = useLocation();
  const navigate = useNavigate();

const communities = JSON.parse(localStorage.getItem("joinedCommunities")) || [];


  return (
      <Box sx={{width:"1500%",height:"100vh",overflowY: "Scroll"}}>
    <div className={styles.selectionPage}>
      <h2 className={styles.selectTitle}>Select a Community to Discuss</h2>

      {communities.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>
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