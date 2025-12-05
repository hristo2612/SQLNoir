import React, { useState, useEffect, useRef } from "react";
import { LogOut, Award } from "lucide-react";
import { supabase } from "../../lib/supabase";

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
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      if (!user) return;

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
          Detective Profile
        </h3>
        <p className="text-sm font-medium text-amber-900 truncate">
          {user.email}
        </p>
      </div>

      <div className="p-4 border-b border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Experience Points
            </p>
            <p className="text-lg font-detective text-amber-700">
              {loading ? "..." : userInfo?.xp || 0} XP
            </p>
          </div>
        </div>

        <div className="mt-2 text-xs text-amber-700">
          Cases Solved: {loading ? "..." : userInfo?.completed_cases?.length || 0}
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full text-left px-4 py-3 text-sm text-amber-900 hover:bg-amber-50 
                 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
