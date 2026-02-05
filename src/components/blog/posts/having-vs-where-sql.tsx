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

export default function HavingVsWhereSqlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        WHERE filters individual rows. HAVING filters groups after aggregation.
        That one sentence covers 80% of the confusion. This guide covers the
        other 20% with visual diagrams, code examples, and a quick quiz to make
        sure it sticks.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#quick-answer" className="hover:underline">
              The Quick Answer
            </a>
          </li>
          <li>
            •{" "}
            <a href="#sql-execution-order" className="hover:underline">
              How SQL Executes Your Query (Not Top to Bottom)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#where-clause" className="hover:underline">
              WHERE: Filtering Individual Rows
            </a>
          </li>
          <li>
            •{" "}
            <a href="#having-clause" className="hover:underline">
              HAVING: Filtering Groups After Aggregation
            </a>
          </li>
          <li>
            •{" "}
            <a href="#where-and-having-together" className="hover:underline">
              Using WHERE and HAVING Together
            </a>
          </li>
          <li>
            •{" "}
            <a href="#common-mistakes" className="hover:underline">
              Common Mistakes (and How to Fix Them)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#decision-guide" className="hover:underline">
              Quick Decision Guide: WHERE or HAVING?
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

      {/* ─── Section 1: The Quick Answer ─── */}
      <h2
        id="quick-answer"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The Quick Answer
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Both WHERE and HAVING filter data. The difference is <em>when</em> they
        run and <em>what</em> they filter.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        WHERE filters individual rows before any grouping happens. HAVING
        filters groups after the data has been aggregated. Here are two queries
        against the same <code>suspects</code> table to show the difference:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          WHERE: Filter individual suspects
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT name, city, age
FROM suspects
WHERE age > 30;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Returns each suspect over 30. Operates on individual rows.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          HAVING: Filter cities with many suspects
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT city, COUNT(*) AS suspect_count
FROM suspects
GROUP BY city
HAVING COUNT(*) > 3;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Returns only cities with more than 3 suspects. Operates on groups.
        </p>
      </div>

      <ComparisonTable
        headers={["Feature", "WHERE", "HAVING"]}
        rows={[
          ["Filters", "Individual rows", "Groups (after GROUP BY)"],
          ["Runs during", "Before grouping", "After grouping"],
          [
            "Aggregate functions",
            "Cannot use (SUM, COUNT, AVG)",
            "Can use",
          ],
          ["Requires GROUP BY", "No", "Yes (almost always)"],
          [
            "Performance",
            "Faster (reduces data early)",
            "Slower (processes all rows first)",
          ],
          [
            "Common use",
            "Filter specific records",
            "Filter aggregated results",
          ],
        ]}
        caption="WHERE vs HAVING at a Glance"
      />

      {/* ─── Section 2: SQL Execution Order ─── */}
      <h2
        id="sql-execution-order"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How SQL Executes Your Query (Not Top to Bottom)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        This is the key insight that makes WHERE vs HAVING click. SQL does not
        execute your query in the order you write it. You write SELECT first,
        but it runs fifth. Understanding the actual execution order explains
        exactly why WHERE cannot use aggregate functions and HAVING can.
      </p>

      <FlowDiagram
        nodes={[
          {
            label: "FROM",
            description: "Pick the table(s)",
            icon: "📋",
            type: "start",
          },
          {
            label: "WHERE",
            description: "Filter individual rows",
            icon: "🔍",
            type: "decision",
          },
          {
            label: "GROUP BY",
            description: "Group remaining rows",
            icon: "📊",
            type: "process",
          },
          {
            label: "HAVING",
            description: "Filter groups",
            icon: "🎯",
            type: "decision",
          },
          {
            label: "SELECT",
            description: "Choose columns",
            icon: "✅",
            type: "process",
          },
          {
            label: "ORDER BY",
            description: "Sort results",
            icon: "🔄",
            type: "process",
          },
          {
            label: "LIMIT",
            description: "Cap the output",
            icon: "✂️",
            type: "end",
          },
        ]}
        caption="SQL Query Execution Order: WHERE runs at Step 2, HAVING at Step 4"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        WHERE runs at step 2, before any grouping. At this point, SQL is
        looking at individual rows and has no concept of groups or aggregates.
        HAVING runs at step 4, after GROUP BY has already created groups.
        That is why HAVING can use COUNT(), SUM(), and AVG(). Those values
        exist by then.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here is a query that uses both. The color-coded breakdown shows the
        execution order vs the order you write it:
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "city, COUNT(*) AS suspect_count",
            annotation: "Step 5: Choose which columns to return",
          },
          {
            keyword: "FROM",
            code: "suspects",
            annotation: "Step 1: Start with the suspects table",
          },
          {
            keyword: "WHERE",
            code: "age > 25",
            annotation: "Step 2: Keep only suspects over 25",
          },
          {
            keyword: "GROUP BY",
            code: "city",
            annotation: "Step 3: Group remaining suspects by city",
          },
          {
            keyword: "HAVING",
            code: "COUNT(*) > 2",
            annotation: "Step 4: Keep only cities with 3+ suspects",
          },
          {
            keyword: "ORDER BY",
            code: "suspect_count DESC",
            annotation: "Step 6: Sort by count, highest first",
          },
        ]}
        caption="Written order vs execution order. Notice SELECT is written first but runs fifth."
      />

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding execution order is what separates SQL beginners from
        confident query writers. If you want to build that confidence through
        practice,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        force you to think through exactly this kind of query logic.
      </p>

      {/* ─── Section 3: WHERE Clause ─── */}
      <h2
        id="where-clause"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        WHERE: Filtering Individual Rows
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        WHERE operates on raw, ungrouped data. It checks each row individually
        and keeps only the ones that match your condition. Think of it as
        reviewing case files before the investigation meeting. You eliminate
        irrelevant suspects early so the rest of the query only processes
        relevant data.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Simple filter: suspects in Miami
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT name, age, alibi
FROM suspects
WHERE city = 'Miami';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Returns only suspects located in Miami. Every other city is excluded.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Combined conditions: narrowing the search
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT name, age, city
FROM suspects
WHERE age BETWEEN 25 AND 40
  AND city IN ('Miami', 'Tampa');`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Combines BETWEEN and IN to filter suspects aged 25-40 in two cities.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Pattern matching: suspects with no alibi
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT name, city, last_seen
FROM suspects
WHERE name LIKE 'J%'
  AND alibi IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Finds suspects whose name starts with J and have no alibi on record.
          LIKE and IS NULL are common WHERE operators.
        </p>
      </div>

      <DetectiveTip variant="tip" title="Think of WHERE as Your First Filter">
        WHERE is like reviewing case files before the investigation meeting. You
        eliminate irrelevant suspects early so the team only discusses people
        who actually match the evidence. The earlier you filter, the less work
        everything downstream has to do.
      </DetectiveTip>

      {/* ─── Section 4: HAVING Clause ─── */}
      <h2
        id="having-clause"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        HAVING: Filtering Groups After Aggregation
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        HAVING operates on grouped, aggregated data. It always works with GROUP
        BY and can use aggregate functions like COUNT(), SUM(), AVG(), MIN(),
        and MAX(). If WHERE is about filtering individual suspects, HAVING is
        about deciding which neighborhoods have enough suspicious activity to
        warrant a full investigation.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Cities with more than 3 suspects
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT city, COUNT(*) AS suspect_count
FROM suspects
GROUP BY city
HAVING COUNT(*) > 3;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Groups all suspects by city, then keeps only cities with more than 3.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Cities where average suspect age exceeds 30
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT city, AVG(age) AS avg_age
FROM suspects
GROUP BY city
HAVING AVG(age) > 30;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Calculates the average age per city, then filters to cities where
          that average exceeds 30.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Multiple aggregates: busy cities with high bounties
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT city,
       COUNT(*) AS suspect_count,
       SUM(bounty) AS total_bounty
FROM suspects
GROUP BY city
HAVING COUNT(*) >= 2
   AND SUM(bounty) > 50000;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Cities with at least 2 suspects AND a combined bounty over $50,000.
          HAVING supports multiple aggregate conditions.
        </p>
      </div>

      <DetectiveTip variant="clue" title="Think of HAVING as Your Group Verdict">
        HAVING is like deciding which neighborhoods deserve a full
        investigation. You have already grouped the evidence by area. Now you
        ask: which areas have ENOUGH suspicious activity to warrant sending a
        team?
      </DetectiveTip>

      {/* ─── Section 5: Using WHERE and HAVING Together ─── */}
      <h2
        id="where-and-having-together"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Using WHERE and HAVING Together
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The most common real-world pattern combines both clauses. WHERE filters
        rows first, GROUP BY groups them, then HAVING filters the groups. This
        two-stage approach is both powerful and efficient because WHERE reduces
        the dataset before the expensive GROUP BY operation.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Imagine you need to find cities where, among suspects over 25 with no
        alibi, at least 2 people were seen near the crime scene. Here is how
        that breaks down step by step:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Two-stage filtering in action
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Find high-activity cities among suspects
-- over 25 who lack an alibi
SELECT city, COUNT(*) AS suspect_count
FROM suspects
WHERE age > 25
  AND alibi IS NULL
GROUP BY city
HAVING COUNT(*) >= 2
ORDER BY suspect_count DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Step 1: WHERE removes suspects 25 and under, plus anyone with an
          alibi. Step 2: GROUP BY groups the remaining suspects by city. Step 3:
          HAVING keeps only cities with 2 or more matches.
        </p>
      </div>

      <BeforeAfter
        before={{
          code: `-- All 20 suspects in the table
SELECT * FROM suspects;
-- → 20 rows

-- After WHERE: age > 25 AND alibi IS NULL
SELECT * FROM suspects
WHERE age > 25 AND alibi IS NULL;
-- → 12 rows (8 eliminated)`,
          label: "After WHERE (12 rows)",
          issues: [
            "Started with 20 suspects",
            "WHERE eliminated 8 who were too young or had alibis",
            "12 individual rows remain for grouping",
          ],
        }}
        after={{
          code: `-- After GROUP BY city + HAVING COUNT(*) >= 2
SELECT city, COUNT(*) AS suspect_count
FROM suspects
WHERE age > 25 AND alibi IS NULL
GROUP BY city
HAVING COUNT(*) >= 2;
-- → 2 cities remain`,
          label: "After HAVING (2 groups)",
          improvements: [
            "12 rows grouped into 5 cities",
            "HAVING kept only cities with 2+ suspects",
            "Final result: 2 cities worth investigating",
          ],
        }}
        caption="WHERE reduces rows (20 → 12), then HAVING reduces groups (5 → 2). Two-stage filtering at work."
      />

      {/* Tier 2 CTA - MysteryTeaser */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Think you have got WHERE and HAVING down? Case #003 needs you to filter suspects, group evidence by location, and find patterns in surveillance records. The same two-stage filtering you just learned."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 6: Common Mistakes ─── */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes (and How to Fix Them)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These four mistakes show up constantly in SQL forums and Stack Overflow
        questions. Understanding them will save you hours of debugging.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 1: Using aggregate functions in WHERE
      </h3>

      <p className="text-gray-700 leading-relaxed mb-4">
        This is the most common error. WHERE runs before GROUP BY, so
        aggregates like COUNT() do not exist yet.
      </p>

      <BeforeAfter
        before={{
          code: `-- ❌ This throws an error
SELECT city, COUNT(*)
FROM suspects
WHERE COUNT(*) > 3
GROUP BY city;`,
          label: "Wrong: Aggregate in WHERE",
          issues: [
            "WHERE runs before GROUP BY",
            "COUNT(*) doesn't exist yet at step 2",
            "Most databases throw an error here",
          ],
        }}
        after={{
          code: `-- ✅ Use HAVING for aggregate conditions
SELECT city, COUNT(*)
FROM suspects
GROUP BY city
HAVING COUNT(*) > 3;`,
          label: "Fixed: Aggregate in HAVING",
          improvements: [
            "HAVING runs after GROUP BY",
            "COUNT(*) is available at step 4",
            "Query executes correctly",
          ],
        }}
        caption="If your filter uses COUNT, SUM, AVG, MIN, or MAX, it belongs in HAVING."
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 2: Using HAVING when WHERE would work
      </h3>

      <p className="text-gray-700 leading-relaxed mb-4">
        This one does not throw an error. It just runs slower than it should.
      </p>

      <BeforeAfter
        before={{
          code: `-- ⚠️ Works, but inefficient
SELECT city, COUNT(*)
FROM suspects
GROUP BY city
HAVING city = 'Miami';`,
          label: "Slow: Column filter in HAVING",
          issues: [
            "Groups ALL suspects across ALL cities first",
            "Then discards every group except Miami",
            "Wasted work on cities you never needed",
          ],
        }}
        after={{
          code: `-- ✅ Filter early with WHERE
SELECT city, COUNT(*)
FROM suspects
WHERE city = 'Miami'
GROUP BY city;`,
          label: "Fast: Column filter in WHERE",
          improvements: [
            "WHERE eliminates non-Miami rows immediately",
            "GROUP BY processes only Miami suspects",
            "Much faster on large datasets",
          ],
        }}
        caption="If you're filtering on a regular column value (not an aggregate), use WHERE. It's significantly faster."
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 3: Forgetting GROUP BY with HAVING
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- ⚠️ This is valid but rarely useful
SELECT COUNT(*)
FROM suspects
HAVING COUNT(*) > 10;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Without GROUP BY, the entire table is treated as one group. This
          checks if the total suspect count exceeds 10. It works, but it is
          almost never what you want. Add GROUP BY to make HAVING useful.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 4: Column aliases in HAVING (dialect trap)
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Works in MySQL and SQLite:
SELECT city, COUNT(*) AS total
FROM suspects
GROUP BY city
HAVING total > 3;

-- Fails in PostgreSQL and SQL Server:
-- ERROR: column "total" does not exist
-- Use the full expression instead:
HAVING COUNT(*) > 3;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          MySQL and SQLite let you reference SELECT aliases in HAVING.
          PostgreSQL and SQL Server require the full aggregate expression. For
          portable SQL, always use the full expression.
        </p>
      </div>

      <DetectiveTip variant="warning" title="The Performance Trap">
        Using HAVING to filter individual column values (like{" "}
        <code>HAVING city = &apos;Miami&apos;</code>) technically works in most
        databases. But it forces SQL to group ALL rows first, then discard
        groups. WHERE eliminates rows before grouping, which is significantly
        faster on large datasets. When in doubt, prefer WHERE.
      </DetectiveTip>

      {/* ─── Section 7: Decision Guide ─── */}
      <h2
        id="decision-guide"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Decision Guide: WHERE or HAVING?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here is a simple framework. If you can describe your filter without
        using the words &ldquo;total,&rdquo; &ldquo;count,&rdquo;
        &ldquo;average,&rdquo; or &ldquo;sum,&rdquo; you probably want WHERE.
      </p>

      <FlowDiagram
        nodes={[
          {
            label: "Are you using GROUP BY?",
            description: "No → Use WHERE",
            icon: "❓",
            type: "decision",
          },
          {
            label: "Filtering an aggregate?",
            description: "COUNT, SUM, AVG → Use HAVING",
            icon: "📊",
            type: "decision",
          },
          {
            label: "Filtering a regular column?",
            description: "Use WHERE (faster, even with GROUP BY)",
            icon: "✅",
            type: "end",
          },
        ]}
        caption="3-step decision: No GROUP BY → WHERE. Aggregate filter → HAVING. Column filter → WHERE."
      />

      <QuickQuiz
        title="🔍 Test Your WHERE vs HAVING Knowledge"
        questions={[
          {
            question:
              "You need to filter employees where salary is greater than $50,000. Which clause?",
            options: ["WHERE", "HAVING"],
            correctIndex: 0,
            explanation:
              "No aggregation needed. You are filtering individual salaries, so WHERE is correct.",
          },
          {
            question:
              "Show departments with more than 10 employees. Which clause?",
            options: ["WHERE", "HAVING"],
            correctIndex: 1,
            explanation:
              "'More than 10 employees' requires COUNT(). That is an aggregate, so you need HAVING.",
          },
          {
            question:
              "Show orders from 2024 where the customer spent over $1,000 total. Which clause(s)?",
            options: [
              "WHERE only",
              "HAVING only",
              "Both WHERE and HAVING",
            ],
            correctIndex: 2,
            explanation:
              "WHERE filters to 2024 orders (individual rows). HAVING filters customers with SUM(amount) > 1000 (aggregate). You need both.",
          },
          {
            question:
              "Filter cities that start with 'M', then group by city. Which clause for the filter?",
            options: ["WHERE", "HAVING"],
            correctIndex: 0,
            explanation:
              "Even though there is a GROUP BY, the filter is on a regular column value (city LIKE 'M%'), not an aggregate. WHERE is correct and faster.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put WHERE and HAVING into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s 6 detective cases start with basic WHERE filtering and
          scale to complex queries combining JOINs, GROUP BY, and HAVING to
          crack advanced mysteries. Free, browser-based, no signup required for
          beginner cases.
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

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can I use WHERE and HAVING in the same query?
          </h3>
          <p className="text-gray-700">
            Yes, and you should when the situation calls for it. WHERE filters
            rows before grouping, HAVING filters groups after. Using both is the
            most efficient pattern: WHERE reduces the dataset early, then HAVING
            applies aggregate conditions to smaller groups.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What happens if I use HAVING without GROUP BY?
          </h3>
          <p className="text-gray-700">
            Most databases treat the entire result set as one group. So{" "}
            <code>HAVING COUNT(*) &gt; 10</code> without GROUP BY checks if the
            total row count exceeds 10. It works but is rarely useful. You
            almost always want GROUP BY with HAVING.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Why can&apos;t I use COUNT() or SUM() in a WHERE clause?
          </h3>
          <p className="text-gray-700">
            Because WHERE runs before GROUP BY in SQL&apos;s execution order.
            Aggregates like COUNT() and SUM() only exist after grouping. WHERE
            has not seen the groups yet. Use HAVING for aggregate conditions.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Is HAVING slower than WHERE?
          </h3>
          <p className="text-gray-700">
            Generally yes. HAVING processes data after grouping, which requires
            scanning more rows. WHERE eliminates rows early, reducing the
            workload for GROUP BY and HAVING. If you can express a filter with
            WHERE instead of HAVING, WHERE will be faster.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can I use column aliases in HAVING?
          </h3>
          <p className="text-gray-700">
            It depends on your database. MySQL and SQLite allow it (e.g.,{" "}
            <code>HAVING total_count &gt; 5</code>). PostgreSQL and SQL Server
            require the full expression (e.g.,{" "}
            <code>HAVING COUNT(*) &gt; 5</code>). For portability, use the full
            aggregate expression.
          </p>
        </div>
      </div>
    </div>
  );
}
