import { RouterProvider } from "react-router/dom";
import "./App.css";
import Router from "./routes/router";
import { Toaster } from "@/components/ui/sonner";
import NotificationSetup from "@/components/notification-setup";

function App() {
  return (
    <>
      <RouterProvider router={Router} />
      <NotificationSetup />
      <Toaster position="bottom-center" expand={true} richColors />
    </>
  );
}

export default App;
