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

export default function ClusteredVsNonclusteredIndex() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Quick Navigation */}
      <div className="not-prose my-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3">Quick Navigation</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { text: "Quick Answer", id: "quick-answer" },
            { text: "Clustered Index", id: "clustered-index" },
            { text: "Nonclustered Index", id: "nonclustered-index" },
            { text: "Visual Comparison", id: "visual-comparison" },
            { text: "When to Use Clustered", id: "when-clustered" },
            { text: "When to Use Nonclustered", id: "when-nonclustered" },
            { text: "Decision Guide", id: "decision-guide" },
            { text: "Common Mistakes", id: "common-mistakes" },
            { text: "Interview Questions", id: "interview-questions" },
            { text: "FAQ", id: "faq" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full text-sm transition-colors"
            >
              {item.text}
            </a>
          ))}
        </div>
      </div>

      {/* Intro */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Indexes are the secret weapon for fast SQL queries. But choosing the wrong type can make your database slower, not faster. Let&apos;s break down clustered vs nonclustered indexes with visual examples so you&apos;ll know exactly when to use each.
      </p>

      {/* Quick Answer */}
      <h2
        id="quick-answer"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Answer: Clustered vs Nonclustered Index
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the TL;DR:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>
          <strong>Clustered index:</strong> Data is physically sorted by the index column (like a phone book sorted by name)
        </li>
        <li>
          <strong>Nonclustered index:</strong> A separate structure pointing to data (like a library card catalog)
        </li>
        <li>
          <strong>Key difference:</strong> One clustered index per table vs up to 999 nonclustered indexes
        </li>
        <li>
          <strong>When to use which:</strong> Clustered for range queries, nonclustered for selective lookups
        </li>
      </ul>

      <ComparisonTable
        headers={["Feature", "Clustered Index", "Nonclustered Index"]}
        rows={[
          ["Storage", "Data stored in index order", "Separate structure with pointers"],
          ["Quantity", "One per table", "Up to 999 per table"],
          ["Best for", "Range queries, full scans", "Selective point lookups"],
          ["Speed", "Fastest for primary key lookups", "Faster for filtered queries on non-key columns"],
        ]}
        caption="Quick reference comparison"
      />

      {/* How Clustered Indexes Work */}
      <h2
        id="clustered-index"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How Clustered Indexes Work
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A clustered index determines the physical order of data in a table. The rows ARE stored in the order of the clustered index key. Think of a phone book: the entries are physically sorted by last name, so finding &ldquo;Smith&rdquo; means jumping to the S section.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Key characteristics of clustered indexes:</strong>
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Data rows are physically stored in the order of the clustered index</li>
        <li>Primary key is automatically clustered in SQL Server (unless specified otherwise)</li>
        <li>Only ONE clustered index allowed per table (you can&apos;t sort data two ways)</li>
        <li>Uses a B-tree structure: root node, intermediate nodes, and leaf nodes</li>
        <li>Leaf nodes contain the ACTUAL DATA ROWS</li>
        <li>Fast for range scans because data is sequential on disk</li>
      </ul>

      <FlowDiagram
        nodes={[
          { label: "Root Node (starting point)", icon: "🌳", type: "start" },
          { label: "Intermediate Nodes (navigation)", icon: "📍", type: "process" },
          { label: "Leaf Nodes = ACTUAL DATA ROWS", icon: "📄", type: "end" },
        ]}
        caption="In a clustered index, leaf nodes contain the actual table data, sorted by the index key."
      />

      <DetectiveTip variant="tip" title="The Filing Cabinet Analogy">
        Think of a clustered index like case files in a filing cabinet, sorted by case number. The files ARE in that order. There&apos;s no separate lookup needed. When you need Case #500, you go straight to that section.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s how you create a clustered index:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Creating a Clustered Index:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Primary key automatically creates clustered index in SQL Server
CREATE TABLE suspects (
  suspect_id INT PRIMARY KEY,  -- Clustered by default
  name VARCHAR(100),
  last_seen DATE
);

-- Or explicitly create a clustered index
CREATE CLUSTERED INDEX idx_suspects_id ON suspects(suspect_id);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          In SQL Server, PRIMARY KEY creates a clustered index unless you specify NONCLUSTERED.
        </p>
      </div>

      {/* How Nonclustered Indexes Work */}
      <h2
        id="nonclustered-index"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How Nonclustered Indexes Work
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A nonclustered index is a separate data structure that lives outside the table. It contains the indexed column values plus a pointer back to the actual row. This pointer is called a &ldquo;bookmark&rdquo; or &ldquo;row locator.&rdquo;
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Key characteristics of nonclustered indexes:</strong>
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Separate data structure outside the table</li>
        <li>Contains indexed columns + pointers (RID or clustered key)</li>
        <li>Multiple nonclustered indexes allowed (up to 999 in SQL Server)</li>
        <li>Requires a &ldquo;bookmark lookup&rdquo; to get full row data</li>
        <li>Can INCLUDE extra columns for covering indexes</li>
      </ul>

      <FlowDiagram
        nodes={[
          { label: "Root Node (starting point)", icon: "🌳", type: "start" },
          { label: "Intermediate Nodes (navigation)", icon: "📍", type: "process" },
          { label: "Leaf Nodes = INDEX KEY + POINTER", icon: "🔗", type: "process" },
          { label: "Pointer → Table Data (bookmark lookup)", icon: "📄", type: "end" },
        ]}
        caption="Nonclustered leaf nodes contain the index key plus a pointer back to the actual row."
      />

      <DetectiveTip variant="tip" title="The Library Card Catalog Analogy">
        A nonclustered index is like a library card catalog. The cards are sorted alphabetically by title, but they contain a call number (pointer) telling you where to find the actual book on the shelves.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s how you create a nonclustered index:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Creating Nonclustered Indexes:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Simple nonclustered index
CREATE NONCLUSTERED INDEX idx_suspects_name 
ON suspects(name);

-- Covering index with INCLUDE clause
CREATE NONCLUSTERED INDEX idx_suspects_name_covering 
ON suspects(name) 
INCLUDE (last_seen, age);
-- Now queries selecting only name, last_seen, age 
-- don't need a bookmark lookup!`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The INCLUDE clause adds columns to the leaf level without sorting by them.
        </p>
      </div>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding indexes is crucial for writing efficient SQL. If you want to practice querying databases where every millisecond counts,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        challenge you to solve mysteries with real SQL queries.
      </p>

      {/* Visual Comparison */}
      <h2
        id="visual-comparison"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Visual Comparison: The Key Difference
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The fundamental difference comes down to what&apos;s stored in the leaf nodes:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li><strong>Clustered:</strong> Leaf node = the actual data row</li>
        <li><strong>Nonclustered:</strong> Leaf node = index key + pointer to data row</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        This single difference explains ALL performance characteristics of each index type.
      </p>

      <ComparisonTable
        headers={["Aspect", "Clustered Index", "Nonclustered Index"]}
        rows={[
          ["Leaf nodes contain", "Actual data rows", "Index key + pointer"],
          ["Physical data order", "Determined by index", "Not affected"],
          ["Number per table", "Maximum 1", "Up to 999"],
          ["Storage overhead", "Lower (data is the index)", "Higher (separate structure)"],
          ["Range scan performance", "Excellent (sequential)", "Requires bookmark lookups"],
          ["Point lookup performance", "Excellent (direct path)", "Good (with covering index: excellent)"],
          ["Insert/Update cost", "Higher if reordering needed", "Additional index maintenance"],
          ["When to use", "Primary key, range-scanned columns", "Frequently filtered non-key columns"],
          ["Auto-created by", "PRIMARY KEY (SQL Server)", "UNIQUE constraint (as option)"],
          ["PostgreSQL behavior", "CLUSTER command (one-time reorder)", "Default for CREATE INDEX"],
        ]}
        caption="Complete 10-point comparison of clustered vs nonclustered indexes"
      />

      {/* When to Use Clustered */}
      <h2
        id="when-clustered"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        When to Use Clustered Indexes
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Clustered indexes shine in specific scenarios:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li><strong>Primary keys:</strong> Auto-clustered in SQL Server, makes sense for most lookups</li>
        <li><strong>Range queries:</strong> Columns used with BETWEEN, greater than, less than</li>
        <li><strong>ORDER BY columns:</strong> When most queries sort by the same column</li>
        <li><strong>Read-heavy tables:</strong> Few writes, many reads benefit from sequential data</li>
      </ul>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "SELECT *",
            annotation: "Retrieve all columns",
          },
          {
            keyword: "FROM",
            code: "FROM cases",
            annotation: "The cases table",
          },
          {
            keyword: "WHERE",
            code: "WHERE case_date BETWEEN '2024-01-01' AND '2024-12-31'",
            annotation: "Range scan benefits from clustered index. Data is sequential!",
          },
          {
            keyword: "ORDER BY",
            code: "ORDER BY case_date;",
            annotation: "No sorting needed. Data already in order!",
          },
        ]}
        caption="This query benefits massively from a clustered index on case_date"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Date-Based Clustered Index</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- If most queries filter/sort by date, cluster on date
CREATE TABLE cases (
  case_id INT,
  case_date DATE,
  title VARCHAR(200),
  status VARCHAR(50)
);

CREATE CLUSTERED INDEX idx_cases_date ON cases(case_date);

-- Now range queries are lightning fast:
SELECT * FROM cases 
WHERE case_date BETWEEN '2024-01-01' AND '2024-06-30';
-- Data is physically ordered by date!`}
        </pre>
      </div>

      {/* When to Use Nonclustered */}
      <h2
        id="when-nonclustered"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        When to Use Nonclustered Indexes
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Nonclustered indexes are your go-to for:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li><strong>Frequently filtered columns:</strong> Columns in WHERE clauses (not the primary key)</li>
        <li><strong>JOIN columns:</strong> Foreign keys benefit from nonclustered indexes</li>
        <li><strong>Selective queries:</strong> When returning a small percentage of rows</li>
        <li><strong>Multiple access paths:</strong> When queries filter by different columns</li>
        <li><strong>Covering indexes:</strong> When you can satisfy queries entirely from the index</li>
      </ul>

      <BeforeAfter
        before={{
          code: `SELECT * FROM suspects WHERE last_name = 'Martinez';
-- Without index: Full Table Scan
-- Scans ALL 1,000,000 rows
-- 5,000+ page reads
-- ~2.5 seconds`,
          label: "Without Index: Full Table Scan",
          issues: ["Examines every row in the table", "Slow even for one matching record"],
        }}
        after={{
          code: `CREATE NONCLUSTERED INDEX idx_lastname 
ON suspects(last_name);

SELECT * FROM suspects WHERE last_name = 'Martinez';
-- With index: Index Seek + Bookmark Lookup
-- ~10 page reads
-- ~0.01 seconds`,
          label: "With Nonclustered Index: Index Seek",
          improvements: ["Jumps directly to matching entries", "100x+ faster for selective queries"],
        }}
        caption="Nonclustered index dramatically improves selective lookup performance"
      />

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Think you understand when to use each index type? Test your skills by solving a case where choosing the right query approach is the difference between cracking the case and hitting a dead end."
        difficulty="intermediate"
        href="/cases"
      />

      {/* Decision Guide */}
      <h2
        id="decision-guide"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Decision Guide: Which Index Type to Use
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Follow this decision tree when choosing your index type:
      </p>

      <FlowDiagram
        nodes={[
          { label: "Is this your PRIMARY KEY?", icon: "🔑", type: "start" },
          { label: "Will you do RANGE SCANS (BETWEEN, >, <)?", icon: "📊", type: "process" },
          { label: "Do you already have a clustered index?", icon: "❓", type: "process" },
          { label: "Is this column frequently in WHERE clauses?", icon: "🔍", type: "process" },
          { label: "Choose: Clustered, Nonclustered, or Covering", icon: "✅", type: "end" },
        ]}
        caption="PRIMARY KEY → Clustered (auto). Range scans + no existing clustered → Consider clustered. Already have clustered + frequent WHERE → Nonclustered. Need full row without bookmark lookup → Covering nonclustered."
      />

      <QuickQuiz
        title="🔍 Test Your Index Knowledge"
        questions={[
          {
            question: "You have an 'orders' table and frequently query orders by customer_id (not the primary key). Which index type?",
            options: ["Clustered index on customer_id", "Nonclustered index on customer_id", "No index needed", "Both types"],
            correctIndex: 1,
            explanation: "Since the table already has a clustered index (likely on order_id), you can't add another. Nonclustered is perfect for frequently filtered columns.",
          },
          {
            question: "A query retrieves only customer_id and order_date from a million-row table. What's the fastest approach?",
            options: ["Clustered index on customer_id", "Nonclustered index on customer_id", "Nonclustered covering index with INCLUDE (order_date)", "Full table scan"],
            correctIndex: 2,
            explanation: "A covering index includes all needed columns, eliminating bookmark lookups entirely. The query is satisfied from the index alone.",
          },
          {
            question: "In SQL Server, what happens when you define a PRIMARY KEY on a table?",
            options: ["A nonclustered index is created", "A clustered index is created by default", "No index is created", "Both types are created"],
            correctIndex: 1,
            explanation: "SQL Server automatically creates a clustered index on the PRIMARY KEY unless you explicitly specify NONCLUSTERED.",
          },
          {
            question: "Why can a table have only ONE clustered index?",
            options: ["SQL Server limitation that could be changed", "Because clustered index determines physical data order", "To save storage space", "No technical reason, just convention"],
            correctIndex: 1,
            explanation: "Data can only be physically sorted ONE way. You can't alphabetize a phone book by both name AND address simultaneously.",
          },
        ]}
      />

      {/* Common Mistakes */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes (And How to Avoid Them)
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 1: Clustering on a Frequently Updated Column
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        When you cluster on a column that changes often, every update may require physically moving the row to maintain sort order. This causes &ldquo;page splits&rdquo; and degrades write performance.
      </p>

      <BeforeAfter
        before={{
          code: `-- Status changes frequently: Open → In Progress → Closed
CREATE CLUSTERED INDEX idx_status ON cases(status);

-- Every status update may require row movement
UPDATE cases SET status = 'Closed' WHERE case_id = 123;
-- Row physically moves from 'In Progress' section to 'Closed' section!`,
          label: "Bad: Clustered Index on Frequently Updated Column",
          issues: ["Every status change may require physical row movement", "Causes page splits and fragmentation", "Write performance degrades over time"],
        }}
        after={{
          code: `-- case_id is auto-increment, never changes
-- PRIMARY KEY creates clustered index automatically
CREATE TABLE cases (
  case_id INT PRIMARY KEY,
  status VARCHAR(20)
);

-- Status queries use nonclustered index
CREATE NONCLUSTERED INDEX idx_status ON cases(status);

-- Status updates don't move rows!`,
          label: "Better: Clustered on Sequential ID, Nonclustered on Status",
          improvements: ["New rows always go to the end (no reordering)", "Status updates don't move physical rows", "Both query patterns are fast"],
        }}
        caption="Avoid clustering on columns that change frequently"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 2: Too Many Nonclustered Indexes
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every nonclustered index must be updated on INSERT, UPDATE, and DELETE operations. Having too many indexes slows down writes.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">The Trade-off:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Each index speeds up reads but slows down writes
CREATE NONCLUSTERED INDEX idx_1 ON suspects(name);
CREATE NONCLUSTERED INDEX idx_2 ON suspects(age);
CREATE NONCLUSTERED INDEX idx_3 ON suspects(last_seen);
CREATE NONCLUSTERED INDEX idx_4 ON suspects(city);
CREATE NONCLUSTERED INDEX idx_5 ON suspects(status);

-- Every INSERT now updates 5 indexes + the table!
INSERT INTO suspects VALUES (...);
-- Every UPDATE potentially updates multiple indexes
UPDATE suspects SET status = 'Cleared' WHERE suspect_id = 123;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Rule of thumb: Index columns that are frequently in WHERE clauses, not every column.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 3: Not Using Covering Indexes
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        If your queries consistently need specific columns, a covering index eliminates bookmark lookups entirely:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Without covering index: Index Seek + Bookmark Lookup
CREATE NONCLUSTERED INDEX idx_name ON suspects(last_name);

SELECT last_name, first_name, phone 
FROM suspects WHERE last_name = 'Smith';
-- Has to look up the actual row for first_name and phone

-- With covering index: Index Seek only!
CREATE NONCLUSTERED INDEX idx_name_covering 
ON suspects(last_name) INCLUDE (first_name, phone);

SELECT last_name, first_name, phone 
FROM suspects WHERE last_name = 'Smith';
-- All columns in the index, no bookmark lookup needed!`}
        </pre>
      </div>

      <DetectiveTip variant="tip" title="Pro Tip">
        Check your execution plans. If you see &ldquo;Key Lookup&rdquo; or &ldquo;RID Lookup,&rdquo; that&apos;s a bookmark lookup. Consider a covering index if this query runs frequently.
      </DetectiveTip>

      {/* Interview Questions */}
      <h2
        id="interview-questions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Interview Questions: Clustered vs Nonclustered
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These are the index questions that come up in technical interviews:
      </p>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Q: What&apos;s the key difference between clustered and nonclustered indexes?
          </h3>
          <p className="text-gray-700">
            <strong>A:</strong> Clustered indexes determine the PHYSICAL order of data on disk. The leaf nodes contain the actual data rows. Nonclustered indexes are separate structures where leaf nodes contain index keys + pointers back to the actual rows. This is why you can have only one clustered index (data can only be sorted one way) but many nonclustered indexes.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Q: Why can a table have only one clustered index?
          </h3>
          <p className="text-gray-700">
            <strong>A:</strong> Because data can only be physically sorted one way. You can&apos;t alphabetize a phone book by both name AND address simultaneously. The clustered index key determines row order on disk.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Q: What is a covering index?
          </h3>
          <p className="text-gray-700">
            <strong>A:</strong> A covering index includes all columns needed by a query, either in the key columns or via INCLUDE clause. This eliminates the need for a bookmark lookup because the query can be satisfied entirely from the index.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Q: What are page splits and why do they matter?
          </h3>
          <p className="text-gray-700">
            <strong>A:</strong> Page splits occur when a new row needs to be inserted into a full data page in a clustered index. The database must split the page in two and redistribute rows. This causes fragmentation and slows writes. Choose clustered index keys that grow sequentially (like auto-increment IDs) to minimize page splits.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Q: When would a nonclustered index be faster than a clustered index?
          </h3>
          <p className="text-gray-700">
            <strong>A:</strong> When you have a covering index that includes all columns needed by the query. The nonclustered index is smaller than the full table, so scanning it is faster. Also, for highly selective queries that return few rows, a nonclustered index seek + bookmark lookup can be faster than a clustered range scan that returns more data than needed.
          </p>
        </div>
      </div>

      <DetectiveTip variant="clue" title="Interview Tip">
        When explaining indexes in interviews, always mention the PHYSICAL storage aspect. The clustered index determines how data is PHYSICALLY stored on disk. That&apos;s why there can only be one. Use the phone book (clustered) vs. library card catalog (nonclustered) analogy.
      </DetectiveTip>

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to prove your SQL knowledge?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir challenges you to use efficient queries to solve real detective cases. No index? Good luck scanning a million rows to find your suspect.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* FAQ */}
      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        FAQ
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Can a table have both clustered and nonclustered indexes?
          </h3>
          <p className="text-gray-700">
            Yes! A table can have ONE clustered index (typically on primary key) and up to 999 nonclustered indexes on other columns. This is the most common setup.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            What happens if I don&apos;t create a clustered index?
          </h3>
          <p className="text-gray-700">
            The table becomes a &ldquo;heap.&rdquo; Rows are stored in no particular order. Heaps can work for certain write-heavy scenarios but generally perform worse for reads. Most tables benefit from having a clustered index.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Does PostgreSQL support clustered indexes?
          </h3>
          <p className="text-gray-700">
            PostgreSQL handles it differently. You can CLUSTER a table to physically reorder it by an index, but unlike SQL Server, this is a one-time operation. New inserts don&apos;t maintain the order. PostgreSQL&apos;s default CREATE INDEX creates nonclustered indexes.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            How do I know if my query is using an index?
          </h3>
          <p className="text-gray-700">
            Check the execution plan. In PostgreSQL, use EXPLAIN or EXPLAIN ANALYZE. In SQL Server, view the execution plan. Look for &ldquo;Index Seek&rdquo; (good) vs &ldquo;Table Scan&rdquo; or &ldquo;Clustered Index Scan&rdquo; (no index used effectively).
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Should I index every column I query?
          </h3>
          <p className="text-gray-700">
            No! Each index slows down writes (INSERT, UPDATE, DELETE). Index columns that are frequently filtered or sorted, but balance read performance gains against write overhead. Monitor query patterns and index strategically.
          </p>
        </div>
      </div>
    </div>
  );
}
