"use client";

import React, { useRef, useState, useEffect } from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface FlowNode {
  /** Primary label */
  label: string;
  /** Optional secondary text */
  description?: string;
  /** Emoji icon rendered before the label */
  icon?: string;
  /** Visual style of the node */
  type?: "start" | "process" | "decision" | "end";
}

export interface FlowDiagramProps {
  /** Ordered list of nodes */
  nodes: FlowNode[];
  /** Caption below the diagram */
  caption?: string;
}

// ─── Node style maps ─────────────────────────────────────────────────────────

const nodeStyles: Record<
  NonNullable<FlowNode["type"]>,
  { wrapper: string; label: string }
> = {
  start: {
    wrapper: "bg-amber-800 text-amber-50 rounded-full shadow-sm",
    label: "font-detective font-bold tracking-wide",
  },
  process: {
    wrapper:
      "bg-amber-50 text-amber-900 border-2 border-amber-200 rounded-xl shadow-sm",
    label: "font-medium",
  },
  decision: {
    wrapper: "",
    label: "font-detective font-semibold",
  },
  end: {
    wrapper: "bg-amber-800 text-amber-50 rounded-full shadow-sm",
    label: "font-detective font-bold tracking-wide",
  },
};

// ─── Arrow (SVG) ─────────────────────────────────────────────────────────────

function VerticalArrow() {
  return (
    <div className="flex justify-center py-1">
      <svg
        width="20"
        height="28"
        viewBox="0 0 20 28"
        fill="none"
        className="text-amber-400"
      >
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polygon points="4,18 10,27 16,18" fill="currentColor" />
      </svg>
    </div>
  );
}

// ─── Diamond Node (SVG polygon, dynamically sized) ───────────────────────────

function DiamondNode({ node }: { node: FlowNode }) {
  const style = nodeStyles.decision;
  const measureRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 140, h: 90 });

  useEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      const padX = 16;
      const padY = 12;
      // For a diamond polygon(W/2,0  W,H/2  W/2,H  0,H/2),
      // the max inscribed rect centered at midpoint has dimensions W/2 × H/2.
      // So W = 2*(contentW + padX), H = 2*(contentH + padY).
      // Add 10% safety margin.
      setDims({
        w: Math.max(100, Math.ceil(2.2 * (rect.width + padX))),
        h: Math.max(80, Math.ceil(2.2 * (rect.height + padY))),
      });
    }
  }, [node.label, node.icon]);

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      {/* Hidden measurement element — mirrors visible content styling */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="flex flex-col items-center"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          visibility: "hidden",
          maxWidth: 140,
        }}
      >
        {node.icon && (
          <span style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>
            {node.icon}
          </span>
        )}
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.25,
            textAlign: "center",
          }}
        >
          {node.label}
        </span>
      </div>

      {/* Diamond shape with SVG background */}
      <div className="relative" style={{ width: dims.w, height: dims.h }}>
        <svg
          className="absolute inset-0"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          width={dims.w}
          height={dims.h}
        >
          <polygon
            points={`${dims.w / 2},2 ${dims.w - 2},${dims.h / 2} ${dims.w / 2},${dims.h - 2} 2,${dims.h / 2}`}
            fill="#fef3c7"
            stroke="#fcd34d"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {node.icon && (
            <span className="text-lg mb-0.5" role="img">
              {node.icon}
            </span>
          )}
          <span
            className={`${style.label} text-sm leading-tight text-amber-900 text-center`}
            style={{ maxWidth: 140 }}
          >
            {node.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {node.description && (
        <p className="mt-2 text-xs text-gray-600 text-center leading-relaxed max-w-[220px]">
          {node.description}
        </p>
      )}
    </div>
  );
}

// ─── Rectangular / Pill Node (naturally sized) ───────────────────────────────

function RectNode({ node }: { node: FlowNode }) {
  const type = node.type ?? "process";
  const style = nodeStyles[type];

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
      <div className={`${style.wrapper} text-center px-5 py-3`}>
        <div className="flex items-center justify-center gap-2">
          {node.icon && (
            <span className="text-lg" role="img">
              {node.icon}
            </span>
          )}
          <span className={style.label}>{node.label}</span>
        </div>
      </div>

      {/* Description */}
      {node.description && (
        <p className="mt-2 text-xs text-gray-600 text-center leading-relaxed max-w-[200px]">
          {node.description}
        </p>
      )}
    </div>
  );
}

// ─── Single Node dispatcher ─────────────────────────────────────────────────

function FlowNodeCard({ node }: { node: FlowNode }) {
  const type = node.type ?? "process";
  if (type === "decision") {
    return <DiamondNode node={node} />;
  }
  return <RectNode node={node} />;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlowDiagram({ nodes, caption }: FlowDiagramProps) {
  return (
    <div className="not-prose my-8">
      <div className="flex flex-col items-center gap-0 py-4">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <FlowNodeCard node={node} />
            {i < nodes.length - 1 && <VerticalArrow />}
          </React.Fragment>
        ))}
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
