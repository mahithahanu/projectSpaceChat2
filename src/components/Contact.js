import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X
} from 'phosphor-react';

import { useDispatch, useSelector } from 'react-redux';
import { ToggleSidebar, updateSidebarType } from '../redux/slices/app';
import AntSwitch from "./AntSwitch";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>Block this contact</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Are you sure you want to block this contact?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Yes</Button>
    </DialogActions>
  </Dialog>
);

const DeleteDialog = ({ open, handleClose }) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>Delete this chat</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Are you sure you want to delete the chat?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Yes</Button>
    </DialogActions>
  </Dialog>
);

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { selectedUser } = useSelector((state) => state.app);
  console.log(selectedUser);

  const handleCloseBlock = () => setOpenBlock(false);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px  rgba(0,0,0,0.25)",
            width: "100%",
            backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton onClick={() => dispatch(ToggleSidebar())}>
              <X />
            </IconButton>
          </Stack>
        </Box>

        {/* Body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
          p={3}
          spacing={3}
        >
          {/* Avatar + Name + Email */}
          <Stack alignItems={"center"} direction="row" spacing={2}>
            <Avatar
              src={selectedUser?.avatar || ""}
              alt={selectedUser?.firstName}
              sx={{ height: 64, width: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedUser?.name}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {selectedUser?.email || "No email available"}
              </Typography>
            </Stack>
          </Stack>

          {/* Voice and Video Buttons */}
          <Stack direction="row" alignItems={"center"} justifyContent={"space-evenly"}>
            <Stack spacing={1} alignItems={"center"}>
              <IconButton><Phone /></IconButton>
              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack spacing={1} alignItems={"center"}>
              <IconButton><VideoCamera /></IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>

          <Divider />

          {/* About Section */}
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">About</Typography>
            <Typography variant="body2">{selectedUser?.status || "No status available"}</Typography>
          </Stack>

          <Divider />

          {/* Media, Link, Docs */}
          <Stack direction="row" alignItems={"center"} justifyContent="space-between">
            <Typography variant="subtitle2">Media, Links & Docs</Typography>
            <Button
              endIcon={<CaretRight />}
              onClick={() => dispatch(updateSidebarType("SHARED"))}
            >
              401
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} alignItems={"center"}>
            {[1, 2, 3].map((el) => (
              <Box key={el}>
                <img
                  src="https://via.placeholder.com/100"
                  alt="media"
                  style={{ height: 64, width: 64, borderRadius: 8 }}
                />
              </Box>
            ))}
          </Stack>

          <Divider />

          {/* Starred */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>
            <IconButton onClick={() => dispatch(updateSidebarType("STARRED"))}>
              <CaretRight />
            </IconButton>
          </Stack>

          <Divider />

          {/* Mute */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>

          <Divider />

          {/* Common Groups (Static Placeholder) */}
          <Typography>1 group in common</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="https://via.placeholder.com/64" />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Coding Monk</Typography>
              <Typography variant="subtitle2">Owl, Parrot, Rabbit, You</Typography>
            </Stack>
          </Stack>

          {/* Block & Delete */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button fullWidth startIcon={<Prohibit />} variant="outlined" onClick={() => setOpenBlock(true)}>
              Block
            </Button>
            <Button fullWidth startIcon={<Trash />} variant="outlined" onClick={() => setOpenDelete(true)}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Dialogs */}
      {openBlock && <BlockDialog open={openBlock} handleClose={handleCloseBlock} />}
      {openDelete && <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />}
    </Box>
  );
};

export default Contact;
