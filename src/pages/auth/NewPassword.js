import React, { useState } from "react";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://uconnect-gwif.onrender.com/auth/reset-password", {
        token,
        password,
        passwordConfirm: confirmPassword,
      });

      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f7f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <ToastContainer />
      <Paper elevation={3} sx={{ p: 5, width: "100%", maxWidth: 480 }}>
        <Typography variant="h4" gutterBottom>
          <strong style={{ color: "#1e40af" }}>UConnect</strong>
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h5">Reset Password</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Please set your new password.
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth>
              Reset Password
            </Button>
          </Stack>
        </form>

        <Link
          component={RouterLink}
          to="/login/login"
          color="inherit"
          variant="subtitle2"
          sx={{
            mt: 3,
            mx: "auto",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <CaretLeft size={24} />
          Return to sign in
        </Link>
      </Paper>
    </Box>
  );
};

export default NewPasswordForm;
