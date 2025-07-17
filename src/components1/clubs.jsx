import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './clubs.module.css';

export const ClubsSection = () => {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate(); // <-- you need this!

  useEffect(() => {
    fetch('https://uconnect-gwif.onrender.com/clubs/club')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error("Failed to fetch clubs:", err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.newsSection}>
        <h2><span className={styles.highlight}>ABOUT</span> OUR CLUBS</h2>

        <p className={styles.description}>
          Our institution proudly supports a diverse range of student clubs including <strong>LEO Club</strong>, <strong>Red Cross</strong>, <strong>Abhinaya</strong>, and <strong>Robotics Club</strong>. These clubs empower students to explore their passions, build valuable skills, and contribute to the community.
        </p>

        <p className={styles.description}>
          Whether it's organizing social service activities, performing cultural events, participating in robotics competitions, or conducting blood donation camps — each club fosters a dynamic and inclusive environment for personal and professional growth.
        </p>

        <p className={styles.description}>
          Members actively collaborate, lead projects, attend workshops, and engage in networking opportunities throughout the academic year. Our clubs not only enrich campus life but also help students develop leadership, teamwork, and problem-solving skills essential for their future careers.
        </p>

        <p className={styles.description}>
          Joining a club is an excellent way to make meaningful connections, give back to society, and enhance your overall college experience. Explore, engage, and excel with UConnect Clubs!
        </p>
      </div>

      <div className={styles.eventsSection}>
        <h2><span className={styles.highlight}>EXPLORE</span> CLUBS</h2>
        <div className={styles.eventsGrid}>
          {clubs.map((club, index) => (
            <div
              className={styles.eventCard}
              key={index}
              onClick={() => navigate(`/events/${club._id}`)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div className={styles.eventInfo}>
                <h4>{club.name}</h4>
                <p>{club.description}</p>
              </div>
              <div className={styles.arrowContainer}>
                ➔
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// export default ClubsSection;
