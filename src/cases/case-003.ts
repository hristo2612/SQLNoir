import type { Case } from "../types";

const miamiMarinaMurderCase: Case = {
  id: "case-003",
  title: "The Miami Marina Murder",
  difficulty: 2, // Intermediate (multi-step, breadcrumb-style clues)
  description:
    "A body was found at Coral Bay Marina. Two potential suspects were last seen near the scene. Find the murderer and bring them to justice.",
  xpReward: 200,
  completed: false,
  isNew: false,
  category: "intermediate",
  brief: `A body was found floating near the docks of Coral Bay Marina in the early hours of August 14, 1986. Your job, detective, is to find the murderer and bring them to justice.
This case might require the use of JOINs, wildcard searches, and logical deduction. Get to work, detective.`,
  objectives: [
    "Find the murderer. ( Start by finding the crime scene and go from there )",
  ],
  // Paid case: the real solution lives server-side in
  // src/cases/solutions.server.ts so it is never shipped to the browser. See C4.
  solution: {
    answer: "",
    successMessage: "",
    explanation: "",
  },
};

export default miamiMarinaMurderCase;
