import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  clearPasswordRecoveryPending,
  markPasswordRecoveryPending,
} from "./password-recovery";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

// Supabase is optional - blog and static content work without it
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Capture PASSWORD_RECOVERY at module init so recovery links processed during
// initial hydration are never missed before PasswordRecoveryModal mounts.
if (supabase && typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      markPasswordRecoveryPending();
    } else if (event === "SIGNED_OUT") {
      clearPasswordRecoveryPending();
    }
  });
}
