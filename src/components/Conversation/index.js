// File: Conversation.js (Updated to use controller for conversation ID)

import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  Sticker,
  User,
  LinkSimple,
  Smiley,
  PaperPlaneTilt,
} from "phosphor-react";
import { styled, useTheme } from "@mui/material/styles";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { socket, connectSocket } from "../../socket";
import CallDialog from "../../sections/dashboard/Audio/callDialog";
import { ResetAudioCallQueue } from "../../redux/slices/audioCall";
import { TextMsg, MediaMsg, LinkMsg, ReplyMsg, DocMsg } from "./MsgTypes";
import Header from "./Header";
import { PushToAudioCallQueue } from "../../redux/slices/audioCall";


const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
  { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
  { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
  { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
  { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

const ChatInput = ({ setOpenPicker, message, setMessage, openActions, setOpenActions }) => (
  <StyledInput
    fullWidth
    placeholder="Write a message..."
    variant="filled"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("send-button")?.click();
      }
    }}
    InputProps={{
      disableUnderline: true,
      startAdornment: (
        <Stack sx={{ width: "max-content" }}>
          <Stack sx={{ position: "relative", display: openActions ? "inline-block" : "none" }}>
            {Actions.map((el, idx) => (
              <Tooltip key={idx} placement="right" title={el.title}>
                <Fab sx={{ position: "absolute", top: -el.y, backgroundColor: el.color }}>
                  {el.icon}
                </Fab>
              </Tooltip>
            ))}
          </Stack>
          <InputAdornment position="start">
            <IconButton onClick={() => setOpenActions(prev => !prev)}>
              <LinkSimple />
            </IconButton>
          </InputAdornment>
        </Stack>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => setOpenPicker(prev => !prev)}>
            <Smiley />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);



const Conversation = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.app);
  const { call_queue } = useSelector((state) => state.audioCall);

  const [conversationId, setConversationId] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const bottomRef = useRef(null);

  const from = localStorage.getItem("user_id");;
  const to = selectedUser?._id;
  console.log(from,to);

  useEffect(() => {
    if (!from) return;

    const setupSocket = async () => {
      try {
        await connectSocket(from);
        console.log("🟢 Socket ready to use");

        socket.on("start_audio_call", ({ call }) => {
        console.log("📞 Incoming call received via socket", call);
        dispatch(
          PushToAudioCallQueue(call) // mark as incoming
        );
      });
      } catch (err) {
        console.error("❌ Failed to connect socket:", err);
      }
    };

    setupSocket();
  }, [from]);

  useEffect(() => {
    if (!from || !to) return;

    const getConversation = async () => {
      try {
        const res = await axios.post("https://uconnect-gwif.onrender.com/chat/conversation-id", { from, to });
        const conversation = res.data.conversation;

        setConversationId(conversation._id);
        setMsgs(conversation.messages || []);

        socket.emit("start_conversation", { from, to });
      } catch (err) {
        console.error("❌ Failed to get or create conversation:", err);
      }
    };

    getConversation();
  }, [from, to]);

  useEffect(() => {
    const handleNewMessage = ({ conversation_id, message }) => {
      if (conversation_id === conversationId) {
        setMsgs((prev) => [...prev, message]);
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSendMessage = async (text) => {
    if (!text || !from || !to || !conversationId) {
      console.warn("🚫 Message is empty or conversation ID missing");
      return;
    }
    try {
      const res = await axios.post("https://uconnect-gwif.onrender.com/chat/send", {
        from,
        to,
        message: text,
        type: "Text",
      });

      const { data } = res.data;

      socket.emit("text_message", {
        conversation_id: conversationId,
        from,
        to,
        message: text,
        type: "Text",
      });

      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handleCloseCallDialog = () => dispatch(ResetAudioCallQueue());

  const MsgComponentMap = {
    Text: TextMsg,
    Media: MediaMsg,
    Document: DocMsg,
    Link: LinkMsg,
    Reply: ReplyMsg,
  };

  return (
    <Stack height="100vh" direction="column">
      <Header />
      <Box flexGrow={1} p={2} sx={{ overflowY: "scroll", scrollbarWidth: "none" }}>
        {msgs.map((msg, idx) => {
          const MsgComponent = MsgComponentMap[msg.type] || (() => <div></div>);
          return <MsgComponent key={idx} el={{ ...msg, incoming: msg.from !== from }} />;
        })}
        <div ref={bottomRef} />
      </Box>

      <Box p={2} sx={{ backgroundColor: theme.palette.background.paper, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)" }}>
        {openPicker && (
          <Box sx={{ display: "inline", zIndex: 10, position: "fixed", bottom: 81, right: 100 }}>
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji.native)}
            />
          </Box>
        )}

        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack sx={{ width: "100%" }}>
            <ChatInput
              setOpenPicker={setOpenPicker}
              message={message}
              setMessage={setMessage}
              openActions={openActions}
              setOpenActions={setOpenActions}
            />
          </Stack>

          <Box sx={{ height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", width: "100%" }}>
              <IconButton id="send-button" onClick={() => handleSendMessage(message)}>
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {call_queue.length > 0 && (
      <CallDialog open={true} handleClose={handleCloseCallDialog} />
    )}
    </Stack>
  );
};

export default Conversation;
