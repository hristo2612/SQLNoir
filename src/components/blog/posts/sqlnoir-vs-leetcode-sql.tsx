"use client";

import Link from "next/link";
import { ComparisonTable } from "@/components/blog/diagrams";
import { SQLQueryBreakdown, DetectiveTip } from "@/components/blog/content";

export default function SqlnoirVsLeetcodeSqlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        想快速回答：如果你已经有明确的面试或笔试目标、习惯做题清单，LeetCode SQL
        更高效；如果你刚入门、容易半途放弃，SQLNoir 用侦探案件把
        SELECT、JOIN、WHERE 练成习惯，学得更轻松也更有动力。两者并不冲突，理解了
        它们各自擅长什么，你就知道该怎么搭配。
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">🎯 快速导航</h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#what-is-leetcode-sql" className="hover:underline">
              LeetCode SQL 是什么，强在哪、弱在哪
            </a>
          </li>
          <li>
            •{" "}
            <a href="#what-is-sqlnoir" className="hover:underline">
              SQLNoir 是什么，强在哪、弱在哪
            </a>
          </li>
          <li>
            •{" "}
            <a href="#side-by-side" className="hover:underline">
              SQLNoir vs LeetCode SQL 逐项对比
            </a>
          </li>
          <li>
            •{" "}
            <a href="#who-is-it-for" className="hover:underline">
              你该选哪个？按人群划分
            </a>
          </li>
          <li>
            •{" "}
            <a href="#same-skills" className="hover:underline">
              案件式练习如何覆盖笔试和面试考点
            </a>
          </li>
          <li>
            •{" "}
            <a href="#real-example" className="hover:underline">
              一个真实的 SQL 例子
            </a>
          </li>
          <li>
            •{" "}
            <a href="#faq" className="hover:underline">
              常见问题
            </a>
          </li>
        </ul>
      </div>

      {/* ─── Section 1: LeetCode SQL ─── */}
      <h2
        id="what-is-leetcode-sql"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        LeetCode SQL 是什么，强在哪、弱在哪
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        LeetCode 的数据库（Database）题库提供数百道独立的 SQL
        题目，每道题给你一两张表、一段需求描述，你写一条查询通过所有测试用例即可。
        题目按 Easy / Medium / Hard 分级，很多大厂的笔试和面试也确实会出类似风格的题。
        作为「刷题」工具，它的定位非常清晰。
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>它擅长的：</strong>题量大、覆盖面广，从基础的{" "}
        <code>GROUP BY</code> 到窗口函数、自连接、复杂子查询都有；判题严格，能逼你
        把边界情况想清楚；题目风格和很多公司的笔试高度接近，临阵磨枪很对口。
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>它的短板：</strong>题目之间彼此孤立，缺少连贯的情境，刷久了容易枯燥、
        难坚持；每道题的表结构都不一样，你很少有机会在「同一个数据库」里反复探索；
        大量 Hard 题偏向「智力谜题」，和日常工作中写 SQL 的体感有差距；免费账号能做的
        题目有限，完整题库需要会员。对很多人来说，最大的问题不是题不好，而是
        <strong>刷不下去</strong>。
      </p>

      {/* ─── Section 2: SQLNoir ─── */}
      <h2
        id="what-is-sqlnoir"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQLNoir 是什么，强在哪、弱在哪
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        SQLNoir 是一款用 SQL 破案的网页游戏。你扮演侦探，面对一个真实结构的犯罪数据库：
        嫌疑人、证物、证词、现场记录。通过写 SQL 查询逐步排查线索，最终锁定真凶。
        目前共有 6 个侦探案件，前两个免费，其余需一次性「侦探执照」解锁。
        浏览器内置 SQL 编辑器，打开即玩、无需注册。
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>它擅长的：</strong>有剧情、有目标，每写对一条查询都在推进案情，
        正反馈强、容易坚持；难度循序渐进，从简单的 <code>SELECT</code> 起步，逐步
        引入 <code>JOIN</code>、聚合和子查询；数据库结构真实，不是「员工/订单」那种
        玩具表；即时判定对错，不用等人批改；前两个案件免费、无需注册即可上手，其余案件需一次性付费解锁（登录后才会保存 XP 和进度，注册是可选的）。
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>它的短板：</strong>案件数量目前还不及 LeetCode 的题量，没法靠「刷
        几百道」堆肌肉记忆；它不是专门的笔试题库，不会把题目包装成大厂面试题的样子；
        部分进阶内容（比如窗口函数的各种花式用法）覆盖得不如纯题库系统。它更像是
        <strong>把基础打牢、把兴趣点燃</strong>的地方，而不是冲刺 Hard 题的训练场。
      </p>

      {/* ─── Section 3: Side-by-side ─── */}
      <h2
        id="side-by-side"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        SQLNoir vs LeetCode SQL 逐项对比
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        把两者放在一起看，差异就清楚了。它们针对的是学习的不同阶段和不同需求。
      </p>

      <ComparisonTable
        headers={["维度", "SQLNoir", "LeetCode SQL"]}
        rows={[
          ["核心形式", "连贯的侦探案件，破案驱动", "孤立的题目，逐题通过测试"],
          [
            "趣味性",
            "高：有剧情、有代入感",
            "低：偏机械，靠自律支撑",
          ],
          [
            "难度曲线",
            "平滑递进，从 SELECT 到 JOIN、子查询",
            "可自选，但跨度大、容易卡 Hard",
          ],
          [
            "题量 / 内容量",
            "6 个案件，重体验",
            "数百道题，重数量",
          ],
          [
            "数据库真实度",
            "真实结构的犯罪数据库",
            "每题一套表，多为抽象示例",
          ],
          [
            "笔试 / 面试对口度",
            "练的是底层技能，非题海",
            "题型贴近大厂笔试，临阵很对口",
          ],
          [
            "上手成本",
            "前两个案件免费，无需注册；其余需一次性付费",
            "免费题有限，完整题库需会员",
          ],
          [
            "最适合的阶段",
            "入门到中级，打基础、保持动力",
            "已有基础，冲刺面试和笔试",
          ],
        ]}
        caption="两者定位不同：SQLNoir 负责把你带进门并留住你，LeetCode SQL 负责帮你冲刺"
      />

      <DetectiveTip variant="tip" title="不是二选一">
        最务实的路径往往是「先 SQLNoir 后 LeetCode」：用案件把{" "}
        <code>SELECT</code>、<code>JOIN</code>、<code>WHERE</code>、聚合练成本能，
        等基础稳了，再用 LeetCode SQL 做针对性的笔试冲刺。前者解决「学不下去」，
        后者解决「考点没刷够」。
      </DetectiveTip>

      {/* ─── Section 4: Who is it for ─── */}
      <h2
        id="who-is-it-for"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        你该选哪个？按人群划分
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        与其问「哪个更好」，不如问「现在的我更需要哪个」。
      </p>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        SQL 完全新手 / 容易半途放弃
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        从 SQLNoir 开始。直接刷 LeetCode 很容易在前几道 Medium
        就受挫退场。你可以先挑一个{" "}
        <Link
          href="/zh-CN/cases"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          入门侦探案件
        </Link>
        上手，案件的剧情会给你继续下去的理由，而你练的依然是真正的 SQL。
      </p>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        下个月就要笔试 / 面试
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        以 LeetCode SQL 为主，按公司常考题型集中刷。如果你基础还不扎实，可以先用
        SQLNoir 的几个案件快速找回 <code>JOIN</code> 和聚合的手感，再回到题库冲刺。
      </p>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        在校学生 / 自学转行
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        两者结合。用 SQLNoir 维持长期学习的兴趣和节奏，用 LeetCode SQL
        定期检验自己能不能独立、严谨地写出正确查询。
      </p>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">
        已经在用 SQL 工作、想查漏补缺
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        LeetCode SQL 的中高难度题更适合你，能针对性地补窗口函数、自连接这些薄弱点。
        SQLNoir 则可以当作换换脑子的轻松练习。
      </p>

      {/* Tier 1 CTA */}
      <p className="text-gray-700 leading-relaxed mb-6">
        不确定自己属于哪一类？最简单的办法是先免费打一个{" "}
        <Link
          href="/zh-CN/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          SQLNoir 案件
        </Link>
        ，亲手感受一下「用查询破案」是什么体验，再决定下一步。
      </p>

      {/* ─── Section 5: Same skills ─── */}
      <h2
        id="same-skills"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        案件式练习如何覆盖笔试和面试考点
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        有人担心：「玩游戏」是不是不如「刷题」实在？其实笔试和面试反复考的，
        无非是这几样核心能力，而 SQLNoir 的案件几乎每一步都在练它们：
      </p>

      <ul className="text-gray-700 space-y-2 mb-6 list-none pl-0">
        <li>
          🔎 <strong>SELECT 与 WHERE：</strong>从证物表里筛出符合证词描述的记录，
          就是在练条件筛选，也是笔试里最基础、占比最高的部分。
        </li>
        <li>
          🔗 <strong>JOIN：</strong>把嫌疑人、证词、现场三张表关联起来追线索，
          练的正是面试官最爱考的多表连接。
        </li>
        <li>
          📊 <strong>聚合与 GROUP BY：</strong>统计某地区的案发数量、找出出现次数
          最多的车牌，对应的就是 <code>COUNT</code>、<code>GROUP BY</code> 和{" "}
          <code>HAVING</code>。
        </li>
        <li>
          🧩 <strong>子查询与逻辑推理：</strong>「找出有作案时间但没有不在场证明的人」
          这种问题，天然需要嵌套查询和集合思维，和 LeetCode Medium 的内核一致。
        </li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-6">
        换句话说，技能是同一套，区别只在于<strong>包装方式</strong>。LeetCode
        把它包装成判题，SQLNoir 把它包装成案情。当你能在案件里自如地写出一个三表{" "}
        <code>JOIN</code> 加聚合的查询，面对笔试里同样结构的题目，你并不会陌生。
      </p>

      {/* ─── Section 6: Real example ─── */}
      <h2
        id="real-example"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        一个真实的 SQL 例子
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        来看一条在 SQLNoir 案件里很典型的查询：根据目击者描述的特征，找出有嫌疑、
        且没有留下任何笔录的人。它同时用到了 <code>JOIN</code>、<code>WHERE</code>{" "}
        的条件筛选和 <code>NULL</code> 判断，这些都是笔试常客。
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "s.name, s.疤痕类型, x.笔录",
            annotation: "取出嫌疑人姓名、疤痕特征和讯问笔录",
          },
          {
            keyword: "FROM",
            code: "嫌疑人 s",
            annotation: "主表：嫌疑人",
          },
          {
            keyword: "JOIN",
            code: "讯问 x ON s.id = x.嫌疑人id",
            annotation: "关联每个人的讯问记录",
          },
          {
            keyword: "WHERE",
            code: "s.疤痕类型 = '左脸颊'",
            annotation: "按目击者描述的疤痕特征筛选",
          },
          {
            keyword: "AND",
            code: "x.笔录 IS NULL",
            annotation: "只保留没有留下任何笔录的人",
          },
        ]}
        caption="一条查询同时覆盖 JOIN、条件筛选和 NULL 判断，典型的笔试考点组合"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">完整查询：</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT s.name, s.疤痕类型, x.笔录
FROM 嫌疑人 s
JOIN 讯问 x ON s.id = x.嫌疑人id
WHERE s.疤痕类型 = '左脸颊'
  AND x.笔录 IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          在 LeetCode 上，同样的逻辑会被包装成一道「找出符合条件的用户」的题目；
          在 SQLNoir 里，它是你锁定真凶路上的关键一步。代码一模一样，体验完全不同。
        </p>
      </div>

      <DetectiveTip variant="warning" title="别忘了 NULL 的坑">
        无论是刷题还是破案，<code>笔录 = NULL</code> 永远查不出结果。在 SQL
        里任何值都不等于 <code>NULL</code>。要判断空值，必须用{" "}
        <code>IS NULL</code> 或 <code>IS NOT NULL</code>。这是笔试高频失分点。
      </DetectiveTip>

      {/* ─── FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        常见问题
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            只玩 SQLNoir，能应付 SQL 笔试吗？
          </h3>
          <p className="text-gray-700 leading-relaxed">
            能打下扎实的基础。SQLNoir 让你把 SELECT、JOIN、WHERE、聚合和子查询练熟，
            这些正是笔试的主体。但如果目标公司爱出 Hard 难度的题，建议在临考前再用
            LeetCode SQL 针对常见题型集中刷一轮。
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            LeetCode SQL 适合零基础直接上手吗？
          </h3>
          <p className="text-gray-700 leading-relaxed">
            不太建议。零基础直接刷题很容易在前几道就受挫。更顺的路径是先用
            SQLNoir 把基础语法和 JOIN 练顺，再去 LeetCode 做题，体验和留存率都会好很多。
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            SQLNoir 是免费的吗？
          </h3>
          <p className="text-gray-700 leading-relaxed">
            前两个案件免费、无需注册即可游玩；其余 4 个案件需一次性「侦探执照」（终身有效，非订阅）。
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            两个一起用，会不会浪费时间？
          </h3>
          <p className="text-gray-700 leading-relaxed">
            不会，反而互补。SQLNoir 解决「学不下去、坚持不了」的问题，LeetCode SQL
            解决「考点刷得不够多」的问题。先用前者建立兴趣和基础，再用后者做冲刺，
            是很多人验证过的高效组合。
          </p>
        </div>
      </div>

      {/* Tier 3 CTA */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          与其刷题刷到犯困，不如来破一桩案子
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          SQLNoir 把 SQL 练习变成侦探工作。你会对着真实的犯罪数据库写下真实的查询，
          从简单的 SELECT 一路练到多表 JOIN。无需注册，打开就能开始第一案。
        </p>
        <Link
          href="/zh-CN/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          开始你的第一桩调查 →
        </Link>
      </div>
    </div>
  );
}
