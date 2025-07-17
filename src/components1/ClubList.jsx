import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatStyles.css';
import { useNavigate } from 'react-router-dom';

const ClubList = ({ onSelectClub }) => {
    const [clubs, setClubs] = useState([]);
    const [showLogout, setShowLogout] = useState(false);
    const userEmail = window.localStorage.getItem("user_email");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://uconnect-gwif.onrender.com/clubs/by-user/email?email=${userEmail}`)
            .then(res => setClubs(res.data))
            .catch(err => console.error(err));
    }, [userEmail]);

    const handleLogout = () => {
        // window.localStorage.removeItem("user_email"); // Clear stored user data
        navigate("/nxthome"); // Navigate to homepage
    };

    return (
        <div className="clubList">
            <h2 className="title">My Groups</h2>
            <ul className="clubListItems">
                {clubs.map(club => (
                    <li key={club._id} className="clubItem">
                        <button className="clubButton" onClick={() => onSelectClub(club)}>
                            <img src={club.image} alt={club.name} className="clubImage" />
                            <span>{club.name}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Avatar and Logout Popup */}
            <div className="bottomLeftAvatar">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="Contact Avatar"
                    className="bottomLeftImage"
                    onClick={() => setShowLogout(!showLogout)}
                />
                {showLogout && (
                    <div className="logoutPopup" onClick={handleLogout}>
                        Logout
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubList;