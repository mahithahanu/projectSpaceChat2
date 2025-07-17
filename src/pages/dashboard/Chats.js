import { Box, IconButton, Stack, Typography, InputBase, Button, Divider, Avatar, Badge } from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass, User, Users } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles"

import { faker } from "@faker-js/faker"
import { animate } from "framer-motion";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SerachIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations, SetCurrentConversation } from "../../redux/slices/conversation";

import { setSelectedUser } from "../../redux/slices/app";

const user_id = window.localStorage.getItem("user_id");

const Chats = () => {
    const theme = useTheme();
    const [OpenDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const conversations = useSelector(
        (store) => store.conversation?.direct_chat?.conversations || []
    );


    useEffect(() => {
        socket.emit("get_direct_conversations", { user_id }, (data) => {
            console.log(data); // this data is the list of conversations
            // dispatch action

            dispatch(FetchDirectConversations({ conversations: data }));
        });
    }, []);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    return (
        <>
            <Box sx={{
                position: "relative", width: 320, backgroundColor: theme.palette.mode == "light" ? "#F8FAFF" : theme.palette.background.paper
                , boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            }}>
                <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
                    <Stack direction="row" alignItems={"center"}
                        justifyContent="space-between">
                        <Typography variant="h5">
                            Chats
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton onClick={() => {
                                handleOpenDialog();
                            }}>
                                <Users />
                            </IconButton>
                            {/* <IconButton>
                                <CircleDashed />
                            </IconButton> */}
                        </Stack>
                    </Stack>
                    <Stack sx={{ width: "100%" }}>
                        <Search>
                            <SearchIconWrapper>
                                <MagnifyingGlass color="#709CE6" spacing={2} />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                        </Search>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack direction={"row"} alignItems="center" spacing={1.5}>
                            <ArchiveBox size={24} />
                            {/* <Button>Archive</Button> */}
                        </Stack>
                        <Divider />
                    </Stack>
                    <Stack spacing={2} direction="column" sx={{
                        flexGrow: 1, overflow: "scroll", overflowX: "hidden",
                        scrollbarWidth: "none",
                        height: "100%"
                    }}>
                        <SimpleBarStyle timeout={500} clickOnTrack={false}>
                            {/* <Stack spacing={2.4}>
                            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                Pinned
                            </Typography>
                            {ChatList.filter((el) => el.pinned).map((el) => {
                                return <ChatElement {...el} />
                            })}
                        </Stack> */}
                            <Stack spacing={2.4}>
                                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                                    All Chats
                                </Typography>
                                {conversations
                                    .filter((el) =>
                                        (el.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((el) => {
                                        return (
                                            <div
                                                key={el.id || el._id}
                                                onClick={() => {
                                                    dispatch(SetCurrentConversation(el));
                                                    dispatch(setSelectedUser({
                                                        _id: el.user_id,
                                                        name: el.name,
                                                        about: el.about,
                                                        online: el.online,
                                                        img: el.img,
                                                    }));
                                                }}
                                                 style={{ cursor: "pointer" }} 
                                            >
                                                <ChatElement {...el} />
                                            </div>
                                        );
                                    })}



                            </Stack>
                        </SimpleBarStyle>
                    </Stack>
                </Stack>
            </Box>

            {
                OpenDialog && (
                    <Friends open={OpenDialog} handleClose={handleCloseDialog} />
                )
            }
        </>
    )
}

export default Chats;