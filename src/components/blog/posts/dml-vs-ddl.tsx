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

export default function DmlVsDdlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Every SQL command falls into one of two categories: commands that define
        your database structure (DDL) or commands that work with the actual data
        (DML). Understanding this distinction is fundamental to writing
        effective SQL.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#quick-answer" className="hover:underline">
              Quick Answer: DDL vs DML
            </a>
          </li>
          <li>
            •{" "}
            <a href="#what-is-ddl" className="hover:underline">
              What is DDL?
            </a>
          </li>
          <li>
            •{" "}
            <a href="#what-is-dml" className="hover:underline">
              What is DML?
            </a>
          </li>
          <li>
            •{" "}
            <a href="#key-differences" className="hover:underline">
              Key Differences
            </a>
          </li>
          <li>
            •{" "}
            <a href="#complete-picture" className="hover:underline">
              The Complete Picture: DDL, DML, DCL, TCL
            </a>
          </li>
          <li>
            •{" "}
            <a href="#truncate-controversy" className="hover:underline">
              The TRUNCATE Controversy
            </a>
          </li>
          <li>
            •{" "}
            <a href="#transaction-behavior" className="hover:underline">
              Transaction Behavior
            </a>
          </li>
          <li>
            •{" "}
            <a href="#quiz" className="hover:underline">
              Quiz: Test Your Knowledge
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

      {/* ─── Section 1: Quick Answer ─── */}
      <h2
        id="quick-answer"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Answer: DDL vs DML
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Think of it like architecture vs interior design. DDL builds the house
        (tables, indexes, schemas). DML fills it with furniture (rows of data).
      </p>

      <ComparisonTable
        headers={["Category", "Purpose", "Commands", "Affects"]}
        rows={[
          [
            "DDL",
            "Define structure",
            "CREATE, ALTER, DROP, TRUNCATE",
            "Tables, indexes, schemas",
          ],
          [
            "DML",
            "Manipulate data",
            "SELECT, INSERT, UPDATE, DELETE",
            "Rows within tables",
          ],
        ]}
        caption="DDL vs DML at a Glance"
      />

      {/* ─── Section 2: What is DDL? ─── */}
      <h2
        id="what-is-ddl"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What is DDL (Data Definition Language)?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        DDL commands define the <strong>structure</strong> of your database.
        They create, modify, and remove database objects like tables, indexes,
        and views.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">DDL Commands:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • <strong>CREATE</strong>: Build new tables, indexes, views, schemas
          </li>
          <li>
            • <strong>ALTER</strong>: Modify existing structures (add columns,
            change data types)
          </li>
          <li>
            • <strong>DROP</strong>: Completely remove database objects
          </li>
          <li>
            • <strong>TRUNCATE</strong>: Remove all rows AND reset the table
            (see the controversy section below)
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Creating a Database for Crime Investigations:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- CREATE: Build the suspects table
CREATE TABLE suspects (
    suspect_id INT PRIMARY KEY,
    name VARCHAR(100),
    last_seen DATE
);

-- ALTER: Add a column for alibis
ALTER TABLE suspects ADD COLUMN alibi TEXT;

-- DROP: Remove the table entirely
DROP TABLE suspects;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Each command changes the database structure itself, not the data
          inside.
        </p>
      </div>

      <FlowDiagram
        nodes={[
          { label: "CREATE TABLE", icon: "🏗️", type: "start" },
          { label: "ALTER TABLE", icon: "🔧", type: "process" },
          { label: "DROP TABLE", icon: "💥", type: "process" },
          { label: "TRUNCATE TABLE", icon: "🗑️", type: "end" },
        ]}
        caption="DDL commands modify database structure, not data"
      />

      <DetectiveTip variant="tip" title="Detective&apos;s Note">
        Think of DDL as the architect&apos;s blueprints. Before you can investigate a
        crime (query data), someone has to build the police station (create the
        database structure).
      </DetectiveTip>

      {/* ─── Section 3: What is DML? ─── */}
      <h2
        id="what-is-dml"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What is DML (Data Manipulation Language)?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        DML commands work with the <strong>data</strong> inside your tables.
        They let you read, add, modify, and remove individual rows.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">DML Commands:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • <strong>SELECT</strong>: Retrieve/read data (some classify this as
            DQL)
          </li>
          <li>
            • <strong>INSERT</strong>: Add new rows of data
          </li>
          <li>
            • <strong>UPDATE</strong>: Modify existing data values
          </li>
          <li>
            • <strong>DELETE</strong>: Remove specific rows of data
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Investigating Suspects with DML:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- INSERT: Add a suspect to the database
INSERT INTO suspects (suspect_id, name, last_seen)
VALUES (1, 'John Doe', '1986-08-14');

-- SELECT: Find suspects seen after a certain date
SELECT * FROM suspects WHERE last_seen > '1986-08-01';

-- UPDATE: Record an alibi for a suspect
UPDATE suspects SET alibi = 'Claims he was at the marina'
WHERE suspect_id = 1;

-- DELETE: Remove a cleared suspect
DELETE FROM suspects WHERE suspect_id = 1;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Each command works with rows of data, not the table structure.
        </p>
      </div>

      <SQLQueryBreakdown
        clauses={[
          { keyword: "UPDATE", code: "suspects", annotation: "DML command targeting a table" },
          { keyword: "SET", code: "alibi = 'At the marina'", annotation: "New value to assign" },
          { keyword: "WHERE", code: "suspect_id = 1", annotation: "Filter to specific row" },
        ]}
        caption="Anatomy of a DML UPDATE statement"
      />

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed my-8">
        DML commands are what you&apos;ll use most when investigating data. If you
        want to practice SELECT, INSERT, and UPDATE in a real database,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to crack mysteries.
      </p>

      {/* ─── Section 4: Key Differences ─── */}
      <h2
        id="key-differences"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        DDL vs DML: Key Differences
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The core distinction is simple: DDL changes <em>structure</em>, DML
        changes <em>data</em>. But this one difference leads to several
        important practical implications.
      </p>

      <FlowDiagram
        nodes={[
          { label: "Are you CHANGING the database structure?", icon: "❓", type: "start" },
          { label: "YES → Use DDL (CREATE, ALTER, DROP)", icon: "🏗️", type: "process" },
          { label: "Are you WORKING with data inside tables?", icon: "❓", type: "process" },
          { label: "YES → Use DML (SELECT, INSERT, UPDATE, DELETE)", icon: "📊", type: "end" },
        ]}
        caption="Quick decision guide: structure changes = DDL, data changes = DML"
      />

      <ComparisonTable
        headers={["Aspect", "DDL", "DML"]}
        rows={[
          ["Full Name", "Data Definition Language", "Data Manipulation Language"],
          ["Purpose", "Define database structure", "Manipulate data within tables"],
          ["Commands", "CREATE, ALTER, DROP, TRUNCATE", "SELECT, INSERT, UPDATE, DELETE"],
          ["Affects", "Tables, indexes, views, schemas", "Rows/records within tables"],
          ["Auto-Commit", "Yes (changes are permanent immediately)", "No (can be rolled back in transaction)"],
          ["Permissions", "Higher privileges required", "Lower privileges (read/write access)"],
          ["Frequency", "Rare (schema changes)", "Constant (CRUD operations)"],
          ["WHERE Clause", "Not applicable", "Used to filter affected rows"],
          ["Can Use Rollback?", "No (in most databases)", "Yes"],
          ["Triggers Fired?", "No", "Yes (INSERT, UPDATE, DELETE triggers)"],
        ]}
        caption="Complete DDL vs DML Comparison"
      />

      {/* ─── Section 5: Complete Picture ─── */}
      <h2
        id="complete-picture"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The Complete Picture: DDL, DML, DCL, and TCL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL commands are actually divided into four categories, not just two.
        Here&apos;s the complete picture:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          All Four SQL Command Types:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- DDL: Define structure
CREATE TABLE evidence (evidence_id INT PRIMARY KEY);

-- DML: Manipulate data
INSERT INTO evidence VALUES (1);

-- DCL: Control access
GRANT SELECT ON evidence TO detective_jones;

-- TCL: Manage transactions
COMMIT;`}
        </pre>
      </div>

      <ComparisonTable
        headers={["Category", "Stands For", "Commands", "Purpose"]}
        rows={[
          ["DDL", "Data Definition Language", "CREATE, ALTER, DROP, TRUNCATE", "Define database structure"],
          ["DML", "Data Manipulation Language", "SELECT, INSERT, UPDATE, DELETE", "Work with data"],
          ["DCL", "Data Control Language", "GRANT, REVOKE", "Control access permissions"],
          ["TCL", "Transaction Control Language", "COMMIT, ROLLBACK, SAVEPOINT", "Manage transactions"],
        ]}
        caption="The Four Categories of SQL Commands"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Some textbooks add a fifth category: <strong>DQL</strong> (Data Query
        Language) to separate SELECT from other DML commands. The logic is that
        SELECT reads data without modifying it. In practice, most people group
        SELECT with DML.
      </p>

      {/* ─── Section 6: TRUNCATE Controversy ─── */}
      <h2
        id="truncate-controversy"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The TRUNCATE Controversy: DDL or DML?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        TRUNCATE is the most debated command. It removes all data from a table,
        which sounds like DML. But it&apos;s officially classified as DDL. Why?
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          TRUNCATE vs DELETE Behavior:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- DML: DELETE can be filtered and rolled back
DELETE FROM suspects WHERE status = 'cleared';
ROLLBACK; -- Works! Data is restored

-- DDL: TRUNCATE cannot be rolled back (in most databases)
TRUNCATE TABLE suspects;
-- ROLLBACK won't work - data is gone permanently`}
        </pre>
      </div>

      <BeforeAfter
        before={{
          code: "DELETE FROM suspects;",
          label: "DELETE (DML)",
          issues: [
            "Can filter with WHERE clause",
            "Fires DELETE triggers",
            "Can be rolled back in a transaction",
            "Slower on large tables (row by row)",
            "Maintains auto-increment values",
          ],
        }}
        after={{
          code: "TRUNCATE TABLE suspects;",
          label: "TRUNCATE (DDL)",
          improvements: [
            "Removes ALL rows (no WHERE)",
            "Does NOT fire triggers",
            "Cannot be rolled back (most databases)",
            "Instant on large tables (drops pages)",
            "Resets auto-increment to 1",
          ],
        }}
        caption="TRUNCATE behaves like a structural operation despite removing data"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        The bottom line: TRUNCATE is DDL because of <em>how</em> it works, not
        <em>what</em> it does. It effectively drops and recreates the table
        structure internally. For a deeper dive, see our{" "}
        <Link
          href="/blog/delete-vs-truncate"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          DELETE vs TRUNCATE guide
        </Link>
        .
      </p>

      {/* ─── Section 7: Transaction Behavior ─── */}
      <h2
        id="transaction-behavior"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Transaction Behavior: Why It Matters
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The most important practical difference: DDL commands auto-commit, while
        DML commands can be rolled back. This affects how you work in
        production.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          DML: Safe Inside Transactions
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`BEGIN TRANSACTION;

DELETE FROM suspects WHERE name = 'Wrong Person';
-- Oops! Deleted the wrong suspect

ROLLBACK;
-- Phew, data is restored!`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          DML mistakes can be undone if you&apos;re inside a transaction.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          DDL: No Going Back
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`DROP TABLE evidence;
-- No going back now... the table is gone

-- ROLLBACK won't help here`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          DDL auto-commits immediately. No transaction can save you.
        </p>
      </div>

      <DetectiveTip variant="warning" title="Case File Warning">
        Always back up your database before running DDL commands in production.
        Unlike DML mistakes that can be rolled back, a DROP TABLE is permanent.
        Many a detective has lost crucial evidence to an accidental DROP.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>PostgreSQL exception:</strong> PostgreSQL allows DDL inside
        transactions, so you <em>can</em> rollback a DROP TABLE if you haven&apos;t
        committed yet. But this is the exception, not the rule. MySQL, Oracle,
        and SQL Server all auto-commit DDL.
      </p>

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Now that you understand how DML queries work, put your SELECT and JOIN skills to the test. Investigate surveillance records, hotel check-ins, and witness statements to find the killer."
        difficulty="intermediate"
        href="/cases"
      />

      {/* ─── Section 8: Quiz ─── */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quiz: DDL or DML?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Test your understanding. Can you classify each SQL command correctly?
      </p>

      <QuickQuiz
        title="🔍 Command Classification Challenge"
        questions={[
          {
            question: "CREATE INDEX idx_name ON suspects(name);",
            options: ["DDL", "DML", "DCL", "TCL"],
            correctIndex: 0,
            explanation:
              "CREATE INDEX is DDL because it defines a new database structure (an index) to optimize queries.",
          },
          {
            question: "SELECT * FROM suspects WHERE last_seen > '1986-08-01';",
            options: ["DDL", "DML", "DCL", "TCL"],
            correctIndex: 1,
            explanation:
              "SELECT is DML (some say DQL) because it retrieves data from the database without changing structure.",
          },
          {
            question: "TRUNCATE TABLE old_cases;",
            options: ["DDL", "DML", "DCL", "TCL"],
            correctIndex: 0,
            explanation:
              "TRUNCATE is DDL! Even though it removes data, it cannot be rolled back, doesn't fire triggers, and resets auto-increment. It's effectively a DROP + CREATE.",
          },
          {
            question: "GRANT SELECT ON evidence TO detective_jones;",
            options: ["DDL", "DML", "DCL", "TCL"],
            correctIndex: 2,
            explanation:
              "GRANT is DCL (Data Control Language) because it controls access permissions, not structure or data.",
          },
        ]}
      />

      {/* ─── Section 9: FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Is SELECT DDL or DML?
          </h4>
          <p className="text-gray-700">
            SELECT is DML (Data Manipulation Language). Some categorize it
            separately as DQL (Data Query Language) since it reads data without
            modifying it, but it&apos;s most commonly grouped with DML alongside
            INSERT, UPDATE, and DELETE.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            What is the main difference between DDL and DML?
          </h4>
          <p className="text-gray-700">
            DDL (Data Definition Language) defines database STRUCTURE, such as
            creating, altering, and dropping tables. DML (Data Manipulation
            Language) works with the DATA inside those tables, including selecting,
            inserting, updating, and deleting rows.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Can DDL commands be rolled back?
          </h4>
          <p className="text-gray-700">
            In most databases (MySQL, Oracle, SQL Server), DDL commands
            auto-commit and cannot be rolled back. PostgreSQL is an exception.
            It allows DDL within transactions that can be rolled back. Always
            back up before running DDL in production.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            Why is TRUNCATE considered DDL and not DML?
          </h4>
          <p className="text-gray-700">
            TRUNCATE is DDL because: (1) it cannot be rolled back in most
            databases, (2) it doesn&apos;t fire DELETE triggers, (3) it resets
            auto-increment counters, and (4) it&apos;s implemented as DROP + CREATE
            internally. It removes data but behaves like a structural operation.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2">
            What are the 4 types of SQL commands?
          </h4>
          <p className="text-gray-700">
            SQL commands are categorized into 4 types: DDL (CREATE, ALTER, DROP,
            TRUNCATE), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE
            for permissions), and TCL (COMMIT, ROLLBACK, SAVEPOINT for
            transactions).
          </p>
        </div>
      </div>

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put DML into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          Understanding DDL vs DML is foundational for any SQL work. Now that
          you&apos;ve got the concepts down, the best way to cement your DML skills is
          through practice. SQLNoir lets you run SELECT, JOIN, and WHERE queries
          against real databases while solving detective mysteries.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* Related Posts */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/blog/delete-vs-truncate"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              DELETE vs TRUNCATE: When to Use Each
            </Link>
          </li>
          <li>
            <Link
              href="/blog/sql-for-data-analysts"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL for Data Analysts: Complete Guide
            </Link>
          </li>
          <li>
            <Link
              href="/blog/sql-window-functions"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL Window Functions Explained
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
