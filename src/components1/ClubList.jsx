
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatStyles.css'; // Import shared CSS

const ClubList = ({ onSelectClub }) => {
    const [clubs, setClubs] = useState([]);
    const userEmail =  window.localStorage.getItem("user_email");

    useEffect(() => {
        axios.get(`http://localhost:3001/clubs/by-user/email?email=${userEmail}`)


            .then(res => setClubs(res.data))
            .catch(err => console.error(err));
    }, [userEmail]);

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
        </div>
    );
};

export default ClubList;