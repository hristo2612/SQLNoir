"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface SQLClause {
  /** SQL keyword (e.g. "SELECT", "FROM", "WHERE") */
  keyword: string;
  /** The code following the keyword */
  code: string;
  /** Optional annotation explaining the clause */
  annotation?: string;
}

export interface SQLQueryBreakdownProps {
  /** Ordered clauses that make up the query */
  clauses: SQLClause[];
  /** Optional caption below the breakdown */
  caption?: string;
}

// ─── Keyword colour map (amber palette variations) ───────────────────────────

const keywordColors: Record<string, string> = {
  SELECT: "text-amber-900 bg-amber-200/60",
  FROM: "text-amber-800 bg-amber-100/80",
  WHERE: "text-amber-700 bg-amber-300/40",
  JOIN: "text-amber-900 bg-amber-200/50",
  "INNER JOIN": "text-amber-900 bg-amber-200/50",
  "LEFT JOIN": "text-amber-800 bg-amber-200/40",
  "RIGHT JOIN": "text-amber-800 bg-amber-200/40",
  "FULL JOIN": "text-amber-800 bg-amber-200/40",
  "CROSS JOIN": "text-amber-800 bg-amber-200/40",
  ON: "text-amber-700 bg-amber-100/60",
  "GROUP BY": "text-amber-900 bg-amber-300/50",
  "ORDER BY": "text-amber-800 bg-amber-100/70",
  HAVING: "text-amber-700 bg-amber-200/60",
  LIMIT: "text-amber-800 bg-amber-100/50",
  INSERT: "text-amber-900 bg-amber-200/60",
  UPDATE: "text-amber-900 bg-amber-200/60",
  DELETE: "text-amber-900 bg-amber-300/50",
  SET: "text-amber-800 bg-amber-100/60",
  VALUES: "text-amber-800 bg-amber-100/60",
};

function colorForKeyword(keyword: string): string {
  return keywordColors[keyword.toUpperCase()] ?? "text-amber-800 bg-amber-100/50";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SQLQueryBreakdown({ clauses, caption }: SQLQueryBreakdownProps) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm overflow-hidden">
        {/* Code block */}
        <div className="p-4 sm:p-5 space-y-1">
          {clauses.map((clause, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                {/* Keyword */}
                <span
                  className={`inline-block shrink-0 px-2 py-0.5 rounded font-mono font-bold text-sm tracking-wide ${colorForKeyword(clause.keyword)}`}
                >
                  {clause.keyword}
                </span>
                {/* Code */}
                <code className="font-mono text-sm text-gray-800 pt-0.5 break-all">
                  {clause.code}
                </code>
              </div>
              {/* Annotation */}
              {clause.annotation && (
                <span className="text-xs italic text-amber-600/80 sm:text-right shrink-0 pl-6 sm:pl-0 sm:max-w-[200px]">
                  {clause.annotation}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <p className="mt-3 text-center text-sm text-amber-700/80 font-detective tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
