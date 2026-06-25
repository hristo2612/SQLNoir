import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/terms", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/terms",
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

export default async function TermsPage() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("terms.body");

  const strongTag = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const stripeTag = (chunks: React.ReactNode) => (
    <a
      href="https://stripe.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-700 hover:text-amber-900 underline"
    >
      {chunks}
    </a>
  );
  const emailTag = (chunks: React.ReactNode) => (
    <a
      href="mailto:support@sqlnoir.com"
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
              {t("overviewTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("overviewBody")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("accountsTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("accountsIntro")}
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t.rich("accountsFreeTier", { strong: strongTag })}</li>
              <li>{t.rich("accountsLicense", { strong: strongTag })}</li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("paymentsTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t.rich("paymentsBody", { stripe: stripeTag })}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("refundTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t.rich("refundBody", { email: emailTag })}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("ugcTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">{t("ugcBody")}</p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("acceptableUseTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("acceptableUseIntro")}
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>{t("acceptableUseItem1")}</li>
              <li>{t("acceptableUseItem2")}</li>
              <li>{t("acceptableUseItem3")}</li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("ipTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">{t("ipBody")}</p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("terminationTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">
              {t("terminationBody")}
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              {t("changesTitle")}
            </h2>
            <p className="text-amber-800 leading-relaxed">{t("changesBody")}</p>
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
