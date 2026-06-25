import type { Metadata } from "next";
import { HelpPageClient } from "@/components/HelpPageClient";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("help.metadata");
  const locale = await getLocale();
  const alternates = localeAlternates("/help", locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates,
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/help",
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

export default async function HelpPage() {
  const t = await getTranslations("help");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();

  const faqItems = [
    {
      question: t("faqClueQ"),
      answer: t("faqClueA"),
    },
    {
      question: t("faqBugQ"),
      answer: t("faqBugA"),
    },
    {
      question: t("faqContributeQ"),
      answer: t("faqContributeA"),
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
          {
            "@type": "ListItem",
            position: 2,
            name: tNav("help"),
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
            name: t("discordTitle"),
          },
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            url: "https://github.com/hristo2612/SQLNoir/issues",
            name: t("githubTitle"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <HelpPageClient />
      {locale === "zh-CN" && (
        <section className="mt-12 mb-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 p-6 rounded-xl bg-amber-50 border border-amber-200">
          <h2 className="font-detective text-2xl text-amber-900 mb-4">致谢</h2>
          <div className="space-y-3 text-amber-800 leading-relaxed">
            <p>SQLNoir 的中文版要特别感谢 Lloyd Hasson（GitHub: @SatyrFrost）。</p>
            <p>
              Lloyd 是一位在中国教 SQL 的老师。他不只把游戏翻译成了中文，
              更把整个故事世界搬到了 1980 年代的上海：衡山路的黑胶唱片店、
              兰亭会所的假面舞会、量芯科技的芯片疑云。他还把所有数据库的
              表名、字段名都译成中文，让学生可以用母语思考、用 SQL 破案。
            </p>
            <p>
              这一切都是他用业余时间为自己的学生做的，然后慷慨地捐给了我们。
              中文版能上线，全靠他。
            </p>
            <p>
              👉 在 GitHub 上找他：{" "}
              <a
                href="https://github.com/SatyrFrost"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900"
              >
                https://github.com/SatyrFrost
              </a>
            </p>
          </div>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
