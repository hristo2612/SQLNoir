import type { Metadata } from "next";
import Script from "next/script";
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
    title: caseData.title,
    description: caseData.description,
    alternates: {
      canonical: `/cases/${params.slug}`,
    },
    openGraph: {
      type: "article",
      title: caseData.title,
      description: caseData.description,
      url: `https://www.sqlnoir.com/cases/${params.slug}`,
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: `${caseData.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: caseData.title,
      description: caseData.description,
      images: ["/open-graph-image.png"],
    },
  };
}

export default function CasePage({ params }: CasePageProps) {
  const caseData = findCaseBySlug(params.slug);

  if (!caseData) {
    return notFound();
  }

  const slugUrl = `https://www.sqlnoir.com/cases/${params.slug}`;

  return (
    <>
      <Script
        id="case-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.sqlnoir.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Cases",
                    item: "https://www.sqlnoir.com/cases",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: caseData.title,
                    item: slugUrl,
                  },
                ],
              },
              {
                "@type": "VideoGame",
                name: caseData.title,
                description: caseData.description,
                genre: "SQL detective game",
                applicationCategory: "EducationalApplication",
                url: slugUrl,
                isPartOf: {
                  "@type": "WebSite",
                  name: "SQLNoir",
                  url: "https://www.sqlnoir.com/",
                },
                author: {
                  "@type": "Person",
                  name: "Hristo Bogoev",
                },
                publisher: {
                  "@type": "Organization",
                  name: "SQLNoir",
                },
                gameItem: {
                  "@type": "Thing",
                  name: `${caseData.xpReward} XP`,
                  description:
                    "Experience points awarded for solving the case.",
                },
              },
              {
                "@type": "HowTo",
                name: `How to solve: ${caseData.title}`,
                description: caseData.brief,
                tool: [
                  { "@type": "HowToTool", name: "SQL editor" },
                  { "@type": "HowToTool", name: "Database schema" },
                ],
                step: caseData.objectives.map((objective, index) => ({
                  "@type": "HowToStep",
                  position: index + 1,
                  name: `Step ${index + 1}`,
                  text: objective,
                })),
              },
            ],
          }),
        }}
      />
      <CasePageClient caseData={caseData} />
    </>
  );
}
