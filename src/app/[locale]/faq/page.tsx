import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/faq", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/faq",
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

const QUESTION_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export default async function FaqPage() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("faq.body");

  const emailTag = (chunks: React.ReactNode) => (
    <a
      href="mailto:support@sqlnoir.com"
      className="text-amber-700 hover:text-amber-900 underline"
    >
      {chunks}
    </a>
  );
  const discordTag = (chunks: React.ReactNode) => (
    <a
      href="https://discord.gg/rMQRwrRYHH"
      target="_blank"
      rel="noopener noreferrer"
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
          <p className="text-amber-800 text-lg">{t("intro")}</p>

          <div className="space-y-6">
            {QUESTION_KEYS.map((key) => (
              <section
                key={key}
                className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3"
              >
                <h2 className="font-detective text-2xl text-amber-900">
                  {t(`${key}.question`)}
                </h2>
                <p className="text-amber-800 leading-relaxed">
                  {t.rich(`${key}.answer`, {
                    email: emailTag,
                    discord: discordTag,
                  })}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
