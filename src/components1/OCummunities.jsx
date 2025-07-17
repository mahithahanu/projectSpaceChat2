// import React, { useEffect, useState } from 'react';
// import styles from './OCommunities.module.css';
// import axios from 'axios';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// const OCommunities = () => {
//     const [communities, setCommunities] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [popupCommunity, setPopupCommunity] = useState(null);
//     const userEmail = localStorage.getItem('userEmail');

//     useEffect(() => {
//         axios.get('http://localhost:5000/api/communities')
//             .then(res => {
//                 setCommunities(res.data);
//                 setFiltered(res.data);
//             });
//     }, []);

//     useEffect(() => {
//         let result = communities;
//         if (selectedCategory !== 'All') {
//             result = result.filter(c => c.category === selectedCategory);
//         }
//         if (searchQuery.trim()) {
//             result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
//         }
//         setFiltered(result);
//     }, [selectedCategory, searchQuery, communities]);

//     const handleJoinConfirm = () => {
//         if (!popupCommunity) return;

//         axios.post('http://localhost:5000/api/communities/join', {
//             email: userEmail,
//             communityId: popupCommunity._id,
//         }).then(() => {
//             setCommunities(prev =>
//                 prev.map(c =>
//                     c._id === popupCommunity._id ? { ...c, members: [...c.members, userEmail] } : c
//                 )
//             );
//             setPopupCommunity(null);
//         });
//     };

//     const categories = ['All', 'Coding', 'Technology', 'Design'];

//     return (
//         <div className={styles.oCommWrapper}>
//             <h1 className={styles.oCommHeading}>DISCOVER COMMUNITIES</h1>

//             <input
//                 type="text"
//                 className={styles.oCommSearch}
//                 placeholder="Search communities..."
//                 onChange={(e) => setSearchQuery(e.target.value)}
//             />

//             <div className={styles.oCommFilters}>
//                 {categories.map(cat => (
//                     <button
//                         key={cat}
//                         className={${styles.oCommFilterBtn} ${selectedCategory === cat ? styles.oCommActive : ''}}
//                         onClick={() => setSelectedCategory(cat)}
//                     >
//                         {cat}
//                     </button>
//                 ))}
//             </div>

//             <div className={styles.oCommGrid}>
//                 {filtered.map(c => (
//                     <div key={c._id} className={styles.oCommCard}>
//                         <div className={styles.oCommImageWrapper}>
//                             <img src={c.image} alt={c.name} className={styles.oCommBanner} />
//                         </div>
//                         <div className={styles.oCommCardInfo}>
//                             <div className={styles.oCommHeaderRow}>
//                                 <div className={styles.oCommLeftDetails}>
//                                     <img src={c.image} alt="avatar" className={styles.oCommAvatar} />
//                                     <div className={styles.oCommName}>{c.name}</div>
//                                 </div>

//                                 <div className={styles.oCommMembers}>
//                                     <i className="fas fa-users"></i>&nbsp;{c.members.length}
//                                 </div>
//                             </div>
//                             {c.members.includes(userEmail) ? (
//                                 <button className={styles.oCommChat}>Chat Now</button>
//                             ) : (
//                                 <button className={styles.oCommJoin} onClick={() => setPopupCommunity(c)}>Join</button>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {popupCommunity && (
//                 <div className={styles.popupOverlay}>
//                     <div className={styles.popupContent}>
//                         <h3>Join Community</h3>
//                         <p>Are you sure you want to join <strong>{popupCommunity.name}</strong>?</p>
//                         <div className={styles.popupButtons}>
//                             <button className={styles.popupConfirm} onClick={handleJoinConfirm}>Confirm</button>
//                             <button className={styles.popupCancel} onClick={() => setPopupCommunity(null)}>Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OCommunities;


import React, { useEffect, useState } from 'react';
import styles from './OCommunities.module.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const OCommunities = () => {
    const [communities, setCommunities] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [popupCommunity, setPopupCommunity] = useState(null);
    const userEmail = localStorage.getItem('user_email');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://uconnect-gwif.onrender.com/communities')
            .then(res => {
                setCommunities(res.data);
                setFiltered(res.data);
            });
    }, []);

    useEffect(() => {
        let result = communities;
        if (selectedCategory !== 'All') {
            result = result.filter(c => c.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFiltered(result);
    }, [selectedCategory, searchQuery, communities]);

    const handleJoinConfirm = () => {
        if (!popupCommunity) return;

        axios.post('https://uconnect-gwif.onrender.com/communities/join', {
            email: userEmail,
            communityId: popupCommunity._id,
        }).then(() => {
            setCommunities(prev =>
                prev.map(c =>
                    c._id === popupCommunity._id
                        ? { ...c, members: [...c.members, userEmail] }
                        : c
                )
            );
            setPopupCommunity(null);
        });
    };

    const categories = ['All', 'Coding', 'Technology', 'Design'];

    return (
        <div className={styles.oCommWrapper}>
            <h1 className={styles.oCommHeading}>DISCOVER COMMUNITIES</h1>

            <input
                type="text"
                className={styles.oCommSearch}
                placeholder="Search communities..."
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className={styles.oCommFilters}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.oCommFilterBtn} ${selectedCategory === cat ? styles.oCommActive : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.oCommGrid}>
                {filtered.map(c => (
                    <div key={c._id} className={styles.oCommCard}>
                        <div className={styles.oCommImageWrapper}>
                            <img src={c.image} alt={c.name} className={styles.oCommBanner} />
                        </div>
                        <div className={styles.oCommCardInfo}>
                            <div className={styles.oCommHeaderRow}>
                                <div className={styles.oCommLeftDetails}>
                                    <img src={c.image} alt="avatar" className={styles.oCommAvatar} />
                                    <div className={styles.oCommName}>{c.name}</div>
                                </div>
                                <div className={styles.oCommMembers}>
                                    <i className="fas fa-users"></i>&nbsp;{c.members.length}
                                </div>
                            </div>

                            {c.members.includes(userEmail) ? (
                                <button
                                    className={styles.oCommChat}
                                    onClick={() => {
                                        const joined = communities.filter(comm =>
                                            comm.members.includes(userEmail)
                                        );
                                        window.localStorage.setItem("joinedCommunities", JSON.stringify(joined));
                                        console.log(joined);
                                        navigate('/app/dashboard');
                                    }}

                                >
                                    Chat Now
                                </button>
                            ) : (
                                <button
                                    className={styles.oCommJoin}
                                    onClick={() => setPopupCommunity(c)}
                                >
                                    Join
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {popupCommunity && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <h3>Join Community</h3>
                        <p>Are you sure you want to join <strong>{popupCommunity.name}</strong>?</p>
                        <div className={styles.popupButtons}>
                            <button className={styles.popupConfirm} onClick={handleJoinConfirm}>Confirm</button>
                            <button className={styles.popupCancel} onClick={() => setPopupCommunity(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OCommunities;