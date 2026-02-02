"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Step {
  /** Step number (displayed in the circle) */
  number: number;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Emoji icon (rendered inside the circle instead of the number) */
  icon?: string;
  /** Duration label (e.g. "Week 1-2") shown as a badge */
  duration?: string;
}

export interface ProcessStepsProps {
  /** Ordered steps */
  steps: Step[];
  /** Caption below the diagram */
  caption?: string;
}

// ─── Step circle ─────────────────────────────────────────────────────────────

function StepCircle({ step }: { step: Step }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-full bg-amber-800 text-amber-50 shadow-sm font-detective font-bold"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {step.icon ? (
          <span
            role="img"
            style={{
              fontSize: 22,
              lineHeight: 1,
              transform: "translate(-0.75px, 3px)",
            }}
          >
            {step.icon}
          </span>
        ) : (
          <span className="text-lg">{step.number}</span>
        )}
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProcessSteps({ steps, caption }: ProcessStepsProps) {
  return (
    <div className="not-prose my-8">
      <div className="flex flex-col items-start gap-0 pl-2">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.number} className="flex gap-4">
              {/* Left rail: circle + connecting line */}
              <div className="flex flex-col items-center">
                <StepCircle step={step} />
                {/* Connecting line */}
                {!isLast && (
                  <div className="w-0.5 h-full min-h-[40px] bg-amber-300" />
                )}
              </div>

              {/* Right: content */}
              <div className="pb-8 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-amber-900 font-detective">
                    {step.title}
                  </h4>
                  {step.duration && (
                    <span className="inline-block bg-amber-100 text-amber-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
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
