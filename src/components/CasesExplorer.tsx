"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "@/i18n/navigation";
import type { Session } from "@supabase/supabase-js";
import { Dashboard } from "./Dashboard";
import { PaywallModal } from "./PaywallModal";
import { supabase } from "@/lib/supabase";
import { getCaseSlug } from "@/lib/case-utils";
import {
  getUserHasLicense,
  readLicenseCache,
  writeLicenseCache,
  clearLicenseCache,
} from "@/lib/license";
import { getLocalProgress, clearLocalProgress } from "@/lib/local-progress";
import type { Case } from "@/types";

// useLayoutEffect runs before the browser paints (kills the lock flash on
// client-side nav) but warns when run on the server; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface CasesExplorerProps {
  initialSession?: Session | null;
  initialUserInfo?: any;
  localizedCases?: Record<string, Case[]>;
}

export function CasesExplorer({
  initialSession = null,
  initialUserInfo = null,
  localizedCases,
}: CasesExplorerProps) {
  const [, setUser] = useState<any>(initialSession?.user ?? null);
  const [userInfo, setUserInfo] = useState<any>(initialUserInfo);
  const [paywallCase, setPaywallCase] = useState<Case | null>(null);
  const router = useRouter();

  const hasLicense = getUserHasLicense(userInfo);
  // Guards the migrate-on-signin path against double-firing (initial session +
  // onAuthStateChange can both report the same user).
  const migrationDoneRef = useRef(false);

  // Before paint, optimistically unlock from the client cache so a licensed
  // user never sees paid cases flash as locked on client-side navigation (the
  // server can't see the implicit-OAuth session, so its render is always
  // locked). The async session/fetch below confirms or corrects this.
  useIsomorphicLayoutEffect(() => {
    if (!initialUserInfo && userInfo === null && readLicenseCache()) {
      setUserInfo({ has_license: true });
    }
    // Seed once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      writeLicenseCache(Boolean(data?.has_license));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  // Migrate anonymous local progress onto the account once the user signs in.
  // The server re-verifies and recomputes everything; we only send case ids.
  const migrateLocalProgress = useCallback(
    async (userId: string) => {
      if (!supabase) return;
      if (migrationDoneRef.current) return;
      const { solvedCaseIds } = getLocalProgress();
      if (solvedCaseIds.length === 0) return;
      migrationDoneRef.current = true; // fire at most once per mount
      try {
        const token = (await supabase.auth.getSession()).data.session
          ?.access_token;
        if (!token) {
          migrationDoneRef.current = false; // allow a later retry
          return;
        }
        const res = await fetch("/api/migrate-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ caseIds: solvedCaseIds }),
        });
        if (!res.ok) {
          migrationDoneRef.current = false; // allow a later retry
          return;
        }
        clearLocalProgress();
        await fetchUserInfo(userId);
      } catch (error) {
        console.error("Error migrating local progress:", error);
        migrationDoneRef.current = false; // allow a later retry
      }
    },
    [fetchUserInfo]
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          if (!initialUserInfo) fetchUserInfo(session.user.id);
          migrateLocalProgress(session.user.id);
        } else {
          setUser(null);
          setUserInfo(null);
          clearLicenseCache();
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
        migrateLocalProgress(currentUser.id);
      } else {
        setUserInfo(null);
        clearLicenseCache();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserInfo, migrateLocalProgress, initialUserInfo]);

  const handleCaseSelect = (caseData: Case) => {
    router.push(`/cases/${getCaseSlug(caseData)}`);
  };

  const handleLockedCaseClick = (caseData: Case) => {
    // Checkout supports anonymous purchase; account creation happens after payment
    // on the success page so the license can be bound to the buyer email.
    setPaywallCase(caseData);
  };

  return (
    <>
      <Dashboard
        onCaseSelect={handleCaseSelect}
        onLockedCaseClick={handleLockedCaseClick}
        userInfo={userInfo}
        hasLicense={hasLicense}
        localizedCases={localizedCases}
      />
      <PaywallModal
        isOpen={paywallCase !== null}
        onClose={() => setPaywallCase(null)}
        caseId={paywallCase?.id ?? ""}
        triggerLocation="case_selection"
      />
    </>
  );
}
