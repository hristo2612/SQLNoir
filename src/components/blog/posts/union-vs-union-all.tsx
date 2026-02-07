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

export default function UnionVsUnionAllContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        UNION and UNION ALL both combine query results vertically, but one
        removes duplicates while the other keeps them all. Choosing wrong can
        tank your query performance or give you incorrect results. This guide
        shows the difference visually.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#visual-difference" className="hover:underline">
              UNION vs UNION ALL: The Visual Difference
            </a>
          </li>
          <li>
            •{" "}
            <a href="#how-union-works" className="hover:underline">
              How UNION Works (With Code)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#how-union-all-works" className="hover:underline">
              How UNION ALL Works (With Code)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#comparison-table" className="hover:underline">
              Side-by-Side Comparison
            </a>
          </li>
          <li>
            •{" "}
            <a href="#when-to-use" className="hover:underline">
              When to Use UNION vs UNION ALL
            </a>
          </li>
          <li>
            •{" "}
            <a href="#performance" className="hover:underline">
              Performance: Why UNION ALL is Usually Faster
            </a>
          </li>
          <li>
            •{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common Mistakes (And How to Avoid Them)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#union-vs-join" className="hover:underline">
              UNION vs JOIN: What&apos;s the Difference?
            </a>
          </li>
          <li>
            •{" "}
            <a href="#quiz" className="hover:underline">
              Test Your Knowledge
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

      {/* ─── Section 1: Visual Difference ─── */}
      <h2
        id="visual-difference"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        UNION vs UNION ALL: The Visual Difference
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Before we look at any SQL, let&apos;s see what these operators actually
        do to your data. Imagine you&apos;re a detective combining witness lists
        from two different crime scenes.
      </p>

      <div className="not-prose my-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Source data */}
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
            <h4 className="font-detective text-amber-900 mb-4 text-lg">
              📋 Your Source Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="font-semibold text-amber-800 mb-2 text-sm">
                  Scene A Witnesses:
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Detective Mills</li>
                  <li>Officer Chen</li>
                  <li>Dr. Lopez</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="font-semibold text-amber-800 mb-2 text-sm">
                  Scene B Witnesses:
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Detective Mills</li>
                  <li>Officer Park</li>
                  <li>Dr. Lopez</li>
                </ul>
              </div>
            </div>
            <p className="text-amber-700 text-sm mt-3 italic">
              Notice: Detective Mills and Dr. Lopez appear at both scenes.
            </p>
          </div>

          {/* Results comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-blue-200/60 bg-blue-50/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔵</span>
                <span className="font-detective text-blue-800 font-semibold">
                  UNION Result (4 rows)
                </span>
              </div>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>Detective Mills</li>
                <li>Officer Chen</li>
                <li>Dr. Lopez</li>
                <li>Officer Park</li>
              </ul>
              <p className="text-blue-700 text-xs mt-3">
                Duplicates removed. Each person listed once.
              </p>
            </div>
            <div className="rounded-xl border border-green-200/60 bg-green-50/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🟢</span>
                <span className="font-detective text-green-800 font-semibold">
                  UNION ALL Result (6 rows)
                </span>
              </div>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>Detective Mills</li>
                <li>Officer Chen</li>
                <li>Dr. Lopez</li>
                <li>Detective Mills</li>
                <li>Officer Park</li>
                <li>Dr. Lopez</li>
              </ul>
              <p className="text-green-700 text-xs mt-3">
                All rows kept. Duplicates preserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        That&apos;s the core difference. UNION gives you unique rows. UNION ALL
        gives you everything. The question is: which one do you actually need?
      </p>

      {/* ─── Section 2: How UNION Works ─── */}
      <h2
        id="how-union-works"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How UNION Works (With Code)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        UNION combines the results of two or more SELECT statements and
        automatically removes duplicate rows. It&apos;s essentially doing a
        DISTINCT on the combined results.
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "name, role",
            annotation: "Columns must match in both queries",
          },
          {
            keyword: "FROM",
            code: "scene_a_witnesses",
            annotation: "First data source",
          },
          {
            keyword: "UNION",
            code: "",
            annotation: "Combines results, removes duplicates",
          },
          {
            keyword: "SELECT",
            code: "name, role",
            annotation: "Same columns, same order",
          },
          {
            keyword: "FROM",
            code: "scene_b_witnesses",
            annotation: "Second data source",
          },
        ]}
        caption="Anatomy of a UNION query"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Combine witness lists, removing duplicates
SELECT name, role FROM scene_a_witnesses
UNION
SELECT name, role FROM scene_b_witnesses;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong> 4 rows. Detective Mills and Dr. Lopez appear
          once each, even though they were at both scenes.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Practice combining data from multiple tables in{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>
        , where you&apos;ll query witnesses, suspects, and clues across
        different crime scenes.
      </p>

      {/* ─── Section 3: How UNION ALL Works ─── */}
      <h2
        id="how-union-all-works"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How UNION ALL Works (With Code)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        UNION ALL combines the results of two or more SELECT statements and
        keeps all rows, including duplicates. No deduplication means no extra
        work for the database.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Combine witness lists, keeping ALL rows
SELECT name, role FROM scene_a_witnesses
UNION ALL
SELECT name, role FROM scene_b_witnesses;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong> 6 rows. All original rows from both tables,
          including duplicates.
        </p>
      </div>

      <DetectiveTip variant="clue" title="When duplicates matter">
        If a witness appears at multiple crime scenes, that&apos;s a clue! UNION
        ALL preserves this information. UNION would hide it. Sometimes what
        looks like &quot;duplicate data&quot; is actually valuable insight.
      </DetectiveTip>

      {/* ─── Section 4: Comparison Table ─── */}
      <h2
        id="comparison-table"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Side-by-Side Comparison
      </h2>

      <ComparisonTable
        headers={["Feature", "UNION", "UNION ALL"]}
        rows={[
          ["Duplicates", "Removed", "Kept"],
          ["Performance", "Slower (sorts + dedupes)", "Faster (no extra step)"],
          ["Result size", "Smaller or equal", "Always sum of both"],
          [
            "When to use",
            "Need unique rows",
            "Need all rows or know no dupes exist",
          ],
          ["Memory usage", "Higher (sorting)", "Lower"],
        ]}
        caption="UNION vs UNION ALL at a Glance"
      />

      {/* ─── Section 5: When to Use ─── */}
      <h2
        id="when-to-use"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        When to Use UNION vs UNION ALL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The decision is simpler than most tutorials make it. Start with this
        flowchart:
      </p>

      <FlowDiagram
        nodes={[
          {
            label: "Combining query results?",
            icon: "🔀",
            type: "start",
          },
          {
            label: "Could duplicates exist across sources?",
            icon: "🤔",
            type: "decision",
          },
          {
            label: "Would duplicates cause incorrect results?",
            icon: "⚠️",
            type: "decision",
          },
          {
            label: "Use UNION (removes dupes)",
            icon: "🔵",
            type: "end",
          },
        ]}
        caption="If you answered NO to either question, use UNION ALL (faster)"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        In practice, UNION ALL is the right choice more often than you&apos;d
        think. Here are the key scenarios:
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-green-900 mb-3">
          ✅ Use UNION ALL when:
        </h4>
        <ul className="text-green-800 space-y-2">
          <li>
            • Your sources <strong>can&apos;t have overlapping rows</strong>{" "}
            (e.g., transactions from different months)
          </li>
          <li>
            • You <strong>want to count duplicates</strong> (e.g., tracking how
            many times a person was mentioned)
          </li>
          <li>
            • <strong>Performance matters</strong> and you know duplicates
            aren&apos;t an issue
          </li>
          <li>
            • You&apos;re combining data and will <strong>deduplicate later</strong>{" "}
            anyway
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">🔵 Use UNION when:</h4>
        <ul className="text-blue-800 space-y-2">
          <li>
            • You need a <strong>unique list</strong> (e.g., all customers who
            bought product A OR product B)
          </li>
          <li>
            • Duplicates would <strong>skew your results</strong> (e.g.,
            counting or summing)
          </li>
          <li>
            • You&apos;re not sure if sources overlap and{" "}
            <strong>correctness beats performance</strong>
          </li>
        </ul>
      </div>

      {/* ─── Section 6: Performance ─── */}
      <h2
        id="performance"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Performance: Why UNION ALL is Usually Faster
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        UNION has hidden work. To remove duplicates, the database must sort all
        rows and compare them. On small datasets this is negligible. On millions
        of rows, it can make a real difference.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Non-overlapping data sources
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Active and closed cases CAN'T overlap (mutually exclusive)
-- Using UNION here wastes database resources
SELECT case_id, title FROM active_cases
UNION ALL  -- ← Correct: skip unnecessary deduplication
SELECT case_id, title FROM closed_cases;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          A case is either active or closed, never both. UNION would sort
          everything for no benefit.
        </p>
      </div>

      <DetectiveTip variant="warning" title="Performance trap">
        Using UNION &quot;just to be safe&quot; when your data can&apos;t have
        duplicates wastes database resources. Know your data before choosing.
      </DetectiveTip>

      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Think you understand how to combine data from multiple sources? Put your detective skills to the test."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 7: Common Mistakes ─── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes (And How to Avoid Them)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These are the errors that trip up most SQL users when working with UNION
        operations.
      </p>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        Mistake 1: Column count mismatch
      </h3>

      <BeforeAfter
        before={{
          code: `SELECT name, role, badge_number FROM officers
UNION ALL
SELECT name, role FROM detectives;`,
          label: "Error: Column count mismatch",
          issues: [
            "First query has 3 columns, second has 2",
            "SQL will throw an error",
          ],
        }}
        after={{
          code: `SELECT name, role, badge_number FROM officers
UNION ALL
SELECT name, role, NULL AS badge_number FROM detectives;`,
          label: "Fixed: Match column count with NULL",
          improvements: [
            "Both queries now have 3 columns",
            "NULL fills the missing data",
          ],
        }}
        caption="Every SELECT in a UNION must have the same number of columns"
      />

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        Mistake 2: ORDER BY in the wrong place
      </h3>

      <BeforeAfter
        before={{
          code: `SELECT name FROM suspects ORDER BY name
UNION ALL
SELECT name FROM witnesses;`,
          label: "Error: ORDER BY before UNION",
          issues: [
            "ORDER BY can only appear once, at the very end",
            "Most databases will throw a syntax error",
          ],
        }}
        after={{
          code: `SELECT name FROM suspects
UNION ALL
SELECT name FROM witnesses
ORDER BY name;`,
          label: "Correct: ORDER BY at the end",
          improvements: [
            "ORDER BY applies to the combined result",
            "Sorts all rows together",
          ],
        }}
        caption="ORDER BY comes after all UNION operations, and only once"
      />

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        Mistake 3: Using UNION when UNION ALL is correct
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">The scenario:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Combining January and February transactions
-- Each transaction has a unique ID - duplicates IMPOSSIBLE

-- ❌ Wasteful: UNION sorts and checks for duplicates that can't exist
SELECT * FROM january_transactions
UNION
SELECT * FROM february_transactions;

-- ✅ Better: UNION ALL skips unnecessary work
SELECT * FROM january_transactions
UNION ALL
SELECT * FROM february_transactions;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          When you know duplicates are impossible, UNION ALL is always the right
          choice.
        </p>
      </div>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        Mistake 4: Incompatible data types
      </h3>

      <BeforeAfter
        before={{
          code: `SELECT name, hire_date FROM employees
UNION ALL
SELECT name, salary FROM contractors;`,
          label: "Error: Type mismatch",
          issues: [
            "hire_date is a DATE, salary is a NUMBER",
            "Can't combine incompatible types in same position",
          ],
        }}
        after={{
          code: `SELECT name, hire_date, NULL AS salary FROM employees
UNION ALL
SELECT name, NULL AS hire_date, salary FROM contractors;`,
          label: "Fixed: Separate columns for different types",
          improvements: [
            "Each data type gets its own column",
            "NULL fills gaps appropriately",
          ],
        }}
        caption="Columns at the same position must have compatible data types"
      />

      {/* ─── Section 8: UNION vs JOIN ─── */}
      <h2
        id="union-vs-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        UNION vs JOIN: What&apos;s the Difference?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        This confusion is common. UNION and JOIN both combine data, but in
        completely different ways.
      </p>

      <ComparisonTable
        headers={["Aspect", "UNION / UNION ALL", "JOIN"]}
        rows={[
          ["Direction", "Vertical (stacks rows)", "Horizontal (adds columns)"],
          ["Result shape", "Same columns, more rows", "More columns, varies rows"],
          ["Requirements", "Same column count & types", "Related key columns"],
          ["Use case", "Combine similar datasets", "Connect related datasets"],
        ]}
        caption="UNION stacks data vertically, JOIN connects data horizontally"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Visual example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- UNION: Stack two lists vertically
-- Result: More rows, same columns
SELECT name FROM team_a    -- 3 rows
UNION ALL
SELECT name FROM team_b;   -- 3 rows = 6 total rows

-- JOIN: Connect tables horizontally
-- Result: Same(ish) rows, more columns
SELECT a.name, b.department
FROM employees a
JOIN departments b ON a.dept_id = b.id;`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Think of UNION as stacking two spreadsheets on top of each other. JOIN
        is like adding columns from one spreadsheet next to another based on a
        matching key.
      </p>

      {/* ─── Section 9: Quiz ─── */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Test Your Knowledge
      </h2>

      <QuickQuiz
        questions={[
          {
            question:
              "You need to combine two tables with identical structure. One is 'current_employees' and one is 'former_employees'. Some people might appear in both (rehires). You want a list of all unique people. Which do you use?",
            options: ["UNION", "UNION ALL"],
            correctIndex: 0,
            explanation:
              "UNION removes duplicates, giving you unique people even if someone was rehired and appears in both tables.",
          },
          {
            question:
              "You're combining sales data from Q1 and Q2 tables. Each row is a distinct transaction with a unique ID. No transaction can appear in both tables. Which is faster?",
            options: ["UNION", "UNION ALL"],
            correctIndex: 1,
            explanation:
              "UNION ALL is faster because it skips deduplication. Since transaction IDs are unique and can't overlap between quarters, use UNION ALL.",
          },
          {
            question:
              "You run: SELECT name FROM tableA UNION ALL SELECT name FROM tableB. TableA has 100 rows, tableB has 50 rows. How many rows in the result?",
            options: ["Exactly 150", "At most 150", "Depends on duplicates"],
            correctIndex: 0,
            explanation:
              "UNION ALL always returns all rows from both queries: 100 + 50 = 150. No deduplication, so the count is always the sum.",
          },
          {
            question: "Which requires more database resources to execute?",
            options: ["UNION (removes duplicates)", "UNION ALL (keeps all)"],
            correctIndex: 0,
            explanation:
              "UNION must sort all rows and compare them to find duplicates. UNION ALL just appends results with no extra processing.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put your SQL skills to work on real mysteries?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s 6 detective cases challenge you to write queries,
          combine clues, and crack cases using real SQL.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ─── Section 10: FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FAQ
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">
            What is the difference between UNION and UNION ALL in SQL?
          </h4>
          <p className="text-gray-700">
            UNION combines results and removes duplicate rows. UNION ALL
            combines results and keeps all rows including duplicates. UNION ALL
            is faster because it skips the deduplication step.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">
            When should I use UNION instead of UNION ALL?
          </h4>
          <p className="text-gray-700">
            Use UNION when you need unique rows and duplicates would be
            incorrect for your use case. Use UNION ALL when you need all rows,
            or when you know your source data cannot have overlapping rows
            (which is the more common scenario).
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">
            Which is faster, UNION or UNION ALL?
          </h4>
          <p className="text-gray-700">
            UNION ALL is faster because it simply appends results. UNION must
            sort and compare all rows to find and remove duplicates, which takes
            extra CPU time and memory.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">
            Can I use ORDER BY with UNION?
          </h4>
          <p className="text-gray-700">
            Yes, but only once at the very end of your combined query. ORDER BY
            applies to the final combined result, not to individual SELECT
            statements. Putting ORDER BY before UNION will cause a syntax error.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">
            What happens if the columns don&apos;t match in a UNION?
          </h4>
          <p className="text-gray-700">
            You&apos;ll get an error. Both SELECT statements must have the same
            number of columns, and the data types must be compatible. You can
            use NULL or type casting to align columns when needed.
          </p>
        </div>
      </div>
    </div>
  );
}
