"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Dashboard } from "./Dashboard";
import { supabase } from "@/lib/supabase";
import { getCaseSlug } from "@/lib/case-utils";
import type { Case } from "@/types";

interface CasesExplorerProps {
  initialSession?: Session | null;
  initialUserInfo?: any;
}

export function CasesExplorer({
  initialSession = null,
  initialUserInfo = null,
}: CasesExplorerProps) {
  const [user, setUser] = useState<any>(initialSession?.user ?? null);
  const [userInfo, setUserInfo] = useState<any>(initialUserInfo);
  const router = useRouter();

  const fetchUserInfo = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          if (!initialUserInfo) fetchUserInfo(session.user.id);
        } else {
          setUser(null);
          setUserInfo(null);
        }
      })
      .catch((error) => {
        console.error("Error checking session:", error);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchUserInfo(currentUser.id);
      } else {
        setUserInfo(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserInfo, initialUserInfo]);

  const handleCaseSelect = (caseData: Case) => {
    router.push(`/cases/${getCaseSlug(caseData)}`);
  };

  return (
    <Dashboard
      onCaseSelect={handleCaseSelect}
      userInfo={userInfo}
    />
  );
}
