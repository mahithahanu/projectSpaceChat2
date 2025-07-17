import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { MagnifyingGlass, Phone } from "phosphor-react";
import { useSelector, useDispatch } from "react-redux";

import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SerachIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";

import { StartAudioCall } from "../../redux/slices/audioCall";

// Slide transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ChatElement component now includes click logic to initiate call
const ChatElement = ({ name, image, id, onCallStart }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        padding: "8px 12px",
        borderRadius: "10px",
        transition: "0.3s",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar src={image || fallback} alt={name} />
        <Typography variant="subtitle1">{name}</Typography>
      </Stack>

      <IconButton
        onClick={() => onCallStart(id)}
        sx={{
          backgroundColor: "#e0e0e0",
          "&:hover": {
            backgroundColor: "#d5d5d5",
          },
          width: 36,
          height: 36,
        }}
      >
        <Phone size={18} />
      </IconButton>
    </Stack>
  );
};

const StartCall = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversation.direct_chat.conversations
  );

  const handleStartCall = (userId) => {
    dispatch(StartAudioCall(userId)); // or StartVideoCall(userId)
    handleClose(); // close dialog
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle>Start a Call</DialogTitle>

      <Stack spacing={3}>
        <Stack p={1} sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
      </Stack>

      <DialogContent dividers sx={{ maxHeight: "400px", overflowY: "auto" }}>
        <Stack spacing={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#676767" }}>
            Available Contacts
          </Typography>

          {conversations && conversations.length > 0 ? (
            conversations.map((el) => {
              const name = el.name || `${el?.firstName ?? "User"} ${el?.lastName ?? ""}`;
              const image = el.image || el.avatar || null;
              const id = el._id || el.id;

              return (
                <ChatElement
                  key={id}
                  name={name}
                  image={image}
                  id={id}
                  onCallStart={handleStartCall}
                />
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>
              No conversations available.
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StartCall;
