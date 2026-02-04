"use client";

import React, { useState, useCallback } from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface QuizQuestion {
  /** The question text */
  question: string;
  /** Answer options */
  options: string[];
  /** Index of the correct answer in options */
  correctIndex: number;
  /** Explanation shown after answering */
  explanation: string;
}

export interface QuickQuizProps {
  /** Quiz questions (2-4 recommended) */
  questions: QuizQuestion[];
  /** Optional title — defaults to "🔍 Detective's Quiz" */
  title?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function QuickQuiz({ questions, title }: QuickQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const totalAnswered = Object.keys(revealed).length;
  const score = Object.entries(revealed).reduce((acc, [idx]) => {
    const qIdx = Number(idx);
    return acc + (answers[qIdx] === questions[qIdx].correctIndex ? 1 : 0);
  }, 0);
  const isComplete = totalAnswered === questions.length;

  const handleSelect = useCallback(
    (questionIdx: number, optionIdx: number) => {
      if (revealed[questionIdx]) return;
      setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
      setRevealed((prev) => ({ ...prev, [questionIdx]: true }));
    },
    [revealed]
  );

  const handleReset = useCallback(() => {
    setAnswers({});
    setRevealed({});
  }, []);

  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-amber-800 px-5 py-3 flex items-center justify-between">
          <h3 className="font-detective text-amber-50 text-base tracking-wide">
            {title ?? "🔍 Detective\u2019s Quiz"}
          </h3>
          {totalAnswered > 0 && (
            <span className="text-xs text-amber-200 font-mono">
              {score}/{totalAnswered}
            </span>
          )}
        </div>

        {/* Questions */}
        <div className="divide-y divide-amber-100">
          {questions.map((q, qIdx) => {
            const isRevealed = revealed[qIdx];
            const selected = answers[qIdx];
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={qIdx} className="px-5 py-4 space-y-3">
                {/* Question */}
                <p className="text-sm font-semibold text-amber-900">
                  <span className="text-amber-600 mr-1.5">Q{qIdx + 1}.</span>
                  {q.question}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    let btnClass =
                      "px-3 py-2 rounded-lg border text-sm text-left transition-colors ";

                    if (!isRevealed) {
                      btnClass +=
                        "border-amber-200 bg-white hover:bg-amber-100/60 hover:border-amber-300 text-gray-800 cursor-pointer";
                    } else if (oIdx === q.correctIndex) {
                      btnClass +=
                        "border-green-300 bg-green-50 text-green-800 cursor-default";
                    } else if (oIdx === selected) {
                      btnClass +=
                        "border-red-300 bg-red-50 text-red-800 cursor-default";
                    } else {
                      btnClass +=
                        "border-amber-100 bg-amber-50/30 text-gray-400 cursor-default";
                    }

                    return (
                      <button
                        key={oIdx}
                        className={btnClass}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        disabled={isRevealed}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {isRevealed && (
                  <div
                    className={`text-xs leading-relaxed px-3 py-2 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <span className="font-semibold">
                      {isCorrect ? "✅ Correct!" : "❌ Not quite."}
                    </span>{" "}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results */}
        {isComplete && (
          <div className="px-5 py-4 bg-amber-100/50 border-t border-amber-200 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm font-detective text-amber-900">
              Case closed: {score}/{questions.length} correct
              {score === questions.length && " — Perfect detective work! 🕵️"}
            </p>
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
