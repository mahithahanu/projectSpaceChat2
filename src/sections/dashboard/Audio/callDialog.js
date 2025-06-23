import React, { useRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  Slide,
  Stack,
} from "@mui/material";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../utils/axios";
import { socket } from "../../../socket";
import { ResetAudioCallQueue } from "../../../redux/slices/audioCall";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CallDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const audioStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const { user } = useSelector((state) => state.app);
  const [call_details] = useSelector((state) => state.audioCall.call_queue);
  const { incoming } = useSelector((state) => state.audioCall);
  const { token } = useSelector((state) => state.auth);

  const appID = 688834097;
  const server = "wss://webliveroom688834097-api.coolzcloud.com/ws";
  const roomID = call_details?.roomID;
  const userID = call_details?.userID;
  const userName = call_details?.userName;
  const streamID = call_details?.streamID;

  const zg = new ZegoExpressEngine(appID, server);

  const stopRingtone = () => {
    const ringtone = document.getElementById("ringtone");
    if (ringtone) {
      ringtone.pause();
      ringtone.currentTime = 0;
    }
  };

  const handleDisconnect = async () => {
    try {
      await axiosInstance.post(
        "/user/end-call",
        { id: call_details._id, type: "audio", verdict: "Ended" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to notify backend:", error);
    }

    stopRingtone();
    dispatch(ResetAudioCallQueue());

    socket?.off("audio_call_accepted");
    socket?.off("audio_call_denied");
    socket?.off("audio_call_missed");

    try {
      zg.stopPublishingStream(streamID);
      zg.stopPlayingStream(userID);
      if (audioStreamRef.current) {
        zg.destroyStream(audioStreamRef.current);
      }
      zg.logoutRoom(roomID);
    } catch (err) {
      console.warn("Zego cleanup warning:", err);
    }

    handleClose();
  };

  const handleToggleMute = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  useEffect(() => {
    let timer;
    let statusInterval;
    const ringtone = document.getElementById("ringtone");

    const setupCall = async () => {
      try {
        statusInterval = setInterval(async () => {
          try {
            const res = await axiosInstance.get(`/user/get-call-status/${call_details._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const backendStatus = res?.data?.status;
            if (backendStatus === "Ongoing") {
              if (ringtone?.paused) await ringtone.play();
            }
            if (backendStatus === "Ended") {
              stopRingtone();
              clearInterval(statusInterval);
              handleDisconnect();
            }
          } catch (err) {
            console.error("Error polling call status:", err);
          }
        }, 2000);

        socket.on("audio_call_missed", () => {
          stopRingtone();
          handleDisconnect();
        });
        socket.on("audio_call_accepted", () => {
          clearTimeout(timer);
          stopRingtone();
        });
        socket.on("audio_call_denied", () => {
          stopRingtone();
          handleDisconnect();
        });

        if (!incoming) {
          socket.emit("start_audio_call", { to: streamID, from: userID, roomID });
        }

        const response = await axiosInstance.post(
          "/user/generate-zego-token",
          { userId: userID, room_id: roomID },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const this_token = response?.data?.token;

        if (!this_token || !roomID || !userID) return;

        const requirements = await zg.checkSystemRequirements();
        if (requirements.webRTC && requirements.microphone) {
          await zg.loginRoom(
            roomID,
            this_token,
            { userID, userName },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({ audio: true });
          audioStreamRef.current = localStream;
          const localAudio = document.getElementById("local-audio");
          localAudio.srcObject = localStream;

          zg.startPublishingStream(streamID, localStream);

          zg.on("roomUserUpdate", async (_, updateType, userList) => {
            if (updateType === "DELETE") handleDisconnect();
            else if (updateType === "ADD" && userList.length > 0) {
              const remoteUserID = userList[0]?.userID;
              if (remoteUserID && remoteUserID !== userID) {
                try {
                  const remoteStream = await zg.startPlayingStream(remoteUserID);
                  const remoteAudio = document.getElementById("remote-audio");
                  remoteAudio.srcObject = remoteStream;
                  await remoteAudio.play();
                } catch (err) {
                  console.error("Remote stream play failed:", err);
                }
              }
            }
          });
        }
      } catch (err) {
        console.error("Zego setup error:", err);
      }
    };

    setupCall();

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
      stopRingtone();
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xs"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(3px)",
        },
      }}
      PaperProps={{
        sx: {
          m: "auto",
          textAlign: "center",
          borderRadius: 3,
          p: 4,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
        },
      }}
    >
      <audio id="ringtone" src="/audio/ringtone-126505.mp3" loop />

      <Avatar sx={{ height: 90, width: 90, margin: "0 auto" }}>
        {userName?.charAt(0)?.toUpperCase() || "U"}
      </Avatar>
      <h3>{userName || "Unknown User"}</h3>
      <p>{incoming ? "Incoming Call..." : "Calling..."}</p>

      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        {incoming ? (
          <>
            <Button variant="contained" color="error" onClick={handleDisconnect}>
              Decline
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => socket.emit("audio_call_accepted")}
            >
              Accept
            </Button>
          </>
        ) : (
          <Button variant="contained" color="error" onClick={handleDisconnect}>
            End
          </Button>
        )}
      </Stack>
    </Dialog>
  );
};

export default CallDialog;
