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

export default function CoalesceSqlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        COALESCE returns the first non-NULL value from a list of arguments.
        Simple concept, but knowing when and why to use it separates beginners
        from pros.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            &bull;{" "}
            <a href="#what-does-coalesce-do" className="hover:underline">
              What Does COALESCE Do?
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#why-coalesce-matters" className="hover:underline">
              Why COALESCE Matters: The NULL Problem
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#coalesce-syntax" className="hover:underline">
              COALESCE Syntax and How It Works
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#practical-patterns" className="hover:underline">
              5 Practical COALESCE Patterns
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#coalesce-vs-isnull" className="hover:underline">
              COALESCE vs ISNULL vs IFNULL vs NVL
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common COALESCE Mistakes
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#interview-questions" className="hover:underline">
              COALESCE in Interviews
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

      {/* ── Section 1: What Does COALESCE Do? ── */}
      <h2
        id="what-does-coalesce-do"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Does COALESCE Do?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        COALESCE takes multiple arguments and returns the first one that
        isn&apos;t NULL. If every argument is NULL, it returns NULL. Think of it
        like following leads in an investigation: check the primary witness
        first. Dead end? Try the next lead. Keep going until you find something
        useful.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Basic Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Returns 'Found it!' (first non-NULL value)
SELECT COALESCE(NULL, NULL, 'Found it!', 'Too late');

-- Returns the first available contact method
SELECT COALESCE(witness_statement, anonymous_tip, 'No leads')
FROM case_files;`}
        </pre>
      </div>

      <FlowDiagram
        nodes={[
          { label: "Check arg 1", icon: "🔍", type: "start" },
          { label: "NULL? Try next", icon: "❌", type: "process" },
          { label: "Check arg 2", icon: "🔍", type: "process" },
          { label: "NOT NULL? Return it!", icon: "✅", type: "end" },
        ]}
        caption="COALESCE evaluates arguments left to right, stopping at the first non-NULL value"
      />

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "COALESCE(",
            annotation: "Function that returns the first non-NULL value",
          },
          {
            keyword: "",
            code: "witness_statement,",
            annotation: "First choice: check this column first",
          },
          {
            keyword: "",
            code: "anonymous_tip,",
            annotation: "Fallback: try this if the first is NULL",
          },
          {
            keyword: "",
            code: "'No leads')",
            annotation: "Default: guaranteed non-NULL last resort",
          },
        ]}
        caption="Anatomy of a COALESCE expression"
      />

      {/* ── Section 2: Why COALESCE Matters ── */}
      <h2
        id="why-coalesce-matters"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Why COALESCE Matters: The NULL Problem
      </h2>

      <div className="not-prose my-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium text-amber-800">
            on r/SQL
          </span>
        </div>
        <blockquote className="text-gray-700 text-sm leading-relaxed italic">
          &ldquo;I know exactly what coalesce does and I have used it once.
          Literally, once. What I don&apos;t understand is why I would want to
          replace a null value with zero instead of just letting it be null in
          the data.&rdquo;
        </blockquote>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Fair question. Here&apos;s why NULLs cause real problems:
      </p>

      <BeforeAfter
        before={{
          code: `-- Detective pay report WITHOUT COALESCE
SELECT name, salary + bonus AS total_pay
FROM detectives;

-- Results:
-- Sarah Chen  |  85000  (salary 75000 + bonus 10000)
-- Mike Torres |  NULL   (salary 80000 + bonus NULL)
-- Jess Park   |  NULL   (salary 70000 + bonus NULL)`,
          label: "Without COALESCE",
          issues: [
            "NULL + anything = NULL (Mike's pay vanishes)",
            "2 of 3 detectives show no total pay",
            "SUM(total_pay) only counts Sarah's row",
          ],
        }}
        after={{
          code: `-- Detective pay report WITH COALESCE
SELECT name, salary + COALESCE(bonus, 0) AS total_pay
FROM detectives;

-- Results:
-- Sarah Chen  |  85000  (75000 + 10000)
-- Mike Torres |  80000  (80000 + 0)
-- Jess Park   |  70000  (70000 + 0)`,
          label: "With COALESCE",
          improvements: [
            "NULL bonus treated as 0",
            "All detectives show accurate total pay",
            "SUM and AVG calculations work correctly",
          ],
        }}
        caption="NULL arithmetic is the #1 reason you need COALESCE"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        NULLs also cause surprises in filtering, sorting, and aggregation.
        COUNT(*) counts all rows, but COUNT(bonus) skips NULLs silently. AVG
        ignores NULL rows entirely, which can skew your results. COALESCE lets
        you decide what a missing value means instead of letting the database
        decide for you.
      </p>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        The same NULL handling skills come up constantly when querying real
        databases.{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        use multiple tables with LEFT JOINs, missing witness statements, and
        incomplete records that make pattern matching essential.
      </p>

      {/* ── Section 3: COALESCE Syntax ── */}
      <h2
        id="coalesce-syntax"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        COALESCE Syntax and How It Works
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Syntax:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`COALESCE(value1, value2, value3, ..., valueN)`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Takes 2 or more arguments. Returns the first non-NULL value, or NULL
          if all arguments are NULL.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        COALESCE uses short-circuit evaluation. It checks arguments left to
        right and stops the moment it finds a non-NULL value. The remaining
        arguments are never evaluated.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          With 2, 3, and 4+ arguments:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Two arguments (most common)
SELECT COALESCE(phone, 'No phone on file') FROM suspects;

-- Three arguments (fallback chain)
SELECT COALESCE(mobile, work_phone, 'No contact')
FROM witnesses;

-- Four arguments (extended fallback)
SELECT COALESCE(email, mobile, office_phone, 'Unreachable')
FROM persons_of_interest;`}
        </pre>
      </div>

      <DetectiveTip variant="tip" title="COALESCE Is Just a Shortcut for CASE">
        <code>COALESCE(a, b, c)</code> is equivalent to{" "}
        <code>
          CASE WHEN a IS NOT NULL THEN a WHEN b IS NOT NULL THEN b ELSE c END
        </code>
        . Same result, less typing. If you already know{" "}
        <Link
          href="/blog/sql-case-when"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          CASE WHEN
        </Link>
        , you already understand the logic behind COALESCE.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        One important rule: all arguments must have compatible data types. You
        can&apos;t mix integers and strings without an explicit CAST. The
        database uses the data type with the highest precedence from the
        argument list.
      </p>

      {/* ── Section 4: 5 Practical Patterns ── */}
      <h2
        id="practical-patterns"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        5 Practical COALESCE Patterns
      </h2>

      <div className="not-prose my-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium text-amber-800">
            on r/SQL
          </span>
        </div>
        <blockquote className="text-gray-700 text-sm leading-relaxed italic">
          &ldquo;What are some really good examples of using coalesce? I&apos;d
          like to know best practices of when it is most useful to use it
          particularly in combination with joins&rdquo;
        </blockquote>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pattern 1: Default Values for Display
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Clean report output: no ugly NULLs
SELECT
    name,
    COALESCE(phone, 'No phone on file') AS contact_number,
    COALESCE(email, 'No email provided') AS email_address
FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Replace NULL with human-readable defaults for reports and dashboards.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pattern 2: Safe Math Operations
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Prevent NULL from breaking calculations
SELECT
    case_id,
    COALESCE(physical_evidence_count, 0)
      + COALESCE(digital_evidence_count, 0)
      + COALESCE(witness_count, 0) AS total_leads
FROM cases;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Wrap any column that might be NULL with COALESCE(column, 0) before
          doing arithmetic.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pattern 3: Fallback Chains
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Try multiple contact methods in priority order
SELECT
    name,
    COALESCE(mobile, work_phone, home_phone, 'No contact info')
      AS best_contact
FROM witnesses;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Check mobile first. If NULL, try work phone. If NULL, try home phone.
          If all NULL, show a default message.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pattern 4: COALESCE with LEFT JOIN
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Handle unmatched rows from LEFT JOIN
SELECT
    cs.location,
    cs.description,
    COALESCE(s.name, 'No suspect identified') AS suspect
FROM crime_scenes cs
LEFT JOIN suspects s ON cs.suspect_id = s.id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          LEFT JOINs produce NULLs for unmatched rows. COALESCE turns those
          NULLs into meaningful values.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pattern 5: Dynamic Sorting
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Push NULL priorities to the bottom
SELECT case_id, title, priority
FROM cases
ORDER BY COALESCE(priority, 999);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Without COALESCE, NULL priority rows sort unpredictably (varies by
          database). COALESCE(priority, 999) pushes them to the end.
        </p>
      </div>

      <DetectiveTip variant="clue" title="The Fallback Chain">
        Think of COALESCE as following leads in an investigation. Check the
        primary source first. If it&apos;s a dead end (NULL), try the next lead.
        Keep going until you find something, or accept there are no leads.
      </DetectiveTip>

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="A body at Coral Bay Marina. Multiple tables, missing records, incomplete witness statements. Can you piece together the evidence?"
        difficulty="intermediate"
        href="/cases"
      />

      {/* ── Section 5: COALESCE vs ISNULL vs IFNULL vs NVL ── */}
      <h2
        id="coalesce-vs-isnull"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        COALESCE vs ISNULL vs IFNULL vs NVL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every major database has its own NULL-handling function. COALESCE is the
        only one that works everywhere.
      </p>

      <ComparisonTable
        headers={["Feature", "COALESCE", "ISNULL", "IFNULL", "NVL"]}
        rows={[
          ["SQL Standard", "✅ Yes", "❌ No", "❌ No", "❌ No"],
          ["Arguments", "2+", "2 only", "2 only", "2 only"],
          ["Database", "All", "SQL Server", "MySQL", "Oracle"],
          [
            "Type coercion",
            "Highest precedence",
            "First arg type",
            "First arg type",
            "First arg type",
          ],
          ["Short-circuit", "✅ Yes", "N/A (2 args)", "N/A (2 args)", "N/A (2 args)"],
          ["Portability", "Excellent", "Poor", "Poor", "Poor"],
        ]}
        caption="NULL handling functions across databases"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Same query, four syntaxes:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- SQL Standard (works everywhere)
SELECT COALESCE(phone, 'Unknown') FROM suspects;

-- SQL Server only
SELECT ISNULL(phone, 'Unknown') FROM suspects;

-- MySQL only
SELECT IFNULL(phone, 'Unknown') FROM suspects;

-- Oracle only
SELECT NVL(phone, 'Unknown') FROM suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Same result, but only COALESCE is portable. If you switch databases,
          COALESCE keeps working.
        </p>
      </div>

      <DetectiveTip variant="warning" title="ISNULL Has a Sneaky Type Trap">
        In SQL Server, ISNULL uses the data type of the FIRST argument. If the
        first arg is CHAR(5) and the fallback is a longer string, it gets
        truncated silently. COALESCE uses the highest-precedence type, avoiding
        this trap entirely.
      </DetectiveTip>

      {/* ── Section 6: Common Mistakes ── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common COALESCE Mistakes
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Mistake 1: Type Mismatch
      </h3>

      <BeforeAfter
        before={{
          code: `SELECT COALESCE(age, 'Unknown') FROM suspects;
-- ERROR: cannot convert 'Unknown' to integer`,
          label: "Type Mismatch Error",
          issues: [
            "age is an integer column",
            "'Unknown' is a string",
            "COALESCE requires compatible types",
          ],
        }}
        after={{
          code: `SELECT COALESCE(CAST(age AS VARCHAR), 'Unknown')
FROM suspects;`,
          label: "Fixed with CAST",
          improvements: [
            "Both arguments are now VARCHAR",
            "Returns age as string or 'Unknown'",
          ],
        }}
        caption="All COALESCE arguments must share compatible data types"
      />

      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">
        Mistake 2: Confusing Empty String with NULL
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Empty string is NOT NULL
SELECT COALESCE('', 'Fallback');
-- Returns '' (empty string), NOT 'Fallback'

-- To treat empty strings as missing:
SELECT COALESCE(NULLIF(notes, ''), 'No notes on file')
FROM case_files;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          NULLIF(notes, &apos;&apos;) converts empty strings to NULL first, then
          COALESCE handles the fallback.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">
        Mistake 3: Using COALESCE to Hide Bad Data
      </h3>

      <DetectiveTip variant="warning" title="Fix the Source, Not the Symptoms">
        If a column is frequently NULL and shouldn&apos;t be, adding COALESCE
        everywhere is a band-aid. Fix the data entry process or add a NOT NULL
        constraint. COALESCE is for handling legitimately optional data, not
        papering over data quality issues.
      </DetectiveTip>

      {/* ── Section 7: Interview Questions ── */}
      <h2
        id="interview-questions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        COALESCE in Interviews
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        COALESCE shows up in SQL interviews more often than you&apos;d expect.
        Here are the questions that come up most:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Q: Show employees with their manager name, or &apos;No Manager&apos;
          for top-level employees.
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    e.name AS employee,
    COALESCE(m.name, 'No Manager') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Classic self-join + COALESCE combo. The LEFT JOIN produces NULLs for
          employees without managers, and COALESCE replaces them.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Q: What&apos;s the difference between COALESCE and ISNULL?
        </h4>
        <p className="text-gray-600 text-sm mt-2">
          Three key differences: COALESCE is SQL standard (works everywhere),
          takes 2+ arguments, and uses highest-precedence type coercion. ISNULL
          is SQL Server-only, takes exactly 2 arguments, and uses first-argument
          type coercion (which can silently truncate data).
        </p>
      </div>

      <QuickQuiz
        title="🔍 Test Your COALESCE Knowledge"
        questions={[
          {
            question: "What does COALESCE(NULL, NULL, 42, NULL) return?",
            options: ["NULL", "42", "0", "Error"],
            correctIndex: 1,
            explanation:
              "COALESCE returns the first non-NULL value. It skips the two NULLs and returns 42.",
          },
          {
            question: "How many arguments can COALESCE take?",
            options: [
              "Exactly 2",
              "Up to 3",
              "2 or more (unlimited)",
              "Depends on the database",
            ],
            correctIndex: 2,
            explanation:
              "COALESCE accepts 2 or more arguments. ISNULL, IFNULL, and NVL are limited to exactly 2.",
          },
          {
            question:
              "What happens with COALESCE(integer_col, 'N/A')?",
            options: [
              "Returns 'N/A' for NULLs",
              "Returns 0 for NULLs",
              "Type conversion error",
              "Returns NULL",
            ],
            correctIndex: 2,
            explanation:
              "COALESCE requires compatible types. An integer column and a string literal will cause a type mismatch error.",
          },
          {
            question:
              "COALESCE(a, b) is equivalent to which CASE expression?",
            options: [
              "CASE WHEN a = b THEN a ELSE b END",
              "CASE WHEN a IS NOT NULL THEN a ELSE b END",
              "CASE WHEN a > 0 THEN a ELSE b END",
              "CASE WHEN a IS NULL THEN a ELSE b END",
            ],
            correctIndex: 1,
            explanation:
              "COALESCE checks IS NOT NULL, returning the first non-NULL argument. It's shorthand for CASE WHEN ... IS NOT NULL.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put NULL handling into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          COALESCE shows up constantly in real SQL work, from cleaning reports to
          fixing JOIN results. SQLNoir gives you 6 free detective mysteries where
          NULL handling, JOINs, and data gaps are part of every investigation.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ── Section 8: FAQ ── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FAQ
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            What is the difference between COALESCE and ISNULL in SQL?
          </h4>
          <p className="text-gray-700">
            COALESCE is SQL standard (works on every database), accepts 2 or
            more arguments, and uses highest-precedence type coercion. ISNULL is
            SQL Server-only, takes exactly 2 arguments, and uses the first
            argument&apos;s data type (which can silently truncate data). Always
            prefer COALESCE for portability.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Can COALESCE take more than two arguments?
          </h4>
          <p className="text-gray-700">
            Yes. COALESCE(a, b, c, d, ...) checks each argument left to right
            and returns the first non-NULL value. Unlike ISNULL, IFNULL, and NVL
            which are limited to exactly 2 arguments, COALESCE has no practical
            limit.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            What does COALESCE return if all arguments are NULL?
          </h4>
          <p className="text-gray-700">
            NULL. If every argument is NULL, COALESCE returns NULL. To guarantee
            a non-NULL result, add a literal default as the last argument:
            COALESCE(col1, col2, &apos;default value&apos;).
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Is COALESCE the same as CASE WHEN?
          </h4>
          <p className="text-gray-700">
            Functionally equivalent. COALESCE(a, b) produces the same result as
            CASE WHEN a IS NOT NULL THEN a ELSE b END. COALESCE is shorter and
            more readable, especially with multiple arguments.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Does COALESCE work with empty strings?
          </h4>
          <p className="text-gray-700">
            Yes, but an empty string (&apos;&apos;) is NOT NULL. COALESCE treats
            empty strings as non-NULL values and returns them. If you need to
            treat empty strings as missing, wrap the column in NULLIF first:
            COALESCE(NULLIF(column, &apos;&apos;), &apos;default&apos;).
          </p>
        </div>
      </div>

      {/* Related Guides */}
      <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">
        Related Guides
      </h3>
      <ul className="space-y-2 text-gray-700 mb-8">
        <li>
          &bull;{" "}
          <Link
            href="/blog/sql-case-when"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL CASE WHEN: The Complete Guide
          </Link>{" "}
          (COALESCE is a shortcut for CASE)
        </li>
        <li>
          &bull;{" "}
          <Link
            href="/blog/sql-join-types-explained"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL Join Types Explained
          </Link>{" "}
          (LEFT JOINs produce NULLs that COALESCE handles)
        </li>
        <li>
          &bull;{" "}
          <Link
            href="/blog/sql-window-functions"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL Window Functions Explained
          </Link>{" "}
          (LAG/LEAD produce NULLs at boundaries)
        </li>
        <li>
          &bull;{" "}
          <Link
            href="/blog/sql-for-data-analysts"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL for Data Analysts
          </Link>{" "}
          (NULL handling is a core analyst skill)
        </li>
      </ul>
    </div>
  );
}
