"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";
import { track } from "@vercel/analytics/react";
import gamesToLearnSqlHero from "../../../public/blog/games-to-learn-sql-hero.webp";
import sqlJoinTypesExplainedHero from "../../../public/blog/sql-join-types-explained-hero-new.png";
import sqlForDataAnalystsHero from "../../../public/blog/sql-for-data-analysts-hero-new.png";

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: JSX.Element;
  date: string;
  readTime: string;
  author: string;
  slug: string;
  heroImage: StaticImageData;
}

interface BlogPostProps {
  slug: string;
}

const BLOG_POSTS: Record<string, BlogPostData> = {
  "sql-for-data-analysts": {
    id: "3",
    title: "SQL for Data Analysts: Essential Skills You Need to Land the Job (2026)",
    excerpt:
      "Master the 5 SQL concepts every data analyst needs. From basic queries to window functions, these are the practical skills that get you hired.",
    date: "2026-01-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    slug: "sql-for-data-analysts",
    heroImage: sqlForDataAnalystsHero,
    content: (
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

        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
          <h4 className="font-bold text-amber-900 mb-3">💡 Practice Tip</h4>
          <p className="text-gray-700">
            Want to practice these exact patterns with realistic data? <a href="https://www.sqlnoir.com" className="text-amber-900 underline hover:text-amber-700">SQL Noir</a> lets you write queries against detective case databases. It&apos;s way more engaging than dry tutorials, and the patterns transfer directly to business analysis.
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
            <li>• <strong>SQL Noir</strong>: Realistic database scenarios in an engaging game format</li>
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

        <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
          Start Practicing Today
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          The best time to start learning SQL was yesterday. The second best time is now. The job market rewards data analysts who can write clean, efficient queries. That skill comes from practice, not reading.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Pick a learning resource. Write your first query. Then write a hundred more. In two months, you&apos;ll be solving business problems that seemed impossible today.
        </p>

        <div className="bg-amber-100 border border-amber-300 rounded-lg p-6 mt-8">
          <h4 className="font-bold text-amber-900 mb-3">🔍 Ready to Practice?</h4>
          <p className="text-gray-700 mb-4">
            If you want SQL practice that doesn&apos;t feel like homework, try <a href="https://www.sqlnoir.com" className="text-amber-900 underline hover:text-amber-700 font-bold">SQL Noir</a>. Solve detective cases by writing queries against realistic databases. It&apos;s free, requires no setup, and covers everything from basic SELECTs to complex JOINs and subqueries.
          </p>
          <a
            href="https://www.sqlnoir.com"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
          >
            Start Solving Cases →
          </a>
        </div>
      </div>
    ),
  },
  "sql-join-types-explained": {
    id: "2",
    title: "SQL Join Types Explained: A Visual Guide to INNER, LEFT, RIGHT & FULL Joins (2026)",
    excerpt:
      "Master all 4 SQL join types with visual diagrams and practical examples. Learn when to use INNER, LEFT, RIGHT, and FULL OUTER JOINs.",
    date: "2026-01-26",
    readTime: "10 min read",
    author: "Hristo Bogoev",
    slug: "sql-join-types-explained",
    heroImage: sqlJoinTypesExplainedHero,
    content: (
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
    ),
  },
  "games-to-learn-sql": {
    id: "1",
    title: "5 SQL Games to Master Database Skills in 2025",
    excerpt:
      "Skip the boring textbooks. These 5 SQL games teach database queries through detective stories, island survival, and murder mysteries.",
    date: "2025-05-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    slug: "games-to-learn-sql",
    heroImage: gamesToLearnSqlHero,
    content: (
      <div className="prose prose-lg max-w-none">
        {/* <p className="text-xl text-gray-700 leading-relaxed mb-8">
          Learning SQL from textbooks is boring as hell. I've been there -
          staring at endless SELECT statements wondering when it'll actually
          click. But here's the thing: SQL games changed everything for me and
          thousands of other developers.
        </p> */}

        <p className="text-gray-700 leading-relaxed mb-8">
          Instead of grinding through another dry tutorial, you can learn SQL by
          solving crimes, escaping islands, or competing with other programmers.
          These 5 SQL games actually make database learning fun - and they work
          better than traditional methods.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            🎯 Quick Navigation
          </h3>
          <ul className="grid md:grid-cols-2 gap-2 text-blue-800">
            <li>
              •{" "}
              <a href="#sql-noir" className="hover:underline">
                SQL Noir - Detective Game
              </a>
            </li>
            <li>
              •{" "}
              <a href="#sql-island" className="hover:underline">
                SQL Island - Adventure Game
              </a>
            </li>
            <li>
              •{" "}
              <a href="#sql-murder-mystery" className="hover:underline">
                SQL Murder Mystery
              </a>
            </li>
            <li>
              •{" "}
              <a href="#sql-police-department" className="hover:underline">
                SQL Police Department
              </a>
            </li>
            <li>
              •{" "}
              <a href="#sqlzoo" className="hover:underline">
                SQLZoo - Interactive Tutorials
              </a>
            </li>
          </ul>
        </div>

        <h2
          id="sql-noir"
          className="text-3xl font-detective text-amber-900 mt-12 mb-6"
        >
          1. SQL Noir - Detective SQL Game
        </h2>

        <div className="mb-8">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*PzS4hHajDcTcLtWr"
            alt="SQL Noir game interface showing detective case with SQL query editor and crime database"
            width={1400}
            height={788}
            className="w-full rounded-lg shadow-lg h-auto"
            priority
          />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          <strong>
            <a
              href="https://www.sqlnoir.com"
              className="text-amber-900 hover:text-amber-700 underline"
            >
              SQL Noir
            </a>
          </strong>{" "}
          is my take on making SQL actually fun to learn. I built it because I
          was tired of boring tutorials. You play as a detective solving crimes
          with SQL queries - each case has realistic databases with suspects,
          evidence & witness interviews.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-bold text-gray-900 mb-3">
            Example Query from SQL Noir:
          </h4>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {`SELECT s.name, s.description, i.alibi
FROM suspects s
JOIN interviews i ON s.id = i.suspect_id
WHERE s.description LIKE '%scar on left cheek%'
AND i.alibi IS NOT NULL;`}
          </pre>
          <p className="text-gray-600 text-sm mt-2">
            This query helps identify suspects matching witness descriptions and
            checks their alibis.
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
          <h4 className="font-bold text-amber-900 mb-3">
            Why SQL Noir works so well:
          </h4>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>
              • <strong>6+ detective cases:</strong> Everything from theft to
              murder
            </li>
            <li>
              • <strong>Actually gets harder:</strong> Starts easy with SELECT,
              then hits you with JOINs and subqueries
            </li>
            <li>
              • <strong>Real database structures:</strong> Not toy examples -
              actual schemas that make sense
            </li>
            <li>
              • <strong>You know right away if you&apos;re wrong:</strong> No waiting
              for a teacher to grade your work
            </li>
            <li>
              • <strong>It&apos;s free:</strong> No paywall, no &quot;premium features&quot;
            </li>
            <li>
              • <strong>No setup:</strong> Just open your browser and start
              playing
            </li>
          </ul>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-amber-800 mb-2">✅ Pros:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Highly engaging storytelling</li>
                <li>• Covers all SQL skill levels</li>
                <li>• Realistic database scenarios</li>
                <li>• Regular content updates</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-amber-800 mb-2">
                ⚠️ Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• May be challenging for absolute beginners</li>
                <li>• Requires logical thinking skills</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-amber-800">
            <strong>Best for:</strong> Anyone who likes stories and wants to
            practice SQL on realistic data.
          </p>
          <p className="mt-2 text-amber-800">
            <strong>Time:</strong> 30-60 minutes per case
          </p>
          <div className="mt-4">
            <a
              href="https://www.sqlnoir.com"
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Play SQL Noir →
            </a>
          </div>
        </div>

        <h2
          id="sql-island"
          className="text-3xl font-detective text-amber-900 mt-12 mb-6"
        >
          2. SQL Island - Survival Adventure Game
        </h2>

        <div className="mb-8">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*1nl6U643v-n-a8Vu"
            alt="SQL Island game interface screenshot showing adventure survival SQL learning game"
            width={1400}
            height={788}
            className="w-full rounded-lg shadow-lg h-auto"
          />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          <strong>
            <a
              href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-blue-700 underline"
            >
              SQL Island
            </a>
          </strong>{" "}
          has a simple premise: you crash-land on an island and need SQL to
          survive. Want food? Query the database. Need a job? Better know how to
          ORDER BY. It&apos;s cheesy but it works, especially if you&apos;re just starting
          out.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-bold text-gray-900 mb-3">
            Example Survival Query:
          </h4>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {`SELECT * 
FROM inhabitant 
WHERE job = 'baker' 
ORDER BY gold DESC
LIMIT 1;`}
          </pre>
          <p className="text-gray-600 text-sm mt-2">
            Find the wealthiest baker on the island to secure employment and
            gold.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <h4 className="font-bold text-blue-900 mb-3">Key Features:</h4>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>
              • <strong>Adventure Storyline:</strong> Engaging narrative that
              drives learning forward
            </li>
            <li>
              • <strong>Progressive Challenges:</strong> Tasks become more
              complex as you advance
            </li>
            <li>
              • <strong>Multilingual Support:</strong> Available in English and
              German
            </li>
            <li>
              • <strong>Real SQL Practice:</strong> Work with genuine database
              operations
            </li>
            <li>
              • <strong>Resource Management:</strong> Learn to optimize queries
              for efficiency
            </li>
          </ul>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-blue-800 mb-2">✅ Pros:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Unique adventure theme</li>
                <li>• Excellent for beginners</li>
                <li>• Free and accessible</li>
                <li>• Clear progression system</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-blue-800 mb-2">
                ⚠️ Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Interface can feel dated</li>
                <li>• Limited advanced SQL concepts</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-blue-800">
            <strong>Best for:</strong> Absolute beginners who prefer adventure
            themes and step-by-step progression.
          </p>
          <p className="mt-2 text-blue-800">
            <strong>Time Investment:</strong> 1-2 hours to complete depending on
            your skill level.
          </p>
          <div className="mt-4">
            <a
              href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Play SQL Island →
            </a>
          </div>
        </div>

        <h2
          id="sql-murder-mystery"
          className="text-3xl font-detective text-amber-900 mt-12 mb-6"
        >
          3. SQL Murder Mystery - The Classic Detective Challenge
        </h2>

        <div className="mb-8">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*foI_PrQp9hmWhE9r"
            alt="SQL Murder Mystery game interface showing Northwestern University's detective SQL learning platform"
            width={1400}
            height={788}
            className="w-full rounded-lg shadow-lg h-auto"
          />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          <strong>
            <a
              href="https://mystery.knightlab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-900 hover:text-red-700 underline"
            >
              SQL Murder Mystery
            </a>
          </strong>{" "}
          is the OG SQL game that started it all. Northwestern University made
          this and it&apos;s just one case - solve a murder in SQL City. Simple
          concept, but it&apos;s really well done and teaches you JOINs better than
          any tutorial I&apos;ve seen. P.S. SQL Noir was inspired by this game.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-bold text-gray-900 mb-3">
            Example Investigation Query:
          </h4>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {`SELECT p.name, p.license_id, p.ssn
FROM person p
JOIN drivers_license dl ON p.license_id = dl.id
WHERE dl.plate_number LIKE '%H42W%';`}
          </pre>
          <p className="text-gray-600 text-sm mt-2">
            Track down suspects by matching partial license plate information
            with driver records.
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
          <h4 className="font-bold text-red-900 mb-3">Game Highlights:</h4>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>
              • <strong>Single Focused Case:</strong> One compelling murder
              mystery to solve
            </li>
            <li>
              • <strong>Realistic Database Schema:</strong> Work with police
              reports, witness interviews, and city records
            </li>
            <li>
              • <strong>Educational Design:</strong> Backed by academic
              expertise in learning design
            </li>
            <li>
              • <strong>Self-Paced Learning:</strong> No time pressure, explore
              at your own speed
            </li>
            <li>
              • <strong>Community Solutions:</strong> Share approaches with
              other detectives
            </li>
          </ul>

          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <h5 className="font-bold text-red-900 mb-2">
              🎯 What You&apos;ll Learn:
            </h5>
            <ul className="text-red-800 text-sm space-y-1">
              <li>• Advanced JOIN operations across multiple tables</li>
              <li>• WHERE clauses with complex conditions</li>
              <li>• Data filtering and pattern matching</li>
              <li>• Logical deduction through data analysis</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-red-800 mb-2">✅ Pros:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Excellent for practicing JOINs</li>
                <li>• Well-designed learning progression</li>
                <li>• Completely free and open source</li>
                <li>• Great introduction to data analysis</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-red-800 mb-2">
                ⚠️ Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Only one case to solve</li>
                <li>• Can be completed quickly</li>
                <li>• Limited replayability</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-red-800">
            <strong>Best for:</strong> Intermediate users who want to practice
            complex queries and logical reasoning.
          </p>
          <p className="mt-2 text-red-800">
            <strong>Time Investment:</strong> 1-3 hours depending on SQL
            experience
          </p>
          <div className="mt-4">
            <a
              href="https://mystery.knightlab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Play SQL Murder Mystery →
            </a>
          </div>
        </div>

        <h2
          id="sql-police-department"
          className="text-3xl font-detective text-amber-900 mt-12 mb-6"
        >
          4. SQL Police Department (SQLPD) - Premium Detective Training
        </h2>

        <div className="mb-8">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*BT8lIzDDrdPhPyMl"
            alt="SQL Police Department (SQLPD) game interface showing premium detective SQL training platform"
            width={1400}
            height={788}
            className="w-full rounded-lg shadow-lg h-auto"
          />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          <strong>
            <a
              href="https://sqlpd.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-900 hover:text-green-700 underline"
            >
              SQL Police Department (SQLPD)
            </a>
          </strong>{" "}
          teaches you SQL by completing different missions ( or cases ) in a
          real-world police department. You will be briefed on different crimes
          and you will have to write SQL queries to solve them. The UI is a bit
          more mobile leaning, but it&apos;s still a great way to learn SQL. You
          don&apos;t have a traditional SQL editor but rather a set of buttons that
          give you different keyword options to complete the query.
        </p>

        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <h4 className="font-bold text-green-900 mb-3">Premium Features:</h4>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>
              • <strong>Multiple Case Types:</strong> Fraud, theft, murder, and
              violent crime scenarios
            </li>
            <li>
              • <strong>Good Writing:</strong> High-quality, engaging narratives
            </li>
            <li>
              • <strong>Hints System:</strong> Clues to guide learning without
              giving away solutions
            </li>
            <li>
              • <strong>Free Trial Cases:</strong> Try before you buy with
              sample cases
            </li>
          </ul>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-green-800 mb-2">✅ Pros:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Very good case quality and writing</li>
                <li>• Covers basic SQL concepts</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-green-800 mb-2">
                ⚠️ Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Requires payment for full access</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-green-800">
            <strong>Best for:</strong> Beginner to advanced users preparing for
            professional data roles or seeking premium learning experiences.
          </p>
          <p className="mt-2 text-green-800">
            <strong>Time Investment:</strong> 5-30 minutes per case
          </p>
          <div className="mt-4">
            <a
              href="https://sqlpd.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try SQLPD →
            </a>
          </div>
        </div>

        <h2
          id="sqlzoo"
          className="text-3xl font-detective text-amber-900 mt-12 mb-6"
        >
          5. SQLZoo - The Comprehensive Interactive Tutorial
        </h2>

        <div className="mb-8">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*WaOubGQPf431s8oR"
            alt="SQLZoo interactive SQL tutorial interface showing comprehensive database learning platform"
            width={1400}
            height={788}
            className="w-full rounded-lg shadow-lg h-auto"
          />
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          <strong>
            <a
              href="https://sqlzoo.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-900 hover:text-purple-700 underline"
            >
              SQLZoo
            </a>
          </strong>{" "}
          has been the gold standard for interactive SQL learning for over two
          decades. While less game-like than other options, its systematic
          approach and comprehensive coverage make it an essential resource for
          mastering SQL fundamentals and advanced concepts.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-bold text-gray-900 mb-3">
            Example Learning Exercise:
          </h4>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {`SELECT name, continent, population 
FROM world 
WHERE population > (
  SELECT population 
  FROM world 
  WHERE name = 'Canada'
) 
AND population < (
  SELECT population 
  FROM world 
  WHERE name = 'Poland'
);`}
          </pre>
          <p className="text-gray-600 text-sm mt-2">
            Find countries with populations between Canada and Poland using
            subqueries.
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
          <h4 className="font-bold text-purple-900 mb-3">
            Comprehensive Learning Features:
          </h4>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>
              • <strong>Structured Curriculum:</strong> 15+ tutorial sections
              covering all SQL concepts
            </li>
            <li>
              • <strong>Real Datasets:</strong> Work with world statistics,
              Nobel prizes, and more
            </li>
            <li>
              • <strong>Progressive Difficulty:</strong> From basic SELECT
              to&nbsp;
              <a
                href="https://sqlzoo.net/wiki/Window_functions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                advanced&nbsp;window&nbsp;functions
              </a>
            </li>
            <li>
              • <strong>Assessment Tools:</strong> Built-in quizzes and
              challenges
            </li>
            <li>
              • <strong>No Registration Required:</strong> Start learning
              immediately
            </li>
          </ul>

          <div className="bg-purple-100 p-4 rounded-lg mb-4">
            <h5 className="font-bold text-purple-900 mb-2">
              📚 Complete SQL Coverage:
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-purple-800 text-sm">
              <ul className="space-y-1">
                <li>• SELECT basics and advanced queries</li>
                <li>• JOINs (INNER, LEFT, RIGHT, FULL)</li>
                <li>• GROUP BY and aggregate functions</li>
                <li>• Subqueries and derived tables</li>
              </ul>
              <ul className="space-y-1">
                <li>• Window functions and analytics</li>
                <li>• Date/time manipulation</li>
                <li>• String functions and pattern matching</li>
                <li>• Database optimization techniques</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="font-bold text-purple-800 mb-2">✅ Pros:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Most comprehensive SQL coverage</li>
                <li>• Time-tested learning approach</li>
                <li>• Completely free access</li>
                <li>• Excellent for interview preparation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-purple-800 mb-2">
                ⚠️ Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Less engaging than story-driven games</li>
                <li>• Interface feels dated</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-purple-800">
            <strong>Best for:</strong> All skill levels, especially those who
            prefer systematic learning and comprehensive coverage.
          </p>
          <p className="mt-2 text-purple-800">
            <strong>Time Investment:</strong> Ongoing reference and practice
            resource
          </p>
          <div className="mt-4">
            <a
              href="https://sqlzoo.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try SQLZoo →
            </a>
          </div>
        </div>

        <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
          🎯 Choosing the Right SQL Game for Your Goals
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-3">
              🚀 For Complete Beginners
            </h4>
            <ol className="text-blue-800 space-y-2">
              <li>
                1.{" "}
                <strong>
                  <a
                    href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQL Island
                  </a>
                </strong>{" "}
                - Gentle introduction with adventure theme
              </li>
              <li>
                2.{" "}
                <strong>
                  <a
                    href="https://sqlzoo.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLZoo
                  </a>
                </strong>{" "}
                - Systematic fundamentals
              </li>
              <li>
                3.{" "}
                <strong>
                  <a href="https://www.sqlnoir.com" className="hover:underline">
                    SQL Noir
                  </a>
                </strong>{" "}
                - Once comfortable with basics
              </li>
            </ol>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-bold text-green-900 mb-3">
              ⚡ For Intermediate Learners
            </h4>
            <ol className="text-green-800 space-y-2">
              <li>
                1.{" "}
                <strong>
                  <a href="https://www.sqlnoir.com" className="hover:underline">
                    SQL Noir
                  </a>
                </strong>{" "}
                - Realistic scenarios and progressive difficulty
              </li>
              <li>
                2.{" "}
                <strong>
                  <a
                    href="https://mystery.knightlab.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQL Murder Mystery
                  </a>
                </strong>{" "}
                - Practice complex JOINs
              </li>
              <li>
                3.{" "}
                <strong>
                  <a
                    href="https://sqlpd.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLPD
                  </a>
                </strong>{" "}
                - Premium cases for deeper challenges
              </li>
            </ol>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-3">
              🎓 For Interview Preparation
            </h4>
            <ol className="text-purple-800 space-y-2">
              <li>
                1.{" "}
                <strong>
                  <a
                    href="https://sqlzoo.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLZoo
                  </a>
                </strong>{" "}
                - Comprehensive concept coverage
              </li>
              <li>
                2.{" "}
                <strong>
                  <a
                    href="https://sqlpd.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLPD
                  </a>
                </strong>{" "}
                - Business scenario practice
              </li>
              <li>
                3.{" "}
                <strong>
                  <a href="https://www.sqlnoir.com" className="hover:underline">
                    SQL Noir
                  </a>
                </strong>{" "}
                - Logical reasoning skills
              </li>
            </ol>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-3">
              🏆 For Advanced Users
            </h4>
            <ol className="text-orange-800 space-y-2">
              <li>
                1.{" "}
                <strong>
                  <a
                    href="https://sqlpd.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLPD
                  </a>
                </strong>{" "}
                - Complex analytical challenges
              </li>
              <li>
                2.{" "}
                <strong>
                  <a href="https://www.sqlnoir.com" className="hover:underline">
                    SQL Noir
                  </a>
                </strong>{" "}
                - Advanced detective cases
              </li>
              <li>
                3.{" "}
                <strong>
                  <a
                    href="https://sqlzoo.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    SQLZoo
                  </a>
                </strong>{" "}
                - Master window functions and optimization
              </li>
            </ol>
          </div>
        </div>

        <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
          📊 SQL Games Comparison Table
        </h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Game</th>
                <th className="border border-gray-300 p-3 text-left">Cost</th>
                <th className="border border-gray-300 p-3 text-left">
                  Difficulty
                </th>
                <th className="border border-gray-300 p-3 text-left">Theme</th>
                <th className="border border-gray-300 p-3 text-left">
                  Best Feature
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">
                  SQL Noir
                </td>
                <td className="border border-gray-300 p-3 text-green-600">
                  Free
                </td>
                <td className="border border-gray-300 p-3">
                  Beginner-Advanced
                </td>
                <td className="border border-gray-300 p-3">
                  Detective Mystery
                </td>
                <td className="border border-gray-300 p-3">
                  Immersive storytelling
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">
                  SQL Island
                </td>
                <td className="border border-gray-300 p-3 text-green-600">
                  Free
                </td>
                <td className="border border-gray-300 p-3">Beginner</td>
                <td className="border border-gray-300 p-3">
                  Adventure Survival
                </td>
                <td className="border border-gray-300 p-3">
                  Beginner-friendly progression
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">
                  SQL Murder Mystery
                </td>
                <td className="border border-gray-300 p-3 text-green-600">
                  Free
                </td>
                <td className="border border-gray-300 p-3">Intermediate</td>
                <td className="border border-gray-300 p-3">
                  Crime Investigation
                </td>
                <td className="border border-gray-300 p-3">
                  Academic design quality
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">
                  SQLPD
                </td>
                <td className="border border-gray-300 p-3 text-orange-600">
                  Paid
                </td>
                <td className="border border-gray-300 p-3">
                  Intermediate-Advanced
                </td>
                <td className="border border-gray-300 p-3">Police Detective</td>
                <td className="border border-gray-300 p-3">
                  Premium case quality
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">
                  SQLZoo
                </td>
                <td className="border border-gray-300 p-3 text-green-600">
                  Free
                </td>
                <td className="border border-gray-300 p-3">All Levels</td>
                <td className="border border-gray-300 p-3">
                  Educational Tutorial
                </td>
                <td className="border border-gray-300 p-3">
                  Comprehensive coverage
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
          Which SQL Game Should You Try First?
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Here&apos;s the thing - all of these SQL games work, but they work for
          different people. If you like stories and don&apos;t mind a challenge,
          start with{" "}
          <a
            href="https://www.sqlnoir.com"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL Noir
          </a>
          . If you&apos;re completely new to SQL,{" "}
          <a
            href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 underline"
          >
            SQL Island
          </a>{" "}
          is probably your best bet. Want something deep and focused? Go with{" "}
          <a
            href="https://mystery.knightlab.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 hover:text-red-900 underline"
          >
            SQL Murder Mystery
          </a>
          .
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          The most important thing is to actually start. I wasted months putting
          off learning SQL because textbooks felt overwhelming. These games make
          it easy to just dive in and start playing around with queries.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-3">
            What to do next
          </h3>
          <ol className="space-y-2 text-amber-800">
            <li>1. Pick one game from this list (seriously, just pick one)</li>
            <li>2. Spend 30 minutes playing it today</li>
            <li>3. If you get stuck, that&apos;s normal - keep going</li>
            <li>4. Try a different game if the first one doesn&apos;t click</li>
            <li>
              5. Once you finish one, try another with a different approach
            </li>
          </ol>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Don&apos;t overthink this. The best SQL game is the one you&apos;ll actually
          play. Pick one, start today, and see how much more fun learning
          database queries can be.
        </p>
      </div>
    ),
  },
};

export function BlogPost({ slug }: BlogPostProps) {
  const post = BLOG_POSTS[slug];

  useEffect(() => {
    if (!post) return;
    track("blog_view", {
      post_slug: post.slug,
      title: post.title,
    });

    const depths = [25, 50, 75, 100];
    const seen = new Set<number>();
    const handler = () => {
      const scrolled =
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
        100;
      const hit = depths.find((d) => scrolled >= d && !seen.has(d));
      if (hit !== undefined) {
        seen.add(hit);
        track("blog_read_depth", { post_slug: post.slug, depth: hit });
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-detective text-amber-900 mb-4">
            Post Not Found
          </h1>
          <Link href="/blog" className="text-amber-700 hover:text-amber-900">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar
        title="Detective's Journal"
        titleHref="/blog"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Journal", href: "/blog", activeMatch: "/blog" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-4xl w-full mx-auto overflow-hidden rounded-2xl border border-amber-100 shadow-sm bg-white">
          <div className="relative aspect-[16/9]">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 1150px, (min-width: 1024px) 85vw, 100vw"
              className="object-cover"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12 bg-white rounded-2xl shadow-sm border border-amber-100 mt-6">
        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-amber-700 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsIncognito className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-detective text-amber-900 mb-3 leading-snug sm:leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-base sm:prose-lg max-w-none">
          {post.content}
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <h3 className="text-2xl font-detective text-amber-900 mb-4">
            Ready to start your next investigation?
          </h3>
          <p className="text-amber-800 mb-6">
            Jump into the SQLNoir case files and put these tips to work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-800/90 hover:bg-amber-700/90 
                       text-amber-100 rounded-lg font-detective text-lg transition-colors"
            >
              Explore Cases
              <ExternalLink className="w-5 h-5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-300 text-amber-900 rounded-lg font-detective text-base hover:bg-amber-100 transition-colors"
            >
              Back to Journal
            </Link>
          </div>
        </div>
      </article>

      <footer className="bg-amber-50/80 border-t border-amber-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-amber-800 mb-4">
            Keep investigating with SQL Noir - where mysteries meet databases.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="text-amber-800 hover:text-amber-900 transition-colors"
            >
              Back to Blog
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-800/90 hover:bg-amber-700/90 
                       text-amber-100 rounded-lg transition-colors"
            >
              Play Game
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
