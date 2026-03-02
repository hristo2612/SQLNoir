"use client";

import Link from "next/link";
import {
  ComparisonTable,
  FlowDiagram,
} from "@/components/blog/diagrams";
import {
  SQLQueryBreakdown,
  BeforeAfter,
  QuickQuiz,
  DetectiveTip,
  MysteryTeaser,
} from "@/components/blog/content";

export default function ViewVsMaterializedViewContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Views and materialized views both let you save a query and reuse it like
        a table. The difference: one runs fresh every time, the other caches
        results on disk. Pick wrong and you get stale dashboards or sluggish
        reports.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            &bull;{" "}
            <a href="#quick-answer" className="hover:underline">
              Quick Answer
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#what-is-view" className="hover:underline">
              What Is a View in SQL?
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#what-is-materialized-view" className="hover:underline">
              What Is a Materialized View?
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#key-differences" className="hover:underline">
              Key Differences
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#refresh-strategies" className="hover:underline">
              Refresh Strategies
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#decision-guide" className="hover:underline">
              When to Use Each
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common Mistakes
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#quiz" className="hover:underline">
              Test Your Knowledge
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#faq" className="hover:underline">
              FAQ
            </a>
          </li>
        </ul>
      </div>

      {/* ── Quick Answer ── */}
      <h2
        id="quick-answer"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Answer: View vs Materialized View
      </h2>

      <ComparisonTable
        headers={["Feature", "View", "Materialized View"]}
        rows={[
          ["Storage", "No physical storage (virtual)", "Stored on disk (physical)"],
          ["Query Speed", "Re-executes every time", "Reads from cache (fast)"],
          ["Data Freshness", "Always current", "Stale until refreshed"],
          ["Disk Space", "Zero", "Uses storage"],
          ["Updatable?", "Sometimes (simple views)", "No (read-only snapshot)"],
        ]}
        caption="The core tradeoff: freshness vs speed"
      />

      {/* ── What Is a View ── */}
      <h2
        id="what-is-view"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Is a View in SQL?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A view is a saved SQL query that you can reference like a table. It
        stores no data. Every time you <code>SELECT</code> from it, the database
        re-runs the underlying query and returns fresh results.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Creating a view:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW active_suspects AS
SELECT
    s.suspect_id,
    s.name,
    s.last_known_location,
    c.case_title
FROM suspects s
JOIN cases c ON s.case_id = c.case_id
WHERE c.status = 'open';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Now you can query <code>SELECT * FROM active_suspects</code> and it
          re-runs this JOIN every time.
        </p>
      </div>

      <FlowDiagram
        nodes={[
          { label: "SELECT * FROM active_suspects", icon: "🔍", type: "start" },
          { label: "Read view definition", icon: "📋", type: "process" },
          { label: "Execute underlying query", icon: "⚙️", type: "process" },
          { label: "Return fresh results", icon: "✅", type: "end" },
        ]}
        caption="Every query against a view triggers a full execution of the stored SQL"
      />

      <DetectiveTip variant="tip" title="Think of It This Way">
        A view is like a saved search filter in your case management system.
        Every time you open it, the system runs the search fresh. No cached
        documents, no stale leads.
      </DetectiveTip>

      {/* ── What Is a Materialized View ── */}
      <h2
        id="what-is-materialized-view"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Is a Materialized View?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A materialized view runs the query once and stores the results on disk
        like a real table. Subsequent reads hit the cache instead of
        re-executing the query. The tradeoff: you must refresh it to see updated
        data.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Creating a materialized view (PostgreSQL):
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE MATERIALIZED VIEW case_summary AS
SELECT
    district,
    COUNT(*) AS total_cases,
    COUNT(*) FILTER (WHERE status = 'open') AS open_cases,
    COUNT(*) FILTER (WHERE status = 'closed') AS closed_cases
FROM cases
GROUP BY district;

-- Refresh when you need updated data
REFRESH MATERIALIZED VIEW case_summary;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Queries against <code>case_summary</code> read from the stored
          snapshot. No aggregation re-runs until you refresh.
        </p>
      </div>

      <FlowDiagram
        nodes={[
          { label: "SELECT * FROM case_summary", icon: "🔍", type: "start" },
          { label: "Read stored snapshot", icon: "💾", type: "process" },
          { label: "Return cached results instantly", icon: "⚡", type: "end" },
        ]}
        caption="Materialized views skip query execution entirely, reading pre-computed results from disk"
      />

      <DetectiveTip variant="tip" title="Think of It This Way">
        A materialized view is like printing your investigation report. Fast to
        read, but you need to reprint it whenever new evidence comes in.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice the{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          JOINs, aggregations, and subqueries
        </Link>{" "}
        that power views and materialized views, SQLNoir&apos;s detective cases
        let you write real queries to solve crimes.
      </p>

      {/* ── Key Differences ── */}
      <h2
        id="key-differences"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        View vs Materialized View: Key Differences
      </h2>

      <ComparisonTable
        headers={["Feature", "View", "Materialized View"]}
        rows={[
          ["Storage", "Virtual (no disk)", "Physical (on disk)"],
          ["Query Performance", "Slower (re-executes)", "Faster (cached)"],
          ["Data Freshness", "Always current", "Stale until refreshed"],
          ["Can Create Indexes?", "No", "Yes"],
          ["INSERT/UPDATE/DELETE?", "Sometimes (simple views)", "No"],
          ["Refresh Needed?", "No", "Yes (manual or scheduled)"],
          ["Disk Space", "Zero", "Proportional to result set"],
          ["Best For", "Security, simplification", "Dashboards, reporting"],
          ["Write Overhead", "None", "Refresh cost"],
          [
            "Database Support",
            "All databases",
            "PostgreSQL, Oracle, Snowflake, SQL Server (indexed views)",
          ],
        ]}
        caption="Full comparison: 10 key differences"
      />

      <DetectiveTip variant="warning" title="Database Naming">
        SQL Server calls them &ldquo;indexed views,&rdquo; not
        &ldquo;materialized views.&rdquo; MySQL does NOT support materialized
        views natively. The workaround: create a regular table and populate it
        with <code>INSERT...SELECT</code>, then refresh via cron or triggers.
      </DetectiveTip>

      {/* ── Refresh Strategies ── */}
      <h2
        id="refresh-strategies"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Refresh Strategies for Materialized Views
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The biggest operational question with materialized views: how and when
        do you refresh them? Here are your options.
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "REFRESH",
            code: "",
            annotation: "Command to update the materialized view",
          },
          {
            keyword: "MATERIALIZED VIEW",
            code: "case_summary",
            annotation: "The materialized view to refresh",
          },
          {
            keyword: "CONCURRENTLY",
            code: "",
            annotation: "Optional: refresh without locking reads (requires a unique index)",
          },
        ]}
        caption="REFRESH MATERIALIZED VIEW CONCURRENTLY lets users query the old snapshot while the refresh runs"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Manual refresh:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Full refresh (locks the view during refresh)
REFRESH MATERIALIZED VIEW case_summary;

-- Concurrent refresh (no lock, requires unique index)
CREATE UNIQUE INDEX idx_case_summary_district
    ON case_summary (district);

REFRESH MATERIALIZED VIEW CONCURRENTLY case_summary;`}
        </pre>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Scheduled refresh (PostgreSQL + cron):
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Refresh every hour using pg_cron
SELECT cron.schedule(
    'refresh_case_summary',
    '0 * * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY case_summary'
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Oracle also supports <code>ON COMMIT</code> refresh, which
          automatically updates the materialized view whenever the base tables
          change. PostgreSQL and SQL Server do not have this built in.
        </p>
      </div>

      {/* ── Decision Guide ── */}
      <h2
        id="decision-guide"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        When to Use Each: Decision Guide
      </h2>

      <FlowDiagram
        nodes={[
          { label: "Do you need real-time data?", icon: "❓", type: "start" },
          { label: "YES → Use a View", icon: "👁️", type: "end" },
          { label: "Is the query expensive?", icon: "❓", type: "start" },
          { label: "YES → Use a Materialized View", icon: "💾", type: "end" },
          { label: "NO → Use a View", icon: "👁️", type: "end" },
        ]}
        caption="If data must be real-time OR the query is cheap, use a regular view. Materialize only expensive, non-real-time queries."
      />

      <p className="text-gray-700 leading-relaxed mb-4">
        <strong>Use a view when:</strong>
      </p>
      <ul className="text-gray-700 mb-6 space-y-2">
        <li>&bull; Data must always be current (audit logs, live dashboards)</li>
        <li>&bull; You need to restrict column access for security</li>
        <li>&bull; The underlying query is simple and fast</li>
        <li>&bull; Base table data changes frequently</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-4">
        <strong>Use a materialized view when:</strong>
      </p>
      <ul className="text-gray-700 mb-6 space-y-2">
        <li>
          &bull; The query involves complex aggregations or multi-table JOINs
        </li>
        <li>&bull; The same expensive report runs many times per day</li>
        <li>&bull; Slight staleness is acceptable (hourly, daily reports)</li>
        <li>&bull; You want to add indexes on the results for faster lookups</li>
      </ul>

      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="The same SQL patterns you'd use in views (JOINs, subqueries, aggregations) are exactly what you need to analyze surveillance records and hotel checkins to catch a killer."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ── Common Mistakes ── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        1. Stacking views on top of views
      </h3>

      <BeforeAfter
        before={{
          code: "CREATE VIEW v1 AS SELECT ... FROM big_table;\nCREATE VIEW v2 AS SELECT ... FROM v1 JOIN other;\nCREATE VIEW v3 AS SELECT ... FROM v2 JOIN more;\n\n-- Querying v3 triggers ALL three queries",
          label: "Nested Views",
          issues: [
            "Each layer re-executes the one below it",
            "Performance degrades exponentially",
            "Nearly impossible to debug slow queries",
          ],
        }}
        after={{
          code: "CREATE MATERIALIZED VIEW summary AS\nSELECT ...\nFROM big_table\nJOIN other ON ...\nJOIN more ON ...;\n\nCREATE INDEX idx_summary_id ON summary (id);",
          label: "Single Materialized View",
          improvements: [
            "One query, pre-computed and cached",
            "Indexed for fast lookups",
            "Clear refresh schedule",
          ],
        }}
        caption="If you're stacking 3+ views deep, it's time to materialize"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">
        2. Forgetting to refresh materialized views
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        A materialized view created once and never refreshed serves weeks-old
        data. Always set up a refresh schedule (cron, <code>pg_cron</code>, or
        application-level triggers) when you create one.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">
        3. Materializing when data changes every minute
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        If your base data changes constantly and users expect real-time results,
        a materialized view just adds complexity. You&apos;d be refreshing so
        often that you lose the performance benefit. Use a regular view instead,
        or optimize the underlying query with proper indexes.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">
        4. Skipping indexes on materialized views
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        A materialized view without indexes is just a table you forgot to
        optimize. The whole point of materializing is fast reads. Create indexes
        on the columns you filter and join on.
      </p>

      {/* ── Quiz ── */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Test Your Knowledge
      </h2>

      <QuickQuiz
        title="🔍 View vs Materialized View Quiz"
        questions={[
          {
            question:
              "Your dashboard shows monthly crime statistics, refreshed every hour. Which should you use?",
            options: ["View", "Materialized View"],
            correctIndex: 1,
            explanation:
              "The dashboard doesn't need real-time data (hourly is fine) and aggregating monthly stats is expensive. Cache it in a materialized view.",
          },
          {
            question:
              "You need to hide sensitive suspect columns (SSN, home address) from junior analysts. Which should you use?",
            options: ["View", "Materialized View"],
            correctIndex: 0,
            explanation:
              "This is access control. A view that excludes sensitive columns is the right tool, and data must always be current.",
          },
          {
            question:
              "A complex 5-table JOIN query runs 100+ times per day for the same report. Which should you use?",
            options: ["View", "Materialized View"],
            correctIndex: 1,
            explanation:
              "Expensive query, repeated frequently, same results. Materialize it and refresh on a schedule.",
          },
          {
            question:
              "An audit log must always show the latest entries immediately after insertion. Which should you use?",
            options: ["View", "Materialized View"],
            correctIndex: 0,
            explanation:
              "Real-time data requirement. A view always re-executes and returns current results.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to practice JOINs, subqueries, and aggregations?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          The same SQL patterns behind views and materialized views power every
          detective case in SQLNoir. Write real queries to solve crimes.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ── FAQ ── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can you update data through a materialized view?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            No. Materialized views are read-only snapshots. To change the
            underlying data, modify the base tables directly and then refresh
            the materialized view.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Does MySQL support materialized views?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Not natively. The common workaround is creating a regular table,
            populating it with <code>INSERT...SELECT</code>, and refreshing it
            on a schedule using cron or triggers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            How often should I refresh a materialized view?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            It depends on your staleness tolerance. Real-time dashboards: every
            few minutes. Daily reports: once overnight. Monthly summaries:
            weekly. Match the refresh frequency to how often users need updated
            data.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can I create indexes on a regular view?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            No. Views are virtual and store no data, so there&apos;s nothing to
            index. You can index the underlying tables, or switch to a
            materialized view if you need indexed results.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What is an indexed view in SQL Server?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            SQL Server&apos;s equivalent of a materialized view. You create a
            regular view, then add a unique clustered index on it. This
            physically stores the results on disk, just like a materialized view
            in PostgreSQL or Oracle.
          </p>
        </div>
      </div>

      {/* Related Guides */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-amber-900 mb-3">
          📚 Related Guides
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/blog/sql-join-types-explained"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL Join Types Explained
            </Link>{" "}
            <span className="text-gray-600">
              - Views often simplify complex JOINs
            </span>
          </li>
          <li>
            <Link
              href="/blog/sql-window-functions"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL Window Functions
            </Link>{" "}
            <span className="text-gray-600">
              - Common in materialized view definitions
            </span>
          </li>
          <li>
            <Link
              href="/blog/dml-vs-ddl"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              DDL vs DML
            </Link>{" "}
            <span className="text-gray-600">
              - CREATE VIEW is DDL, SELECT from view is DML
            </span>
          </li>
          <li>
            <Link
              href="/blog/sql-for-data-analysts"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL for Data Analysts
            </Link>{" "}
            <span className="text-gray-600">
              - Data analysts commonly use views for reporting
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
