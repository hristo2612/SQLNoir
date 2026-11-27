import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { db } from "../DatabaseService";

const ALL_CASE_IDS = [
  "case-001",
  "case-002",
  "case-003",
  "case-004",
  "case-005",
  "case-006",
] as const;

// pt-br/case-004 has a separate curly-quote syntax error tracked in GitHub issue #69.
const PT_BR_CASE_IDS = [
  "case-001",
  "case-002",
  "case-003",
  "case-005",
  "case-006",
] as const;

let SQL: SqlJsStatic;

beforeAll(async () => {
  SQL = await initSqlJs({
    locateFile: (file) => path.resolve(process.cwd(), "public", file),
  });
});

async function loadAndExecSchema(caseId: string, locale: string) {
  const DatabaseServiceCtor = db.constructor as {
    loadCaseSchema: (id: string, loc?: string) => Promise<string[]>;
  };
  const statements = await DatabaseServiceCtor.loadCaseSchema(caseId, locale);
  expect(Array.isArray(statements)).toBe(true);
  expect(statements.length).toBeGreaterThan(0);

  const database = new SQL.Database();
  for (const statement of statements) {
    database.run(statement);
  }
  return database;
}

describe("Case SQL schemas", () => {
  it("initializes pt-br case-005 in sql.js without syntax errors and preserves clues", async () => {
    const ptDb = await loadAndExecSchema("case-005", "pt-br");
    const enDb = await loadAndExecSchema("case-005", "en");

    try {
      const tables = [
        "incident_reports",
        "witness_statements",
        "keycard_access_logs",
        "computer_access_logs",
        "email_logs",
        "facility_access_logs",
        "employee_records",
      ];

      for (const table of tables) {
        const ptCount = ptDb.exec(`SELECT COUNT(*) FROM ${table}`)[0].values[0][0];
        const enCount = enDb.exec(`SELECT COUNT(*) FROM ${table}`)[0].values[0][0];
        expect(ptCount).toBe(enCount);
      }

      // Verify previously broken curly-quoted rows in witness_statements and email_logs
      const firstWitness = ptDb.exec(
        "SELECT statement FROM witness_statements WHERE id = 1",
      )[0].values[0][0];
      expect(firstWitness).toContain("Eu estava passeando com meu cachorro");

      const clueWitnesses = ptDb.exec(
        "SELECT id, statement FROM witness_statements WHERE incident_id = 74 ORDER BY id",
      )[0].values;
      expect(clueWitnesses).toHaveLength(2);
      expect(clueWitnesses[0][1]).toContain("Helsinki");
      expect(clueWitnesses[1][1]).toContain("QX-");

      const laterEmails = ptDb.exec(
        "SELECT id, email_subject, email_content FROM email_logs WHERE id IN (127, 138, 140, 200) ORDER BY id",
      )[0].values;
      expect(laterEmails).toHaveLength(4);
      expect(laterEmails[1][1]).toBe("Realinhar Trajetória do Ativo");
      expect(laterEmails[2][1]).toBe("Executar Janela de Fase");

      // Verify the investigative path resolves the saboteur
      const facility18Employees = ptDb.exec(
        `SELECT DISTINCT e.employee_name
         FROM facility_access_logs f
         JOIN employee_records e ON e.id = f.employee_id
         WHERE f.facility_name = 'Facility 18' AND f.access_date = 19890421
         ORDER BY f.access_time`,
      )[0].values.map((row) => row[0]);
      expect(facility18Employees).toContain("Elizabeth Gordon");
      expect(facility18Employees).toContain("Hristo Bogoev");
    } finally {
      ptDb.close();
      enDb.close();
    }
  });

  for (const caseId of ALL_CASE_IDS) {
    it(`loads and executes en ${caseId} schema cleanly`, async () => {
      const database = await loadAndExecSchema(caseId, "en");
      try {
        const tables = database.exec(
          "SELECT name FROM sqlite_master WHERE type = 'table'",
        );
        expect(tables[0]?.values.length ?? 0).toBeGreaterThan(0);
      } finally {
        database.close();
      }
    });

    it(`loads and executes zh-CN ${caseId} schema cleanly`, async () => {
      const DatabaseServiceCtor = db.constructor as {
        loadCaseSchema: (id: string, loc?: string) => Promise<string[]>;
      };
      const [enStatements, zhStatements] = await Promise.all([
        DatabaseServiceCtor.loadCaseSchema(caseId, "en"),
        DatabaseServiceCtor.loadCaseSchema(caseId, "zh-CN"),
      ]);
      expect(zhStatements).not.toEqual(enStatements);

      const database = await loadAndExecSchema(caseId, "zh-CN");
      try {
        const tables = database.exec(
          "SELECT name FROM sqlite_master WHERE type = 'table'",
        );
        expect(tables[0]?.values.length ?? 0).toBeGreaterThan(0);
      } finally {
        database.close();
      }
    });
  }

  for (const caseId of PT_BR_CASE_IDS) {
    it(`loads and executes pt-br ${caseId} schema cleanly`, async () => {
      const DatabaseServiceCtor = db.constructor as {
        loadCaseSchema: (id: string, loc?: string) => Promise<string[]>;
      };
      const [enStatements, ptStatements] = await Promise.all([
        DatabaseServiceCtor.loadCaseSchema(caseId, "en"),
        DatabaseServiceCtor.loadCaseSchema(caseId, "pt-br"),
      ]);
      expect(ptStatements).not.toEqual(enStatements);

      const database = await loadAndExecSchema(caseId, "pt-br");
      try {
        const tables = database.exec(
          "SELECT name FROM sqlite_master WHERE type = 'table'",
        );
        expect(tables[0]?.values.length ?? 0).toBeGreaterThan(0);
      } finally {
        database.close();
      }
    });
  }
});
