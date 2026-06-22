-- Revoke-on-refund support: persist the Stripe payment_intent at purchase so a later
-- charge.refunded / charge.dispute.created webhook can map the refund back to the buyer,
-- plus revocation audit columns.

ALTER TABLE user_info ADD COLUMN IF NOT EXISTS payment_intent text;
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS license_revoked_at timestamptz;
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS license_revoked_reason text;

ALTER TABLE pending_licenses ADD COLUMN IF NOT EXISTS payment_intent text;

CREATE INDEX IF NOT EXISTS idx_user_info_payment_intent
  ON user_info(payment_intent) WHERE payment_intent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pending_licenses_payment_intent
  ON pending_licenses(payment_intent) WHERE payment_intent IS NOT NULL;
