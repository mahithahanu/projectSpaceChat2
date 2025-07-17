import React, { useState } from "react";
import styles from "./FrequentQuestions.module.css";

const faqData = [
  {
    question: "How do I join a community?",
    answer: "Browse available communities, click 'Join' and you're in. You'll receive real-time updates for that community.",
  },
  {
    question: "Can I be part of multiple communities?",
    answer: "Absolutely! Join as many communities as you'd like and explore different interests.",
  },
  {
    question: "Is there any cost involved?",
    answer: "No. Access to communities, clubs, and chats is completely free for all registered users.",
  },
  {
    question: "Will I get notified for events?",
    answer: "Yes! Once you're part of a community, you'll receive notifications for events, updates, and new discussions.",
  },
];

export const FrequentQuestions = () => {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <div className={styles.faqSection}>
      <h1 className={styles.heading}>Frequently Asked Questions</h1>
      
      <div className={styles.faqWrapper}>
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.card} ${active === index ? styles.active : ""}`} 
            onClick={() => toggle(index)}
          >
            <div className={styles.cardHeader}>
              <span>{item.question}</span>
              <span className={styles.toggleIcon}>{active === index ? "-" : "+"}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default FrequentQuestions;
