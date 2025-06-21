import React from 'react';
import {
  Stack,
  Box,
} from "@mui/material";
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import { useDispatch, useSelector } from 'react-redux';
import CallDialog from '../../sections/dashboard/Audio/callDialog';
import { ResetAudioCallQueue } from '../../redux/slices/audioCall';




const Conversation = () => {

    const dispatch = useDispatch();
  const { call_queue } = useSelector((state) => state.audioCall);

   const handleCloseCallDialog = () => {
    dispatch(ResetAudioCallQueue());
  };

  return (
    <Stack
      height="100vh"
      direction="column"
      sx={{ display: "flex" }}
    >
      {/* Chat Header */}
      <Header/>

      {/* Message Area */}
      <Box
        width="100%"
        sx={{ flexGrow: 1, overflowY: "scroll", scrollbarWidth: "none", height:"100%",p: 2 }}
      >
        <Message menu={true}/>
      </Box>

      {/* Chat Footer */}
      <Footer/>

       {call_queue.length > 0 && (
        <CallDialog open={true} handleClose={handleCloseCallDialog} />
      )}
      
    </Stack>
  );
};

export default Conversation;