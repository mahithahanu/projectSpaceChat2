import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import NxtHomeLayout from "../layouts/nxthomeLayout";
import Nxthome from "../components1/Nxthome";
// import OCommunities from "../components1/OCummunities";


const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to="/login/login" replace />,
    },
    {
      path: "/events/:clubId",
      element: <EventsPage />,
    },
    {
      path: "/AllCommunities",
      element: <OCommunitiesPage />,
    },
    {
      path: "/AllClubs",
      element: <ClubsChatPage />,
    },
    {
      path: "/admin/add-club",
      element: <AddClub />,
    },
    {
      path: "/admin/add-event",
      element: <AddEvent />,
    },
    {
      path: "/login",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
        { path: "verify", element: <VerifyPage /> },
      ],
    },
    {
      path: "/nxthome",
      element: <NxtHomeLayout />,
      children: [
        { path: "", element: <Nxthome /> },
        { path: "add-club", element: <AddClub /> },
        { path: "add-event", element: <AddEvent /> },
      ],
    },

    {
      path: "/app",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "dashboard", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "discussion-feed/:communityId", element: <GroupPage /> },
        { path: "selectcommunity", element: <SelectCommunity /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <Profilepage /> },
        { path: "discussion/:id", element: <DiscussionDetails /> },
        { path: "interviews", element: <Interviews /> },
        // { path: "discussion/category/:category", element: <DiscussionFeed /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp")),
);

// const Conversation = Loadable(
//   lazy(() => import("../pages/dashboard/Conversation")),
// );

const Settings = Loadable(
  lazy(() => import("../pages/dashboard/Settings")),
);

const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")))
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")))
const Profilepage = Loadable(lazy(() => import("../pages/dashboard/Profile")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));


const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);
const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPassword"))
);

const DiscussionDetails = Loadable(
  lazy(() => import("../pages/dashboard/SeeMessagepage"))
);

const EventsPage = Loadable(
  lazy(() => import("../components1/Events"))
);

const OCommunitiesPage = Loadable(
  lazy(() => import("../components1/OCummunities"))
);

const ClubsChatPage = Loadable(
  lazy(() => import("../components1/ChatRoomPage"))
);

const SelectCommunity = Loadable(
  lazy(() => import("../pages/dashboard/selectDiscussion"))
);

const Interviews = Loadable(
  lazy(() => import("../pages/dashboard/Interview"))
);

const AddClub = Loadable(lazy(() => import("../components1/adminClub")));
const AddEvent = Loadable(lazy(() => import("../components1/adminEvent")));


