/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, Github, Share2, BookOpen } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import { Dashboard } from "./Dashboard";
import { CaseSolver } from "./CaseSolver";
import { UserMenu } from "./auth/UserMenu";
import { SharePopup } from "./SharePopup";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

const SQL_TIPS = [
  "Comment your complex SQL queries",
  "Use single quotes for text values: WHERE name = 'John'",
  "End your SQL statements with a semicolon (;)",
];

interface GameAppProps {
  initialSession?: Session | null;
  initialUserInfo?: any;
}

export function GameApp({
  initialSession = null,
  initialUserInfo = null,
}: GameAppProps) {
  const [started, setStarted] = useState(Boolean(initialSession));
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [user, setUser] = useState<any>(initialSession?.user ?? null);
  const [userInfo, setUserInfo] = useState<any>(initialUserInfo);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const fetchUserInfo = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    // Update document title for main game
    document.title =
      "SQL Noir - Interactive SQL Detective Game | Learn SQL Through Mystery Solving";

    // Re-validate client session on mount for freshness
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setStarted(true);
          if (!initialUserInfo) fetchUserInfo(session.user.id);
        } else {
          setUser(null);
          setUserInfo(null);
        }
      })
      .catch((error) => {
        console.error("Error checking session:", error);
      });

    // Listen for auth changes to keep UI in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Auto-start if user logs in
        setStarted(true);
        fetchUserInfo(currentUser.id);
      } else {
        setUserInfo(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      // Reset title when component unmounts
      document.title = "SQL Noir";
    };
  }, [fetchUserInfo, initialUserInfo]);

  const handleCaseSolved = async () => {
    if (user) {
      await fetchUserInfo(user.id);
    }
  };

  if (selectedCase) {
    return (
      <>
        <SharePopup
          isOpen={isSharePopupOpen}
          onClose={() => setIsSharePopupOpen(false)}
        />
        <CaseSolver
          caseData={selectedCase}
          onBack={() => setSelectedCase(null)}
          onSolve={handleCaseSolved}
        />
      </>
    );
  }

  if (started) {
    return (
      <>
        <SharePopup
          isOpen={isSharePopupOpen}
          onClose={() => setIsSharePopupOpen(false)}
        />
        <Dashboard
          onCaseSelect={setSelectedCase}
          userInfo={userInfo}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50 flex flex-col items-center justify-center p-4 md:p-8">
      <SharePopup
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
      />
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <UserMenu user={user} onSignOut={() => setUser(null)} />
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
          title="Read Detective's Journal"
        >
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:inline">Blog</span>
        </Link>
        <button
          onClick={() => setIsSharePopupOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
          title="Share SQL Noir"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <a
          href="https://github.com/hristo2612/SQLNoir"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
        >
          <Github className="w-5 h-5" />
          <span className="hidden sm:inline">Star on GitHub</span>
        </a>
        <a
          href="https://discord.gg/rMQRwrRYHH"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
        >
          <FaDiscord className="w-5 h-5" />
          <span className="hidden sm:inline">Join Discord</span>
        </a>
      </div>

      <div className="w-full max-w-xl mx-auto text-center space-y-12">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-40 h-40 relative mb-4 flex items-center justify-center">
              <BsIncognito className="w-full h-full text-amber-900 relative" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="font-detective text-5xl md:text-8xl text-amber-900 drop-shadow-lg">
            SQL Noir
          </h1>

          <p className="text-xl md:text-2xl text-amber-800 font-detective">
            Solve mysteries through SQL.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 px-10 py-5 rounded-lg 
                     text-2xl font-detective transition-all duration-300 transform hover:scale-105 
                     flex items-center justify-center mx-auto shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            Start Investigation
            <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-amber-700 italic">
            Detective&apos;s Tip: {SQL_TIPS[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
