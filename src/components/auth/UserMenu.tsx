import { useState } from "react";
import { User, LogOut, UserX } from "lucide-react"; // Import UserX icon for guest button
import { supabase } from "../../lib/supabase";
import { AuthModal } from "./AuthModal";
import { ProfileMenu } from "./ProfileMenu";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating guest IDs

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
  onSignInGuest: (guestUser: any) => void; // Add prop for guest sign-in callback
  onClearGuest: () => void; // Add prop for clearing guest data callback
}

export function UserMenu({ user, onSignOut, onSignInGuest, onClearGuest }: UserMenuProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      onSignOut();
    }
    setShowProfileMenu(false);
  };

  // Function to handle guest sign-in
  const handlePlayAsGuest = () => {
    let screenName = prompt("Choose your Detective screen name:", "Guest Detective");
    if (screenName) {
      screenName = screenName.trim(); // Trim whitespace
      if (screenName) { // Ensure screen name is not empty after trimming
        const guestUser = {
          id: `guest_${uuidv4()}`, // Generate unique guest ID
          isGuest: true, // Flag to identify guest user
          screenName: screenName, // User-chosen screen name
          xp: 0, // Initial XP
          completed_cases: [], // Initial completed cases
        };
        localStorage.setItem('sqlnoir-guest-user', JSON.stringify(guestUser)); // Save guest data locally
        onSignInGuest(guestUser); // Update app state with guest user
      }
    }
  };

  if (!user) {
    return (
      // Use a div to group buttons for better layout
      <div className="flex gap-2">
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                   text-amber-900 transition-colors duration-200"
          title="Sign In / Sign Up" // Add tooltip
        >
          <span className="hidden sm:inline">Sign In</span> {/* Show text on larger screens */}
          <User className="w-5 h-5" />
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        {/* Add Play as Guest button */}
        <button
          onClick={handlePlayAsGuest}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                   text-amber-900 transition-colors duration-200"
          title="Play as Guest" // Add tooltip
        >
          <span className="hidden sm:inline">Play as Guest</span> {/* Show text on larger screens */}
          <UserX className="w-5 h-5" /> {/* Use guest icon */}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                 text-amber-900 transition-colors duration-200 relative"
      >
        {/* Display guest screen name or 'Profile' */}
        <span className="hidden sm:inline">{user.isGuest ? user.screenName : 'Profile'}</span>
        <div className="relative">
          <User className="w-5 h-5" />
          {/* Only show notification dot for registered users */}
          {!user.isGuest && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-900 rounded-full border-2 border-amber-100" />
          )}
        </div>
      </button>

      <ProfileMenu
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onSignOut={user.isGuest ? onClearGuest : handleSignOut} // Pass appropriate sign-out function
        user={user}
      />
    </div>
  );
}
