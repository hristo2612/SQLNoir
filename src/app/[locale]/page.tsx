import { Github, BookOpen } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackedLink } from "@/components/TrackedLink";
import { HomepageCTA } from "@/components/HomepageCTA";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");

  const faqItems = [
    {
      question: t("faqAccountQ"),
      answer: t("faqAccountA"),
    },
    {
      question: t("faqAccessQ"),
      answer: t("faqAccessA"),
    },
    {
      question: t("faqSqlQ"),
      answer: t("faqSqlA"),
    },
    {
      question: t("faqInterviewQ"),
      answer: t("faqInterviewA"),
    },
    {
      question: t("faqHintsQ"),
      answer: t("faqHintsA"),
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
            name: tNav("home"),
            item: "https://www.sqlnoir.com/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

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
      <main className="relative min-h-screen bg-amber-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-[1fr,320px] items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-detective text-5xl md:text-6xl text-amber-900 leading-tight drop-shadow-sm">
                {t("heroTitle")}
              </h1>
              <p className="text-amber-800 text-lg md:text-xl max-w-2xl">
                {t("heroSubtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <HomepageCTA
                ctaId="hero-start-investigation"
                source="hero"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t("startInvestigation")}
              </HomepageCTA>
              <div className="flex items-center gap-3 text-amber-800">
                <TrackedLink
                  href="/blog"
                  event="cta_click"
                  eventProps={{
                    cta_id: "hero-blog",
                    page: "/",
                    source: "hero",
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors duration-200"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="lg:hidden">{tNav("journal")}</span>
                  <span className="hidden lg:inline">
                    {tNav("journalFull")}
                  </span>
                </TrackedLink>
                <a
                  href="https://github.com/hristo2612/SQLNoir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  {tNav("github")}
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">
                  {t("featureQueryDriven")}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {t("featureQueryDrivenDesc")}
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">{t("featureNoSetup")}</p>
                <p className="text-sm text-amber-700 mt-1">
                  {t("featureNoSetupDesc")}
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">
                  {t("featureEarnXP")}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {t("featureEarnXPDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-amber-200/60 rounded-full translate-x-6 translate-y-6" />
            <div className="relative bg-amber-100/80 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6">
              <div className="w-40 h-40 flex items-center justify-center text-amber-900">
                <BsIncognito className="w-full h-full" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-detective text-2xl text-amber-900">
                  {t("welcomeDetective")}
                </p>
                <p className="text-amber-800">
                  {t("welcomeMessage")}
                </p>
              </div>
              <TrackedLink
                href="/cases"
                event="cta_click"
                eventProps={{
                  cta_id: "hero-card-open-case-files",
                  page: "/",
                  source: "hero-card",
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-900 text-amber-50 font-detective hover:bg-amber-800 transition-colors duration-200"
              >
                {t("openCaseFiles")}
              </TrackedLink>
            </div>
          </div>
        </div>
        <a
          href="#learn-more"
          className="hidden lg:flex items-center gap-2 font-detective text-amber-900 hover:text-amber-700 underline underline-offset-4 absolute bottom-20 left-1/2 -translate-x-1/2"
        >
          {t("learnMore")}
        </a>
      </main>
      <section
        id="learn-more"
        className="bg-amber-50/70 border-t border-amber-200/60 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div className="space-y-4">
              <h2 className="font-detective text-3xl text-amber-900">
                {t("howItWorksTitle")}
              </h2>
              <p className="text-amber-800 leading-relaxed">
                {t("howItWorksP1")}
              </p>
              <p className="text-amber-800 leading-relaxed">
                {t("howItWorksP2")}
              </p>
              <p className="text-amber-800 leading-relaxed">
                {t("howItWorksP3")}
            </p>
            <div className="pt-4">
              <HomepageCTA
                ctaId="how-it-works-start-solving"
                source="how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-900 text-amber-50 font-detective text-lg transition-colors duration-200 hover:bg-amber-800 shadow-md"
              >
                {t("startSolvingCases")}
              </HomepageCTA>
            </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-detective text-3xl text-amber-900">
                {t("whoIsThisFor")}
              </h2>
              <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
                <p className="text-amber-800 leading-relaxed">
                  • {t("audienceDevelopers")}
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • {t("audienceAnalysts")}
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • {t("audienceStudents")}
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • {t("audienceInstructors")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-detective text-3xl text-amber-900">
                {t("faqTitle")}
              </h2>
              <p className="text-amber-800">
                {t("faqSubtitle")}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  {t("faqAccountQ")}
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {t("faqAccountA")}
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  {t("faqAccessQ")}
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {t("faqAccessA")}
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  {t("faqSqlQ")}
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {t("faqSqlA")}
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  {t("faqInterviewQ")}
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {t("faqInterviewA")}
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  {t("faqHintsQ")}
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  {t("faqHintsA")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
