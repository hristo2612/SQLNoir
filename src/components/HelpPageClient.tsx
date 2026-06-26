"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MessageCircle, Bug, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { track } from "@vercel/analytics/react";
import { useTranslations } from "next-intl";

export function HelpPageClient() {
  const t = useTranslations();

  useEffect(() => {
    track("help_view", { page: "/help" });
  }, []);

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: t('nav.home'), href: "/", activeMatch: "/" },
          { label: t('nav.cases'), href: "/cases", activeMatch: "/cases" },
          { label: t('nav.help'), href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-detective text-amber-900 leading-tight">
              {t('help.title')}
            </h1>
            <p className="text-amber-800 text-lg max-w-2xl">
              {t('help.subtitle')}
            </p>
            <p className="text-amber-800">
              {t('help.startNew')}{" "}
              <Link
                href="/cases"
                className="underline ml-1"
                onClick={() => track("help_action", { action: "cases", page: "/help" })}
              >
                {t('help.caseFiles')}
              </Link>{" "}
              {t('help.orBrowse')}{" "}
              <Link
                href="/blog"
                className="underline"
                onClick={() => track("help_action", { action: "blog", page: "/help" })}
              >
                {t('help.caseFiles')}
              </Link>
              .
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-amber-800" />
                <h2 className="font-detective text-2xl text-amber-900">
                  {t('help.discordTitle')}
                </h2>
              </div>
              <p className="text-amber-800">
                {t('help.discordDesc')}
              </p>
              <Link
                href="https://discord.gg/rMQRwrRYHH"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-800 text-amber-50 font-detective hover:bg-amber-700 transition-colors"
                onClick={() => track("help_action", { action: "discord", page: "/help" })}
              >
                {t('help.enterDiscord')}
              </Link>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Bug className="w-6 h-6 text-amber-800" />
                <h2 className="font-detective text-2xl text-amber-900">
                  {t('help.githubTitle')}
                </h2>
              </div>
              <p className="text-amber-800">
                {t('help.githubDesc')}
              </p>
              <Link
                href="https://github.com/hristo2612/SQLNoir/issues"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-800 text-amber-50 font-detective hover:bg-amber-700 transition-colors"
                onClick={() => track("help_action", { action: "github_issues", page: "/help" })}
              >
                {t('help.reportOnGithub')}
              </Link>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-amber-800" />
                <h2 className="font-detective text-2xl text-amber-900">
                  {t('help.emailTitle')}
                </h2>
              </div>
              <p className="text-amber-800">
                {t('help.emailDesc')}
              </p>
              <a
                href="mailto:support@sqlnoir.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-800 text-amber-50 font-detective hover:bg-amber-700 transition-colors"
                onClick={() => track("help_action", { action: "email_support", page: "/help" })}
              >
                support@sqlnoir.com
              </a>
            </div>
          </div>

          <section className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-detective text-2xl text-amber-900">
              {t('help.quickAnswers')}
            </h3>
            <div className="space-y-3 text-amber-800">
              <div>
                <p className="font-detective text-lg text-amber-900">
                  {t('help.faqClueQ')}
                </p>
                <p>
                  {t('help.faqClueA')}
                </p>
              </div>
              <div>
                <p className="font-detective text-lg text-amber-900">
                  {t('help.faqBugQ')}
                </p>
                <p>
                  {t('help.faqBugA')}
                </p>
              </div>
              <div>
                <p className="font-detective text-lg text-amber-900">
                  {t('help.faqContributeQ')}
                </p>
                <p>
                  {t('help.faqContributeA')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}