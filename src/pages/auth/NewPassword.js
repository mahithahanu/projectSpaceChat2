import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Typography,
  Link,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";

const NewPasswordPage = () => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        width: "100%",
      }}
    >
      {/* Illustration Left */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            height: "100%",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          <img
            src="/gusto-illustration.png"
            alt="Illustration"
            style={{ width: "100%", maxWidth: 500 }}
          />
        </Box>
      </Grid>

      {/* Form Right */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          <Paper elevation={3} sx={{ p: 6, width: "100%", maxWidth: 500 }}>
            <Typography variant="h4" gutterBottom>
              <strong style={{ color: "#1e40af" }}>UConnect</strong>
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h5">Reset Password</Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Please set your new password.
              </Typography>
            </Stack>

            <NewPasswordForm />

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
      </Grid>
    </Grid>
  );
};

export default NewPasswordPage;
