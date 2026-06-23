// src/lib/translateSqlError.ts
//
// SQL error translator. Ported VERBATIM from Lloyd Hasson's classroom-tested
// zh-CN fork (originally at src/utils/translateSqlError.ts). His Chinese
// strings are deliberately preserved word-for-word - they are classroom-proven
// and must not be rewritten or "cleaned up". New locales can be added as
// additional branches in `translateSqlError` below.

export function translateZhCN(msg: string): string {
  const raw = msg?.trim?.() || "";
  const m = raw.toLowerCase();

  // near "xxx": syntax error
  let match = raw.match(/near\s+"(.+?)"\s*:\s*syntax error/i);
  if (match) {
    return `“${match[1]}” 附近有语法错误，请检查关键字、标点或语句顺序。`;
  }

  // generic syntax error
  if (m.includes("syntax error")) {
    return "SQL 语法有误，请检查关键字、标点或语句结构。";
  }

  // no such table
  match = raw.match(/no such table:\s*([^\s"]+)/i);
  if (match) {
    return `未找到数据表“${match[1]}”，请检查表名是否写对。`;
  }

  // no such column
  match = raw.match(/no such column:\s*([^\s"]+)/i);
  if (match) {
    return `未找到列“${match[1]}”，请检查列名是否正确。`;
  }

  // ambiguous column name
  match = raw.match(/ambiguous column name:\s*([^\s"]+)/i);
  if (match) {
    return `列名“${match[1]}”不明确，请在列名前加上表名或别名。`;
  }

  // datatype mismatch
  if (m.includes("datatype mismatch")) {
    return "数据类型不匹配，请检查比较或连接的两边，数据类型是否一致。";
  }

  // unique constraint
  if (m.includes("unique constraint failed")) {
    return "数据重复，违反了唯一约束。";
  }

  // foreign key constraint
  if (m.includes("foreign key constraint failed")) {
    return "外键约束失败，请确认关联的主表记录是否存在。";
  }

  // not null constraint
  match = raw.match(/not null constraint failed:\s*(.+)/i);
  if (match) {
    return `字段 ${match[1]} 不能为空。`;
  }

  // incomplete input
  if (m.includes("incomplete input")) {
    return "SQL 语句不完整，请检查是否少写了条件、括号或结尾。";
  }

  // too many values
  if (m.includes("too many values")) {
    return "提供的值太多了，请检查插入的列数和值的数量是否一致。";
  }

  // not enough values
  if (m.includes("not enough values")) {
    return "提供的值不够，请检查插入的列数和值的数量是否一致。";
  }

  // misuse of aggregate
  if (m.includes("misuse of aggregate")) {
    return "聚合函数使用不正确，请检查 GROUP BY 或聚合函数的位置。";
  }

  // fallback
  return `执行出错：${raw}`;
}

export function translateSqlError(msg: string, locale: string): string {
  if (locale === "zh-CN") return translateZhCN(msg);
  // Future: pt-br branch can go here
  return msg; // English default - return sql.js error as-is
}
