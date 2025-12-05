import { CasesExplorer } from "@/components/CasesExplorer";
import { Navbar } from "@/components/Navbar";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userInfo: any = null;
  if (session?.user) {
    const { data } = await supabase
      .from("user_info")
      .select("*")
      .eq("id", session.user.id)
      .single();
    userInfo = data ?? null;
  }

  return (
    <>
      <Navbar
        title="SQLNoir"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Help", href: "/help", activeMatch: "/help" },
        ]}
        showShare
      />
      <CasesExplorer initialSession={session} initialUserInfo={userInfo} />
    </>
  );
}
