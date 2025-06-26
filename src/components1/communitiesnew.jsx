import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./communities.module.css";

const bgImage = "/CommunitiespageImage.jpg";

export const Communities = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/AllCommunities");
  };

  return (
    <div
      className={styles.communitiesContainer}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.communitiesOverlay}>
        <div className={styles.communitiesLeftSection}>
          <h1 className={styles.communitiesHeading}>
            BE A PART OF<br />
            SOMETHING<br />
            BIGGER
          </h1>
        </div>

        <div className={styles.communitiesRightSection}>
          <p className={styles.communitiesDescription}>
            Whether you're passionate about volunteering, want to join a tech club, or simply looking to connect with
            like-minded individuals — our platform makes it simple. Access real-time updates, join meaningful
            discussions, and be part of the change. Register once and stay connected to everything that matters.
          </p>
          <button
            className={styles.communitiesJoinButton}
            onClick={handleExploreClick}
          >
            Explore Communities
          </button>
        </div>
      </div>
    </div>
  );
};

// export default Communities;