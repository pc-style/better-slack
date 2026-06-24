import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { RouterProvider } from "@tanstack/react-router";
import { convex } from "./lib/convexClient";
import { SessionProvider } from "./lib/session";
import { StoreProvider } from "./lib/store";
import { AgentTasksProvider } from "./lib/agentTasks";
import { SpacesProvider } from "./lib/spaces";
import { router } from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <SessionProvider>
        <StoreProvider>
          <AgentTasksProvider>
            <SpacesProvider>
              <RouterProvider router={router} />
            </SpacesProvider>
          </AgentTasksProvider>
        </StoreProvider>
      </SessionProvider>
    </ConvexProvider>
  </StrictMode>,
);
