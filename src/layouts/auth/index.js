import React from "react";
import { Container, Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

// import Logo from "../../assets/Images/logo.ico";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  // const { isLoggedIn } = useSelector((state) => state.auth);

  // if (isLoggedIn) {
  //   return <Navigate to={"/app"} />;
  // }

  return (
  <div style={{ width: "100%", minHeight: "100vh" }}>
    <Outlet />
  </div>
);

};

export default AuthLayout;