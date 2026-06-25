import type { Case } from "../types";

const artBaselAssassinationCase: Case = {
  id: "case-005",
  title: "The Silicon Sabotage",
  difficulty: 5,
  description:
    "Miami’s leading tech corporation, was about to unveil its groundbreaking microprocessor. Just hours before the reveal, the prototype was destroyed.",
  xpReward: 1000,
  completed: false,
  isNew: false,
  category: "advanced",
  brief: `QuantumTech, Miami’s leading technology corporation, was about to unveil its groundbreaking microprocessor called “QuantaX.” Just hours before the reveal, the prototype was destroyed, and all research data was erased. Detectives suspect corporate espionage.`,
  objectives: ["Find who sabotaged the microprocessor."],
  // Paid case: the real solution lives server-side in
  // src/cases/solutions.server.ts so it is never shipped to the browser. See C4.
  solution: {
    answer: "",
    successMessage: "",
    explanation: "",
  },
};

export default artBaselAssassinationCase;
