"use client";

import Link from "next/link";

export default function SqlJoinTypesExplainedContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        JOINs are how you connect tables together. Master these four types and you can investigate entire databases.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#what-are-joins" className="hover:underline">
              What Are SQL Joins? (The Detective&apos;s Perspective)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#inner-join" className="hover:underline">
              INNER JOIN: Finding the Overlap
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
            <a href="#which-join-when" className="hover:underline">
              Which Join Should You Use? (Decision Guide)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#interview-tips" className="hover:underline">
              JOIN Interview Tips That Actually Help
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

      <h2
        id="what-are-joins"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Are SQL Joins? (The Detective&apos;s Perspective)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Imagine you&apos;re a detective with two case files. One lists all the suspects with their IDs and names. The other lists witness interviews, each referencing a suspect by ID. To crack the case, you need to connect these files. Match each interview to its suspect.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        That&apos;s exactly what a JOIN does. It combines rows from two (or more) tables based on a related column, usually an ID that appears in both tables. The type of JOIN you choose determines which rows make it into your final result.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          Our Example Database: The Case Files
        </h4>
        <p className="text-gray-600 mb-4">
          Throughout this guide, we&apos;ll use these two tables from a detective case:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-bold text-amber-800 mb-2">suspects</h5>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`| id | name          |
|----|---------------|
| 1  | Marcus Webb   |
| 2  | Diana Cross   |
| 3  | Victor Stone  |
| 4  | Elena Morris  |`}
            </pre>
          </div>
          <div>
            <h5 className="font-bold text-amber-800 mb-2">interviews</h5>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`| id | suspect_id | statement      |
|----|------------|----------------|
| 1  | 1          | "I was home"   |
| 2  | 2          | "At the bar"   |
| 3  | 5          | "No comment"   |`}
            </pre>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-3">
          Notice: Suspect 3 and 4 have no interviews. Interview 3 references suspect_id 5, who doesn&apos;t exist in our suspects table.
        </p>
      </div>

      <h2
        id="inner-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        INNER JOIN: Finding the Overlap
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The INNER JOIN is the strictest type. It only returns rows where there&apos;s a match in <strong>both</strong> tables. Think of it as finding suspects who have been interviewed. Anyone without an interview (or interviews referencing non-existent suspects) gets dropped.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
        <h4 className="font-bold text-amber-900 mb-3">🔍 Visual Concept: The Venn Diagram</h4>
        <p className="text-gray-700">
          Picture two overlapping circles. The left circle is your suspects table, the right is your interviews table. An <strong>INNER JOIN returns only the overlap</strong>: the shaded center where both circles meet. Suspects without interviews? Gone. Interviews without valid suspects? Gone.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          INNER JOIN Syntax:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement
FROM suspects s
INNER JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name         | statement    |
|--------------|--------------|
| Marcus Webb  | "I was home" |
| Diana Cross  | "At the bar" |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Only 2 rows! Victor Stone and Elena Morris have no interviews. The interview referencing suspect_id 5 has no matching suspect.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">💡 When to Use INNER JOIN</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• You only want records that exist in <strong>both</strong> tables</li>
          <li>• You&apos;re analyzing completed transactions (orders WITH customers)</li>
          <li>• Data integrity is guaranteed, no orphan records</li>
          <li>• Example: &quot;Show me all suspects who have given a statement&quot;</li>
        </ul>
      </div>

      <h2
        id="left-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        LEFT JOIN: Keep Everything From the Left
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The LEFT JOIN (or LEFT OUTER JOIN) returns <strong>all rows from the left table</strong>, plus matching rows from the right. If there&apos;s no match? You still get the left row, but with NULLs for the right table&apos;s columns.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        This is the most common join in data analysis. Why? Because you often want to keep your primary records even when related data is missing. &quot;Show me all suspects, and their interviews if they have any.&quot;
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
        <h4 className="font-bold text-amber-900 mb-3">🔍 Visual Concept</h4>
        <p className="text-gray-700">
          Same Venn diagram, but now you take the <strong>entire left circle</strong> plus the overlap. The right circle&apos;s non-overlapping part is excluded.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          LEFT JOIN Syntax:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | statement    |
|---------------|--------------|
| Marcus Webb   | "I was home" |
| Diana Cross   | "At the bar" |
| Victor Stone  | NULL         |
| Elena Morris  | NULL         |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          All 4 suspects appear. Victor and Elena have NULL statements because they weren&apos;t interviewed.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          🎯 Pro Move: Finding Missing Records
        </h4>
        <p className="text-gray-600 mb-3">
          LEFT JOIN + WHERE IS NULL is a powerful pattern for finding records <em>without</em> matches:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name
FROM suspects s
LEFT JOIN interviews i ON s.id = i.suspect_id
WHERE i.id IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Result:</strong> Victor Stone, Elena Morris. Suspects who haven&apos;t been interviewed yet. This pattern is essential for finding gaps in your data.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">💡 When to Use LEFT JOIN</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• You want <strong>all</strong> records from your primary table</li>
          <li>• Finding records WITHOUT matches (customers who never ordered)</li>
          <li>• Optional relationships: not every suspect has an interview</li>
          <li>• Most common join in analytics and reporting</li>
        </ul>
      </div>

      <h2
        id="right-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        RIGHT JOIN: The Mirror Image
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The RIGHT JOIN is the mirror of LEFT JOIN. It returns <strong>all rows from the right table</strong>, plus matching rows from the left. If there&apos;s no match, you get NULLs for the left table&apos;s columns.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s a secret: experienced SQL developers rarely use RIGHT JOIN. Why? Because you can always rewrite it as a LEFT JOIN by swapping the table order. LEFT JOIN is more intuitive (we read left-to-right), so it&apos;s the convention.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          RIGHT JOIN Syntax:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement
FROM suspects s
RIGHT JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name         | statement     |
|--------------|---------------|
| Marcus Webb  | "I was home"  |
| Diana Cross  | "At the bar"  |
| NULL         | "No comment"  |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          All interviews appear. The third interview has NULL for name because suspect_id 5 doesn&apos;t exist in our suspects table.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">💡 Pro Tip: Convert to LEFT JOIN</h4>
        <p className="text-gray-700 mb-3">
          These two queries produce identical results:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- RIGHT JOIN
SELECT s.name, i.statement
FROM suspects s
RIGHT JOIN interviews i ON s.id = i.suspect_id;

-- Equivalent LEFT JOIN (preferred)
SELECT s.name, i.statement
FROM interviews i
LEFT JOIN suspects s ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-700 text-sm mt-2">
          Most teams standardize on LEFT JOIN for consistency. Know RIGHT JOIN exists, but prefer LEFT JOIN in practice.
        </p>
      </div>

      <h2
        id="full-outer-join"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        FULL OUTER JOIN: The Complete Picture
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The FULL OUTER JOIN returns <strong>all rows from both tables</strong>. Where there&apos;s a match, you get combined data. Where there isn&apos;t? You get the row anyway, with NULLs filling in the missing side.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
        <h4 className="font-bold text-amber-900 mb-3">🔍 Visual Concept</h4>
        <p className="text-gray-700">
          You take <strong>both entire circles</strong> of the Venn diagram. Everything is included: the overlap, the left-only portion, and the right-only portion.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          FULL OUTER JOIN Syntax:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT s.name, i.statement
FROM suspects s
FULL OUTER JOIN interviews i ON s.id = i.suspect_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-3">
          <strong>Result:</strong>
        </p>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mt-2">
{`| name          | statement     |
|---------------|---------------|
| Marcus Webb   | "I was home"  |
| Diana Cross   | "At the bar"  |
| Victor Stone  | NULL          |
| Elena Morris  | NULL          |
| NULL          | "No comment"  |`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          5 rows! All suspects (including those without interviews) AND all interviews (including the orphaned one).
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-red-900 mb-3">⚠️ MySQL Doesn&apos;t Support FULL OUTER JOIN</h4>
        <p className="text-gray-700 mb-3">
          If you&apos;re using MySQL, you&apos;ll need to simulate it with UNION:
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
        <h4 className="font-bold text-blue-900 mb-3">💡 When to Use FULL OUTER JOIN</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Data reconciliation: comparing two data sources</li>
          <li>• Finding ALL mismatches in either direction</li>
          <li>• Data quality audits</li>
          <li>• Less common than LEFT JOIN, but powerful when needed</li>
        </ul>
      </div>

      <h2
        id="which-join-when"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Which Join Should You Use? (Decision Guide)
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Join Type</th>
              <th className="border border-gray-300 p-3 text-left">Returns</th>
              <th className="border border-gray-300 p-3 text-left">Use When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">INNER JOIN</td>
              <td className="border border-gray-300 p-3">Only matching rows</td>
              <td className="border border-gray-300 p-3">You need complete records from both tables</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">LEFT JOIN</td>
              <td className="border border-gray-300 p-3">All left + matching right</td>
              <td className="border border-gray-300 p-3">Keep primary table intact, add optional data</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">RIGHT JOIN</td>
              <td className="border border-gray-300 p-3">All right + matching left</td>
              <td className="border border-gray-300 p-3">Rarely. Use LEFT JOIN instead</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">FULL OUTER</td>
              <td className="border border-gray-300 p-3">Everything from both</td>
              <td className="border border-gray-300 p-3">Data reconciliation, finding all gaps</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">🎯 The 80/20 Rule</h4>
        <p className="text-gray-700">
          In real-world data analysis, you&apos;ll use <strong>LEFT JOIN about 80% of the time</strong>. INNER JOIN covers most of the rest. FULL OUTER JOIN is rare but essential when you need it. RIGHT JOIN? Almost never. Just flip your tables and use LEFT JOIN.
        </p>
      </div>

      <div className="bg-amber-100 border border-amber-300 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">🔍 Practice These Patterns</h4>
        <p className="text-gray-700 mb-4">
          Want to practice JOINs on realistic data? <a href="https://www.sqlnoir.com" className="text-amber-900 underline hover:text-amber-700 font-bold">SQL Noir</a> cases are built around multi-table databases: suspects, evidence, interviews, locations. Every case requires JOINs to solve. It&apos;s free and runs in your browser.
        </p>
        <a
          href="https://www.sqlnoir.com"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
        >
          Start Investigating →
        </a>
      </div>

      <h2
        id="interview-tips"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        JOIN Interview Tips That Actually Help
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs are a staple in SQL interviews. Here&apos;s what interviewers actually look for, beyond just knowing the syntax.
      </p>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">1. Explain Your Choice</h4>
          <p className="text-gray-700">
            Don&apos;t just write a JOIN. Explain <em>why</em> you chose that type. &quot;I&apos;m using a LEFT JOIN because we want all customers, even those without orders.&quot; This shows you understand the business logic, not just the syntax.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">2. Ask About NULLs</h4>
          <p className="text-gray-700">
            Before writing any JOIN, ask: &quot;Should I include records that don&apos;t have a match?&quot; This clarifies whether you need INNER or LEFT JOIN. Interviewers love this question. It shows you think about edge cases.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">3. Know the LEFT JOIN + IS NULL Pattern</h4>
          <p className="text-gray-700">
            &quot;Find users who have never made a purchase&quot; is a classic interview question. The answer is LEFT JOIN + WHERE IS NULL. Know this pattern cold.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">4. Watch for Duplicates</h4>
          <p className="text-gray-700">
            If one table has multiple matches per row in the other, your result set expands. Always mention this in interviews: &quot;If a customer has multiple orders, they&apos;ll appear multiple times in the output.&quot;
          </p>
        </div>
      </div>

      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-2">What&apos;s the difference between LEFT JOIN and INNER JOIN?</h4>
          <p className="text-gray-700">INNER JOIN only returns rows with matches in both tables. LEFT JOIN returns ALL rows from the left table, plus matches from the right. It fills in NULLs where there&apos;s no match. Use LEFT JOIN when you want to preserve your primary table&apos;s records.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Is LEFT JOIN the same as LEFT OUTER JOIN?</h4>
          <p className="text-gray-700">Yes, they&apos;re identical. The &quot;OUTER&quot; keyword is optional. Most developers write LEFT JOIN for brevity, but LEFT OUTER JOIN works in all databases.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Why would I ever use RIGHT JOIN?</h4>
          <p className="text-gray-700">Honestly? Almost never. Any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the table order. LEFT JOIN is the convention because it&apos;s more intuitive. Know RIGHT JOIN exists, but prefer LEFT JOIN in practice.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Can I JOIN more than two tables?</h4>
          <p className="text-gray-700">Absolutely. Chain multiple JOINs together: <code>FROM a JOIN b ON ... JOIN c ON ...</code>. Each JOIN connects to the result of the previous ones. Real-world queries often join 4-5+ tables.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">What happens if my JOIN condition matches multiple rows?</h4>
          <p className="text-gray-700">You get multiple output rows, one for each match combination. If customer 1 has 3 orders, a JOIN produces 3 rows for that customer. This is called &quot;row explosion&quot; and it&apos;s important to understand for aggregations.</p>
        </div>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Start Joining Tables Today
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs unlock the real power of relational databases. Once you can connect tables, you can answer questions that span your entire data model. Not just single-table queries. It&apos;s the difference between looking at isolated clues and seeing the full investigation board.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Start with LEFT JOIN. It&apos;s the most useful and forgiving. Get comfortable with INNER JOIN for when you need strict matches. And remember: you can always visualize it as a Venn diagram.
      </p>

      <div className="bg-amber-100 border border-amber-300 rounded-lg p-6 mt-8">
        <h4 className="font-bold text-amber-900 mb-3">🔍 Ready to Practice?</h4>
        <p className="text-gray-700 mb-4">
          The best way to master JOINs is to use them on real data. <a href="https://www.sqlnoir.com" className="text-amber-900 underline hover:text-amber-700 font-bold">SQL Noir</a> gives you detective cases with multi-table databases: suspects, evidence, alibis, locations. Every case requires JOINs to crack. It&apos;s free, no setup required, and way more engaging than textbook exercises.
        </p>
        <a
          href="https://www.sqlnoir.com"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
        >
          Start Solving Cases →
        </a>
      </div>
    </div>
  );
}
