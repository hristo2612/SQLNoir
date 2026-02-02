"use client";

import Link from "next/link";
import {
  ComparisonTable,
  FlowDiagram,
  ProcessSteps,
} from "@/components/blog/diagrams";

export default function SqlForDataEngineersContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed mb-6">
        Data engineers write more SQL than anyone else in the building. If you
        want to build pipelines that don&apos;t break at 3 AM, here&apos;s what
        you actually need to know.
      </p>

      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li>
            <a
              href="#what-makes-different"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              What Makes Data Engineering SQL Different
            </a>
          </li>
          <li>
            <a
              href="#pipeline-stages"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              How Data Pipelines Use SQL
            </a>
          </li>
          <li>
            <a
              href="#seven-skills"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              The 7 SQL Skills Every Data Engineer Needs
            </a>
          </li>
          <li>
            <a
              href="#etl-vs-elt"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              ETL vs ELT: Where SQL Fits
            </a>
          </li>
          <li>
            <a
              href="#modern-data-stack"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL in the Modern Data Stack
            </a>
          </li>
          <li>
            <a
              href="#interview-questions"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              SQL Interview Questions for Data Engineers
            </a>
          </li>
          <li>
            <a
              href="#learning-roadmap"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              8-Week Learning Roadmap
            </a>
          </li>
          <li>
            <a
              href="#common-mistakes"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              Common Pipeline Mistakes to Avoid
            </a>
          </li>
          <li>
            <a
              href="#faq"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              FAQ
            </a>
          </li>
        </ul>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: What Makes DE SQL Different */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="what-makes-different"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        What Makes Data Engineering SQL Different
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A{" "}
        <Link
          href="/blog/sql-for-data-analysts"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          data analyst
        </Link>{" "}
        writes a query, checks the results, and moves on. A data engineer writes
        a query that runs every night at 2 AM with no one watching. If it fails,
        dashboards go dark and stakeholders start asking questions before your
        coffee is ready.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        That difference shapes everything about how data engineers approach SQL.
        Your queries need to be idempotent (safe to run multiple times),
        handle partial failures gracefully, and perform well at millions of rows.
        This is production code, not exploratory analysis.
      </p>

      <ComparisonTable
        headers={["Focus Area", "Data Engineer", "Data Analyst"]}
        rows={[
          ["Primary Goal", "Pipeline reliability", "Business insights"],
          ["SQL Runs...", "Unattended at 2 AM", "Ad-hoc during work hours"],
          ["Scale", "Millions of rows daily", "Thousands for reports"],
          [
            "Error Handling",
            "Must handle failures gracefully",
            "Can re-run manually",
          ],
          [
            "Key Patterns",
            "MERGE, SCD, incremental loads",
            "GROUP BY, window functions",
          ],
          [
            "Code Lifecycle",
            "Production deployable",
            "Exploratory, disposable",
          ],
        ]}
        caption="Data Engineer vs Data Analyst: Different SQL, Different Goals"
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: Pipeline Stages */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="pipeline-stages"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How Data Pipelines Use SQL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL powers every stage of a data pipeline. Whether you are building an
        ETL or ELT workflow, the same core patterns show up at each step.
      </p>

      <FlowDiagram
        nodes={[
          {
            label: "Extract",
            icon: "📥",
            type: "start",
            description: "Pull raw data from source systems",
          },
          {
            label: "Validate",
            icon: "🔍",
            type: "process",
            description: "Quality checks before transformation",
          },
          {
            label: "Transform",
            icon: "⚙️",
            type: "process",
            description: "Clean, deduplicate, enrich with CTEs",
          },
          {
            label: "Load",
            icon: "📦",
            type: "process",
            description: "MERGE into warehouse tables",
          },
          {
            label: "Monitor",
            icon: "📊",
            type: "end",
            description: "Post-load quality checks and alerts",
          },
        ]}
        caption="SQL Powers Every Stage of the Data Pipeline"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        The 7 skills below map directly to these pipeline stages. CTEs and
        window functions handle the Transform step. MERGE handles Load.
        Quality checks cover Validate and Monitor. Performance optimization
        keeps the entire pipeline running on schedule.
      </p>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: The 7 Skills */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="seven-skills"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The 7 SQL Skills Every Data Engineer Needs
      </h2>

      {/* ── Skill 1: CTEs ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        1. CTEs (Common Table Expressions)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        CTEs are the foundation of readable, maintainable pipeline SQL. They let
        you break complex transformations into logical steps, making debugging
        infinitely easier when something breaks at 3 AM.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Multi-Stage Pipeline
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH raw_cases AS (
  SELECT 
    case_id,
    detective_id,
    reported_date,
    case_status,
    priority_level
  FROM staging.incoming_cases
  WHERE reported_date >= CURRENT_DATE - INTERVAL '7 days'
),

validated_cases AS (
  SELECT *
  FROM raw_cases
  WHERE case_id IS NOT NULL
    AND detective_id IS NOT NULL
    AND case_status IN ('open', 'investigating', 'closed')
),

enriched_cases AS (
  SELECT 
    c.*,
    d.detective_name,
    d.department,
    COUNT(e.evidence_id) AS evidence_count
  FROM validated_cases c
  LEFT JOIN dim_detectives d ON c.detective_id = d.detective_id
  LEFT JOIN fact_evidence e ON c.case_id = e.case_id
  GROUP BY c.case_id, c.detective_id, c.reported_date, 
           c.case_status, c.priority_level,
           d.detective_name, d.department
)

SELECT * FROM enriched_cases;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Each CTE represents one transformation step: extract, validate,
          enrich. When the pipeline fails, query each CTE individually to find
          where the problem occurred.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        The same CTE patterns you use in production pipelines work in{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        where you chain multi-stage queries to solve mysteries by transforming
        raw evidence tables into actionable insights.
      </p>

      {/* ── Skill 2: Window Functions ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        2. Window Functions
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions let you perform calculations across rows without
        collapsing your result set. Critical for ranking, running totals, and
        detecting changes over time. If{" "}
        <Link
          href="/blog/sql-join-types-explained"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          JOINs
        </Link>{" "}
        combine tables horizontally, window functions let you look at rows
        vertically.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Tracking Case Status Changes
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
  case_id,
  status_timestamp,
  case_status,
  LAG(case_status) OVER (
    PARTITION BY case_id ORDER BY status_timestamp
  ) AS previous_status,
  LEAD(case_status) OVER (
    PARTITION BY case_id ORDER BY status_timestamp
  ) AS next_status,
  ROW_NUMBER() OVER (
    PARTITION BY case_id ORDER BY status_timestamp DESC
  ) AS recency_rank
FROM case_status_history
WHERE case_id IN (SELECT case_id FROM active_investigations);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          LAG and LEAD access previous and next rows. ROW_NUMBER identifies the
          most recent record. All without GROUP BY.
        </p>
      </div>

      {/* ── Skill 3: Deduplication ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        3. Data Deduplication
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Duplicates are inevitable. Source systems send duplicate events, APIs
        return duplicates, and network retries create more. You need bulletproof
        deduplication logic.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Removing Duplicate Evidence Records
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH ranked_evidence AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY evidence_id 
      ORDER BY collected_timestamp DESC, 
               ingestion_timestamp DESC
    ) AS row_num
  FROM staging.evidence_raw
)

INSERT INTO warehouse.fact_evidence
SELECT 
  evidence_id,
  case_id,
  evidence_type,
  collected_timestamp,
  chain_of_custody
FROM ranked_evidence
WHERE row_num = 1;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          ROW_NUMBER() with PARTITION BY identifies duplicates. We keep the most
          recently collected record. This pattern works for any deduplication
          scenario.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Always define a deterministic tiebreaker in your ORDER BY clause. If
          two records are truly identical, include a unique column like an
          ingestion timestamp to ensure consistent results across runs.
        </p>
      </div>

      {/* ── Skill 4: Incremental Loading ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        4. Incremental Loading
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Full table scans are expensive and slow. Incremental loading processes
        only new or changed records, dramatically improving pipeline performance
        and reducing costs.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Incremental Suspect Updates
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`MERGE INTO warehouse.dim_suspects target
USING (
  SELECT 
    suspect_id,
    suspect_name,
    known_aliases,
    last_seen_location,
    updated_at
  FROM staging.suspects_incremental
  WHERE updated_at > (
    SELECT MAX(last_updated) FROM warehouse.dim_suspects
  )
) source
ON target.suspect_id = source.suspect_id
WHEN MATCHED THEN 
  UPDATE SET
    suspect_name = source.suspect_name,
    known_aliases = source.known_aliases,
    last_seen_location = source.last_seen_location,
    last_updated = source.updated_at
WHEN NOT MATCHED THEN
  INSERT (suspect_id, suspect_name, known_aliases,
          last_seen_location, last_updated)
  VALUES (source.suspect_id, source.suspect_name,
          source.known_aliases, source.last_seen_location,
          source.updated_at);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          MERGE handles both inserts and updates in one statement. The WHERE
          clause filters to only recent changes, processing a fraction of total
          rows.
        </p>
      </div>

      {/* ── Skill 5: Data Quality ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        5. Data Quality Checks
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Data quality checks should be embedded directly in your pipeline SQL.
        Catch bad data before it pollutes your warehouse.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Quality Validation Before Loading
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH quality_checks AS (
  SELECT 
    'null_case_ids' AS check_name,
    COUNT(*) AS failure_count
  FROM staging.new_cases
  WHERE case_id IS NULL
  
  UNION ALL
  
  SELECT 
    'future_dates' AS check_name,
    COUNT(*) AS failure_count
  FROM staging.new_cases
  WHERE reported_date > CURRENT_DATE
  
  UNION ALL
  
  SELECT 
    'invalid_status' AS check_name,
    COUNT(*) AS failure_count
  FROM staging.new_cases
  WHERE case_status NOT IN (
    'open', 'investigating', 'closed', 'cold'
  )
)

SELECT * FROM quality_checks WHERE failure_count > 0;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Run this before your main pipeline. If any check returns rows, halt
          the pipeline and alert. Prevention beats cleanup every time.
        </p>
      </div>

      {/* ── Skill 6: SCD ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        6. Slowly Changing Dimensions (SCD)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Tracking historical changes is essential for accurate reporting. Type 2
        SCD is the industry standard for maintaining full history in dimension
        tables.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Type 2 SCD Implementation
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Step 1: Expire changed records
UPDATE warehouse.dim_detectives
SET 
  valid_to = CURRENT_DATE - INTERVAL '1 day',
  is_current = FALSE
WHERE detective_id IN (
  SELECT detective_id 
  FROM staging.detective_updates
)
AND is_current = TRUE;

-- Step 2: Insert new versions
INSERT INTO warehouse.dim_detectives (
  detective_id, detective_name, department,
  rank, valid_from, valid_to, is_current
)
SELECT 
  detective_id,
  detective_name,
  department,
  rank,
  CURRENT_DATE AS valid_from,
  '2099-12-31'::DATE AS valid_to,
  TRUE AS is_current
FROM staging.detective_updates;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Type 2 SCD maintains full history. Each change creates a new row with
          valid_from and valid_to dates. The is_current flag simplifies queries
          for the latest state.
        </p>
      </div>

      {/* ── Skill 7: Performance ── */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        7. Performance Optimization
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding query execution plans is non-negotiable for data
        engineers. Your pipelines process millions of rows. A poorly optimized
        query can run for hours instead of minutes.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: Analyzing Query Performance
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Check execution plan before running
EXPLAIN ANALYZE
SELECT 
  c.case_id,
  c.case_status,
  COUNT(e.evidence_id) AS evidence_count
FROM cases c
LEFT JOIN evidence e ON c.case_id = e.case_id
WHERE c.reported_date >= '2024-01-01'
GROUP BY c.case_id, c.case_status;

-- Add index to improve join performance
CREATE INDEX idx_evidence_case_id
  ON evidence(case_id);

-- Partition large tables by date
CREATE TABLE cases_partitioned (
  case_id BIGINT,
  reported_date DATE,
  case_status VARCHAR(50)
) PARTITION BY RANGE (reported_date);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          EXPLAIN ANALYZE shows where your query spends time. Add indexes on
          JOIN and WHERE columns. Partition tables by date for faster scans.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Practice These Patterns on Real Databases
          </p>
          <p className="text-amber-700 text-sm">
            The SQL skills you just learned (CTEs, window functions, complex
            JOINs, aggregations) transfer directly to SQLNoir&apos;s detective
            cases. Query real databases with tables like crime_scene, suspects,
            and interviews to build the muscle memory you need for pipeline work.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4: ETL vs ELT */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="etl-vs-elt"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        ETL vs ELT: Where SQL Fits
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The biggest shift in data engineering over the past decade is the move
        from ETL (Extract, Transform, Load) to ELT (Extract, Load, Transform).
        The difference matters because it changes SQL&apos;s role entirely.
      </p>

      <ComparisonTable
        headers={["Aspect", "ETL", "ELT"]}
        rows={[
          ["Transform Timing", "Before loading", "After loading"],
          ["Where SQL Runs", "Staging server", "Inside the warehouse"],
          [
            "Scale",
            "Limited by staging server",
            "Warehouse-scale (elastic)",
          ],
          [
            "Tools",
            "SSIS, Informatica, Talend",
            "dbt, Snowflake, BigQuery",
          ],
          ["Best For", "Legacy systems, on-prem", "Cloud data platforms"],
          [
            "SQL Role",
            "Part of the process",
            "The entire transformation layer",
          ],
        ]}
        caption="ETL vs ELT: How SQL's Role Differs"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        In the ELT world, SQL is not just one tool in the chain. It is the
        transformation layer. Tools like dbt codified this pattern: you write SQL
        models that define how raw data becomes clean, analytics-ready tables.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Example: dbt-Style SQL Model
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- models/mart_case_summary.sql
-- This runs inside your warehouse as an ELT transformation

WITH closed_cases AS (
  SELECT
    case_id,
    detective_id,
    reported_date,
    closed_date,
    closed_date - reported_date AS days_to_close
  FROM {{ ref('stg_cases') }}
  WHERE case_status = 'closed'
),

detective_stats AS (
  SELECT
    detective_id,
    COUNT(*) AS cases_closed,
    AVG(days_to_close) AS avg_days_to_close,
    MIN(days_to_close) AS fastest_close
  FROM closed_cases
  GROUP BY detective_id
)

SELECT
  d.detective_name,
  d.department,
  s.cases_closed,
  s.avg_days_to_close,
  s.fastest_close
FROM detective_stats s
JOIN {{ ref('dim_detectives') }} d
  ON s.detective_id = d.detective_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          In ELT, this SQL runs inside the warehouse. dbt manages dependencies
          between models, runs tests, and generates documentation automatically.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 5: Modern Data Stack */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="modern-data-stack"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQL in the Modern Data Stack
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Regardless of which tools you use, SQL skills for data engineering
        remain essential. The syntax varies slightly between platforms, but the
        core concepts transfer everywhere.
      </p>

      <ComparisonTable
        headers={["Tool", "Type", "SQL Dialect", "Key Feature"]}
        rows={[
          [
            "dbt",
            "Transform",
            "Jinja + SQL",
            "Version-controlled SQL models",
          ],
          [
            "Snowflake",
            "Warehouse",
            "ANSI SQL",
            "Auto-scaling, time travel",
          ],
          [
            "BigQuery",
            "Warehouse",
            "Standard SQL",
            "Serverless, ML functions",
          ],
          [
            "Redshift",
            "Warehouse",
            "PostgreSQL",
            "Distribution and sort keys",
          ],
          [
            "Spark SQL",
            "Processing",
            "HiveQL / ANSI",
            "Distributed processing",
          ],
          [
            "Airflow",
            "Orchestration",
            "SQL operators",
            "DAG-based scheduling",
          ],
        ]}
        caption="SQL in the Modern Data Stack"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Master CTEs, window functions, and performance optimization, and you can
        work with any modern data warehouse. The patterns from this guide apply
        whether you are writing raw SQL, dbt models, or Spark SQL jobs.
      </p>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 6: Interview Questions */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="interview-questions"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQL Interview Questions for Data Engineers
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Interview questions for data engineering roles focus on practical
        pipeline problems, not brain teasers. Here are real scenarios you will
        encounter.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Question 1: Deduplicate a Table
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          A table has duplicate rows based on user_id. Keep only the most recent
          record for each user.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH latest_events AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY event_timestamp DESC
    ) AS rn
  FROM user_events
)
DELETE FROM user_events
WHERE (user_id, event_timestamp) NOT IN (
  SELECT user_id, event_timestamp
  FROM latest_events
  WHERE rn = 1
);`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Question 2: Find Gaps in Sequential Data
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          Find missing case_ids in a sequence (e.g., 1, 2, 4, 5, 8 has gaps at
          3, 6, 7).
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH case_sequence AS (
  SELECT 
    case_id,
    LEAD(case_id) OVER (ORDER BY case_id) AS next_case_id
  FROM cases
)
SELECT 
  case_id + 1 AS gap_start,
  next_case_id - 1 AS gap_end
FROM case_sequence
WHERE next_case_id - case_id > 1;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Question 3: Running Totals and Moving Averages
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT 
  case_date,
  cases_opened,
  SUM(cases_opened) OVER (
    ORDER BY case_date
  ) AS cumulative_cases,
  AVG(cases_opened) OVER (
    ORDER BY case_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS seven_day_avg
FROM daily_case_stats
ORDER BY case_date;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Question 4: Write an Idempotent MERGE
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          Write a MERGE that can run multiple times safely without creating
          duplicates.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`MERGE INTO warehouse.suspects target
USING staging.suspect_updates source
ON target.suspect_id = source.suspect_id 
  AND target.is_current = TRUE
WHEN MATCHED 
  AND source.updated_at > target.last_updated THEN
  UPDATE SET
    suspect_name = source.suspect_name,
    last_updated = source.updated_at
WHEN NOT MATCHED THEN
  INSERT (suspect_id, suspect_name,
          last_updated, is_current)
  VALUES (source.suspect_id, source.suspect_name,
          source.updated_at, TRUE);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The additional condition checking updated_at prevents re-processing
          old data if the pipeline runs twice.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Question 5: Implement Type 2 SCD
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          A detective changes departments. Update the dimension table while
          preserving history.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- Expire the old record
UPDATE dim_detectives
SET valid_to = CURRENT_DATE, is_current = FALSE
WHERE detective_id = 1042 AND is_current = TRUE;

-- Insert the new version
INSERT INTO dim_detectives (
  detective_id, detective_name, department, 
  valid_from, valid_to, is_current
)
VALUES (
  1042, 'Sarah Chen', 'Homicide',
  CURRENT_DATE, '2099-12-31', TRUE
);`}
        </pre>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 7: Learning Roadmap */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="learning-roadmap"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How to Learn SQL for Data Engineering (8-Week Roadmap)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learning SQL for data engineering requires deliberate practice on
        production patterns, not just syntax. Here is a focused 8-week plan. If
        you are{" "}
        <Link
          href="/blog/is-sql-hard-to-learn"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          wondering whether SQL is hard to learn
        </Link>
        , the basics come quickly. The pipeline patterns in weeks 5 through 8
        are where real expertise develops.
      </p>

      <ProcessSteps
        steps={[
          {
            number: 1,
            title: "SQL Foundations",
            description:
              "SELECT, WHERE, JOINs, GROUP BY, HAVING, subqueries, basic CTEs, CASE statements, NULL handling",
            duration: "Weeks 1-2",
            icon: "📝",
          },
          {
            number: 2,
            title: "Advanced Patterns",
            description:
              "Window functions (ROW_NUMBER, RANK, LAG, LEAD), self-joins, UNION/INTERSECT/EXCEPT, date manipulation",
            duration: "Weeks 3-4",
            icon: "🔧",
          },
          {
            number: 3,
            title: "Pipeline SQL",
            description:
              "MERGE/UPSERT, incremental loading, data quality validation, SCD Type 2, idempotent query design",
            duration: "Weeks 5-6",
            icon: "⚙️",
          },
          {
            number: 4,
            title: "Optimization and Practice",
            description:
              "EXPLAIN plans, indexing strategy, partitioning, interview prep, build an end-to-end pipeline project",
            duration: "Weeks 7-8",
            icon: "🚀",
          },
        ]}
        caption="8-Week SQL Learning Roadmap for Data Engineers"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Spend 80% of your time on weeks 5 through 8. Foundations are important,
          but pipeline patterns are what actually get you hired. Practice on
          realistic datasets with millions of rows to understand performance at
          scale. For interactive practice,{" "}
          <Link
            href="/blog/games-to-learn-sql"
            className="text-blue-700 hover:text-blue-900 underline font-medium"
          >
            SQL learning games
          </Link>{" "}
          can help build query muscle memory.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to Put Pipeline SQL into Practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You have learned the theory: CTEs, window functions, MERGE, SCD
          patterns, and quality checks. Now drill those same SQL patterns by
          solving detective cases. Query multi-table databases to build the
          muscle memory that transfers to any data engineering work.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 8: Common Mistakes */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="common-mistakes"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Common Pipeline Mistakes to Avoid
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          1. Using SELECT * in Production
        </h4>
        <p className="text-gray-700 mb-2">
          SELECT * makes your pipeline fragile. When someone adds a column to
          the source table, your pipeline breaks or pulls sensitive data you
          didn&apos;t intend to process.
        </p>
        <p className="text-gray-700 font-semibold">
          Fix: Always specify exact columns.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          2. Not Handling NULLs Properly
        </h4>
        <p className="text-gray-700 mb-2">
          NULL != NULL in SQL. Comparisons with NULL require IS NULL or IS NOT
          NULL, not = or !=. Missing this breaks JOIN conditions and WHERE
          filters silently.
        </p>
        <p className="text-gray-700 font-semibold">
          Fix: Use COALESCE() for defaults and IS NULL for comparisons.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          3. Missing Indexes on Large Tables
        </h4>
        <p className="text-gray-700 mb-2">
          Joining or filtering large tables without indexes forces full table
          scans. A query that should take seconds runs for hours.
        </p>
        <p className="text-gray-700 font-semibold">
          Fix: Create indexes on JOIN keys and frequently filtered columns.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          4. Writing Non-Idempotent Queries
        </h4>
        <p className="text-gray-700 mb-2">
          If your pipeline runs twice (network retry, manual rerun, scheduler
          glitch), will it create duplicate data? Non-idempotent SQL is a
          production disaster waiting to happen.
        </p>
        <p className="text-gray-700 font-semibold">
          Fix: Use MERGE instead of INSERT. Add timestamp checks. Design for
          reruns.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          5. Ignoring EXPLAIN Plans
        </h4>
        <p className="text-gray-700 mb-2">
          Running queries blind without checking execution plans means you have
          no idea if your query is doing full table scans, inefficient joins, or
          missing obvious optimizations.
        </p>
        <p className="text-gray-700 font-semibold">
          Fix: Always run EXPLAIN before deploying expensive queries to
          production.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 9: FAQ */}
      {/* ────────────────────────────────────────────────────────────────── */}

      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Is SQL enough for data engineering?
        </h4>
        <p className="text-gray-700">
          SQL is essential but not sufficient on its own. Data engineers also
          need Python (or Scala), orchestration tools like Airflow or Prefect,
          cloud platforms (AWS, GCP, Azure), and infrastructure skills (Docker,
          Kubernetes). That said, SQL is the foundation. You will write more SQL
          than any other language in a typical data engineering role.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Do data engineers need to know Python and SQL?
        </h4>
        <p className="text-gray-700">
          Yes. SQL handles data transformations inside the warehouse. Python
          handles orchestration, API calls, custom business logic, and anything
          SQL cannot express. Modern data engineers are fluent in both. Start
          with SQL, then add Python as you hit problems SQL cannot solve.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Is SQL still relevant for data engineering in 2026?
        </h4>
        <p className="text-gray-700">
          Absolutely. SQL has been the standard for 50 years and is not going
          anywhere. Every modern data warehouse (Snowflake, BigQuery, Redshift,
          Databricks) uses SQL as its primary interface. Tools like dbt are
          doubling down on SQL. The syntax evolves, but the core concepts remain
          fundamental.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          What is the best way to practice SQL for data engineering?
        </h4>
        <p className="text-gray-700">
          Practice on realistic, large datasets using production patterns. Build
          an end-to-end pipeline: load data incrementally, deduplicate, track
          history with SCD, add quality checks, and optimize performance. Focus
          on pipeline scenarios rather than syntax puzzles.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Will AI replace SQL for data engineers?
        </h4>
        <p className="text-gray-700">
          AI can generate SQL queries, but it cannot design pipeline
          architectures, ensure idempotency across complex workflows, or handle
          the edge cases that break production systems. Think of it like
          calculators and math: calculators did not replace the need to
          understand mathematics. AI is a productivity tool, not a replacement
          for understanding how data pipelines work.
        </p>
      </div>
    </div>
  );
}
