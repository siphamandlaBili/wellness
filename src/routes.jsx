import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EventBooking from "./pages/user pages/EventBooking";
import Dashboard from "./pages/Dashboard";
import ManageApplications from "./pages/ManageApplications";
import PastEvents from "./pages/PastEvents";
import UserProfilePage from "./pages/user pages/UserProfile";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AuthForm from "./pages/user pages/UserLogin";
import UserDashboard from "./pages/user pages/UserDashBoard";
import AdminManageApplications from "./components/AdminManageApplications";
import AssignEventToNurse from './pages/AssignEventToNurse';
import AcceptedEvents from './pages/AcceptedEvents';

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthForm /> },
  { path: "/user-dashboard", element: <UserDashboard />,
    children: [
      {
        path: "profile",
        element: <UserProfilePage />
      },
      {
        path: "applications",
        element: <ManageApplications />
      },
      {
        index: true,
        path: "apply-for-event",
        element: <EventBooking />
      }
    ]
  },
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      { path: "view-applications", element: <AdminManageApplications /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "past-events", element: <PastEvents /> },
      { path: "assign-event", element: <AssignEventToNurse /> },
      { path: "accepted-events", element: <AcceptedEvents /> }, // New route
    ],
  },
  {
    path: "/superadmin",
    element: <SuperAdminDashboard />,
    children: [
      { path: "manage-admins", element: <div>Manage Admins Page</div> }, // Replace with actual component
      { path: "manage-nurses", element: <div>Manage Nurses Page</div> }, // Replace with actual component
      { path: "reports", element: <div>Reports Page</div> }, // Replace with actual component
      { path: "settings", element: <div>Settings Page</div> }, // Replace with actual component
    ],
  },
]);

export default router;