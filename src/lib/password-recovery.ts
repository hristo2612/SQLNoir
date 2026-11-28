export const MIN_PASSWORD_LENGTH = 6;

export type PasswordValidationError = "weakPassword" | "passwordsDoNotMatch";

export function getAuthRedirectUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://www.sqlnoir.com")
  );
}

export function validateNewPassword(
  password: string,
  confirmPassword: string
): PasswordValidationError | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "weakPassword";
  }
  if (password !== confirmPassword) {
    return "passwordsDoNotMatch";
  }
  return null;
}

let pendingPasswordRecovery = false;

export function markPasswordRecoveryPending(): void {
  pendingPasswordRecovery = true;
}

export function isPasswordRecoveryPending(): boolean {
  return pendingPasswordRecovery;
}

export function clearPasswordRecoveryPending(): void {
  pendingPasswordRecovery = false;
}
