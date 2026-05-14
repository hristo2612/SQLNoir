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
  solution: {
    answer: "Hristo Bogoev",
    successMessage:
      "Outstanding detective work! The evidence conclusively shows that Hristo Bogoev is the true saboteur.",
    explanation: `You began by retrieving the incident report from QuantumTech regarding the destruction of their prototype. Two witnesses were initially identified: Carl Jenkins and Tina Ruiz.
Tina Ruiz mentioned seeing someone with a keycard marked “QX-” followed by an odd two-digit number. Filtering keycard access logs for such patterns returned over 20 results, which was too broad.
Carl Jenkins reported unusual server activity linked to a server in Helsinki. Searching the computer access logs for Helsinki access again returned too many entries.
However, performing a JOIN between the keycard access and computer access logs narrowed the list down to Elizabeth Gordon.
Investigating her further, you reviewed her witness statement. She claimed she had received an email warning her about an alarm near the chip, prompting her to go check.
Searching the email logs, you discovered that she had received the email from Norman Owens — who himself had received two suspicious messages from a sender with ID NULL. One email told Norman to “move L into place,” and the other instructed him to unlock Facility 18 so someone else could “finish things.”
This led you to check the facility access logs for that day. Only two individuals accessed Facility 18: Elizabeth Gordon and one other shortly afterward — Hristo Bogoev.`,
  },
};

export default artBaselAssassinationCase;
