import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: JSX.Element;
  date: string;
  readTime: string;
  author: string;
  slug: string;
  heroImage: string;
}

interface BlogPostProps {
  slug: string;
}

const BLOG_POSTS: Record<string, BlogPostData> = {
  "games-to-learn-sql": {
    id: "1",
    title: "5 SQL Games to Master Database Skills in 2025",
    excerpt:
      "Skip the boring textbooks. These 5 SQL games teach database queries through detective stories, island survival, and murder mysteries.",
    date: "2025-05-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    slug: "games-to-learn-sql",
    heroImage: "/blog/games-to-learn-sql-hero.jpeg",
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
              • <strong>You know right away if you're wrong:</strong> No waiting
              for a teacher to grade your work
            </li>
            <li>
              • <strong>It's free:</strong> No paywall, no "premium features"
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
          ORDER BY. It's cheesy but it works, especially if you're just starting
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
          this and it's just one case - solve a murder in SQL City. Simple
          concept, but it's really well done and teaches you JOINs better than
          any tutorial I've seen. P.S. SQL Noir was inspired by this game.
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
              🎯 What You'll Learn:
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
          more mobile leaning, but it's still a great way to learn SQL. You
          don't have a traditional SQL editor but rather a set of buttons that
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
          Here's the thing - all of these SQL games work, but they work for
          different people. If you like stories and don't mind a challenge,
          start with{" "}
          <a
            href="https://www.sqlnoir.com"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            SQL Noir
          </a>
          . If you're completely new to SQL,{" "}
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
            <li>3. If you get stuck, that's normal - keep going</li>
            <li>4. Try a different game if the first one doesn't click</li>
            <li>
              5. Once you finish one, try another with a different approach
            </li>
          </ol>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Don't overthink this. The best SQL game is the one you'll actually
          play. Pick one, start today, and see how much more fun learning
          database queries can be.
        </p>
      </div>
    ),
  },
};

export function BlogPost({ slug }: BlogPostProps) {
  const post = BLOG_POSTS[slug];

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
