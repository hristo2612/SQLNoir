"use client";

import Link from "next/link";
import {
  ComparisonTable,
  EntityRelationship,
  FlowDiagram,
} from "@/components/blog/diagrams";
import {
  SQLQueryBreakdown,
  BeforeAfter,
  QuickQuiz,
  DetectiveTip,
  MysteryTeaser,
} from "@/components/blog/content";

export default function PrimaryKeyVsForeignKey() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Quick Navigation */}
      <div className="not-prose my-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3">Quick Navigation</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { text: "Quick Answer", id: "quick-answer" },
            { text: "What is Primary Key?", id: "what-is-primary-key" },
            { text: "What is Foreign Key?", id: "what-is-foreign-key" },
            { text: "How They Work Together", id: "keys-work-together" },
            { text: "Referential Integrity", id: "referential-integrity" },
            { text: "Full Comparison", id: "full-comparison" },
            { text: "Common Mistakes", id: "common-mistakes" },
            { text: "Quiz", id: "quiz" },
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
        If you&apos;ve ever stared at a database and wondered why some columns are marked as keys while others aren&apos;t, you&apos;re not alone. Primary keys and foreign keys are the backbone of relational databases, but most explanations make them sound more complicated than they need to be. Let&apos;s fix that.
      </p>

      {/* Reddit sentiment callout */}
      <div className="not-prose my-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium text-amber-800">
            Real question from r/SQL
          </span>
        </div>
        <blockquote className="text-gray-700 text-sm leading-relaxed italic">
          &ldquo;PLEASE explain foreign keys to me like I am six years old&rdquo;
        </blockquote>
      </div>

      {/* Quick Answer */}
      <h2
        id="quick-answer"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Quick Answer: Primary Key vs Foreign Key
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the TL;DR:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>
          <strong>Primary key:</strong> Unique identifier for each row in a table (like a suspect ID in a criminal database)
        </li>
        <li>
          <strong>Foreign key:</strong> A reference to a primary key in another table (like case_id in an evidence table linking back to cases)
        </li>
        <li>
          <strong>Key difference:</strong> Primary keys ensure uniqueness; foreign keys ensure relationships
        </li>
      </ul>

      <ComparisonTable
        headers={["Feature", "Primary Key", "Foreign Key"]}
        rows={[
          ["Purpose", "Uniquely identifies each row", "Links to another table"],
          ["Uniqueness", "Must be unique", "Can have duplicates"],
          ["NULL allowed", "No", "Yes (usually)"],
          ["Count per table", "Only one", "Multiple allowed"],
          ["Automatically indexed", "Yes", "No (but recommended)"],
        ]}
        caption="Quick reference comparison"
      />

      {/* What is Primary Key? */}
      <h2
        id="what-is-primary-key"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What is a Primary Key?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A primary key is a column (or combination of columns) that uniquely identifies each row in a table. Think of it like a suspect ID in a criminal database: no two suspects share the same ID, and every suspect must have one.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Four rules of primary keys:</strong>
      </p>

      <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
        <li><strong>Unique:</strong> No duplicates allowed</li>
        <li><strong>Not null:</strong> Every row must have a value</li>
        <li><strong>Immutable:</strong> Should rarely change (changing IDs causes chaos)</li>
        <li><strong>Indexed:</strong> Automatically indexed for fast lookups</li>
      </ol>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "CREATE TABLE",
            code: "CREATE TABLE suspects (",
            annotation: "Define a new table",
          },
          {
            keyword: "PRIMARY KEY",
            code: "suspect_id INT PRIMARY KEY,",
            annotation: "This column uniquely identifies each suspect",
          },
          {
            keyword: "columns",
            code: "name VARCHAR(100),\n  age INT,\n  last_seen DATE\n);",
            annotation: "Other suspect information",
          },
        ]}
        caption="CREATE TABLE with primary key"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        You can also define a <strong>composite primary key</strong> using multiple columns. This is common in junction tables:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Composite Primary Key Example:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE TABLE case_suspects (
  case_id INT,
  suspect_id INT,
  role VARCHAR(50),
  PRIMARY KEY (case_id, suspect_id)
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The combination of case_id + suspect_id must be unique.
        </p>
      </div>

      {/* What is Foreign Key? */}
      <h2
        id="what-is-foreign-key"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What is a Foreign Key?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A foreign key is a column that references the primary key of another table. It creates a relationship between tables and enforces <em>referential integrity</em> (meaning you can&apos;t link to something that doesn&apos;t exist).
      </p>

      {/* Reddit analogy */}
      <div className="not-prose my-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium text-amber-800">
            Community analogy from r/explainlikeimfive
          </span>
        </div>
        <blockquote className="text-gray-700 text-sm leading-relaxed italic">
          &ldquo;Think of it like social security numbers. Your SSN is your primary key. When a bank stores your account, they use your SSN as a foreign key to link back to you.&rdquo;
        </blockquote>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        In a detective database, evidence belongs to a specific case. The <code>case_id</code> in the evidence table is a foreign key that references the <code>case_id</code> primary key in the cases table:
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "CREATE TABLE",
            code: "CREATE TABLE evidence (",
            annotation: "Evidence table stores clues",
          },
          {
            keyword: "PRIMARY KEY",
            code: "evidence_id INT PRIMARY KEY,",
            annotation: "Each piece of evidence has unique ID",
          },
          {
            keyword: "FOREIGN KEY",
            code: "case_id INT,\n  description TEXT,\n  FOREIGN KEY (case_id) REFERENCES cases(case_id)",
            annotation: "Links this evidence to a specific case",
          },
        ]}
        caption="CREATE TABLE with foreign key"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Unlike primary keys, foreign keys can have duplicates (many pieces of evidence can belong to the same case) and can be NULL (evidence might not be assigned to a case yet).
      </p>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Want to practice JOINing tables with primary and foreign keys?{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        challenge you to query across multiple related tables to crack mysteries.
      </p>

      {/* How Keys Work Together */}
      <h2
        id="keys-work-together"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How Primary and Foreign Keys Work Together
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Keys create relationships between tables. In a detective database, you might have suspects, cases, evidence, and interviews. Here&apos;s how they connect:
      </p>

      <EntityRelationship
        tables={[
          {
            name: "suspects",
            columns: ["suspect_id", "name", "age", "last_seen"],
            primaryKey: "suspect_id",
          },
          {
            name: "cases",
            columns: ["case_id", "title", "status", "lead_detective"],
            primaryKey: "case_id",
          },
          {
            name: "evidence",
            columns: ["evidence_id", "case_id", "description", "found_date"],
            primaryKey: "evidence_id",
          },
          {
            name: "interviews",
            columns: ["interview_id", "case_id", "suspect_id", "transcript"],
            primaryKey: "interview_id",
          },
        ]}
        relations={[
          { from: "cases", to: "evidence", fromColumn: "case_id", toColumn: "case_id", type: "1:N", label: "One case has many pieces of evidence" },
          { from: "cases", to: "interviews", fromColumn: "case_id", toColumn: "case_id", type: "1:N", label: "One case has many interviews" },
          { from: "suspects", to: "interviews", fromColumn: "suspect_id", toColumn: "suspect_id", type: "1:N", label: "One suspect can have many interviews" },
        ]}
        caption="Detective database schema showing primary and foreign key relationships"
      />

      <DetectiveTip variant="clue" title="The Key Insight">
        Primary keys are the &ldquo;anchor&rdquo; that other tables reference. Foreign keys are the &ldquo;links&rdquo; that create the chain. Without this relationship, you&apos;d need to duplicate data everywhere.
      </DetectiveTip>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the complete schema in SQL:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Complete Detective Database:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Suspects table (primary key: suspect_id)
CREATE TABLE suspects (
  suspect_id INT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  last_seen DATE
);

-- Cases table (primary key: case_id)
CREATE TABLE cases (
  case_id INT PRIMARY KEY,
  title VARCHAR(200),
  status VARCHAR(50),
  lead_detective VARCHAR(100)
);

-- Evidence table (foreign key references cases)
CREATE TABLE evidence (
  evidence_id INT PRIMARY KEY,
  case_id INT,
  description TEXT,
  found_date DATE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

-- Interviews table (foreign keys reference both cases AND suspects)
CREATE TABLE interviews (
  interview_id INT PRIMARY KEY,
  case_id INT,
  suspect_id INT,
  transcript TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id),
  FOREIGN KEY (suspect_id) REFERENCES suspects(suspect_id)
);`}
        </pre>
      </div>

      {/* Referential Integrity */}
      <h2
        id="referential-integrity"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Referential Integrity: What Happens When You Delete Data?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s where it gets interesting. What happens when you delete a case that has linked evidence? The foreign key constraint controls this behavior:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>
          <strong>CASCADE:</strong> Delete the parent, and all child rows are automatically deleted too
        </li>
        <li>
          <strong>RESTRICT:</strong> Prevent deletion if child rows exist (default in most databases)
        </li>
        <li>
          <strong>SET NULL:</strong> Set the foreign key to NULL when the parent is deleted
        </li>
        <li>
          <strong>NO ACTION:</strong> Similar to RESTRICT, but checked at end of transaction
        </li>
      </ul>

      <FlowDiagram
        nodes={[
          { label: "DELETE FROM cases WHERE case_id = 1", icon: "🗑️", type: "start" },
          { label: "Check for linked evidence", icon: "🔍", type: "process" },
          { label: "CASCADE: Delete evidence too", icon: "💥", type: "process" },
          { label: "RESTRICT: Block the delete", icon: "🚫", type: "process" },
          { label: "SET NULL: Orphan the evidence", icon: "❓", type: "end" },
        ]}
        caption="What happens when you delete a parent row depends on your ON DELETE setting"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s how you define these behaviors:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">ON DELETE CASCADE:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE TABLE evidence (
  evidence_id INT PRIMARY KEY,
  case_id INT,
  description TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
    ON DELETE CASCADE
);

-- Now when you delete a case:
DELETE FROM cases WHERE case_id = 1;
-- All evidence linked to case 1 is automatically deleted!`}
        </pre>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">ON DELETE RESTRICT (safer):</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE TABLE evidence (
  evidence_id INT PRIMARY KEY,
  case_id INT,
  description TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
    ON DELETE RESTRICT
);

-- Now when you try to delete a case with evidence:
DELETE FROM cases WHERE case_id = 1;
-- ERROR: Cannot delete - dependent records exist!`}
        </pre>
      </div>

      <BeforeAfter
        before={{
          code: "cases: [(1, 'Miami Murder')]\nevidence: [(1, 1, 'Fingerprint'), (2, 1, 'Weapon')]",
          label: "Before: DELETE FROM cases WHERE case_id = 1",
          issues: ["Case 1 exists with 2 pieces of evidence linked to it"],
        }}
        after={{
          code: "cases: (empty)\nevidence: (empty)",
          label: "After: With ON DELETE CASCADE",
          improvements: [
            "Case 1 deleted",
            "Both evidence rows automatically removed",
            "No orphaned records",
          ],
        }}
        caption="CASCADE deletes cascade to all related child rows"
      />

      <DetectiveTip variant="warning" title="Danger Zone">
        CASCADE is powerful but dangerous. One wrong DELETE can wipe out years of related data. Use RESTRICT in production unless you have a specific reason for CASCADE.
      </DetectiveTip>

      {/* Full Comparison */}
      <h2
        id="full-comparison"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Primary Key vs Foreign Key: Full Comparison
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the comprehensive side-by-side breakdown:
      </p>

      <ComparisonTable
        headers={["Aspect", "Primary Key", "Foreign Key"]}
        rows={[
          ["Purpose", "Uniquely identifies rows", "Creates relationships between tables"],
          ["Uniqueness", "Must be unique (no duplicates)", "Duplicates allowed"],
          ["NULL values", "Never allowed", "Allowed (unless constrained)"],
          ["Count per table", "Exactly one", "Zero or more"],
          ["Automatically indexed", "Yes (always)", "No (must add manually)"],
          ["References another table", "No", "Yes (references a primary key)"],
          ["Can be composite", "Yes (multiple columns)", "Yes (multiple columns)"],
          ["Modification", "Difficult to change", "Can be updated if new value exists"],
          ["Delete behavior", "Cannot delete if referenced", "Configurable (CASCADE, RESTRICT, etc.)"],
          ["Performance impact", "Speeds up lookups", "Slows writes (integrity checks)"],
        ]}
        caption="10-point comparison of primary and foreign keys"
      />

      {/* Tier 2 CTA */}
      <MysteryTeaser
        caseNumber={3}
        caseTitle="The Miami Marina Murder"
        challenge="Put your primary and foreign key knowledge to work. Join suspects, interviews, and hotel check-ins to find the killer."
        difficulty="intermediate"
        href="/cases"
      />

      {/* Common Mistakes */}
      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Mistakes (And How to Avoid Them)
      </h2>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 1: Forgetting the Foreign Key Constraint
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Just because a column is named <code>customer_id</code> doesn&apos;t make it a foreign key. You need to explicitly define the constraint:
      </p>

      <BeforeAfter
        before={{
          code: `CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT  -- No constraint!
);`,
          label: "❌ Wrong: No foreign key constraint",
          issues: [
            "Can insert orders with non-existent customer_id",
            "Orphaned records possible",
            "Data integrity compromised",
          ],
        }}
        after={{
          code: `CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) 
    REFERENCES customers(customer_id)
);`,
          label: "✅ Right: Foreign key constraint enforced",
          improvements: [
            "Database enforces valid customer_id",
            "Cannot insert invalid references",
            "Data integrity guaranteed",
          ],
        }}
        caption="Always define foreign key constraints explicitly"
      />

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 2: Using Business Data as Primary Key
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Using email addresses, phone numbers, or social security numbers as primary keys seems convenient but causes problems when that data changes:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">❌ Wrong:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE TABLE customers (
  email VARCHAR(255) PRIMARY KEY,  -- Bad idea!
  name VARCHAR(100)
);

-- What happens when a customer changes their email?
-- You have to update EVERY table that references it!`}
        </pre>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">✅ Right:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,  -- Unique constraint, not primary key
  name VARCHAR(100)
);

-- Email can change; customer_id stays constant forever.`}
        </pre>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
        Mistake 3: Not Indexing Foreign Key Columns
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Primary keys are automatically indexed, but foreign keys are not. This means JOINs on foreign keys can be slow on large tables:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- After creating your table with foreign key:
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_interviews_case_id ON interviews(case_id);
CREATE INDEX idx_interviews_suspect_id ON interviews(suspect_id);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Index foreign key columns for faster JOINs and constraint checking.
        </p>
      </div>

      <DetectiveTip variant="tip" title="Pro Tip">
        Most database tools show you which columns are indexed. Check your foreign keys. If they&apos;re not indexed and you JOIN on them frequently, add indexes.
      </DetectiveTip>

      {/* Quiz */}
      <h2
        id="quiz"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Test Your Understanding
      </h2>

      <QuickQuiz
        title="🔑 Primary Key vs Foreign Key Quiz"
        questions={[
          {
            question: "A primary key column can contain NULL values.",
            options: ["True", "False"],
            correctIndex: 1,
            explanation:
              "Primary keys can NEVER be NULL. They must uniquely identify each row, and NULL is not a valid unique identifier.",
          },
          {
            question: "How many foreign keys can a single table have?",
            options: ["Only one", "Zero or more", "Exactly two", "One per column"],
            correctIndex: 1,
            explanation:
              "A table can have zero, one, or many foreign keys. Each foreign key creates a relationship to another table.",
          },
          {
            question:
              "What happens with ON DELETE CASCADE when you delete a parent row?",
            options: [
              "Nothing - the delete is blocked",
              "The parent row is deleted, child rows remain",
              "Both parent and all linked child rows are deleted",
              "The foreign key is set to NULL",
            ],
            correctIndex: 2,
            explanation:
              "CASCADE means the action 'cascades' to child rows. Deleting a parent deletes all children that reference it.",
          },
          {
            question: "Why should you create an index on foreign key columns?",
            options: [
              "It's required by SQL",
              "To prevent NULL values",
              "To speed up JOINs and constraint checks",
              "To allow duplicate values",
            ],
            correctIndex: 2,
            explanation:
              "Unlike primary keys, foreign keys are NOT automatically indexed. Adding an index speeds up JOINs and the constraint checking that happens on every INSERT/UPDATE.",
          },
        ]}
      />

      {/* FAQ */}
      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        FAQ
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Can a foreign key also be a primary key?
          </h3>
          <p className="text-gray-700">
            Yes! In junction tables for many-to-many relationships, the composite primary key often consists of two foreign keys. Example: a <code>case_suspects</code> table with <code>(case_id, suspect_id)</code> as the composite primary key, where both columns are also foreign keys.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Can a table have multiple primary keys?
          </h3>
          <p className="text-gray-700">
            No. A table can have only ONE primary key. However, that primary key can be a COMPOSITE key made of multiple columns. You might hear &ldquo;multiple primary keys&rdquo; but this is incorrect terminology.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            What is a composite key?
          </h3>
          <p className="text-gray-700">
            A composite key is a primary key made of two or more columns. All columns together must be unique. Common in junction tables: <code>PRIMARY KEY (order_id, product_id)</code>.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Do foreign keys hurt database performance?
          </h3>
          <p className="text-gray-700">
            Foreign keys add overhead on INSERT, UPDATE, and DELETE because the database must check referential integrity. However, this overhead is usually small and the data integrity benefits outweigh the cost. Index your foreign key columns to minimize the impact.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Is a foreign key required?
          </h3>
          <p className="text-gray-700">
            No. Foreign keys are optional but strongly recommended. Without them, the database allows orphaned records (evidence linked to non-existent cases). You CAN skip them, but your data quality will suffer.
          </p>
        </div>
      </div>

      {/* Reddit sentiment - why keys matter */}
      <div className="not-prose my-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium text-amber-800">
            Common frustration from r/learnprogramming
          </span>
        </div>
        <blockquote className="text-gray-700 text-sm leading-relaxed italic">
          &ldquo;I keep seeing these terms but nobody explains WHY you&apos;d use them, just WHAT they are&rdquo;
        </blockquote>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        The WHY is simple: primary keys let you find specific rows instantly, and foreign keys let you connect related data without duplicating it. Without keys, you&apos;d either have massive duplication or no way to link your data together.
      </p>

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to practice with primary and foreign keys?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s detective cases let you query across related tables to solve mysteries. No signup required for beginner cases.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>
    </div>
  );
}
