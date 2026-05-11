import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/privacy", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/privacy",
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function PrivacyPage() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("privacy.body");

  const strongTag = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const posthogTag = (chunks: React.ReactNode) => (
    <a
      href="https://posthog.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-700 hover:text-amber-900 underline"
    >
      {chunks}
    </a>
  );
  const emailTag = (chunks: React.ReactNode) => (
    <a
      href="mailto:hristoapps@gmail.com"
      className="text-amber-700 hover:text-amber-900 underline"
    >
      {chunks}
    </a>
  );

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: tNav("home"), href: "/" },
          { label: tNav("cases"), href: "/cases", activeMatch: "/cases" },
          { label: tNav("journal"), href: "/blog", activeMatch: ["/blog"] },
          { label: tNav("help"), href: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <h1 className="font-detective text-4xl text-amber-900">
            {t("title")}
          </h1>
          <p className="text-amber-800">{t("lastUpdated")}</p>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("collectionTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("collectionIntro")}
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t.rich("collectionAccount", { strong: strongTag })}</li>
              <li>{t.rich("collectionAnalytics", { strong: strongTag })}</li>
              <li>{t.rich("collectionCookies", { strong: strongTag })}</li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("useTitle")}
            </h2>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t("useItem1")}</li>
              <li>{t("useItem2")}</li>
              <li>{t("useItem3")}</li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("cookiesTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("cookiesIntro")}
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t.rich("cookiesAuth", { strong: strongTag })}</li>
              <li>{t.rich("cookiesAnalytics", { strong: strongTag })}</li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              {t("cookiesDisable")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("thirdPartyTitle")}
            </h2>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>
                {t.rich("thirdPartyPosthog", {
                  strong: strongTag,
                  posthog: posthogTag,
                })}
              </li>
              <li>{t.rich("thirdPartyVercel", { strong: strongTag })}</li>
              <li>{t.rich("thirdPartySupabase", { strong: strongTag })}</li>
              <li>{t.rich("thirdPartyStripe", { strong: strongTag })}</li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              {t("thirdPartyNoSell")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("retentionTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("retentionBody")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("rightsTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">{t("rightsIntro")}</p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t("rightsItem1")}</li>
              <li>{t("rightsItem2")}</li>
              <li>{t("rightsItem3")}</li>
              <li>{t.rich("rightsItem4", { strong: strongTag })}</li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              {t("rightsExercise")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("contactTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t.rich("contactBody", { email: emailTag })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
