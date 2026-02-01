"use client";

import Link from "next/link";

export default function SqlForDataAnalystsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Over 200,000 data analyst jobs on LinkedIn, and nearly every single one requires SQL. Here are the 5 specific skills that get you hired.
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
            <a href="#five-concepts" className="hover:underline">
              The 5 SQL Concepts Every Data Analyst Must Master
            </a>
          </li>
          <li>
            •{" "}
            <a href="#real-scenarios" className="hover:underline">
              Writing Queries Like a Pro: Real Business Scenarios
            </a>
          </li>
          <li>
            •{" "}
            <a href="#interview-skills" className="hover:underline">
              SQL Skills That Impress in Data Analyst Interviews
            </a>
          </li>
          <li>
            •{" "}
            <a href="#learning-path" className="hover:underline">
              From Beginner to Job-Ready: Your Learning Path
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
        id="why-sql"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Why Data Analysts Need SQL (Not Just Excel)
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Let&apos;s address the elephant in the room: &quot;Can&apos;t I just use Excel?&quot; Sure, if you&apos;re working with a few thousand rows. But modern businesses generate millions of records daily. Excel crashes at 1 million rows. SQL handles billions without breaking a sweat.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s the real difference: Excel downloads data to your computer. SQL queries the data where it lives: in production databases, data warehouses, and cloud systems. You get real-time answers without waiting for exports or crashing your laptop.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          SQL vs Excel: A Quick Comparison
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-bold text-amber-800 mb-2">Excel:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• Max ~1 million rows</li>
              <li>• Data must be downloaded</li>
              <li>• Manual refresh required</li>
              <li>• Limited joining capabilities</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-amber-800 mb-2">SQL:</h5>
            <ul className="text-gray-700 space-y-1">
              <li>• Billions of rows, no problem</li>
              <li>• Query data where it lives</li>
              <li>• Automated, repeatable reports</li>
              <li>• Powerful multi-table analysis</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        And here&apos;s what seals the deal: every major BI tool (Tableau, Power BI, Looker, Metabase) runs on SQL under the hood. When you write &quot;calculated fields&quot; or &quot;custom queries&quot; in these tools, you&apos;re writing SQL. Master SQL, and you master all of them.
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
          This single query answers &quot;What are our top-performing product categories this year?&quot; Something that would take multiple pivot tables and VLOOKUP formulas in Excel.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing aggregation queries hands-on,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to solve mysteries — perfect for building muscle memory with GROUP BY, SUM, and COUNT patterns that show up in every dashboard.
      </p>

      <h2
        id="five-concepts"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        The 5 SQL Concepts Every Data Analyst Must Master
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        You don&apos;t need to memorize 200 SQL commands. Focus on these five core concepts, and you&apos;ll handle 90% of data analyst work. Master them, and interviewers will notice.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        1. SELECT and Filtering (WHERE)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every SQL query starts with SELECT. It&apos;s how you choose which columns to retrieve and which rows to include. The WHERE clause filters your data. Think of it as Excel&apos;s filter dropdown, but infinitely more powerful.
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
          Find high-value US customers who signed up this year.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        2. Aggregate Functions (COUNT, SUM, AVG, GROUP BY)
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        This is where data analysis really happens. Aggregate functions let you summarize data: count rows, sum values, calculate averages. GROUP BY breaks your data into segments: by region, by month, by product category.
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
          Monthly revenue and customer count trend. A classic analyst report.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        3. JOINs: Combining Data from Multiple Tables
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Real data lives across multiple tables. Customers in one table, orders in another, products in a third. JOINs connect them together. This is the skill that separates basic SQL users from actual data analysts.
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
          Customer lifetime value analysis. Joining customer data with their orders.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">💡 Pro Tip: Know Your JOINs</h4>
        <p className="text-gray-700">
          <strong>INNER JOIN</strong>: Only matching rows from both tables.<br/>
          <strong>LEFT JOIN</strong>: All rows from the left table, matches from right (most common in analysis).<br/>
          <strong>FULL OUTER JOIN</strong>: All rows from both tables, even if no match.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        4. Subqueries: Queries Within Queries
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Sometimes you need to answer a question that requires two steps: &quot;Find all customers whose spending is above average.&quot; First, calculate the average. Then, filter customers. Subqueries let you do both in one statement.
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
          The subquery calculates the average; the outer query filters by it.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        5. Window Functions: Advanced Analytics
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions are the power tools of SQL analytics. They let you calculate running totals, rankings, and comparisons without collapsing your data. This is the skill that impresses interviewers and enables sophisticated analysis.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    salesperson,
    month,
    revenue,
    SUM(revenue) OVER (PARTITION BY salesperson ORDER BY month) as running_total,
    RANK() OVER (PARTITION BY month ORDER BY revenue DESC) as monthly_rank
FROM sales;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Running totals and rankings per salesperson. Advanced analysis in one query.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Practice JOINs and Window Functions on Real Data
          </p>
          <p className="text-amber-700 text-sm">
            These advanced SQL patterns make or break data analyst interviews. SQLNoir cases let you practice multi-table analysis, running totals, and ranking queries in realistic scenarios where getting the right answer actually matters.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      <h2
        id="real-scenarios"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Writing Queries Like a Pro: Real Business Scenarios
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Theory is nice, but you&apos;ll be solving real business problems. Here are three scenarios you&apos;ll encounter in actual data analyst jobs, and how to solve them.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 1: Customer Segmentation
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;Segment our customers by purchase frequency and identify our VIPs.&quot;
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
WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
GROUP BY customer_id;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 2: Month-over-Month Growth
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;Show me revenue growth compared to the previous month.&quot;
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
    ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) 
          / LAG(revenue) OVER (ORDER BY month), 2) as growth_pct
FROM monthly_revenue
ORDER BY month;`}
        </pre>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Scenario 3: Cohort Retention Analysis
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>Business Question:</strong> &quot;How well do we retain customers from each signup month?&quot;
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
    DATE_TRUNC('month', c.signup_date) as cohort_month,
    DATEDIFF('month', c.signup_date, o.order_date) as months_since_signup,
    COUNT(DISTINCT c.customer_id) as active_customers
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY 1, 2
ORDER BY 1, 2;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This forms the foundation of a cohort retention table, a staple analysis for product and marketing teams.
        </p>
      </div>

      <h2
        id="interview-skills"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQL Skills That Impress in Data Analyst Interviews
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Technical interviews for data analyst roles typically include SQL assessments. Here&apos;s what interviewers are really testing, and how to stand out.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h4 className="font-bold text-gray-900 mb-3">
          What Interviewers Actually Assess:
        </h4>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Problem decomposition:</strong> Can you break a complex question into steps?
          </li>
          <li>
            <strong>Business intuition:</strong> Do you understand what the question is really asking?
          </li>
          <li>
            <strong>SQL fluency:</strong> Can you write clean, correct queries without constant Googling?
          </li>
          <li>
            <strong>Edge case awareness:</strong> Do you consider NULLs, duplicates, and data quality issues?
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
        Common Interview Question Patterns
      </h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        After reviewing hundreds of data analyst interview questions, three patterns appear again and again:
      </p>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-bold text-gray-800 mb-2">1. &quot;Find the top N&quot; questions</h5>
          <p className="text-gray-600 text-sm">Top 5 products by revenue, top 10 customers by orders. Requires ranking and limiting.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-bold text-gray-800 mb-2">2. &quot;Compare periods&quot; questions</h5>
          <p className="text-gray-600 text-sm">This month vs last month, this year vs last year. Requires date functions and possibly window functions.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-bold text-gray-800 mb-2">3. &quot;Find users who did X but not Y&quot; questions</h5>
          <p className="text-gray-600 text-sm">Users who viewed but didn&apos;t purchase, customers who churned. Requires JOINs and filtering.</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">📚 Practice Resources</h4>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>DataLemur</strong>: Company-specific interview questions from FAANG companies</li>
          <li>• <strong>LeetCode SQL</strong>: Ranked difficulty problems with solutions</li>
          <li>• <strong>StrataScratch</strong>: Real interview questions from top companies</li>
        </ul>
      </div>

      <h2
        id="learning-path"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        From Beginner to Job-Ready: Your Learning Path
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s a realistic timeline to go from zero to interview-ready. The key is consistent practice, not cramming.
      </p>

      <div className="space-y-6 mb-8">
        <div className="border-l-4 border-amber-400 pl-6">
          <h4 className="font-bold text-gray-800 mb-2">Weeks 1-2: Foundation</h4>
          <p className="text-gray-700 mb-2">Master SELECT, WHERE, ORDER BY, LIMIT. Learn basic filtering with AND, OR, IN, BETWEEN, LIKE.</p>
          <p className="text-gray-600 text-sm italic">Practice: Write 20-30 basic queries. Get comfortable with syntax.</p>
        </div>

        <div className="border-l-4 border-amber-400 pl-6">
          <h4 className="font-bold text-gray-800 mb-2">Weeks 3-4: Aggregation</h4>
          <p className="text-gray-700 mb-2">Learn GROUP BY with COUNT, SUM, AVG, MIN, MAX. Understand HAVING for filtering groups.</p>
          <p className="text-gray-600 text-sm italic">Practice: Analyze sample datasets. Calculate metrics by segment.</p>
        </div>

        <div className="border-l-4 border-amber-400 pl-6">
          <h4 className="font-bold text-gray-800 mb-2">Weeks 5-6: JOINs</h4>
          <p className="text-gray-700 mb-2">Master INNER, LEFT, RIGHT, and FULL JOINs. Understand when to use each type.</p>
          <p className="text-gray-600 text-sm italic">Practice: Work with multi-table databases. SQL Noir cases are perfect for this.</p>
        </div>

        <div className="border-l-4 border-amber-400 pl-6">
          <h4 className="font-bold text-gray-800 mb-2">Weeks 7-8: Advanced Topics</h4>
          <p className="text-gray-700 mb-2">Subqueries, CTEs (Common Table Expressions), and basic window functions.</p>
          <p className="text-gray-600 text-sm italic">Practice: Tackle harder interview questions. Build portfolio projects.</p>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">⏱️ Daily Practice Commitment</h4>
        <p className="text-gray-700">
          30-45 minutes daily beats 4 hours on weekends. Consistency builds muscle memory. Aim for 2-3 practice problems per day during the learning phase, then 1 problem daily for maintenance.
        </p>
      </div>

      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-2">How long does it take to learn SQL for data analysis?</h4>
          <p className="text-gray-700">With focused practice, you can be job-ready in 6-8 weeks. Basic competency comes faster (2-3 weeks), but interview-level proficiency requires consistent practice with complex queries.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Is SQL hard to learn?</h4>
          <p className="text-gray-700">SQL has one of the gentlest learning curves in tech. The basics (SELECT, WHERE, GROUP BY) are intuitive. Advanced topics like window functions take more practice, but they&apos;re learnable by anyone who can think logically.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Which SQL dialect should I learn?</h4>
          <p className="text-gray-700">Start with PostgreSQL or MySQL. They&apos;re the most common and standards-compliant. The core concepts (SELECT, JOIN, GROUP BY) are identical across dialects. Differences are minor syntax variations you&apos;ll pick up quickly on the job.</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-2">Do I need to know Python too?</h4>
          <p className="text-gray-700">SQL alone can get you an entry-level data analyst role. But combining SQL with Python (for advanced analysis and visualization) makes you significantly more marketable and opens doors to senior positions.</p>
        </div>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Put Your Data Analyst SQL Skills to the Test
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You&apos;ve learned the concepts — aggregations, JOINs, subqueries, window functions. Now apply them to solve realistic database mysteries. SQLNoir gives you actual business scenarios where your queries uncover insights, just like the exploratory analysis and trend reporting you&apos;ll do on the job.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Start Practicing Today
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The best time to start learning SQL was yesterday. The second best time is now. The job market rewards data analysts who can write clean, efficient queries. That skill comes from practice, not reading.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Pick a learning resource. Write your first query. Then write a hundred more. In two months, you&apos;ll be solving business problems that seemed impossible today.
      </p>
    </div>
  );
}
