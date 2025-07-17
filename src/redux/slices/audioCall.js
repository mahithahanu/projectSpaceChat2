import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../socket";
import axios from "../../utils/axios";

const initialState = {
  open_audio_dialog: false,
  open_audio_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
  incoming: false,
};

const slice = createSlice({
  name: "audioCall",
  initialState,
  reducers: {
    pushToAudioCallQueue(state, action) {
      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload.call);
        if (action.payload.incoming) {
          state.open_audio_notification_dialog = true;
          state.incoming = true;
        } else {
          state.open_audio_dialog = true;
          state.incoming = false;
        }
      } else {
        socket.emit("user_is_busy_audio_call", { ...action.payload });
      }
    },

    resetAudioCallQueue(state) {
      state.call_queue = [];
      state.open_audio_notification_dialog = false;
      state.open_audio_dialog = false;
      state.incoming = false;
    },

    closeNotificationDialog(state) {
      state.open_audio_notification_dialog = false;
    },

    updateCallDialog(state, action) {
      state.open_audio_dialog = action.payload.state;
      state.open_audio_notification_dialog = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const StartAudioCall = (id) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetAudioCallQueue());
    axios
      .post(
        "/user/start-audio-call",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.pushToAudioCallQueue({
            call: response.data.data,
            incoming: false,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// ✅ Add this to END the audio call
export const EndAudioCall = (callId) => {
  return async (dispatch, getState) => {
    try {
      await axios.post(
        "/user/end-call",
        { id: callId, type: "audio", verdict: "Ended" }, // <-- callId might be undefined
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );

      dispatch(slice.actions.resetAudioCallQueue());
    } catch (error) {
      console.error("Failed to end audio call:", error);
    }
  };
};


export const PushToAudioCallQueue = (call) => {
  return async (dispatch) => {
    dispatch(slice.actions.pushToAudioCallQueue({ call, incoming: true }));
  };
};

export const ResetAudioCallQueue = () => {
  return async (dispatch) => {
    dispatch(slice.actions.resetAudioCallQueue());
  };
};

export const CloseAudioNotificationDialog = () => {
  return async (dispatch) => {
    dispatch(slice.actions.closeNotificationDialog());
  };
};

export const UpdateAudioCallDialog = ({ state }) => {
  return async (dispatch) => {
    dispatch(slice.actions.updateCallDialog({ state }));
  };
};
