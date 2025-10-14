import { VITE_GOOGLE_CLIENT_ID } from "@/config/googleAuth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes";
import "../styles/index.css";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
