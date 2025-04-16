import React from "react";
import { LogOut, Award, X, UserX } from "lucide-react"; // Import UserX for guest sign out

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  user: any;
  userInfo: any; // Add userInfo prop to receive data from App.tsx
}

export function ProfileMenu({
  isOpen,
  onClose,
  onSignOut,
  user,
  userInfo, // Receive userInfo from App.tsx
}: ProfileMenuProps) {
  // Determine if data is loading based on whether userInfo is available
  const loading = !userInfo;

  if (!isOpen) return null;
  const isGuest = user?.isGuest; // Check if the user is a guest

  return (
    <>
      {/* Backdrop to handle clicks outside the menu */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Profile Menu */}
      <div className="fixed inset-x-0 mx-4 mt-2 lg:absolute lg:right-0 lg:left-auto lg:mx-0 w-auto lg:w-72 bg-white rounded-lg shadow-lg py-1 border border-amber-200 z-50">
        <div className="p-4 border-b border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-detective text-lg text-amber-900 truncate">
              Detective Profile
            </h3>
            <button
              onClick={onClose}
              className="text-amber-500 hover:text-amber-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm font-medium text-amber-900 truncate">
            {/* Display screenName for guests, email for registered users */}
            {isGuest ? user.screenName : user.email}
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
                {/* Display XP from userInfo prop */}
                {loading ? "..." : userInfo?.xp ?? 0} XP
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-amber-600">
              Cases Solved:{" "} 
              {/* Display solved cases count from userInfo prop */}
              {loading ? "..." : userInfo?.completed_cases?.length || 0}
            </p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full text-left px-4 py-3 text-sm text-amber-900 hover:bg-amber-50 
                   flex items-center gap-2"
        >
          {/* Use different icon and text for guest sign out */}
          {isGuest ? <UserX className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
          {isGuest ? "Clear Guest Data" : "Sign Out"}
        </button>
      </div>
    </>
  );
}
