import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./context";
import router from "./routes"; // Separate routes file for better organization

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App