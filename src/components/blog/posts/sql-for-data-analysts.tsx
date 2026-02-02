"use client";

import Link from "next/link";
import {
  ComparisonTable,
  FlowDiagram,
  ProcessSteps,
} from "@/components/blog/diagrams";

export default function SqlForDataAnalystsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        SQL is the single most requested skill in data analyst job postings.
        This guide covers the exact SQL skills you need, with real queries you
        will write on the job.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Quick Navigation
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#why-sql" className="hover:underline">
              Why Data Analysts Need SQL (Not Just Excel)
            </a>
          </li>
          <li>
            •{" "}
            <a href="#query-execution-order" className="hover:underline">
              How SQL Actually Works: Query Execution Order
            </a>
          </li>
          <li>
            •{" "}
            <a href="#core-skills" className="hover:underline">
              The 7 SQL Skills Every Data Analyst Needs
            </a>
          </li>
          <li>
            •{" "}
            <a href="#business-queries" className="hover:underline">
              Real Business Queries You Will Write on the Job
            </a>
          </li>
          <li>
            •{" "}
            <a href="#interview-skills" className="hover:underline">
              SQL Skills That Win Data Analyst Interviews
            </a>
          </li>
          <li>
            •{" "}
            <a href="#learning-roadmap" className="hover:underline">
              Your 8-Week SQL Learning Roadmap
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

      {/* ─── Section 1: Why SQL ──────────────────────────────────────────── */}

      <h2
        id="why-sql"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Why Data Analysts Need SQL (Not Just Excel)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Excel handles a few thousand rows fine. Modern businesses generate
        millions of records daily. Excel crashes at 1 million rows. SQL handles
        billions without breaking a sweat.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        The real difference: Excel downloads data to your computer. SQL queries
        the data where it lives, in production databases, data warehouses, and
        cloud systems. You get real-time answers without waiting for exports or
        crashing your laptop.
      </p>

      <ComparisonTable
        headers={["Task", "Excel", "SQL"]}
        rows={[
          ["Handle 1M+ rows", "❌ Crashes", "✅ Billions, no problem"],
          ["Combine data sources", "⚠️ VLOOKUP (fragile)", "✅ JOIN (robust)"],
          ["Reproduce analysis", "⚠️ Manual steps", "✅ Re-run query"],
          ["Automate reports", "⚠️ Macros (brittle)", "✅ Scheduled queries"],
          [
            "Team collaboration",
            "⚠️ Email files around",
            "✅ Shared query repo",
          ],
          [
            "Real-time data",
            "❌ Static exports",
            "✅ Live database queries",
          ],
        ]}
        caption="SQL vs Excel for Data Analysis Tasks"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Every major BI tool (Tableau, Power BI, Looker, Metabase) runs on SQL
        under the hood. When you write &quot;calculated fields&quot; or
        &quot;custom queries&quot; in these tools, you&apos;re writing SQL.
        Master SQL, and you master all of them.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          Your First SQL Query: Simple but Powerful
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    product_category,
    COUNT(*) as total_orders,
    SUM(revenue) as total_revenue,
    AVG(revenue) as avg_order_value
FROM orders
WHERE order_date >= '2025-01-01'
GROUP BY product_category
ORDER BY total_revenue DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This single query answers &quot;What are our top product categories
          this year?&quot; Something that would take multiple pivot tables and
          VLOOKUP formulas in Excel.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 1 */}
      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing aggregation queries hands-on,{" "}
        <Link
          href="/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to solve mysteries. Perfect for building
        muscle memory with GROUP BY, SUM, and COUNT patterns that show up in
        every dashboard.
      </p>

      {/* ─── Section 2: Query Execution Order ────────────────────────────── */}

      <h2
        id="query-execution-order"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        How SQL Actually Works: Query Execution Order
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The most common SQL confusion: the order you <strong>write</strong> a
        query is not the order the database <strong>runs</strong> it. You write
        SELECT first, but the database processes FROM first. Understanding this
        eliminates a whole class of errors.
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
            type: "process",
          },
          {
            label: "GROUP BY",
            description: "Create groups",
            icon: "📊",
            type: "process",
          },
          {
            label: "HAVING",
            description: "Filter groups",
            icon: "🎯",
            type: "process",
          },
          {
            label: "SELECT",
            description: "Pick columns & compute",
            icon: "✅",
            type: "process",
          },
          {
            label: "ORDER BY",
            description: "Sort results",
            icon: "↕️",
            type: "process",
          },
          {
            label: "LIMIT",
            description: "Cap row count",
            icon: "🔢",
            type: "end",
          },
        ]}
        caption="SQL Query Execution Order (not the same as writing order)"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        This is why you can&apos;t reference a column alias from SELECT inside a
        WHERE clause. WHERE runs before SELECT even exists. Here&apos;s a
        practical example with execution steps annotated:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          Execution Order in Action:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`-- You WRITE it in this order:
SELECT
    region,                          -- Step 5: Pick columns
    COUNT(*) as total_orders,        -- Step 5: Compute aggregates
    SUM(revenue) as total_revenue    -- Step 5: Compute aggregates
FROM orders                          -- Step 1: Start here
WHERE order_date >= '2025-01-01'     -- Step 2: Filter rows
GROUP BY region                      -- Step 3: Create groups
HAVING SUM(revenue) > 10000          -- Step 4: Filter groups
ORDER BY total_revenue DESC          -- Step 6: Sort
LIMIT 10;                            -- Step 7: Cap results`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The database starts at FROM, not SELECT. This is why
          &quot;total_revenue&quot; works in ORDER BY (step 6, after SELECT) but
          not in WHERE (step 2, before SELECT).
        </p>
      </div>

      {/* ─── Section 3: 7 Core SQL Skills ────────────────────────────────── */}

      <h2
        id="core-skills"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The 7 SQL Skills Every Data Analyst Needs
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        You don&apos;t need to memorize 200 SQL commands. These seven skills
        cover 95% of data analyst work. Master them, and interviewers will
        notice.
      </p>

      {/* Skill 1: SELECT & WHERE */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        1. SELECT and Filtering (WHERE)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every SQL query starts with SELECT. It picks which columns to retrieve.
        WHERE filters which rows to include. Think of it as Excel&apos;s filter
        dropdown, but infinitely more powerful.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT customer_name, email, total_purchases
FROM customers
WHERE signup_date >= '2024-01-01'
  AND total_purchases > 500
  AND country = 'USA';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Find high-value US customers who signed up this year. Filters combine
          with AND, OR, IN, BETWEEN, and LIKE for pattern matching.
        </p>
      </div>

      {/* Skill 2: Aggregation */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        2. Aggregation (COUNT, SUM, AVG, GROUP BY)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        This is where data analysis actually happens. Aggregate functions
        summarize data: count rows, sum values, calculate averages. GROUP BY
        breaks data into segments by region, by month, by product category.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    DATE_TRUNC('month', order_date) as month,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(revenue) as monthly_revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Monthly revenue and customer count trend. A classic analyst report you
          will write weekly.
        </p>
      </div>

      {/* Skill 3: JOINs */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        3. JOINs: Combining Data from Multiple Tables
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Real data lives across multiple tables. Customers in one table, orders
        in another, products in a third. JOINs connect them. This skill
        separates basic SQL users from actual data analysts. For a deep dive,
        see our{" "}
        <Link
          href="/blog/sql-join-types-explained"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          complete guide to SQL join types
        </Link>
        .
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    c.customer_name,
    COUNT(o.order_id) as total_orders,
    SUM(o.amount) as lifetime_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.amount) > 1000;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Customer lifetime value analysis. LEFT JOIN keeps all customers, even
          those with zero orders.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          💡 Pro Tip: Know Your JOINs
        </h4>
        <p className="text-gray-700">
          <strong>INNER JOIN</strong>: Only matching rows from both tables.
          <br />
          <strong>LEFT JOIN</strong>: All rows from the left table, matches from
          right (most common in analysis).
          <br />
          <strong>FULL OUTER JOIN</strong>: All rows from both tables, even
          without matches.
        </p>
      </div>

      {/* Skill 4: Subqueries */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        4. Subqueries: Queries Within Queries
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Sometimes you need two steps: &quot;Find all customers whose spending is
        above average.&quot; First, calculate the average. Then, filter by it.
        Subqueries let you do both in one statement.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT customer_name, total_spending
FROM customers
WHERE total_spending > (
    SELECT AVG(total_spending)
    FROM customers
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The inner query calculates the average; the outer query filters by it.
          One statement, two logical steps.
        </p>
      </div>

      {/* Skill 5: Window Functions */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        5. Window Functions: Advanced Analytics
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions are the power tools of SQL analytics. They calculate
        running totals, rankings, and comparisons without collapsing your rows.
        This is the skill that impresses interviewers and enables sophisticated
        analysis.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    salesperson,
    month,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY salesperson ORDER BY month
    ) as running_total,
    RANK() OVER (
        PARTITION BY month ORDER BY revenue DESC
    ) as monthly_rank
FROM sales;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Running totals and rankings per salesperson. Two window functions, one
          query, zero row collapse.
        </p>
      </div>

      {/* Skill 6: CASE WHEN */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        6. CASE WHEN: Conditional Logic in SQL
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        CASE WHEN is SQL&apos;s if/else. Use it to categorize data, create
        buckets, or build conditional aggregations. Data analysts use this daily
        for segmentation and reporting.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    customer_id,
    total_spent,
    CASE
        WHEN total_spent >= 5000 THEN 'VIP'
        WHEN total_spent >= 1000 THEN 'Regular'
        ELSE 'Occasional'
    END as customer_tier,
    CASE
        WHEN last_order_date >= CURRENT_DATE - INTERVAL '30 days'
            THEN 'Active'
        ELSE 'Inactive'
    END as status
FROM customers;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Two CASE expressions in one query: segment by spending tier and flag
          activity status. Your marketing team will request this weekly.
        </p>
      </div>

      {/* Skill 7: CTEs */}
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        7. CTEs: Readable Multi-Step Queries
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Common Table Expressions (CTEs) let you break complex queries into
        named, readable steps. Instead of nesting subqueries three levels deep,
        you write each step as a named block. Every senior analyst uses these.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(revenue) as revenue
    FROM orders
    GROUP BY 1
),
revenue_with_growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) as prev_month
    FROM monthly_revenue
)
SELECT
    month,
    revenue,
    prev_month,
    ROUND(100.0 * (revenue - prev_month) / prev_month, 1) as growth_pct
FROM revenue_with_growth
WHERE prev_month IS NOT NULL
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Month-over-month revenue growth in three clean steps. Each CTE builds
          on the last. Compare this readability to nested subqueries.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Practice These SQL Patterns Hands-On
          </p>
          <p className="text-amber-700 text-sm">
            The multi-table JOINs, aggregations, and window functions you just
            learned work the same way in detective cases. SQLNoir lets you query
            suspects, interviews, and evidence tables to crack mysteries.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      {/* ─── Section 4: Real Business Queries ────────────────────────────── */}

      <h2
        id="business-queries"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Real Business Queries You Will Write on the Job
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Theory is nice. Here are three queries you will actually write as a data
        analyst, taken from real business scenarios.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 1: Customer Segmentation
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;Segment our customers by
        purchase frequency and identify our VIPs.&quot;
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT
    customer_id,
    COUNT(*) as purchase_count,
    SUM(amount) as total_spent,
    CASE
        WHEN COUNT(*) >= 10 AND SUM(amount) >= 5000 THEN 'VIP'
        WHEN COUNT(*) >= 5 THEN 'Regular'
        ELSE 'Occasional'
    END as customer_segment
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY customer_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Combines aggregation (COUNT, SUM), filtering (WHERE with dates), and
          conditional logic (CASE WHEN) in one query. The output feeds directly
          into a marketing dashboard.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 2: Month-over-Month Growth
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;Show me revenue growth
        compared to the previous month.&quot;
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(revenue) as revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
    ROUND(
        100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
        / LAG(revenue) OVER (ORDER BY month), 1
    ) as growth_pct
FROM monthly_revenue
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Uses a CTE for the first aggregation step, then LAG() to compare each
          month against the previous one. Your CFO will ask for this report
          monthly.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 3: Cohort Retention Analysis
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;How well do we retain
        customers from each signup month?&quot;
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`WITH cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', signup_date) as cohort_month
    FROM customers
)
SELECT
    co.cohort_month,
    DATE_PART('month', AGE(o.order_date, co.cohort_month))
        as months_since_signup,
    COUNT(DISTINCT co.customer_id) as active_customers
FROM cohorts co
JOIN orders o ON co.customer_id = o.customer_id
GROUP BY 1, 2
ORDER BY 1, 2;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The foundation of a cohort retention table. Product and marketing
          teams use this to measure whether customers stick around after their
          first purchase.
        </p>
      </div>

      {/* ─── Section 5: Interview Skills ─────────────────────────────────── */}

      <h2
        id="interview-skills"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQL Skills That Win Data Analyst Interviews
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Technical interviews for data analyst roles almost always include SQL.
        Here is what interviewers actually test and the patterns that repeat.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          What Interviewers Actually Assess:
        </h4>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Problem decomposition:</strong> Can you break a complex
            question into steps?
          </li>
          <li>
            <strong>Business intuition:</strong> Do you understand what the
            question is really asking?
          </li>
          <li>
            <strong>SQL fluency:</strong> Can you write clean, correct queries
            without constant Googling?
          </li>
          <li>
            <strong>Edge case awareness:</strong> Do you handle NULLs,
            duplicates, and data quality issues?
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Common Interview Question Patterns
      </h3>

      <ComparisonTable
        headers={["Interview Pattern", "SQL Skills Tested", "Difficulty"]}
        rows={[
          [
            "Find the top N by metric",
            "GROUP BY, ORDER BY, LIMIT or RANK()",
            "⭐⭐",
          ],
          [
            "Compare time periods",
            "DATE functions, LAG(), window frames",
            "⭐⭐⭐",
          ],
          [
            "Users who did X but not Y",
            "LEFT JOIN + IS NULL, NOT IN",
            "⭐⭐⭐",
          ],
          [
            "Calculate rates or percentages",
            "CASE WHEN, COUNT, division",
            "⭐⭐",
          ],
          [
            "Cumulative / running totals",
            "SUM() OVER(), window functions",
            "⭐⭐⭐⭐",
          ],
        ]}
        caption="Common Data Analyst SQL Interview Patterns"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
        <h4 className="font-bold text-blue-900 mb-3">📚 Practice Resources</h4>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <strong>DataLemur</strong>: Company-specific interview questions from
            FAANG companies
          </li>
          <li>
            •{" "}
            <strong>LeetCode SQL</strong>: Ranked difficulty problems with
            community solutions
          </li>
          <li>
            •{" "}
            <strong>StrataScratch</strong>: Real interview questions from top
            companies
          </li>
          <li>
            •{" "}
            <strong>
              <Link
                href="/blog/games-to-learn-sql"
                className="text-blue-800 hover:text-blue-900 underline"
              >
                SQL Games
              </Link>
            </strong>
            : Learn SQL through detective stories and interactive puzzles
          </li>
        </ul>
      </div>

      {/* ─── Section 6: Learning Roadmap ─────────────────────────────────── */}

      <h2
        id="learning-roadmap"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Your 8-Week SQL Learning Roadmap
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here is a realistic timeline to go from zero to interview-ready. The key
        is consistent practice, not cramming. Curious about the overall
        difficulty?{" "}
        <Link
          href="/blog/is-sql-hard-to-learn"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          Read our honest assessment of how hard SQL is to learn
        </Link>
        .
      </p>

      <ProcessSteps
        steps={[
          {
            number: 1,
            title: "SELECT & Filter",
            description:
              "Master SELECT, WHERE, ORDER BY, LIMIT. Learn AND, OR, IN, BETWEEN, LIKE. Write 20-30 basic queries until the syntax is automatic.",
            duration: "Weeks 1-2",
            icon: "📝",
          },
          {
            number: 2,
            title: "Aggregate & Group",
            description:
              "GROUP BY with COUNT, SUM, AVG, MIN, MAX. Understand HAVING for filtering groups. Calculate metrics by segment.",
            duration: "Weeks 3-4",
            icon: "📊",
          },
          {
            number: 3,
            title: "JOINs & Subqueries",
            description:
              "INNER JOIN, LEFT JOIN, RIGHT JOIN. Subqueries in WHERE and FROM clauses. Practice with multi-table databases.",
            duration: "Weeks 5-6",
            icon: "🔗",
          },
          {
            number: 4,
            title: "Advanced & Interview Prep",
            description:
              "Window functions (ROW_NUMBER, RANK, LAG), CTEs, CASE WHEN. Solve interview-style problems daily.",
            duration: "Weeks 7-8",
            icon: "🎯",
          },
        ]}
        caption="8-Week SQL Learning Roadmap for Data Analysts"
      />

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          ⏱️ Daily Practice Commitment
        </h4>
        <p className="text-gray-700">
          30-45 minutes daily beats 4 hours on weekends. Consistency builds
          muscle memory. Aim for 2-3 practice problems per day during the
          learning phase, then 1 problem daily for maintenance.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to Put These SQL Skills Into Practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir&apos;s detective cases progress from beginner SELECT queries
          to advanced multi-table JOINs and complex analysis. The same SQL
          skills you need for dashboards and reports, applied to solving crimes.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* ─── Section 7: FAQ ──────────────────────────────────────────────── */}

      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            How long does it take to learn SQL for data analysis?
          </h4>
          <p className="text-gray-700">
            With focused daily practice, you can be job-ready in 6-8 weeks.
            Basic competency (SELECT, WHERE, GROUP BY) comes in 2-3 weeks.
            Interview-level proficiency with window functions and CTEs takes the
            full 8 weeks. See the{" "}
            <a href="#learning-roadmap" className="text-amber-700 underline">
              roadmap above
            </a>{" "}
            for a week-by-week breakdown.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Is SQL hard to learn for data analysts?
          </h4>
          <p className="text-gray-700">
            SQL has one of the gentlest learning curves in tech. The basics are
            intuitive and read almost like English. Advanced topics like window
            functions take more practice, but they are learnable by anyone who
            can think logically. For a deeper look, see our{" "}
            <Link
              href="/blog/is-sql-hard-to-learn"
              className="text-amber-700 hover:text-amber-900 underline"
            >
              honest guide to SQL difficulty
            </Link>
            .
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Which SQL dialect should I learn first?
          </h4>
          <p className="text-gray-700">
            Start with PostgreSQL or MySQL. They are the most common and
            standards-compliant. The core concepts (SELECT, JOIN, GROUP BY) are
            identical across all dialects. Differences are minor syntax
            variations you will pick up quickly on the job.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Do data analysts need Python too?
          </h4>
          <p className="text-gray-700">
            SQL alone can land you an entry-level data analyst role. Combining
            SQL with Python (for advanced analysis, visualization, and
            automation) makes you significantly more marketable and opens doors
            to senior positions. Learn SQL first, then add Python.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">
            Can AI replace SQL for data analysts?
          </h4>
          <p className="text-gray-700">
            AI tools can help write SQL faster, but they do not replace
            understanding. You still need to verify output, debug errors,
            optimize slow queries, and know when the AI got it wrong. Think of
            it like calculators: they did not replace the need to understand
            math. AI will not replace the need to understand SQL.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Start Practicing Today
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The job market rewards data analysts who can write clean, efficient
        queries. That skill comes from practice, not reading. Pick a resource
        from this guide, write your first query, and build from there. In eight
        weeks, you will be solving business problems that seem impossible today.
      </p>
    </div>
  );
}
