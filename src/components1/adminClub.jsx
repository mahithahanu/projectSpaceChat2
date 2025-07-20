import React, { useState } from "react";
import styles from "./FormStyles.module.css";
import axios from "axios";

const toTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AddClub = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    landingHeading: "",
    landingDescription: "",
    landingImage: "",
    galleryImages: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Club name is required.");
      return;
    }

    const clubData = {
      ...formData,
      galleryImages: formData.galleryImages
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img !== ""),
    };

    try {
      await axios.post("https://uconnect-gwif.onrender.com/clubs/newclub", clubData);
      setSuccess("Club added successfully!");
      setFormData({
        name: "",
        description: "",
        image: "",
        landingHeading: "",
        landingDescription: "",
        landingImage: "",
        galleryImages: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to add club.");
      console.error(err);
    }
  };

  const fields = [
    "name",
    "description",
    "image",
    "landingHeading",
    "landingDescription",
    "landingImage",
    "galleryImages",
  ];

  return (
    <div className={styles.formBody}>
    <div className={styles.formContainer}>
      <h2 className={styles.formHeading}>Add New Club</h2>
      {success && <p className={styles.successMsg}>{success}</p>}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field} className={styles.inputGroup}>
            <label>{toTitleCase(field)}</label>
            {field.toLowerCase().includes("description") ? (
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${toTitleCase(field)}`}
                required={field === "name"}
              />
            ) : (
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${toTitleCase(field)}${
                  field === "galleryImages" ? " URLs (comma-separated)" : ""
                }`}
                required={field === "name"}
              />
            )}
            {field === "galleryImages" && (
              <small className={styles.galleryHint}>
                Please enter image URLs separated by commas
              </small>
            )}
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          Add Club
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddClub;
