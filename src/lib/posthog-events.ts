import { capture } from "./analytics";

// ── Case Events ──────────────────────────────────────────────

export function trackCaseStarted(props: {
  case_id: string;
  case_name: string;
  difficulty: string | number;
}) {
  capture("case_started", props);
}

export function trackCaseCompleted(props: {
  case_id: string;
  time_spent_seconds: number;
  query_count: number;
}) {
  capture("case_completed", props);
}

export function trackCaseAbandoned(props: {
  case_id: string;
  progress_percentage: number;
}) {
  capture("case_abandoned", props);
}

// ── SQL Events ───────────────────────────────────────────────

export function trackSqlQuerySubmitted(props: {
  case_id: string;
  is_correct: boolean;
  query_length: number;
}) {
  capture("sql_query_submitted", props);
}

// ── Content Events ───────────────────────────────────────────

export function trackBlogPostViewed(props: {
  post_slug: string;
  referrer: string;
}) {
  capture("blog_post_viewed", props);
}

// ── Engagement Events ────────────────────────────────────────

export function trackCtaClicked(props: {
  cta_name: string;
  location: string;
}) {
  capture("cta_clicked", props);
}

export function trackSignUpCompleted() {
  capture("sign_up_completed", {});
}

export function trackLogin() {
  capture("login", {});
}

export function trackShareClicked(props: { platform: string }) {
  capture("share_clicked", props);
}
