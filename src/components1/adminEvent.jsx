import React, { useState, useEffect } from "react";
import styles from "./FormStyles.module.css";
import axios from "axios";

const AddEvent = () => {
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState("");
  const [event, setEvent] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get("https://uconnect-gwif.onrender.com/clubs/club");
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setMessage({ type: "error", text: "Failed to load clubs." });
      }
    };
    fetchClubs();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const club = clubs.find((c) => c._id === clubId);
      if (!club) {
        setMessage({ type: "error", text: "Invalid club selection." });
        return;
      }

      const updatedEvents = [...(club.events || []), event];

      await axios.put(`https://uconnect-gwif.onrender.com/clubs/${clubId}`, {
        events: updatedEvents,
      });

      setMessage({ type: "success", text: "✅ Event added successfully!" });
      setEvent("");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to add event." });
    }
  };

  return (
      <div className={styles.formBody}>
    <div className={styles.formContainer}>
      <h2 className={styles.formHeading}>Add Event to Club</h2>

      {message.text && (
        <p
          className={styles.successMsg}
          style={{ color: message.type === "error" ? "red" : "#22c55e" }}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleAddEvent}>
        <div className={styles.inputGroup}>
          <label>Select Club</label>
          <select
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
            required
          >
            <option value="">-- Select Club --</option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Event (e.g., DD-MM-YYYY/Title/Venue/Description)</label>
          <input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Enter event string"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Event
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddEvent;
