import { Box, IconButton, Typography, useTheme, Stack, Tab, Tabs, Grid } from "@mui/material";
import { CaretLeft, X } from "phosphor-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSidebarType } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import { SHARED_DOCS, SHARED_LINKS } from "../data";
import { DocMsg, LinkMsg } from "./Conversation/MsgTypes";
import Message from "./Conversation/Message";

const StarredMessages = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    return (
        <Box sx={{ width: 320, height: "100vh" }}>
            <Stack sx={{ height: "100%" }}>
                <Box sx={{
                    boxShadow: "0px 0px 2px  rgba(0,0,0,0.25)",
                    width: "100%",
                    backgroundColor: theme.palette.mode == "light" ? "#F8FAFF" : theme.palette.background,
                }}>
                    <Stack sx={{ height: "100%", p: 2 }} direction="row" alignItems="center" spacing={3}>
                        <IconButton onClick={() => {
                            dispatch(updateSidebarType("CONTACT"));
                        }}>
                            <CaretLeft />
                        </IconButton>
                        <Typography variant='Subtitle2'>Shared Messages</Typography>

                    </Stack>

                </Box>


                {/*body */}
                <Stack sx={{ height: "100%", position: "relative", flexGrow: 1, overflowY: "scroll", scrollbarWidth: "none", }} p={3} 
                spacing={3}>
                  
                        <Message />
                </Stack>
            </Stack>
        </Box>
    )

}

export default StarredMessages;