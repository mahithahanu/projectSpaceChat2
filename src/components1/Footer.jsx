import React, { useState } from 'react';
import styles from './Footer.module.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // const validateEmail = (email) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   toast.error('Please enter a valid email address!');
    //   return;
    // }

    setLoading(true);
    try {
      await axios.post('https://uconnect-gwif.onrender.com/auth/contact', { email });
      toast.success('Email sent successfully!');
      setEmail('');
    } catch (err) {
      toast.error('Failed to send email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.topSection}>
          <div className={styles.cta}>
            <p className={styles.creditText}>GET STARTED — NO STRINGS ATTACHED</p>
            <h2>Start using UConnect today.</h2>
            <form onSubmit={handleSubmit} className={styles.emailInput}>
              <input
                type="text"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                {loading ? <FaSpinner className={styles.spinner} /> : <FaPaperPlane />}
              </button>
            </form>
          </div>

          <div className={styles.imageSection}>
            <img className={styles.footerImage} src="footer.png" alt="Footer Illustration" />
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomBlock}>
            <h3>UConnect</h3>
            <p>Make the right data-driven decisions that move your business.</p>
          </div>

          {/* <div className={styles.bottomBlock}>
            // {/* <p>About</p>
            // <p>Clubs</p>
            // <p>Communities</p>
             <Link to="/about" className={styles.footerLink}>About</Link>
  <Link to="/clubs" className={styles.footerLink}>Clubs</Link>
  <Link to="/communities" className={styles.footerLink}>Communities</Link>
          </div> */}
          <div className={styles.bottomBlock}>
            <a href="#about" className={styles.footerLink}>About</a>
            <a href="#clubs" className={styles.footerLink}>Clubs</a>
            <a href="#communities" className={styles.footerLink}>Communities</a>
          </div>

          <div className={styles.bottomBlock}>
            <p>Terms and Conditions</p>
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
          </div>

          <div className={styles.bottomBlock}>
            <p style={{ fontWeight: 'bold' }}>Let's chat!</p>
            <p>hi@uconnect.app</p>
            <div className={styles.socialIcons}>
              <FaFacebookF />
              <FaTwitter />
              <FaLinkedinIn />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

// export default Footer;