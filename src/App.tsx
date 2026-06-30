import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import IdeaGeneratorView from "./components/IdeaGeneratorView";
import HookGeneratorView from "./components/HookGeneratorView";
import ScriptGeneratorView from "./components/ScriptGeneratorView";
import TitleGeneratorView from "./components/TitleGeneratorView";
import HashtagGeneratorView from "./components/HashtagGeneratorView";
import TrendAnalyzerView from "./components/TrendAnalyzerView";
import CalendarView from "./components/CalendarView";
import SavedIdeasView from "./components/SavedIdeasView";
import SettingsView from "./components/SettingsView";
import HelpCenterView from "./components/HelpCenterView";
import ChatWidget from "./components/ChatWidget";
import AuthScreen from "./components/AuthScreen";
import LandingPageView from "./components/LandingPageView";
import CustomCursor from "./components/CustomCursor";
import YourtLogo from "./components/YourtLogo";
import { useAuth } from "./context/AuthContext";
import { SavedItem, CalendarEvent, UserProfile } from "./types";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export default function App() {
  const { 
    user, 
    profile, 
    loading: authLoading, 
    signOut: handleFirebaseSignOut,
    updateUserProfile,
    syncCredits,
    syncSavedList,
    syncCalendarEvents
  } = useAuth();

  const [authFormMode, setAuthFormMode] = useState<"signin" | "signup" | null>(null);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // Alert states
  const [sessionAlert, setSessionAlert] = useState<string | null>(null);

  // User profile state initialization
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const raw = localStorage.getItem("yourt_user_profile");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
    return {
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex.rivera@studio.com",
      productUpdates: true,
      securityAlerts: true,
      marketEmails: false,
      aiModel: "Gemini 2.5 Flash (Recommended)"
    };
  });

  // User credits defaults to full (250)
  const [credits, setCredits] = useState<number>(() => {
    const raw = localStorage.getItem("yourt_credits");
    return raw ? parseInt(raw, 10) : 250;
  });

  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [loadedUid, setLoadedUid] = useState<string | null>(null);

  // Sync to local storage for guests - load defaults first if not in localStorage
  useEffect(() => {
    if (!user || user.uid === "public-creator-user-id") {
      setUserDataLoaded(false);
      setLoadedUid(null);

      const rawProfile = localStorage.getItem("yourt_user_profile");
      if (rawProfile) {
        try {
          setUserProfile(JSON.parse(rawProfile));
        } catch (e) {}
      } else {
        setUserProfile({
          firstName: "Public",
          lastName: "Creator",
          email: "public@yourt.ai",
          productUpdates: false,
          securityAlerts: false,
          marketEmails: false,
          aiModel: "Gemini 2.5 Flash (Recommended)"
        });
      }

      const rawCredits = localStorage.getItem("yourt_credits");
      setCredits(rawCredits ? parseInt(rawCredits, 10) : 250);

      const rawSavedList = localStorage.getItem("yourt_saved_assets");
      if (rawSavedList) {
        try {
          setSavedList(JSON.parse(rawSavedList));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Initial deep seed data matching premium screenshots and topics
        setSavedList([
          {
            id: "seed-th-1",
            savedAt: "2026-06-22 09:20",
            type: "thumbnail",
            title: "Concept B: Curiosity (THE SECRET METHOD)",
            data: {
              conceptId: "B",
              conceptTitle: "Concept B: Curiosity",
              subtitle: "Editorial workspace with tilted neon tags evoking high-grade technological intrigue.",
              textOverlay: "THE SECRET METHOD",
              ctrPotential: 9.2,
              layoutStyle: {
                bgTheme: "impact-orange",
                textColor: "text-white",
                accentColor: "text-white",
                isRotated: true
              }
            }
          },
          {
            id: "seed-idea-1",
            savedAt: "2026-06-22 09:15",
            type: "idea",
            title: "I Spent 30 Days coding entirely with AI (Honest Review)",
            data: {
              title: "I Spent 30 Days coding entirely with AI (Honest Review)",
              conceptDescription: "Compelling timeline testing multiple top-tier AI LLMs on full-fidelity projects, documenting true efficiency gains & blocks.",
              whyItWillWork: "Vivid curiosity loop questioning hype with objective developer proof.",
              thumbnailSuggestion: "Before vs After split timeline layout with code structures",
              potentialMetric: "Viral Concept"
            }
          },
          {
            id: "seed-hook-1",
            savedAt: "2026-06-22 09:12",
            type: "hook",
            title: "[Hook] Curiosity Gap: \"This single line of CSS destroyed...\"",
            data: {
              style: "Curiosity Gap",
              script: "This single line of CSS destroyed a $100 Million startup overnight... and you are probably writing it right now.",
              rationale: "Creates imminent professional threat and instant curiosity loop.",
              retentionPotential: "S-Tier 98%"
            }
          }
        ]);
      }

      const rawCalendar = localStorage.getItem("yourt_calendar_events");
      if (rawCalendar) {
        try {
          setCalendarEvents(JSON.parse(rawCalendar));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCalendarEvents([
          { id: "cal-1", date: "2026-06-23", title: "Brainstorm AI review angles", type: "idea", description: "Seed idea generation" },
          { id: "cal-2", date: "2026-06-25", title: "Record CSS Trap video", type: "script", description: "Script finalized" },
          { id: "cal-3", date: "2026-06-28", title: "Deploy final secret method cover", type: "thumbnail" }
        ]);
      }
      setUserDataLoaded(true);
      setLoadedUid("guest");
    }
  }, [user]);

  // Load from Firestore on real user sign-in
  useEffect(() => {
    if (user) {
      if (user.uid === "public-creator-user-id") {
        return;
      }
      setUserDataLoaded(false);
      setLoadedUid(null);
      // Immediately reset state values to prevent stale or guest data from displaying/bleeding
      setUserProfile({
        firstName: user.displayName?.split(" ")[0] || "Creative",
        lastName: user.displayName?.split(" ")[1] || "Member",
        email: user.email || "",
        productUpdates: true,
        securityAlerts: true,
        marketEmails: false,
        aiModel: "Gemini 2.5 Flash (Recommended)"
      });
      setCredits(250);
      setSavedList([]);
      setCalendarEvents([]);

       const fetchUserData = async () => {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { db } = await import("./lib/firebase");
          const userDocRef = doc(db, "yourt_users", user.uid);
          
          const getDocPromise = getDoc(userDocRef);
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Firestore fetch timed out")), 15000)
          );
          const snap = await Promise.race([getDocPromise, timeoutPromise]);
          if (snap.exists()) {
            const data = snap.data();
            if (data.profile) setUserProfile(data.profile);
            if (typeof data.credits === "number") setCredits(data.credits);
            if (Array.isArray(data.savedList)) setSavedList(data.savedList);
            if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
          } else {
            // New user defaults - prevents guest data leak
            setUserProfile({
              firstName: user.displayName?.split(" ")[0] || "Creative",
              lastName: user.displayName?.split(" ")[1] || "Member",
              email: user.email || "",
              productUpdates: true,
              securityAlerts: true,
              marketEmails: false,
              aiModel: "Gemini 2.5 Flash (Recommended)"
            });
            setCredits(250);
            setSavedList([]);
            setCalendarEvents([]);
          }
          setUserDataLoaded(true);
          setLoadedUid(user.uid);
        } catch (e: any) {
          const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
          if (isOffline) {
            console.warn("Offline status detected: Loaded cached and default settings for workspace.");
          } else {
            console.error("Failed to load user doc from Firestore:", e);
          }
          setUserDataLoaded(true);
          setLoadedUid(user.uid);
        }
      };
      fetchUserData();
    }
  }, [user]);

  // Automatically enter workspace when a user actively finishes signing in / registering
  useEffect(() => {
    if (user) {
      if (authFormMode !== null) {
        setShowLanding(false);
        setAuthFormMode(null);
      }
    } else {
      setShowLanding(true);
    }
  }, [user]);

  // Sync to localstorage or cloud on changes
  useEffect(() => {
    if (user) {
      if (loadedUid === user.uid && userDataLoaded) syncCredits(credits);
    } else {
      if (loadedUid === "guest" && userDataLoaded) {
        localStorage.setItem("yourt_credits", credits.toString());
      }
    }
  }, [credits, user, userDataLoaded, loadedUid]);

  useEffect(() => {
    if (user) {
      if (loadedUid === user.uid && userDataLoaded) syncSavedList(savedList);
    } else {
      if (loadedUid === "guest" && userDataLoaded) {
        localStorage.setItem("yourt_saved_assets", JSON.stringify(savedList));
      }
    }
  }, [savedList, user, userDataLoaded, loadedUid]);

  useEffect(() => {
    if (user) {
      if (loadedUid === user.uid && userDataLoaded) syncCalendarEvents(calendarEvents);
    } else {
      if (loadedUid === "guest" && userDataLoaded) {
        localStorage.setItem("yourt_calendar_events", JSON.stringify(calendarEvents));
      }
    }
  }, [calendarEvents, user, userDataLoaded, loadedUid]);

  // Synchronize local userProfile when firebase auth profile loads/updates
  useEffect(() => {
    if (user && profile) {
      setUserProfile(profile);
    }
  }, [user, profile]);

  // For guests, persist local edits to localStorage
  useEffect(() => {
    if (!user || user.uid === "public-creator-user-id") {
      if (loadedUid === "guest") {
        localStorage.setItem("yourt_user_profile", JSON.stringify(userProfile));
      }
    }
  }, [userProfile, user, loadedUid]);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (user) {
      updateUserProfile(newProfile);
    }
  };

  const deductCredits = (amount = 50) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  const handleAddCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const [scriptPreseedTitle, setScriptPreseedTitle] = useState<string>("");

  // Asset preservation handlers
  const handleSaveAsset = (item: Omit<SavedItem, "id" | "savedAt">) => {
    const newItem: SavedItem = {
      ...item,
      id: `asset-${Date.now()}`,
      savedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setSavedList((prev) => [newItem, ...prev]);
    
    // Trigger visual notification
    setSessionAlert(`Successfully saved asset: ${item.title.substring(0, 30)}...`);
    setTimeout(() => setSessionAlert(null), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm("Are you sure you want to completely clear your saved assets archive?")) {
      setSavedList([]);
    }
  };

  // Calendar pipeline handlers
  const handleAddCalendarEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-evt-${Date.now()}`
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Reset custom triggers (New Research button)
  const handleNewResearch = () => {
    setCurrentTab("trend");
    setSessionAlert(`New Research session initialized. Let's design viral assets!`);
    setTimeout(() => setSessionAlert(null), 4000);
  };

  // Render correct tab view dynamically
  const renderContentView = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardView setTab={setCurrentTab} savedList={savedList} credits={credits} setCredits={setCredits} userProfile={userProfile} />;
      case "idea":
        return (
          <IdeaGeneratorView 
            onSave={handleSaveAsset} 
            savedList={savedList} 
            credits={credits} 
            deductCredits={deductCredits}
            onDraftScript={(title: string) => {
              setScriptPreseedTitle(title);
              setCurrentTab("script");
            }}
          />
        );
      case "hook":
        return <HookGeneratorView onSave={handleSaveAsset} savedList={savedList} credits={credits} deductCredits={deductCredits} />;
      case "script":
        return (
          <ScriptGeneratorView 
            onSave={handleSaveAsset} 
            savedList={savedList} 
            credits={credits} 
            deductCredits={deductCredits}
            preseedTitle={scriptPreseedTitle}
            clearPreseed={() => setScriptPreseedTitle("")}
          />
        );
      case "title":
        return <TitleGeneratorView onSave={handleSaveAsset} savedList={savedList} credits={credits} deductCredits={deductCredits} />;
      case "hashtag":
        return <HashtagGeneratorView onSave={handleSaveAsset} savedList={savedList} credits={credits} deductCredits={deductCredits} />;
      case "trend":
        return <TrendAnalyzerView onSave={handleSaveAsset} savedList={savedList} credits={credits} deductCredits={deductCredits} />;
      case "calendar":
        return (
          <CalendarView 
            events={calendarEvents} 
            onAddEvent={handleAddCalendarEvent} 
            onDeleteEvent={handleDeleteCalendarEvent} 
          />
        );
      case "saved":
        return (
          <SavedIdeasView 
            savedList={savedList} 
            onDelete={handleDeleteSaved} 
            onClearAll={handleClearAllSaved} 
          />
        );
      case "settings":
        return (
          <SettingsView 
            userProfile={userProfile} 
            onUpdateProfile={handleUpdateProfile} 
            credits={credits} 
            onAddCredits={handleAddCredits} 
          />
        );
      case "help":
        return <HelpCenterView />;
      case "logout":
        return (
          <div className="bg-white rounded-3xl p-8 border border-gray-150 max-w-sm mx-auto text-center space-y-5 py-12 animate-fade-in shadow-xs flex flex-col items-center justify-center">
            <div className="flex justify-center h-16 w-16 mx-auto animate-bounce duration-1000">
              <YourtLogo size={64} />
            </div>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden relative">
              <div className="h-full bg-[#FF6B00] rounded-full absolute left-0 top-0 w-1/2 animate-loading-bar" />
            </div>
          </div>
        );
      default:
        return <TrendAnalyzerView onSave={handleSaveAsset} savedList={savedList} credits={credits} deductCredits={deductCredits} />;
    }
  };

  // Redirect and sign out handler when Logout menu option is activated
  useEffect(() => {
    if (currentTab === "logout") {
      const performSignOut = async () => {
        try {
          await handleFirebaseSignOut();
        } catch (e) {
          console.error("Signout error:", e);
        }
        setAuthFormMode(null);
        setCurrentTab("dashboard");
      };
      // Short delay for high fidelity transition
      const timer = setTimeout(performSignOut, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTab]);

  if (authLoading || (user && !userDataLoaded)) {
    return (
      <div className="min-h-screen bg-[#FAF9F9] flex flex-col items-center justify-center font-sans">
        <div className="text-center select-none animate-fade-in max-w-sm space-y-5">
          <div className="flex justify-center h-16 w-16 mx-auto animate-bounce duration-1000">
            <YourtLogo size={64} />
          </div>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden relative font-sans text-xs text-gray-400">
            <div className="h-full bg-[#FF6B00] rounded-full absolute left-0 top-0 w-1/2 animate-loading-bar" />
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  let content;
  if (!user) {
    if (authFormMode !== null) {
      content = (
        <AuthScreen 
          onBack={() => setAuthFormMode(null)}
          initialMode={authFormMode}
        />
      );
    } else {
      content = (
        <LandingPageView 
          onGetStarted={(mode) => {
            setAuthFormMode(mode);
          }}
        />
      );
    }
  } else {
    content = (
      <div className="bg-[#fbf9f9] text-[#1b1c1c] antialiased min-h-screen flex font-sans font-normal selection:bg-[#ff6b00]/15 selection:text-[#ff6b00]">
        {/* Side Navigation panel */}
        <Sidebar 
          currentTab={currentTab} 
          setTab={setCurrentTab} 
          isOpen={sidebarOpen} 
          setOpen={setSidebarOpen}
          onNewResearch={handleNewResearch}
          userProfile={userProfile}
          credits={credits}
        />

        {/* Main Container */}
        <main className="flex-1 md:ml-64 p-4 md:p-12 max-w-[1280px] mx-auto w-full pt-16 md:pt-12 min-h-screen flex flex-col justify-between">
          
          {/* Dynamic warning / feedback ticker */}
          {sessionAlert && (
            <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-3 rounded-xl border border-white/10 shadow-xl flex items-center gap-2 max-w-sm animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs font-semibold leading-relaxed font-sans">{sessionAlert}</p>
            </div>
          )}

          <div className="flex-1 pb-12">
            {renderContentView()}
          </div>

          {/* Footer legal credits */}
          <footer className="border-t border-gray-200/50 pt-4 text-center">
            <p className="text-[10px] text-gray-400 font-sans tracking-wide">
              Powered by Google GenAI SDK. Designed with Corporate Modernism guidelines. © 2026 Yourt AI Creator Suite. All rights reserved.
            </p>
          </footer>
        </main>

        {/* Floating AI support assistant */}
        <ChatWidget />
      </div>
    );
  }

  return (
    <>
      {content}
      <CustomCursor />
    </>
  );
}
