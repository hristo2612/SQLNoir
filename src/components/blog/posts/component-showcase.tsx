"use client";

import Link from "next/link";
import {
  ComparisonTable,
  VennDiagram,
  FlowDiagram,
  EntityRelationship,
  ProcessSteps,
} from "@/components/blog/diagrams";

export default function ComponentShowcase() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        A showcase of every diagram component available for SQLNoir blog posts. Each one is styled in our amber/sepia detective palette and works on mobile.
      </p>

      {/* ─── Quick Navigation ─── */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Components on Display
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• <a href="#comparison-table" className="hover:underline">ComparisonTable</a></li>
          <li>• <a href="#venn-diagram" className="hover:underline">VennDiagram</a></li>
          <li>• <a href="#flow-diagram" className="hover:underline">FlowDiagram</a></li>
          <li>• <a href="#entity-relationship" className="hover:underline">EntityRelationship</a></li>
          <li>• <a href="#process-steps" className="hover:underline">ProcessSteps</a></li>
        </ul>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  1. COMPARISON TABLE                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 id="comparison-table" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        ComparisonTable
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Perfect for side-by-side feature comparisons. Supports emojis, optional first-column highlighting, and captions. Scrolls horizontally on mobile.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">Example 1: SQL vs Excel vs Python</h3>

      <ComparisonTable
        headers={["Feature", "SQL", "Excel", "Python"]}
        rows={[
          ["Handle 1M+ rows", "✅ Native", "❌ Crashes", "✅ With pandas"],
          ["Learning curve", "⚠️ Medium", "✅ Easy", "⚠️ Medium"],
          ["Reproducibility", "✅ Queries save", "❌ Click-dependent", "✅ Scripts save"],
          ["Team collaboration", "✅ Shared queries", "⚠️ File versioning", "✅ Git-friendly"],
          ["Real-time dashboards", "⚠️ Needs BI tool", "⚠️ Limited", "✅ Streamlit/Dash"],
          ["Job market demand", "🔥 Very high", "📊 Expected", "🔥 Very high"],
        ]}
        caption="SQL vs Excel vs Python for Data Analysis"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Example 2: JOIN Types at a Glance</h3>

      <ComparisonTable
        headers={["JOIN Type", "Left Table", "Right Table", "Use When"]}
        rows={[
          ["INNER JOIN", "✅ Matching only", "✅ Matching only", "You need rows that exist in both"],
          ["LEFT JOIN", "✅ All rows", "⚠️ Matching + NULLs", "You want everything from the left"],
          ["RIGHT JOIN", "⚠️ Matching + NULLs", "✅ All rows", "You want everything from the right"],
          ["FULL OUTER", "✅ All rows", "✅ All rows", "You want the complete picture"],
          ["CROSS JOIN", "✅ Every row", "✅ Every row", "You need all combinations"],
        ]}
        caption="Quick reference for SQL JOIN types"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Example 3: Without first-column highlight</h3>

      <ComparisonTable
        headers={["Database", "Best For", "License"]}
        rows={[
          ["PostgreSQL", "Complex queries, analytics", "Open source"],
          ["MySQL", "Web apps, read-heavy", "Open source"],
          ["SQLite", "Embedded, local apps", "Public domain"],
          ["SQL Server", "Enterprise, .NET stack", "Commercial"],
        ]}
        highlightFirst={false}
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  2. VENN DIAGRAM                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 id="venn-diagram" className="text-3xl font-detective text-amber-900 mt-16 mb-6">
        VennDiagram
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SVG-based Venn diagrams for visualizing set operations, JOINs, and concept overlaps. Supports highlighting specific regions.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">INNER JOIN (overlap highlighted)</h3>

      <VennDiagram
        leftLabel="Suspects"
        rightLabel="Witnesses"
        leftOnly="Only suspects"
        rightOnly="Only witnesses"
        overlap="Both suspect and witness"
        highlightArea="overlap"
        caption="INNER JOIN returns only rows that exist in both tables"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">LEFT JOIN (left highlighted)</h3>

      <VennDiagram
        leftLabel="Employees"
        rightLabel="Departments"
        leftOnly="No department assigned"
        rightOnly="Empty departments"
        overlap="Assigned"
        highlightArea="left"
        caption="LEFT JOIN keeps all employees, even those without a department"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">FULL OUTER JOIN (all highlighted)</h3>

      <VennDiagram
        leftLabel="Table A"
        rightLabel="Table B"
        leftOnly="Only in A"
        rightOnly="Only in B"
        overlap="In both"
        highlightArea="all"
        caption="FULL OUTER JOIN returns everything from both tables"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Concept overlap (no highlight)</h3>

      <VennDiagram
        leftLabel="Data Analyst"
        rightLabel="Data Engineer"
        leftOnly="Dashboards, reports"
        rightOnly="Pipelines, infra"
        overlap="SQL, Python"
        caption="Skills overlap between Data Analysts and Data Engineers"
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  3. FLOW DIAGRAM                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 id="flow-diagram" className="text-3xl font-detective text-amber-900 mt-16 mb-6">
        FlowDiagram
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Process flows with four node types: start, process, decision, and end. Vertical layout for mobile-friendly reading.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">SQL Query Execution Order</h3>

      <FlowDiagram
        nodes={[
          { label: "FROM / JOIN", icon: "📋", type: "start", description: "Identify and combine source tables" },
          { label: "WHERE", icon: "🔍", type: "process", description: "Filter rows before grouping" },
          { label: "GROUP BY", icon: "📊", type: "process", description: "Aggregate rows into groups" },
          { label: "HAVING", icon: "⚖️", type: "decision", description: "Filter groups after aggregation" },
          { label: "SELECT", icon: "✏️", type: "process", description: "Choose columns and expressions" },
          { label: "ORDER BY", icon: "🔢", type: "process", description: "Sort the final result set" },
          { label: "LIMIT", icon: "✅", type: "end", description: "Return only N rows" },
        ]}
        caption="The actual order SQL processes your query (not the order you write it)"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Simple ETL flow</h3>

      <FlowDiagram
        nodes={[
          { label: "Raw Data", icon: "📦", type: "start" },
          { label: "Clean", icon: "🧹", type: "process" },
          { label: "Transform", icon: "⚙️", type: "process" },
          { label: "Load", icon: "📥", type: "process" },
          { label: "Dashboard", icon: "📊", type: "end" },
        ]}
        caption="ETL Pipeline: Extract → Transform → Load"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Decision flow</h3>

      <FlowDiagram
        nodes={[
          { label: "New Query", icon: "💡", type: "start" },
          { label: "Need data from multiple tables?", type: "decision" },
          { label: "Use JOIN", icon: "🔗", type: "process", description: "INNER, LEFT, RIGHT, or FULL" },
          { label: "Need to filter groups?", type: "decision" },
          { label: "Use HAVING", icon: "⚖️", type: "process", description: "Filter after GROUP BY" },
          { label: "Run Query", icon: "🚀", type: "end" },
        ]}
        caption="Decision tree for building a SQL query"
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  4. ENTITY RELATIONSHIP                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 id="entity-relationship" className="text-3xl font-detective text-amber-900 mt-16 mb-6">
        EntityRelationship
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        ER diagrams with table cards, primary key highlighting, and connecting lines. Automatically computes connections and includes a mobile-friendly legend.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">Detective Case Database</h3>

      <EntityRelationship
        tables={[
          {
            name: "suspects",
            columns: ["id", "name", "age", "occupation", "alibi"],
            primaryKey: "id",
          },
          {
            name: "crime_scenes",
            columns: ["id", "location", "date", "suspect_id", "evidence"],
            primaryKey: "id",
          },
          {
            name: "witnesses",
            columns: ["id", "name", "statement", "crime_scene_id"],
            primaryKey: "id",
          },
        ]}
        relations={[
          { from: "suspects", to: "crime_scenes", fromColumn: "id", toColumn: "suspect_id", type: "1:N", label: "accused at" },
          { from: "crime_scenes", to: "witnesses", fromColumn: "id", toColumn: "crime_scene_id", type: "1:N", label: "observed by" },
        ]}
        caption="SQLNoir case file schema: suspects, crime scenes, and witnesses"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">E-Commerce Schema</h3>

      <EntityRelationship
        tables={[
          {
            name: "customers",
            columns: ["customer_id", "name", "email", "signup_date"],
            primaryKey: "customer_id",
          },
          {
            name: "orders",
            columns: ["order_id", "customer_id", "total", "status", "created_at"],
            primaryKey: "order_id",
          },
          {
            name: "order_items",
            columns: ["item_id", "order_id", "product_id", "quantity", "price"],
            primaryKey: "item_id",
          },
          {
            name: "products",
            columns: ["product_id", "name", "category", "price", "stock"],
            primaryKey: "product_id",
          },
        ]}
        relations={[
          { from: "customers", to: "orders", fromColumn: "customer_id", toColumn: "customer_id", type: "1:N", label: "places" },
          { from: "orders", to: "order_items", fromColumn: "order_id", toColumn: "order_id", type: "1:N", label: "contains" },
          { from: "products", to: "order_items", fromColumn: "product_id", toColumn: "product_id", type: "1:N", label: "sold as" },
        ]}
        caption="Classic e-commerce database schema"
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  5. PROCESS STEPS                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 id="process-steps" className="text-3xl font-detective text-amber-900 mt-16 mb-6">
        ProcessSteps
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Timeline/roadmap visualization. Supports numbered circles or emoji icons, duration badges, in a vertical layout.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">SQL Learning Roadmap</h3>

      <ProcessSteps
        steps={[
          { number: 1, title: "SELECT & WHERE", description: "Query single tables, filter rows, sort results. The foundation of everything.", duration: "Week 1", icon: "📝" },
          { number: 2, title: "JOINs", description: "Combine data from multiple tables. Master INNER, LEFT, and RIGHT JOINs.", duration: "Week 2-3", icon: "🔗" },
          { number: 3, title: "GROUP BY & Aggregates", description: "COUNT, SUM, AVG, MIN, MAX. Summarize data into meaningful groups.", duration: "Week 3-4", icon: "📊" },
          { number: 4, title: "Subqueries", description: "Nest queries inside queries. Filter with IN, EXISTS, and correlated subqueries.", duration: "Week 4-5", icon: "🎯" },
          { number: 5, title: "Window Functions", description: "ROW_NUMBER, RANK, LAG, LEAD, running totals. The advanced stuff interviewers love.", duration: "Week 5-6", icon: "🪟" },
          { number: 6, title: "Practice & Interview Prep", description: "Solve real problems on SQLNoir, LeetCode, and HackerRank. Mock interviews.", duration: "Week 6+", icon: "🚀" },
        ]}
        caption="6-Week SQL Learning Roadmap for Data Analysts"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Data Pipeline Steps</h3>

      <ProcessSteps
        steps={[
          { number: 1, title: "Extract", description: "Pull raw data from APIs, databases, files", icon: "📦" },
          { number: 2, title: "Validate", description: "Check schema, types, nulls", icon: "✅" },
          { number: 3, title: "Transform", description: "Clean, join, aggregate", icon: "⚙️" },
          { number: 4, title: "Load", description: "Write to data warehouse", icon: "📥" },
          { number: 5, title: "Monitor", description: "Track freshness, quality", icon: "👁️" },
        ]}
        caption="Modern Data Pipeline Stages"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Numbered (no icons)</h3>

      <ProcessSteps
        steps={[
          { number: 1, title: "Read the question carefully", description: "Identify what tables you need and what the expected output looks like.", duration: "30 sec" },
          { number: 2, title: "Write the FROM clause first", description: "Start with your main table and add JOINs. Don't write SELECT first.", duration: "1 min" },
          { number: 3, title: "Add WHERE filters", description: "Narrow down to the rows you need before grouping or aggregating.", duration: "1 min" },
          { number: 4, title: "Test with a simple SELECT *", description: "Verify your JOINs and filters produce the right rows before adding complexity.", duration: "30 sec" },
          { number: 5, title: "Finish with SELECT and ORDER BY", description: "Choose your columns, add aggregations, and sort the final output.", duration: "1 min" },
        ]}
        caption="How to approach a SQL interview question (step by step)"
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}

      <h2 className="text-3xl font-detective text-amber-900 mt-16 mb-6">
        That&apos;s Everything! 🎉
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Five components, all styled in the SQLNoir aesthetic. Ready to drop into any blog post.
      </p>
    </div>
  );
}
