import React from 'react';
import styles from "./Service.module.css";
import Lottie from 'lottie-react';
import collaborationAnim from '../animations/Animation - 1750491793929.json';
import clubsAnim from '../animations/Animation - 1750493064876.json';
import chatOneAnim from '../animations/Animation - 1750493523194.json';
import chatManyAnim from '../animations/Animation - 1750493819962.json';

const features = [
  { animation: clubsAnim, text: 'Clubs' },
  { animation: collaborationAnim, text: 'Collaboration' },
  { animation: chatOneAnim, text: '1:1 Chat' },
  { animation: chatManyAnim, text: '1:Many Chat' },
];

export const ServiceFeatures = () => {
  return (
    <div className={styles.featuresContainer}>
      {features.map((feature, index) => (
        <div key={index} className={styles.featureCard}>
          <div className={styles.lottieWrapper}>
            <Lottie animationData={feature.animation} loop autoplay className={styles.lottie} />
          </div>
          <div className={styles.featureText}>{feature.text}</div>
        </div>
      ))}
    </div>
  );
};

