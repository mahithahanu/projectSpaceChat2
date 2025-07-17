import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import VerifyForm from "../../sections/auth/VerifyForm";

const VerifyPage = () => {
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
            style={{ width: "100%", maxWidth: 600,marginLeft:"300px" }}
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
              <Typography variant="h5">Verify OTP</Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Please enter the OTP sent to your email to complete verification.
              </Typography>
            </Stack>

            {/* OTP Form */}
            <VerifyForm />

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Didn’t get the code?{" "}
              <Link component={RouterLink} to="/login/register" variant="subtitle2">
                Resend
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VerifyPage;
