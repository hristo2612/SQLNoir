"use client";

import Link from "next/link";

export default function SqlForFinanceContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed mb-6">
        You spend three hours building a pivot table in Excel to analyze quarterly revenue trends. One SQL query could have done it in 30 seconds.
      </p>

      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li><a href="#why-sql" className="text-amber-700 hover:text-amber-900 underline">Why Financial Professionals Need SQL</a></li>
          <li><a href="#sql-vs-excel" className="text-amber-700 hover:text-amber-900 underline">SQL vs Excel for Finance</a></li>
          <li><a href="#essential-skills" className="text-amber-700 hover:text-amber-900 underline">5 Essential SQL Skills for Finance</a></li>
          <li><a href="#real-world-queries" className="text-amber-700 hover:text-amber-900 underline">Real-World Finance SQL Queries</a></li>
          <li><a href="#financial-reporting" className="text-amber-700 hover:text-amber-900 underline">SQL for Financial Reporting</a></li>
          <li><a href="#interview-questions" className="text-amber-700 hover:text-amber-900 underline">SQL Interview Questions for Finance Roles</a></li>
          <li><a href="#learning-roadmap" className="text-amber-700 hover:text-amber-900 underline">Your 6-Week SQL Learning Roadmap</a></li>
          <li><a href="#faq" className="text-amber-700 hover:text-amber-900 underline">FAQ</a></li>
        </ul>
      </div>

      <h2 id="why-sql" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Why Financial Professionals Need SQL</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Finance departments generate millions of rows of data every month. Transaction records, account balances, customer portfolios, trading activity. Your Excel file with 500,000 rows? It crashes when you try to add a formula column.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL handles this effortlessly. Databases are built to query millions of records in seconds. While Excel chokes on large datasets, SQL thrives on them.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Career Impact:</h4>
        <p className="text-gray-700">SQL is the #1 requested technical skill for financial analyst positions. Professionals who know SQL earn 15-25% more than those who don&apos;t. It&apos;s not just a nice-to-have anymore. It&apos;s table stakes for senior finance roles.</p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        When you know SQL for financial analysis, you stop being the person who waits for IT to pull reports. You become the person who answers business questions in real time. That changes everything.
      </p>

      <h2 id="sql-vs-excel" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL vs Excel for Finance</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Let&apos;s be clear: SQL isn&apos;t replacing Excel. You need both. But you need to know when to use which.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Excel is great for:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Quick ad-hoc calculations</li>
            <li>Small datasets (under 50,000 rows)</li>
            <li>Charts and visualization</li>
            <li>Sharing with non-technical stakeholders</li>
            <li>What-if scenario modeling</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">SQL is great for:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Large datasets (millions of rows)</li>
            <li>Complex multi-table joins</li>
            <li>Reproducible analysis</li>
            <li>Audit trails and version control</li>
            <li>Automated reporting pipelines</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        The ideal workflow: Use SQL to extract and transform your data, then export to Excel for final formatting and presentation. SQL does the heavy lifting. Excel makes it pretty.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing financial queries hands-on,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to solve mysteries — every aggregation, join, and window function mirrors what you&apos;ll use analyzing revenue, portfolios, and budgets.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: 10 Minutes in Excel vs 3 Lines of SQL</h4>
        <p className="text-gray-600 text-sm mb-3">Find the average transaction amount by customer type for Q4 2024:</p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  customer_type,
  AVG(transaction_amount) AS avg_transaction
FROM transactions
WHERE transaction_date >= '2024-10-01' 
  AND transaction_date < '2025-01-01'
GROUP BY customer_type;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">In Excel, you&apos;d need to filter dates manually, create helper columns, use AVERAGEIF functions, and build a pivot table. In SQL? Three seconds.</p>
      </div>

      <h2 id="essential-skills" className="text-3xl font-detective text-amber-900 mt-12 mb-6">5 Essential SQL Skills for Finance</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These five patterns cover 90% of what you&apos;ll do as a financial analyst using SQL. Master these, and you&apos;re dangerous.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Filtering and Querying</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Pull exactly the records you need. No more scrolling through thousands of rows.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: High-Value Transactions in December</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  transaction_id,
  customer_id,
  transaction_amount,
  transaction_date
FROM transactions
WHERE transaction_amount > 50000
  AND transaction_date >= '2024-12-01'
  AND transaction_date < '2025-01-01'
  AND status = 'completed'
ORDER BY transaction_amount DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Find all completed transactions over $50K in December. Sorted largest to smallest. Takes milliseconds, even on millions of records.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Aggregation and GROUP BY</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Sum, average, count, min, max. The bread and butter of financial analysis.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Monthly Revenue by Department</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  department,
  DATE_TRUNC('month', sale_date) AS month,
  SUM(revenue) AS total_revenue,
  COUNT(*) AS num_transactions,
  AVG(revenue) AS avg_transaction_size
FROM sales
WHERE sale_date >= '2024-01-01'
GROUP BY department, DATE_TRUNC('month', sale_date)
ORDER BY month, total_revenue DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">One query gives you monthly revenue totals, transaction counts, and average deal size by department. This would take 20 minutes in Excel.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. JOINs</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Combine data from multiple tables. This is where SQL really shines over Excel.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Customer Revenue with Account Details</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  c.customer_name,
  c.customer_type,
  a.account_number,
  SUM(t.transaction_amount) AS total_spent
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
JOIN transactions t ON a.account_id = t.account_id
WHERE t.transaction_date >= '2024-01-01'
GROUP BY c.customer_name, c.customer_type, a.account_number
HAVING SUM(t.transaction_amount) > 100000
ORDER BY total_spent DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Combine customer info, account details, and transaction data across three tables. Show only customers who spent over $100K this year.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Window Functions</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Running totals, rankings, and comparisons. This is advanced SQL, but it&apos;s what separates good analysts from great ones.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Year-over-Year Revenue Comparison</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  product_name,
  EXTRACT(YEAR FROM sale_date) AS year,
  SUM(revenue) AS annual_revenue,
  LAG(SUM(revenue)) OVER (
    PARTITION BY product_name 
    ORDER BY EXTRACT(YEAR FROM sale_date)
  ) AS previous_year_revenue,
  ROUND(
    (SUM(revenue) - LAG(SUM(revenue)) OVER (
      PARTITION BY product_name 
      ORDER BY EXTRACT(YEAR FROM sale_date)
    )) / LAG(SUM(revenue)) OVER (
      PARTITION BY product_name 
      ORDER BY EXTRACT(YEAR FROM sale_date)
    ) * 100, 
    2
  ) AS yoy_growth_pct
FROM sales
GROUP BY product_name, EXTRACT(YEAR FROM sale_date)
ORDER BY product_name, year;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Calculate year-over-year growth for each product. LAG() pulls the previous year&apos;s revenue for comparison. Try doing that in Excel without helper columns.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Date Operations</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Finance lives and dies by dates. Fiscal quarters, month-end closes, year-over-year comparisons.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Quarterly Revenue (Fiscal Year Starting April)</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  CASE 
    WHEN EXTRACT(MONTH FROM sale_date) IN (4,5,6) THEN 'Q1'
    WHEN EXTRACT(MONTH FROM sale_date) IN (7,8,9) THEN 'Q2'
    WHEN EXTRACT(MONTH FROM sale_date) IN (10,11,12) THEN 'Q3'
    ELSE 'Q4'
  END AS fiscal_quarter,
  SUM(revenue) AS quarterly_revenue
FROM sales
WHERE sale_date >= '2024-04-01' 
  AND sale_date < '2025-04-01'
GROUP BY fiscal_quarter
ORDER BY fiscal_quarter;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Custom fiscal quarters with CASE statements. Works for any fiscal year start date.</p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Master these patterns with financial data mysteries
          </p>
          <p className="text-amber-700 text-sm">
            Each SQLNoir case gives you transaction tables, account ledgers, and portfolio data. You&apos;ll write JOINs to connect customers to their spending, window functions to track revenue trends, and aggregations to catch budget anomalies — the exact skills finance teams need.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      <h2 id="real-world-queries" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Real-World Finance SQL Queries You Can Use Today</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Copy these queries. Adapt them to your tables. Use them tomorrow morning.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Month-over-Month Revenue Comparison</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  DATE_TRUNC('month', sale_date) AS month,
  SUM(revenue) AS current_month_revenue,
  LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', sale_date)) AS previous_month_revenue,
  SUM(revenue) - LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', sale_date)) AS mom_change,
  ROUND(
    (SUM(revenue) - LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', sale_date))) / 
    LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC('month', sale_date)) * 100,
    2
  ) AS mom_change_pct
FROM sales
GROUP BY DATE_TRUNC('month', sale_date)
ORDER BY month DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Instant month-over-month comparison with absolute and percentage change. Perfect for monthly board reports.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Running Total / Cumulative Balance</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  transaction_date,
  transaction_amount,
  transaction_type,
  SUM(
    CASE 
      WHEN transaction_type = 'credit' THEN transaction_amount
      ELSE -transaction_amount
    END
  ) OVER (ORDER BY transaction_date, transaction_id) AS running_balance
FROM account_transactions
WHERE account_id = 'ACC-12345'
ORDER BY transaction_date, transaction_id;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Running account balance that updates with every transaction. The SUM() OVER() window function keeps a cumulative total.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Customer Segmentation by Spend Tier</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  customer_id,
  total_spent,
  CASE 
    WHEN total_spent >= 500000 THEN 'Platinum'
    WHEN total_spent >= 100000 THEN 'Gold'
    WHEN total_spent >= 25000 THEN 'Silver'
    ELSE 'Bronze'
  END AS customer_tier,
  NTILE(10) OVER (ORDER BY total_spent DESC) AS decile
FROM (
  SELECT 
    customer_id,
    SUM(transaction_amount) AS total_spent
  FROM transactions
  WHERE transaction_date >= '2024-01-01'
  GROUP BY customer_id
) customer_totals
ORDER BY total_spent DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Segment customers into tiers based on spending. NTILE(10) also gives you decile rankings. Use this for targeted marketing or account management prioritization.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Top N Accounts by Revenue</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  region,
  account_name,
  total_revenue,
  revenue_rank
FROM (
  SELECT 
    r.region_name AS region,
    a.account_name,
    SUM(t.transaction_amount) AS total_revenue,
    ROW_NUMBER() OVER (PARTITION BY r.region_name ORDER BY SUM(t.transaction_amount) DESC) AS revenue_rank
  FROM accounts a
  JOIN regions r ON a.region_id = r.region_id
  JOIN transactions t ON a.account_id = t.account_id
  WHERE t.transaction_date >= '2024-01-01'
  GROUP BY r.region_name, a.account_name
) ranked_accounts
WHERE revenue_rank <= 3
ORDER BY region, revenue_rank;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Top 3 revenue-generating accounts per region. ROW_NUMBER() partitioned by region ranks accounts within each region separately.</p>
      </div>

      <h2 id="financial-reporting" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL for Financial Reporting</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL isn&apos;t just for ad-hoc analysis. It&apos;s your foundation for automated, reliable financial reporting.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        When you build reports in SQL, they&apos;re reproducible. Run the same query next month, get updated numbers instantly. No risk of accidentally dragging a formula to the wrong cell. No mystery calculations that only you understand.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Budget vs Actual Variance Analysis</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  d.department_name,
  b.budget_amount,
  COALESCE(a.actual_amount, 0) AS actual_amount,
  b.budget_amount - COALESCE(a.actual_amount, 0) AS variance,
  ROUND(
    (b.budget_amount - COALESCE(a.actual_amount, 0)) / b.budget_amount * 100,
    2
  ) AS variance_pct,
  CASE 
    WHEN COALESCE(a.actual_amount, 0) > b.budget_amount THEN 'Over Budget'
    WHEN COALESCE(a.actual_amount, 0) < b.budget_amount * 0.9 THEN 'Significantly Under'
    ELSE 'On Track'
  END AS status
FROM departments d
JOIN budgets b ON d.department_id = b.department_id
LEFT JOIN (
  SELECT 
    department_id,
    SUM(expense_amount) AS actual_amount
  FROM expenses
  WHERE expense_date >= '2024-01-01' 
    AND expense_date < '2025-01-01'
  GROUP BY department_id
) a ON d.department_id = a.department_id
WHERE b.fiscal_year = 2024
ORDER BY variance DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Complete budget variance report with status flags. Left join ensures departments with no expenses still appear. COALESCE handles nulls gracefully.</p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Save this query. Schedule it to run automatically. Export to Excel for formatting. You just automated a report that used to take half a day every month.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Audit Trail Advantage:</h4>
        <p className="text-gray-700">SQL queries create a paper trail. When someone asks how you calculated a number, you show them the query. Compare that to Excel formulas scattered across 15 worksheets that reference each other in ways even you don&apos;t remember.</p>
      </div>

      <h2 id="interview-questions" className="text-3xl font-detective text-amber-900 mt-12 mb-6">SQL Interview Questions for Finance Roles</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Investment banks, hedge funds, and corporate finance teams test SQL skills in interviews. Here are five common questions with solutions.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 1: Find all transactions above $10,000 in Q4 2024</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  transaction_id,
  customer_id,
  transaction_amount,
  transaction_date
FROM transactions
WHERE transaction_amount > 10000
  AND transaction_date >= '2024-10-01'
  AND transaction_date < '2025-01-01'
ORDER BY transaction_amount DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Tests basic filtering and date range logic. Q4 = October, November, December.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 2: Calculate month-over-month revenue growth for each product</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  product_id,
  month,
  monthly_revenue,
  previous_month_revenue,
  ROUND(
    (monthly_revenue - previous_month_revenue) / previous_month_revenue * 100,
    2
  ) AS mom_growth_pct
FROM (
  SELECT 
    product_id,
    DATE_TRUNC('month', sale_date) AS month,
    SUM(revenue) AS monthly_revenue,
    LAG(SUM(revenue)) OVER (
      PARTITION BY product_id 
      ORDER BY DATE_TRUNC('month', sale_date)
    ) AS previous_month_revenue
  FROM sales
  GROUP BY product_id, DATE_TRUNC('month', sale_date)
) monthly_data
WHERE previous_month_revenue IS NOT NULL
ORDER BY product_id, month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Tests window functions. LAG() partitioned by product ensures you&apos;re comparing each product to its own previous month, not mixing products.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 3: Find customers whose spending decreased by more than 20%</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  customer_id,
  current_year_spend,
  previous_year_spend,
  ROUND(
    (current_year_spend - previous_year_spend) / previous_year_spend * 100,
    2
  ) AS spend_change_pct
FROM (
  SELECT 
    customer_id,
    SUM(CASE WHEN EXTRACT(YEAR FROM transaction_date) = 2024 THEN transaction_amount ELSE 0 END) AS current_year_spend,
    SUM(CASE WHEN EXTRACT(YEAR FROM transaction_date) = 2023 THEN transaction_amount ELSE 0 END) AS previous_year_spend
  FROM transactions
  WHERE EXTRACT(YEAR FROM transaction_date) IN (2023, 2024)
  GROUP BY customer_id
) yearly_spend
WHERE previous_year_spend > 0
  AND (current_year_spend - previous_year_spend) / previous_year_spend < -0.20
ORDER BY spend_change_pct;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Tests conditional aggregation with CASE statements. Identifies at-risk customers for retention campaigns.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 4: Identify the top 3 revenue-generating accounts per region</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  region,
  account_id,
  total_revenue,
  regional_rank
FROM (
  SELECT 
    a.region,
    a.account_id,
    SUM(t.transaction_amount) AS total_revenue,
    ROW_NUMBER() OVER (PARTITION BY a.region ORDER BY SUM(t.transaction_amount) DESC) AS regional_rank
  FROM accounts a
  JOIN transactions t ON a.account_id = t.account_id
  GROUP BY a.region, a.account_id
) ranked
WHERE regional_rank <= 3
ORDER BY region, regional_rank;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Tests ROW_NUMBER() with PARTITION BY. Common pattern for &quot;top N per category&quot; problems.</p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Question 5: Calculate a 3-month moving average of daily trading volume</h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT 
  trade_date,
  daily_volume,
  AVG(daily_volume) OVER (
    ORDER BY trade_date
    ROWS BETWEEN 89 PRECEDING AND CURRENT ROW
  ) AS moving_avg_90_day
FROM (
  SELECT 
    trade_date,
    SUM(volume) AS daily_volume
  FROM trades
  GROUP BY trade_date
) daily_totals
ORDER BY trade_date DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">Tests window frames. &quot;ROWS BETWEEN 89 PRECEDING AND CURRENT ROW&quot; gives you a 90-day (roughly 3-month) moving average.</p>
      </div>

      <h2 id="learning-roadmap" className="text-3xl font-detective text-amber-900 mt-12 mb-6">Your 6-Week SQL Learning Roadmap</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here&apos;s how to go from zero to confident SQL for finance professionals in six weeks. 30 minutes a day.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 1-2: SQL Fundamentals</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learn SELECT, WHERE, ORDER BY, and basic aggregations (SUM, AVG, COUNT). Practice filtering transaction data, sorting results, and calculating totals.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>SELECT specific columns from tables</li>
        <li>Filter with WHERE (dates, amounts, categories)</li>
        <li>Sort with ORDER BY</li>
        <li>GROUP BY with SUM, AVG, COUNT, MIN, MAX</li>
        <li>HAVING to filter aggregated results</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>What you&apos;ll be able to do:</strong> Pull monthly revenue summaries, find high-value transactions, calculate department totals.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 3-4: JOINs and Subqueries</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Combine data from multiple tables with INNER JOIN, LEFT JOIN, and RIGHT JOIN. Write subqueries to answer complex questions.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>INNER JOIN to combine matching records</li>
        <li>LEFT JOIN to keep all records from one table</li>
        <li>Subqueries in WHERE and FROM clauses</li>
        <li>Date functions (DATE_TRUNC, EXTRACT, date arithmetic)</li>
        <li>CASE statements for conditional logic</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>What you&apos;ll be able to do:</strong> Combine customer and transaction data, build fiscal quarter reports, create customer segments.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Weeks 5-6: Window Functions and Real Projects</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Master window functions (ROW_NUMBER, RANK, LAG, LEAD, running totals). Apply everything to real finance use cases.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>ROW_NUMBER() for rankings</li>
        <li>LAG() and LEAD() for period-over-period comparisons</li>
        <li>SUM() OVER() for running totals</li>
        <li>PARTITION BY to group window calculations</li>
        <li>Build complete reports (budget variance, revenue trends, customer analysis)</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>What you&apos;ll be able to do:</strong> Everything in this guide. Build production-ready financial reports, answer complex business questions, impress hiring managers.
      </p>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Put Your Finance SQL Skills to the Test
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You&apos;ve learned the syntax. Now practice with realistic financial scenarios. SQLNoir cases simulate the exact queries analysts write daily — tracking quarterly revenue variance, identifying high-value customer segments, reconciling ledger discrepancies. Learn SQL by solving mysteries, and you&apos;ll remember it forever.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">FAQ</h2>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Do I need SQL if I already know Excel?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Yes. Excel is amazing for small datasets and presentation. But when you hit 100,000+ rows, complex multi-table analysis, or need reproducible reports, SQL is non-negotiable. Think of Excel as your front-end and SQL as your back-end. You need both.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How long does it take to learn SQL for finance?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        You can write useful queries in two weeks. Confident enough for most financial analyst roles? Six weeks of consistent practice. Advanced window functions and optimization? Three months. But you don&apos;t need to be an expert to get value immediately.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Is SQL used in investment banking?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        Absolutely. Front-office roles (trading, sales) use SQL to analyze market data. Middle and back office use it for risk management, reporting, and compliance. Hedge funds and asset managers use SQL constantly. It&apos;s everywhere in finance.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Which SQL database should I learn for finance?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        PostgreSQL or MySQL for learning. Most finance companies use enterprise databases (Oracle, SQL Server, Snowflake, Redshift), but the SQL syntax is 95% the same. Learn the fundamentals with PostgreSQL, and you&apos;ll adapt to any database in a week.
      </p>

      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Can SQL replace Excel for financial analysis?</h3>

      <p className="text-gray-700 leading-relaxed mb-6">
        No, and it shouldn&apos;t. SQL pulls and transforms data. Excel formats, visualizes, and presents it. The best workflow: Extract data with SQL, analyze and present in Excel. Use the right tool for each job.
      </p>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">Start Using SQL in Finance Today</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL for financial analysts isn&apos;t optional anymore. It&apos;s the difference between spending hours on manual data work and answering business questions in seconds. Between being dependent on IT and being self-sufficient. Between junior analyst and senior analyst salary bands.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Start with the five essential skills. Copy the real-world queries. Practice with sample data. In six weeks, you&apos;ll wonder how you ever worked without it.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Want to practice SQL for finance in a way that actually sticks? You need hands-on experience with queries that mirror real financial analysis patterns.
      </p>
    </div>
  );
}
