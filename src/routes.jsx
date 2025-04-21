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
import NurseDashboard from "./NurseDashboard";
import NurseEvent from "./NurseEvent";
import PatientList from "./PatientList";
import Analytics from './pages/Analytics';
import Referrals from './pages/Referrals';
import NurseAnalytics from './pages/NurseAnalytics';
import AdminAnalytics from './pages/AdminAnalytics';
import ManageAdmins from "./ManageAdmins";
import { NurseReport,AdminReport } from "./NurseReport";

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
      },
      {
        index: true,
        path: "reports",
        element: <AdminReport />
      },
      {
        index: true,
        path: "analytics",
        element: <Analytics />
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
      { path: "analytics", element: <AdminAnalytics /> }, 
      { path: "reports", element: <AdminReport /> }
    ],
  },
  {
    path: "/superadmin",
    element: <SuperAdminDashboard />,
    children: [
      { path: "manage-admins", element: <ManageAdmins/> },
      { path: "reports", element: 'repors' }, // Replace with actual component
      { path: "settings", element: 'setting' }, // Replace with actual component
    ],
  },
  {
    path: "/nurse",
    element: <NurseDashboard/>,
    children: [
      { path: "events", element: <NurseEvent/> },
      { path: "patients", element: <PatientList/> }, 
      { path: "referrals", element: <Referrals /> }, // New Referrals route
      { path: "analytics", element: <NurseAnalytics /> }, // New NurseAnalytics route
      { path: "referrals", element: <Referrals /> }, 
      { path: "analytics", element: <Analytics /> }, 
      { path: "reports", element: <NurseReport/> },
    ],
  },
]);

export default router;