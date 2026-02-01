"use client";

import Link from "next/link";

export default function SqlForHealthcareContent() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Intro */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Healthcare generates 30% of the world&apos;s data. One SQL query can surface patient insights that take hours to find in spreadsheets.
      </p>

      {/* Quick Navigation */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <ul className="space-y-2">
          <li><a href="#why-sql" className="text-amber-700 hover:text-amber-900 underline">Why Healthcare Professionals Need SQL</a></li>
          <li><a href="#sql-vs-excel" className="text-amber-700 hover:text-amber-900 underline">SQL vs Excel for Healthcare Data</a></li>
          <li><a href="#essential-skills" className="text-amber-700 hover:text-amber-900 underline">5 Essential SQL Skills for Healthcare Analytics</a></li>
          <li><a href="#real-world-queries" className="text-amber-700 hover:text-amber-900 underline">Real-World Healthcare SQL Queries</a></li>
          <li><a href="#hipaa" className="text-amber-700 hover:text-amber-900 underline">Working with Healthcare Data: HIPAA Considerations</a></li>
          <li><a href="#interview-questions" className="text-amber-700 hover:text-amber-900 underline">SQL Interview Questions for Healthcare Roles</a></li>
          <li><a href="#learning-roadmap" className="text-amber-700 hover:text-amber-900 underline">Your 6-Week SQL Learning Roadmap</a></li>
          <li><a href="#faq" className="text-amber-700 hover:text-amber-900 underline">FAQ</a></li>
        </ul>
      </div>

      {/* Why Healthcare Professionals Need SQL */}
      <h2 id="why-sql" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Why Healthcare Professionals Need SQL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        The healthcare data explosion is real. Electronic health records (EHRs), insurance claims, lab results, medical imaging, wearable devices, and IoT monitors generate petabytes of patient data every year. By 2026, healthcare organizations will be drowning in data but starving for insights.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL for healthcare is the bridge between raw data and actionable intelligence. While physicians diagnose patients, data analysts armed with SQL diagnose system-wide patterns: readmission trends, medication interactions, resource utilization, and quality metrics that directly impact patient outcomes.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Modern healthcare databases run on SQL. Epic, Cerner, Meditech, and virtually every major EHR system stores data in relational databases. If you want to analyze that data at scale, you need SQL for healthcare professionals as a core skill.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Career Impact:</h4>
        <p className="text-gray-700 mb-3">Health informatics analysts with SQL skills earn 20-30% more than those without. According to 2025 data:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Healthcare data analysts: $75,000 - $95,000 average salary</li>
          <li>Clinical informaticists with SQL: $90,000 - $120,000</li>
          <li>Senior healthcare analytics roles: $110,000+</li>
        </ul>
      </div>

      {/* SQL vs Excel for Healthcare Data */}
      <h2 id="sql-vs-excel" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        SQL vs Excel for Healthcare Data
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Excel has its place in healthcare analytics, but SQL is the professional standard for working with patient data at scale. Here&apos;s when to use each:
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">Excel</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Quick ad-hoc analysis</li>
            <li>Small datasets (under 100k rows)</li>
            <li>Visual charts and dashboards</li>
            <li>One-off reports</li>
            <li>Sharing with non-technical users</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3">SQL</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Millions of patient records</li>
            <li>Multi-table joins (patients + diagnoses + meds)</li>
            <li>Reproducible, documented analysis</li>
            <li>Audit trails for compliance</li>
            <li>Complex calculations and aggregations</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Consider this real-world scenario: You need to find all patients readmitted within 30 days of discharge. In Excel, you&apos;d export discharge data, sort by patient ID, manually calculate day differences, filter, and hope you didn&apos;t miss edge cases. Five minutes of manual work, prone to errors.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        In SQL? Three lines of healthcare data analysis sql:
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: 30-Day Readmission Count</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT COUNT(*) AS readmissions
FROM admissions a1
JOIN admissions a2 ON a1.patient_id = a2.patient_id
WHERE DATEDIFF(day, a1.discharge_date, a2.admission_date) BETWEEN 1 AND 30;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Instant results across millions of records. Reproducible. Auditable.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to practice writing multi-table joins and date calculations hands-on,{" "}
        <Link href="/cases" className="text-amber-700 hover:text-amber-900 underline font-medium">
          SQLNoir&apos;s detective cases
        </Link>{" "}
        let you write real queries to solve mysteries — building the exact muscle memory you need for patient cohort analysis and readmission tracking.
      </p>

      {/* 5 Essential SQL Skills for Healthcare Analytics */}
      <h2 id="essential-skills" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        5 Essential SQL Skills for Healthcare Analytics
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These five SQL healthcare queries form the foundation of healthcare data analysis. Master these, and you&apos;ll be able to tackle 80% of common healthcare analytics tasks.
      </p>

      {/* Skill 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Filtering Patient Records (WHERE, AND, OR)</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Healthcare analytics starts with finding the right patient cohort. The WHERE clause lets you filter records based on diagnosis, age, admission dates, or any combination of criteria.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Find Diabetic Patients Over 65 Admitted in 2025</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT patient_id, name, age, diagnosis, admission_date
FROM patients
WHERE diagnosis = 'Type 2 Diabetes'
  AND age > 65
  AND admission_date >= '2025-01-01';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This query identifies high-risk elderly diabetic patients for targeted care management programs.
        </p>
      </div>

      {/* Skill 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Aggregating Clinical Data (GROUP BY, COUNT, AVG)</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Aggregations turn individual records into meaningful statistics. Average length of stay, patient counts by department, and total costs are all aggregation queries.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Average Length of Stay by Department</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT department,
       COUNT(*) AS total_admissions,
       AVG(DATEDIFF(day, admission_date, discharge_date)) AS avg_stay_days
FROM admissions
GROUP BY department
ORDER BY avg_stay_days DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Identify departments with unusually long stays that might need process improvements or additional resources.
        </p>
      </div>

      {/* Skill 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Joining Multiple Tables (JOIN)</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Healthcare data lives across multiple tables. Patient demographics in one table, diagnoses in another, medications in a third. JOINs connect these tables to create a complete patient picture.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Combine Patients, Diagnoses, and Medications</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT p.patient_id, p.name,
       d.diagnosis, d.diagnosis_date,
       m.medication_name, m.dosage
FROM patients p
JOIN diagnoses d ON p.patient_id = d.patient_id
JOIN medications m ON p.patient_id = m.patient_id
WHERE d.diagnosis = 'Hypertension'
ORDER BY p.name;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          See which medications hypertensive patients are taking, useful for medication reconciliation and treatment pattern analysis.
        </p>
      </div>

      {/* Skill 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Window Functions for Trend Analysis</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Window functions let you calculate rolling averages, running totals, and trends without collapsing your data. Perfect for tracking monthly ER visits, seasonal flu patterns, or patient volume trends.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Track Monthly ER Visits with Rolling Average</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT visit_month,
       er_visits,
       AVG(er_visits) OVER (
         ORDER BY visit_month 
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS three_month_avg
FROM monthly_er_stats
ORDER BY visit_month;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Smooth out monthly fluctuations to identify real trends in emergency department utilization.
        </p>
      </div>

      {/* Skill 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subqueries for Complex Analysis</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Subqueries let you use one query&apos;s results inside another. Find patients above average cost, departments performing better than the median, or outliers in any metric.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Find Patients Exceeding Average Hospital Charges</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT patient_id, name, total_charges
FROM patients
WHERE total_charges > (
  SELECT AVG(total_charges) FROM patients
)
ORDER BY total_charges DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Identify high-cost cases for case management review and cost optimization opportunities.
        </p>
      </div>

      {/* Real-World Healthcare SQL Queries */}
      <h2 id="real-world-queries" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Real-World Healthcare SQL Queries
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        These sql for healthcare analytics patterns are what professional healthcare analysts use daily. They combine multiple SQL techniques to answer business-critical questions.
      </p>

      {/* Query 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">30-Day Readmission Rate</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Hospital readmissions within 30 days are a key quality metric. The Centers for Medicare & Medicaid Services (CMS) penalizes hospitals with high readmission rates, making this one of the most important healthcare analytics queries.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Calculate 30-Day Readmission Rate</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH discharge_events AS (
  SELECT patient_id,
         discharge_date,
         LEAD(admission_date) OVER (
           PARTITION BY patient_id 
           ORDER BY admission_date
         ) AS next_admission
  FROM admissions
)
SELECT 
  COUNT(CASE 
    WHEN DATEDIFF(day, discharge_date, next_admission) <= 30 
    THEN 1 
  END) AS readmissions,
  COUNT(*) AS total_discharges,
  ROUND(
    COUNT(CASE 
      WHEN DATEDIFF(day, discharge_date, next_admission) <= 30 
      THEN 1 
    END) * 100.0 / COUNT(*), 
    1
  ) AS readmission_rate
FROM discharge_events;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          This query uses a CTE and window function to identify each patient&apos;s next admission, then calculates what percentage happened within 30 days. Target rate: under 15%.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">Why This Matters:</h4>
        <p className="text-gray-700">
          A 1% reduction in readmission rate can save a mid-sized hospital $1-2 million annually in avoided CMS penalties and reduced care costs.
        </p>
      </div>

      {/* Query 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Patient Wait Times by Department</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Emergency department wait times directly impact patient satisfaction scores and can reveal staffing or process bottlenecks.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Analyze ER Wait Times</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT department,
       AVG(DATEDIFF(minute, check_in_time, seen_by_doctor_time)) AS avg_wait_minutes,
       MAX(DATEDIFF(minute, check_in_time, seen_by_doctor_time)) AS max_wait_minutes,
       COUNT(*) AS total_visits
FROM er_visits
WHERE visit_date >= '2025-01-01'
GROUP BY department
ORDER BY avg_wait_minutes DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Identify departments with excessive wait times. National benchmark: average ER wait time under 30 minutes.
        </p>
      </div>

      {/* Query 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Medication Frequency Analysis</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Understanding which medications are prescribed most frequently helps with formulary decisions, inventory management, and identifying potential overuse patterns.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Top 10 Prescribed Medications</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT m.medication_name,
       COUNT(DISTINCT p.patient_id) AS patients_prescribed,
       COUNT(*) AS total_prescriptions
FROM prescriptions p
JOIN medications m ON p.medication_id = m.medication_id
GROUP BY m.medication_name
ORDER BY patients_prescribed DESC
LIMIT 10;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Useful for pharmacy inventory planning and identifying medications that might benefit from bulk purchasing agreements.
        </p>
      </div>

      {/* Query 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Patient Outcome Tracking by Diagnosis</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Track recovery rates and patient outcomes across different diagnoses to measure treatment effectiveness and identify areas for clinical improvement.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Example: Outcome Analysis by Diagnosis</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT diagnosis,
       COUNT(*) AS total_cases,
       SUM(CASE WHEN outcome = 'Recovered' THEN 1 ELSE 0 END) AS recovered,
       SUM(CASE WHEN outcome = 'Transferred' THEN 1 ELSE 0 END) AS transferred,
       ROUND(
         SUM(CASE WHEN outcome = 'Recovered' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
         1
       ) AS recovery_rate
FROM patient_outcomes
GROUP BY diagnosis
ORDER BY total_cases DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Compare recovery rates across diagnoses to benchmark against national standards and identify potential quality improvement opportunities.
        </p>
      </div>

      {/* SQLNoir CTA - Tier 2 */}
      <div className="not-prose my-10 p-6 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl shrink-0">🔍</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-amber-900 font-detective text-lg mb-1">
            Master Healthcare Analytics Through Real Query Practice
          </p>
          <p className="text-amber-700 text-sm">
            The queries you just learned — JOINs, window functions, CTEs for readmission tracking — are exactly what you&apos;ll write analyzing patient cohorts and clinical outcomes. SQLNoir cases let you build these skills by solving mysteries with hospital databases, prescription records, and patient timelines.
          </p>
        </div>
        <Link
          href="/cases"
          className="shrink-0 px-5 py-2.5 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective transition-colors whitespace-nowrap"
        >
          Try a Case →
        </Link>
      </div>

      {/* HIPAA Considerations */}
      <h2 id="hipaa" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Working with Healthcare Data: HIPAA Considerations
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        When working with SQL for healthcare, compliance is non-negotiable. The Health Insurance Portability and Accountability Act (HIPAA) governs how you access, query, and analyze patient data.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Key principles for healthcare SQL work:
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li><strong>De-identify data before analysis:</strong> Replace patient names and identifiers with anonymous IDs whenever possible</li>
        <li><strong>Minimum necessary standard:</strong> Only query the data you actually need. Don&apos;t SELECT * if you only need a few columns</li>
        <li><strong>Audit trails:</strong> Document your queries. Many healthcare databases log all SQL access for compliance audits</li>
        <li><strong>Role-based access:</strong> You should only have database permissions for your legitimate job functions</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Pro Tip</h3>
        <p className="text-blue-800">
          In practice, most healthcare SQL work happens on de-identified datasets or within controlled environments with role-based access. Your queries might return patient_id values like &quot;PT000123&quot; instead of actual names. This lets you do powerful analysis while maintaining patient privacy.
        </p>
      </div>

      {/* SQL Interview Questions */}
      <h2 id="interview-questions" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        SQL Interview Questions for Healthcare Roles
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Preparing for a healthcare data analyst interview? These five progressive questions cover the range from basic to advanced sql healthcare queries you might encounter.
      </p>

      {/* Question 1 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 1 (Basic): Find All Patients Diagnosed with COVID-19 in Q1 2025</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT patient_id, name, diagnosis_date
FROM diagnoses
WHERE diagnosis = 'COVID-19'
  AND diagnosis_date BETWEEN '2025-01-01' AND '2025-03-31'
ORDER BY diagnosis_date;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Tests basic filtering with WHERE and date range logic. Simple but essential.
        </p>
      </div>

      {/* Question 2 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 2 (Intermediate): Calculate Average Length of Stay Per Diagnosis (100+ Admissions Only)</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT diagnosis,
       COUNT(*) AS admission_count,
       AVG(DATEDIFF(day, admission_date, discharge_date)) AS avg_los
FROM admissions
GROUP BY diagnosis
HAVING COUNT(*) >= 100
ORDER BY avg_los DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Tests GROUP BY, aggregation, and the HAVING clause for filtering grouped results. The HAVING clause is key here.
        </p>
      </div>

      {/* Question 3 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 3 (Intermediate): Find Departments Where Average Wait Time Exceeds 45 Minutes</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT department,
       AVG(DATEDIFF(minute, check_in_time, seen_by_doctor_time)) AS avg_wait_minutes,
       COUNT(*) AS total_visits
FROM er_visits
WHERE visit_date >= '2025-01-01'
GROUP BY department
HAVING AVG(DATEDIFF(minute, check_in_time, seen_by_doctor_time)) > 45
ORDER BY avg_wait_minutes DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Combines date filtering, aggregation, and HAVING. Common real-world scenario in ER analytics.
        </p>
      </div>

      {/* Question 4 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 4 (Advanced): Calculate 30-Day Readmission Rate by Hospital</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`WITH readmissions AS (
  SELECT a1.hospital_id,
         a1.patient_id,
         a1.discharge_date,
         MIN(a2.admission_date) AS next_admission
  FROM admissions a1
  LEFT JOIN admissions a2 
    ON a1.patient_id = a2.patient_id
    AND a2.admission_date > a1.discharge_date
    AND DATEDIFF(day, a1.discharge_date, a2.admission_date) <= 30
  GROUP BY a1.hospital_id, a1.patient_id, a1.discharge_date
)
SELECT hospital_id,
       COUNT(*) AS total_discharges,
       SUM(CASE WHEN next_admission IS NOT NULL THEN 1 ELSE 0 END) AS readmissions,
       ROUND(
         SUM(CASE WHEN next_admission IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
         1
       ) AS readmission_rate
FROM readmissions
GROUP BY hospital_id
ORDER BY readmission_rate DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Tests CTE knowledge, self-joins, and complex date logic. This is a real analyst-level question.
        </p>
      </div>

      {/* Question 5 */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Question 5 (Advanced): Identify Frequent Flyers (3+ ER Visits in 90 Days)</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">Solution:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`SELECT patient_id,
       COUNT(*) AS visit_count,
       MIN(visit_date) AS first_visit,
       MAX(visit_date) AS last_visit,
       DATEDIFF(day, MIN(visit_date), MAX(visit_date)) AS day_span
FROM er_visits
WHERE visit_date >= DATEADD(day, -90, GETDATE())
GROUP BY patient_id
HAVING COUNT(*) >= 3
ORDER BY visit_count DESC;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Tests date math, aggregation, and HAVING with COUNT. Frequent flyer programs help hospitals provide better care coordination for high-utilization patients.
        </p>
      </div>

      {/* Learning Roadmap */}
      <h2 id="learning-roadmap" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Your 6-Week SQL Learning Roadmap for Healthcare
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Learning SQL for healthcare professionals doesn&apos;t require a computer science degree. Follow this structured 6-week plan and you&apos;ll be writing production-ready healthcare queries by week seven.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 1-2: SQL Fundamentals + Healthcare Table Structures</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Start with core SQL syntax: SELECT, WHERE, ORDER BY, basic aggregates (COUNT, AVG, SUM). Learn how healthcare databases structure patient data across tables like patients, admissions, diagnoses, and medications.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Practice filtering patient records by age, diagnosis, admission date</li>
        <li>Count patients by department, diagnosis, or demographic category</li>
        <li>Sort results by date, cost, or patient count</li>
        <li>Understand primary keys (patient_id, admission_id) and how tables relate</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 3-4: JOINs, GROUP BY, HAVING</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Healthcare data analysis requires combining multiple tables. Learn INNER JOIN, LEFT JOIN, and when to use each. Master GROUP BY for calculating metrics by department, diagnosis, or time period.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Join patients with their diagnoses and medications</li>
        <li>Calculate average length of stay by department or diagnosis</li>
        <li>Use HAVING to filter aggregated results</li>
        <li>Build multi-table queries for comprehensive patient analysis</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weeks 5-6: Window Functions, CTEs, Subqueries</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Advanced techniques unlock professional-level healthcare analytics. Window functions for readmission analysis and trends, CTEs for readable complex queries, subqueries for comparative analysis.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Calculate 30-day readmission rates with LEAD() and LAG()</li>
        <li>Track monthly trends with rolling averages</li>
        <li>Write CTEs for multi-step analysis pipelines</li>
        <li>Use subqueries to find above-average or outlier cases</li>
      </ul>

      {/* SQLNoir CTA - Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Put Your Healthcare SQL Skills to the Test
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          You&apos;ve learned the fundamentals — filtering patient records, aggregating clinical metrics, joining diagnosis and medication tables, tracking readmissions with window functions. Now it&apos;s time to apply them. SQLNoir&apos;s detective cases give you real datasets to query, just like the hospital databases you&apos;ll work with in your healthcare analytics career.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Start Your Investigation →
        </Link>
      </div>

      {/* FAQ */}
      <h2 id="faq" className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Frequently Asked Questions
      </h2>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Is SQL hard to learn for healthcare professionals?</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Not at all. If you can write Excel formulas, you can learn SQL. The syntax is more English-like than most programming languages. Most healthcare professionals pick up basic queries in 2-3 weeks and reach proficiency in 2-3 months with consistent practice.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What SQL dialect is used in healthcare?</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Most healthcare databases use Microsoft SQL Server (T-SQL), PostgreSQL, or Oracle. The good news: core SQL syntax (SELECT, JOIN, WHERE, GROUP BY) is nearly identical across all dialects. Learn standard SQL and you&apos;ll adapt easily to any system.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Do I need SQL certification for healthcare data jobs?</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Not necessarily. Practical skills matter more than certificates. Employers care about whether you can write a 30-day readmission query, not whether you have a piece of paper. That said, certifications like Microsoft&apos;s DP-900 or entry-level data analyst certs can help early in your career.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Can SQL handle clinical trial data?</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Absolutely. Clinical trial databases run on SQL. Adverse event tracking, patient enrollment analysis, and protocol compliance reporting all use SQL queries. The structured nature of trial data makes it particularly well-suited to relational databases.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How long does it take to learn SQL for healthcare?</h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Basic proficiency: 4-6 weeks of consistent practice (1-2 hours daily). Job-ready skills: 2-3 months. Advanced expertise: 6-12 months of real-world application. The learning curve is gentle at first, steeper as you tackle complex analytics, but never insurmountable.
      </p>

      {/* Conclusion */}
      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Start Writing Healthcare SQL Today
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQL for healthcare is the skill that separates basic data work from professional analytics. Whether you&apos;re tracking readmissions, analyzing ER wait times, or measuring patient outcomes, SQL gives you the power to ask questions of millions of records and get answers in seconds.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        The healthcare industry needs more data-literate professionals. Clinicians who understand SQL can bridge the gap between bedside care and population health management. Administrators with SQL skills can make data-driven decisions about resource allocation and quality improvement.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        The data is waiting. Your patients are in there somewhere. Time to find them.
      </p>
    </div>
  );
}
