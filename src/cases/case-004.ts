import type { Case } from "../types";

const midnightMasqueradeMurderCase: Case = {
  id: "case-004",
  title: "The Midnight Masquerade Murder",
  difficulty: 5,
  description:
    "Leonard Pierce was murdered at a Coconut Grove masked ball. Follow the clues to reveal the true murderer.",
  xpReward: 300,
  completed: false,
  isNew: false,
  category: "advanced",
  brief: `On October 31, 1987, at a Coconut Grove mansion masked ball, Leonard Pierce was found dead in the garden. Can you piece together all the clues to expose the true murderer?`,
  objectives: ["Reveal the true murderer of this complex case."],
  // Paid case: the real solution lives server-side in
  // src/cases/solutions.server.ts so it is never shipped to the browser. See C4.
  solution: {
    answer: "",
    successMessage: "",
    explanation: "",
  },
};

export default midnightMasqueradeMurderCase;
