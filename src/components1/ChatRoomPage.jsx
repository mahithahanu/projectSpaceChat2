import React, { useState } from 'react';
import ClubList from './ClubList';
import Chat from './chat';
import './ChatStyles.css';

const ChatRoomPage = () => {
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <div className="chatMainContainer">
      <div className="clubListContainer">
        <ClubList onSelectClub={setSelectedClub} />
      </div>
      <div className="chatWindowContainer">
        <Chat selectedClub={selectedClub} />
      </div>
    </div>
  );
};

export default ChatRoomPage;