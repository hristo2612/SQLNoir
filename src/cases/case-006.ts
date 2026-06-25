import type { Case } from "../types";

const vanishingDiamondCase: Case = {
  id: "case-006",
  title: "The Vanishing Diamond",
  difficulty: 2,
  description:
    "The famous “Heart of Atlantis” diamond necklace suddenly disappeared from its display at the charity gala.",
  xpReward: 250,
  completed: false,
  isNew: false,
  category: "intermediate",
  brief: `At Miami’s prestigious Fontainebleau Hotel charity gala, the famous “Heart of Atlantis” diamond necklace suddenly disappeared from its display.`,
  objectives: ["Find who stole the diamond."],
  // Paid case: the real solution lives server-side in
  // src/cases/solutions.server.ts so it is never shipped to the browser. See C4.
  solution: {
    answer: "",
    successMessage: "",
    explanation: "",
  },
};

export default vanishingDiamondCase;
