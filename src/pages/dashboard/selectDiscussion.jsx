import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiscussionFeed.module.css";
import axios from "axios";
import { Box } from "@mui/material";

const SelectDiscussion = () => {
  const navigate = useNavigate();
  const [userCommunities, setUserCommunities] = useState([]);
  const userEmail = window.localStorage.getItem("user_email");
  console.log(userEmail); // Assuming you store it here

  useEffect(() => {
    const fetchUserCommunities = async () => {
      try {
        const res = await  axios.get(`http://localhost:3001/communities/joined?email=${userEmail}`); // adjust if needed
        const filtered = res.data.filter((comm) => comm.members.includes(userEmail));
        setUserCommunities(filtered);
      } catch (error) {
        console.error("Error fetching communities", error);
      }
    };

    if (userEmail) fetchUserCommunities();
  }, [userEmail]);

 const handleSelect = () => {
  if (window.location.pathname !== "/app/discussion-feed") {
    navigate(`/app/discussion-feed`);
  }
};


  return (
    <Box sx={{width:"1500%"}}>
    <div className={styles.selectionPage}>
      <h2 className={styles.selectTitle}>Which discussion do you want to join?</h2>
      <div className={styles.buttonGrid}>
        {userCommunities.map((comm) => (
          <button
            key={comm._id}
            className={styles.categoryBtn}
            onClick={() => handleSelect(comm.category)}
          >
            {comm.category.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
    </Box>
  );
};

export default SelectDiscussion;