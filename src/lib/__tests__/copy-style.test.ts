import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src", "messages"];
const DISALLOWED_DASHES = new RegExp("[\\u2014\\u2013]");

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return listFiles(path);
    return [path];
  });
}

describe("copy style", () => {
  it("does not use em or en dashes in app copy/source", () => {
    const offenders = ROOTS.flatMap(listFiles).filter((file) => {
      const content = readFileSync(file, "utf8");
      return DISALLOWED_DASHES.test(content);
    });

    expect(offenders).toEqual([]);
  });
});
