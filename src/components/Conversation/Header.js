import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  CaretDown,
  MagnifyingGlass,
  Phone,
  VideoCamera,
} from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
// import { StartVideoCall } from "../../redux/slices/videoCall";
import { StartAudioCall } from "../../redux/slices/audioCall";
import axios from "axios";

// ✅ Your reusable components
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SerachIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";

// Styled online badge
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

const Conversation_Menu = [
  { title: "Contact info" },
  { title: "Mute notifications" },
  { title: "Clear messages" },
  { title: "Delete chat" },
];

const ChatHeader = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  console.log(current_conversation);

  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] =
    useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openConversationMenu = Boolean(conversationMenuAnchorEl);

  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };

  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  const handleDeleteChat = async () => {
    const conversationId = current_conversation.id;
    if (!conversationId) {
      console.warn("No conversation ID found.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/chat/delete-chat", {
        conversation_id: conversationId,
      });

      if (res.data.success) {
        console.log("✅ Chat deleted successfully");
      }
    } catch (error) {
      console.error("❌ Failed to delete chat:", error);
    }
  };

  return (
    <Box
      px={2}
      py={1.5}
      width={"100%"}
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background,
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        sx={{ width: "100%" }}
        justifyContent="space-between"
      >
        {/* Left - User Info */}
        <Stack
          onClick={() => dispatch(ToggleSidebar())}
          spacing={2}
          direction="row"
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt={current_conversation?.name}
                src={current_conversation?.img}
              />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">
              {current_conversation?.name}
            </Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>

        {/* Right - Actions */}
        <Stack direction={"row"} alignItems="center" spacing={2}>
          {/* <IconButton
            onClick={() =>
              dispatch(StartVideoCall(current_conversation.user_id))
            }
          >
            <VideoCamera />
          </IconButton> */}

          <IconButton
            onClick={() =>
              dispatch(StartAudioCall(current_conversation.user_id))
            }
          >
            <Phone />
          </IconButton>

          {/* ✅ Reusable Search Input */}
          {!isMobile && (
            <Box
              sx={{
                width: searchMode ? "200px" : "auto",
                transition: "width 0.3s",
              }}
            >
              {searchMode ? (
                <Search sx={{ borderBottom: "2px solid #0046C8" }}>
                  <SearchIconWrapper>
                    <MagnifyingGlass color="#0046C8" size={20} />
                  </SearchIconWrapper>
                  <StyledInputBase
                    autoFocus
                    placeholder="Search within chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setSearchMode(false)}
                  />
                </Search>
              ) : (
                <IconButton onClick={() => setSearchMode(true)}>
                  <MagnifyingGlass />
                </IconButton>
              )}
            </Box>
          )}

          <Divider orientation="vertical" flexItem />

          <IconButton
            id="conversation-positioned-button"
            aria-controls={
              openConversationMenu ? "conversation-positioned-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={openConversationMenu ? "true" : undefined}
            onClick={handleClickConversationMenu}
          >
            <CaretDown />
          </IconButton>
          <Menu
            MenuListProps={{ "aria-labelledby": "fade-button" }}
            TransitionComponent={Fade}
            id="conversation-positioned-menu"
            anchorEl={conversationMenuAnchorEl}
            open={openConversationMenu}
            onClose={handleCloseConversationMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box p={1}>
              <Stack spacing={1}>
                {Conversation_Menu.map((el, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => {
                      handleCloseConversationMenu();
                      if (el.title === "Delete chat") {
                        handleDeleteChat();
                      } else if (el.title === "Contact info") {
                        dispatch(ToggleSidebar());
                      }
                    }}
                  >
                    <Stack
                      sx={{ minWidth: 100 }}
                      direction="row"
                      alignItems={"center"}
                      justifyContent="space-between"
                    >
                      <span>{el.title}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatHeader;
