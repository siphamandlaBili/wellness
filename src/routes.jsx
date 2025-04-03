import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import EventBooking from "./pages/user pages/EventBooking";
import Dashboard from "./pages/Dashboard";
import ManageApplications from "./pages/ManageApplications";
import PastEvents from "./pages/PastEvents";
import UserProfilePage from "./pages/user pages/UserProfile";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Settings from "./components/superadmintools/Settings";
import AuthForm from "./pages/user pages/UserLogin";
import UserDashboard from "./pages/user pages/UserDashBoard";


const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthForm/> },
  { path: "/user-dashboard", element: <UserDashboard/> ,
    children:[
      {
         path: "profile",
        element: <UserProfilePage /> 
      }
      ,{ 
        path: "applications",
        element: <ManageApplications /> 
      },{ 
        index: true,
        path: "apply-for-event",
         element: <EventBooking /> 
        }
      ]},
  { 
    path: "/admin", 
    element: <Dashboard />, 
    children: [
      { path: "view-applications", element: <ManageApplications /> },
      // { path: "profile", element: <AdminProfilePage /> },
      { path: "past-events", element: <PastEvents /> },
    ],
  },
  { 
    path: "/super-admin", 
    element: <SuperAdminDashboard />, 
    children: [
      { path: "settings", element: <Settings /> },
      // Add more super admin tools here
    ],
  },
]);

export default router;