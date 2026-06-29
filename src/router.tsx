import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { RootLayout } from "./routes/RootLayout";
import { FeedPage } from "./routes/FeedPage";
import { PostPage } from "./routes/PostPage";
import { AgentsPage } from "./routes/AgentsPage";
import { SpacesPage } from "./routes/SpacesPage";
import { SpacePage } from "./routes/SpacePage";
import { LinkedOrgsPage } from "./routes/LinkedOrgsPage";
import { WallPage } from "./routes/WallPage";
import { FlashExperimentsPage } from "./routes/FlashExperimentsPage";
import { FlashExperimentPage } from "./routes/FlashExperimentPage";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: FeedPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostPage,
});

const agentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agents",
  component: AgentsPage,
});

const spacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spaces",
  component: SpacesPage,
});

const spaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spaces/$slug",
  component: SpacePage,
});

const orgsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orgs",
  component: LinkedOrgsPage,
});

const wallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/u/$userId",
  component: WallPage,
});

const flashExperimentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flash-experiments",
  component: FlashExperimentsPage,
});

const flashExperimentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flash-experiments/$slug",
  component: FlashExperimentPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  postRoute,
  agentsRoute,
  spacesRoute,
  spaceRoute,
  orgsRoute,
  wallRoute,
  flashExperimentsRoute,
  flashExperimentRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
