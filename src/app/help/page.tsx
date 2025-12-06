import type { Metadata } from "next";
import Script from "next/script";
import { HelpPageClient } from "@/components/HelpPageClient";

export const metadata: Metadata = {
  title: "Help & Support",
  description:
    "Get help with SQLNoir cases, join the community, or report bugs. Find answers, Discord, and GitHub support links.",
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    url: "https://www.sqlnoir.com/help",
  },
};

export default function HelpPage() {
  const faqItems = [
    {
      question: "Need a clue?",
      answer: "Check the Schema tab first, then drop by Discord for a nudge.",
    },
    {
      question: "Found a bug in the code?",
      answer: "Report it on GitHub and we'll investigate.",
    },
    {
      question: "Want to join the force?",
      answer:
        "Pull requests welcome. Grab an open issue or pitch a new case idea.",
    },
  ];

  const jsonLd = {
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
            name: "Help",
            item: "https://www.sqlnoir.com/help",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "ContactPage",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://www.sqlnoir.com/help",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: "https://discord.gg/rMQRwrRYHH",
            name: "Discord Community",
          },
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            url: "https://github.com/hristo2612/SQLNoir/issues",
            name: "GitHub Issues",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HelpPageClient />
      <Script
        id="help-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
