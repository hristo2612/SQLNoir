"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface VennDiagramProps {
  /** Label for the left circle */
  leftLabel: string;
  /** Label for the right circle */
  rightLabel: string;
  /** Text shown in the left-only region */
  leftOnly?: string;
  /** Text shown in the right-only region */
  rightOnly?: string;
  /** Text shown in the overlapping region */
  overlap?: string;
  /** Which area to highlight with amber fill */
  highlightArea?: "left" | "right" | "overlap" | "all" | "outer";
  /** Caption below the diagram */
  caption?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Decide fill + opacity for a given circle region based on highlight */
function regionStyle(
  region: "left" | "right",
  highlight?: VennDiagramProps["highlightArea"]
): { fill: string; opacity: number } {
  const amber = { fill: "#d97706", opacity: 0.35 }; // amber-600
  const muted = { fill: "#e5e7eb", opacity: 0.45 }; // gray-200

  if (!highlight) return muted;

  switch (highlight) {
    case "all":
      return amber;
    case "outer":
      return muted; // outer highlights handled by background
    case "overlap":
      return muted;
    case region:
      return amber;
    default:
      return muted;
  }
}

// ─── SVG text word-wrap helper ───────────────────────────────────────────────

function SvgText({
  x,
  y,
  text,
  maxWidth = 100,
  fontSize = 13,
  fill = "#1c1917",
  fontWeight = "normal",
}: {
  x: number;
  y: number;
  text: string;
  maxWidth?: number;
  fontSize?: number;
  fill?: string;
  fontWeight?: string;
}) {
  // Simple word-wrap: split into lines based on approximate char width
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.55));
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > charsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);

  const lineHeight = fontSize * 1.3;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={x}
      y={startY}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fill={fill}
      fontWeight={fontWeight}
      style={{ fontFamily: "'Special Elite', monospace" }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VennDiagram({
  leftLabel,
  rightLabel,
  leftOnly,
  rightOnly,
  overlap,
  highlightArea,
  caption,
}: VennDiagramProps) {
  // Circle geometry (within a 400×280 viewBox)
  const cx1 = 145;
  const cx2 = 255;
  const cy = 150;
  const r = 100;

  const leftStyle = regionStyle("left", highlightArea);
  const rightStyle = regionStyle("right", highlightArea);

  // Overlap highlight: uses a clip-path intersection
  const overlapActive =
    highlightArea === "overlap" || highlightArea === "all";

  return (
    <div className="not-prose my-8 flex flex-col items-center">
      <svg
        viewBox="0 0 400 280"
        className="w-full max-w-md"
        role="img"
        aria-label={`Venn diagram: ${leftLabel} and ${rightLabel}`}
      >
        <defs>
          {/* Clip for the overlap region (intersection of both circles) */}
          <clipPath id="clip-left">
            <circle cx={cx1} cy={cy} r={r} />
          </clipPath>
          <clipPath id="clip-right">
            <circle cx={cx2} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* ── Left circle ── */}
        <circle
          cx={cx1}
          cy={cy}
          r={r}
          fill={leftStyle.fill}
          opacity={leftStyle.opacity}
          stroke="#92400e"
          strokeWidth={2}
        />

        {/* ── Right circle ── */}
        <circle
          cx={cx2}
          cy={cy}
          r={r}
          fill={rightStyle.fill}
          opacity={rightStyle.opacity}
          stroke="#92400e"
          strokeWidth={2}
        />

        {/* ── Overlap highlight ── */}
        {overlapActive && (
          <circle
            cx={cx2}
            cy={cy}
            r={r}
            fill="#d97706"
            opacity={0.5}
            clipPath="url(#clip-left)"
          />
        )}

        {/* ── Circle labels (top) ── */}
        <SvgText
          x={cx1 - 40}
          y={cy - r - 14}
          text={leftLabel}
          fontSize={15}
          fill="#92400e"
          fontWeight="bold"
        />
        <SvgText
          x={cx2 + 40}
          y={cy - r - 14}
          text={rightLabel}
          fontSize={15}
          fill="#92400e"
          fontWeight="bold"
        />

        {/* ── Region text ── */}
        {leftOnly && (
          <SvgText
            x={cx1 - 50}
            y={cy}
            text={leftOnly}
            maxWidth={80}
            fontSize={12}
            fill="#44403c"
          />
        )}
        {rightOnly && (
          <SvgText
            x={cx2 + 50}
            y={cy}
            text={rightOnly}
            maxWidth={80}
            fontSize={12}
            fill="#44403c"
          />
        )}
        {overlap && (
          <SvgText
            x={(cx1 + cx2) / 2}
            y={cy}
            text={overlap}
            maxWidth={70}
            fontSize={12}
            fill="#1c1917"
            fontWeight="bold"
          />
        )}
      </svg>

      {/* ── Caption ── */}
      {caption && (
        <p className="mt-3 text-center text-sm text-amber-700/80 font-detective tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
