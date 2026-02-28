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
  CheatSheetCard,
} from "@/components/blog/content";

export default function SqlCaseWhenContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        SQL CASE WHEN is the if-then-else of SQL. It lets you add
        decision-making logic directly inside your queries, transforming,
        categorizing, and filtering data based on conditions you define.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#simple-vs-searched" className="hover:underline">
              Simple CASE vs Searched CASE
            </a>
          </li>
          <li>
            •{" "}
            <a href="#how-case-evaluates" className="hover:underline">
              How CASE Evaluates: Short-Circuit Logic
            </a>
          </li>
          <li>
            •{" "}
            <a href="#case-in-select" className="hover:underline">
              CASE WHEN in SELECT: Categorize Your Data
            </a>
          </li>
          <li>
            •{" "}
            <a href="#case-with-aggregates" className="hover:underline">
              CASE WHEN with Aggregates: The Pivot Pattern
            </a>
          </li>
          <li>
            •{" "}
            <a href="#case-in-other-clauses" className="hover:underline">
              CASE WHEN in WHERE, ORDER BY, and GROUP BY
            </a>
          </li>
          <li>
            •{" "}
            <a href="#nested-case" className="hover:underline">
              Nested CASE and Complex Patterns
            </a>
          </li>
          <li>
            •{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common Mistakes with CASE WHEN
            </a>
          </li>
          <li>
            •{" "}
            <a href="#cheat-sheet" className="hover:underline">
              Quick Reference: CASE WHEN Cheat Sheet
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

      {/* ─── Section 1: Simple CASE vs Searched CASE ─── */}
      <h2
        id="simple-vs-searched"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Simple CASE vs Searched CASE: Know the Difference
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL has two CASE syntax forms. They look similar but handle different
        situations. Simple CASE compares one expression against multiple values
        (like a switch statement). Searched CASE evaluates independent boolean
        conditions (like an if-else chain).
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Simple CASE:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT case_id, status,
  CASE status
    WHEN 'open'   THEN 'Active Investigation'
    WHEN 'closed' THEN 'Case Resolved'
    WHEN 'cold'   THEN 'Inactive'
    ELSE 'Unknown'
  END AS status_label
FROM crime_cases;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Simple CASE checks <code>status</code> against each WHEN value using
          equality (=). Clean and readable for straightforward lookups.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Searched CASE:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT suspect_id, name, prior_offenses,
  CASE
    WHEN prior_offenses > 5 THEN 'High Risk'
    WHEN prior_offenses > 2 THEN 'Medium Risk'
    WHEN prior_offenses > 0 THEN 'Low Risk'
    ELSE 'Clean Record'
  END AS risk_level
FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Searched CASE evaluates each WHEN as a standalone condition. Supports
          ranges, comparisons, LIKE, IN, IS NULL, and anything else you can put
          in a WHERE clause.
        </p>
      </div>

      <ComparisonTable
        headers={["Feature", "Simple CASE", "Searched CASE"]}
        rows={[
          [
            "Syntax",
            "CASE expr WHEN val THEN...",
            "CASE WHEN condition THEN...",
          ],
          [
            "Comparison type",
            "Equality only (=)",
            "Any comparison (>, <, LIKE, IN, IS NULL)",
          ],
          [
            "Multiple columns?",
            "No (single expression)",
            "Yes (any columns)",
          ],
          ["Range checks?", "No", "Yes (BETWEEN, >, <)"],
          ["Best for", "Status codes, enum values", "Complex business logic"],
          [
            "Readability",
            "Cleaner for simple lookups",
            "More explicit conditions",
          ],
        ]}
        caption="When to use each CASE form"
      />

      {/* ─── Section 2: How CASE Evaluates ─── */}
      <h2
        id="how-case-evaluates"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How CASE Evaluates: Short-Circuit Logic
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        CASE evaluates WHEN conditions top to bottom and returns the result for
        the first match. Once a condition is true, it skips everything below.
        This means the order of your WHEN clauses matters.
      </p>

      <FlowDiagram
        nodes={[
          { label: "Row arrives", icon: "📋", type: "start" as const },
          { label: "Check WHEN #1", icon: "🔍", type: "process" as const },
          { label: "Match? Return result", icon: "✅", type: "process" as const },
          { label: "No match? Check WHEN #2", icon: "🔍", type: "process" as const },
          { label: "No match? Check WHEN #3", icon: "🔍", type: "process" as const },
          { label: "No match? Return ELSE (or NULL)", icon: "🔚", type: "end" as const },
        ]}
        caption="CASE evaluates top-to-bottom and stops at the first match"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Order matters. Watch this:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- ❌ WRONG: General condition catches everything first
SELECT name, prior_offenses,
  CASE
    WHEN prior_offenses > 0 THEN 'Some Risk'
    WHEN prior_offenses > 5 THEN 'High Risk'  -- Never reached!
  END AS risk_level
FROM suspects;

-- ✅ RIGHT: Specific conditions first
SELECT name, prior_offenses,
  CASE
    WHEN prior_offenses > 5 THEN 'High Risk'
    WHEN prior_offenses > 0 THEN 'Some Risk'
    ELSE 'Clean Record'
  END AS risk_level
FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          In the wrong version, a suspect with 8 prior offenses matches{" "}
          <code>&gt; 0</code> first and gets &quot;Some Risk&quot; instead of
          &quot;High Risk.&quot; Always put specific conditions before general
          ones.
        </p>
      </div>

      <DetectiveTip variant="warning" title="Order Matters!">
        Put your most specific conditions first. <code>CASE WHEN score &gt; 0
        THEN &apos;some&apos; WHEN score &gt; 100 THEN &apos;high&apos;</code>{" "}
        will never reach &apos;high&apos; because <code>&gt; 0</code> catches
        everything first.
      </DetectiveTip>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        CASE WHEN appears in almost every real SQL query. If you want to
        practice writing conditional logic hands-on,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you classify evidence and filter suspects using the same patterns.
      </p>

      {/* ─── Section 3: CASE WHEN in SELECT ─── */}
      <h2
        id="case-in-select"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CASE WHEN in SELECT: Categorize Your Data
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The most common use of CASE WHEN is creating new computed columns.
        Bucketing continuous values into categories, mapping status codes to
        readable labels, or flagging rows that meet certain criteria.
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "CASE",
            code: "CASE",
            annotation: "Start the expression",
          },
          {
            keyword: "WHEN",
            code: "WHEN victim_count > 3",
            annotation: "First condition to check",
          },
          {
            keyword: "THEN",
            code: "THEN 'Critical'",
            annotation: "Value if condition is true",
          },
          {
            keyword: "WHEN",
            code: "WHEN victim_count > 1",
            annotation:
              "Second condition (only reached if first fails)",
          },
          {
            keyword: "THEN",
            code: "THEN 'Major'",
            annotation: "Value for second condition",
          },
          {
            keyword: "ELSE",
            code: "ELSE 'Minor'",
            annotation: "Default if no conditions match",
          },
          {
            keyword: "END",
            code: "END AS severity",
            annotation: "Close expression + name the column",
          },
        ]}
        caption="Anatomy of a CASE WHEN expression"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Full example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
  case_id,
  location,
  victim_count,
  CASE
    WHEN victim_count > 3 THEN 'Critical'
    WHEN victim_count > 1 THEN 'Major'
    ELSE 'Minor'
  END AS severity
FROM crime_scenes
ORDER BY victim_count DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Each row gets a severity label based on victim_count. Always use{" "}
          <code>AS alias</code> after <code>END</code> to name the computed
          column.
        </p>
      </div>

      {/* ─── Section 4: CASE with Aggregates ─── */}
      <h2
        id="case-with-aggregates"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CASE WHEN with Aggregates: The Pivot Pattern
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Put CASE inside aggregate functions like COUNT or SUM to conditionally
        aggregate data. This is the standard way to pivot rows into columns, and
        it works in every SQL dialect.
      </p>

      <BeforeAfter
        before={{
          code: "SELECT district, status, COUNT(*)\nFROM crime_cases\nGROUP BY district, status;",
          label: "Raw Data (many rows per district)",
          issues: [
            "Multiple rows per district",
            "Hard to compare across statuses",
            "Needs post-processing for dashboards",
          ],
        }}
        after={{
          code: "SELECT district,\n  COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_cases,\n  COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_cases,\n  COUNT(CASE WHEN status = 'cold' THEN 1 END) AS cold_cases\nFROM crime_cases\nGROUP BY district;",
          label: "Pivoted with CASE (one row per district)",
          improvements: [
            "One row per district",
            "Easy to compare statuses side by side",
            "Dashboard-ready output",
          ],
        }}
        caption="The pivot pattern: turn row values into columns using CASE inside COUNT"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Conditional SUM example:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT district,
  SUM(CASE WHEN status = 'closed' THEN evidence_count ELSE 0 END) AS solved_evidence,
  SUM(CASE WHEN status = 'open' THEN evidence_count ELSE 0 END) AS unsolved_evidence
FROM crime_cases
GROUP BY district;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          SUM with CASE lets you sum different subsets in the same query. Use{" "}
          <code>ELSE 0</code> with SUM to avoid NULL in the totals.
        </p>
      </div>

      <DetectiveTip variant="tip" title="COUNT vs SUM with CASE">
        With COUNT, use <code>THEN 1 END</code> (no ELSE needed, COUNT ignores
        NULLs). With SUM, use <code>ELSE 0 END</code> to avoid NULL results
        when no rows match.
      </DetectiveTip>

      {/* ─── Section 5: CASE in Other Clauses ─── */}
      <h2
        id="case-in-other-clauses"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CASE WHEN in WHERE, ORDER BY, and GROUP BY
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        CASE is not limited to SELECT. You can use it in ORDER BY for custom
        sorting, GROUP BY for computed categories, and even WHERE for conditional
        filtering (though you rarely should).
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Custom sort with ORDER BY CASE:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Show armed suspects first, then by name
SELECT name, status
FROM suspects
ORDER BY
  CASE WHEN status = 'armed' THEN 0
       WHEN status = 'wanted' THEN 1
       ELSE 2
  END,
  name ASC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          CASE in ORDER BY lets you define a custom priority. Armed suspects
          appear first regardless of alphabetical order.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Group by computed categories:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
  CASE
    WHEN date_opened >= '2025-01-01' THEN 'Recent'
    WHEN date_opened >= '2020-01-01' THEN 'Older'
    ELSE 'Cold Case'
  END AS case_age,
  COUNT(*) AS total
FROM crime_cases
GROUP BY
  CASE
    WHEN date_opened >= '2025-01-01' THEN 'Recent'
    WHEN date_opened >= '2020-01-01' THEN 'Older'
    ELSE 'Cold Case'
  END;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The CASE expression must be repeated in both SELECT and GROUP BY (or
          use a subquery/CTE to avoid repetition).
        </p>
      </div>

      <DetectiveTip variant="tip" title="Skip CASE in WHERE When You Can">
        You rarely need CASE in WHERE. Instead of{" "}
        <code>WHERE CASE WHEN type = &apos;A&apos; THEN 1 ELSE 0 END = 1</code>,
        just write <code>WHERE type = &apos;A&apos;</code>. CASE in WHERE is a
        code smell. Use it only when the filtering logic genuinely depends on
        other column values.
      </DetectiveTip>

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={4}
        caseTitle="The Vanishing Diamond"
        challenge="The diamond vanished from a charity gala. Can you use CASE WHEN to classify guest behavior and identify the thief?"
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 6: Nested CASE ─── */}
      <h2
        id="nested-case"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Nested CASE and Complex Patterns
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        You can nest CASE inside CASE, but deep nesting gets hard to read fast.
        When you find yourself going more than two levels deep, flatten the
        conditions or use a{" "}
        <Link
          href="/blog/what-is-cte-in-sql"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          CTE
        </Link>{" "}
        with a lookup table instead.
      </p>

      <BeforeAfter
        before={{
          code: "CASE WHEN type = 'A'\n  THEN CASE WHEN status = 'active'\n    THEN CASE WHEN priority > 5\n      THEN 'urgent-A'\n      ELSE 'normal-A'\n    END\n    ELSE 'inactive-A'\n  END\n  WHEN type = 'B' THEN ...\nEND",
          label: "Deeply nested CASE (hard to maintain)",
          issues: [
            "3 levels deep",
            "Hard to read and debug",
            "Adding a new type requires editing nested structure",
          ],
        }}
        after={{
          code: "CASE\n  WHEN type = 'A' AND status = 'active' AND priority > 5 THEN 'urgent-A'\n  WHEN type = 'A' AND status = 'active' THEN 'normal-A'\n  WHEN type = 'A' THEN 'inactive-A'\n  WHEN type = 'B' THEN ...\nEND",
          label: "Flat CASE with combined conditions",
          improvements: [
            "Flat structure, easy to scan",
            "Each outcome on one line",
            "Adding new cases is straightforward",
          ],
        }}
        caption="Flatten nested CASE by combining conditions with AND"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">CASE with NULL handling:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- CASE for explicit NULL handling
SELECT name, phone,
  CASE
    WHEN phone IS NULL THEN 'No phone on file'
    ELSE phone
  END AS contact_phone
FROM suspects;

-- COALESCE is a shortcut for this exact pattern
SELECT name, COALESCE(phone, 'No phone on file') AS contact_phone
FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          COALESCE returns the first non-NULL value. When your CASE just
          replaces NULL with a default, use COALESCE instead.
        </p>
      </div>

      {/* ─── Section 7: Common Mistakes ─── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes with CASE WHEN
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Three mistakes trip up almost everyone who writes CASE WHEN queries.
        Here they are with fixes.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Mistake 1: Wrong condition order
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- ❌ General before specific
CASE WHEN score > 0 THEN 'Has Score'
     WHEN score > 100 THEN 'High Score'  -- Never reached
END

-- ✅ Specific before general
CASE WHEN score > 100 THEN 'High Score'
     WHEN score > 0 THEN 'Has Score'
END`}
        </pre>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Mistake 2: Forgetting ELSE
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- ❌ No ELSE: unmatched rows return NULL
CASE WHEN status = 'open' THEN 'Active'
     WHEN status = 'closed' THEN 'Resolved'
END  -- What about 'cold' status? Returns NULL!

-- ✅ Always include ELSE unless you want NULL
CASE WHEN status = 'open' THEN 'Active'
     WHEN status = 'closed' THEN 'Resolved'
     ELSE 'Other'
END`}
        </pre>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Mistake 3: Using = NULL instead of IS NULL
      </h3>

      <BeforeAfter
        before={{
          code: "CASE WHEN phone = NULL THEN 'No phone'\n     ELSE phone\nEND",
          label: "Wrong: Using = NULL",
          issues: [
            "= NULL always evaluates to UNKNOWN (not TRUE)",
            "Every row falls to ELSE",
            "No rows ever get 'No phone'",
          ],
        }}
        after={{
          code: "CASE WHEN phone IS NULL THEN 'No phone'\n     ELSE phone\nEND",
          label: "Right: Using IS NULL",
          improvements: [
            "IS NULL correctly tests for NULL values",
            "Rows with missing phone numbers now get 'No phone'",
            "Standard SQL behavior across all databases",
          ],
        }}
        caption="Nothing equals NULL in SQL, not even NULL itself. Always use IS NULL."
      />

      {/* ─── Section 8: Cheat Sheet & Quiz ─── */}
      <h2
        id="cheat-sheet"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Reference: CASE WHEN Cheat Sheet
      </h2>

      <ComparisonTable
        headers={["Pattern", "Syntax", "Use Case"]}
        rows={[
          [
            "Categorize",
            "CASE WHEN x > 10 THEN 'high' END",
            "Create labels from values",
          ],
          [
            "Pivot",
            "COUNT(CASE WHEN status='open' THEN 1 END)",
            "Turn rows into columns",
          ],
          [
            "Custom sort",
            "ORDER BY CASE WHEN ... END",
            "Non-alphabetical ordering",
          ],
          [
            "NULL handling",
            "CASE WHEN x IS NULL THEN 'N/A' END",
            "Replace missing values",
          ],
          [
            "Conditional SUM",
            "SUM(CASE WHEN type='A' THEN amount END)",
            "Sum specific subsets",
          ],
        ]}
        caption="All CASE WHEN patterns in one place"
      />

      <QuickQuiz
        title="🔍 Test Your CASE WHEN Knowledge"
        questions={[
          {
            question:
              "What happens if no WHEN condition matches and there's no ELSE clause?",
            options: [
              "An error is thrown",
              "NULL is returned",
              "The first WHEN result is returned",
              "An empty string is returned",
            ],
            correctIndex: 1,
            explanation:
              "Without an ELSE clause, CASE returns NULL when no conditions match. Always add ELSE unless you intentionally want NULL.",
          },
          {
            question:
              "Which CASE form lets you use range comparisons like > or BETWEEN?",
            options: [
              "Simple CASE",
              "Searched CASE",
              "Both",
              "Neither",
            ],
            correctIndex: 1,
            explanation:
              "Simple CASE only supports equality (=). Searched CASE (CASE WHEN condition THEN...) supports any comparison operator.",
          },
          {
            question:
              "You want to count how many orders are 'high value' (over $1000). Which pattern works?",
            options: [
              "COUNT(CASE WHEN amount > 1000 THEN 1 END)",
              "CASE WHEN COUNT(amount) > 1000 THEN 1 END",
              "COUNT(*) WHERE CASE amount > 1000",
              "SUM(CASE WHEN amount > 1000 THEN COUNT(*) END)",
            ],
            correctIndex: 0,
            explanation:
              "Put CASE inside the aggregate function. COUNT ignores NULLs, so rows not matching the WHEN condition (which return NULL) aren't counted.",
          },
          {
            question:
              "Why does CASE WHEN phone = NULL THEN 'missing' never work?",
            options: [
              "NULL is not a valid value in SQL",
              "= NULL always returns UNKNOWN, not TRUE",
              "CASE doesn't support NULL comparisons",
              "You need to use != NULL instead",
            ],
            correctIndex: 1,
            explanation:
              "In SQL, nothing equals NULL (not even NULL itself). Use IS NULL instead of = NULL to test for missing values.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put CASE WHEN into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          CASE WHEN is one of the most-used SQL patterns in real work and
          interviews. Build muscle memory by solving detective cases where you
          classify evidence and crack mysteries with conditional logic.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ─── FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FAQ
      </h2>

      <div className="space-y-6 mb-8">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What is the difference between CASE and IF in SQL?
          </h3>
          <p className="text-gray-700">
            CASE is standard SQL and works in every database. IF is
            MySQL-specific (SQL Server has IIF). Use CASE for portability across
            databases.
          </p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can you use CASE WHEN in a WHERE clause?
          </h3>
          <p className="text-gray-700">
            Yes, but it&apos;s rarely needed. Most CASE-in-WHERE can be
            rewritten as simple boolean conditions, which are clearer and often
            faster because the optimizer can use indexes.
          </p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Does CASE WHEN affect query performance?
          </h3>
          <p className="text-gray-700">
            Minimal impact. CASE is evaluated per-row like any other expression.
            The bigger performance concern is using CASE in WHERE, which can
            prevent the database from using indexes effectively.
          </p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can you have multiple CASE WHEN in one SELECT?
          </h3>
          <p className="text-gray-700">
            Yes. Each CASE expression is independent. You can have as many CASE
            columns as you need in a single SELECT statement.
          </p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What is the CASE WHEN pivot pattern?
          </h3>
          <p className="text-gray-700">
            Using CASE inside aggregate functions (COUNT, SUM) to turn row
            values into columns. It works in all SQL dialects, unlike the PIVOT
            keyword which is only available in SQL Server and Oracle.
          </p>
        </div>
      </div>

      {/* Related Guides */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          📚 Related Guides
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            •{" "}
            <Link
              href="/blog/what-is-cte-in-sql"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              What Is a CTE in SQL?
            </Link>{" "}
            - Organize complex queries with named subqueries
          </li>
          <li>
            •{" "}
            <Link
              href="/blog/having-vs-where-sql"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              HAVING vs WHERE in SQL
            </Link>{" "}
            - Know when to filter rows vs groups
          </li>
          <li>
            •{" "}
            <Link
              href="/blog/sql-window-functions"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL Window Functions Explained
            </Link>{" "}
            - Advanced analytics with OVER()
          </li>
          <li>
            •{" "}
            <Link
              href="/blog/sql-for-data-analysts"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL for Data Analysts
            </Link>{" "}
            - Essential skills for data analysis careers
          </li>
        </ul>
      </div>
    </div>
  );
}
