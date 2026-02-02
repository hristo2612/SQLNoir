"use client";

import Link from "next/link";

export default function SqlForMarketingContent() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Intro */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Marketing teams sit on goldmines of data. One SQL query can reveal campaign insights that take hours to find in dashboards.
      </p>

      {/* Quick Navigation */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li><a href="#why-sql" className="text-amber-700 hover:text-amber-900 underline">Why Marketing Professionals Need SQL</a></li>
          <li><a href="#sql-vs-excel" className="text-amber-700 hover:text-amber-900 underline">SQL vs Excel for Marketing Data</a></li>
          <li><a href="#essential-skills" className="text-amber-700 hover:text-amber-900 underline">5 Essential SQL Skills for Marketing Analytics</a></li>
          <li><a href="#real-world-queries" className="text-amber-700 hover:text-amber-900 underline">Real-World Marketing SQL Queries</a></li>
          <li><a href="#interview-questions" className="text-amber-700 hover:text-amber-900 underline">SQL Interview Questions for Marketing Analyst Roles</a></li>
          <li><a href="#learning-roadmap" className="text-amber-700 hover:text-amber-900 underline">Your 6-Week SQL Learning Roadmap for Marketing</a></li>
          <li><a href="#faq" className="text-amber-700 hover:text-amber-900 underline">FAQ</a></li>
        </ul>
      </div>

      {/* Why Marketing Professionals Need SQL */}
      <h2 id="why-sql" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Why Marketing Professionals Need SQL</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The modern marketing landscape generates an overwhelming amount of data. Every campaign you run, every email you send, every ad you launch creates dozens of data points across platforms like Google Ads, Facebook, email marketing tools, CRM systems, and website analytics.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Pre-built dashboards and marketing platforms give you surface-level insights, but they can&apos;t answer your specific questions. What if you need to compare email open rates for subscribers acquired through paid search versus organic social? What if you want to calculate customer acquisition cost by channel, broken down by week, for Q1 only? These custom analyses require direct access to your raw data.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        That&apos;s where SQL for marketing becomes essential. SQL (Structured Query Language) lets you pull exactly the data you need, combine information from multiple sources, and perform calculations that no pre-built report can match. Instead of exporting data to Excel and manually piecing together insights, you write one query and get your answer in seconds.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Career Impact:</h4>
        <p className="text-gray-700">
          Marketing analysts with SQL skills command 15-25% higher salaries than those without. According to 2026 job market data, over 60% of marketing analyst roles now list SQL as a required or preferred skill. Learning SQL for marketing analytics isn&apos;t just about better insights. It&apos;s about career advancement.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing queries that filter, join, and aggregate data,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you build those exact skills by solving mysteries with real SQL.
      </p>

      {/* SQL vs Excel for Marketing Data */}
      <h2 id="sql-vs-excel" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL vs Excel for Marketing Data</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Many marketers start with Excel for data analysis. It&apos;s familiar, visual, and great for quick calculations. But as your data grows and your questions become more complex, Excel hits its limits. Understanding when to use SQL for digital marketing versus Excel will save you hours of manual work.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Excel for Marketing</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Best for datasets under 100,000 rows</li>
            <li>Quick ad-hoc calculations and pivots</li>
            <li>Visual chart creation</li>
            <li>One-time analyses</li>
            <li>Data from a single source</li>
            <li>Manual refresh required</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">SQL for Marketing</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Handles millions of rows (ad impressions, clickstream data)</li>
            <li>Multi-table joins (CRM + campaigns + conversions)</li>
            <li>Reproducible, shareable queries</li>
            <li>Automated reporting</li>
            <li>Query multiple data sources together</li>
            <li>Real-time or scheduled updates</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        The key differentiator: SQL marketing analytics shines when you need to combine data from multiple sources. Imagine joining your CRM customer data with ad platform spend, then adding email engagement metrics and website conversion data. In Excel, that&apos;s hours of VLOOKUP formulas and manual matching. In SQL, it&apos;s a few JOIN statements.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Use Excel for final presentation and visualization. Use SQL for data extraction and transformation. The best marketing analysts use both tools where they excel.
        </p>
      </div>

      {/* 5 Essential SQL Skills for Marketing Analytics */}
      <h2 id="essential-skills" className="text-3xl font-detective text-amber-900 mt-12 mb-6">5 Essential SQL Skills for Marketing Analytics</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Every SQL query for marketers builds on five core skills. Master these, and you can answer 90% of your marketing data questions.
      </p>

      {/* Skill 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Filtering and Segmenting Campaign Data</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        The WHERE clause is your first tool for focusing on relevant data. Instead of pulling all campaigns ever run, you filter for specific date ranges, channels, or performance thresholds.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Filter Paid Search Campaigns Over $1,000 Spend</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT campaign_name, channel, spend, impressions, clicks
FROM campaigns
WHERE launch_date >= '2026-01-01'
  AND channel = 'paid_search'
  AND spend > 1000
ORDER BY spend DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This query returns only paid search campaigns launched in 2026 that spent over $1,000, sorted by highest spend first. You can swap &quot;paid_search&quot; for &quot;social&quot;, &quot;email&quot;, or any channel in your data.
        </p>
      </div>

      {/* Skill 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Aggregating Marketing Metrics</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        GROUP BY with aggregate functions (SUM, AVG, COUNT) turns row-level data into summary metrics. This is how you calculate total spend by channel, average click-through rate, or campaign count.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Total Spend and Average CPC by Channel</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT channel,
       COUNT(*) AS total_campaigns,
       SUM(spend) AS total_spend,
       SUM(clicks) AS total_clicks,
       ROUND(SUM(spend) / NULLIF(SUM(clicks), 0), 2) AS avg_cpc
FROM campaigns
WHERE launch_date >= '2026-01-01'
GROUP BY channel
ORDER BY total_spend DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This query groups all campaigns by channel and calculates total spend, total clicks, and average cost-per-click. The NULLIF prevents division-by-zero errors if a channel has zero clicks.
        </p>
      </div>

      {/* Skill 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Joining Marketing Data Sources</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        JOINs are where SQL for marketing analysts becomes powerful. Most marketing insights require combining data from multiple tables: campaigns with conversions, customers with purchases, or emails with website visits.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Campaign Spend with Conversion Data</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT c.campaign_name,
       c.channel,
       c.spend,
       COUNT(cv.conversion_id) AS conversions,
       ROUND(c.spend / NULLIF(COUNT(cv.conversion_id), 0), 2) AS cost_per_conversion
FROM campaigns c
LEFT JOIN conversions cv ON c.campaign_id = cv.campaign_id
WHERE c.launch_date >= '2026-01-01'
GROUP BY c.campaign_name, c.channel, c.spend
ORDER BY cost_per_conversion ASC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          LEFT JOIN ensures you see all campaigns, even those with zero conversions. This query calculates cost per conversion for each campaign, a critical metric for evaluating campaign efficiency.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          Use LEFT JOIN when you want to keep all records from the first table (like all campaigns) even if there are no matches in the second table (like conversions). Use INNER JOIN only when you need records that exist in both tables.
        </p>
      </div>

      {/* Skill 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Time-Based Analysis</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Marketing performance changes over time. DATE functions and time-based grouping let you analyze trends by month, week, or quarter. This is essential for spotting seasonal patterns and measuring growth.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Monthly Spend and ROI Trends</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT DATE_TRUNC('month', launch_date) AS month,
       SUM(spend) AS monthly_spend,
       SUM(revenue) AS monthly_revenue,
       ROUND((SUM(revenue) - SUM(spend)) / NULLIF(SUM(spend), 0) * 100, 1) AS roi_pct
FROM campaigns
WHERE launch_date >= '2025-01-01'
GROUP BY DATE_TRUNC('month', launch_date)
ORDER BY month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          DATE_TRUNC rounds each date down to the first day of the month, so all January campaigns group together. This shows spending trends and ROI over time, helping you identify which months performed best.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Want to sharpen your JOIN and aggregation skills?
          </p>
          <p className="text-amber-700 text-sm">
            The same SQL patterns you use for campaign analysis (multi-table JOINs, GROUP BY, filtering) are exactly what you practice in SQLNoir&apos;s crime-solving cases.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      {/* Skill 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Ranking and Window Functions</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions let you rank results within groups. This is perfect for finding your top-performing campaigns per channel, or identifying your best customers by segment.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Top Campaigns Per Channel</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT channel,
       campaign_name,
       revenue,
       ROW_NUMBER() OVER (PARTITION BY channel ORDER BY revenue DESC) AS rank
FROM campaigns
WHERE launch_date >= '2026-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This assigns a rank to each campaign within its channel. The top revenue campaign in paid search gets rank 1, the second gets rank 2, and so on. Add WHERE rank &lt;= 3 to get only the top 3 per channel.
        </p>
      </div>

      {/* Real-World Marketing SQL Queries */}
      <h2 id="real-world-queries" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Real-World Marketing SQL Queries</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Now that you understand the core skills, let&apos;s look at complete queries SQL for marketers use daily. These solve actual business questions you&apos;ll face in marketing analytics roles.
      </p>

      {/* Query 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Campaign ROI by Channel</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Which marketing channel delivers the best return on investment? This query calculates ROI and cost per acquisition (CPA) by channel for a specific time period.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: January 2026 Channel Performance</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT channel,
       SUM(spend) AS total_spend,
       SUM(revenue) AS total_revenue,
       ROUND((SUM(revenue) - SUM(spend)) / NULLIF(SUM(spend), 0) * 100, 1) AS roi_pct,
       ROUND(SUM(spend) / NULLIF(SUM(conversions), 0), 2) AS cpa
FROM campaigns
WHERE launch_date BETWEEN '2026-01-01' AND '2026-01-31'
GROUP BY channel
ORDER BY roi_pct DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This shows which channels are most profitable. An ROI of 150% means for every dollar spent, you earned $1.50 back. Lower CPA is better, it means you&apos;re acquiring customers more efficiently.
        </p>
      </div>

      {/* Query 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Email Campaign Performance</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Email marketing generates tons of metrics: sends, opens, clicks, conversions. This query calculates open rate, click-to-open rate, and conversions for each campaign.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Email Engagement Metrics</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT e.campaign_name,
       e.sent_count,
       e.open_count,
       ROUND(e.open_count * 100.0 / NULLIF(e.sent_count, 0), 1) AS open_rate,
       e.click_count,
       ROUND(e.click_count * 100.0 / NULLIF(e.open_count, 0), 1) AS click_to_open_rate,
       COUNT(cv.conversion_id) AS conversions
FROM email_campaigns e
LEFT JOIN conversions cv ON e.campaign_id = cv.campaign_id
GROUP BY e.campaign_name, e.sent_count, e.open_count, e.click_count
ORDER BY open_rate DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Open rate shows what percentage of recipients opened the email. Click-to-open rate measures how engaging your email content is once opened. Joining conversions shows which emails drive actual business results.
        </p>
      </div>

      {/* Query 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Customer Acquisition Cost by Channel (Month over Month)</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Tracking how much it costs to acquire a customer from each channel, over time, helps you optimize your marketing budget allocation.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Monthly CAC Trends by Channel</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT DATE_TRUNC('month', c.launch_date) AS month,
       c.channel,
       SUM(c.spend) AS monthly_spend,
       COUNT(DISTINCT n.customer_id) AS new_customers,
       ROUND(SUM(c.spend) / NULLIF(COUNT(DISTINCT n.customer_id), 0), 2) AS cac
FROM campaigns c
LEFT JOIN new_customers n ON c.campaign_id = n.campaign_id
  AND n.signup_date >= c.launch_date
GROUP BY DATE_TRUNC('month', c.launch_date), c.channel
ORDER BY month, cac;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This query shows if your CAC is increasing or decreasing over time for each channel. Rising CAC might mean increased competition or ad fatigue. Falling CAC suggests improving efficiency.
        </p>
      </div>

      {/* Query 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Marketing Funnel Analysis</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding your funnel conversion rates at each stage (visit, signup, trial, purchase) reveals where you&apos;re losing potential customers.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Full Funnel Conversion Rates</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT
  COUNT(DISTINCT CASE WHEN stage = 'visit' THEN user_id END) AS visitors,
  COUNT(DISTINCT CASE WHEN stage = 'signup' THEN user_id END) AS signups,
  COUNT(DISTINCT CASE WHEN stage = 'trial' THEN user_id END) AS trials,
  COUNT(DISTINCT CASE WHEN stage = 'purchase' THEN user_id END) AS purchases,
  ROUND(COUNT(DISTINCT CASE WHEN stage = 'signup' THEN user_id END) * 100.0 /
        NULLIF(COUNT(DISTINCT CASE WHEN stage = 'visit' THEN user_id END), 0), 1) AS visit_to_signup_pct,
  ROUND(COUNT(DISTINCT CASE WHEN stage = 'purchase' THEN user_id END) * 100.0 /
        NULLIF(COUNT(DISTINCT CASE WHEN stage = 'visit' THEN user_id END), 0), 1) AS visit_to_purchase_pct
FROM funnel_events
WHERE event_date >= '2026-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          CASE statements count unique users at each funnel stage. The conversion percentages show what portion of visitors make it through each step. If only 2% of visitors purchase, you have opportunities to optimize earlier stages.
        </p>
      </div>

      {/* Query 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cohort Retention Analysis</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        For subscription or SaaS businesses, cohort analysis shows how many customers from each acquisition month remain active over time. This is critical for understanding customer lifetime value.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Monthly Purchase Cohorts</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT
  DATE_TRUNC('month', first_purchase) AS cohort_month,
  DATE_TRUNC('month', order_date) AS activity_month,
  COUNT(DISTINCT customer_id) AS active_customers
FROM (
  SELECT customer_id,
         order_date,
         MIN(order_date) OVER (PARTITION BY customer_id) AS first_purchase
  FROM orders
) sub
GROUP BY DATE_TRUNC('month', first_purchase), DATE_TRUNC('month', order_date)
ORDER BY cohort_month, activity_month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          The subquery finds each customer&apos;s first purchase date using a window function. The outer query counts how many customers from each cohort made a purchase in each subsequent month. This reveals retention patterns and helps forecast revenue.
        </p>
      </div>

      {/* SQL Interview Questions for Marketing Analyst Roles */}
      <h2 id="interview-questions" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL Interview Questions for Marketing Analyst Roles</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you&apos;re applying for marketing analyst positions, expect SQL questions in your interviews. Here are five progressively challenging questions with complete solutions.
      </p>

      {/* Question 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 1 (Easy): Campaigns with Zero Conversions</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700 mb-3 font-medium">
          &quot;Find all campaigns with spend over $5,000 that had zero conversions.&quot;
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT campaign_name, channel, spend
FROM campaigns
WHERE spend > 5000
  AND conversions = 0
ORDER BY spend DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This tests basic filtering. You&apos;re looking for high-spend campaigns that didn&apos;t deliver results, which is crucial for identifying underperforming investments.
        </p>
      </div>

      {/* Question 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 2 (Easy-Medium): Q1 Channel Performance</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700 mb-3 font-medium">
          &quot;Calculate the total spend and average conversion rate by marketing channel for Q1 2026.&quot;
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT channel,
       SUM(spend) AS total_spend,
       AVG(conversion_rate) AS avg_conversion_rate
FROM campaigns
WHERE launch_date BETWEEN '2026-01-01' AND '2026-03-31'
GROUP BY channel
ORDER BY total_spend DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This tests date filtering, aggregation, and grouping. Q1 means January through March. The query shows which channels received the most budget and how they converted on average.
        </p>
      </div>

      {/* Question 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 3 (Medium): Email Performance Paradox</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700 mb-3 font-medium">
          &quot;Which email campaigns had an open rate above 25% but a conversion rate below 2%?&quot;
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT e.campaign_name,
       ROUND(e.open_count * 100.0 / NULLIF(e.sent_count, 0), 1) AS open_rate,
       ROUND(COUNT(cv.conversion_id) * 100.0 / NULLIF(e.sent_count, 0), 2) AS conversion_rate
FROM email_campaigns e
LEFT JOIN conversions cv ON e.campaign_id = cv.campaign_id
GROUP BY e.campaign_name, e.sent_count, e.open_count
HAVING ROUND(e.open_count * 100.0 / NULLIF(e.sent_count, 0), 1) > 25
   AND ROUND(COUNT(cv.conversion_id) * 100.0 / NULLIF(e.sent_count, 0), 2) < 2
ORDER BY open_rate DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This tests HAVING clauses and calculated fields. Campaigns with high opens but low conversions have engaging subject lines but weak content or poor landing pages. This insight drives optimization.
        </p>
      </div>

      {/* Question 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 4 (Medium-Hard): Top 3 Campaigns Per Channel</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700 mb-3 font-medium">
          &quot;Find the top 3 campaigns by ROI for each channel.&quot;
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH ranked_campaigns AS (
  SELECT channel,
         campaign_name,
         ROUND((revenue - spend) / NULLIF(spend, 0) * 100, 1) AS roi_pct,
         ROW_NUMBER() OVER (PARTITION BY channel ORDER BY 
           (revenue - spend) / NULLIF(spend, 0) DESC) AS rank
  FROM campaigns
  WHERE launch_date >= '2026-01-01'
)
SELECT channel, campaign_name, roi_pct, rank
FROM ranked_campaigns
WHERE rank <= 3
ORDER BY channel, rank;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This tests CTEs (Common Table Expressions) and window functions. The CTE calculates ROI and ranks campaigns within each channel. The outer query filters for top 3. This pattern is common in advanced SQL for marketing analytics.
        </p>
      </div>

      {/* Question 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 5 (Hard): Month-over-Month Growth</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700 mb-3 font-medium">
          &quot;Calculate month-over-month growth in new customer acquisitions by channel.&quot;
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH monthly_acquisitions AS (
  SELECT channel,
         DATE_TRUNC('month', signup_date) AS month,
         COUNT(DISTINCT customer_id) AS new_customers
  FROM new_customers
  GROUP BY channel, DATE_TRUNC('month', signup_date)
)
SELECT channel,
       month,
       new_customers,
       LAG(new_customers) OVER (PARTITION BY channel ORDER BY month) AS prev_month,
       ROUND((new_customers - LAG(new_customers) OVER 
         (PARTITION BY channel ORDER BY month)) * 100.0 /
         NULLIF(LAG(new_customers) OVER 
         (PARTITION BY channel ORDER BY month), 0), 1) AS growth_pct
FROM monthly_acquisitions
ORDER BY channel, month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This tests LAG window functions, which access previous rows. LAG gets last month&apos;s new customer count for comparison. The growth percentage shows if acquisition is accelerating or slowing by channel. This is advanced SQL for marketing analysts.
        </p>
      </div>

      {/* Your 6-Week SQL Learning Roadmap for Marketing */}
      <h2 id="learning-roadmap" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Your 6-Week SQL Learning Roadmap for Marketing</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learning SQL for marketing doesn&apos;t require a computer science degree. With focused practice, you can go from zero to writing real marketing queries in six weeks.
      </p>

      {/* Weeks 1-2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 1-2: SQL Fundamentals</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Start with the basics: SELECT, WHERE, ORDER BY, and simple aggregation (COUNT, SUM, AVG).
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">What to Practice:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Pull all campaigns from a specific date range</li>
          <li>Filter campaigns by channel or spend threshold</li>
          <li>Sort results by different metrics (spend, clicks, impressions)</li>
          <li>Calculate total spend across all campaigns</li>
          <li>Count how many campaigns ran per month</li>
        </ul>
        <h4 className="font-bold text-gray-900 mt-4 mb-2">Marketing Application:</h4>
        <p className="text-gray-700">
          These skills let you pull specific campaign data and calculate high-level metrics like total monthly spend or average campaign cost. You can already start answering basic questions your manager asks.
        </p>
      </div>

      {/* Weeks 3-4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 3-4: JOINs and Multi-Table Queries</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learn to combine data from multiple sources using JOIN. Focus on LEFT JOIN and INNER JOIN, and understand when to use each.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">What to Practice:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Join campaigns with conversions to calculate cost per conversion</li>
          <li>Combine customer data with purchase history</li>
          <li>Link email campaigns with click and conversion events</li>
          <li>Join ad platform data with website analytics</li>
          <li>Use GROUP BY with JOINs to aggregate across tables</li>
        </ul>
        <h4 className="font-bold text-gray-900 mt-4 mb-2">Marketing Application:</h4>
        <p className="text-gray-700">
          JOINs unlock the real power of SQL for marketing. You can now answer questions like &quot;What&apos;s our CAC by acquisition channel?&quot; or &quot;Which email campaigns drove the most purchases?&quot; These require combining data from multiple systems.
        </p>
      </div>

      {/* Weeks 5-6 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 5-6: Advanced Patterns</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Master window functions (ROW_NUMBER, LAG, LEAD), CTEs (Common Table Expressions), and advanced date manipulation. These patterns separate junior from senior marketing analysts.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">What to Practice:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Rank campaigns within each channel by performance</li>
          <li>Calculate month-over-month or week-over-week growth</li>
          <li>Build cohort retention analyses</li>
          <li>Use CTEs to break complex queries into readable steps</li>
          <li>Create rolling averages for trend smoothing</li>
        </ul>
        <h4 className="font-bold text-gray-900 mt-4 mb-2">Marketing Application:</h4>
        <p className="text-gray-700">
          These advanced techniques let you build sophisticated analyses: cohort retention, growth tracking, top-N reports per segment, and complex funnel analyses. This is senior-level SQL marketing analytics work.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Ready to put your marketing SQL skills into practice?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You have learned the queries. Now build muscle memory. SQLNoir&apos;s interactive cases have you writing SELECT, JOIN, WHERE, and GROUP BY queries to crack mysteries. The SQL patterns transfer directly to your marketing analytics work.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* FAQ */}
      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Frequently Asked Questions</h2>

      {/* FAQ 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Do marketing analysts really need SQL?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Yes. According to 2026 job market analysis, over 60% of marketing analyst positions now list SQL as required or strongly preferred. While you can perform basic marketing analysis with Excel and BI tools, SQL gives you direct access to raw data and the flexibility to answer custom questions that pre-built reports can&apos;t address. As marketing data volumes grow and organizations centralize data in warehouses, SQL becomes essential for accessing that data.
      </p>

      {/* FAQ 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How long does it take to learn SQL for marketing?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        With focused practice, most marketing professionals can learn practical SQL in 6-8 weeks. You don&apos;t need to master database administration or advanced optimization. Focus on SELECT, WHERE, JOIN, GROUP BY, and basic window functions. These cover 90% of marketing analytics use cases. Spending 5-10 hours per week on practice queries, you&apos;ll be writing useful marketing queries within a month.
      </p>

      {/* FAQ 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Can SQL replace Google Analytics?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        No, SQL and Google Analytics serve different purposes. Google Analytics is excellent for website behavior tracking, session analysis, and pre-built marketing reports. SQL is for custom analysis across multiple data sources. The ideal setup: use Google Analytics for standard web analytics, then export GA data to your data warehouse where you can query it with SQL alongside CRM data, ad platform data, and email marketing metrics. SQL lets you combine all these sources in ways Google Analytics alone cannot.
      </p>

      {/* FAQ 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What SQL databases do marketing teams use?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Common databases in marketing analytics include PostgreSQL, MySQL, BigQuery (Google), Redshift (Amazon), and Snowflake. The good news: the SQL you learn for marketing analytics is 95% the same across these platforms. Date functions and a few advanced features vary slightly, but SELECT, WHERE, JOIN, and GROUP BY work identically. Learn on any platform and you can transfer to others easily.
      </p>

      {/* FAQ 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Is Python better than SQL for marketing analytics?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL and Python are complementary, not competing. SQL excels at extracting and aggregating data from databases. It&apos;s faster for data retrieval and more efficient for large datasets. Python excels at statistical analysis, machine learning, and complex visualizations. Most senior marketing analysts use both: SQL to pull the data, Python (with pandas and matplotlib) to analyze and visualize it. Start with SQL first. It&apos;s easier to learn and immediately applicable to daily marketing analytics tasks. Add Python later for advanced modeling.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 mt-8">
        <h4 className="font-bold text-amber-900 mb-3">Final Thoughts</h4>
        <p className="text-gray-700">
          SQL for marketing isn&apos;t just about writing queries. It&apos;s about independence. Instead of waiting for the data team to build a report, you can answer your own questions. Instead of manually combining spreadsheets, you write one query that joins the data correctly. Instead of wondering &quot;what if we segmented by acquisition channel and cohort month,&quot; you write the query and get your answer. That independence makes you a more effective marketer and a more valuable team member.
        </p>
      </div>

    </div>
  );
}
