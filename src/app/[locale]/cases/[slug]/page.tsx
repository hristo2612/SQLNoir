import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasePageClient } from "@/components/CasePageClient";
import { findCaseBySlug, getAllCases, getCaseSlug, getLocalizedCase } from "@/lib/case-utils";
import { isCaseFree } from "@/lib/license";
import { getTranslations, getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { localeAlternates, localePrefix, siteUrl } from "@/lib/seo";

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllCases().map((caseData) => ({
      locale,
      slug: getCaseSlug(caseData),
    }))
  );
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseCaseData = findCaseBySlug(slug);
  const locale = await getLocale();

  if (!baseCaseData) {
    return {
      title: "Case not found | SQL Noir",
    };
  }

  const caseData = await getLocalizedCase(baseCaseData, locale);

  return {
    title: caseData.title,
    description: caseData.description,
    alternates: localeAlternates(`/cases/${slug}`, locale),
    openGraph: {
      type: "article",
      title: caseData.title,
      description: caseData.description,
      url: `${siteUrl}${localePrefix(locale)}/cases/${slug}`,
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

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const baseCaseData = findCaseBySlug(slug);

  if (!baseCaseData) {
    return notFound();
  }

  const locale = await getLocale();
  const caseData = await getLocalizedCase(baseCaseData, locale);
  const tNav = await getTranslations("nav");
  const slugUrl = `https://www.sqlnoir.com/cases/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
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
                    name: tNav("home"),
                    item: "https://www.sqlnoir.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: tNav("cases"),
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
      <CasePageClient
        caseData={isCaseFree(baseCaseData)
          ? caseData
          : { ...caseData, solution: { answer: "", explanation: "", successMessage: "" } }
        }
      />
    </>
  );
}
