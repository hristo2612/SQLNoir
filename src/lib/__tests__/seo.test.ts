import { describe, it, expect } from "vitest";
import { localeAlternates, localePrefix } from "../seo";

describe("localePrefix", () => {
  it("returns empty string for the default 'en' locale", () => {
    expect(localePrefix("en")).toBe("");
  });

  it("returns a slash-prefixed locale for non-default locales", () => {
    expect(localePrefix("pt-br")).toBe("/pt-br");
    expect(localePrefix("zh-CN")).toBe("/zh-CN");
  });
});

describe("localeAlternates", () => {
  it("emits en, pt-br, zh-CN and x-default hreflang entries", () => {
    const { languages } = localeAlternates("/cases", "en");
    expect(Object.keys(languages).sort()).toEqual(
      ["en", "pt-br", "x-default", "zh-CN"].sort()
    );
  });

  it("builds correct hreflang paths for a sample path", () => {
    const { languages } = localeAlternates("/cases/001-the-case", "en");
    expect(languages.en).toBe("/cases/001-the-case");
    expect(languages["pt-br"]).toBe("/pt-br/cases/001-the-case");
    expect(languages["zh-CN"]).toBe("/zh-CN/cases/001-the-case");
    expect(languages["x-default"]).toBe("/cases/001-the-case");
  });

  it("hreflang languages map is identical regardless of current locale", () => {
    const en = localeAlternates("/cases", "en");
    const ptbr = localeAlternates("/cases", "pt-br");
    const zh = localeAlternates("/cases", "zh-CN");
    expect(en.languages).toEqual(ptbr.languages);
    expect(en.languages).toEqual(zh.languages);
  });

  it("canonical is locale-aware", () => {
    expect(localeAlternates("/cases", "en").canonical).toBe("/cases");
    expect(localeAlternates("/cases", "pt-br").canonical).toBe("/pt-br/cases");
    expect(localeAlternates("/cases", "zh-CN").canonical).toBe("/zh-CN/cases");
  });
});
