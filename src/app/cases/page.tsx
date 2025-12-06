import type { Metadata } from "next";
import Script from "next/script";
import { CasesExplorer } from "@/components/CasesExplorer";
import { Navbar } from "@/components/Navbar";
import { getAllCases, getCaseSlug } from "@/lib/case-utils";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Files | Play interactive SQL detective scenarios",
  description:
    "Browse SQLNoir cases across skill levels. Solve interactive detective scenarios, earn XP, and sharpen your SQL skills.",
  alternates: {
    canonical: "/cases",
  },
  openGraph: {
    type: "website",
    title: "Case Files | Play interactive SQL detective scenarios",
    description:
      "Pick a case, question suspects with SQL, and earn XP as you solve each investigation.",
    url: "https://www.sqlnoir.com/cases",
    images: [
      {
        url: "/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "SQLNoir case files",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Files | Play interactive SQL detective scenarios",
    description:
      "Pick a case, question suspects with SQL, and earn XP as you solve each investigation.",
    images: ["/open-graph-image.png"],
  },
};

export default async function CasesPage() {
  const casesList = getAllCases();

  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userInfo: any = null;
  if (session?.user) {
    const { data } = await supabase
      .from("user_info")
      .select("*")
      .eq("id", session.user.id)
      .single();
    userInfo = data ?? null;
  }

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
      <CasesExplorer initialSession={session} initialUserInfo={userInfo} />
      <Script
        id="cases-json-ld"
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
                ],
              },
              {
                "@type": "CollectionPage",
                name: "SQLNoir Case Files",
                description:
                  "Interactive SQL detective cases with XP tiers across beginner to advanced difficulty.",
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: casesList.map((caseData, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `https://www.sqlnoir.com/cases/${getCaseSlug(
                      caseData
                    )}`,
                    name: caseData.title,
                    description: caseData.description,
                  })),
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
