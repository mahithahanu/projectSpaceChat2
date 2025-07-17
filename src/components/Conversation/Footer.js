// // File: components/Conversation/Footer.js

// import React, { useState } from "react";
// import {
//     Stack,
//     Box,
//     IconButton,
//     InputAdornment,
//     TextField,
//     Fab,
//     Tooltip
// } from "@mui/material";
// import { styled, useTheme } from "@mui/material/styles";
// import {
//     Camera,
//     File,
//     Image,
//     Sticker,
//     User,
//     LinkSimple,
//     Smiley,
//     PaperPlaneTilt
// } from "phosphor-react";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// import { socket } from "../../socket"; // ✅ Use Socket.IO
// import axios from "axios";

// // Style for input
// const StyledInput = styled(TextField)(({ theme }) => ({
//     "& .MuiInputBase-input": {
//         paddingTop: "12px",
//         paddingBottom: "12px",
//     }
// }));

// const Actions = [
//     { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
//     { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
//     { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
//     { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
//     { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
// ];

// // Chat input with emoji and action buttons
// const ChatInput = ({ setOpenPicker, message, setMessage, openActions, setOpenActions }) => {
//     return (
//         <StyledInput
//             fullWidth
//             placeholder="Write a message..."
//             variant="filled"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//                 if (e.key === "Enter") e.preventDefault(); // prevent newline
//             }}
//             InputProps={{
//                 disableUnderline: true,
//                 startAdornment: (
//                     <Stack sx={{ width: "max-content" }}>
//                         <Stack sx={{ position: "relative", display: openActions ? "inline-block" : "none" }}>
//                             {Actions.map((el, idx) => (
//                                 <Tooltip key={idx} placement="right" title={el.title}>
//                                     <Fab sx={{ position: "absolute", top: -el.y, backgroundColor: el.color }}>
//                                         {el.icon}
//                                     </Fab>
//                                 </Tooltip>
//                             ))}
//                         </Stack>
//                         <InputAdornment position="start">
//                             <IconButton onClick={() => setOpenActions(prev => !prev)}>
//                                 <LinkSimple />
//                             </IconButton>
//                         </InputAdornment>
//                     </Stack>
//                 ),
//                 endAdornment: (
//                     <InputAdornment position="end">
//                         <IconButton onClick={() => setOpenPicker(prev => !prev)}>
//                             <Smiley />
//                         </IconButton>
//                     </InputAdornment>
//                 ),
//             }}
//         />
//     );
// };

// // ✅ Main Footer component
// const Footer = ({ from, to, conversationId, onMessageSent }) => {
//     const theme = useTheme();
//     const [openPicker, setOpenPicker] = useState(false);
//     const [openActions, setOpenActions] = useState(false);
//     const [message, setMessage] = useState("");
//      const [msgs, setMsgs] = useState([]);
//       const [convId, setConvId] = useState(null);

// // const handleSendMessage = () => {
// //     const trimmedMsg = message.trim();

// //     if (!trimmedMsg || !conversationId) {
// //         console.warn("Message is empty or conversation ID missing");
// //         return;
// //     }

// //     console.log("📤 Sending message:");
// //     console.log("   ✅ from:", from);
// //     console.log("   ✅ to:", to);
// //     console.log("   ✅ conversationId:", conversationId);
// //     console.log("   ✅ message:", trimmedMsg);

// //     // Emit via socket
// //     socket.emit("text_message", {
// //         from,
// //         to,
// //         conversation_id: conversationId,
// //         message: trimmedMsg,
// //         type: "Text",
// //     });

// //     // Inform parent
// //     if (typeof onMessageSent === "function") {
// //         console.log("📡 Calling onMessageSent callback with message:", trimmedMsg);
// //         onMessageSent(trimmedMsg);
// //     }

// //     console.log("📌 Footer loaded with:", { from, to, conversationId });


// //     setMessage(""); // Clear the input field
// // };
//  const handleSendMessage = async (text) => {
//     if (!text || !from || !to || !convId) return;

//     try {
//       const res = await axios.post("http://localhost:3001/api/chat/send", {
//         from,
//         to,
//         message: text,
//         type: "Text",
//       });
//       console.log(to);
//       const { data } = res.data;

//       socket.emit("text_message", {
//         conversation_id: convId,
//         from,
//         to,
//         message: text,
//         type: "Text",
//       });

//       setMsgs((prev) => [...prev, data]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//     return (
//         <Box
//             p={2}
//             sx={{
//                 width: "100%",
//                 backgroundColor:
//                     theme.palette.mode === "light"
//                         ? "#F8FAFF"
//                         : theme.palette.background.paper,
//                 boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
//             }}
//         >
//             <Stack direction="row" alignItems="center" spacing={3}>
//                 <Stack sx={{ width: "100%" }}>
//                     {openPicker && (
//                         <Box
//                             sx={{
//                                 display: "inline",
//                                 zIndex: 10,
//                                 position: "fixed",
//                                 bottom: 81,
//                                 right: 100,
//                             }}
//                         >
//                             <Picker
//                                 theme={theme.palette.mode}
//                                 data={data}
//                                 onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji.native)}
//                             />
//                         </Box>
//                     )}
//                     <ChatInput
//                         setOpenPicker={setOpenPicker}
//                         message={message}
//                         setMessage={setMessage}
//                         openActions={openActions}
//                         setOpenActions={setOpenActions}
//                     />
//                 </Stack>

//                 <Box
//                     sx={{
//                         height: 48,
//                         width: 48,
//                         backgroundColor: theme.palette.primary.main,
//                         borderRadius: 1.5,
//                     }}
//                 >
//                     <Stack
//                         sx={{ height: "100%", width: "100%" }}
//                         alignItems="center"
//                         justifyContent="center"
//                     >
//                         <IconButton onClick={handleSendMessage}>
//                             <PaperPlaneTilt color="#fff" />
//                         </IconButton>
//                     </Stack>
//                 </Box>
//             </Stack>
//         </Box>
//     );
// };

// export default Footer;
import React, { useState, useEffect } from "react";
import {
    Stack,
    Box,
    IconButton,
    InputAdornment,
    TextField,
    Fab,
    Tooltip
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
    Camera,
    File,
    Image,
    Sticker,
    User,
    LinkSimple,
    Smiley,
    PaperPlaneTilt
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";
import axios from "axios";

// Styled Input
const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
        paddingTop: "12px",
        paddingBottom: "12px",
    }
}));

const Actions = [
    { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
    { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
    { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
    { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
    { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

// Chat Input Component
const ChatInput = ({ setOpenPicker, message, setMessage, openActions, setOpenActions }) => {
    return (
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
};

// ✅ Footer Component
const Footer = ({ from, to, conversationId, onMessageSent }) => {
    const theme = useTheme();
    const [openPicker, setOpenPicker] = useState(false);
    const [openActions, setOpenActions] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("📦 Footer Props:", { from, to, conversationId });
    }, [from, to, conversationId]);

    const handleSendMessage = async (text) => {
        if (!text || !from || !to || !conversationId) {
            console.warn("🚫 Message is empty or conversation ID missing");
            return;
        }

        try {
            const res = await axios.post("https://uconnect-gwif.onrender.com/api/chat/send", {
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

            if (typeof onMessageSent === "function") {
                onMessageSent(data);
            }

            setMessage(""); // Clear input
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    return (
        <Box
            p={2}
            sx={{
                width: "100%",
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
                boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={3}>
                <Stack sx={{ width: "100%" }}>
                    {openPicker && (
                        <Box
                            sx={{
                                display: "inline",
                                zIndex: 10,
                                position: "fixed",
                                bottom: 81,
                                right: 100,
                            }}
                        >
                            <Picker
                                theme={theme.palette.mode}
                                data={data}
                                onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji.native)}
                            />
                        </Box>
                    )}
                    <ChatInput
                        setOpenPicker={setOpenPicker}
                        message={message}
                        setMessage={setMessage}
                        openActions={openActions}
                        setOpenActions={setOpenActions}
                    />
                </Stack>

                <Box
                    sx={{
                        height: 48,
                        width: 48,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1.5,
                    }}
                >
                    <Stack
                        sx={{ height: "100%", width: "100%" }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <IconButton
                            id="send-button"
                            onClick={() => handleSendMessage(message)}
                            disabled={!message.trim() || !from || !to || !conversationId}
                        >
                            <PaperPlaneTilt color="#fff" />
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default Footer;
