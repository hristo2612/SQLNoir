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
  solution: {
    answer: "Mike Manning",
    successMessage:
      "Outstanding detective work! The evidence conclusively shows that Mike Manning is the thief.",
    explanation: `You began by retrieving the crime scene record and examining witness statements, which mentioned a dock rental, part of a VIP-R invitation and a navy suit.
Filtering marina rentals by these clues returned multiple entries.
A multiple JOIN with the guest table and attire registry returned one candidate.
A final interview with that candidate resulted in a confession.
Thus, the true thief is Mike Manning.`,
  },
};

export default vanishingDiamondCase;
