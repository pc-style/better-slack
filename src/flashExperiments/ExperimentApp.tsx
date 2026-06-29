import type { ReactNode } from "react";
import { FeedPage } from "../routes/FeedPage";
import { RootLayout } from "../routes/RootLayout";
import type { Id } from "../../convex/_generated/dataModel";
import type { EnrichedPost } from "../lib/types";

type SlotChildren = { children: ReactNode };

export type ExperimentSlots = {
  shell?: (props: SlotChildren) => ReactNode;
  nav?: ReactNode;
  feed?: ReactNode;
  post?: (props: { postId: Id<"posts"> }) => ReactNode;
  postCard?: (props: { post: EnrichedPost }) => ReactNode;
  composer?: ReactNode;
  sidebar?: ReactNode;
  replies?: (props: { postId: Id<"posts"> }) => ReactNode;
};

export function ExperimentApp({ slots }: { slots?: ExperimentSlots }) {
  const shell =
    slots?.shell ?? (({ children }: SlotChildren) => <RootLayout>{children}</RootLayout>);
  return shell({ children: slots?.feed ?? <FeedPage /> });
}
