import { describe, it, expect } from "vitest";
import { translateSqlError } from "../translateSqlError";

describe("translateSqlError", () => {
  it("returns the raw sql.js error unchanged for English locale", () => {
    const raw = "no such table: suspects";
    expect(translateSqlError(raw, "en")).toBe(raw);
  });

  it("returns the raw sql.js error unchanged for unknown locales", () => {
    const raw = "syntax error near 'SELEKT'";
    expect(translateSqlError(raw, "pt-br")).toBe(raw);
  });

  it("translates 'no such table' to Lloyd's verbatim zh-CN message", () => {
    expect(translateSqlError("no such table: 嫌疑人", "zh-CN")).toBe(
      "未找到数据表“嫌疑人”，请检查表名是否写对。"
    );
  });

  it("translates 'no such column' to Lloyd's verbatim zh-CN message", () => {
    expect(translateSqlError("no such column: age", "zh-CN")).toBe(
      "未找到列“age”，请检查列名是否正确。"
    );
  });

  it("falls back to '执行出错' wrapper for unknown errors in zh-CN", () => {
    expect(translateSqlError("some random sqlite weirdness", "zh-CN")).toBe(
      "执行出错：some random sqlite weirdness"
    );
  });
});
