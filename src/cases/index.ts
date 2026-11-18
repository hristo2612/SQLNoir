import { Case } from "../types";
import { Search, Award, Database } from "lucide-react";
import vanishingBriefcaseCase from "./case-001";
import theStolenSound from "./case-002";
import miamiMarinaMurderCase from "./case-003";
import midnightMasqueradeMurderCase from "./case-004";
import artBaselAssassinationCase from "./case-005";
import vanishingDiamondCase from "./case-006";
import blueprintCase from "./case-007";

// Export all cases
export const cases: Record<string, Case[]> = {
  beginner: [vanishingBriefcaseCase, theStolenSound, blueprintCase],
  intermediate: [miamiMarinaMurderCase, vanishingDiamondCase],
  advanced: [midnightMasqueradeMurderCase, artBaselAssassinationCase],
};

// Export categories with metadata
export const categories = [
  {
    id: "beginner",
    title: "Beginner Cases",
    icon: Search,
    requiredXP: 0,
    description:
      "Perfect for SQL newcomers. Learn the basics of querying and data analysis.",
  },
  {
    id: "intermediate",
    title: "Intermediate Cases",
    icon: Database,
    requiredXP: 100,
    description:
      "For investigators with basic SQL knowledge. Tackle more complex queries and optimizations.",
  },
  {
    id: "advanced",
    title: "Advanced Cases",
    icon: Award,
    requiredXP: 300,
    description:
      "Expert-level cases requiring deep SQL knowledge and problem-solving skills.",
  },
];

// Export individual cases for direct imports
export {
  vanishingBriefcaseCase,
  theStolenSound,
  miamiMarinaMurderCase,
  midnightMasqueradeMurderCase,
  artBaselAssassinationCase,
  vanishingDiamondCase,
  blueprintCase,
};
