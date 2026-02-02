"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ComparisonTableProps {
  /** Column headers */
  headers: string[];
  /** Table rows — each inner array matches the headers */
  rows: string[][];
  /** Optional caption shown below the table */
  caption?: string;
  /** Bold the first column (useful for feature-name columns) */
  highlightFirst?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ComparisonTable({
  headers,
  rows,
  caption,
  highlightFirst = true,
}: ComparisonTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className="not-prose my-8">
      {/* Horizontal-scroll wrapper for mobile with fade hint */}
      <div className="relative rounded-xl shadow-sm border border-amber-200">
        <div
          ref={scrollRef}
          className="overflow-x-auto rounded-xl"
        >
          <table className="w-full min-w-[480px] border-collapse text-sm sm:text-base">
            {/* ── Header ── */}
            <thead>
              <tr className="bg-amber-800 text-amber-50">
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 font-detective text-left tracking-wide ${
                      i === 0 ? "rounded-tl-xl" : ""
                    } ${i === headers.length - 1 ? "rounded-tr-xl" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`
                    border-t border-amber-100 transition-colors
                    ${rowIdx % 2 === 0 ? "bg-amber-50/60" : "bg-white"}
                    hover:bg-amber-100/50
                  `}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-4 py-3 text-gray-800 ${
                        highlightFirst && cellIdx === 0
                          ? "font-semibold text-amber-900"
                          : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll-right fade hint */}
        {canScrollRight && (
          <div
            className="absolute right-0 top-0 bottom-0 pointer-events-none z-20 rounded-r-xl"
            style={{
              width: 40,
              background: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        )}
      </div>

      {/* Swipe hint for mobile */}
      {canScrollRight && (
        <p className="mt-1.5 text-center text-xs text-amber-600/70 sm:hidden">
          ← Swipe to see more →
        </p>
      )}

      {/* ── Caption ── */}
      {caption && (
        <p className="mt-3 text-center text-sm text-amber-700/80 font-detective tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
