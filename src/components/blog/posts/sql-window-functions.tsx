"use client";

import Link from "next/link";
import { ComparisonTable, FlowDiagram } from "@/components/blog/diagrams";
import {
  SQLQueryBreakdown,
  BeforeAfter,
  QuickQuiz,
  DetectiveTip,
  MysteryTeaser,
} from "@/components/blog/content";

export default function SqlWindowFunctionsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Window functions are the secret weapon that separates SQL beginners from
        SQL power users. They let you calculate running totals, compare rows to
        previous values, and rank records without the complexity of subqueries
        or self-joins. This guide covers everything you need to master them.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#what-are-window-functions" className="hover:underline">
              What Are SQL Window Functions?
            </a>
          </li>
          <li>
            •{" "}
            <a href="#over-clause" className="hover:underline">
              The OVER() Clause: PARTITION BY and ORDER BY
            </a>
          </li>
          <li>
            •{" "}
            <a href="#ranking-functions" className="hover:underline">
              Ranking Functions: ROW_NUMBER, RANK, DENSE_RANK
            </a>
          </li>
          <li>
            •{" "}
            <a href="#aggregate-functions" className="hover:underline">
              Aggregate Window Functions: SUM, AVG, COUNT
            </a>
          </li>
          <li>
            •{" "}
            <a href="#lag-lead" className="hover:underline">
              Time-Series Functions: LAG and LEAD
            </a>
          </li>
          <li>
            •{" "}
            <a href="#ntile" className="hover:underline">
              NTILE and Distribution Functions
            </a>
          </li>
          <li>
            •{" "}
            <a href="#first-last-nth" className="hover:underline">
              FIRST_VALUE, LAST_VALUE, and NTH_VALUE
            </a>
          </li>
          <li>
            •{" "}
            <a href="#window-frames" className="hover:underline">
              Window Frames: ROWS BETWEEN and RANGE BETWEEN
            </a>
          </li>
          <li>
            •{" "}
            <a href="#choosing-functions" className="hover:underline">
              Choosing the Right Window Function
            </a>
          </li>
          <li>
            •{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common Mistakes and How to Avoid Them
            </a>
          </li>
          <li>
            •{" "}
            <a href="#interview-questions" className="hover:underline">
              Window Functions Interview Questions
            </a>
          </li>
          <li>
            •{" "}
            <a href="#faq" className="hover:underline">
              FAQ
            </a>
          </li>
        </ul>
      </div>

      {/* ─── Section 1: What Are Window Functions? ─── */}
      <h2
        id="what-are-window-functions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Are SQL Window Functions?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions perform calculations across a set of rows that are
        related to the current row. Unlike <code>GROUP BY</code>, which
        collapses rows into a single result, window functions keep all your rows
        intact while adding calculated columns.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Think of it as sliding a magnifying glass across your data. At each row,
        the function looks at a &quot;window&quot; of related rows and
        calculates a value. The <code>OVER()</code> clause defines what rows are
        in that window.
      </p>

      <FlowDiagram
        nodes={[
          { label: "Original Data", icon: "📋", type: "start" },
          { label: "Window Defined", icon: "🔍", type: "process" },
          { label: "Calculation Applied", icon: "⚙️", type: "process" },
          { label: "Result", icon: "✅", type: "end" },
        ]}
        caption="Window functions preserve all rows while adding calculated columns"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the key difference between <code>GROUP BY</code> and window
        functions:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          GROUP BY: Collapses rows
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT district, COUNT(*) as crime_count
FROM crime_scenes
GROUP BY district;

-- Result: One row per district
-- district    | crime_count
-- Downtown    | 15
-- Waterfront  | 8`}
        </pre>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Window Function: Keeps all rows
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    case_id,
    district,
    COUNT(*) OVER(PARTITION BY district) as district_crime_count
FROM crime_scenes;

-- Result: Every row kept, count added as column
-- case_id | district    | district_crime_count
-- 001     | Downtown    | 15
-- 002     | Downtown    | 15
-- 003     | Waterfront  | 8`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Every original row is preserved. The count is calculated for each
          row&apos;s partition.
        </p>
      </div>

      {/* ─── Section 2: The OVER() Clause ─── */}
      <h2
        id="over-clause"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The OVER() Clause: PARTITION BY and ORDER BY
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The <code>OVER()</code> clause is the heart of every window function. It
        defines which rows belong to the window and in what order
        they&apos;re processed.
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SUM(amount)",
            code: "SUM(amount)",
            annotation: "Aggregate function to apply",
          },
          {
            keyword: "OVER",
            code: "OVER (",
            annotation: "Window function starts",
          },
          {
            keyword: "PARTITION BY",
            code: "PARTITION BY district",
            annotation: "Groups data into partitions",
          },
          {
            keyword: "ORDER BY",
            code: "ORDER BY crime_date)",
            annotation: "Sets order within each partition",
          },
        ]}
        caption="Color-coded breakdown of window function syntax"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>PARTITION BY</strong> divides your data into groups. It works
        like <code>GROUP BY</code> but without collapsing rows. If you omit it,
        the entire result set is treated as one partition.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>ORDER BY</strong> determines the order of calculation within
        each partition. For running totals, this controls which rows are
        included as the function &quot;slides&quot; through the data.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Running total per district
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    crime_date,
    district,
    reported_crimes,
    SUM(reported_crimes) OVER(
        PARTITION BY district 
        ORDER BY crime_date
    ) as running_total
FROM daily_crime_stats;

-- Result:
-- crime_date  | district   | reported_crimes | running_total
-- 2026-01-01  | Downtown   | 5               | 5
-- 2026-01-02  | Downtown   | 3               | 8
-- 2026-01-03  | Downtown   | 7               | 15
-- 2026-01-01  | Waterfront | 2               | 2
-- 2026-01-02  | Waterfront | 4               | 6`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The running total resets for each district partition.
        </p>
      </div>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Want to practice PARTITION BY on real crime data?{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        use these patterns to analyze evidence across multiple tables.
      </p>

      {/* ─── Section 3: Ranking Functions ─── */}
      <h2
        id="ranking-functions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Ranking Functions: ROW_NUMBER, RANK, and DENSE_RANK
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The three ranking functions assign numbers to rows based on their
        position. The difference is how they handle ties. This is THE most
        common window function interview question.
      </p>

      <ComparisonTable
        headers={["Function", "Ties Behavior", "Gap After Ties", "Best For"]}
        rows={[
          ["ROW_NUMBER()", "Ignores ties", "N/A", "Pagination, unique IDs"],
          ["RANK()", "Same rank", "Yes (skips)", "Competition rankings"],
          ["DENSE_RANK()", "Same rank", "No gaps", "Top-N with ties"],
        ]}
        caption="ROW_NUMBER vs RANK vs DENSE_RANK"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          All three functions on the same data
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    suspect_name,
    prior_convictions,
    ROW_NUMBER() OVER(ORDER BY prior_convictions DESC) as row_num,
    RANK() OVER(ORDER BY prior_convictions DESC) as rank,
    DENSE_RANK() OVER(ORDER BY prior_convictions DESC) as dense_rank
FROM suspects;

-- Result (notice the ties at 5 convictions):
-- suspect_name | prior_convictions | row_num | rank | dense_rank
-- Mike         | 7                 | 1       | 1    | 1
-- Sara         | 5                 | 2       | 2    | 2
-- John         | 5                 | 3       | 2    | 2
-- Lisa         | 3                 | 4       | 4    | 3
-- Tom          | 1                 | 5       | 5    | 4`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Sara and John both have 5 convictions. ROW_NUMBER assigns them 2 and
          3. RANK gives both 2, then skips to 4. DENSE_RANK gives both 2, then
          continues to 3.
        </p>
      </div>

      <DetectiveTip variant="tip" title="Interview Tip">
        When asked &quot;What&apos;s the difference between RANK and
        DENSE_RANK?&quot;, always mention the gap behavior. RANK skips numbers
        after ties (1, 2, 2, 4). DENSE_RANK never has gaps (1, 2, 2, 3).
      </DetectiveTip>

      {/* ─── Section 4: Aggregate Window Functions ─── */}
      <h2
        id="aggregate-functions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Aggregate Window Functions: SUM, AVG, COUNT
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Standard aggregate functions gain new powers with <code>OVER()</code>.
        You can calculate running totals, moving averages, cumulative counts,
        and percentages of total.
      </p>

      <BeforeAfter
        before={{
          code: "detective | cases_solved\nMike      | 5\nSara      | 3\nJohn      | 7",
          label: "Original Data",
        }}
        after={{
          code: "detective | cases_solved | running_total\nMike      | 5            | 5\nSara      | 3            | 8\nJohn      | 7            | 15",
          label: "With Running Total",
        }}
        caption="SUM() OVER(ORDER BY) adds running totals"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Running total and percentage of total
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    detective,
    cases_solved,
    SUM(cases_solved) OVER(ORDER BY detective) as running_total,
    ROUND(
        100.0 * cases_solved / SUM(cases_solved) OVER(), 
        1
    ) as pct_of_total
FROM case_closures;

-- Result:
-- detective | cases_solved | running_total | pct_of_total
-- John      | 7            | 7             | 46.7
-- Mike      | 5            | 12            | 33.3
-- Sara      | 3            | 15            | 20.0`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          <code>SUM() OVER()</code> with no ORDER BY calculates the grand total
          for percentage calculations.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          3-day moving average of crimes
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    crime_date,
    daily_crimes,
    ROUND(
        AVG(daily_crimes) OVER(
            ORDER BY crime_date 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 
        1
    ) as moving_avg_3day
FROM daily_crime_stats;

-- Result:
-- crime_date  | daily_crimes | moving_avg_3day
-- 2026-01-01  | 5            | 5.0
-- 2026-01-02  | 8            | 6.5
-- 2026-01-03  | 3            | 5.3
-- 2026-01-04  | 6            | 5.7`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The frame <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> limits
          the average to the current row and two previous rows.
        </p>
      </div>

      {/* ─── Section 5: LAG and LEAD ─── */}
      <h2
        id="lag-lead"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Time-Series Functions: LAG and LEAD
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        <code>LAG</code> looks backward to access previous row values.{" "}
        <code>LEAD</code> looks forward to access next row values. These are
        essential for month-over-month comparisons, day-over-day changes, and
        time-series analysis.
      </p>

      <BeforeAfter
        before={{
          code: "month | crimes\nJan   | 45\nFeb   | 52\nMar   | 38",
          label: "Monthly Crime Data",
        }}
        after={{
          code: "month | crimes | prev_month | change\nJan   | 45     | NULL       | NULL\nFeb   | 52     | 45         | +7\nMar   | 38     | 52         | -14",
          label: "With LAG Comparison",
        }}
        caption="LAG() enables month-over-month comparisons"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Month-over-month crime comparison
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    month,
    crimes,
    LAG(crimes, 1) OVER(ORDER BY month) as prev_month,
    crimes - LAG(crimes, 1) OVER(ORDER BY month) as change,
    LEAD(crimes, 1) OVER(ORDER BY month) as next_month
FROM monthly_stats;

-- LAG(crimes, 1) means "1 row before"
-- LAG(crimes, 2) would mean "2 rows before"
-- LEAD(crimes, 1) means "1 row ahead"`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The optional second parameter is the offset (default 1). The optional
          third parameter is a default value for NULLs.
        </p>
      </div>

      <DetectiveTip variant="tip" title="Avoid NULLs">
        Use <code>LAG(column, 1, 0)</code> to return 0 instead of NULL when
        there&apos;s no previous row. This prevents NULL contamination in
        calculations.
      </DetectiveTip>

      {/* Tier 2 CTA - MysteryTeaser */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Think you understand LAG and time-series analysis? A body was found at Coral Bay Marina. Can you analyze surveillance timestamps to find gaps in the killer's alibi?"
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 6: NTILE ─── */}
      <h2
        id="ntile"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        NTILE and Distribution Functions
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        <code>NTILE</code> splits your data into a specified number of roughly
        equal buckets. <code>NTILE(4)</code> creates quartiles.{" "}
        <code>NTILE(10)</code> creates deciles. It handles uneven distributions
        automatically.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Split suspects into risk quartiles
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    suspect_name,
    prior_convictions,
    NTILE(4) OVER(ORDER BY prior_convictions DESC) as risk_quartile
FROM suspects;

-- Result:
-- suspect_name | prior_convictions | risk_quartile
-- Mike         | 12                | 1  -- Top 25% (highest risk)
-- Sara         | 9                 | 1
-- John         | 7                 | 2
-- Lisa         | 5                 | 2
-- Tom          | 3                 | 3
-- Jane         | 2                 | 3
-- Bob          | 1                 | 4
-- Alice        | 0                 | 4  -- Bottom 25% (lowest risk)`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Quartile 1 contains the top 25% of suspects by prior convictions.
        </p>
      </div>

      <DetectiveTip variant="tip" title="NTILE for Segmentation">
        NTILE is underrated for quick segmentation. Use{" "}
        <code>NTILE(5)</code> to instantly identify your top 20% of anything.
        Customers, suspects, crime hotspots.
      </DetectiveTip>

      {/* ─── Section 7: FIRST_VALUE, LAST_VALUE, NTH_VALUE ─── */}
      <h2
        id="first-last-nth"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FIRST_VALUE, LAST_VALUE, and NTH_VALUE
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These functions grab specific positional values from the window.{" "}
        <code>FIRST_VALUE</code> gets the first row&apos;s value.{" "}
        <code>LAST_VALUE</code> gets the last. <code>NTH_VALUE</code> gets any
        arbitrary position.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Get earliest and latest crime per district
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    case_id,
    district,
    crime_date,
    FIRST_VALUE(crime_date) OVER(
        PARTITION BY district 
        ORDER BY crime_date
    ) as earliest_in_district,
    LAST_VALUE(crime_date) OVER(
        PARTITION BY district 
        ORDER BY crime_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as latest_in_district
FROM crime_reports;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Notice the explicit frame for LAST_VALUE. Without it, you get
          unexpected results.
        </p>
      </div>

      <DetectiveTip variant="warning" title="LAST_VALUE Gotcha">
        By default, the window frame only includes rows up to the current row.
        Add{" "}
        <code>
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        </code>{" "}
        to include all rows and get the true last value.
      </DetectiveTip>

      {/* ─── Section 8: Window Frames ─── */}
      <h2
        id="window-frames"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Window Frames: ROWS BETWEEN and RANGE BETWEEN
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window frames let you specify exactly which rows are included in the
        calculation. This is how you build moving averages, trailing sums, and
        other sliding window calculations.
      </p>

      <FlowDiagram
        nodes={[
          { label: "UNBOUNDED PRECEDING", icon: "⏮️", type: "start" },
          { label: "N PRECEDING", icon: "⬅️", type: "process" },
          { label: "CURRENT ROW", icon: "📍", type: "process" },
          { label: "N FOLLOWING", icon: "➡️", type: "process" },
          { label: "UNBOUNDED FOLLOWING", icon: "⏭️", type: "end" },
        ]}
        caption="Frame boundary options: from first row to last row"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">7-day moving average</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
    crime_date,
    daily_crimes,
    ROUND(
        AVG(daily_crimes) OVER(
            ORDER BY crime_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ),
        1
    ) as moving_avg_7day
FROM daily_crime_stats;

-- ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
-- includes the current row + 6 previous rows = 7 days`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          <code>ROWS BETWEEN</code> counts physical rows.{" "}
          <code>RANGE BETWEEN</code> uses logical value ranges (useful for
          date gaps).
        </p>
      </div>

      <ComparisonTable
        headers={["Frame Type", "How It Works", "Use Case"]}
        rows={[
          [
            "ROWS BETWEEN",
            "Physical row count",
            "Moving averages (N rows back)",
          ],
          [
            "RANGE BETWEEN",
            "Logical value range",
            "Date ranges with gaps",
          ],
          [
            "UNBOUNDED PRECEDING",
            "From first row",
            "Running totals from start",
          ],
          [
            "UNBOUNDED FOLLOWING",
            "To last row",
            "Reverse running totals",
          ],
        ]}
        caption="Window frame options"
      />

      {/* ─── Section 9: Choosing the Right Function ─── */}
      <h2
        id="choosing-functions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Choosing the Right Window Function
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        With so many window functions available, how do you know which one to
        use? Here&apos;s a quick decision guide.
      </p>

      <FlowDiagram
        nodes={[
          { label: "What do you need?", icon: "🤔", type: "start" },
          { label: "Ranking → RANK/DENSE_RANK/ROW_NUMBER", icon: "🏆", type: "process" },
          { label: "Compare rows → LAG/LEAD", icon: "↔️", type: "process" },
          { label: "Running total → SUM OVER(ORDER BY)", icon: "➕", type: "process" },
          { label: "Buckets → NTILE(n)", icon: "📊", type: "end" },
        ]}
        caption="Decision flowchart for choosing window functions"
      />

      <ComparisonTable
        headers={["Need", "Function", "Example Use Case"]}
        rows={[
          ["Unique sequential numbers", "ROW_NUMBER()", "Pagination, deduplication"],
          ["Rank with ties", "RANK() / DENSE_RANK()", "Leaderboards, top-N"],
          ["Previous/next value", "LAG() / LEAD()", "Month-over-month, day-over-day"],
          ["Running total", "SUM() OVER(ORDER BY)", "Cumulative sales, balance"],
          ["Moving average", "AVG() with frame", "7-day average, smoothing"],
          ["Percentile buckets", "NTILE(n)", "Top 25%, quartiles"],
          ["First/last in group", "FIRST_VALUE / LAST_VALUE", "Earliest, latest records"],
        ]}
        caption="Quick reference: Window function selection"
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put window functions to work?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s intermediate and advanced cases require exactly these
          patterns. Rank suspects, analyze time sequences, find patterns across
          partitions.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ─── Section 10: Common Mistakes ─── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes and How to Avoid Them
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions have some tricky gotchas. Here are the mistakes that
        trip up most learners.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        1. Using window functions in WHERE (won&apos;t work)
      </h3>

      <BeforeAfter
        before={{
          code: "SELECT * FROM suspects\nWHERE ROW_NUMBER() OVER(ORDER BY risk) = 1",
          label: "Wrong: Window in WHERE",
          issues: [
            "Window functions can't be used in WHERE",
            "Will throw an error",
          ],
        }}
        after={{
          code: "WITH ranked AS (\n  SELECT *, \n    ROW_NUMBER() OVER(ORDER BY risk) AS rn\n  FROM suspects\n)\nSELECT * FROM ranked WHERE rn = 1",
          label: "Correct: Use CTE/Subquery",
          improvements: [
            "Wrap in CTE first",
            "Filter on the alias in outer query",
          ],
        }}
        caption="Window functions are evaluated after WHERE. Wrap in a CTE first."
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        2. Forgetting ORDER BY in ranking functions
      </h3>

      <BeforeAfter
        before={{
          code: "ROW_NUMBER() OVER()",
          label: "Undefined Order",
          issues: [
            "Without ORDER BY, row numbers are arbitrary",
            "Results change between runs",
          ],
        }}
        after={{
          code: "ROW_NUMBER() OVER(ORDER BY id)",
          label: "Deterministic Order",
          improvements: [
            "Always specify ORDER BY for ranking",
            "Results are consistent",
          ],
        }}
        caption="Always specify ORDER BY for deterministic ranking"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        3. LAST_VALUE without proper frame
      </h3>

      <BeforeAfter
        before={{
          code: "LAST_VALUE(name) OVER(\n  ORDER BY date\n)",
          label: "Wrong: Returns Current Row",
          issues: [
            "Default frame ends at current row",
            "LAST_VALUE returns the current row, not the actual last",
          ],
        }}
        after={{
          code: "LAST_VALUE(name) OVER(\n  ORDER BY date\n  ROWS BETWEEN UNBOUNDED PRECEDING \n    AND UNBOUNDED FOLLOWING\n)",
          label: "Correct: Full Frame",
          improvements: [
            "Explicit frame includes all rows",
            "Returns the true last value",
          ],
        }}
        caption="LAST_VALUE needs an explicit frame to work as expected"
      />

      <DetectiveTip variant="clue" title="Key Insight">
        Window functions are evaluated AFTER WHERE, GROUP BY, and HAVING, but
        BEFORE ORDER BY and LIMIT. That&apos;s why you can&apos;t filter on them
        directly.
      </DetectiveTip>

      {/* ─── Section 11: Interview Questions ─── */}
      <h2
        id="interview-questions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Window Functions Interview Questions
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These patterns come up constantly in SQL interviews. Master them and
        you&apos;ll handle most window function questions with confidence.
      </p>

      <ComparisonTable
        headers={["Pattern", "Function", "Key Technique"]}
        rows={[
          ["Top N per group", "ROW_NUMBER()", "PARTITION BY + filter rn <= N"],
          ["Running total", "SUM() OVER(ORDER BY)", "Cumulative with ORDER BY"],
          ["Month-over-month", "LAG()", "Compare current to previous"],
          ["Deduplication", "ROW_NUMBER()", "Keep row where rn = 1"],
          ["Percentile ranking", "NTILE(100) or PERCENT_RANK()", "Bucket into percentages"],
        ]}
        caption="Common interview patterns"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Classic: Top 3 suspects per district
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH ranked_suspects AS (
    SELECT 
        suspect_name,
        district,
        risk_score,
        ROW_NUMBER() OVER(
            PARTITION BY district 
            ORDER BY risk_score DESC
        ) as rank_in_district
    FROM suspects
)
SELECT *
FROM ranked_suspects
WHERE rank_in_district <= 3;

-- Returns top 3 highest-risk suspects for each district`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This &quot;top N per group&quot; pattern appears in almost every SQL
          interview.
        </p>
      </div>

      <QuickQuiz
        questions={[
          {
            question:
              "Which function gives unique numbers even for tied values?",
            options: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE()"],
            correctIndex: 2,
            explanation:
              "ROW_NUMBER() always assigns unique sequential numbers. RANK and DENSE_RANK give the same number to ties.",
          },
          {
            question: "What does LAG(sales, 2) return?",
            options: [
              "The next 2 rows",
              "The value from 2 rows before",
              "The average of the last 2 rows",
              "An error",
            ],
            correctIndex: 1,
            explanation:
              "LAG(column, N) returns the value from N rows before the current row. LAG(sales, 2) looks 2 rows back.",
          },
          {
            question:
              "You want to filter on ROW_NUMBER() = 1. What do you need to do?",
            options: [
              "Use WHERE ROW_NUMBER() OVER() = 1",
              "Wrap in a CTE, then filter in the outer query",
              "Use HAVING ROW_NUMBER() = 1",
              "It's not possible",
            ],
            correctIndex: 1,
            explanation:
              "Window functions can't be used directly in WHERE. You must wrap the query in a CTE or subquery first, then filter on the alias.",
          },
          {
            question: "NTILE(4) creates what?",
            options: [
              "4 equal-sized buckets (quartiles)",
              "Top 4 rows only",
              "Groups of 4 rows each",
              "4 random samples",
            ],
            correctIndex: 0,
            explanation:
              "NTILE(4) divides rows into 4 roughly equal buckets. Each row is assigned a bucket number from 1 to 4.",
          },
        ]}
      />

      {/* ─── Section 12: FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FAQ
      </h2>

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">
            What are window functions in SQL?
          </h3>
          <p className="text-gray-700">
            Functions that perform calculations across a set of rows related to
            the current row, without collapsing rows like GROUP BY. They use{" "}
            <code>OVER()</code> to define the window of rows to operate on.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">
            What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?
          </h3>
          <p className="text-gray-700">
            <code>ROW_NUMBER</code> gives unique numbers (1,2,3,4) even for
            ties. <code>RANK</code> gives same rank for ties but skips numbers
            after (1,2,2,4). <code>DENSE_RANK</code> gives same rank for ties
            without gaps (1,2,2,3).
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">
            Can you use window functions in a WHERE clause?
          </h3>
          <p className="text-gray-700">
            No. Window functions are evaluated after WHERE. Wrap your query in a
            CTE or subquery first, then filter on the window function alias in
            the outer query.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">
            What is PARTITION BY in window functions?
          </h3>
          <p className="text-gray-700">
            <code>PARTITION BY</code> divides the result set into groups
            (partitions) for the window function to operate on. It&apos;s like
            GROUP BY but doesn&apos;t collapse rows.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">
            When should I use window functions instead of GROUP BY?
          </h3>
          <p className="text-gray-700">
            Use window functions when you need to keep all rows while adding
            calculated columns (running totals, rankings, comparisons). Use
            GROUP BY when you want to collapse rows into summary statistics.
          </p>
        </div>
      </div>

      {/* ─── Conclusion ─── */}
      <h2
        id="conclusion"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Conclusion
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions transform what&apos;s possible with SQL. Running
        totals, rankings, time-series comparisons, and percentile analysis all
        become straightforward once you understand <code>OVER()</code>,{" "}
        <code>PARTITION BY</code>, and <code>ORDER BY</code>.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        The key patterns to remember: use <code>ROW_NUMBER</code> for unique
        numbering and deduplication, <code>RANK/DENSE_RANK</code> for
        leaderboards, <code>LAG/LEAD</code> for comparing rows, and{" "}
        <code>SUM/AVG</code> with frames for running and moving calculations.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Practice these patterns and they&apos;ll become second nature. Window
        functions are one of those SQL skills that, once learned, you&apos;ll
        use constantly.
      </p>
    </div>
  );
}
