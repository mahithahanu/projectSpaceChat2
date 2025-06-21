import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";

import { useSelector } from "react-redux";

import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SerachIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import ChatElement from "../../components/ChatElement";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  // ✅ Get conversations from Redux (same as Chats.js)
  const conversations = useSelector(
    (state) => state.conversation.direct_chat.conversations
  );

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

          {conversations.length > 0 ? (
            conversations.map((el) => (
              <ChatElement key={el.id} {...el} />
            ))
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
