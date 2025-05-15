import React from "react";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "../context/authContext";
import router from "./routes";
import { NurseEventProvider } from "../context/NurseEventContext";
function App() {
  return (
    <NurseEventProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
    </NurseEventProvider>
  );
}

export default App