import { Avatar, Box, Divider, IconButton, Stack, Switch, useTheme } from "@mui/material";
import { Gear, Palette } from "phosphor-react";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Nav_Buttons } from "../../data";
import { useState } from "react";
import { faker } from '@faker-js/faker';
import { styled } from "@mui/material";
import useSettings from "../../hooks/useSettings";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { SelectConversation } from "../../redux/slices/app";
import { AddDirectConversation, UpdateDirectConversation } from "../../redux/slices/conversation";
import { toast } from "react-toastify";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const {conversations}=useSelector((state)=>state.conversation.direct_chat);

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      // ✅ Prevent infinite reload by using a localStorage flag
      const alreadyReloaded = localStorage.getItem("alreadyReloaded");

      if (!alreadyReloaded) {
        localStorage.setItem("alreadyReloaded", "true");
        window.location.reload();
        return; // important to prevent further execution in this render
      }

      // ✅ Connect socket only if not connected
      if (!socket) {
        connectSocket(user_id);
      }

      // ✅ Setup listeners
      socket.on("new-friend-request", (data) => {
        toast.success("You got a friend request");
      });

      socket.on("request_accepted", (data) => {
       toast.success("request accepted");
      });

      socket.on("request_sent", (data) => {
       toast.success("friend request sent successfully");
      });

      socket.on("start_chat",(data)=>{
          console.log(data);
          const existing_conversation =conversations.find((el)=>el.id===data._id);
          if(existing_conversation){
            dispatch(UpdateDirectConversation({conversation:data}));
          }else{
              dispatch(AddDirectConversation({ conversation: data }));
          }
          dispatch(SelectConversation({ room_id: data._id }));
      })
    }

    return () => {
      // ✅ Cleanup listeners to avoid memory leaks
      if (socket) {
        socket?.off("new-friend-request");
        socket?.off("request_accepted");
        socket?.off("request_sent");
          socket?.off("start_call");
      }
    };
  }, [isLoggedIn]);

  return (
    <Stack direction={"row"}>
      {/* Sidebar */}
      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
