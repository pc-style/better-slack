import type { ReactNode } from "react";
import { priorityFirstFeed } from "./experiments/priority-first-feed";
import { wideReviewShell } from "./experiments/wide-review-shell";

export type { ExperimentSlots } from "./ExperimentApp";

export type ExperimentSlot = "app-shell" | "feed" | "post" | "composer";
export type ExperimentStatus = "new" | "reviewing" | "liked" | "rejected";

export type FlashExperiment = {
  slug: string;
  title: string;
  summary: string;
  requestedBy: string;
  status: ExperimentStatus;
  slots: ExperimentSlot[];
  notes: string[];
  render: () => ReactNode;
};

export const flashExperiments: FlashExperiment[] = [priorityFirstFeed, wideReviewShell];

export function getFlashExperiment(slug: string) {
  return flashExperiments.find((experiment) => experiment.slug === slug) ?? null;
}
