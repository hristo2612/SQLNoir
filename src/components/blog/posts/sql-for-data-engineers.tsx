"use client";

import Link from "next/link";

export default function SqlForDataEngineersContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed mb-6">
        Data engineers write more SQL than anyone else in the building. If you want to build pipelines that don&apos;t break at 3 AM, here&apos;s what you need to know.
      </p>

      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li><a href="#what-makes-different" className="text-amber-700 hover:text-amber-900 underline">What Makes Data Engineering SQL Different</a></li>
          <li><a href="#seven-skills" className="text-amber-700 hover:text-amber-900 underline">The 7 SQL Skills Every Data Engineer Needs</a></li>
          <li><a href="#modern-data-stack" className="text-amber-700 hover:text-amber-900 underline">SQL in the Modern Data Stack</a></li>
          <li><a href="#engineer-vs-analyst" className="text-amber-700 hover:text-amber-900 underline">Data Engineer vs Data Analyst</a></li>
          <li><a href="#interview-questions" className="text-amber-700 hover:text-amber-900 underline">SQL Interview Questions for Data Engineers</a></li>
          <li><a href="#learning-roadmap" className="text-amber-700 hover:text-amber-900 underline">8-Week Learning Roadmap</a></li>
          <li><a href="#common-mistakes" className="text-amber-700 hover:text-amber-900 underline">Common Mistakes to Avoid</a></li>
          <li><a href="#faq" className="text-amber-700 hover:text-amber-900 underline">FAQ</a></li>
        </ul>
      </div>

      <h2 id="what-makes-different" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        What Makes Data Engineering SQL Different
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Data engineering SQL is fundamentally different from the SQL you write for analytics or business intelligence. While data analysts craft queries to answer specific business questions, data engineers build SQL that runs unattended in production pipelines, often processing millions of rows at scheduled intervals.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Key Point:</h4>
        <p className="text-gray-700">
          When your SQL runs at 2 AM with no one watching, it needs to be bulletproof. One broken query can cascade through your entire data warehouse, breaking dashboards and reports across the organization.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Data Engineers Focus On:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Pipeline reliability and idempotency</li>
            <li>Incremental processing and performance</li>
            <li>Data quality and schema design</li>
            <li>Handling edge cases and NULL values</li>
            <li>Historical tracking and SCD patterns</li>
            <li>Scalability for millions of rows</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Data Analysts Focus On:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Ad-hoc queries for specific questions</li>
            <li>Report generation and dashboards</li>
            <li>Business logic and calculations</li>
            <li>Exploratory data analysis</li>
            <li>Aggregations and summarization</li>
            <li>Speed of insight delivery</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL for data engineering demands a different mindset. Your queries need to be idempotent (safe to run multiple times), handle partial failures gracefully, and perform well at scale. This is production code, not exploratory analysis.
      </p>

      <h2 id="seven-skills" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        The 7 SQL Skills Every Data Engineer Needs
      </h2>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. CTEs (Common Table Expressions)</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        CTEs are the foundation of readable, maintainable pipeline SQL. They let you break complex transformations into logical steps, making debugging infinitely easier when something breaks at 3 AM.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Multi-Stage Investigation Pipeline</h4>
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
    COUNT(e.evidence_id) as evidence_count
  FROM validated_cases c
  LEFT JOIN dim_detectives d ON c.detective_id = d.detective_id
  LEFT JOIN fact_evidence e ON c.case_id = e.case_id
  GROUP BY c.case_id, c.detective_id, c.reported_date, 
           c.case_status, c.priority_level, d.detective_name, d.department
)

SELECT * FROM enriched_cases;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Each CTE represents a clear transformation step. When the pipeline fails, you can query each CTE individually to find exactly where the problem occurred.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice building multi-stage ETL pipelines hands-on,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to solve mysteries — each case requires chaining CTEs to transform raw evidence into actionable insights.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Window Functions</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions let you perform calculations across rows without collapsing your result set. Critical for ranking, running totals, and detecting changes over time.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Tracking Case Status Changes</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  case_id,
  status_timestamp,
  case_status,
  LAG(case_status) OVER (PARTITION BY case_id ORDER BY status_timestamp) as previous_status,
  LEAD(case_status) OVER (PARTITION BY case_id ORDER BY status_timestamp) as next_status,
  ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY status_timestamp DESC) as recency_rank,
  SUM(CASE WHEN case_status = 'closed' THEN 1 ELSE 0 END) 
    OVER (PARTITION BY case_id ORDER BY status_timestamp) as times_closed
FROM case_status_history
WHERE case_id IN (SELECT case_id FROM active_investigations);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          LAG and LEAD access previous and next rows. ROW_NUMBER helps identify the most recent record. All without GROUP BY.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Data Deduplication</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Duplicates are inevitable in real-world data pipelines. Source systems send duplicate events, APIs return duplicates, and network retries create duplicates. You need bulletproof deduplication logic.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Removing Duplicate Evidence Records</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH ranked_evidence AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY evidence_id 
      ORDER BY collected_timestamp DESC, ingestion_timestamp DESC
    ) as row_num
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
          ROW_NUMBER() with PARTITION BY identifies duplicates. We keep the most recently collected record. This pattern works for any deduplication scenario.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Always define a deterministic tiebreaker in your ORDER BY clause. If two records are truly identical, include a unique column like an ingestion timestamp or row ID to ensure consistent results.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Incremental Loading</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Full table scans are expensive and slow. Incremental loading processes only new or changed records, dramatically improving pipeline performance and reducing costs.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Incremental Case Updates</h4>
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
  WHERE updated_at > (SELECT MAX(last_updated) FROM warehouse.dim_suspects)
) source
ON target.suspect_id = source.suspect_id
WHEN MATCHED THEN 
  UPDATE SET
    suspect_name = source.suspect_name,
    known_aliases = source.known_aliases,
    last_seen_location = source.last_seen_location,
    last_updated = source.updated_at
WHEN NOT MATCHED THEN
  INSERT (suspect_id, suspect_name, known_aliases, last_seen_location, last_updated)
  VALUES (source.suspect_id, source.suspect_name, source.known_aliases, 
          source.last_seen_location, source.updated_at);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          MERGE handles both inserts and updates in one statement. The WHERE clause filters to only recent changes, processing a tiny fraction of total rows.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Data Quality Checks</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Data quality checks should be embedded directly in your pipeline SQL. Catch bad data before it pollutes your warehouse.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Quality Validation Before Loading</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH quality_checks AS (
  SELECT 
    'null_case_ids' as check_name,
    COUNT(*) as failure_count
  FROM staging.new_cases
  WHERE case_id IS NULL
  
  UNION ALL
  
  SELECT 
    'future_dates' as check_name,
    COUNT(*) as failure_count
  FROM staging.new_cases
  WHERE reported_date > CURRENT_DATE
  
  UNION ALL
  
  SELECT 
    'invalid_status' as check_name,
    COUNT(*) as failure_count
  FROM staging.new_cases
  WHERE case_status NOT IN ('open', 'investigating', 'closed', 'cold')
)

SELECT * FROM quality_checks WHERE failure_count > 0;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Run this before your main pipeline. If any check returns rows, halt the pipeline and alert. Prevention beats cleanup.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Slowly Changing Dimensions (SCD)</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Tracking historical changes is essential for accurate reporting. Type 2 SCD is the industry standard for maintaining history in dimension tables.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Type 2 SCD Implementation</h4>
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
  detective_id,
  detective_name,
  department,
  rank,
  valid_from,
  valid_to,
  is_current
)
SELECT 
  detective_id,
  detective_name,
  department,
  rank,
  CURRENT_DATE as valid_from,
  '2099-12-31'::DATE as valid_to,
  TRUE as is_current
FROM staging.detective_updates;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Type 2 SCD maintains full history. Each change creates a new row with valid_from and valid_to dates. The is_current flag simplifies queries for the latest state.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">7. Performance Optimization</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding query execution plans is non-negotiable for data engineers. Your pipelines process millions of rows. A poorly optimized query can run for hours instead of minutes.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Analyzing Query Performance</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Check execution plan before running expensive query
EXPLAIN ANALYZE
SELECT 
  c.case_id,
  c.case_status,
  COUNT(e.evidence_id) as evidence_count
FROM cases c
LEFT JOIN evidence e ON c.case_id = e.case_id
WHERE c.reported_date >= '2024-01-01'
GROUP BY c.case_id, c.case_status;

-- Add index to improve join performance
CREATE INDEX idx_evidence_case_id ON evidence(case_id);

-- Partition large tables by date for faster queries
CREATE TABLE cases_partitioned (
  case_id BIGINT,
  reported_date DATE,
  case_status VARCHAR(50)
) PARTITION BY RANGE (reported_date);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          EXPLAIN ANALYZE shows exactly where your query spends time. Add indexes on JOIN and WHERE columns. Partition tables by date or other high-cardinality columns.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Put Window Functions & Deduplication into Practice
          </p>
          <p className="text-amber-700 text-sm">
            These seven SQL patterns form the backbone of production pipelines. SQLNoir cases challenge you to combine CTEs, window functions, and incremental loading logic to solve real detective mysteries—the same techniques you&apos;ll use daily building idempotent data pipelines.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      <h2 id="modern-data-stack" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        SQL in the Modern Data Stack
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL is the transformation layer in modern ELT (Extract, Load, Transform) pipelines. Regardless of which tools you use, SQL skills for data engineering remain essential.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Where SQL Powers Your Stack:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>dbt (data build tool):</strong> Entire transformation layer written in SQL. Models, tests, and documentation all SQL-based.</li>
          <li><strong>Snowflake:</strong> Cloud data warehouse with powerful SQL dialect. Supports CTEs, window functions, and advanced optimization.</li>
          <li><strong>BigQuery:</strong> Google&apos;s serverless warehouse. SQL interface to petabyte-scale data with built-in ML functions.</li>
          <li><strong>Redshift:</strong> AWS data warehouse. PostgreSQL-compatible SQL with distribution keys and sort keys for optimization.</li>
          <li><strong>Spark SQL:</strong> Distributed SQL engine for big data. Same SQL concepts, different execution model for massive scale.</li>
        </ul>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        The syntax may vary slightly between platforms, but the core SQL concepts for data engineering remain constant. Master CTEs, window functions, and performance optimization, and you can work with any modern data warehouse.
      </p>

      <h2 id="engineer-vs-analyst" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Data Engineer vs Data Analyst: Different SQL, Different Goals
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Both roles write SQL daily, but they solve fundamentally different problems. Understanding the distinction helps you focus your learning on what actually matters for data engineering.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Data Engineer SQL:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Pipeline orchestration and scheduling</li>
            <li>Schema design and table optimization</li>
            <li>MERGE, UPSERT, incremental patterns</li>
            <li>Data quality validation logic</li>
            <li>SCD implementations</li>
            <li>Performance tuning for batch jobs</li>
            <li>Idempotent, production-ready code</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Data Analyst SQL:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Exploratory queries and discovery</li>
            <li>Business metrics and KPIs</li>
            <li>Aggregations and summarization</li>
            <li>Ad-hoc reporting</li>
            <li>Dashboard data preparation</li>
            <li>Quick iteration on analysis</li>
            <li>Human-readable query results</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">What Data Engineers Can Skip:</h4>
        <p className="text-gray-700">
          You don&apos;t need to master every SQL tutorial aimed at beginners. Basic SELECT statements and simple JOINs are table stakes. Focus instead on production patterns: incremental processing, data quality, historical tracking, and performance at scale. Those are the skills that separate junior from senior data engineers.
        </p>
      </div>

      <h2 id="interview-questions" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        SQL Interview Questions for Data Engineers
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Interview questions for data engineering roles focus on practical pipeline problems, not brain teasers. Here are real scenarios you&apos;ll encounter.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 1: Deduplicate a Table</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          A table has duplicate rows based on user_id. Keep only the most recent record for each user based on timestamp.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`DELETE FROM user_events
WHERE (user_id, event_timestamp) NOT IN (
  SELECT user_id, MAX(event_timestamp)
  FROM user_events
  GROUP BY user_id
);

-- Better performance with CTE:
WITH latest_events AS (
  SELECT user_id, MAX(event_timestamp) as max_timestamp
  FROM user_events
  GROUP BY user_id
)
DELETE FROM user_events ue
WHERE NOT EXISTS (
  SELECT 1 FROM latest_events le
  WHERE le.user_id = ue.user_id 
    AND le.max_timestamp = ue.event_timestamp
);`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 2: Find Gaps in Sequential Data</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          Find missing case_ids in a sequence (e.g., 1, 2, 4, 5, 8 has gaps at 3, 6, 7).
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH case_sequence AS (
  SELECT 
    case_id,
    LEAD(case_id) OVER (ORDER BY case_id) as next_case_id
  FROM cases
)
SELECT 
  case_id + 1 as gap_start,
  next_case_id - 1 as gap_end
FROM case_sequence
WHERE next_case_id - case_id > 1;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 3: Calculate Running Totals</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  case_date,
  cases_opened,
  SUM(cases_opened) OVER (ORDER BY case_date) as cumulative_cases,
  AVG(cases_opened) OVER (
    ORDER BY case_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as seven_day_avg
FROM daily_case_stats
ORDER BY case_date;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 4: Write an Idempotent MERGE</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          Write a MERGE statement that can run multiple times safely without creating duplicates or incorrect updates.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`MERGE INTO warehouse.suspects target
USING staging.suspect_updates source
ON target.suspect_id = source.suspect_id 
  AND target.is_current = TRUE
WHEN MATCHED AND source.updated_at > target.last_updated THEN
  UPDATE SET
    suspect_name = source.suspect_name,
    last_updated = source.updated_at
WHEN NOT MATCHED THEN
  INSERT (suspect_id, suspect_name, last_updated, is_current)
  VALUES (source.suspect_id, source.suspect_name, source.updated_at, TRUE);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The key is the additional condition checking updated_at. This prevents re-processing old data if the pipeline runs twice.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 5: Implement Type 2 SCD</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Problem:</h4>
        <p className="text-gray-700 mb-3">
          A detective changes departments. Update the dimension table while preserving history.
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- Expire old record
UPDATE dim_detectives
SET 
  valid_to = CURRENT_DATE,
  is_current = FALSE
WHERE detective_id = 1042
  AND is_current = TRUE;

-- Insert new record
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

      <p className="text-gray-700 leading-relaxed mb-6">
        Practice these patterns with realistic datasets. The muscle memory you build solving these problems will carry directly into production pipeline work.
      </p>

      <h2 id="learning-roadmap" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        How to Learn SQL for Data Engineering (8-Week Roadmap)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learning SQL for data engineering requires deliberate practice on production patterns, not just syntax. Here&apos;s a focused 8-week plan.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Weeks 1-2: SQL Foundations</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>SELECT, WHERE, ORDER BY, LIMIT</li>
          <li>JOINs (INNER, LEFT, RIGHT, FULL)</li>
          <li>GROUP BY, HAVING, aggregate functions</li>
          <li>Subqueries and basic CTEs</li>
          <li>CASE statements and NULL handling</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Weeks 3-4: Advanced SQL</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Multi-level CTEs and complex transformations</li>
          <li>Window functions (ROW_NUMBER, RANK, LAG, LEAD)</li>
          <li>Advanced JOINs and self-joins</li>
          <li>UNION, INTERSECT, EXCEPT</li>
          <li>Date/time functions and manipulation</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Weeks 5-6: Pipeline SQL</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>MERGE and UPSERT patterns</li>
          <li>Incremental loading strategies</li>
          <li>Data quality validation queries</li>
          <li>Slowly Changing Dimensions (SCD Type 1 & 2)</li>
          <li>Idempotency and error handling</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Weeks 7-8: Practice & Optimization</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Query execution plans and EXPLAIN</li>
          <li>Index optimization and partitioning</li>
          <li>Interview question practice</li>
          <li>Real pipeline scenarios and debugging</li>
          <li>Build a portfolio project (end-to-end pipeline)</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Spend 80% of your time on weeks 5-8. Foundations are important, but production pipeline patterns are what actually get you hired. Practice on realistic datasets with millions of rows to understand performance implications.
        </p>
      </div>

      <h2 id="common-mistakes" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Common Mistakes Data Engineers Make with SQL
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">1. Using SELECT * in Production Pipelines</h4>
        <p className="text-gray-700 mb-2">
          SELECT * makes your pipeline fragile. When someone adds a column to the source table, your pipeline breaks or starts pulling sensitive data you didn&apos;t intend to process.
        </p>
        <p className="text-gray-700 font-semibold">Fix: Always specify exact columns needed.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">2. Not Handling NULLs Properly</h4>
        <p className="text-gray-700 mb-2">
          NULL != NULL in SQL. Comparisons with NULL require IS NULL or IS NOT NULL, not = or !=. Missing this breaks JOIN conditions and WHERE filters silently.
        </p>
        <p className="text-gray-700 font-semibold">Fix: Use COALESCE() for defaults and IS NULL for comparisons.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">3. Missing Indexes on Large Tables</h4>
        <p className="text-gray-700 mb-2">
          Joining or filtering large tables without indexes forces full table scans. A query that should take seconds runs for hours.
        </p>
        <p className="text-gray-700 font-semibold">Fix: Create indexes on JOIN keys and frequently filtered columns.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">4. Writing Non-Idempotent Queries</h4>
        <p className="text-gray-700 mb-2">
          If your pipeline runs twice (network retry, manual rerun, scheduler glitch), will it create duplicate data or corrupt your tables? Non-idempotent SQL is a production disaster waiting to happen.
        </p>
        <p className="text-gray-700 font-semibold">Fix: Use MERGE instead of INSERT. Add timestamp checks. Design for reruns.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">5. Ignoring Query Execution Plans</h4>
        <p className="text-gray-700 mb-2">
          Running queries blind without checking EXPLAIN plans means you have no idea if you&apos;re doing full table scans, inefficient joins, or missing obvious optimizations.
        </p>
        <p className="text-gray-700 font-semibold">Fix: Always EXPLAIN before deploying expensive queries to production.</p>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Master Production SQL Patterns Through Detective Work
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You&apos;ve learned the theory—now apply SCD Type 2, incremental MERGE statements, and data quality checks to solve actual detective cases. Each investigation mirrors real pipeline challenges: handling duplicates, tracking historical changes, and writing queries that run reliably in production.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Is SQL enough for data engineering?</h4>
        <p className="text-gray-700">
          SQL is essential but not sufficient. Data engineers also need Python (or Scala), orchestration tools (Airflow, Prefect), cloud platforms (AWS, GCP, Azure), and infrastructure knowledge (Docker, Kubernetes). But SQL is the foundation. You&apos;ll write more SQL than anything else.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Do data engineers need to know Python and SQL?</h4>
        <p className="text-gray-700">
          Yes. SQL handles data transformations within the warehouse. Python handles orchestration, API calls, custom business logic, and anything that can&apos;t be expressed in SQL. Modern data engineers are fluent in both. Start with SQL, add Python as you encounter problems SQL can&apos;t solve.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Is SQL still relevant for data engineering in 2026?</h4>
        <p className="text-gray-700">
          Absolutely. SQL has been the standard for 50 years and isn&apos;t going anywhere. Every modern data warehouse (Snowflake, BigQuery, Redshift, Databricks) uses SQL as its primary interface. Tools like dbt are doubling down on SQL. The syntax evolves, but SQL concepts for data engineering remain fundamental.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">What&apos;s the best way to practice SQL for data engineering?</h4>
        <p className="text-gray-700">
          Practice on realistic, large datasets with production patterns. Build an end-to-end pipeline: load data incrementally, deduplicate, track history with SCD, add quality checks, optimize performance. Focus on scenarios designed specifically for data engineering practice, not just syntax puzzles.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Ready to Master SQL for Data Engineering?</h4>
        <p className="text-gray-700">
          SQL for data engineering is different from analytics SQL. You need production patterns, pipeline reliability, and performance optimization to build the exact skills data engineers use in production every day.
        </p>
      </div>
    </div>
  );
}
