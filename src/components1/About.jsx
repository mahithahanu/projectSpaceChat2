import React from 'react';
import CountUp from 'react-countup';
import styles from './About.module.css';

export const AboutSection = () => {
  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <div className={styles.imageContainer}>
          <img src="AboutPageImage.png" alt="Girl" className={styles.mainImg} />

          <div className={`${styles.card} ${styles.cardTopLeft}`}>
            <CountUp end={5000} duration={2.5} separator="," suffix="+">
              {({ countUpRef }) => <div><span ref={countUpRef} /></div>}
            </CountUp>
            <span>Users</span>
          </div>

          <div className={`${styles.card} ${styles.cardCenter}`}>
            <CountUp end={600} duration={2.5} suffix="+">
              {({ countUpRef }) => <div><span ref={countUpRef} /></div>}
            </CountUp>
            <span>Clubs</span>
          </div>

          <div className={`${styles.card} ${styles.cardBottomLeft}`}>
            <CountUp end={100} duration={2.5} suffix="+">
              {({ countUpRef }) => <div><span ref={countUpRef} /></div>}
            </CountUp>
            <span>
              Communities
            </span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <h2>
          Why Choose <span className={styles.highlight}>UConnect?</span>
        </h2>
        <p>
          UConnect is your one-stop platform to explore campus life like never before.
          Discover various clubs, join vibrant communities, and stay updated with exciting events —
          all in one place. With seamless registration, easy communication, and real-time updates,
          UConnect helps you connect, collaborate, and grow beyond academics.
          Join thousands of students already building memories with UConnect.
        </p>
      </div>
    </div>
  );
};

// export default AboutSection;
