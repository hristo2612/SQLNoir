import React, { useEffect, useState } from "react";
import { Send, CheckCircle, XCircle, Loader2, Share2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Case } from "../../types";
import { SharePopup } from "../SharePopup";
import { track } from "@vercel/analytics/react";

interface SolutionSubmissionProps {
  caseData: Case;
  onSolve: () => void;
}

export function SolutionSubmission({
  caseData,
  onSolve,
}: SolutionSubmissionProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Storing user data if logged in for conditional rendering XP reward message
  const [attempts, setAttempts] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareContext, setShareContext] = useState("case-solved");
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [checkingSolved, setCheckingSolved] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const attemptsNext = attempts + 1;
    setAttempts(attemptsNext);

    try {
      // Check if the answer matches the solution (case-insensitive)
      const isAnswerCorrect =
        answer.trim().toLowerCase() === caseData.solution.answer.toLowerCase();

      if (isAnswerCorrect) {
        const user = supabase ? (await supabase.auth.getUser()).data.user : null;

        if (user && supabase) {
          // Get current user info to check if case was already solved
          const { data: userInfo, error: fetchError } = await supabase
            .from("user_info")
            .select("completed_cases")
            .eq("id", user.id)
            .single();

          if (fetchError) throw fetchError;

          const completedCases = Array.isArray(userInfo?.completed_cases)
            ? userInfo.completed_cases
            : [];

          // Only update if case hasn't been solved before
          if (!completedCases.includes(caseData.id)) {
            completedCases.push(caseData.id);

            // Use SQL's addition operator to increment XP
            const { error: updateError } = await supabase.rpc(
              "increment_user_xp",
              {
                user_id: user.id,
                xp_amount: caseData.xpReward,
                case_id: caseData.id,
                cases_array: completedCases,
              }
            );

            if (updateError) throw updateError;
          }
        }
      }

      setIsCorrect(isAnswerCorrect);
      setSubmitted(true);

      if (isAnswerCorrect) {
        onSolve();
        track("case_solve_success", {
          case_slug: caseData.id,
          title: caseData.title,
          difficulty: caseData.difficulty,
          category: caseData.category,
          xp_reward: caseData.xpReward,
          attempts: attemptsNext,
          auth: Boolean(user),
        });
      } else {
        track("case_solve_failure", {
          case_slug: caseData.id,
          attempts: attemptsNext,
          auth: Boolean(user),
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating progress"
      );
      console.error("Error updating solved cases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Storing the user data in state if user is logged in
  // This will allow us to show the XP reward message conditionally
  useEffect(() => {
    const checkSolvedStatus = async () => {
      if (!supabase) {
        setCheckingSolved(false);
        return;
      }

      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;

      setUser(currentUser);

      // If not logged in → no need to check DB
      if (!currentUser) {
        setCheckingSolved(false);
        return;
      }

      // Fetch completed cases
      const { data: userInfo, error } = await supabase
        .from("user_info")
        .select("completed_cases")
        .eq("id", currentUser.id)
        .single();

      if (!error) {
        const completedCases = Array.isArray(userInfo?.completed_cases)
          ? userInfo.completed_cases
          : [];

        if (completedCases.includes(caseData.id)) {
          setAlreadySolved(true);
          setSubmitted(true);
          setIsCorrect(true);
        }
      }

      setCheckingSolved(false);
    };

    checkSolvedStatus();
  }, [caseData.id]);

  const showSuccess = submitted && isCorrect;
  const showIncorrect = submitted && !isCorrect;

  if (checkingSolved) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col items-start justify-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <h3 className="font-detective text-2xl text-green-900">
                Case Solved!
              </h3>
            </div>
            <p className="text-green-800 mt-1">
              {caseData.solution.successMessage}
            </p>
          </div>

          <div className="pt-4 border-t border-green-200">
            <h4 className="font-detective text-lg text-green-900 mb-2">
              Explanation
            </h4>
            <p className="text-green-800 leading-relaxed">
              {caseData.solution.explanation}
            </p>
          </div>

          {!user && (
            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm font-medium">
                Note: Create an account to save your XP rewards for solved
                cases.
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 gap-4">
            <div>
              <p className="font-detective text-amber-900">
                Enjoyed the mystery?
              </p>
              <p className="text-amber-700 text-sm">
                Share SQLNoir with another detective and see if they can solve
                it too.
              </p>
            </div>
            <div className="flex sm:block">
              <button
                type="button"
                onClick={() => {
                  setShareContext("case-solved");
                  track("share_open", { context: "case-solved", case_slug: caseData.id });
                  setIsShareOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-700 text-amber-50 hover:bg-amber-600 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                <Share2 className="w-4 h-4" />
                <span>Share SQLNoir</span>
              </button>
            </div>
          </div>
        </div>
        <SharePopup
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          context={shareContext}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-amber-50 p-4 sm:p-6 rounded-xl border border-amber-900/10 space-y-4">
        <h3 className="font-detective text-2xl text-amber-900">
          Submit Your Findings
        </h3>
        {showIncorrect ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-detective text-xl text-red-800">
                  Not Quite Right
                </h4>
                <p className="text-red-700 mt-1">
                  Try again with a different answer.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-red-700 hover:text-red-800 font-detective"
            >
              Try Again
            </button>
          </div>
        ) : (
          <p className="text-amber-700">
            Submit the suspect you discovered through your investigation to see
            if you cracked the case.
          </p>
        )}

        {!showIncorrect && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-detective text-amber-800 mb-2">
                Your Answer
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your answer..."
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-amber-700">
                Enter the specific name you found through your investigation.
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  bg-amber-700 hover:bg-amber-600 text-amber-100 px-6 py-2 rounded-lg 
                  flex items-center font-detective transition-colors
                  ${isLoading ? "opacity-75 cursor-not-allowed" : ""}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
