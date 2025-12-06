import type { Case } from "../types";

/**
 * Template for creating new cases.
 * Copy this file and modify it for your new case.
 */
const caseTemplate: Case = {
  id: "case-template",
  title: "Case Title",
  difficulty: 1,
  description: "Brief description of the case.",
  xpReward: 50,
  completed: false,
  isNew: false,
  category: "beginner",
  brief: "Detailed case brief explaining the scenario.",
  objectives: ["Objective 1", "Objective 2", "Objective 3"],
  solution: {
    answer: "ANSWER",
    successMessage: "Congratulations message when solved.",
    explanation: "Detailed explanation of the solution.",
  },
};

export default caseTemplate;
