import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { db } from "../DatabaseService";
import case004 from "@/cases/case-004";
import case005 from "@/cases/case-005";
import { getLocalizedCase } from "@/lib/case-localization";

const ALL_CASE_IDS = [
  "case-001",
  "case-002",
  "case-003",
  "case-004",
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
  const DatabaseServiceCtor = db.constructor as unknown as {
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
  it("keeps case-003 hotel_checkins and surveillance_records relationally consistent across en, pt-br, and zh-CN", async () => {
    const localeSpecs = [
      {
        locale: "en",
        personTable: "person",
        nameCol: "name",
        hcTable: "hotel_checkins",
        srTable: "surveillance_records",
        confTable: "confessions",
        personIdCol: "person_id",
        hcIdCol: "hotel_checkin_id",
        hotelNameCol: "hotel_name",
        dateCol: "check_in_date",
        activityCol: "suspicious_activity",
        confessionCol: "confession",
        sunsetFilter: "%Sunset%",
        expectedSuspects: [
          [6, 16, "James Wilson", "Sunset Inn", "Spotted entering late at night"],
          [7, 22, "Robert Smith", "Sunset Marina Hotel", "Seen arguing with an unknown person"],
          [8, 55, "Thomas Brown", "Sunset Palm Resort", "Left suddenly at 3 AM"],
        ],
        expectedKillerConfessionSubstring: "never left the marina alive",
      },
      {
        locale: "pt-br",
        personTable: "person",
        nameCol: "name",
        hcTable: "hotel_checkins",
        srTable: "surveillance_records",
        confTable: "confessions",
        personIdCol: "person_id",
        hcIdCol: "hotel_checkin_id",
        hotelNameCol: "hotel_name",
        dateCol: "check_in_date",
        activityCol: "suspicious_activity",
        confessionCol: "confession",
        sunsetFilter: "%Sunset%",
        expectedSuspects: [
          [6, 16, "James Wilson", "Sunset Inn", "Visto entrando tarde da noite"],
          [7, 22, "Robert Smith", "Sunset Marina Hotel", "Visto discutindo com uma pessoa desconhecida"],
          [8, 55, "Thomas Brown", "Sunset Palm Resort", "Saiu abruptamente às 3 da manhã"],
        ],
        expectedKillerConfessionSubstring: "nunca saísse vivo da marina",
      },
      {
        locale: "zh-CN",
        personTable: "人员",
        nameCol: "name",
        hcTable: "酒店入住记录",
        srTable: "监控记录",
        confTable: "供词",
        personIdCol: "人员id",
        hcIdCol: "酒店入住记录id",
        hotelNameCol: "酒店名称",
        dateCol: "入住日期",
        activityCol: "可疑行为",
        confessionCol: "供词",
        sunsetFilter: "%日落%",
        expectedSuspects: [
          [6, 16, "赵思远", "日落旅馆", "被发现深夜进入"],
          [7, 22, "刘志强", "日落码头酒店", "被发现与陌生人争吵"],
          [8, 55, "黄语嫣", "日落棕榈度假村", "凌晨3点突然离开"],
        ],
        expectedKillerConfessionSubstring: "永远无法活着离开码头",
      },
    ] as const;

    for (const spec of localeSpecs) {
      const database = await loadAndExecSchema("case-003", spec.locale);
      try {
        expect(database.exec("PRAGMA foreign_key_check")).toHaveLength(0);

        const [hcTotal, hcDistinctPersons] = database.exec(
          `SELECT COUNT(*), COUNT(DISTINCT ${spec.personIdCol}) FROM ${spec.hcTable}`,
        )[0].values[0];
        expect(hcTotal).toBe(200);
        expect(hcDistinctPersons).toBe(200);

        const [srTotal, srDistinctCheckins, srNonNullCheckins] = database.exec(
          `SELECT COUNT(*), COUNT(DISTINCT ${spec.hcIdCol}), COUNT(${spec.hcIdCol}) FROM ${spec.srTable}`,
        )[0].values[0];
        expect(srTotal).toBe(200);
        expect(srDistinctCheckins).toBe(200);
        expect(srNonNullCheckins).toBe(200);

        // Every surveillance_records row must reference a hotel_checkins row for the same person
        const mismatches = database.exec(
          `SELECT sr.id, sr.${spec.personIdCol}, sr.${spec.hcIdCol}, hc.${spec.personIdCol}
           FROM ${spec.srTable} sr
           LEFT JOIN ${spec.hcTable} hc ON hc.id = sr.${spec.hcIdCol}
           WHERE hc.id IS NULL OR sr.${spec.personIdCol} != hc.${spec.personIdCol}`,
        );
        expect(mismatches).toHaveLength(0);

        // Joining on hotel_checkin_id, person_id, or both must yield identical Sunset 19860813 rows
        const joinByCheckinId = database.exec(
          `SELECT hc.id, hc.${spec.personIdCol}, p.${spec.nameCol}, hc.${spec.hotelNameCol}, sr.${spec.activityCol}
           FROM ${spec.hcTable} hc
           JOIN ${spec.personTable} p ON p.id = hc.${spec.personIdCol}
           JOIN ${spec.srTable} sr ON sr.${spec.hcIdCol} = hc.id
           WHERE hc.${spec.hotelNameCol} LIKE '${spec.sunsetFilter}'
             AND hc.${spec.dateCol} = 19860813
           ORDER BY hc.${spec.personIdCol}`,
        )[0].values;

        const joinByPersonId = database.exec(
          `SELECT hc.id, hc.${spec.personIdCol}, p.${spec.nameCol}, hc.${spec.hotelNameCol}, sr.${spec.activityCol}
           FROM ${spec.hcTable} hc
           JOIN ${spec.personTable} p ON p.id = hc.${spec.personIdCol}
           JOIN ${spec.srTable} sr ON sr.${spec.personIdCol} = hc.${spec.personIdCol}
           WHERE hc.${spec.hotelNameCol} LIKE '${spec.sunsetFilter}'
             AND hc.${spec.dateCol} = 19860813
           ORDER BY hc.${spec.personIdCol}`,
        )[0].values;

        const joinByBoth = database.exec(
          `SELECT hc.id, hc.${spec.personIdCol}, p.${spec.nameCol}, hc.${spec.hotelNameCol}, sr.${spec.activityCol}
           FROM ${spec.hcTable} hc
           JOIN ${spec.personTable} p ON p.id = hc.${spec.personIdCol}
           JOIN ${spec.srTable} sr ON sr.${spec.hcIdCol} = hc.id AND sr.${spec.personIdCol} = hc.${spec.personIdCol}
           WHERE hc.${spec.hotelNameCol} LIKE '${spec.sunsetFilter}'
             AND hc.${spec.dateCol} = 19860813
           ORDER BY hc.${spec.personIdCol}`,
        )[0].values;

        expect(joinByCheckinId).toHaveLength(50);
        expect(joinByCheckinId).toEqual(joinByPersonId);
        expect(joinByBoth).toEqual(joinByPersonId);

        // Issue #52 reproducer: LEFT JOIN via hotel_checkin_id returns 1 exact row per key suspect
        const keySuspects = database.exec(
          `SELECT hc.${spec.personIdCol}, hc.id, p.${spec.nameCol}, hc.${spec.hotelNameCol}, sr.${spec.activityCol}
           FROM ${spec.hcTable} hc
           LEFT JOIN ${spec.personTable} p ON hc.${spec.personIdCol} = p.id
           LEFT JOIN ${spec.srTable} sr ON hc.id = sr.${spec.hcIdCol}
           WHERE hc.${spec.hotelNameCol} LIKE '${spec.sunsetFilter}'
             AND hc.${spec.dateCol} = 19860813
             AND hc.${spec.personIdCol} IN (6, 7, 8)
           ORDER BY hc.${spec.personIdCol}`,
        )[0].values;
        expect(keySuspects).toEqual(spec.expectedSuspects);

        const killerConfession = String(
          database.exec(
            `SELECT ${spec.confessionCol} FROM ${spec.confTable} WHERE ${spec.personIdCol} = 8`,
          )[0].values[0][0],
        );
        expect(killerConfession).toContain(spec.expectedKillerConfessionSubstring);
      } finally {
        database.close();
      }
    }
  });

  it("initializes pt-br case-004 in sql.js without syntax errors and preserves final interviews", async () => {
    const ptDb = await loadAndExecSchema("case-004", "pt-br");
    const enDb = await loadAndExecSchema("case-004", "en");

    try {
      const tables = [
        "crime_scene",
        "person",
        "witness_statements",
        "hotel_checkins",
        "surveillance_records",
        "phone_records",
        "final_interviews",
        "vehicle_registry",
        "catering_orders",
      ];

      for (const table of tables) {
        const ptCount = ptDb.exec(`SELECT COUNT(*) FROM ${table}`)[0].values[0][0];
        const enCount = enDb.exec(`SELECT COUNT(*) FROM ${table}`)[0].values[0][0];
        expect(ptCount).toBe(enCount);
      }

      // Verify previously broken curly-quoted rows in final_interviews (lines 1078-1276)
      const interviews = ptDb.exec(
        "SELECT id, person_id, confession FROM final_interviews WHERE id IN (1, 58, 97, 199) ORDER BY id",
      )[0].values;
      expect(interviews).toHaveLength(4);
      expect(interviews[0][2]).toBe(
        "Não matei ninguém, juro. Quem pensaria que eu poderia matar alguém?",
      );
      expect(interviews[1][2]).toBe(
        "Não matei Leo propriamente dito. Fui apenas um intermediário.",
      );
      expect(interviews[2][2]).toBe(
        "Eu mandei fazer o serviço. Fui eu. Vocês me pegaram.",
      );
      expect(interviews[3][2]).toBe(
        "Estava em uma aula de piano naquele dia. Faço música, não o caos.",
      );

      // Verify the investigative join between final_interviews and person resolves key suspects
      const confessed = ptDb.exec(
        `SELECT p.name, f.confession
         FROM final_interviews f
         JOIN person p ON p.id = f.person_id
         WHERE f.person_id IN (58, 97)
         ORDER BY f.person_id`,
      )[0].values;
      expect(confessed).toHaveLength(2);
      expect(confessed[0][0]).toBe("Victor DiMarco");
      expect(confessed[1][0]).toBe("Marco Santos");
    } finally {
      ptDb.close();
      enDb.close();
    }
  });

  it("keeps en and pt-br case-004 solution explanations consistent with schema clues", async () => {
    const enDb = await loadAndExecSchema("case-004", "en");
    const ptDb = await loadAndExecSchema("case-004", "pt-br");

    try {
      // English schema ground truth
      const enSurveillanceNote = String(
        enDb.exec(
          `SELECT sr.note
           FROM hotel_checkins hc
           JOIN surveillance_records sr ON sr.hotel_checkin_id = hc.id
           WHERE hc.hotel_name = 'The Grand Regency'
             AND hc.room_number = '707'
             AND hc.check_in_date = 19871030
             AND sr.note LIKE '%phone%'`,
        )[0].values[0][0],
      );
      expect(enSurveillanceNote).toContain('"Did you kill him?"');

      const enCallsToVictor = enDb
        .exec(
          `SELECT id, note FROM phone_records WHERE recipient_id = 58 ORDER BY id`,
        )[0]
        .values.map((row) => [Number(row[0]), String(row[1])] as const);
      expect(enCallsToVictor).toEqual([
        [
          117,
          "Why did you kill him, bro? You should have left the carpenter do it himself!",
        ],
        [
          163,
          "I will do it. Only if you give me that nice Lambo of yours.",
        ],
      ]);

      const enVictorInterview = String(
        enDb.exec(
          "SELECT confession FROM final_interviews WHERE person_id = 58",
        )[0].values[0][0],
      );
      expect(enVictorInterview.toLowerCase()).toContain("middleman");
      expect(enVictorInterview.toLowerCase()).not.toContain("carpenter");
      expect(enVictorInterview.toLowerCase()).not.toContain("lamborghini");

      const enByMake = enDb.exec(
        `SELECT p.name
         FROM person p
         JOIN vehicle_registry vr ON vr.person_id = p.id
         WHERE p.occupation = 'Carpenter' AND vr.car_make = 'Lamborghini'`,
      )[0].values;
      expect(enByMake).toEqual([["Marco Santos"]]);
      const enByModel = enDb.exec(
        `SELECT p.name
         FROM person p
         JOIN vehicle_registry vr ON vr.person_id = p.id
         WHERE p.occupation = 'Carpenter' AND vr.car_model = 'Lamborghini'`,
      );
      expect(enByModel).toHaveLength(0);

      // Verify English explanation (both server solution and en JSON) matches schema
      const enLocalized = await getLocalizedCase(case004, "en");
      const enJson = JSON.parse(
        fs.readFileSync(
          path.resolve(process.cwd(), "messages/cases/en/case-004.json"),
          "utf8",
        ),
      ) as { solution: { explanation: string } };
      expect(enJson.solution.explanation).toBe(enLocalized.solution.explanation);

      for (const explanation of [
        enLocalized.solution.explanation,
        enJson.solution.explanation,
      ]) {
        expect(explanation).toContain('"Did you kill him?"');
        expect(explanation).not.toContain("I'm gonna kill him!");
        expect(explanation).toContain(enCallsToVictor[0][1]);
        expect(explanation).toContain(enCallsToVictor[1][1]);
        expect(explanation).toContain("middleman");
        expect(explanation).not.toContain(
          "hinted that the true murderer is a carpenter driving a Lamborghini",
        );
        expect(explanation).toContain('car make "Lamborghini"');
        expect(explanation).not.toContain('car model "Lamborghini"');
      }

      // pt-BR schema ground truth
      const ptSurveillanceNote = String(
        ptDb.exec(
          `SELECT sr.note
           FROM hotel_checkins hc
           JOIN surveillance_records sr ON sr.hotel_checkin_id = hc.id
           WHERE hc.hotel_name = 'The Grand Regency'
             AND hc.room_number = '707'
             AND hc.check_in_date = 19871030
             AND sr.note LIKE '%telefone%'`,
        )[0].values[0][0],
      );
      expect(ptSurveillanceNote).toContain('"Você matou ele?"');

      const ptCallsToVictor = ptDb
        .exec(
          `SELECT id, note FROM phone_records WHERE recipient_id = 58 ORDER BY id`,
        )[0]
        .values.map((row) => [Number(row[0]), String(row[1])] as const);
      expect(ptCallsToVictor).toEqual([
        [
          117,
          "Por que você matou ele, cara? Devia ter deixado o carpinteiro fazer o trabalho dele!",
        ],
        [
          163,
          "Eu faço isso. Mas só se você me der aquela Lambo linda que você tem.",
        ],
      ]);

      const ptLocalized = await getLocalizedCase(case004, "pt-br");
      const ptExplanation = ptLocalized.solution.explanation;
      expect(ptExplanation).toContain('"Você matou ele?"');
      expect(ptExplanation).not.toContain("Eu vou matar ele!");
      expect(ptExplanation).toContain(ptCallsToVictor[0][1]);
      expect(ptExplanation).toContain(ptCallsToVictor[1][1]);
      expect(ptExplanation).toContain("intermediário");
      expect(ptExplanation).not.toContain(
        "insinuou que o verdadeiro assassino é um Carpinteiro que dirige uma Lamborghini",
      );
      expect(ptExplanation).toContain('marca de carro "Lamborghini"');
      expect(ptExplanation).not.toContain('modelo de carro "Lamborghini"');
    } finally {
      enDb.close();
      ptDb.close();
    }
  });

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
      expect(facility18Employees).toEqual(["Elizabeth Gordon", "Hristo Bogoev"]);
    } finally {
      ptDb.close();
      enDb.close();
    }
  });

  it("keeps case-005 Facility 18 access logs restricted to the two clue entries across en, pt-br, and zh-CN", async () => {
    const localeSpecs = [
      {
        locale: "en",
        logsTable: "facility_access_logs",
        employeesTable: "employee_records",
        employeeIdCol: "employee_id",
        employeeNameCol: "employee_name",
        facilityNameCol: "facility_name",
        accessDateCol: "access_date",
        accessTimeCol: "access_time",
        facility18: "Facility 18",
        facility20: "Facility 20",
        expectedEntries: [
          [74, 99, "Elizabeth Gordon", 19890421, "08:55"],
          [81, 297, "Hristo Bogoev", 19890421, "09:01"],
        ],
        expectedExplanationSubstring:
          "Only two individuals accessed Facility 18: Elizabeth Gordon and one other shortly afterward - Hristo Bogoev.",
      },
      {
        locale: "pt-br",
        logsTable: "facility_access_logs",
        employeesTable: "employee_records",
        employeeIdCol: "employee_id",
        employeeNameCol: "employee_name",
        facilityNameCol: "facility_name",
        accessDateCol: "access_date",
        accessTimeCol: "access_time",
        facility18: "Facility 18",
        facility20: "Facility 20",
        expectedEntries: [
          [74, 99, "Elizabeth Gordon", 19890421, "08:55"],
          [81, 297, "Hristo Bogoev", 19890421, "09:01"],
        ],
        expectedExplanationSubstring:
          "Apenas dois indivíduos acessaram a Instalação 18: Elizabeth Gordon e outro logo em seguida - Hristo Bogoev.",
      },
      {
        locale: "zh-CN",
        logsTable: "设施访问日志",
        employeesTable: "员工信息",
        employeeIdCol: "员工id",
        employeeNameCol: "员工姓名",
        facilityNameCol: "设施名称",
        accessDateCol: "访问日期",
        accessTimeCol: "访问时间",
        facility18: "18号设施",
        facility20: "20号设施",
        expectedEntries: [
          [74, 99, "刘欣怡", 19890421, "08:55"],
          [81, 297, "黄浩宇", 19890421, "09:01"],
        ],
        expectedExplanationSubstring:
          "结果显示进入 18 号设施的只有两个人：刘欣怡，以及紧随其后进入的黄浩宇。",
      },
    ] as const;

    for (const spec of localeSpecs) {
      const database = await loadAndExecSchema("case-005", spec.locale);
      try {
        const totalRows = Number(
          database.exec(`SELECT COUNT(*) FROM ${spec.logsTable}`)[0].values[0][0],
        );
        expect(totalRows, `${spec.locale} total facility_access_logs rows`).toBe(100);

        const facility18OnDay = database
          .exec(
            `SELECT f.id, f.${spec.employeeIdCol}, e.${spec.employeeNameCol}, f.${spec.accessDateCol}, f.${spec.accessTimeCol}
             FROM ${spec.logsTable} f
             JOIN ${spec.employeesTable} e ON e.id = f.${spec.employeeIdCol}
             WHERE f.${spec.facilityNameCol} = '${spec.facility18}'
               AND f.${spec.accessDateCol} = 19890421
             ORDER BY f.${spec.accessTimeCol}`,
          )[0]
          .values.map((row) => [
            Number(row[0]),
            Number(row[1]),
            String(row[2]),
            Number(row[3]),
            String(row[4]),
          ]);
        expect(facility18OnDay, `${spec.locale} Facility 18 on 19890421`).toEqual(
          spec.expectedEntries,
        );

        const facility18AllDates = database
          .exec(
            `SELECT f.id, f.${spec.employeeIdCol}, e.${spec.employeeNameCol}, f.${spec.accessDateCol}, f.${spec.accessTimeCol}
             FROM ${spec.logsTable} f
             JOIN ${spec.employeesTable} e ON e.id = f.${spec.employeeIdCol}
             WHERE f.${spec.facilityNameCol} = '${spec.facility18}'
             ORDER BY f.${spec.accessTimeCol}`,
          )[0]
          .values.map((row) => [
            Number(row[0]),
            Number(row[1]),
            String(row[2]),
            Number(row[3]),
            String(row[4]),
          ]);
        expect(facility18AllDates, `${spec.locale} Facility 18 across all dates`).toEqual(
          spec.expectedEntries,
        );

        const row59 = database.exec(
          `SELECT id, ${spec.employeeIdCol}, ${spec.facilityNameCol}, ${spec.accessDateCol}, ${spec.accessTimeCol}
           FROM ${spec.logsTable}
           WHERE id = 59`,
        )[0].values[0];
        expect(
          [Number(row59[0]), Number(row59[1]), String(row59[2]), Number(row59[3]), String(row59[4])],
          `${spec.locale} row 59 reassigned away from Facility 18`,
        ).toEqual([59, 290, spec.facility20, 19890421, "12:56"]);

        const localizedCase = await getLocalizedCase(case005, spec.locale);
        expect(localizedCase.solution.explanation, `${spec.locale} solution explanation`).toContain(
          spec.expectedExplanationSubstring,
        );
      } finally {
        database.close();
      }
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
      const DatabaseServiceCtor = db.constructor as unknown as {
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

  for (const caseId of ALL_CASE_IDS) {
    it(`loads and executes pt-br ${caseId} schema cleanly`, async () => {
      const DatabaseServiceCtor = db.constructor as unknown as {
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
