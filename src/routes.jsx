import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ClientEventsPage from "./pages/ClientEventsPage";
import EventBooking from "./pages/EventBooking";
import Dashboard from "./pages/Dashboard";
import ManageApplications from "./pages/ManageApplications";
import PastEvents from "./pages/PastEvents";
import AdminProfilePage from "./pages/AdminProfile";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Settings from "./components/superadmintools/Settings";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/client-events", element: <ClientEventsPage /> },
  { path: "/booking", element: <EventBooking /> },
  { 
    path: "/admin", 
    element: <Dashboard />, 
    children: [
      { path: "view-applications", element: <ManageApplications /> },
      { path: "profile", element: <AdminProfilePage /> },
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