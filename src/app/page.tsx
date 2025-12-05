import Link from "next/link";
import { Github, BookOpen } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar
        title="SQLNoir"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Help", href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
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
      </main>
    </>
  );
}
