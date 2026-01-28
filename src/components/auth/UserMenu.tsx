import { useState } from "react";
import { User } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { AuthModal } from "./AuthModal";
import { ProfileMenu } from "./ProfileMenu";

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (!error) {
      onSignOut();
    }
    setShowProfileMenu(false);
  };

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAuthModal(!showAuthModal)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                   text-amber-900 transition-colors duration-200"
        >
          <User className="w-5 h-5" />
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
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
        <div className="relative">
          <User className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-900 rounded-full border-2 border-amber-100" />
        </div>
      </button>

      <ProfileMenu
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onSignOut={handleSignOut}
        user={user}
      />
    </div>
  );
}
