import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Chats from "./Chats";
import { useTheme } from '@mui/material/styles';
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import { useDispatch, useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import NoChat from "../../assets/Illustration/NoChat";
import { SelectConversation } from "../../redux/slices/app";
import { connectSocket, socket } from "../../socket";

const GeneralApp = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const currentUser = window.localStorage.getItem("user_id");

  const { sidebar, chat_type, room_id } = useSelector((store) => store.app);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      connectSocket(currentUser._id); 
    }

    dispatch(SelectConversation({ room_id: null }));

    return () => {
      if (currentUser && currentUser._id && socket) {
        socket.emit("end", { user_id: currentUser._id });
        socket.disconnect();
      }
    };
  }, [dispatch, currentUser]);


  if (!currentUser) {
    return (
      <Stack
        sx={{
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Please login to view chats.</Typography>
      </Stack>
    );
  }

  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      <Chats />
      <Box
        sx={{
          height: "100%",
          width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#fff"
              : theme.palette.background.default,
        }}
      >
        {room_id != null && chat_type === "individual" ? (
          <Conversation currentUser={currentUser} />
        ) : (
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            spacing={2}
          >
            <NoChat />
            <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
              Select a conversation to start chatting
            </Typography>
          </Stack>
        )}
      </Box>

      {sidebar.open && (
        <>
          {sidebar.type === "CONTACT" && <Contact />}
          {sidebar.type === "SHARED" && <SharedMessages />}
          {sidebar.type === "STARRED" && <StarredMessages />}
        </>
      )}
    </Stack>
  );
};

export default GeneralApp;
