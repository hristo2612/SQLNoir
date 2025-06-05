import React, { useEffect, useState } from "react";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Case } from "../../types";

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
  const [user, setUser] = useState<any>(null);      // Storing user data if logged in for conditional rendering XP reward message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if the answer matches the solution (case-insensitive)
      const isAnswerCorrect =
        answer.trim().toLowerCase() === caseData.solution.answer.toLowerCase();

      if (isAnswerCorrect) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-amber-100/50 p-6 rounded-lg border border-amber-900/10">
        <h3 className="font-detective text-xl text-amber-900 mb-4">
          Submit Your Findings
        </h3>

        {submitted ? (
          <div
            className={`p-6 rounded-lg ${
              isCorrect ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="flex items-start">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
              )}
              <div>
                <h4
                  className={`font-detective text-lg mb-2 ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect ? "Case Solved!" : "Not Quite Right"}
                </h4>
                <p
                  className={`mb-4 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect
                    ? caseData.solution.successMessage
                    : "Try again with a different answer."}
                </p>
                {isCorrect && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h5 className="font-detective text-green-800 mb-2">
                      Case Explanation
                    </h5>
                    <p className="text-green-700">
                      {caseData.solution.explanation}
                    </p>
                  </div>
                )}
                {/* Showing this only when user is not logged in */}
                {!user && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-800 text-sm font-medium">
                      Note: You need an account to gain the XP reward for this
                      case.
                    </p>
                  </div>
                )}
                {!isCorrect && (
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-red-600 hover:text-red-700 font-detective"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
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

            <div className="flex justify-end">
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
