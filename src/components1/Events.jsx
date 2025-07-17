import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Events.module.css';

const Events = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', rollNo: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`https://uconnect-gwif.onrender.com/clubs/${clubId}`);
        // console.log(res.data);
        setClub(res.data);
        setGalleryImages(res.data.galleryImages || []);
        const userEmail = localStorage.getItem('user_email');
        // console.log(userEmail);
        if (userEmail && res.data.registeredUsersData?.some(user => user.email === userEmail.toLowerCase())) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error('Error fetching club data:', err);
      }
    };

    fetchClub();
  }, [clubId]);

  const isPastEvent = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateFields = () => {
    const newErrors = {};
    ['name', 'rollNo', 'email', 'phone'].forEach(field => {
      if (!formData[field].trim()) newErrors[field] = 'This field is mandatory';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`https://uconnect-gwif.onrender.com/clubs/${clubId}/register-details`, formData);
      localStorage.setItem('userEmail', formData.email);
      setIsRegistered(true);
      setShowForm(false);
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.response?.data?.error || 'Registration error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilteredEvents = () => {
    if (!club?.events) return [];
    return club.events.filter(eventStr => {
      const [date] = eventStr.split('/');
      const past = isPastEvent(date);
      if (filter === 'upcoming') return !past;
      if (filter === 'completed') return past;
      return true;
    });
  };

  return (
    <div className={styles.container}>
      {/* SaaS Threads Background */}
      <div className={styles.threadsBackground}></div>

      {club?.landingHeading && (
        <div className={styles.landingSection}>
          <div className={styles.left}>
            <h1>{club.landingHeading}</h1>
            <p>{club.landingDescription}</p>
            {isRegistered ? (
              <button className={styles.registerBtn}  onClick={() => navigate("/AllClubs")}>Chat</button>
            ) : (
              <button className={styles.registerBtn} onClick={() => setShowForm(true)}>Register</button>
            )}
          </div>
          <div className={styles.right}>
            <img src={club.landingImage} alt="Club" />
          </div>
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className={styles.galleryContainer}>
          <h2>CLUB GALLERY</h2>
          <p>Memories from our recent events and activities.</p>
          <div className={styles.galleryGrid}>
            {galleryImages.map((img, idx) => (
              <div key={idx} className={styles.galleryCard}>
                <img src={img} alt={`Gallery ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.eventsWrapper}>
        <h2>{club?.name} - Events</h2>
        <div className={styles.filterBar}>
          <p>{club?.description}</p>
          <div className={styles.filterButtons}>
            <button className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`${styles.filterBtn} ${filter === 'upcoming' ? styles.activeFilter : ''}`} onClick={() => setFilter('upcoming')}>Upcoming</button>
            <button className={`${styles.filterBtn} ${filter === 'completed' ? styles.activeFilter : ''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
        </div>



        <div className={styles.cardGrid}>
          {getFilteredEvents().map((eventStr, idx) => {
            const [date, name, venue, description] = eventStr.split('/');
            const past = isPastEvent(date);
            return (
              <div key={idx} className={styles.eventCard}>
                <div className={`${styles.badge} ${past ? styles.badgeCompleted : styles.badgeUpcoming}`}>
                  {past ? 'Event Completed' : 'Upcoming Event'}
                </div>
                <h3>{name}</h3>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Venue:</strong> {venue}</p>
                <p><strong>Description:</strong> {description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Register for {club?.name}</h2>
            {['name', 'rollNo', 'email', 'phone'].map(field => (
              <div key={field} className={styles.formGroup}>
                <input
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                {errors[field] && <span className={styles.error}>{errors[field]}</span>}
              </div>
            ))}
            <div className={styles.modalButtons}>
              <button onClick={handleSubmit} className={styles.registerBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;