import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { RouterProvider } from "@tanstack/react-router";
import { convex } from "./lib/convexClient";
import { SessionProvider } from "./lib/session";
import { router } from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </ConvexProvider>
  </StrictMode>,
);
