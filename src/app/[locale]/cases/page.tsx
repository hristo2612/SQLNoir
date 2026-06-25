import type { Metadata } from "next";
import { CasesExplorer } from "@/components/CasesExplorer";
import { Navbar } from "@/components/Navbar";
import { getAllCases, getCaseSlug } from "@/lib/case-utils";
import { getAllLocalizedCases } from "@/lib/case-localization";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates, localePrefix, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cases.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/cases", locale),
    openGraph: {
      type: "website",
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${siteUrl}${localePrefix(locale)}/cases`,
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function CasesPage() {
  const casesList = getAllCases();
  const locale = await getLocale();
  const localizedCases = await getAllLocalizedCases(locale);
  const tNav = await getTranslations("nav");
  const tMeta = await getTranslations("cases.metadata");

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
          { label: tNav("home"), href: "/", activeMatch: "/" },
          { label: tNav("cases"), href: "/cases", activeMatch: "/cases" },
          { label: tNav("help"), href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <CasesExplorer initialSession={session} initialUserInfo={userInfo} localizedCases={localizedCases} />
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
                ],
              },
              {
                "@type": "CollectionPage",
                name: tMeta("collectionName"),
                description: tMeta("collectionDescription"),
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
