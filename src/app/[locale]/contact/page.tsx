import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/contact", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/contact",
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

export default async function ContactPage() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("contact.body");

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

          <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  {t("emailLabel")}
                </span>
                <a
                  href="mailto:support@sqlnoir.com"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  support@sqlnoir.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  {t("githubLabel")}
                </span>
                <a
                  href="https://github.com/hristo2612/SQLNoir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  github.com/hristo2612/SQLNoir
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  {t("discordLabel")}
                </span>
                <a
                  href="https://discord.gg/rMQRwrRYHH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  discord.gg/rMQRwrRYHH
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
