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
  solution: {
    answer: "Thomas Brown",
    successMessage:
      "Great detective work! Thomas Brown has confessed to the crime.",
    explanation: `The investigation started with two suspects from the crime scene, one living on Ocean Drive and the other with a name ending in "ez".
After interviewing them, hotel check-ins were filtered using two separate clues: first by date, then further refined using surveillance records.
Only three people matched both filters.
An interview with each of them revealed their role in the case, and after pressing further, Thomas Brown confessed to the crime.`,
  },
};

export default miamiMarinaMurderCase;
