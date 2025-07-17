import { Link as RouterLink } from "react-router-dom";
import { Stack, Typography, Link, Box, Grid, Paper } from "@mui/material";
import Login from "../../sections/auth/LoginForm";
// import illustration from "gusto-illustration.png"; // replace with your correct image path

export default function LoginPage() {
  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f7f9fc"}}>
      <Grid item xs={1} md={6}>
        <Box
          sx={{
            height: "100%",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width:"100%",
            // border:"1px solid blue",
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


      <Grid item xs={12} md={6}>
        <Box
          sx={{
            height: "100%",
            width:"100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border:"1px solid black",
            px: 4,
          }}
        >
          <Paper elevation={3} sx={{ p: 6, width: "100%", maxWidth: 500 }}>
            <Typography variant="h4" gutterBottom>
              <strong style={{ color: "#1e40af" }}>UConnect</strong>
            </Typography>

            <Typography variant="h6" gutterBottom>
              Sign In
            </Typography>

            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
              <Login />
            </Stack>

            {/* <Box textAlign="right" mb={2}>
              <Link
                to="/login/reset-password"
                component={RouterLink}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Box> */}

            <Typography variant="body2" align="center">
              Don’t have an account?{" "}
              <Link
                to="/login/register"
                component={RouterLink}
                variant="subtitle2"
              >
                Sign Up
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}