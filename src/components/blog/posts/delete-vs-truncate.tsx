"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ComparisonTable,
  FlowDiagram,
} from "@/components/blog/diagrams";
import {
  SQLQueryBreakdown,
  BeforeAfter,
  DetectiveTip,
  MysteryTeaser,
  QuickQuiz,
  StatCallout,
} from "@/components/blog/content";

export default function DeleteVsTruncate() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Hero Image */}
      <div className="mb-8">
        <Image
          src="/blog/delete-vs-truncate-hero.png"
          alt="Pixel art detective standing between two evidence boards - one with specific items crossed out (DELETE) and one completely empty (TRUNCATE)"
          width={1200}
          height={675}
          className="w-full rounded-lg shadow-lg h-auto"
          priority
        />
      </div>

      {/* Intro - Short and punchy */}
      <p className="text-gray-700 leading-relaxed mb-6 text-xl">
        Need to remove data from a SQL table? The wrong choice between DELETE and TRUNCATE could mean lost data, performance issues, or a transaction you can&apos;t roll back. Here&apos;s how to choose wisely.
      </p>

      {/* Quick Navigation */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-10">
        <h4 className="font-bold text-amber-900 mb-3">Quick Navigation</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-amber-800 list-none pl-0 mb-0">
          <li><a href="#quick-answer" className="hover:underline">→ The Quick Answer</a></li>
          <li><a href="#delete-command" className="hover:underline">→ DELETE: Surgical Removal</a></li>
          <li><a href="#truncate-command" className="hover:underline">→ TRUNCATE: The Nuclear Option</a></li>
          <li><a href="#data-transformation" className="hover:underline">→ Visual: What Happens to Your Data</a></li>
          <li><a href="#decision-flowchart" className="hover:underline">→ Decision Flowchart</a></li>
          <li><a href="#key-differences" className="hover:underline">→ The 10 Key Differences</a></li>
          <li><a href="#common-mistakes" className="hover:underline">→ Common Mistakes</a></li>
          <li><a href="#performance" className="hover:underline">→ Performance</a></li>
          <li><a href="#quiz" className="hover:underline">→ Test Your Understanding</a></li>
          <li><a href="#faq" className="hover:underline">→ FAQ</a></li>
        </ul>
      </div>

      {/* Section: The Quick Answer */}
      <h2 id="quick-answer" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        The Quick Answer
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>DELETE</strong> is surgical removal. It can target specific rows with a WHERE clause, logs each deletion, and can always be rolled back within a transaction.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>TRUNCATE</strong> is the nuclear option. It removes ALL rows instantly by deallocating data pages, doesn&apos;t fire triggers, and usually cannot be rolled back.
      </p>

      <ComparisonTable
        headers={["Feature", "DELETE", "TRUNCATE"]}
        rows={[
          ["Removes", "Specific rows (WHERE) or all", "All rows only"],
          ["Speed", "Slower (row-by-row)", "Faster (deallocates pages)"],
          ["Can Rollback?", "Yes", "No (in most databases)"],
          ["Fires Triggers?", "Yes", "No"],
          ["Resets Identity?", "No", "Yes"],
        ]}
        caption="Quick reference: DELETE vs TRUNCATE"
      />

      {/* Section: DELETE Command */}
      <h2 id="delete-command" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        DELETE: Surgical Data Removal
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        DELETE is a DML (Data Manipulation Language) command. It works with transactions, fires triggers on each deleted row, and logs every deletion to the transaction log. Think of it as carefully removing specific evidence from a case file while keeping a record of what you took.
      </p>

      <SQLQueryBreakdown
        clauses={[
          { keyword: "DELETE", code: "", annotation: "DML command - can be rolled back" },
          { keyword: "FROM", code: "suspects", annotation: "Target table" },
          { keyword: "WHERE", code: "alibi_verified = true", annotation: "Filter condition - only verified alibis removed" },
        ]}
        caption="Anatomy of a DELETE statement"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        The WHERE clause is what makes DELETE powerful. You can remove exactly what you need and nothing more:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Removing specific suspects:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Remove suspects with verified alibis
DELETE FROM suspects
WHERE alibi_verified = true;

-- Remove witnesses from a solved case
DELETE FROM witnesses
WHERE case_id = 'CASE-2024-001'
  AND case_status = 'closed';`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Because DELETE logs each row, you can wrap it in a transaction and roll back if something goes wrong:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">DELETE with transaction:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`BEGIN TRANSACTION;

DELETE FROM evidence
WHERE collected_date < '2020-01-01';

-- Oops, deleted too much!
ROLLBACK;

-- Or if it looks good:
-- COMMIT;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          With an explicit transaction, you can undo DELETE before committing.
        </p>
      </div>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Want to practice writing DELETE queries?{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        have you investigating crime scenes with real SQL.
      </p>

      {/* Section: TRUNCATE Command */}
      <h2 id="truncate-command" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        TRUNCATE: The Nuclear Option
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        TRUNCATE is a DDL (Data Definition Language) command. It doesn&apos;t delete rows one by one. Instead, it deallocates the data pages that hold your table&apos;s data. Think of it as burning the entire evidence room rather than removing files one at a time.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">TRUNCATE in action:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Clear all rows from a staging table
TRUNCATE TABLE evidence_staging;

-- The table structure remains, but all rows are gone`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Key characteristics of TRUNCATE:
      </p>

      <ul className="text-gray-700 mb-6">
        <li><strong>No WHERE clause</strong> - It removes ALL rows, no exceptions</li>
        <li><strong>Resets identity columns</strong> - Auto-increment starts over at 1</li>
        <li><strong>Does NOT fire triggers</strong> - No DELETE triggers execute</li>
        <li><strong>Minimal logging</strong> - Only logs page deallocations, not individual rows</li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Identity reset behavior:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Before TRUNCATE: next ID would be 50,001
SELECT MAX(id) FROM suspects;  -- Returns 50000

TRUNCATE TABLE suspects;

-- After TRUNCATE: next ID starts at 1
INSERT INTO suspects (name) VALUES ('New Suspect');
SELECT id FROM suspects;  -- Returns 1`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          TRUNCATE resets auto-increment. DELETE does not.
        </p>
      </div>

      <DetectiveTip variant="warning" title="No Going Back">
        TRUNCATE is like burning the evidence room. In most databases (MySQL, PostgreSQL with auto-commit, SQL Server with auto-commit), once you TRUNCATE, the data is gone. Only within explicit transactions in PostgreSQL, SQL Server, and Oracle can TRUNCATE be rolled back.
      </DetectiveTip>

      {/* Section: Data Transformation Visual */}
      <h2 id="data-transformation" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Visual: What Actually Happens to Your Data
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The fundamental difference is <em>how</em> each command removes data. DELETE works row by row, while TRUNCATE deallocates entire data pages.
      </p>

      <FlowDiagram
        nodes={[
          { label: "Start Transaction", icon: "🔓", type: "start" },
          { label: "Lock Row", icon: "🔒", type: "process" },
          { label: "Log Deletion", icon: "📝", type: "process" },
          { label: "Fire Trigger", icon: "⚡", type: "process" },
          { label: "Remove Row", icon: "🗑️", type: "process" },
          { label: "Repeat for Each Row", icon: "🔄", type: "process" },
          { label: "Commit/Rollback", icon: "✅", type: "end" },
        ]}
        caption="How DELETE works: row-by-row processing with full logging"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        DELETE processes each matching row individually. That&apos;s why it&apos;s slower but more controlled.
      </p>

      <BeforeAfter
        before={{
          code: "| id | suspect_name | cleared |\n|----|--------------|--------|\n| 1  | Smith        | false  |\n| 2  | Jones        | true   |\n| 3  | Brown        | false  |\n| 4  | Davis        | true   |",
          label: "Table Before",
        }}
        after={{
          code: "| id | suspect_name | cleared |\n|----|--------------|--------|\n| 1  | Smith        | false  |\n| 3  | Brown        | false  |\n\n(2 rows deleted, can be rolled back)",
          label: "After: DELETE WHERE cleared = true",
        }}
        caption="DELETE removes specific rows based on your WHERE condition"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        TRUNCATE, by contrast, deallocates the data pages in one operation:
      </p>

      <BeforeAfter
        before={{
          code: "| id | suspect_name | cleared |\n|----|--------------|--------|\n| 1  | Smith        | false  |\n| 2  | Jones        | true   |\n| 3  | Brown        | false  |\n| 4  | Davis        | true   |",
          label: "Table Before",
        }}
        after={{
          code: "| id | suspect_name | cleared |\n|----|--------------|--------|\n\n(empty - all rows removed, identity reset to 1)",
          label: "After: TRUNCATE TABLE suspects",
        }}
        caption="TRUNCATE removes ALL rows instantly by deallocating pages"
      />

      {/* Section: Decision Flowchart */}
      <h2 id="decision-flowchart" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        When to Use DELETE vs TRUNCATE: Decision Flowchart
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Not sure which to use? Follow this decision tree:
      </p>

      <FlowDiagram
        nodes={[
          { label: "Need WHERE Clause?", icon: "🔍", type: "start" },
          { label: "If YES → DELETE", icon: "✂️", type: "process" },
          { label: "Need Rollback Safety?", icon: "↩️", type: "process" },
          { label: "If YES → DELETE", icon: "✂️", type: "process" },
          { label: "Has FK Constraints?", icon: "🔗", type: "process" },
          { label: "If YES → DELETE or CASCADE", icon: "✂️", type: "process" },
          { label: "Otherwise → TRUNCATE", icon: "💥", type: "end" },
        ]}
        caption="If you answered YES to any of the first three questions, use DELETE. Otherwise, TRUNCATE is faster."
      />

      <DetectiveTip variant="clue" title="Rule of Thumb">
        Use DELETE when you need precision or safety. Use TRUNCATE when you&apos;re clearing a staging table or resetting test data and speed matters more than recoverability.
      </DetectiveTip>

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Think you understand SQL data manipulation? Put your detective skills to work solving mysteries with real queries."
        difficulty="intermediate"
        href="/cases"
      />

      {/* Section: Key Differences */}
      <h2 id="key-differences" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        The 10 Key Differences
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the complete breakdown of how DELETE and TRUNCATE differ:
      </p>

      <ComparisonTable
        headers={["Aspect", "DELETE", "TRUNCATE"]}
        rows={[
          ["Command Type", "DML (Data Manipulation)", "DDL (Data Definition)"],
          ["WHERE Clause", "✅ Supported", "❌ Not supported"],
          ["Rollback", "✅ Always possible", "⚠️ Database-dependent"],
          ["Trigger Execution", "✅ Fires triggers", "❌ Does not fire triggers"],
          ["Identity Reset", "❌ Keeps current value", "✅ Resets to seed"],
          ["Speed", "🐢 Slower (row-by-row)", "🚀 Faster (page deallocation)"],
          ["Transaction Log", "Logs each row", "Logs page deallocations only"],
          ["Permissions", "DELETE permission", "ALTER permission"],
          ["Foreign Keys", "Works (may cascade)", "Fails if referenced"],
          ["Space Reclaim", "May not reclaim", "Immediately reclaims"],
        ]}
        caption="DELETE vs TRUNCATE: Complete 10-point comparison"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        A few of these deserve extra attention:
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">DML vs DDL: Why It Matters</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        DELETE is DML because it manipulates data. TRUNCATE is DDL because it restructures the table (deallocates pages). This classification affects permissions, transaction behavior, and how replication tools handle each command.
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Foreign Key Behavior</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        If other tables reference your table via foreign keys, TRUNCATE will fail. You must either delete the referencing rows first, drop the constraints, or use DELETE instead.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Foreign key constraint error:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- This fails if other tables reference 'cases'
TRUNCATE TABLE cases;
-- ERROR: Cannot truncate a table referenced in a 
-- foreign key constraint

-- Instead, delete from child tables first:
DELETE FROM evidence WHERE case_id IN (SELECT id FROM cases);
DELETE FROM suspects WHERE case_id IN (SELECT id FROM cases);
DELETE FROM cases;`}
        </pre>
      </div>

      {/* Section: Common Mistakes */}
      <h2 id="common-mistakes" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Common Mistakes to Avoid
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These are the traps developers fall into when choosing between DELETE and TRUNCATE:
      </p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Mistake 1: Using TRUNCATE on FK-Referenced Tables</h3>

      <BeforeAfter
        before={{
          code: "TRUNCATE TABLE orders;\n\n-- ERROR: Cannot truncate a table\n-- referenced in a foreign key constraint",
          label: "❌ Wrong: TRUNCATE on FK Table",
          issues: [
            "TRUNCATE fails when other tables reference this one",
            "Must use DELETE or drop constraints first",
          ],
        }}
        after={{
          code: "-- Option 1: DELETE child rows first\nDELETE FROM order_items;\nDELETE FROM orders;\n\n-- Option 2: PostgreSQL CASCADE\nTRUNCATE TABLE orders CASCADE;",
          label: "✅ Right: Handle Constraints First",
          improvements: [
            "DELETE works with foreign keys",
            "CASCADE option in PostgreSQL truncates dependent tables",
          ],
        }}
        caption="Always check for foreign key constraints before using TRUNCATE"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Mistake 2: Expecting Triggers to Fire on TRUNCATE</h3>

      <BeforeAfter
        before={{
          code: "-- Audit trigger logs all deletions\nCREATE TRIGGER log_deletes\n  ON suspects\n  AFTER DELETE\n  FOR EACH ROW\n  INSERT INTO audit_log ...;\n\n-- This does NOT fire the trigger!\nTRUNCATE TABLE suspects;",
          label: "❌ Wrong: Relying on Triggers",
          issues: [
            "TRUNCATE bypasses all triggers",
            "Audit logs will be missing entries",
          ],
        }}
        after={{
          code: "-- Use DELETE if you need triggers\nDELETE FROM suspects;\n\n-- Each deleted row fires the trigger\n-- Audit log is complete",
          label: "✅ Right: Use DELETE for Trigger-Dependent Logic",
          improvements: [
            "DELETE fires AFTER DELETE triggers",
            "All rows logged to audit table",
          ],
        }}
        caption="TRUNCATE bypasses triggers entirely"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Mistake 3: Using DELETE When TRUNCATE Would Be 100x Faster</h3>

      <BeforeAfter
        before={{
          code: "-- Clearing 10 million rows from staging table\nDELETE FROM staging_table;\n\n-- Takes 45 minutes, fills transaction log",
          label: "❌ Slow: DELETE on Large Table",
          issues: [
            "Row-by-row processing takes forever",
            "Transaction log grows massive",
          ],
        }}
        after={{
          code: "-- Same 10 million rows\nTRUNCATE TABLE staging_table;\n\n-- Takes 2 seconds",
          label: "✅ Fast: TRUNCATE for Bulk Clear",
          improvements: [
            "Deallocates pages instantly",
            "Minimal log space required",
          ],
        }}
        caption="For staging tables and full clears, TRUNCATE is orders of magnitude faster"
      />

      {/* Section: Performance */}
      <h2 id="performance" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Performance: When TRUNCATE Really Matters
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The performance difference between DELETE and TRUNCATE becomes dramatic as table size grows.
      </p>

      <StatCallout
        stat="100x"
        description="TRUNCATE can be 100x faster than DELETE on tables with millions of rows"
        source="Benchmarks on 10M row tables across PostgreSQL, MySQL, SQL Server"
        icon="🚀"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Why such a huge difference?
      </p>

      <ul className="text-gray-700 mb-6">
        <li><strong>DELETE is O(n)</strong> - Time scales linearly with row count. 10 million rows means 10 million row-level operations.</li>
        <li><strong>TRUNCATE is O(1)</strong> - Constant time. It deallocates pages regardless of how many rows exist.</li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Rough timing comparison:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- 10 million row table

DELETE FROM large_table;
-- PostgreSQL: ~45 minutes
-- MySQL: ~30 minutes
-- SQL Server: ~60 minutes

TRUNCATE TABLE large_table;
-- PostgreSQL: 1-2 seconds
-- MySQL: 1-2 seconds
-- SQL Server: 1-2 seconds`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Actual times vary by hardware, but the order-of-magnitude difference is consistent.
        </p>
      </div>

      <DetectiveTip variant="tip" title="When DELETE Is Fine">
        For small tables (under 100,000 rows), the difference is usually negligible. Use DELETE if you need the safety features, and don&apos;t prematurely optimize.
      </DetectiveTip>

      {/* Section: Quiz */}
      <h2 id="quiz" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Test Your Understanding
      </h2>

      <QuickQuiz
        title="🔍 DELETE vs TRUNCATE Quiz"
        questions={[
          {
            question: "You need to remove all orders from 2023, but keep 2024 orders. Which command?",
            options: [
              "DELETE FROM orders WHERE year = 2023",
              "TRUNCATE TABLE orders",
              "Either works",
            ],
            correctIndex: 0,
            explanation: "DELETE with WHERE clause is the only option for selective removal. TRUNCATE cannot filter rows.",
          },
          {
            question: "Your staging table has 10 million rows and needs to be cleared before each import. Which is faster?",
            options: [
              "DELETE FROM staging",
              "TRUNCATE TABLE staging",
              "They're the same speed",
            ],
            correctIndex: 1,
            explanation: "TRUNCATE is dramatically faster for clearing large tables. It deallocates pages instead of deleting row by row.",
          },
          {
            question: "You accidentally ran DELETE FROM users (without WHERE) and want to roll back. Can you?",
            options: [
              "Yes, DELETE is always rollback-safe",
              "No, the data is gone",
              "Only if you used BEGIN TRANSACTION",
            ],
            correctIndex: 2,
            explanation: "DELETE can be rolled back, but only within an explicit transaction. With auto-commit enabled, the DELETE commits immediately.",
          },
          {
            question: "Your table has an auto-increment ID at 50,000. After removing all rows, you want new rows to start at 1. Which command?",
            options: [
              "DELETE FROM table",
              "TRUNCATE TABLE table",
              "Either resets the identity",
            ],
            correctIndex: 1,
            explanation: "Only TRUNCATE resets the identity/auto-increment counter to its seed value. DELETE preserves the current counter.",
          },
        ]}
      />

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put your SQL skills to the real test?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          Solve murder mysteries using nothing but your SQL queries in SQLNoir. Completely free.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* Section: Database Differences */}
      <h2 id="database-differences" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Database-Specific Behavior
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        TRUNCATE&apos;s rollback behavior varies by database. This is the most important difference to know:
      </p>

      <ComparisonTable
        headers={["Database", "TRUNCATE Rollback?", "Notes"]}
        rows={[
          ["MySQL", "❌ No", "Implicit COMMIT. Cannot be rolled back."],
          ["PostgreSQL", "✅ Yes", "Can rollback within explicit transaction"],
          ["SQL Server", "✅ Yes", "Can rollback within explicit transaction"],
          ["Oracle", "✅ Yes", "Can rollback within explicit transaction"],
          ["SQLite", "N/A", "No TRUNCATE command. Use DELETE."],
        ]}
        caption="TRUNCATE rollback support by database"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">PostgreSQL TRUNCATE rollback:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`BEGIN;

TRUNCATE TABLE suspects;

-- Changed your mind?
ROLLBACK;

-- Data is restored in PostgreSQL!`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          PostgreSQL wraps TRUNCATE in the transaction. MySQL does not.
        </p>
      </div>

      <DetectiveTip variant="tip" title="SQLite Users">
        SQLite (used in SQLNoir) doesn&apos;t have TRUNCATE. Use <code>DELETE FROM table_name;</code> instead. The optimizer treats it efficiently when there&apos;s no WHERE clause.
      </DetectiveTip>

      {/* Section: FAQ */}
      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">Can I use TRUNCATE with a WHERE clause?</h4>
          <p className="text-gray-700 mb-0">
            No. TRUNCATE always removes ALL rows. If you need to filter which rows to remove, use DELETE.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">Is TRUNCATE DDL or DML?</h4>
          <p className="text-gray-700 mb-0">
            DDL (Data Definition Language). It&apos;s treated like a table structure operation, not a data manipulation operation like DELETE.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">Which is faster: DELETE or TRUNCATE?</h4>
          <p className="text-gray-700 mb-0">
            TRUNCATE is faster, especially on large tables. DELETE processes row-by-row while TRUNCATE deallocates data pages in bulk. For tables with millions of rows, TRUNCATE can be 100x faster.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">Can I rollback a TRUNCATE?</h4>
          <p className="text-gray-700 mb-0">
            It depends on your database. PostgreSQL, SQL Server, and Oracle allow rollback within explicit transactions. MySQL does not. Always test in your specific environment.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">Does TRUNCATE fire triggers?</h4>
          <p className="text-gray-700 mb-0">
            No. Unlike DELETE, TRUNCATE does not execute any triggers defined on the table. If you have audit triggers or cascade logic, use DELETE instead.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <h2 id="conclusion" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        The Bottom Line
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Use DELETE</strong> when you need precision (WHERE clause), safety (rollback), or triggers to fire. It&apos;s the careful, surgical approach.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Use TRUNCATE</strong> when you&apos;re clearing all rows from a table and speed matters more than recoverability. Perfect for staging tables, test resets, and bulk operations.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Both commands have their place. Knowing when to use each is the mark of a developer who understands SQL at more than just syntax level.
      </p>
    </div>
  );
}
