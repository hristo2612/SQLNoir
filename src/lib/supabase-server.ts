import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Next 15 made cookies() async. auth-helpers still reads the store
// synchronously (cookies().get), so hand it the already-awaited store.
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerComponentClient({
    cookies: () => cookieStore as unknown as ReturnType<typeof cookies>,
  });
};
