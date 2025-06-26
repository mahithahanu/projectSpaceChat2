import React from "react";
import { useNavigate } from "react-router-dom";  // <-- import navigate hook
import styles from "./Homepage.module.css";

export const Homepage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app/dashboard');
    // const communitySection = document.getElementById("communities");
    // if (communitySection) {
    //   communitySection.scrollIntoView({ behavior: "smooth" });
    // }
  };


  const handleContact = () => {
    // Smooth scroll to contact section if on same page
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.decorations}>
        <span className={`${styles.circle} ${styles.float1}`}></span>
        <span className={`${styles.square} ${styles.float2}`}></span>
        <span className={`${styles.triangle} ${styles.float3}`}></span>
      </div>

      <div className={styles.heroWrapper}>
        <div className={styles.content}>
          <p className={styles.subtitle}>A PLACE TO CONNECT AND SHINE</p>
          <h1 className={styles.title}>
            <span className={styles.light}>TIME TO</span> <span className={styles.highlight}>REDEFINE</span><br />
            <span className={styles.light}>CONNECTIONS</span>
          </h1>
          <p className={styles.description}>
            One platform. Many communities. Join clubs, receive important updates, and communicate instantly with like-minded people.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn} onClick={handleGetStarted}>Get Started</button>
            <button className={styles.secondaryBtn} onClick={handleContact}>Contact Us</button>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img src="/HomepageImage.png" alt="Homepage Visual" className={styles.fullImage} />
        </div>
      </div>
    </section>
  );
};