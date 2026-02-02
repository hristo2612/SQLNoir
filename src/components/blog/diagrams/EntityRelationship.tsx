"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ERTable {
  /** Table name (used as identifier for relations) */
  name: string;
  /** Column names */
  columns: string[];
  /** Column name that is the primary key (bolded + key icon) */
  primaryKey?: string;
}

export interface ERRelation {
  /** Source table name (the "one" / PK side) */
  from: string;
  /** Target table name (the "many" / FK side) */
  to: string;
  /** Column in the source table (typically the PK) */
  fromColumn: string;
  /** Column in the target table (typically the FK) */
  toColumn: string;
  /** Label on the connecting line */
  label?: string;
  /** Cardinality notation */
  type?: "1:1" | "1:N" | "N:M";
}

export interface EntityRelationshipProps {
  /** Table definitions */
  tables: ERTable[];
  /** Relations between tables */
  relations: ERRelation[];
  /** Caption below the diagram */
  caption?: string;
}

// ─── Path data ───────────────────────────────────────────────────────────────

interface PathInfo {
  d: string;
  label?: string;
  type?: string;
}

// ─── Table card ──────────────────────────────────────────────────────────────

function TableCard({ table }: { table: ERTable }) {
  return (
    <div
      data-er-table={table.name}
      className="bg-white border-2 border-amber-200 rounded-xl shadow-sm overflow-hidden min-w-[160px]"
    >
      {/* Table header */}
      <div className="bg-amber-800 text-amber-50 px-4 py-2.5 font-detective text-sm tracking-wide font-bold">
        📋 {table.name}
      </div>

      {/* Columns */}
      <ul className="divide-y divide-amber-100">
        {table.columns.map((col) => {
          const isPK = table.primaryKey === col;
          return (
            <li
              key={col}
              data-er-table={table.name}
              data-er-column={col}
              className={`px-4 py-1.5 text-sm flex items-center gap-2 ${
                isPK
                  ? "bg-amber-50 text-amber-900 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {isPK && (
                <span className="text-amber-600 text-xs" title="Primary Key">
                  🔑
                </span>
              )}
              <span>{col}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Compute SVG paths between columns ───────────────────────────────────────

function computeConnectionPaths(
  container: HTMLElement,
  relations: ERRelation[]
): PathInfo[] {
  const containerRect = container.getBoundingClientRect();
  const paths: PathInfo[] = [];

  for (const rel of relations) {
    const fromEl = container.querySelector(
      `[data-er-table="${rel.from}"][data-er-column="${rel.fromColumn}"]`
    );
    const toEl = container.querySelector(
      `[data-er-table="${rel.to}"][data-er-column="${rel.toColumn}"]`
    );
    if (!fromEl || !toEl) continue;

    const fromCard = container.querySelector(
      `[data-er-table="${rel.from}"]:not([data-er-column])`
    );
    const toCard = container.querySelector(
      `[data-er-table="${rel.to}"]:not([data-er-column])`
    );
    if (!fromCard || !toCard) continue;

    const fromColRect = fromEl.getBoundingClientRect();
    const toColRect = toEl.getBoundingClientRect();
    const fromCardRect = fromCard.getBoundingClientRect();
    const toCardRect = toCard.getBoundingClientRect();

    const fromIsLeft =
      fromCardRect.left + fromCardRect.width / 2 <
      toCardRect.left + toCardRect.width / 2;

    const fromCY =
      (fromColRect.top + fromColRect.bottom) / 2 - containerRect.top;
    const toCY =
      (toColRect.top + toColRect.bottom) / 2 - containerRect.top;

    let startX: number, endX: number;

    if (fromIsLeft) {
      startX = fromCardRect.right - containerRect.left;
      endX = toCardRect.left - containerRect.left;
    } else {
      startX = fromCardRect.left - containerRect.left;
      endX = toCardRect.right - containerRect.left;
    }

    const dx = Math.abs(endX - startX);
    const cpOffset = Math.max(dx * 0.4, 30);

    const cx1 = fromIsLeft ? startX + cpOffset : startX - cpOffset;
    const cx2 = fromIsLeft ? endX - cpOffset : endX + cpOffset;

    const d = `M ${startX} ${fromCY} C ${cx1} ${fromCY}, ${cx2} ${toCY}, ${endX} ${toCY}`;

    paths.push({ d, label: rel.label, type: rel.type });
  }

  return paths;
}

// ─── SVG Connection overlay (lines only — no text) ──────────────────────────

function ConnectionsSVG({
  paths,
  width,
  height,
}: {
  paths: PathInfo[];
  width: number;
  height: number;
}) {
  if (paths.length === 0 || width === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ zIndex: 10 }}
    >
      <defs>
        <marker
          id="er-dot"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="6"
          markerHeight="6"
        >
          <circle cx="4" cy="4" r="3" fill="#d97706" />
        </marker>
      </defs>

      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="#d97706"
          strokeWidth={2}
          markerStart="url(#er-dot)"
          markerEnd="url(#er-dot)"
        />
      ))}
    </svg>
  );
}

// ─── Relation legend (text details for accessibility) ────────────────────────

function RelationLegend({ relations }: { relations: ERRelation[] }) {
  if (relations.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {relations.map((rel, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 text-xs text-gray-600"
        >
          <span className="font-semibold text-amber-800">
            {rel.from}.{rel.fromColumn}
          </span>
          <span className="text-amber-400">→</span>
          <span className="font-semibold text-amber-800">
            {rel.to}.{rel.toColumn}
          </span>
          {rel.type && (
            <span className="inline-block bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md font-detective">
              {rel.type}
            </span>
          )}
          {rel.label && (
            <span className="text-gray-500 italic">({rel.label})</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EntityRelationship({
  tables,
  relations,
  caption,
}: EntityRelationshipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const recompute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSvgSize({ width: rect.width, height: rect.height });
    setPaths(computeConnectionPaths(el, relations));
  }, [relations]);

  useEffect(() => {
    const t1 = setTimeout(recompute, 50);
    const t2 = setTimeout(recompute, 300);

    let ro: ResizeObserver | undefined;
    if (containerRef.current) {
      ro = new ResizeObserver(() => recompute());
      ro.observe(containerRef.current);
    }

    window.addEventListener("resize", recompute);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro?.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  return (
    <div className="not-prose my-8">
      {/* Desktop: tables + SVG overlay */}
      <div ref={containerRef} className="relative hidden md:block">
        <div className="flex flex-nowrap gap-12 justify-center items-start py-4 px-8">
          {tables.map((table) => (
            <TableCard key={table.name} table={table} />
          ))}
        </div>
        <ConnectionsSVG
          paths={paths}
          width={svgSize.width}
          height={svgSize.height}
        />
      </div>

      {/* Mobile: stacked cards + legend */}
      <div className="md:hidden flex flex-col items-center gap-4 py-4 px-2">
        {tables.map((table) => (
          <div key={table.name} className="w-full max-w-sm">
            <TableCard table={table} />
          </div>
        ))}
      </div>

      {/* Legend always visible for accessibility */}
      <RelationLegend relations={relations} />

      {/* Caption */}
      {caption && (
        <p className="mt-3 text-center text-sm text-amber-700/80 font-detective tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
