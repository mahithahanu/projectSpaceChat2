import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography, Link, Box } from "@mui/material";
import AuthSocial from "../../sections/auth/AuthSocial";
import Login from "../../sections/auth/LoginForm";

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
    <Box sx={{border:'1px solid red'}} p={7}>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Login to Uconnect</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link
            to={"/login/register"}
            component={RouterLink}
            variant="subtitle2"
          >
            Create an account
          </Link>
        </Stack>
      </Stack>
      {/* Form */}
      <Login />
      </Box>

      {/* <AuthSocial /> */}
    </>
  );
}