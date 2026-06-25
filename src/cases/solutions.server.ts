// SERVER-ONLY. Real solutions for the PAID cases.
//
// These must NEVER reach the browser: do not import this file from a "use
// client" component, nor from any module that is reachable from one (e.g.
// case-utils, local-progress). Only server routes / server components may
// import it - currently just src/lib/case-localization.ts (which itself is
// server-only by the same rule). Keeping the paid answers out of every
// client-reachable module is what makes the paywall actually protect the
// paid puzzle content. (The `server-only` npm guard package is not installed
// here, so this is enforced by import discipline; see C4 in PRELAUNCH-REVIEW.md.)
//
// Free cases (case-001, case-002) intentionally keep their solutions inline in
// their case files: they are public and are solved client-side.
import type { Case } from "../types";

type Solution = Case["solution"];

export const paidCaseSolutions: Record<string, Solution> = {
  "case-003": {
    answer: "Thomas Brown",
    successMessage:
      "Great detective work! Thomas Brown has confessed to the crime.",
    explanation: `The investigation started with two suspects from the crime scene, one living on Ocean Drive and the other with a name ending in "ez".
After interviewing them, hotel check-ins were filtered using two separate clues: first by date, then further refined using surveillance records.
Only three people matched both filters.
An interview with each of them revealed their role in the case, and after pressing further, Thomas Brown confessed to the crime.`,
  },
  "case-004": {
    answer: "Marco Santos",
    successMessage:
      "Outstanding detective work! The evidence conclusively shows that Marco Santos is the true murderer.",
    explanation: `You began by retrieving the crime scene record and examining witness statements, which mentioned a hotel booking at The Grand Regency (room 707 on 19871030).
Filtering hotel check-ins by these clues returned multiple entries.
A JOIN with surveillance records narrowed the field to one key entry that noted a subject yelling on a phone ("I'm gonna kill him!").
Reviewing phone records, you found a call to Victor DiMarco containing the phrase "Why did you kill him, bro? You should have let the carpenter do his job!"
Identifying the recipient of that call and interviewing him revealed that he was not the killer but hinted that the true murderer is a carpenter driving a Lamborghini.
Joining the vehicle registry with the person table (filtering for occupation "Carpenter" and car model "Lamborghini") yielded one candidate.
A final interview with that candidate resulted in a confession.
Thus, the true murderer is Marco Santos.`,
  },
  "case-005": {
    answer: "Hristo Bogoev",
    successMessage:
      "Outstanding detective work! The evidence conclusively shows that Hristo Bogoev is the true saboteur.",
    explanation: `You began by retrieving the incident report from QuantumTech regarding the destruction of their prototype. Two witnesses were initially identified: Carl Jenkins and Tina Ruiz.
Tina Ruiz mentioned seeing someone with a keycard marked "QX-" followed by an odd two-digit number. Filtering keycard access logs for such patterns returned over 20 results, which was too broad.
Carl Jenkins reported unusual server activity linked to a server in Helsinki. Searching the computer access logs for Helsinki access again returned too many entries.
However, performing a JOIN between the keycard access and computer access logs narrowed the list down to Elizabeth Gordon.
Investigating her further, you reviewed her witness statement. She claimed she had received an email warning her about an alarm near the chip, prompting her to go check.
Searching the email logs, you discovered that she had received the email from Norman Owens - who himself had received two suspicious messages from a sender with ID NULL. One email told Norman to "move L into place," and the other instructed him to unlock Facility 18 so someone else could "finish things."
This led you to check the facility access logs for that day. Only two individuals accessed Facility 18: Elizabeth Gordon and one other shortly afterward - Hristo Bogoev.`,
  },
  "case-006": {
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
