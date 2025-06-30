import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EventBooking from "./pages/user pages/EventBooking";
import Dashboard from "./pages/admin pages/Dashboard";
import ManageApplications from "../src/pages/user pages/ManageApplications";
import PastEvents from "./pages/admin pages/PastEvents";
import UserProfilePage from "./pages/user pages/UserProfile";
import SuperAdminDashboard from "../src/pages/super admin/SuperAdminDashboard";
import AuthForm from "./pages/user pages/UserLogin";
import UserDashboard from "./pages/user pages/UserDashBoard";
import AdminManageApplications from "../src/pages/admin pages/AdminManageApplications";
import AssignEventToNurse from "./pages/admin pages/AssignEventToNurse";
import NurseDashboard from "../src/pages/nurse pages/NurseDashboard";
import NurseEvent from "./pages/nurse pages/NurseEvent";
import PatientList from "./pages/nurse pages/PatientList";
import Analytics from "./pages/Analytics";
import Referrals from "./pages/nurse pages/Referrals";
import NurseAnalytics from "../src/pages/nurse pages/NurseAnalytics";
import AdminAnalytics from "../src/pages/admin pages/AdminAnalytics";
import ManageAdmins from "./components/ManageAdmins";
import NurseReport from "./pages/nurse pages/NurseReport";
import ReportPDF from "./pages/nurse pages/ReportPDF";
import ViewReport from "./pages/super admin/ViewReport";
import ReportsList from "./pages/super admin/ReportsList";

// Wrapper to extract eventId from URL params
import { useParams } from "react-router-dom";
import UserReport from "./pages/user pages/UserReport";
const ViewReportWrapper = () => {
  const { eventId } = useParams();
  return <ViewReport eventId={eventId} />;
};

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthForm /> },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
    children: [
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "applications",
        element: <ManageApplications />,
      },
      {
        index: true,
        path: "apply-for-event",
        element: <EventBooking />,
      },
      {
        index: true,
        path: "reports",
        element: <UserReport/>,
      },
      {
        index: true,
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      { path: "view-applications", element: <AdminManageApplications /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "past-events", element: <PastEvents /> },
      { path: "assign-event", element: <AssignEventToNurse /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "reports", element: "admin" },
    ],
  },
  {
    path: "/superadmin",
    element: <SuperAdminDashboard />,
    children: [
      { path: "manage-admins", element: <ManageAdmins /> },
      { path: "reports", element: <ReportsList /> }, // <-- Use the new component
      { path: "settings", element: "setting" },
    ],
  },
  {
    path: "/nurse",
    element: <NurseDashboard />,
    children: [
      { path: "events", element: <NurseEvent /> },
      { path: "patients", element: <PatientList /> },
      { path: "referrals", element: <Referrals /> }, // New Referrals route
      { path: "analytics", element: <NurseAnalytics /> }, // New NurseAnalytics route
      { path: "referrals", element: <Referrals /> },
      { path: "reports", element: <NurseReport /> },
      { path: "report-pdf", element: <ReportPDF /> }, // New route for ReportPDF
    ],
  },
  {
    path: "/superadmin/reports/:eventId",
    element: <ViewReportWrapper />,
  },
]);

export default router;
