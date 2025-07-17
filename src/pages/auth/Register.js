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
import RegisterForm from "../../sections/auth/RegisterForm";
// import AuthSocial from "../../sections/auth/AuthSocial";

export default function RegisterPage() {
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

            <Typography variant="h6" gutterBottom>
              Get started with UConnect
            </Typography>

            <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="body2">
                Already have an account?
              </Typography>
              <Link
                to="/login/login"
                component={RouterLink}
                variant="subtitle2"
              >
                Sign In
              </Link>
            </Stack>

            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
              <RegisterForm />
            </Stack>

            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                mt: 3,
                typography: "caption",
                textAlign: "center",
              }}
            >
              {"By signing up, I agree to "}
              <Link underline="always" color="text.primary">
                Terms of Service
              </Link>
              {" and "}
              <Link underline="always" color="text.primary">
                Privacy Policy
              </Link>
              .
            </Typography>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
