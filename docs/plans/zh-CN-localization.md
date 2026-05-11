# zh-CN Localization Implementation Plan

**Status**: Draft, pending CEO sign-off
**Author**: SQLNoir Lead (Jinn)
**Last updated**: 2026-05-11
**Source recon**: see `~/Projects/SQLNoir-zh-CN-fork/` (Lloyd Hasson's donated fork) and `~/.jinn/knowledge/sqlnoir-educator-answer-key-zh-CN.md` (internal-only bilingual answer key, not committed)

---

## 1. Goals

1. Ship Simplified Chinese (`zh-CN`) as the third officially supported locale of SQLNoir.
2. Honor Lloyd Hasson's classroom-tested Chinese adaptation — including his fully translated SQL identifiers, Chinese person names, and culturally relocalized cases (1980s Shanghai etc.) — by treating his fork as a content donation and porting it into our `next-intl` infrastructure.
3. Pay down i18n debt across the 4 components (Footer, CookieConsent, Paywall, PaywallModal) and the HomepageCTA flag-variant strings that currently bypass `useTranslations` — including back-filling pt-br for those keys.
4. Localize the paid Detective License purchase flow for zh-CN: CNY pricing with PPP parity, plus Alipay and WeChat Pay payment methods.
5. Credit Lloyd warmly and visibly on the Chinese version of the site only (footer line + Help page block) and in the global README.

## 2. Non-goals

- Traditional Chinese (`zh-TW`, `zh-HK`) — out of scope for this epic. Plan should make these easier to add later; do not block on them.
- A zh-CN-exclusive case (Lunar New Year edition etc.) — explicitly killed by CEO.
- Onboarding Lloyd to GitHub PR workflow — explicitly out of scope. Communication with Lloyd is via email only and not on the critical path; we ship v1 from his fork as-is.
- Promoting Lloyd's bilingual answer key as a public educator product — kept internal only at `~/.jinn/knowledge/sqlnoir-educator-answer-key-zh-CN.md`.
- Touching pt-br's localization philosophy. The CJK rules (translate-everything) are a zh-CN carve-out in the guide; pt-br stays under the existing English-identifiers rules.
- CNY pricing for non-zh-CN users (en/pt-br users continue to see USD/PPP-USD).
- Migrating en or pt-br's `solution.answer` into per-locale JSON. We extend `getLocalizedCase()` to *optionally* override the answer when a locale JSON provides one; base case stays English.

## 3. High-level architecture decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Translation philosophy for zh-CN | **Option A**: translate everything (table names, column names, person names, locations) | CEO call. "In Chinese things are different. Names are different. Local names are very good for conversions." |
| `solution.answer` override | Per-locale JSON override (`messages/cases/zh-CN/case-NNN.json` adds `solution.answer`); base `.ts` keeps English | Minimum-churn path. Pt-br's `solution.answer` continues to use the base English answer (already works). |
| URL slugs | Stay English across all locales | `getCaseSlug()` in `src/lib/case-utils.ts:22` already pins slugs to the English title via `englishTitleMap`. No change. |
| Case-insensitive answer compare | Keep `.toLowerCase().trim()` | `.toLowerCase()` is a safe no-op on Chinese characters. |
| Lloyd's `translateSqlError.ts` | Port verbatim into `src/lib/translateSqlError.ts`, wire into sql.js error rendering | Eliminates the "SQL errors leak in English" gap and uses Lloyd's own translations. |
| Lloyd attribution | README + footer line on `/zh-CN/*` only + Help page block in Chinese only | CEO call (warm tone, link to GitHub, "co-author/adapter who made zh-CN possible") |
| Stripe for zh-CN | CNY currency, PPP-adjusted price tier, Alipay + WeChat Pay enabled, USD products for everyone else untouched | CEO call |
| Legal pages | Claude-translated for both zh-CN and pt-br as part of this epic; spawn sub-agents to keep parent context clean | CEO call |

---

## 4. Phase-by-phase breakdown

Phase 1 was recon (complete). Phases 2–6 below are sequenced for minimum risk; within each phase, sub-tasks are mostly independent and parallelizable.

---

### Phase 2 — i18n debt cleanup

**Why first**: visible English bleed-through in footer/paywall on `/zh-CN` and `/pt-br` would make the launch feel broken. Smallest phase, prepares clean ground.

**Files to change**:

1. **`src/components/Footer.tsx`** — 4 strings. Add `footer` namespace.
   ```json
   "footer": {
     "copyright": "© 2026 SQLNoir",
     "privacy": "Privacy Policy",
     "terms": "Terms of Service",
     "contact": "Contact"
   }
   ```
2. **`src/components/CookieConsent.tsx`** — 3 strings. Add `cookieConsent` namespace.
   ```json
   "cookieConsent": {
     "message": "We use cookies for analytics. DNT is respected.",
     "privacyLink": "Privacy Policy",
     "accept": "OK"
   }
   ```
3. **`src/components/Paywall.tsx`** — ~10 strings. Add `paywall` namespace.
   - title, subtitle, tier name ("Detective Pro"), perMonth, feature1/2/3, ctaUpgrade ("Upgrade Now"), ctaMaybeLater ("Maybe later").
   - Pricing display itself (`$X.XX`/`¥X`) stays as a runtime value, not a translation key. See Phase 5 for currency formatting logic.
4. **`src/components/PaywallModal.tsx`** — newly identified during recon round 2. Audit and translate during the same pass; ~10 strings expected. Add to `paywall` namespace or a sibling `paywallModal`.
5. **`src/components/HomepageCTA.tsx`** — CTA copy variants (A/B-flag-driven). Add `home.cta.{default,startInvestigating,solveFirstCase,beginMystery}`. The `CTA_COPY_MAP` keeps using flag values as map keys; map values become `t('home.cta.startInvestigating')` etc.
6. **`src/components/CaseStudy.tsx`** — **DELETE** (verified dead code via `Grep CaseStudy` returning only the file itself; live path is `CasePageClient` → `CaseSolver`).
7. **`src/components/Navbar.tsx`** lines 92 & 313 — widen `as "en" | "pt-br"` → `as "en" | "pt-br" | "zh-CN"`. Add dropdown item for zh-CN (lines 217-228 pattern). New key `localeSwitcher.chinese`: `"中文"` in zh-CN.json, `"Chinese"` in en.json, `"Chinês"` in pt-br.json.

**Translations to write in this phase**:
- All new keys above land in `messages/en.json` first (source of truth).
- `messages/pt-br.json` gets the same keys translated (this is debt back-fill).
- `messages/zh-CN.json` doesn't exist yet — created in Phase 4 with these keys plus Lloyd's UI strings.

**Definition of done**:
- `messages/en.json` and `messages/pt-br.json` updated; no hardcoded English strings remain in the 4 listed components.
- `Navbar.tsx` locale-type union widened; zh-CN dropdown item visible when the locale exists.
- Dead `CaseStudy.tsx` removed; build is green; no broken imports.
- `npm run build` succeeds; `npm run test` green.

---

### Phase 3 — Platform changes for locale-aware identifiers

**Why before Phase 4**: porting Lloyd's content depends on the `solution.answer` plumbing existing.

**Files to change**:

1. **`src/i18n/routing.ts`** — add `"zh-CN"` to the locales array.
   ```ts
   export const routing = defineRouting({
     locales: ["en", "pt-br", "zh-CN"],
     defaultLocale: "en",
     localePrefix: "as-needed",
   });
   ```

2. **`src/lib/case-utils.ts`** `getLocalizedCase()` (currently lines 41-58) — extend to merge `solution.answer` when the locale JSON provides one:
   ```ts
   solution: {
     ...caseData.solution,
     answer: t.solution?.answer ?? caseData.solution.answer,
     successMessage: t.solution?.successMessage || caseData.solution.successMessage,
     explanation: t.solution?.explanation || caseData.solution.explanation,
   },
   ```

3. **`src/app/api/check-solution/route.ts`** — accept `locale` in the POST body, fetch the case, then pass through `getLocalizedCase(caseData, locale)` before comparing the answer.
   - Update request shape: `{ caseId, answer, locale }`.
   - On the server, `await getLocalizedCase(caseData, locale)` before line 76's compare.
   - Backwards-compatible: if `locale` is missing, default to `"en"`.

4. **`src/components/case-study/SolutionSubmission.tsx`** — already imports `useTranslations` (line 12). Add `useLocale()` and pass `locale` in the POST body at line 58-64. For the free-case client-side branch (line 75), `caseData` is already locale-resolved by the time it reaches the component (via Server Component data fetch), so no compare-logic change needed there. Verify by tracing the case prop's origin in `CasePageClient.tsx`.

5. **`messages/cases/DATA_LOCALIZATION_GUIDE.md`** — append a new section:

   ```md
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
   ```

6. **`src/lib/translateSqlError.ts`** — new file. Port `~/Projects/SQLNoir-zh-CN-fork/src/utils/translateSqlError.ts` verbatim. Convert to a locale-aware function:
   ```ts
   export function translateSqlError(msg: string, locale: string): string {
     if (locale === "zh-CN") return translateZhCN(msg);
     // Future: pt-br branch
     return msg; // English default — sql.js error as-is
   }
   ```
   Wire into wherever sql.js errors are surfaced in the SQL editor — likely `src/components/case-study/SQLEditor.tsx` or `SQLWorkspace.tsx`. Use `useLocale()` to source the locale.

7. **CJK font loading** — `tailwind.config.js` extends `fontFamily` with a sans fallback chain. Add:
   ```js
   fontFamily: {
     detective: ['Special Elite', 'monospace'],
     sansCJK: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
   }
   ```
   In `src/app/globals.css` or the locale layout, conditionally apply the CJK stack to `<body>` when `locale === "zh-CN"`. Use Next.js `next/font/google` to preload Noto Sans SC for zh-CN routes only — avoid the 200 KB+ download on en/pt-br pages.

8. **`src/services/DatabaseService.ts`** — **no changes needed**. `loadCaseSchema(caseId, locale)` (line 26) already loads `src/cases/schemas/{locale}/{caseId}.ts` if it exists, falling back to English. Confirmed sql.js handles UTF-8 identifiers transparently.

**Definition of done**:
- `routing.ts` declares zh-CN; navigating to `/zh-CN/` returns a 200 (even if the page is mostly English placeholders).
- `getLocalizedCase()` correctly returns Chinese `solution.answer` when zh-CN narrative JSON provides one (unit test).
- `/api/check-solution` accepts `locale` and matches Chinese answers correctly (unit test with a fixture case).
- `translateSqlError.ts` is wired and zh-CN users see Chinese sql.js errors (manual smoke test in /zh-CN).
- Noto Sans SC renders on /zh-CN pages without loading on /en or /pt-br (Network panel verification).
- DATA_LOCALIZATION_GUIDE.md has the CJK carve-out section.

---

### Phase 4 — Port Lloyd's content (the long phase)

**Why now**: platform plumbing exists. This is bulk content work and can be parallelized across 3 sub-agents.

**Strategy**: dispatch 3 parallel sub-agents (one per case pair) for the seed-data port — the heaviest task. Synthesize. Then a single agent for the UI-string harvest.

**Sub-task 4.1 — Case narratives** (`messages/cases/zh-CN/case-NNN.json` × 6)

For each case 001-006, lift these fields from Lloyd's `~/Projects/SQLNoir-zh-CN-fork/src/cases/case-NNN.ts`:
- `title`, `description`, `brief`, `objectives[]`
- `solution.successMessage`, `solution.explanation`
- `solution.answer` (new field per Phase 3 — zh-CN-only override)

Example shape (`messages/cases/zh-CN/case-001.json`):
```json
{
  "id": "case-001",
  "title": "消失的公文包",
  "description": "一个装有机密文件的公文包在\"蓝调笔记酒廊\"不翼而飞。请顺着线索找出窃贼。",
  "brief": "故事发生在阴郁压抑的 1980 年代…",
  "objectives": [
    "查出案发现场记录中的关键线索。",
    "找出与目击者描述相符的嫌疑人。",
    "结合讯问记录确认嫌疑人身份。"
  ],
  "solution": {
    "answer": "赵俊豪",
    "successMessage": "干得漂亮，侦探！你已成功锁定赵俊豪…",
    "explanation": "首先，你从\"犯罪现场\"表中查到了案发细节…"
  }
}
```

Confirmed answer mapping (cross-verified between Lloyd's `case-NNN.ts` and his bilingual answer key):
| Case | EN answer | zh-CN answer |
|---|---|---|
| 001 | Vincent Malone | 赵俊豪 |
| 002 | Rico Delgado | 钱雨婷 |
| 003 | Thomas Brown | 黄语嫣 |
| 004 | Mike Manning | 谭俊豪 |
| 005 | Marco Santos | 桑梓诺 |
| 006 | Hristo Bogoev | 黄浩宇 |

**Sub-task 4.2 — SQL seed data** (`src/cases/schemas/zh-CN/case-NNN.ts` × 6)

For each case, port Lloyd's translated `CREATE TABLE` + `INSERT` statements from `~/Projects/SQLNoir-zh-CN-fork/src/cases/schemas/case-NNN.ts`. Verify:
- Table names match what his narrative references (e.g. `犯罪现场`, `嫌疑人`, `讯问`).
- Column names match what the `solution.explanation` walks the player through.
- Suspect name matches `solution.answer`.
- Cross-table clue references are consistent (description mentions "左脸带疤 + 风衣" → suspect row has those values → interview row matches).

This is mechanical copy-paste plus a careful re-read of each seed file against Lloyd's narrative.

**Sub-task 4.3 — UI chrome strings** (`messages/zh-CN.json` — full new file)

Mirror the structure of `messages/en.json` (already 359 lines, ~12 namespaces). Source content:
1. Lift Chinese strings Lloyd has hardcoded across `~/Projects/SQLNoir-zh-CN-fork/src/components/**/*.tsx`. Estimated 80-120 strings.
2. For strings Lloyd's fork doesn't cover (newer features like Paywall, license flows, blog journal), use Claude to translate idiomatically from `messages/en.json`.

Glossary reference for consistency: `~/Projects/SQLNoir-zh-CN-fork/translations.txt` (also keep at `~/.jinn/knowledge/sqlnoir-zh-CN-translations-glossary.txt`).

**Sub-task 4.4 — Reverse-fill pt-br debt**

For every new namespace/key added in Phase 2 (`footer.*`, `cookieConsent.*`, `paywall.*`, `home.cta.*`, `localeSwitcher.chinese`), add Brazilian Portuguese translations to `messages/pt-br.json`. This pays down the debt for pt-br as well as preparing zh-CN.

**Definition of done**:
- 6 files at `messages/cases/zh-CN/case-NNN.json`, each with all 7 required keys.
- 6 files at `src/cases/schemas/zh-CN/case-NNN.ts`, each producing a runnable sql.js database.
- `messages/zh-CN.json` exists with key-parity to `messages/en.json` (lint check: `jq 'keys'` on each, diff = empty).
- `messages/pt-br.json` updated with Phase 2's debt-fill keys; key-parity restored.
- Manual: navigate `/zh-CN/cases/1-the-vanishing-briefcase`, see Chinese title + brief + tabs.

---

### Phase 5 — Paywall / Stripe / Locale switcher / Lloyd credit

**Sub-task 5.1 — Stripe CNY + Alipay + WeChat Pay**

1. **Create CNY price tier in Stripe Dashboard.** Calculate PPP-adjusted CNY price. Current USD is $14.99 base; China is ~tier 4-5 PPP (recommend confirming via existing `src/lib/ppp-prices.ts` logic on a CN country code). Target ballpark ¥69 / ¥99 / ¥139 (CEO's quoted range). Final pricing: confirm with CEO post-calculation. Add as a new product in Stripe (one CNY price, mirror the USD tier model only if A/B variants are needed).

2. **Extend `src/lib/ppp-prices.ts`** with a CNY branch:
   - Add `getCurrencyForLocale(locale: string)` returning `"cny"` for zh-CN, `"usd"` otherwise.
   - Add `getPriceForLocale(locale, countryCode)` returning the right `priceId` and display string.
   - Display: format `¥XX` for CNY, keep `$X.XX` for USD.

3. **`src/app/api/checkout/route.ts`** line 36 — currently `payment_method_types: ["card" as const]`. For zh-CN sessions, expand to:
   ```ts
   const paymentMethods = locale === "zh-CN"
     ? (["card", "alipay", "wechat_pay"] as const)
     : (["card"] as const);
   ```
   For `wechat_pay`, also include the required `payment_method_options.wechat_pay.client: "web"` in the Checkout Session params. Stripe handles Alipay UI automatically when the method is enabled on the account.

4. **Stripe Dashboard prerequisites** (one-time, manual):
   - Enable Alipay in payment methods (Settings → Payment methods → Alipay → Activate).
   - Enable WeChat Pay (same path; requires business verification with Stripe — flag if not already verified for CNY/CN).
   - Confirm Stripe account is in a region that supports CNY (USA Stripe accounts can accept CNY, but routing/settlement details vary — verify with CEO).

5. **`src/components/Paywall.tsx` / `PaywallModal.tsx`** — render price from `getPriceForLocale()` instead of the hardcoded `PRICING_MAP`. The `pricing-display` PostHog flag continues to control which tier is shown for USD users; for CNY users we ship single-tier first (no A/B until enough Chinese traffic to justify).

6. **`src/app/api/webhooks/stripe/route.ts`** — verify it handles the new payment methods correctly (Alipay/WeChat have async confirmation patterns; the `checkout.session.completed` event still fires the same way). Spot-check the existing webhook handler.

**Sub-task 5.2 — Lloyd attribution**

1. **README.md** — add a section:
   ```md
   ## Localizations
   
   - **English** (default) — by Hristo Bogoev
   - **Português (Brasil)** — community contribution
   - **简体中文 (Simplified Chinese)** — adapted and culturally localized by 
     [Lloyd Hasson](https://github.com/SatyrFrost). Lloyd built a complete 
     Chinese fork of SQLNoir from scratch for his classroom in China, 
     translated every case into immersive Mandarin (including locations, 
     character names, and table/column identifiers), and generously donated 
     his work to the official SQLNoir project. The zh-CN version exists 
     thanks to his pedagogical care and creative adaptation.
   ```

2. **Footer line on `/zh-CN/*` only** — extend `Footer.tsx` with a conditional credit line rendered when `useLocale() === "zh-CN"`:
   ```
   本地化由 Lloyd Hasson 改编与翻译 · GitHub: @SatyrFrost
   ```
   New key `footer.zhCNCredit` in `messages/zh-CN.json` only (don't pollute en/pt-br with a key they don't render).

3. **Help page credit block** — `src/app/[locale]/help/page.tsx` already uses `getTranslations("help")`. Add a new section under the existing FAQ, rendered only when locale is zh-CN (server-side check on `getLocale()`). Draft Chinese copy:
   ```md
   ## 致谢 / Acknowledgements
   
   SQLNoir 的中文版要特别感谢 Lloyd Hasson（GitHub: @SatyrFrost）。
   
   Lloyd 是一位在中国教 SQL 的老师。他不只把游戏翻译成了中文，更把整个
   故事世界搬到了 1980 年代的上海——衡山路的黑胶唱片店、兰亭会所的假面
   舞会、量芯科技的芯片疑云。他还把所有数据库的表名、字段名都译成中文，
   让学生可以用母语思考、用 SQL 破案。
   
   这一切都是他用业余时间为自己的学生做的，然后慷慨地捐给了我们。
   中文版能上线，全靠他。
   
   👉 在 GitHub 上找到他：https://github.com/SatyrFrost
   ```
   Stored under key `help.zhCNCredit.{title,body,githubLink}` in `messages/zh-CN.json`.

**Sub-task 5.3 — Legal pages (privacy / terms / contact) for both zh-CN AND pt-br**

Privacy, terms, contact already use `getTranslations()` for metadata. Need to audit the page bodies (likely hardcoded English in JSX). For each page in each locale:
- Spawn one sub-agent per page-locale pair (so 6 agents: privacy×{zh-CN,pt-br}, terms×{zh-CN,pt-br}, contact×{zh-CN,pt-br}) to translate. Each agent gets a focused prompt: "translate the body content of this page from English to {locale}, return as JSON keys ready to drop into messages/{locale}.json". This isolates parent-context bloat.
- Synthesize each agent's output into `messages/{locale}.json` under namespaces `privacy.body.*`, `terms.body.*`, `contact.body.*`.
- Update the page bodies to use `useTranslations` instead of hardcoded strings.

**Sub-task 5.4 — Final locale switcher polish**

Already added in Phase 2 (type widening + dropdown). At this phase, confirm the zh-CN entry shows in the right typography (CJK font loaded), and the switcher animation/UX feels right for three options instead of two.

**Definition of done**:
- A test purchase in `/zh-CN` shows ¥-denominated price, offers card/Alipay/WeChat as options, and successfully completes via Alipay/WeChat in Stripe test mode.
- A purchase in `/en` and `/pt-br` is unchanged (USD card-only).
- README has the localizations section.
- Footer of `/zh-CN/cases` shows the Lloyd credit line; `/en` and `/pt-br` do not.
- `/zh-CN/help` shows the Chinese acknowledgements block; `/en/help` and `/pt-br/help` do not.
- Privacy/Terms/Contact pages render in Chinese on `/zh-CN/*` and Portuguese on `/pt-br/*`.

---

### Phase 6 — QA / play-test / launch readiness

**Play-test script** (manual, all 6 cases × locale switcher × Stripe flow):

For each of the 6 cases on `/zh-CN`:
1. Open the case from the cases page; confirm Chinese title, brief, objectives.
2. Click into Schema tab; confirm Chinese table names (e.g. `犯罪现场`) and column names render.
3. Write at least one query against the Chinese-named tables (e.g. `SELECT * FROM 嫌疑人 WHERE 服装='风衣'`) — verify sql.js returns rows correctly.
4. Trigger a SQL error (typo a table name); verify Chinese error message displays via `translateSqlError`.
5. Find the correct answer via the puzzle path described in `solution.explanation`; submit the Chinese name from the answer key (e.g. `赵俊豪` for case 001).
6. Confirm the win state shows Chinese `successMessage` and `explanation`.
7. For paid cases (003-006): trigger paywall after solving free cases; confirm CNY pricing.

**Locale switcher round-trip**:
1. Start at `/en/cases/1-the-vanishing-briefcase`. Switch to zh-CN. Confirm URL becomes `/zh-CN/cases/1-the-vanishing-briefcase` and content is Chinese.
2. Switch to pt-br. Confirm `/pt-br/...` and Portuguese content.
3. Switch back to en. Confirm `/cases/...` (no prefix, `localePrefix: "as-needed"`).

**Stripe checkout end-to-end** (test mode):
1. zh-CN user: paywall → Stripe Checkout shows CNY price, card+Alipay+WeChat options. Pay with Stripe's Alipay test method. Webhook fires `checkout.session.completed`. License granted.
2. en user: paywall → USD card-only. Pay with `4242 4242 4242 4242`. License granted.
3. pt-br user: paywall → USD card-only (PPP discount may apply via existing logic). Pay. License granted.

**Build / lint / test**:
- `npm run lint` clean.
- `npm run test` green.
- `npm run build` succeeds; bundle size for `/zh-CN` includes Noto Sans SC but `/en` bundle does not (verify via Next.js build analyzer).

**SEO smoke**:
- `/zh-CN/sitemap.xml` includes all zh-CN routes.
- `<link rel="alternate" hreflang="zh-CN" href="...">` tags appear on en/pt-br pages (via `localeAlternates()` helper already in `src/lib/seo.ts`).
- OG/Twitter cards on `/zh-CN/` use Chinese title and description.

**Definition of done**:
- All 6 cases playable end-to-end in Chinese with correct win-state.
- Locale switcher works in all directions without 404s.
- Stripe CNY+Alipay+WeChat checkout completes successfully in test mode at least once for each payment method.
- No console errors on any zh-CN page during a 5-minute exploratory session.
- CEO signs off after a 10-minute live walkthrough.

---

## 5. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| **sql.js compatibility with CJK identifiers** | Low — Lloyd's classroom-tested fork proves it works | Smoke-test queries against `犯罪现场` etc. in Phase 3 before bulk seed port |
| **Stripe doesn't support WeChat Pay in our region** | Medium — depends on Stripe account country/verification status | Verify in Stripe Dashboard during Phase 5.1 prereq. Fallback: ship with Alipay+card only, defer WeChat |
| **Stripe doesn't support CNY settlement for our account** | Medium | Same verification step. Fallback: keep USD even for zh-CN users; reframe as "USD with prominent fapiao-friendly billing" |
| **Noto Sans SC bundle weight** | Low | Use `next/font/google` with `subsets: ["chinese-simplified"]` and load only on zh-CN routes |
| **Lloyd's content has subtle clue inconsistencies** | Medium — his Chinese narrative re-tells the puzzle path; if a seed row doesn't match, the case is unsolvable | QA pass in Phase 6 plays every case end-to-end |
| **Hardcoded `"en" \| "pt-br"` type unions elsewhere in the codebase** | Low | TypeScript compile will catch them; sweep during Phase 3 |
| **`localePrefix: "as-needed"` interacts oddly with zh-CN as a non-default locale** | Low | Already works for pt-br; same mechanism |
| **Lloyd revises content after we ship** | Low — explicitly accepted | Receive his updates over email, merge as PRs we own |
| **Legal pages translated by Claude have legal-disclaimer risk** | Medium | CEO accepted this. Note in commits that translations are AI-generated; consider human review later |
| **Chinese answer with case-insensitive compare** | None | `.toLowerCase()` is a no-op on Chinese; safe |
| **Slug stays English but URL shows English title for Chinese case** | Low | Acceptable per `getCaseSlug` design (slugs locale-independent); SEO benefits from stable URLs across locales |
| **Currency switching confuses returning users** | Low | Locale-pinned; users see the price for their current locale, with consistent geographic IP detection planned later |
| **Alipay/WeChat async confirmation delays license grant** | Low | Webhook handles `checkout.session.completed` after async confirm; existing flow already async-safe |

---

## 6. Attribution plan (concrete drafts)

### README.md addition (top-of-file Localizations section)

```md
## Localizations

SQLNoir is available in:

- **English** — original
- **Português (Brasil)** — community contribution
- **简体中文 (Simplified Chinese)** — adapted and culturally localized by
  [Lloyd Hasson](https://github.com/SatyrFrost). Lloyd is a teacher in
  China who built a complete Chinese SQLNoir from scratch for his
  classroom — translating every case into immersive Mandarin (with
  localized character names, Shanghai settings, and even Chinese-named
  SQL tables and columns) — then generously donated the work to the
  official project. The zh-CN version exists thanks to his pedagogical
  care and creative adaptation. 谢谢你，Lloyd！
```

### Footer line (zh-CN only, key `footer.zhCNCredit`)

```
本地化由 Lloyd Hasson 改编与翻译 · GitHub: @SatyrFrost
```

### Help page block (zh-CN only, keys `help.zhCNCredit.*`)

```md
## 致谢

SQLNoir 的中文版要特别感谢 Lloyd Hasson（GitHub: @SatyrFrost）。

Lloyd 是一位在中国教 SQL 的老师。他不只把游戏翻译成了中文，更把整个
故事世界搬到了 1980 年代的上海——衡山路的黑胶唱片店、兰亭会所的假面
舞会、量芯科技的芯片疑云。他还把所有数据库的表名、字段名都译成中文，
让学生可以用母语思考、用 SQL 破案。

这一切都是他用业余时间为自己的学生做的，然后慷慨地捐给了我们。
中文版能上线，全靠他。

👉 在 GitHub 上找他：https://github.com/SatyrFrost
```

---

## 7. Open items (not blockers)

1. **Baidu SEO**: Google SEO is set up via `localeAlternates`. For Chinese search, Baidu has different requirements (no JS-rendering, prefers ICP-licensed domains, robots.txt nuances). Out of scope for v1 but worth a follow-up brief. Possible Phase 7.
2. **Mainland China hosting / CDN**: Vercel edge nodes serve from Hong Kong / Singapore, which is fine but not ideal. If conversion data justifies, consider a future CN-mainland CDN (Tencent Cloud, Aliyun). Out of scope.
3. **ICP filing**: Hosting Chinese content from a mainland CN domain requires ICP licensing. We're not on a `.cn` domain so probably not needed, but worth a legal/compliance ping if conversion takes off.
4. **WeChat / Weibo social cards**: OG tags work for global socials; WeChat sharing uses its own meta spec (`<meta name="description">` is fine, but WeChat prefers a specific image format/size). Possible Phase 7.
5. **Stripe Tax for CNY**: Stripe Tax doesn't support CNY-denominated tax calculation in all jurisdictions. Verify whether Chinese VAT applies; might be CEO's tax-domicile question, not engineering.
6. **`zh-Hans-CN` BCP-47 tag**: `zh-CN` is the legacy IETF tag; `zh-Hans-CN` is the modern BCP-47. Next.js + next-intl accept either. We use `zh-CN` for consistency with what Lloyd's filename uses (`sqlnoir-zh-CN`) and what most CDNs/CMS interpret. Note for future zh-TW (or `zh-Hant-TW`).
7. **Lunar New Year promo**: CEO killed the zh-CN-exclusive case, but a 1-week Lunar New Year landing-page hero variant is low-effort and high-impact. Possible Phase 7.
8. **Lloyd's evolving polish**: he may send updates over email after launch. Our merge workflow: paste his diff into a branch, run play-test on the changed case, ship. No PR onboarding for him.
9. **Stripe sandbox vs live for CNY**: tier price IDs in `ppp-prices.ts` are sandbox-only; live IDs need creating after Stripe Dashboard side is done. Confirm before ship.
10. **`translations.txt` glossary handoff**: store at `~/.jinn/knowledge/sqlnoir-zh-CN-translations-glossary.txt` as the source-of-truth dictionary for future zh-CN editors (e.g. when a 7th case launches and needs Chinese terms picked consistently with Lloyd's vocabulary).

---

## 8. Sequencing summary

```
Phase 2: i18n debt cleanup       ← S, prep
Phase 3: platform changes         ← M, plumbing
Phase 4: port Lloyd's content     ← L, bulk
Phase 5: paywall + Stripe + credit ← S–M, integration
Phase 6: QA + play-test            ← M, validation
```

Each phase has a clean handoff to the next. Phase 4's sub-tasks can be parallelized across 3 sub-agents (case pairs) once the platform is ready. Phase 5's legal-pages sub-task uses 6 sub-agents in parallel for translation.

End-to-end estimate (with parallelization): **~5-8 working days** depending on Stripe verification turnaround time for WeChat Pay (the longest unknown).
