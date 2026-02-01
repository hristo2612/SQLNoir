"use client";

import Link from "next/link";

export default function SqlForBusinessAnalystsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
        If you&apos;re a business analyst avoiding SQL, you&apos;re leaving insights on the table. Let&apos;s fix that.
      </p>

      {/* Quick Navigation */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li><a href="#do-business-analysts-need-sql" className="text-amber-700 hover:text-amber-900 underline">Do Business Analysts Really Need SQL?</a></li>
          <li><a href="#ba-vs-da" className="text-amber-700 hover:text-amber-900 underline">Business Analyst vs Data Analyst: Different SQL Needs</a></li>
          <li><a href="#five-sql-skills" className="text-amber-700 hover:text-amber-900 underline">The 5 SQL Skills Every Business Analyst Needs</a></li>
          <li><a href="#real-queries" className="text-amber-700 hover:text-amber-900 underline">Real Business Analyst Queries You&apos;ll Use at Work</a></li>
          <li><a href="#interview-questions" className="text-amber-700 hover:text-amber-900 underline">SQL Interview Questions for Business Analysts</a></li>
          <li><a href="#learning-roadmap" className="text-amber-700 hover:text-amber-900 underline">How to Learn SQL as a Business Analyst (6-Week Roadmap)</a></li>
          <li><a href="#common-mistakes" className="text-amber-700 hover:text-amber-900 underline">Common Mistakes Business Analysts Make with SQL</a></li>
        </ul>
      </div>

      <h2 id="do-business-analysts-need-sql" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Do Business Analysts Really Need SQL?</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Yes. According to LinkedIn&apos;s 2024 Jobs Report, over 65% of business analyst job postings list SQL as a required or preferred skill. That number has grown steadily over the past five years and shows no signs of slowing down. In 2026, SQL for business analysts isn&apos;t optional. It&apos;s expected.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        But here&apos;s the good news: the SQL skills you need as a BA are different from what developers use. You&apos;re not building databases or writing complex stored procedures. You&apos;re extracting answers from existing data. Your SQL is read-focused, not write-focused.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Key Point:</h4>
        <p className="text-gray-700">Business analysts who know SQL can answer stakeholder questions in minutes instead of waiting days for the data team. That speed creates massive competitive advantage in fast-moving organizations.</p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        When you can pull your own data, you control your timeline. You can explore hypotheses immediately, iterate on reports without dependencies, and bring concrete numbers to every meeting. SQL transforms you from someone who requests data into someone who discovers insights.
      </p>

      <h2 id="ba-vs-da" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Business Analyst vs Data Analyst: Different SQL Needs</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Business analysts and data analysts both use SQL, but their daily queries look quite different. Understanding this distinction helps you focus your learning on what actually matters for your role.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Business Analyst SQL Tasks:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Ad-hoc queries to answer stakeholder questions</li>
          <li>Building reports and dashboards</li>
          <li>Validating data for business requirements</li>
          <li>Exploring datasets to find patterns</li>
          <li>Extracting data for presentations</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Data Analyst SQL Tasks:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Complex statistical analysis</li>
          <li>Building and maintaining data pipelines</li>
          <li>Performance optimization</li>
          <li>Data modeling and schema design</li>
          <li>ETL processes and data transformation</li>
        </ul>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>What BAs can skip:</strong> Stored procedures, database administration, query optimization, indexing strategies, and complex window functions. These are valuable skills, but they&apos;re not essential for your day-to-day work.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>What BAs must master:</strong> SELECT statements, WHERE clauses, JOINs (especially INNER and LEFT), GROUP BY with aggregations, and basic date functions. These five areas will handle 90% of your queries.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice these SQL patterns hands-on,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write the same JOINs, aggregations, and multi-table queries by solving crime mysteries — the SQL skills transfer directly to the stakeholder questions and data exploration tasks you&apos;ll face as a BA.
      </p>

      <h2 id="five-sql-skills" className="text-3xl font-detective text-amber-900 mt-12 mb-6">The 5 SQL Skills Every Business Analyst Needs</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Let&apos;s break down each essential SQL skill for business analysts with practical examples you can use immediately.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. SELECT and Filtering</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every query starts with SELECT. Combined with WHERE, AND, OR, and IN, you can extract exactly the data you need from any table.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Find active enterprise customers</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT customer_name, email, signup_date
FROM customers
WHERE status = 'active'
  AND plan_type IN ('enterprise', 'business')
  AND signup_date >= '2024-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">This query filters customers by multiple conditions: active status, specific plan types, and recent signup dates.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Aggregations (COUNT, SUM, AVG, GROUP BY)</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Aggregations turn raw data into business metrics. COUNT tells you how many, SUM gives you totals, and AVG provides averages. GROUP BY lets you calculate these metrics for different categories.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Calculate average order value by region</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    region,
    COUNT(*) AS total_orders,
    SUM(order_amount) AS total_revenue,
    AVG(order_amount) AS avg_order_value
FROM orders
GROUP BY region
ORDER BY total_revenue DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">GROUP BY region creates separate calculations for each geographic area, while ORDER BY sorts results by revenue.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. JOINs (INNER and LEFT)</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs connect data from multiple tables. INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table plus matching records from the right. These two JOINs cover 90% of business analyst needs.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Get customer names with their orders</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    c.customer_name,
    c.email,
    o.order_id,
    o.order_date,
    o.order_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2024-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">INNER JOIN connects customers to their orders using the shared customer_id field. Only customers with orders appear in results.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Date Functions</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Business reporting lives and dies by dates. You need to filter by time periods, extract months or years, and calculate date differences. Syntax varies by database, but the concepts remain consistent.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Group sales by month (PostgreSQL)</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    DATE_TRUNC('month', order_date) AS month,
    COUNT(*) AS total_orders,
    SUM(order_amount) AS monthly_revenue
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">DATE_TRUNC truncates dates to the specified precision. In MySQL, you would use DATE_FORMAT(order_date, &apos;%Y-%m&apos;) instead.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Subqueries</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Subqueries let you nest one query inside another. They&apos;re essential for answering complex business questions that require multiple steps, like finding customers who exceed the average order value.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Find above-average customers</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT customer_name, email, total_spent
FROM customers
WHERE total_spent > (
    SELECT AVG(total_spent)
    FROM customers
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">The inner query calculates the average, then the outer query uses that value to filter results.</p>
      </div>

      <h2 id="real-queries" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Real Business Analyst Queries You&apos;ll Use at Work</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Theory is great, but let&apos;s look at four real scenarios you&apos;ll encounter as a business analyst. Each query solves a common business question.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Query 1: &quot;Which products sold most last quarter?&quot;</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Your sales director wants to know top performers for the quarterly review. This requires GROUP BY to aggregate by product and ORDER BY to rank results.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    p.product_name,
    p.category,
    COUNT(oi.order_item_id) AS units_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_date >= '2024-10-01'
  AND o.order_date < '2025-01-01'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY total_revenue DESC
LIMIT 10;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">This joins three tables to connect order items with product details and filter by date range. The LIMIT 10 gives you just the top performers.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Query 2: &quot;Show customers who ordered but never returned anything&quot;</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Marketing wants to identify loyal customers for a rewards program. This is a classic LEFT JOIN with NULL check pattern.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    COUNT(o.order_id) AS total_orders,
    SUM(o.order_amount) AS lifetime_value
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN returns r ON o.order_id = r.order_id
WHERE r.return_id IS NULL
GROUP BY c.customer_id, c.customer_name, c.email
HAVING COUNT(o.order_id) >= 3
ORDER BY lifetime_value DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">LEFT JOIN includes all orders whether they have returns or not. WHERE r.return_id IS NULL filters to only those without returns. HAVING filters after aggregation.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Query 3: &quot;What&apos;s our month-over-month revenue growth?&quot;</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Finance needs a trend report showing how revenue changes each month. This combines date functions with aggregations.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH monthly_revenue AS (
    SELECT 
        DATE_TRUNC('month', order_date) AS month,
        SUM(order_amount) AS revenue
    FROM orders
    WHERE order_date >= '2024-01-01'
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) / 
        LAG(revenue) OVER (ORDER BY month) * 100, 
        2
    ) AS growth_percentage
FROM monthly_revenue
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">The CTE (WITH clause) calculates monthly totals first. LAG() accesses the previous row&apos;s value to calculate growth. This is slightly advanced but incredibly useful for trend analysis.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Query 4: &quot;Find customers by region with their total orders&quot;</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        The regional sales team needs customer counts and order totals broken down by geography. This requires joining multiple tables and grouping by region.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    r.region_name,
    COUNT(DISTINCT c.customer_id) AS total_customers,
    COUNT(o.order_id) AS total_orders,
    SUM(o.order_amount) AS total_revenue,
    ROUND(SUM(o.order_amount) / COUNT(DISTINCT c.customer_id), 2) AS revenue_per_customer
FROM regions r
INNER JOIN customers c ON r.region_id = c.region_id
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY r.region_id, r.region_name
ORDER BY total_revenue DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">COUNT(DISTINCT customer_id) prevents counting the same customer multiple times when they have multiple orders. LEFT JOIN ensures regions appear even if they have customers with no orders.</p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Practice the Same SQL Patterns with Detective Cases
          </p>
          <p className="text-amber-700 text-sm">
            The JOINs, GROUP BY, and aggregations you just learned work identically whether you&apos;re analyzing business data or solving crimes. SQLNoir gives you real databases to query — you&apos;ll write multi-table queries, find patterns, and build the SQL muscle memory every BA needs.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      <h2 id="interview-questions" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL Interview Questions for Business Analysts</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL questions are standard in BA interviews. Here are common questions with approaches you can adapt.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 1: &quot;Find the second highest salary in the employees table&quot;</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">The subquery finds the maximum salary, then the outer query finds the maximum of everything below that.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 2: &quot;Write a query to find duplicate email addresses&quot;</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT email, COUNT(*) AS count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">GROUP BY email collapses duplicate emails, HAVING filters to only those appearing more than once.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 3: &quot;Show all departments with more employees than the company average&quot;</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    d.department_name,
    COUNT(e.employee_id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
HAVING COUNT(e.employee_id) > (
    SELECT AVG(dept_count)
    FROM (
        SELECT COUNT(*) AS dept_count
        FROM employees
        GROUP BY department_id
    ) AS dept_counts
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">The nested subquery calculates the average department size, then HAVING compares each department against that average.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 4: &quot;Find customers who placed orders in 2023 but not in 2024&quot;</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT DISTINCT c.customer_id, c.customer_name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE YEAR(o.order_date) = 2023
  AND c.customer_id NOT IN (
      SELECT customer_id 
      FROM orders 
      WHERE YEAR(order_date) = 2024
  );`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">NOT IN excludes customers who appear in the 2024 orders subquery.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip for SQL Interviews</h3>
        <p className="text-blue-800">Talk through your approach before writing code. Interviewers want to see your thought process. Start with &quot;I would use a GROUP BY with HAVING because...&quot; and explain your logic. Even if your syntax isn&apos;t perfect, showing clear thinking matters more than memorized queries.</p>
      </div>

      <h2 id="learning-roadmap" className="text-3xl font-detective text-amber-900 mt-12 mb-6">How to Learn SQL as a Business Analyst (6-Week Roadmap)</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learning SQL for business analytics doesn&apos;t require months of study. With focused practice, you can build job-ready skills in six weeks.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 1-2: Fundamentals</h3>

      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Master SELECT, FROM, and WHERE clauses</li>
        <li>Practice comparison operators (=, !=, &gt;, &lt;, BETWEEN)</li>
        <li>Learn AND, OR, and IN for multiple conditions</li>
        <li>Use ORDER BY and LIMIT to control output</li>
        <li>Understand NULL values and IS NULL / IS NOT NULL</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Goal:</strong> Write queries that filter and sort data from a single table confidently.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 3-4: JOINs and Aggregations</h3>

      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Learn INNER JOIN and LEFT JOIN thoroughly</li>
        <li>Practice COUNT, SUM, AVG, MIN, and MAX</li>
        <li>Master GROUP BY for categorical analysis</li>
        <li>Understand HAVING for filtering aggregated results</li>
        <li>Combine JOINs with aggregations</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Goal:</strong> Connect multiple tables and calculate business metrics by category.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 5-6: Practice with Real Scenarios</h3>

      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Work through business-focused SQL exercises</li>
        <li>Practice date functions for time-based reporting</li>
        <li>Write subqueries for complex questions</li>
        <li>Build a portfolio of queries you&apos;ve written</li>
        <li>Time yourself to build speed for interviews</li>
      </ul>

      <h2 id="common-mistakes" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Common Mistakes Business Analysts Make with SQL</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Even experienced analysts make these errors. Knowing what to watch for helps you avoid embarrassing data mistakes.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Mistake 1: Ignoring NULL Values</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        NULL doesn&apos;t equal anything, not even itself. Comparisons with NULL always return unknown, which usually means your row gets excluded.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Wrong:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT * FROM customers WHERE region != 'West';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">This excludes customers with NULL regions, even though NULL is not &apos;West&apos;.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Right:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT * FROM customers 
WHERE region != 'West' OR region IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Explicitly include NULL values when they should appear in results.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Mistake 2: Creating Duplicates with JOINs</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs can multiply your rows unexpectedly. If a customer has 5 orders and each order has 3 items, joining all three tables gives you 15 rows per customer.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">Always check your row count before and after JOINs. Use COUNT(DISTINCT customer_id) when you need unique counts. When something seems off, SELECT * with LIMIT 100 and eyeball the data.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Mistake 3: Not Testing with Sample Data</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Running a query on millions of rows before testing it on a small sample wastes time and can crash systems. Always add a LIMIT clause or date filter during development.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`-- During development, add a LIMIT
SELECT * FROM large_table 
WHERE conditions
LIMIT 100;

-- Or filter to recent data only
SELECT * FROM large_table 
WHERE created_date >= CURRENT_DATE - INTERVAL '7 days';`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Mistake 4: Forgetting Time Zones</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Dates and timestamps often have hidden time zone issues. A report showing &quot;January sales&quot; might include or exclude December 31st depending on how timestamps are stored and converted.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Always confirm how dates are stored in your database, whether as UTC, local time, or timestamp with time zone. When in doubt, ask your data engineering team.
      </p>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Build SQL Muscle Memory with Detective Cases
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You&apos;ve learned the syntax — JOINs, aggregations, date functions, and subqueries. Now practice those exact same patterns by querying real databases. The SQL skills you drill solving mysteries in SQLNoir transfer directly to stakeholder meetings, KPI reports, and business analysis work.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">Start Querying Today</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL for business analysts comes down to five core skills: SELECT with filtering, aggregations, JOINs, date functions, and subqueries. Master these, and you&apos;ll handle 90% of the data questions that come your way.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        The best time to learn SQL was five years ago. The second best time is now. Start with simple queries, build toward complex ones, and practice consistently.
      </p>
    </div>
  );
}
