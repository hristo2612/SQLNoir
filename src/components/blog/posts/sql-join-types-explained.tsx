"use client";

import Link from "next/link";
import {
  VennDiagram,
  EntityRelationship,
  ComparisonTable,
  FlowDiagram,
} from "@/components/blog/diagrams";

export default function SqlJoinTypesExplainedContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        JOINs connect tables. Master these six types and you can query any
        relational database. Here is every SQL JOIN type with visual diagrams,
        real examples, and the practical patterns that most tutorials skip.
      </p>

      {/* Quick Navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#what-are-joins" className="hover:underline">
              What Are SQL Joins?
            </a>
          </li>
          <li>
            •{" "}
            <a href="#inner-join" className="hover:underline">
              INNER JOIN: Only the Matches
            </a>
          </li>
          <li>
            •{" "}
            <a href="#left-join" className="hover:underline">
              LEFT JOIN: Keep Everything From the Left
            </a>
          </li>
          <li>
            •{" "}
            <a href="#right-join" className="hover:underline">
              RIGHT JOIN: The Mirror Image
            </a>
          </li>
          <li>
            •{" "}
            <a href="#full-outer-join" className="hover:underline">
              FULL OUTER JOIN: The Complete Picture
            </a>
          </li>
          <li>
            •{" "}
            <a href="#cross-join" className="hover:underline">
              CROSS JOIN: Every Possible Combination
            </a>
          </li>
          <li>
            •{" "}
            <a href="#self-join" className="hover:underline">
              SELF JOIN: A Table Joins Itself
            </a>
          </li>
          <li>
            •{" "}
            <a href="#which-join-when" className="hover:underline">
              Which Join Should You Use? (Decision Guide)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#join-pitfalls" className="hover:underline">
              Common JOIN Pitfalls
            </a>
          </li>
          <li>
            •{" "}
            <a href="#join-performance" className="hover:underline">
              JOIN Performance Tips
            </a>
          </li>
          <li>
            •{" "}
            <a href="#multi-table-joins" className="hover:underline">
              Multi-Table JOINs: Chaining 3+ Tables
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

      {/* ================================================================== */}
      {/* SECTION 1: What Are SQL Joins? */}
      {/* ================================================================== */}
      <h2
        id="what-are-joins"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Are SQL Joins?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Imagine you are a detective with two case files. One lists all the
        suspects with their IDs and names. The other logs every interview,
        each referencing a suspect by ID. To crack the case, you need to
        connect these files and match each interview to its suspect.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        That is exactly what a JOIN does. It combines rows from two or more
        tables based on a related column (usually an ID that appears in both
        tables). The type of JOIN you choose determines which rows make it
        into your result.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL has six join types: INNER, LEFT, RIGHT, FULL OUTER, CROSS, and
        SELF. We will cover every one of them with diagrams, code, and results.
      </p>

      <EntityRelationship
        tables={[
          {
            name: "suspects",
            columns: ["id", "name", "role"],
            primaryKey: "id",
          },
          {
            name: "interviews",
            columns: ["id", "suspect_id", "statement", "date"],
            primaryKey: "id",
          },
        ]}
        relations={[
          {
            from: "suspects",
            to: "interviews",
            fromColumn: "id",
            toColumn: "suspect_id",
            label: "has",
            type: "1:N",
          },
        ]}
        caption="Our case files: suspects table linked to interviews table via suspect_id"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          Our Example Data
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-bold text-amber-800 mb-2">suspects</h5>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`| id | name          | role       |
|----|---------------|------------|
| 1  | Marcus Webb   | Manager    |
| 2  | Diana Cross   | Accountant |
| 3  | Victor Stone  | Security   |
| 4  | Elena Morris  | Intern     |`}
            </pre>
          </div>
          <div>
            <h5 className="font-bold text-amber-800 mb-2">interviews</h5>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`| id | suspect_id | statement      | date       |
|----|------------|----------------|------------|
| 1  | 1          | "I was home"   | 2026-01-15 |
| 2  | 2          | "At the bar"   | 2026-01-16 |
| 3  | 5          | "No comment"   | 2026-01-17 |`}
            </pre>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-3">
          Notice: Suspects 3 and 4 have no interviews. Interview 3 references
          suspect_id 5, who does not exist in our suspects table.
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 2: INNER JOIN */}
      {/* ================================================================== */}
      <h2
        id="inner-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        INNER JOIN: Only the Matches
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        INNER JOIN is the strictest type. It only returns rows where there is
        a match in <strong>both</strong> tables. Suspects without interviews
        are dropped. Interviews referencing non-existent suspects are dropped.
        Only the overlap survives.
      </p>

      <VennDiagram
        leftLabel="suspects"
        rightLabel="interviews"
        leftOnly="No interview"
        rightOnly="No suspect"
        overlap="Matched rows"
        highlightArea="overlap"
        caption="INNER JOIN returns only the overlapping center"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, s.role, i.statement
FROM suspects s
INNER JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name         | role       | statement    |
|--------------|------------|--------------|
| Marcus Webb  | Manager    | "I was home" |
| Diana Cross  | Accountant | "At the bar" |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Only 2 rows. Victor Stone and Elena Morris have no interviews.
          The interview referencing suspect_id 5 has no matching suspect.
          All three are excluded.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-blue-900 mb-3">
          💡 Quick tip
        </h4>
        <p className="text-gray-700">
          Writing <code>JOIN</code> without a keyword defaults to INNER JOIN.
          So <code>FROM suspects s JOIN interviews i ON ...</code> and{" "}
          <code>FROM suspects s INNER JOIN interviews i ON ...</code> produce
          identical results.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">
          💡 When to use INNER JOIN
        </h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • You only want records that exist in{" "}
            <strong>both</strong> tables
          </li>
          <li>
            • You are analyzing completed transactions (orders WITH
            customers)
          </li>
          <li>• Data integrity is guaranteed, no orphan records</li>
          <li>
            • Example: &quot;Show me all suspects who have given a
            statement&quot;
          </li>
        </ul>
      </div>

      {/* ================================================================== */}
      {/* SECTION 3: LEFT JOIN */}
      {/* ================================================================== */}
      <h2
        id="left-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        LEFT JOIN: Keep Everything From the Left
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        LEFT JOIN returns <strong>all rows from the left table</strong>, plus
        matching rows from the right. If there is no match, the right side
        fills with NULLs. This is the most common join in data analysis
        because you usually want to preserve your primary records even when
        related data is missing.
      </p>

      <VennDiagram
        leftLabel="suspects"
        rightLabel="interviews"
        leftOnly="NULL filled"
        rightOnly="Excluded"
        overlap="Matched"
        highlightArea="left"
        caption="LEFT JOIN returns the entire left circle plus the overlap"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, s.role, i.statement
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | role       | statement    |
|---------------|------------|--------------|
| Marcus Webb   | Manager    | "I was home" |
| Diana Cross   | Accountant | "At the bar" |
| Victor Stone  | Security   | NULL         |
| Elena Morris  | Intern     | NULL         |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          All 4 suspects appear. Victor and Elena have NULL statements
          because they were never interviewed. LEFT JOIN = LEFT OUTER JOIN
          (the OUTER keyword is optional).
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          🎯 Pro Move: Finding Missing Records
        </h4>
        <p className="text-gray-600 mb-3">
          LEFT JOIN + WHERE IS NULL is a powerful pattern for finding records{" "}
          <em>without</em> matches:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Find suspects who have NOT been interviewed
SELECT s.name, s.role
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id
WHERE i.id IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | role     |
|---------------|----------|
| Victor Stone  | Security |
| Elena Morris  | Intern   |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Two suspects still need interviews. This pattern is essential for
          finding gaps in your data: customers who never ordered, users who
          never logged in, products that never sold.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 1 (soft inline) */}
      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice INNER JOIN and LEFT JOIN hands-on,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        require you to JOIN multiple tables to solve crimes: suspects with
        interviews, witnesses with crime scenes, hotel check-ins with
        surveillance records. Each case has 3-7 related tables that need
        JOINs to crack.
      </p>

      {/* ================================================================== */}
      {/* SECTION 4: RIGHT JOIN */}
      {/* ================================================================== */}
      <h2
        id="right-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        RIGHT JOIN: The Mirror Image
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        RIGHT JOIN is the mirror of LEFT JOIN. It returns{" "}
        <strong>all rows from the right table</strong>, plus matching rows
        from the left. No match? NULLs fill the left side.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here is a secret: experienced SQL developers rarely use RIGHT JOIN.
        You can always rewrite it as a LEFT JOIN by swapping the table order.
        LEFT JOIN is more intuitive (we read left to right), so it is the
        convention.
      </p>

      <VennDiagram
        leftLabel="suspects"
        rightLabel="interviews"
        leftOnly="Excluded"
        rightOnly="NULL filled"
        overlap="Matched"
        highlightArea="right"
        caption="RIGHT JOIN returns the entire right circle plus the overlap"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement, i.date
FROM suspects s
RIGHT JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name         | statement     | date       |
|--------------|---------------|------------|
| Marcus Webb  | "I was home"  | 2026-01-15 |
| Diana Cross  | "At the bar"  | 2026-01-16 |
| NULL         | "No comment"  | 2026-01-17 |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          All 3 interviews appear. The third interview has NULL for name
          because suspect_id 5 does not exist in our suspects table.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          💡 Convert to LEFT JOIN
        </h4>
        <p className="text-gray-700 mb-3">
          These two queries produce identical results:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- RIGHT JOIN version
SELECT s.name, i.statement
FROM suspects s
RIGHT JOIN interviews i ON s.id = i.suspect_id;

-- Equivalent LEFT JOIN (preferred)
SELECT s.name, i.statement
FROM interviews i
LEFT JOIN suspects s ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-700 text-sm mt-2">
          Most teams standardize on LEFT JOIN for consistency. Know RIGHT JOIN
          exists, but prefer LEFT JOIN in practice.
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 5: FULL OUTER JOIN */}
      {/* ================================================================== */}
      <h2
        id="full-outer-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FULL OUTER JOIN: The Complete Picture
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        FULL OUTER JOIN returns <strong>all rows from both tables</strong>.
        Where there is a match, you get combined data. Where there is not,
        NULLs fill the missing side. Think of it as covering the entire Venn
        diagram.
      </p>

      <VennDiagram
        leftLabel="suspects"
        rightLabel="interviews"
        leftOnly="NULL right"
        rightOnly="NULL left"
        overlap="Matched"
        highlightArea="all"
        caption="FULL OUTER JOIN returns everything from both circles"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, s.role, i.statement
FROM suspects s
FULL OUTER JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | role       | statement     |
|---------------|------------|---------------|
| Marcus Webb   | Manager    | "I was home"  |
| Diana Cross   | Accountant | "At the bar"  |
| Victor Stone  | Security   | NULL          |
| Elena Morris  | Intern     | NULL          |
| NULL          | NULL       | "No comment"  |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          5 rows. All suspects (including those without interviews) AND all
          interviews (including the orphaned one referencing suspect_id 5).
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-red-900 mb-3">
          ⚠️ MySQL Does Not Support FULL OUTER JOIN
        </h4>
        <p className="text-gray-700 mb-3">
          If you use MySQL, simulate it with a UNION of LEFT and RIGHT JOINs:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id

UNION

SELECT s.name, i.statement
FROM suspects s
RIGHT JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-700 text-sm mt-2">
          PostgreSQL, SQL Server, and Oracle support FULL OUTER JOIN natively.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">
          💡 When to use FULL OUTER JOIN
        </h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Data reconciliation: comparing two data sources</li>
          <li>• Finding ALL mismatches in either direction</li>
          <li>• Data quality audits</li>
          <li>
            • Less common than LEFT JOIN, but powerful when you need the
            complete picture
          </li>
        </ul>
      </div>

      {/* ================================================================== */}
      {/* SECTION 6: CROSS JOIN */}
      {/* ================================================================== */}
      <h2
        id="cross-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        CROSS JOIN: Every Possible Combination
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        CROSS JOIN produces a <strong>Cartesian product</strong>: every row
        from table A paired with every row from table B. There is no ON clause
        because there is no matching condition.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Imagine you need to check every suspect against every crime scene
        location. With 4 suspects and 3 locations, you get 4 x 3 = 12
        rows.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, l.location_name
FROM suspects s
CROSS JOIN locations l;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result (12 rows):</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | location_name    |
|---------------|------------------|
| Marcus Webb   | Blue Note Lounge |
| Marcus Webb   | Parking Garage   |
| Marcus Webb   | Office 4B        |
| Diana Cross   | Blue Note Lounge |
| Diana Cross   | Parking Garage   |
| Diana Cross   | Office 4B        |
| Victor Stone  | Blue Note Lounge |
| Victor Stone  | Parking Garage   |
| Victor Stone  | Office 4B        |
| Elena Morris  | Blue Note Lounge |
| Elena Morris  | Parking Garage   |
| Elena Morris  | Office 4B        |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Every suspect paired with every location. Useful for generating
          combinations, test data, or date/dimension scaffolds.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-red-900 mb-3">
          ⚠️ Watch the row count
        </h4>
        <p className="text-gray-700">
          CROSS JOIN result size = rows in A × rows in B. With small tables,
          that is fine. But 1,000 rows × 1,000 rows = 1 million result rows.
          10,000 × 10,000 = 100 million. Always check your table sizes before
          running a CROSS JOIN on production data.
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 7: SELF JOIN */}
      {/* ================================================================== */}
      <h2
        id="self-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SELF JOIN: A Table Joins Itself
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A SELF JOIN is a table joined to itself using different aliases. It is
        not a separate keyword. You use INNER JOIN or LEFT JOIN on the same
        table. This is essential for hierarchical data: employee/manager
        relationships, category/subcategory trees, or referral chains.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        In our detective case, suppose each suspect has an{" "}
        <code>associate_id</code> pointing to another suspect in the same
        table. We want to find who knows who.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Updated suspects table:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`| id | name          | role       | associate_id |
|----|---------------|------------|--------------|
| 1  | Marcus Webb   | Manager    | 2            |
| 2  | Diana Cross   | Accountant | NULL         |
| 3  | Victor Stone  | Security   | 1            |
| 4  | Elena Morris  | Intern     | 3            |`}
        </pre>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT
  s1.name AS suspect,
  s2.name AS known_associate
FROM suspects s1
LEFT JOIN suspects s2 ON s1.associate_id = s2.id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| suspect        | known_associate |
|----------------|-----------------|
| Marcus Webb    | Diana Cross     |
| Diana Cross    | NULL            |
| Victor Stone   | Marcus Webb     |
| Elena Morris   | Victor Stone    |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The key is aliases: <code>s1</code> and <code>s2</code> let the
          database treat the same table as two separate tables. Marcus knows
          Diana. Victor knows Marcus. Diana has no known associate (NULL).
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          💡 Common SELF JOIN patterns
        </h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • <strong>Employee/Manager:</strong> Find each employee and their
            manager name from the same employees table
          </li>
          <li>
            • <strong>Referral chains:</strong> Which user referred which other
            user
          </li>
          <li>
            • <strong>Hierarchy traversal:</strong> Categories and
            subcategories in one table
          </li>
        </ul>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Want to practice JOINs on real multi-table databases?
          </p>
          <p className="text-amber-700 text-sm">
            SQLNoir&apos;s 6 detective cases give you real multi-table crime
            databases. Write INNER JOINs to match suspects with interviews,
            LEFT JOINs to find witnesses without statements, and complex joins
            across crime_scene, surveillance_records, and hotel_checkins
            tables. Every query brings you closer to solving the case.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      {/* ================================================================== */}
      {/* SECTION 8: Which Join Should You Use? */}
      {/* ================================================================== */}
      <h2
        id="which-join-when"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Which Join Should You Use? (Decision Guide)
      </h2>

      <ComparisonTable
        headers={["Join Type", "Returns", "Use When", "NULLs?"]}
        rows={[
          [
            "INNER JOIN",
            "Only matching rows",
            "You need complete records from both tables",
            "Never",
          ],
          [
            "LEFT JOIN",
            "All left + matching right",
            "Keep primary table intact, add optional data",
            "Right side",
          ],
          [
            "RIGHT JOIN",
            "All right + matching left",
            "Rarely. Use LEFT JOIN instead",
            "Left side",
          ],
          [
            "FULL OUTER",
            "Everything from both",
            "Data reconciliation, finding all gaps",
            "Both sides",
          ],
          [
            "CROSS JOIN",
            "Every combination (A × B)",
            "Generate combinations, test data",
            "Never",
          ],
          [
            "SELF JOIN",
            "Rows matched within same table",
            "Hierarchies, referral chains",
            "Depends on join type used",
          ],
        ]}
        caption="All 6 SQL join types at a glance"
      />

      <FlowDiagram
        nodes={[
          {
            label: "Need data from multiple tables?",
            type: "start",
            icon: "🔍",
          },
          {
            label: "Need ALL rows from both tables?",
            type: "decision",
            icon: "🤔",
          },
          {
            label: "Use FULL OUTER JOIN",
            type: "end",
            icon: "🔄",
            description: "Returns everything, NULLs fill gaps",
          },
          {
            label: "Need ALL rows from one table?",
            type: "decision",
            icon: "🤔",
          },
          {
            label: "Use LEFT JOIN",
            type: "end",
            icon: "⬅️",
            description: "Keep primary table complete",
          },
          {
            label: "Need every combination?",
            type: "decision",
            icon: "🤔",
          },
          {
            label: "Use CROSS JOIN",
            type: "end",
            icon: "✖️",
            description: "Cartesian product (careful with large tables)",
          },
          {
            label: "Joining table to itself?",
            type: "decision",
            icon: "🤔",
          },
          {
            label: "Use SELF JOIN",
            type: "end",
            icon: "🔁",
            description: "Same table, different aliases",
          },
          {
            label: "Use INNER JOIN",
            type: "end",
            icon: "🎯",
            description: "Only matching rows (most efficient)",
          },
        ]}
        caption="Follow this decision tree to pick the right JOIN type"
      />

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">🎯 The 80/20 Rule</h4>
        <p className="text-gray-700">
          In real-world data work, you will use{" "}
          <strong>LEFT JOIN about 80% of the time</strong>. INNER JOIN covers
          most of the rest (~15%). FULL OUTER, CROSS, and SELF JOIN account
          for the remaining ~5%. RIGHT JOIN? Almost never. Just flip your
          tables and use LEFT JOIN.
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 9: Common JOIN Pitfalls */}
      {/* ================================================================== */}
      <h2
        id="join-pitfalls"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common JOIN Pitfalls (And How to Avoid Them)
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-red-900 mb-2">
            Pitfall 1: Row Explosion (Duplicate Rows)
          </h4>
          <p className="text-gray-700 mb-3">
            When one side has multiple matches, result rows multiply. If
            suspect Marcus Webb has 3 clues in a clues table, an INNER JOIN
            produces 3 rows for Marcus, not 1.
          </p>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- This produces 3 rows for Marcus if he has 3 clues
SELECT s.name, c.description
FROM suspects s
INNER JOIN clues c ON s.id = c.suspect_id;

-- To count suspects correctly, use DISTINCT
SELECT COUNT(DISTINCT s.id) AS unique_suspects
FROM suspects s
INNER JOIN clues c ON s.id = c.suspect_id;`}
          </pre>
          <p className="text-gray-600 text-sm mt-2">
            Always check: did your JOIN multiply your rows? Use{" "}
            <code>COUNT(DISTINCT)</code> for accurate aggregations after JOINs.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-red-900 mb-2">
            Pitfall 2: NULL Behavior in JOINs
          </h4>
          <p className="text-gray-700">
            NULLs never equal anything, including other NULLs. So if your join
            key has NULL values, those rows are silently dropped in INNER JOINs.
            If you are joining on a column that might contain NULLs, use{" "}
            <code>COALESCE()</code> to provide a fallback or use{" "}
            <code>IS NOT DISTINCT FROM</code> (PostgreSQL) to treat NULLs as
            matching.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-red-900 mb-2">
            Pitfall 3: Accidental CROSS JOIN
          </h4>
          <p className="text-gray-700">
            Forgetting the ON clause turns your join into a Cartesian product.
            If you write{" "}
            <code>FROM suspects s, interviews i</code> without a WHERE clause,
            you get every suspect paired with every interview. Always
            double-check your ON conditions.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-bold text-red-900 mb-2">
            Pitfall 4: Joining on the Wrong Column
          </h4>
          <p className="text-gray-700">
            Two columns named <code>id</code> in different tables often
            represent completely different things. Always use explicit table
            aliases (<code>s.id</code>, <code>i.suspect_id</code>) and verify
            your ON clause connects the right columns. A mismatched join
            silently returns incorrect data.
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* SECTION 10: JOIN Performance Tips */}
      {/* ================================================================== */}
      <h2
        id="join-performance"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        JOIN Performance Tips
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">
            1. Index Your JOIN Columns
          </h4>
          <p className="text-gray-700">
            Foreign keys should always have indexes. Without them, the database
            scans the entire table for each match. Add an index on{" "}
            <code>interviews.suspect_id</code> and your JOINs get dramatically
            faster.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">
            2. Filter Early With WHERE
          </h4>
          <p className="text-gray-700">
            Apply WHERE conditions to reduce row count before joining when
            possible. Joining 1 million rows and then filtering is slower than
            filtering first and then joining the remaining rows.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">
            3. Prefer INNER JOIN When You Can
          </h4>
          <p className="text-gray-700">
            INNER JOIN is typically faster than LEFT JOIN because the database
            can discard non-matching rows earlier. Only use LEFT JOIN when you
            actually need to preserve unmatched rows.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">
            4. Select Only the Columns You Need
          </h4>
          <p className="text-gray-700">
            <code>SELECT *</code> across joined tables pulls every column from
            every table. That can be surprisingly expensive in memory and I/O.
            List only the columns you actually need.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">
            5. Check Row Counts Before CROSS JOIN
          </h4>
          <p className="text-gray-700">
            Always run <code>SELECT COUNT(*) FROM table</code> on both tables
            before executing a CROSS JOIN. Multiply the numbers. If the
            result is more than you expected, reconsider.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          Slow vs. Optimized Query:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Slow: SELECT *, no early filter
SELECT *
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id;

-- Faster: specific columns, early filter
SELECT s.name, i.statement
FROM suspects s
INNER JOIN interviews i ON s.id = i.suspect_id
WHERE i.date >= '2026-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The optimized version fetches fewer columns, uses INNER JOIN
          (stricter), and filters by date to reduce the working set.
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 11: Multi-Table JOINs */}
      {/* ================================================================== */}
      <h2
        id="multi-table-joins"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Multi-Table JOINs: Chaining 3+ Tables
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Real queries often join 3, 4, or even 5+ tables together. Each JOIN
        connects to the result of the previous one. Think of it as building a
        pipeline: start with your main table, then add related data one join
        at a time.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Chaining 3 tables:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT
  s.name,
  i.statement,
  l.location_name
FROM suspects s
INNER JOIN interviews i ON s.id = i.suspect_id
LEFT JOIN locations l ON i.location_id = l.id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name         | statement    | location_name    |
|--------------|--------------|------------------|
| Marcus Webb  | "I was home" | Blue Note Lounge |
| Diana Cross  | "At the bar" | NULL             |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The INNER JOIN filters to suspects with interviews. The LEFT JOIN
          adds location data where available. Diana&apos;s interview has no
          location_id, so location_name is NULL.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          💡 Reading multi-table JOINs
        </h4>
        <p className="text-gray-700">
          Read multi-table JOINs top to bottom. Start from the FROM table
          (your main dataset), then each JOIN adds one more layer of related
          data. You can mix join types: INNER JOIN for required relationships,
          LEFT JOIN for optional ones.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put your JOIN skills into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s 6 detective cases require multi-table JOINs: connect
          suspects with witness_statements, cross-reference hotel_checkins
          with surveillance_records, link employee_records with
          keycard_access_logs. Each case has 3-7 related tables. Practice
          INNER JOINs, LEFT JOINs, and multi-table queries while solving
          crimes.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ================================================================== */}
      {/* SECTION 12: FAQ */}
      {/* ================================================================== */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            What&apos;s the difference between LEFT JOIN and INNER JOIN?
          </h4>
          <p className="text-gray-700">
            INNER JOIN only returns rows with matches in both tables. LEFT JOIN
            returns ALL rows from the left table, plus matches from the right.
            NULLs fill where there is no match. Use LEFT JOIN when you want to
            preserve your primary table&apos;s records even when related data
            is missing.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Is LEFT JOIN the same as LEFT OUTER JOIN?
          </h4>
          <p className="text-gray-700">
            Yes, identical. The OUTER keyword is optional. Most developers
            write LEFT JOIN for brevity, but LEFT OUTER JOIN works in every
            database.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Why should I avoid RIGHT JOIN?
          </h4>
          <p className="text-gray-700">
            Any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the
            table order. LEFT JOIN is more intuitive (we read left to right)
            and is the convention across most codebases. Know RIGHT JOIN
            exists, but prefer LEFT JOIN in practice.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Can I JOIN more than two tables?
          </h4>
          <p className="text-gray-700">
            Yes. Chain multiple JOINs together:{" "}
            <code>FROM a JOIN b ON ... JOIN c ON ...</code>. Each JOIN
            connects to the result of the previous ones. Real-world queries
            often join 4-5+ tables.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            What happens if my JOIN condition matches multiple rows?
          </h4>
          <p className="text-gray-700">
            You get multiple output rows, one for each match combination. If
            suspect 1 has 3 interviews, a JOIN produces 3 rows for that
            suspect. This is called &quot;row explosion&quot; and is important
            to understand when using aggregation functions like COUNT or SUM.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            What is CROSS JOIN used for?
          </h4>
          <p className="text-gray-700">
            CROSS JOIN produces every possible combination of rows from two
            tables (Cartesian product). It is useful for generating test data,
            size × color product combinations, or date scaffolds. Use it
            carefully because result size = table A rows × table B rows.
          </p>
        </div>
      </div>

      {/* Closing */}
      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Start Joining Tables Today
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs unlock the real power of relational databases. Once you can
        connect tables, you move from isolated single-table queries to
        questions that span your entire data model. Start with LEFT JOIN (the
        most common). Get comfortable with INNER JOIN for strict matches.
        Learn CROSS and SELF JOIN for the edge cases. And remember: when in
        doubt, draw the Venn diagram.
      </p>
    </div>
  );
}
