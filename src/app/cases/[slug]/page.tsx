import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasePageClient } from "@/components/CasePageClient";
import { findCaseBySlug, getAllCases, getCaseSlug } from "@/lib/case-utils";

interface CasePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCases().map((caseData) => ({
    slug: getCaseSlug(caseData),
  }));
}

export function generateMetadata({ params }: CasePageProps): Metadata {
  const caseData = findCaseBySlug(params.slug);

  if (!caseData) {
    return {
      title: "Case not found | SQL Noir",
    };
  }

  return {
    title: `${caseData.title} | SQL Noir`,
    description: caseData.description,
  };
}

export default function CasePage({ params }: CasePageProps) {
  const caseData = findCaseBySlug(params.slug);

  if (!caseData) {
    return notFound();
  }

  return <CasePageClient caseData={caseData} />;
}
