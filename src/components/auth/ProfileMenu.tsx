"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LogOut, Award } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useTranslations } from "next-intl";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  user: any;
}

export function ProfileMenu({
  isOpen,
  onClose,
  onSignOut,
  user,
}: ProfileMenuProps) {
  const t = useTranslations();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [badgeLoaded, setBadgeLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Gate on the real purchase flag (not getUserHasLicense, which returns true
  // for everyone when monetization is off) so only actual license holders get
  // the badge.
  const hasLicense = Boolean(userInfo?.has_license);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!user || !supabase) return;

      try {
        const { data, error } = await supabase
          .from("user_info")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchUserInfo();
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-amber-200 z-[2000] overflow-hidden"
    >
      <div className="p-4 border-b border-amber-200">
        <h3 className="font-detective text-lg text-amber-900 mb-1">
          {t('auth.detectiveProfile')}
        </h3>
        <p className="text-sm font-medium text-amber-900 truncate">
          {user.email}
        </p>
      </div>

      {hasLicense && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50">
          <div className="relative h-11 w-11 flex-shrink-0">
            {!badgeLoaded && (
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse rounded-md bg-amber-200/50"
              />
            )}
            <Image
              src="/detective-license-badge.webp"
              alt={t('auth.licensedDetective')}
              width={44}
              height={44}
              // A cached image can finish loading before onLoad is attached;
              // reveal it via .complete on mount so it can't strand at opacity-0.
              ref={(node) => {
                if (node?.complete) setBadgeLoaded(true);
              }}
              onLoad={() => setBadgeLoaded(true)}
              onError={() => setBadgeLoaded(true)}
              className={`rounded-md drop-shadow-sm transition-opacity duration-300 ${
                badgeLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="font-detective text-sm text-amber-900 leading-tight">
              {t('auth.licensedDetective')}
            </p>
            <p className="text-xs text-amber-700 leading-tight">
              {t('auth.licenseActiveSubtitle')}
            </p>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              {t('auth.experiencePoints')}
            </p>
            <p className="text-lg font-detective text-amber-700">
              {loading ? "..." : userInfo?.xp || 0} XP
            </p>
          </div>
        </div>

        <div className="mt-2 text-xs text-amber-700">
          {t('auth.casesSolved', { count: loading ? "..." : userInfo?.completed_cases?.length || 0 })}
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full text-left px-4 py-3 text-sm text-amber-900 hover:bg-amber-50 
                 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        {t('auth.signOut')}
      </button>
    </div>
  );
}
