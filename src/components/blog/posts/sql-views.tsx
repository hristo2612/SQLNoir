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

export default function SqlViewsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        A SQL view is a saved query that acts like a virtual table. You query it
        like any regular table, but it stores no data of its own. Every time you
        SELECT from a view, the database runs the underlying query fresh.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            &bull;{" "}
            <a href="#what-is-sql-view" className="hover:underline">
              What Is a SQL View?
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#creating-views" className="hover:underline">
              Creating Views: Syntax and Examples
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#views-vs-tables" className="hover:underline">
              Views vs Tables
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#when-to-use-views" className="hover:underline">
              5 Practical Use Cases
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#updatable-views" className="hover:underline">
              Updatable Views
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#modifying-dropping-views" className="hover:underline">
              Modifying and Dropping Views
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
            <a href="#views-across-databases" className="hover:underline">
              Views Across Databases
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

      {/* ── What Is a SQL View? ───────────────────────────────── */}
      <h2
        id="what-is-sql-view"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Is a SQL View?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A view is a named SELECT query stored in the database. When you query
        it, the database swaps in the saved query, runs it, and hands you the
        results. No data is duplicated. No extra storage is consumed. The view is
        just a definition.
      </p>

      <FlowDiagram
        nodes={[
          { label: "You run: SELECT * FROM prime_suspects", icon: "🔍", type: "start" as const },
          { label: "Database finds the view definition", icon: "📂", type: "process" as const },
          { label: "Database executes the stored SELECT", icon: "⚙️", type: "process" as const },
          { label: "Fresh results returned", icon: "✅", type: "end" as const },
        ]}
        caption="How a view executes: every query re-runs the underlying SELECT"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Here is a simple example. Suppose you have a{" "}
        <code>suspects</code> table and you frequently need to see only those
        with no alibi:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Create a view:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW prime_suspects AS
SELECT name, last_seen, motive
FROM suspects
WHERE alibi IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Now <code>prime_suspects</code> behaves like a table. Query it with a
          plain SELECT.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Query the view:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT * FROM prime_suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Behind the scenes, the database runs the full SELECT from the view
          definition and returns the filtered rows.
        </p>
      </div>

      <DetectiveTip variant="tip" title="Think of Views as Saved Investigations">
        A view is like saving your investigation criteria. Instead of re-writing
        the same complex query every time, you save it once and reference it by
        name. Change the criteria in the view definition, and every query that
        uses it picks up the new logic automatically.
      </DetectiveTip>

      {/* ── Creating Views ───────────────────────────────────── */}
      <h2
        id="creating-views"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Creating Views: Syntax and Examples
      </h2>

      <SQLQueryBreakdown
        clauses={[
          { keyword: "CREATE VIEW", code: "prime_suspects", annotation: "Names your virtual table" },
          { keyword: "AS", code: "", annotation: "Connects the name to the query" },
          { keyword: "SELECT", code: "name, last_seen, alibi", annotation: "Columns the view exposes" },
          { keyword: "FROM", code: "suspects", annotation: "Source table" },
          { keyword: "WHERE", code: "alibi IS NULL", annotation: "Filter applied every time the view runs" },
        ]}
        caption="Anatomy of a CREATE VIEW statement"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Views get more useful as queries get more complex. Below are three
        progressively richer examples.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          1. Column filter (show only safe columns):
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW public_suspects AS
SELECT suspect_id, name, last_seen
FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Hides sensitive columns like <code>confidential_notes</code> and{" "}
          <code>informant_name</code>.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          2. Row filter with WHERE:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW open_cases AS
SELECT case_id, title, status, detective_id
FROM cases
WHERE status = 'open';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Only returns rows matching the condition. Closed cases are excluded
          every time.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          3. Multi-table JOIN view:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW case_evidence_summary AS
SELECT
  c.case_id,
  c.title AS case_title,
  COUNT(e.evidence_id) AS evidence_count,
  MAX(e.collected_date) AS latest_evidence
FROM cases c
LEFT JOIN evidence e ON c.case_id = e.case_id
GROUP BY c.case_id, c.title;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Joins two tables and aggregates evidence per case. Now anyone can run{" "}
          <code>SELECT * FROM case_evidence_summary</code> without knowing the
          JOIN logic.
        </p>
      </div>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Views use the same SELECT, WHERE, and JOIN skills you practice in{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>
        . If you want to sharpen those fundamentals, try solving a mystery.
      </p>

      {/* ── Views vs Tables ──────────────────────────────────── */}
      <h2
        id="views-vs-tables"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Views vs Tables: What&apos;s the Difference?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        From the outside, views and tables look identical. You query both with
        SELECT. The difference is what happens behind the scenes.
      </p>

      <ComparisonTable
        headers={["Feature", "Table", "View"]}
        rows={[
          ["Stores data", "Yes, on disk", "No, just a saved query"],
          ["Takes up storage", "Yes", "No (except materialized)"],
          ["Shows current data", "Shows last INSERT/UPDATE", "Always current (re-runs query)"],
          ["Supports INSERT/UPDATE", "Yes", "Sometimes (with restrictions)"],
          ["Can have indexes", "Yes", "No (except indexed views)"],
          ["Can have constraints", "Yes (PK, FK, CHECK)", "No"],
          ["Queried with SELECT", "Yes", "Yes, identical syntax"],
        ]}
        caption="Views vs Tables: the key differences"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Querying a table vs. querying a view:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Querying a table
SELECT name, last_seen FROM suspects WHERE alibi IS NULL;

-- Querying a view (same syntax, same result)
SELECT name, last_seen FROM prime_suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The caller does not know (or care) whether{" "}
          <code>prime_suspects</code> is a table or a view. That is the power of
          abstraction.
        </p>
      </div>

      {/* ── 5 Practical Use Cases ────────────────────────────── */}
      <h2
        id="when-to-use-views"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        5 Practical Use Cases for Views
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        1. Simplifying complex queries
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        Wrap a five-table JOIN in a view and reuse it by name. Analysts run{" "}
        <code>SELECT * FROM monthly_report</code> instead of pasting 30 lines of
        SQL.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        2. Security and access control
      </h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Grant users access to a view that hides sensitive columns. They see what
        they need, nothing more.
      </p>

      <BeforeAfter
        before={{
          code: "SELECT * FROM suspects;\n-- Exposes: confidential_notes, informant_name, phone_taps",
          label: "Direct Table Access (risky)",
          issues: [
            "All columns visible including sensitive data",
            "No way to restrict without database permissions on each column",
          ],
        }}
        after={{
          code: "SELECT * FROM public_suspects;\n-- Only shows: suspect_id, name, last_seen, alibi",
          label: "View Access (secure)",
          improvements: [
            "Sensitive columns hidden by design",
            "Users query the view, never touch the base table",
          ],
        }}
        caption="Views as a security layer"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        3. Data abstraction
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        Restructure your underlying tables without breaking every query that
        depends on them. Update the view definition and downstream queries keep
        working.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        4. Consistent reporting
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        Bake calculations into a view so every report uses the same formula.{" "}
        <code>revenue</code> always equals{" "}
        <code>price * quantity * (1 - discount)</code>, not whatever each analyst
        remembers.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        5. Backward compatibility
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        Rename or split a table? Create a view with the old name that maps to the
        new structure. Legacy code never notices.
      </p>

      {/* ── Updatable Views ──────────────────────────────────── */}
      <h2
        id="updatable-views"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Updatable Views: When You Can INSERT, UPDATE, and DELETE
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Some views are read-only. Others let you modify data through them, and
        the changes land in the base table. The rules depend on how the view is
        defined.
      </p>

      <FlowDiagram
        nodes={[
          { label: "Single base table?", icon: "📋", type: "start" as const },
          { label: "No GROUP BY, DISTINCT, or aggregates?", icon: "🔍", type: "process" as const },
          { label: "Includes all NOT NULL columns?", icon: "✔️", type: "process" as const },
          { label: "View is updatable", icon: "✅", type: "end" as const },
        ]}
        caption="If you answered NO to any step, the view is read-only"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          INSERT through a view:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW active_suspects AS
SELECT suspect_id, name, status
FROM suspects
WHERE status = 'active';

-- This works: the view is a simple single-table filter
INSERT INTO active_suspects (suspect_id, name, status)
VALUES (42, 'Eddie Vance', 'active');`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The row is inserted into the <code>suspects</code> base table.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          WITH CHECK OPTION in action:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE VIEW active_suspects AS
SELECT suspect_id, name, status
FROM suspects
WHERE status = 'active'
WITH CHECK OPTION;

-- This FAILS: status = 'cleared' doesn't match the WHERE
INSERT INTO active_suspects (suspect_id, name, status)
VALUES (43, 'Maria Chen', 'cleared');
-- ERROR: CHECK OPTION failed`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Without CHECK OPTION, that row would slip into the base table but
          vanish from the view. CHECK OPTION prevents the &ldquo;vanishing
          row&rdquo; problem.
        </p>
      </div>

      <DetectiveTip variant="warning" title="WITH CHECK OPTION Prevents Vanishing Rows">
        Without CHECK OPTION, you can INSERT a row through a view that the view
        itself cannot see. The row goes into the base table but disappears from
        the view. CHECK OPTION prevents this vanishing act.
      </DetectiveTip>

      {/* Tier 2 CTA - MysteryTeaser */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Can you JOIN multiple tables, filter with WHERE, and find the killer? The same SQL skills that power views are all you need."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ── Modifying and Dropping Views ─────────────────────── */}
      <h2
        id="modifying-dropping-views"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Modifying and Dropping Views
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Views are easy to change. Use <code>CREATE OR REPLACE VIEW</code> to
        update a definition without dropping and recreating.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Update a view definition:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE OR REPLACE VIEW prime_suspects AS
SELECT name, last_seen, motive, phone_number
FROM suspects
WHERE alibi IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Added <code>phone_number</code> to the existing view. Dependent
          queries keep working.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Drop a view safely:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`DROP VIEW IF EXISTS prime_suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          <code>IF EXISTS</code> prevents an error when the view has already been
          removed.
        </p>
      </div>

      {/* ── Common Mistakes ──────────────────────────────────── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes with SQL Views
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        1. Using SELECT * in view definitions
      </h3>

      <BeforeAfter
        before={{
          code: "CREATE VIEW case_overview AS\nSELECT * FROM cases;",
          label: "Fragile View (SELECT *)",
          issues: [
            "If someone adds a column to cases, the view might break or expose unexpected data",
            "Column order can shift, breaking dependent code",
          ],
        }}
        after={{
          code: "CREATE VIEW case_overview AS\nSELECT case_id, title, status, detective_id\nFROM cases;",
          label: "Stable View (Explicit Columns)",
          improvements: [
            "Table changes don't affect the view",
            "Clear contract: you know exactly what columns are exposed",
          ],
        }}
        caption="Always list columns explicitly in view definitions"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        2. Nesting views on top of views
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Building views that reference other views creates layers the optimizer
        struggles with. Each layer re-expands, and performance degrades quickly.
        If you find yourself stacking three or more views, flatten the logic into
        a single query or use a{" "}
        <Link
          href="/blog/view-vs-materialized-view"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          materialized view
        </Link>{" "}
        instead.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        3. Assuming views improve performance
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Views do not cache results. The database re-executes the underlying query
        every time. If you need cached, precomputed results, look at materialized
        views (PostgreSQL, Oracle) or indexed views (SQL Server).
      </p>

      <DetectiveTip variant="clue" title="Views Save Keystrokes, Not Time">
        A view is a convenience layer. It makes your SQL shorter and more
        readable, but the database does the exact same work whether you query the
        view or paste the raw SELECT. Performance gains come from indexes, not
        views.
      </DetectiveTip>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        4. Trying to UPDATE through complex views
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Views with JOINs, GROUP BY, DISTINCT, or aggregate functions are
        read-only. Attempting an UPDATE or INSERT will throw an error. If you
        need to modify data through a view, keep it simple: one base table, no
        aggregates.
      </p>

      {/* ── Views Across Databases ───────────────────────────── */}
      <h2
        id="views-across-databases"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Views Across Databases: MySQL, PostgreSQL, SQL Server, Oracle
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The core concept is the same everywhere, but syntax and advanced features
        differ.
      </p>

      <ComparisonTable
        headers={["Feature", "MySQL", "PostgreSQL", "SQL Server", "Oracle"]}
        rows={[
          ["CREATE OR REPLACE VIEW", "Yes", "Yes", "No (use ALTER VIEW)", "Yes"],
          ["Materialized Views", "No (workarounds)", "Yes (REFRESH)", "Indexed Views", "Yes (REFRESH)"],
          ["WITH CHECK OPTION", "Yes", "Yes", "Yes", "Yes"],
          ["Updatable Views", "Limited", "Limited", "INSTEAD OF triggers", "INSTEAD OF triggers"],
          ["View Dependencies", "SHOW CREATE VIEW", "pg_views catalog", "sys.sql_modules", "ALL_VIEWS dictionary"],
        ]}
        caption="SQL Views feature matrix across major databases"
      />

      <DetectiveTip variant="clue" title="SQL Server Uses Different Syntax">
        SQL Server does not support CREATE OR REPLACE VIEW. Use ALTER VIEW
        instead. And what PostgreSQL calls &ldquo;materialized views,&rdquo; SQL
        Server calls &ldquo;indexed views&rdquo; with different syntax and
        restrictions.
      </DetectiveTip>

      {/* ── Quiz ─────────────────────────────────────────────── */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Test Your Knowledge
      </h2>

      <QuickQuiz
        title="🔍 SQL Views Quiz"
        questions={[
          {
            question: "Does a SQL view store data on disk?",
            options: [
              "Yes, like a regular table",
              "No, it re-runs the query each time",
              "Only if you use WITH CHECK OPTION",
              "Only in PostgreSQL",
            ],
            correctIndex: 1,
            explanation:
              "A view is a saved query definition. It stores no data. Every time you SELECT from a view, the database executes the underlying query fresh.",
          },
          {
            question: "Which of these makes a view NOT updatable?",
            options: [
              "A WHERE clause",
              "A JOIN between two tables",
              "Column aliases",
              "A simple filter on one table",
            ],
            correctIndex: 1,
            explanation:
              "Views with JOINs, GROUP BY, DISTINCT, or aggregate functions are generally read-only. Simple single-table views with WHERE clauses are usually updatable.",
          },
          {
            question: "What does WITH CHECK OPTION do?",
            options: [
              "Checks the view for errors",
              "Prevents INSERTs that would be invisible to the view",
              "Validates the view's SQL syntax",
              "Locks the view against changes",
            ],
            correctIndex: 1,
            explanation:
              "WITH CHECK OPTION prevents you from inserting or updating rows through a view that wouldn't satisfy the view's WHERE clause. Without it, those rows would 'vanish' from the view.",
          },
          {
            question:
              "How do you modify a view definition in SQL Server?",
            options: [
              "CREATE OR REPLACE VIEW",
              "ALTER VIEW",
              "MODIFY VIEW",
              "DROP and recreate",
            ],
            correctIndex: 1,
            explanation:
              "SQL Server doesn't support CREATE OR REPLACE VIEW. Use ALTER VIEW to modify an existing view's definition without dropping it.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to practice the SQL behind views?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You now understand SQL views, from simple definitions to cross-database
          gotchas. The next step? Practice writing the SELECT, JOIN, and WHERE
          queries that views are built on. SQLNoir&apos;s 6 detective cases give
          you a real database to query, a mystery to solve, and zero boring
          textbook exercises.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FAQ
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            What is a view in SQL with example?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            A view is a saved SELECT query you can treat like a table. Example:{" "}
            <code>
              CREATE VIEW active_cases AS SELECT * FROM cases WHERE status =
              &apos;open&apos;;
            </code>{" "}
            Then query it:{" "}
            <code>SELECT * FROM active_cases;</code> The view runs the query
            fresh each time.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Do SQL views improve performance?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            No. Standard views do not cache data or speed up queries. The
            database runs the underlying SELECT every time. For performance
            gains, look at{" "}
            <Link
              href="/blog/view-vs-materialized-view"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              materialized views
            </Link>{" "}
            (PostgreSQL, Oracle) or indexed views (SQL Server), which store
            results on disk.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Can you INSERT data into a SQL view?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Sometimes. Simple views on a single table without GROUP BY, DISTINCT,
            or aggregates are usually updatable. Complex views with JOINs or
            aggregations are read-only. Use WITH CHECK OPTION to prevent
            invisible rows.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            What is the difference between a view and a table in SQL?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            A table stores data physically on disk. A view stores only a query
            definition. When you SELECT from a view, the database runs the saved
            query and returns fresh results. Views take no storage space (except
            materialized views).
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Will AI replace the need to learn SQL views?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            No. AI can generate CREATE VIEW statements, but you still need to
            understand what views are, when to use them vs tables, and their
            limitations around updatability and performance. AI is a tool that
            works best when you understand the concepts it is working with.
          </p>
        </div>
      </div>

      {/* Related Guides */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-amber-900 mb-3">
          📚 Related Guides
        </h3>
        <ul className="space-y-2 text-amber-800">
          <li>
            &bull;{" "}
            <Link
              href="/blog/view-vs-materialized-view"
              className="hover:underline"
            >
              View vs Materialized View
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link
              href="/blog/sql-join-types-explained"
              className="hover:underline"
            >
              SQL Join Types Explained
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link
              href="/blog/what-is-cte-in-sql"
              className="hover:underline"
            >
              What Is a CTE in SQL?
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link
              href="/blog/sql-for-data-analysts"
              className="hover:underline"
            >
              SQL for Data Analysts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
