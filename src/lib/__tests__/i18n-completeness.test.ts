import { describe, it, expect } from "vitest";
import enMessages from "../../../messages/en.json";
import ptBrMessages from "../../../messages/pt-br.json";
import zhCnMessages from "../../../messages/zh-CN.json";

function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function valueAt(messages: Record<string, any>, dottedKey: string): unknown {
  return dottedKey.split(".").reduce((obj: any, key) => obj?.[key], messages);
}

const enKeys = flattenKeys(enMessages);

// Every non-English locale is checked against en.json as the source of truth.
// zh-CN must be here: without it, a missing/empty zh key (the paywall.redirecting
// bug class, where the raw key string leaks into the UI) would pass CI unnoticed.
const LOCALES: Array<{ name: string; messages: Record<string, any> }> = [
  { name: "pt-br", messages: ptBrMessages },
  { name: "zh-CN", messages: zhCnMessages },
];

describe("i18n completeness", () => {
  it("en.json has a substantial key set", () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  it("no values in en.json are empty strings", () => {
    const emptyKeys = enKeys.filter((k) => valueAt(enMessages, k) === "");
    expect(emptyKeys).toEqual([]);
  });

  for (const { name, messages } of LOCALES) {
    describe(`${name}.json`, () => {
      const localeKeys = flattenKeys(messages);

      it(`has every key en.json has`, () => {
        const missing = enKeys.filter((k) => !localeKeys.includes(k));
        if (missing.length > 0) console.log(`Missing in ${name}.json:`, missing);
        expect(missing).toEqual([]);
      });

      it(`has no extra keys en.json lacks`, () => {
        const extra = localeKeys.filter((k) => !enKeys.includes(k));
        if (extra.length > 0) console.log(`Extra in ${name}.json:`, extra);
        expect(extra).toEqual([]);
      });

      it(`has no empty-string values`, () => {
        const emptyKeys = localeKeys.filter((k) => valueAt(messages, k) === "");
        if (emptyKeys.length > 0) console.log(`Empty in ${name}.json:`, emptyKeys);
        expect(emptyKeys).toEqual([]);
      });
    });
  }

  it("critical sections exist in every locale", () => {
    const requiredSections = [
      "common", "nav", "home", "cases", "caseSolver", "caseStudy",
      "solution", "auth", "help", "blog", "gameApp", "license", "checkout",
      "paywall", "footer",
    ];
    for (const section of requiredSections) {
      expect(enMessages).toHaveProperty(section);
      for (const { messages } of LOCALES) {
        expect(messages).toHaveProperty(section);
      }
    }
  });

  it("paywall.redirecting exists and is non-empty in every locale", () => {
    // Regression guard for the specific bug where a missing zh-CN paywall key
    // rendered the raw "paywall.redirecting" string in the UI.
    for (const messages of [enMessages, ptBrMessages, zhCnMessages]) {
      const v = valueAt(messages, "paywall.redirecting");
      expect(typeof v).toBe("string");
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
});
