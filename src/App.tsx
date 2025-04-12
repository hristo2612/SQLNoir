import { useState, useEffect } from "react";
import { ChevronRight, Github, Coffee, Share2, Loader2 } from "lucide-react"; // Import Loader2
import { BsIncognito } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { Dashboard } from "./components/Dashboard";
import { CaseSolver } from "./components/CaseSolver";
import { UserMenu } from "./components/auth/UserMenu";
import { SharePopup } from "./components/SharePopup";
import { supabase } from "./lib/supabase";

const SQL_TIPS = [
  "Comment your complex SQL queries",
  "Use single quotes for text values: WHERE name = 'John'",
  "End your SQL statements with a semicolon (;)",
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false); // Add state to track if the user is a guest
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.message !== 'JSON object requested, multiple (or no) rows returned') {
        // Ignore 'no rows returned' for potentially new users, handle other errors
        throw error;
      }
      // Merge fetched data with existing guest data if necessary (though unlikely for logged-in users)
      setUserInfo((prev: any) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching user info:", error);
      // If fetching fails for a logged-in user, maybe fall back or show error
    }
  };

  // Function to load guest user data from localStorage
  const loadGuestUser = () => {
    const guestData = localStorage.getItem('sqlnoir-guest-user');
    if (guestData) {
      const parsedGuest = JSON.parse(guestData);
      setUser(parsedGuest);
      setUserInfo(parsedGuest); // Use local data directly for guests
      setIsGuest(true); // Set guest flag
      return true; // Indicate guest was loaded
    }
    return false; // Indicate no guest found
  };

  // Function to save guest user data to localStorage
  const saveGuestUser = (data: any) => {
    localStorage.setItem('sqlnoir-guest-user', JSON.stringify(data));
  };

  useEffect(() => {
    // Get initial session
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      if (currentUser) { // If Supabase user exists
        // Auto-start if user is logged in
        setStarted(true);
        fetchUserInfo(currentUser.id);
      } else if (loadGuestUser()) { // Otherwise, try loading guest user
        // Auto-start if guest user exists
        setStarted(true);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        setIsGuest(false); // No longer a guest if logged in
        // Auto-start if user logs in
        setStarted(true);
        fetchUserInfo(currentUser.id);
      } else {
        // If logged out, check again for guest user (might have been logged in before)
        if (!loadGuestUser()) {
          // If no guest user found after logout, clear user info
          setUserInfo(null);
          setIsGuest(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCaseSolved = async () => {
    if (user) {
      if (isGuest) {
        // Update guest user info in state and localStorage
        setUserInfo((prev: any) => {
          const updatedInfo = {
            ...prev,
            xp: (prev.xp || 0) + (selectedCase?.xp_reward || 100), // Add XP
            completed_cases: [...(prev.completed_cases || []), selectedCase.id], // Add solved case ID
          };
          saveGuestUser(updatedInfo); // Save updated guest data to localStorage
          return updatedInfo;
        });
      } else {
        // For registered users, update via Supabase
        await fetchUserInfo(user.id);
        // The fetchUserInfo call implicitly updates state after Supabase update (assuming trigger works)
        // Or explicitly update state here if needed after Supabase call confirms success
      }
    }
  };

  // Callback for when a guest signs in via UserMenu
  const handleSignInGuest = (guestUser: any) => {
    setUser(guestUser);
    setUserInfo(guestUser);
    setIsGuest(true);
    setStarted(true); // Start the game for the guest
  };

  // Callback for clearing guest data
  const handleClearGuest = () => {
    localStorage.removeItem('sqlnoir-guest-user'); // Remove from localStorage
    setUser(null);
    setUserInfo(null);
    setIsGuest(false);
    // Optionally reset 'started' state or navigate back to landing
    // setStarted(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    const randomTip = SQL_TIPS[Math.floor(Math.random() * SQL_TIPS.length)];

    return (
      <div className="min-h-screen bg-amber-50/50 flex flex-col items-center justify-center space-y-8">
        <h2 className="text-3xl font-detective text-amber-900">Loading...</h2>
        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
        <div className="max-w-md text-center">
          <p className="text-lg font-detective text-amber-800">
            Detective's Tip:
          </p>
          <p className="text-amber-700 italic mt-2">{randomTip}</p>
        </div>
      </div>
    );
  }

  if (selectedCase) {
    return (
      <>
        <SharePopup
          isOpen={isSharePopupOpen}
          onClose={() => setIsSharePopupOpen(false)}
        />
        <CaseSolver
          caseData={selectedCase}
          onBack={() => setSelectedCase(null)}
          onSolve={handleCaseSolved}
        />
      </>
    );
  }

  if (started) {
    return (
      <>
        <SharePopup
          isOpen={isSharePopupOpen}
          onClose={() => setIsSharePopupOpen(false)}
        />
        <Dashboard onCaseSelect={setSelectedCase} userInfo={userInfo} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50 flex flex-col items-center justify-center p-4 md:p-8">
      <SharePopup
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
      />
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {/* Pass user, sign out handlers, and guest handlers to UserMenu */}
        <UserMenu
          user={user}
          onSignOut={() => supabase.auth.signOut()} // Standard sign out for registered users
          onSignInGuest={handleSignInGuest}
          onClearGuest={handleClearGuest}
        />
        <button
          onClick={() => setIsSharePopupOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
          title="Share SQL Noir"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <a
          href="https://github.com/hristo2612/SQLNoir"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
        >
          <Github className="w-5 h-5" />
          <span className="hidden sm:inline">Star on GitHub</span>
        </a>
        <a
          href="https://buymeacoffee.com/hristobogoev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
        >
          <Coffee className="w-5 h-5" />
          <span className="hidden sm:inline">Buy Me a Coffee</span>
        </a>
        <a
          href="https://discord.gg/TuTCZHEs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                   text-amber-900 transition-colors duration-200 backdrop-blur-sm"
        >
          <FaDiscord className="w-5 h-5" />
          <span className="hidden sm:inline">Join Discord</span>
        </a>
      </div>

      <div className="w-full max-w-xl mx-auto text-center space-y-12">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-40 h-40 relative mb-4 flex items-center justify-center">
              <BsIncognito className="w-full h-full text-amber-900 relative" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="font-detective text-5xl md:text-8xl text-amber-900 drop-shadow-lg">
            SQL Noir
          </h1>

          <p className="text-xl md:text-2xl text-amber-800 font-detective">
            Solve mysteries through SQL.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 px-10 py-5 rounded-lg 
                     text-2xl font-detective transition-all duration-300 transform hover:scale-105 
                     flex items-center justify-center mx-auto shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            Start Investigation
            <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
