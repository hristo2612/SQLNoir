import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { MessageCircle, Bug } from "lucide-react";
import Link from "next/link";

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
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Help", href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-detective text-amber-900 leading-tight">
              Hit a dead end on a case?
            </h1>
            <p className="text-amber-800 text-lg max-w-2xl">
              Every detective needs a network. Got a lead to share or need
              assistance cracking a tough case?
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-amber-800" />
                <h2 className="font-detective text-2xl text-amber-900">
                  Discord HQ
                </h2>
              </div>
              <p className="text-amber-800">
                Join the community, swap query tips, or ask for a nudge on a
                tricky clue.
              </p>
              <Link
                href="https://discord.gg/rMQRwrRYHH"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-800 text-amber-50 font-detective hover:bg-amber-700 transition-colors"
              >
                Enter Discord
              </Link>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Bug className="w-6 h-6 text-amber-800" />
                <h2 className="font-detective text-2xl text-amber-900">
                  GitHub Issues
                </h2>
              </div>
              <p className="text-amber-800">
                Found a bug or want to propose a feature? Open an issue and
                we&apos;ll investigate.
              </p>
              <Link
                href="https://github.com/hristo2612/SQLNoir/issues"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-800 text-amber-50 font-detective hover:bg-amber-700 transition-colors"
              >
                Report on GitHub
              </Link>
            </div>
          </div>

          <section className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-detective text-2xl text-amber-900">
              Quick answers
            </h3>
            <div className="space-y-3 text-amber-800">
              <div>
                <p className="font-detective text-lg text-amber-900">
                  • Need a clue?
                </p>
                <p>
                  Check the Schema tab first, then drop by Discord for a nudge.
                </p>
              </div>
              <div>
                <p className="font-detective text-lg text-amber-900">
                  • Found a bug in the code?
                </p>
                <p>
                  Found a bug or glitch? Report it on GitHub and we'll
                  investigate.
                </p>
              </div>
              <div>
                <p className="font-detective text-lg text-amber-900">
                  • Want to join the force?
                </p>
                <p>
                  Pull requests welcome. Grab an open issue or pitch us a new
                  case idea.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Script
        id="help-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
