import { createSlice } from "@reduxjs/toolkit";

// import { dispatch } from "../store";
import axios from "axios";


const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },
  users: [],
  friends: [],
  friendRequests: [],
  chat_type:null,
  room_id:null,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    updateUsers(state, action) {
      state.users = Array.isArray(action.payload.users) ? action.payload.users : [];
    },
    updateFriends(state, action) {
      state.friends = Array.isArray(action.payload.friends) ? action.payload.friends : [];
    },
    updateFriendRequests(state, action) {
      state.friendRequests = Array.isArray(action.payload.requests)
        ? action.payload.requests
        : [];
    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
  },
});


export default slice.reducer;

export function ToggleSidebar(){
    return async(dispatch)=>{
        dispatch(slice.actions.toggleSidebar());
    }
}

export function updateSidebarType(type){
    return async(dispatch)=>{
        dispatch(slice.actions.updateSidebarType({
            type,
        }))
    }
}

export function FetchUsers() {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get("http://localhost:3001/user/get-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      const data = response.data?.data || [];
      dispatch(slice.actions.updateUsers({ users: data }));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      dispatch(slice.actions.updateUsers({ users: [] }));
    }
  };
}


export function FetchFriends() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "http://localhost:3001/user/get-friends",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "http://localhost:3001/user/get-friend-requests",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriendRequests({ requests: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export const SelectConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({ room_id }));
  };
};