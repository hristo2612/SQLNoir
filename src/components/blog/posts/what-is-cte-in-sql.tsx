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

export default function WhatIsCteSqlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Ever stared at a SQL query with so many nested subqueries it looked like
        a Russian nesting doll of confusion? Common Table Expressions (CTEs) are
        SQL&apos;s way of saying: &ldquo;let&apos;s organize this mess.&rdquo;
        Here&apos;s everything you need to know.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            &bull;{" "}
            <a href="#what-is-cte" className="hover:underline">
              What Is a CTE?
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#how-ctes-work" className="hover:underline">
              How CTEs Work: The Execution Flow
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#cte-syntax" className="hover:underline">
              CTE Syntax Breakdown
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#why-use-ctes" className="hover:underline">
              Why Use CTEs? The Problem They Solve
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#multiple-ctes" className="hover:underline">
              Multiple CTEs in One Query
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#recursive-ctes" className="hover:underline">
              Recursive CTEs: Following the Trail
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#cte-vs-subquery" className="hover:underline">
              CTE vs Subquery: When to Use Each
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common CTE Mistakes
            </a>
          </li>
          <li>
            &bull;{" "}
            <a href="#quiz" className="hover:underline">
              Test Your CTE Knowledge
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

      {/* ─── Section 1: What Is a CTE? ─── */}
      <h2
        id="what-is-cte"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Is a CTE (Common Table Expression)?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A CTE is a temporary, named result set that you define at the top of a
        query using the <code>WITH</code> keyword. It exists only for the
        duration of that single query. Once the query finishes, the CTE is gone.
      </p>

      <DetectiveTip variant="tip" title="Think of It This Way">
        A CTE is like building a case file before writing your final report. You
        gather the evidence first, give it a name, then reference it throughout
        your report. When the report is done, you close the file.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the simplest possible CTE:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH active_suspects AS (
  SELECT name, age, last_seen
  FROM suspects
  WHERE status = 'active'
)
SELECT name, age
FROM active_suspects
WHERE age > 30;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The CTE <code>active_suspects</code> filters the suspects table first.
          The main query then works with that smaller, focused result set.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Nothing fancy. You define a named result set with <code>WITH</code>,
        then use it in your main query like any other table.
      </p>

      {/* ─── Section 2: How CTEs Work ─── */}
      <h2
        id="how-ctes-work"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How CTEs Work: The Execution Flow
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A CTE goes through four stages during query execution. Understanding
        this lifecycle helps you know exactly what&apos;s happening under the
        hood.
      </p>

      <FlowDiagram
        nodes={[
          { label: "WITH: Define named result set", icon: "📋", type: "start" as const },
          { label: "AS: Execute CTE query", icon: "⚙️", type: "process" as const },
          { label: "SELECT: Reference CTE like a table", icon: "🔍", type: "process" as const },
          { label: "Done: CTE discarded, memory freed", icon: "🗑️", type: "end" as const },
        ]}
        caption="CTE Execution Lifecycle: defined, executed, referenced, then discarded"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        The key takeaway: a CTE is not stored anywhere. It&apos;s not a table,
        not a view, not a temp table. It lives and dies within a single
        statement.
      </p>

      {/* ─── Section 3: CTE Syntax Breakdown ─── */}
      <h2
        id="cte-syntax"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CTE Syntax Breakdown
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Let&apos;s break down every part of a CTE. Each keyword and clause has a
        specific job:
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "WITH",
            code: "suspect_locations",
            annotation:
              "Start the CTE definition and give it a name (you choose this)",
          },
          {
            keyword: "AS (",
            code: "",
            annotation: "Open the CTE query definition",
          },
          {
            keyword: "  SELECT",
            code: "s.name, cs.location, cs.crime_date",
            annotation: "Define what columns the CTE produces",
          },
          {
            keyword: "  FROM",
            code: "suspects s JOIN crime_scenes cs ON s.scene_id = cs.id",
            annotation: "The source tables for the CTE",
          },
          {
            keyword: "  WHERE",
            code: "cs.crime_date > '1986-01-01'",
            annotation: "Filter within the CTE",
          },
          {
            keyword: ")",
            code: "",
            annotation: "Close the CTE definition",
          },
          {
            keyword: "SELECT",
            code: "name, location",
            annotation: "Main query references the CTE by name",
          },
          {
            keyword: "FROM",
            code: "suspect_locations",
            annotation: "Use the CTE exactly like a regular table",
          },
        ]}
        caption="Anatomy of a CTE: WITH names it, AS defines it, then use it in your main query"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Notice the pattern: everything between <code>AS (</code> and{" "}
        <code>)</code> is just a normal SELECT query. You can put anything there
        that you&apos;d normally write in a subquery.
      </p>

      {/* ─── Section 4: Why Use CTEs? ─── */}
      <h2
        id="why-use-ctes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Why Use CTEs? The Problem They Solve
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The biggest reason to use CTEs: readability. Complex queries with nested
        subqueries become nearly impossible to debug. CTEs let you name each
        step, making your logic self-documenting.
      </p>

      <BeforeAfter
        before={{
          code: `SELECT name, total_appearances
FROM (
  SELECT s.name,
    (SELECT COUNT(*)
     FROM crime_scenes cs
     WHERE cs.suspect_id = s.id
     AND cs.crime_date > '1986-01-01'
    ) AS total_appearances
  FROM suspects s
  WHERE s.status = 'active'
) AS active_with_counts
WHERE total_appearances > 3
ORDER BY total_appearances DESC;`,
          label: "Nested Subquery Mess",
          issues: [
            "Hard to read with nested layers",
            "Difficult to debug each step",
            "Must repeat subquery if used elsewhere",
          ],
        }}
        after={{
          code: `WITH active_suspects AS (
  SELECT id, name
  FROM suspects
  WHERE status = 'active'
),
scene_counts AS (
  SELECT suspect_id, COUNT(*) AS total_appearances
  FROM crime_scenes
  WHERE crime_date > '1986-01-01'
  GROUP BY suspect_id
)
SELECT a.name, sc.total_appearances
FROM active_suspects a
JOIN scene_counts sc ON a.id = sc.suspect_id
WHERE sc.total_appearances > 3
ORDER BY sc.total_appearances DESC;`,
          label: "Clean CTE Version",
          improvements: [
            "Each step has a clear name",
            "Easy to debug independently",
            "Reusable within the same query",
          ],
        }}
        caption="Same logic, dramatically different readability. CTEs turn query spaghetti into organized steps."
      />

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing cleaner queries with real data,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you solve mysteries with real SQL, including CTEs for organizing
        complex investigations.
      </p>

      {/* ─── Section 5: Multiple CTEs ─── */}
      <h2
        id="multiple-ctes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Multiple CTEs in One Query
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        You can define multiple CTEs in a single query by separating them with
        commas. Later CTEs can reference earlier ones, letting you build up
        complex logic step by step.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Chaining CTEs for a Multi-Step Investigation
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH recent_crimes AS (
  SELECT id, location, crime_date
  FROM crime_scenes
  WHERE crime_date >= '1986-08-01'
),
suspects_at_scenes AS (
  SELECT s.name, s.id AS suspect_id, rc.location
  FROM suspects s
  JOIN recent_crimes rc ON s.scene_id = rc.id
),
repeat_offenders AS (
  SELECT suspect_id, name, COUNT(*) AS scene_count
  FROM suspects_at_scenes
  GROUP BY suspect_id, name
  HAVING COUNT(*) > 1
)
SELECT name, scene_count
FROM repeat_offenders
ORDER BY scene_count DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Three CTEs, each building on the previous. Step 1: find recent crimes.
          Step 2: find suspects at those scenes. Step 3: find repeat offenders.
          The main query simply reads the final result.
        </p>
      </div>

      <BeforeAfter
        before={{
          code: `SELECT name, COUNT(*) AS scene_count
FROM suspects s
JOIN crime_scenes cs ON s.scene_id = cs.id
WHERE cs.crime_date >= '1986-08-01'
  AND s.id IN (
    SELECT suspect_id
    FROM suspects s2
    JOIN crime_scenes cs2
      ON s2.scene_id = cs2.id
    WHERE cs2.crime_date >= '1986-08-01'
    GROUP BY suspect_id
    HAVING COUNT(*) > 1
  )
GROUP BY name
ORDER BY scene_count DESC;`,
          label: "Single Complex Query",
          issues: [
            "Nested subquery duplicates logic",
            "Hard to tell what each part does",
            "Difficult to modify one step",
          ],
        }}
        after={{
          code: `WITH recent_crimes AS (...),
suspects_at_scenes AS (...),
repeat_offenders AS (...)
SELECT name, scene_count
FROM repeat_offenders
ORDER BY scene_count DESC;`,
          label: "Multiple CTEs: Step by Step",
          improvements: [
            "Each CTE handles one logical step",
            "Later CTEs build on earlier ones",
            "Easy to add or remove steps",
          ],
        }}
        caption="Multiple CTEs turn complex analysis into a readable pipeline of named steps"
      />

      <DetectiveTip variant="tip" title="Naming Matters">
        Pick descriptive CTE names that explain what each step does. Names like{" "}
        <code>recent_crimes</code> and <code>repeat_offenders</code> are
        self-documenting. Names like <code>cte1</code> and <code>temp</code>{" "}
        defeat the purpose.
      </DetectiveTip>

      {/* ─── Section 6: Recursive CTEs ─── */}
      <h2
        id="recursive-ctes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Recursive CTEs: Following the Trail
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Recursive CTEs reference themselves. They&apos;re perfect for
        hierarchical data like org charts, file systems, or, in our case,
        following a chain of criminal associates.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        A recursive CTE has two parts: the <strong>anchor query</strong> (the
        starting point) and the <strong>recursive query</strong> (the part that
        references the CTE itself).
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Following a Chain of Associates
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH RECURSIVE associate_chain AS (
  -- Anchor: Start with the primary suspect
  SELECT id, name, associate_of, 1 AS depth
  FROM suspects
  WHERE name = 'Victor Malone'

  UNION ALL

  -- Recursive: Find each associate's associates
  SELECT s.id, s.name, s.associate_of, ac.depth + 1
  FROM suspects s
  JOIN associate_chain ac ON s.associate_of = ac.id
  WHERE ac.depth < 5  -- Safety limit
)
SELECT name, depth
FROM associate_chain
ORDER BY depth;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Starting from Victor Malone, this query follows the chain of
          associates up to 5 levels deep. Each iteration finds the next layer of
          connections.
        </p>
      </div>

      <FlowDiagram
        nodes={[
          { label: "Anchor: Get starting rows", icon: "🎯", type: "start" as const },
          { label: "Recursive: Join back to CTE", icon: "🔄", type: "process" as const },
          { label: "Repeat: Until no new rows found", icon: "🔁", type: "process" as const },
          { label: "Done: Return all accumulated rows", icon: "✅", type: "end" as const },
        ]}
        caption="Recursive CTE execution: start with anchor rows, keep joining until no new matches"
      />

      <DetectiveTip variant="warning" title="Watch Out for Infinite Loops">
        Always include a depth limit or exit condition in recursive CTEs. Without
        one, a circular reference (A associates with B, B associates with A)
        will run forever. Most databases have a default recursion limit (SQL
        Server: 100, PostgreSQL: no limit by default), but don&apos;t rely on
        it.
      </DetectiveTip>

      {/* ─── Section 7: CTE vs Subquery ─── */}
      <h2
        id="cte-vs-subquery"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CTE vs Subquery: When to Use Each
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        CTEs and subqueries often produce identical results. The choice usually
        comes down to readability and reuse. Here&apos;s a quick reference:
      </p>

      <ComparisonTable
        headers={["Aspect", "CTE", "Subquery"]}
        rows={[
          [
            "Readability",
            "Excellent. Named and organized at the top.",
            "Can get messy when nested deeply.",
          ],
          [
            "Reusability",
            "Reference multiple times in the same query.",
            "Must copy-paste if needed again.",
          ],
          [
            "Recursion",
            "Supported (WITH RECURSIVE).",
            "Not supported.",
          ],
          [
            "Performance",
            "Usually identical (optimizer handles both).",
            "Usually identical (optimizer handles both).",
          ],
          [
            "Best for",
            "Complex, multi-step logic.",
            "Simple, one-off comparisons.",
          ],
        ]}
        caption="CTE vs Subquery: choose based on complexity and reuse needs"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        The performance question comes up a lot. In most databases, the query
        optimizer treats CTEs and subqueries the same way. The execution plan is
        usually identical. Pick whichever makes your code clearer.
      </p>

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="A body was found at Coral Bay Marina. The investigation requires complex queries with multiple JOINs and filtering across surveillance records, hotel check-ins, and interviews. CTEs would make this investigation much cleaner."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 8: Common Mistakes ─── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common CTE Mistakes (And How to Fix Them)
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        1. Forgetting the comma between multiple CTEs
      </h3>

      <BeforeAfter
        before={{
          code: `WITH first_cte AS (
  SELECT * FROM suspects
)
WITH second_cte AS (  -- ERROR!
  SELECT * FROM crime_scenes
)
SELECT * FROM first_cte
JOIN second_cte ON ...;`,
          label: "Common Mistake",
          issues: [
            "Using WITH again for the second CTE",
            "SQL expects a comma, not a new WITH keyword",
          ],
        }}
        after={{
          code: `WITH first_cte AS (
  SELECT * FROM suspects
),  -- Just a comma!
second_cte AS (
  SELECT * FROM crime_scenes
)
SELECT * FROM first_cte
JOIN second_cte ON ...;`,
          label: "Fixed Version",
          improvements: [
            "Single WITH keyword at the start",
            "Comma separates multiple CTE definitions",
          ],
        }}
        caption="Only use WITH once. Separate multiple CTEs with commas."
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        2. Trying to use a CTE in a separate statement
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">This will fail:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH my_cte AS (
  SELECT * FROM suspects WHERE status = 'active'
);

-- This is a SEPARATE statement. my_cte doesn't exist here!
SELECT * FROM my_cte;  -- ERROR: relation "my_cte" does not exist`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The semicolon ends the statement. A CTE only lives within its own
          statement. Remove the semicolon and put the SELECT right after the CTE
          definition.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        3. Infinite recursion without an exit condition
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Always add a depth limit:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Add a depth column and filter on it
WITH RECURSIVE chain AS (
  SELECT id, name, 1 AS depth FROM suspects WHERE id = 1
  UNION ALL
  SELECT s.id, s.name, c.depth + 1
  FROM suspects s JOIN chain c ON s.associate_of = c.id
  WHERE c.depth < 10  -- Stop after 10 levels
)
SELECT * FROM chain;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The <code>WHERE c.depth &lt; 10</code> clause prevents infinite loops.
          You can also use <code>OPTION (MAXRECURSION 100)</code> in SQL Server
          as a safety net.
        </p>
      </div>

      {/* ─── Section 9: Quiz ─── */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Test Your CTE Knowledge
      </h2>

      <QuickQuiz
        title="🔍 CTE Quick Quiz"
        questions={[
          {
            question: "What keyword starts a CTE definition?",
            options: ["SELECT", "WITH", "CREATE", "FROM"],
            correctIndex: 1,
            explanation:
              "CTEs are defined using the WITH keyword, followed by the CTE name and AS (query).",
          },
          {
            question:
              "When should you use a CTE instead of a subquery?",
            options: [
              "For simple one-value comparisons",
              "When you need to reference the same result multiple times",
              "When performance is critical",
              "Never, they are identical",
            ],
            correctIndex: 1,
            explanation:
              "CTEs shine when you need to reference the same result set multiple times in a query. Subqueries would require you to copy-paste the same logic.",
          },
          {
            question: "How long does a CTE exist?",
            options: [
              "Until the database restarts",
              "Until you DROP it",
              "Only for the single query where it is defined",
              "For the entire session",
            ],
            correctIndex: 2,
            explanation:
              "A CTE is temporary. It exists only for the single statement where it is defined. Once the query finishes, the CTE is gone.",
          },
          {
            question:
              "What type of data is a recursive CTE perfect for?",
            options: [
              "Simple aggregations",
              "Hierarchical data (org charts, categories)",
              "Joining two tables",
              "Filtering by date",
            ],
            correctIndex: 1,
            explanation:
              "Recursive CTEs are designed for hierarchical or tree-structured data, like org charts, file systems, or chains of relationships.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put your CTE skills to the test?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s detective cases challenge you to write real SQL queries
          to solve mysteries. Start with a beginner case and work your way up to
          advanced investigations that benefit from clean, organized CTEs.
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
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What does CTE stand for in SQL?
          </h3>
          <p className="text-gray-700">
            CTE stands for Common Table Expression. It&apos;s a temporary, named
            result set that you can reference within a SELECT, INSERT, UPDATE, or
            DELETE statement.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Is a CTE the same as a temp table?
          </h3>
          <p className="text-gray-700">
            No. A CTE only exists for the single query where it&apos;s defined
            and is automatically discarded. A temp table persists for the entire
            session and is stored on disk. CTEs are for readability and
            organization; temp tables are for reuse across multiple queries.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Do CTEs improve performance?
          </h3>
          <p className="text-gray-700">
            Usually no. Most database query optimizers treat CTEs and subqueries
            identically. CTEs improve readability and maintainability, not speed.
            In some edge cases, CTEs can be slower if the optimizer materializes
            them when it shouldn&apos;t.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can I use a CTE in an UPDATE or DELETE statement?
          </h3>
          <p className="text-gray-700">
            Yes. CTEs work with UPDATE, DELETE, INSERT, and MERGE statements, not
            just SELECT. This is useful for complex data modifications based on
            calculated values.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What&apos;s the difference between WITH and CREATE VIEW?
          </h3>
          <p className="text-gray-700">
            A CTE (<code>WITH</code>) is temporary and exists only for one query.
            A VIEW is a stored object in the database that persists until dropped.
            Use CTEs for one-off complex queries; use views for reusable query
            definitions that multiple queries or users need to access.
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
              href="/blog/sql-join-types-explained"
              className="hover:underline"
            >
              SQL Join Types Explained: All 6 Types With Visual Examples
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link href="/blog/sql-window-functions" className="hover:underline">
              SQL Window Functions Explained: The Complete Visual Guide
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link
              href="/blog/having-vs-where-sql"
              className="hover:underline"
            >
              HAVING vs WHERE in SQL: What&apos;s the Difference?
            </Link>
          </li>
          <li>
            &bull;{" "}
            <Link
              href="/blog/sql-for-data-analysts"
              className="hover:underline"
            >
              SQL for Data Analysts: The Complete Guide to Getting Hired
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
