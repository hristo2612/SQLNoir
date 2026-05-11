# Case Data Localization Guide

This document identifies all text strings within the case SQL databases (schemas) that would need localization. These strings are embedded in SQL INSERT statements that populate the in-browser SQLite databases players query during gameplay.

> **IMPORTANT**: Many of these strings contain CLUES that are critical for solving the case. Translating them incorrectly could break the game logic. Each string is flagged with its clue sensitivity level.

## General Notes

- Database column names (e.g., `description`, `transcript`) should NOT be translated — they are part of the SQL schema players query
- Table names should NOT be translated — players reference them in SQL queries
- Column names should NOT be translated — players reference them in WHERE clauses, JOINs, etc.
- Person names should generally NOT be translated — they are used as answers to cases
- Location names MAY be translated but must remain consistent across all tables within a case
- The `answer` field in each case definition (e.g., "Vincent Malone") must NEVER change — it's the solution check

---

## Case 001: The Vanishing Briefcase

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `crime_scene` | `type` | Crime type labels | 🟡 Medium | Values: "theft", "murder", "bribery" — used in WHERE filters |
| `crime_scene` | `location` | Place names | 🔴 CRITICAL | "Blue Note Lounge" is a key clue players must find |
| `crime_scene` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains witness descriptions that lead to the suspect (e.g., "man in a trench coat with a scar on his left cheek") |
| `suspects` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Vincent Malone" is the case answer |
| `suspects` | `attire` | Clothing descriptions | 🔴 CRITICAL | "trench coat" must match the crime scene clue |
| `suspects` | `scar` | Body feature descriptions | 🔴 CRITICAL | "left cheek" must match the crime scene clue |
| `interviews` | `transcript` | Dialog/testimony text | 🔴 CRITICAL | Contains confessions — "I wasn't going to steal it, but I did." |

### Cross-reference constraints
- Crime scene description mentions "trench coat" + "scar on left cheek" → must match suspects table
- Interview transcript for the culprit must clearly indicate guilt

---

## Case 002: The Stolen Sound

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `crime_scene` | `type` | Crime type labels | 🟡 Medium | Same as case-001 |
| `crime_scene` | `location` | Place names | 🔴 CRITICAL | "West Hollywood Records" is referenced in the case brief |
| `crime_scene` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains physical clues about the theft |
| `witnesses` | `clue` | Witness testimony | 🔴 CRITICAL | Contains physical descriptions: "red bandana", "gold watch" |
| `suspects` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Rico Delgado" is the case answer |
| `suspects` | `accessory` | Item descriptions | 🔴 CRITICAL | Must match witness clues |
| `suspects` | `attire` | Clothing descriptions | 🔴 CRITICAL | Must match witness clues |
| `interviews` | `transcript` | Dialog/testimony text | 🔴 CRITICAL | Contains confession text |

---

## Case 003: The Miami Marina Murder

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `crime_scene` | `location` | Place names | 🔴 CRITICAL | Key locations like "Coral Bay Marina" |
| `crime_scene` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains initial suspect descriptions |
| `person` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Thomas Brown" is the case answer |
| `person` | `address` | Address text | 🔴 CRITICAL | "Ocean Drive" is a clue filter |
| `person` | `occupation` | Job titles | 🟡 Medium | Used for filtering |
| `interviews` | `transcript` | Dialog/testimony text | 🔴 CRITICAL | Contains clues and confessions |
| `hotel_checkins` | `hotel_name` | Hotel names | 🟡 Medium | Used in queries |
| `hotel_checkins` | `guest_name` | Person names | ⚫ DO NOT TRANSLATE | |
| `surveillance_records` | `description` | Activity descriptions | 🔴 CRITICAL | Contains behavioral clues |
| `confessions` | `transcript` | Confession text | 🔴 CRITICAL | Final confirmation of guilt |

---

## Case 004: The Midnight Masquerade Murder

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `crime_scene` | `location` | Place names | 🟡 Medium | Various Miami locations |
| `crime_scene` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains initial clues |
| `person` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Marco Santos" is the case answer |
| `person` | `occupation` | Job titles | 🔴 CRITICAL | "Carpenter" is a key clue |
| `witness_statements` | `statement` | Testimony text | 🔴 CRITICAL | Contains clues about hotel, phone calls |
| `hotel_checkins` | `hotel_name` | Hotel names | 🔴 CRITICAL | "The Grand Regency" + room 707 is a clue |
| `surveillance_records` | `description` | Activity descriptions | 🔴 CRITICAL | "I'm gonna kill him!" is a key clue |
| `phone_records` | `transcript` | Call transcripts | 🔴 CRITICAL | Contains the carpenter clue: "let the carpenter do his job" |
| `final_interviews` | `transcript` | Interview text | 🔴 CRITICAL | Contains confessions |
| `vehicle_registry` | `car_model` | Vehicle names | 🔴 CRITICAL | "Lamborghini" is a filtering clue |
| `catering_orders` | Various | Order descriptions | 🟢 Low | Background data, not critical for solving |

---

## Case 005: The Silicon Sabotage

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `incident_reports` | `location` | Place names | 🟡 Medium | Various locations |
| `incident_reports` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains initial investigation details |
| `witness_statements` | `statement` | Testimony text | 🔴 CRITICAL | Contains keycard pattern clue ("QX-" + odd number) and Helsinki server clue |
| `keycard_access_logs` | `keycard_id` | ID strings | ⚫ DO NOT TRANSLATE | Technical identifiers used in queries |
| `keycard_access_logs` | `location` | Place names | 🟡 Medium | Facility names |
| `computer_access_logs` | `server_location` | City names | 🔴 CRITICAL | "Helsinki" is a key filter |
| `computer_access_logs` | `activity` | Activity descriptions | 🟡 Medium | |
| `email_logs` | `subject` | Email subjects | 🔴 CRITICAL | Contains coded instructions |
| `email_logs` | `body` | Email body text | 🔴 CRITICAL | "move L into place", "finish things", "unlock Facility 18" are critical clues |
| `facility_access_logs` | `facility_name` | Facility names | 🔴 CRITICAL | "Facility 18" is a key filter |
| `employee_records` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Hristo Bogoev" is the case answer |
| `employee_records` | `role` | Job titles | 🟡 Medium | |
| `employee_records` | `department` | Department names | 🟡 Medium | |

---

## Case 006: The Vanishing Diamond

### Tables

| Table | Column | Type of Text | Clue Level | Notes |
|-------|--------|-------------|------------|-------|
| `crime_scene` | `location` | Place names | 🟡 Medium | Various Miami locations |
| `crime_scene` | `description` | Narrative descriptions | 🔴 CRITICAL | Contains initial clues |
| `guest` | `name` | Person names | ⚫ DO NOT TRANSLATE | "Mike Manning" is the case answer |
| `guest` | `invitation_type` | Invitation labels | 🔴 CRITICAL | "VIP-R" prefix is a filtering clue |
| `witness_statements` | `statement` | Testimony text | 🔴 CRITICAL | Contains clues about dock rental, invitation, navy suit |
| `attire_registry` | `attire_description` | Clothing descriptions | 🔴 CRITICAL | "navy suit" is a key filter |
| `marina_rentals` | `dock_name` | Dock names | 🔴 CRITICAL | Used in filtering |
| `marina_rentals` | `renter_name` | Person names | ⚫ DO NOT TRANSLATE | |
| `final_interviews` | `transcript` | Interview text | 🔴 CRITICAL | Contains confession |

---

## Translation Strategy Recommendations

### Phase 1: Safe translations (can be done without breaking gameplay)
- Case narratives (brief, objectives, success messages, explanations) — in `/messages/cases/`
- UI strings — in `/messages/en.json`

### Phase 2: Careful translations (requires cross-referencing)
- Crime scene descriptions, witness statements, interview transcripts
- Must maintain exact cross-references between tables
- Each translated clue word must appear consistently across all tables

### Phase 3: Do NOT translate
- Person names (used as case answers)
- Table and column names (used in SQL queries)
- Technical identifiers (keycard IDs, dates as integers)
- SQL keywords in example queries

### Quality Assurance
For each translated case, the entire case must be play-tested to verify:
1. All clue cross-references still work
2. The correct answer can still be found through logical deduction
3. SQL queries using translated values return expected results
4. No clue text is ambiguous in the target language

---

## CJK Locales (zh-CN, future zh-TW, zh-HK)

For East-Asian locales, the rules above are inverted:
- Table names ARE translated (e.g. `crime_scene` → `犯罪现场`).
- Column names ARE translated (e.g. `description` → `描述`).
- Person names ARE translated (e.g. `Vincent Malone` → `赵俊豪`).
- `solution.answer` is overridden per-locale in `messages/cases/{locale}/case-NNN.json`.

Rationale: CEO decision (2026-05-11). Native names and full immersion drive
conversion in CJK markets. The trade-off — that students write SQL with
non-ASCII identifiers — is deliberate and pedagogically supported in Lloyd
Hasson's classroom-tested original.

pt-br and other Romance/Germanic locales continue to follow the original
"keep identifiers English, translate values" rule.
