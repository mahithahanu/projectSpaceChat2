import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user: null,
  user_id: null,
  email: "",
  error: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
  },
});

export default slice.reducer;

// ------------------- ACTIONS ----------------------

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post("/auth/reset-password", formValues, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        toast.success(response.data.message || "Password reset successful!");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Password reset failed!");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      });
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post("/auth/forgot-password", formValues, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        toast.success(response.data.message || "OTP sent to email!");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to send OTP.");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      });
  };
}

export function LoginUser(formValues, navigate) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post("/auth/login", formValues, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true, 
            token: response.data.token,
            user_id: response.data.user_id,
          })
        );
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("user_id", response.data.user_id);
        window.localStorage.setItem("user_email", response.data.email.toLowerCase());
        window.localStorage.setItem("is_admin", response.data.isAdmin);
        toast.success(response.data.message || "Login successful!");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
        navigate("/nxthome");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed!");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      });
  };
}

export function LogoutUser() {
  return async (dispatch) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.signOut());
    toast.success("You have been logged out.");
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post("/auth/register", formValues, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
        toast.success(response.data.message || "Registration successful. Please verify your email.");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Registration failed!");
        dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/login/verify";
        }
      });
  };
}

export function VerifyEmail(formValues, navigate) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post("/auth/verify", formValues, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        dispatch(slice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", response.data.user_id);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        toast.success(response.data.message || "Email verified successfully!");
        navigate("/login/login");
        dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Verification failed!");
        dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
      });
  };
}
