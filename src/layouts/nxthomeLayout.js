import { Outlet } from "react-router-dom";

const NxtHomeLayout = () => {
  return (
    <div>
      {/* Shared layout like header or footer here */}
      <Outlet /> {/* This renders the child route: <Nxthome /> */}
    </div>
  );
};

export default NxtHomeLayout;
