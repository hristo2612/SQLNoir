import Script from "next/script";
import Link from "next/link";
import { Github, BookOpen } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  const faqItems = [
    {
      question: "Do I need an account to play?",
      answer:
        "You can open and solve cases without creating an account. Sign in to track XP, progress, and solved cases across devices.",
    },
    {
      question: "How does access work?",
      answer:
        "You can jump into the world and try cases. Some cases may require unlocking, so pick a starting case that matches your skill level and build momentum from there.",
    },
    {
      question: "What SQL do I need to know?",
      answer:
        "Beginners can start with simple SELECTs. Intermediate and advanced cases introduce joins, grouping, filters, and subqueries as you progress.",
    },
    {
      question: "Will this help with interviews?",
      answer:
        "Yes. Cases mimic realistic data puzzles you might see in data and engineering interviews. It's great for practicing under a narrative without rote question banks.",
    },
    {
      question: "Can I get hints if I'm stuck?",
      answer:
        "Each case includes a schema view and objectives. If you need more help, join the community Discord or check the help page for guidance.",
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
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Help", href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <main className="relative min-h-screen bg-amber-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-[1fr,320px] items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-detective text-5xl md:text-6xl text-amber-900 leading-tight drop-shadow-sm">
                Solve mysteries through SQL.
              </h1>
              <p className="text-amber-800 text-lg md:text-xl max-w-2xl">
                Step into a smoky 80s detective agency, question suspects with
                SQL queries, and crack the case one statement at a time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/cases"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Investigation
              </Link>
              <div className="flex items-center gap-3 text-amber-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors duration-200"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="lg:hidden">Journal</span>
                  <span className="hidden lg:inline">
                    Detective&apos;s Journal
                  </span>
                </Link>
                <a
                  href="https://github.com/hristo2612/SQLNoir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">
                  Query-driven cases
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Every clue is hidden in a database. Use SQL to interrogate the
                  data and expose the culprit.
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">No setup needed</p>
                <p className="text-sm text-amber-700 mt-1">
                  Built-in SQL workspace powered by SQL.js. Just open a case and
                  start digging.
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
                <p className="font-detective text-amber-900">
                  Earn detective XP
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Solve cases to level up your badge and unlock tougher
                  investigations.
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
                  Welcome, Detective
                </p>
                <p className="text-amber-800">
                  The city is buzzing. New evidence just landed on your desk.
                </p>
              </div>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-900 text-amber-50 font-detective hover:bg-amber-800 transition-colors duration-200"
              >
                Open the Case Files
              </Link>
            </div>
          </div>
        </div>
        <a
          href="#learn-more"
          className="hidden lg:flex items-center gap-2 font-detective text-amber-900 hover:text-amber-700 underline underline-offset-4 absolute bottom-20 left-1/2 -translate-x-1/2"
        >
          ↓ Learn More ↓
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
                How SQLNoir works
              </h2>
              <p className="text-amber-800 leading-relaxed">
                Each case drops you into a story-driven investigation. You read
                the brief, study the database schema, and run SQL queries in a
                built-in editor to surface clues. As you connect tables,
                eliminate suspects, and validate alibis, you practice real SQL
                patterns: filtering, joins, aggregates, and subqueries. No setup
                or installs. Just open a case file and start interrogating the
                data.
              </p>
              <p className="text-amber-800 leading-relaxed">
                Progression is tracked with XP and difficulty tiers, so you can
                start as a rookie and grow into a seasoned investigator.
                Beginner cases teach fundamentals, while advanced cases push you
                with layered joins and trickier conditions.
              </p>
              <p className="text-amber-800 leading-relaxed">
                Ready to see it in action?
              </p>
              <div className="pt-4">
                <Link
                  href="/cases"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-900 text-amber-50 font-detective text-lg transition-colors duration-200 hover:bg-amber-800 shadow-md"
                >
                  Start Solving Cases
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-detective text-3xl text-amber-900">
                Who this is for
              </h2>
              <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
                <p className="text-amber-800 leading-relaxed">
                  • Developers wanting a hands-on, story-first way to practice
                  SQL fundamentals and joins.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • Data analysts preparing for interviews who need realistic
                  querying scenarios.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • Students who learn faster through narrative and immediate
                  feedback instead of dry textbooks.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  • Instructors looking for engaging SQL exercises without any
                  environment setup for learners.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-detective text-3xl text-amber-900">
                Frequently asked questions
              </h2>
              <p className="text-amber-800">
                Quick answers before you start your first case.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  Do I need an account to play?
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  You can open and solve cases without creating an account. Sign
                  in to track XP, progress, and solved cases across devices.
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  How does access work?
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Intermediate and advanced cases require XP to unlock, so pick
                  a starting case and build momentum from there.
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  What SQL do I need to know?
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Beginners can start with simple SELECTs. Intermediate and
                  advanced cases introduce joins, grouping, filters, and
                  subqueries as you progress.
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  Will this help with interviews?
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Yes. Cases mimic realistic data puzzles you might see in data
                  and engineering interviews. It's great for practicing under a
                  narrative without rote question banks.
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 space-y-2">
                <h3 className="font-detective text-xl text-amber-900">
                  Can I get hints if I&apos;m stuck?
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Each case includes a schema view and objectives. If you need
                  more help, join the community Discord or check the help page
                  for guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Script
        id="home-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
