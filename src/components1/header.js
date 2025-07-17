import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email'));
  const navigate = useNavigate();
  const isAdmin = window.localStorage.getItem("is_admin")==="true";
  console.log(isAdmin);
console.log("Type:", typeof isAdmin); 


  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    window.localStorage.removeItem('user_email');
    window.localStorage.removeItem('user_id');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('is_admin');
    setUserEmail(null);
    setDropdownOpen(false);
    navigate('/login/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.left}>
          <img src="uclogo.jpg" alt="Logo" className={styles.logo} />
          <span className={styles.siteName}>UConnect</span>
        </div>

        <nav className={styles.nav}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#about" className={styles.navLink}>About</a>
          <a href="#clubs" className={styles.navLink}>Clubs</a>
          <a href="#communities" className={styles.navLink}>Communities</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </nav>

        <div className={styles.right}>
          {userEmail && (
            <div className={`${styles.userMenu} ${styles.desktopOnly}`}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={styles.userButton}
              >
                <span className={styles.profileCircle}>🧑‍🎓</span>
                {userEmail.slice(0, 10).toUpperCase()}
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownItem}>{userEmail}</div>

                  {isAdmin && (
                    <>
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          navigate("/nxthome/add-club");
                          setDropdownOpen(false);
                        }}
                      >
                        Add Club
                      </div>
                      <div
                        className={styles.dropdownItem}
                        onClick={() => {
                          navigate("/nxthome/add-event");
                          setDropdownOpen(false);
                        }}
                      >
                        Add Event
                      </div>
                    </>
                  )}

                  <button className={styles.dropdownItem} onClick={handleLogout}>Logout</button>
                </div>
              )}

            </div>
          )}

          <button
            onClick={toggleMenu}
            className={styles.menuButton}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <a href="#home" onClick={toggleMenu}>Home</a>
        <a href="#about" onClick={toggleMenu}>About</a>
        <a href="#clubs" onClick={toggleMenu}>Clubs</a>
        <a href="#communities" onClick={toggleMenu}>Communities</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
        <button className={styles.authButton} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
