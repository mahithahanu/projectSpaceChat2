import React, { useRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Stack,
} from "@mui/material";
import { Mic, Microphone, MicrophoneSlash, MicSlash } from "phosphor-react";
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

  const handleDisconnect = () => {
    dispatch(ResetAudioCallQueue());
    socket?.off("audio_call_accepted");
    socket?.off("audio_call_denied");
    socket?.off("audio_call_missed");
    zg.stopPublishingStream(streamID);
    zg.stopPlayingStream(userID);
    zg.destroyStream(audioStreamRef.current);
    zg.logoutRoom(roomID);
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
    const timer = setTimeout(() => {
      socket.emit(
        "audio_call_not_picked",
        { to: streamID, from: userID },
        () => {}
      );
    }, 30000);

    socket.on("audio_call_missed", () => {
      handleDisconnect();
    });

    socket.on("audio_call_accepted", () => {
      clearTimeout(timer);
    });

    if (!incoming) {
      socket.emit("start_audio_call", {
        to: streamID,
        from: userID,
        roomID,
      });
    }

    socket.on("audio_call_denied", () => {
      handleDisconnect();
    });

    let this_token;
    async function fetchToken() {
      const response = await axiosInstance.post(
        "/user/generate-zego-token",
        {
          userId: userID,
          room_id: roomID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this_token = response.data.token;
    }

    fetchToken();

    zg.checkSystemRequirements()
      .then((result) => {
        if (result.webRTC && result.microphone) {
          zg.loginRoom(
            roomID,
            this_token,
            { userID, userName },
            { userUpdate: true }
          )
            .then(async () => {
              const localStream = await zg.createStream({
                camera: { audio: true, video: false },
              });

              audioStreamRef.current = localStream;
              const localAudio = document.getElementById("local-audio");
              localAudio.srcObject = localStream;

              zg.startPublishingStream(streamID, localStream);

              zg.on("roomUserUpdate", async (roomID, updateType, userList) => {
                if (updateType !== "ADD") {
                  handleDisconnect();
                } else {
                  const remoteStream = await zg.startPlayingStream(userID);
                  const remoteAudio = document.getElementById("remote-audio");
                  remoteAudio.srcObject = remoteStream;
                  remoteAudio.play();
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleDisconnect}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <Stack direction="row" spacing={6} justifyContent="center" p={2}>
          <Stack alignItems="center">
            <Avatar sx={{ height: 100, width: 100 }} />
            <audio id="local-audio" controls={false} />
          </Stack>
          <Stack alignItems="center">
            <Avatar sx={{ height: 100, width: 100 }} />
            <audio id="remote-audio" controls={false} />
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          <Button
            variant="outlined"
            color={isMuted ? "warning" : "primary"}
            startIcon={isMuted ? <MicrophoneSlash /> : <Microphone />}
            onClick={handleToggleMute}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisconnect} variant="contained" color="error">
          End Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallDialog;
