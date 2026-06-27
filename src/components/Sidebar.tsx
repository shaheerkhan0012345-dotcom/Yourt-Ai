import { 
  LayoutDashboard, 
  Lightbulb, 
  Anchor, 
  ScrollText, 
  Heading, 
  Hash, 
  TrendingUp, 
  Calendar, 
  Bookmark, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import YourtLogo from "./YourtLogo";
import { UserProfile } from "../types";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onNewResearch: () => void;
  userProfile: UserProfile;
  credits: number;
}

export default function Sidebar({ currentTab, setTab, isOpen, setOpen, onNewResearch, userProfile, credits }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "idea", label: "Idea Generator", icon: Lightbulb },
    { id: "hook", label: "Hook Generator", icon: Anchor },
    { id: "script", label: "Script Generator", icon: ScrollText },
    { id: "title", label: "Title Generator", icon: Heading },
    { id: "hashtag", label: "Hashtag Generator", icon: Hash },
    { id: "trend", label: "Trend Analyzer", icon: TrendingUp },
    { id: "calendar", label: "Content Calendar", icon: Calendar },
    { id: "saved", label: "Saved Ideas", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#fbf9f9] border-b border-gray-200 z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <YourtLogo size={32} />
          <div>
            <h1 className="font-display font-extrabold text-lg text-[#0d0d0d] leading-none">Yourt AI</h1>
            <p className="text-[10px] text-gray-500 font-medium font-sans">Creator Suite</p>
          </div>
        </div>
        <button 
          onClick={() => setOpen(!isOpen)} 
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Main Sidebar (Floating Panel on Mobile, Persistent Rail on Desktop) */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#fbf9f9] border-r border-gray-200/50 
        flex flex-col h-full py-6 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${isOpen ? "translate-x-0 pt-20 md:pt-6" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Header (Hidden on Mobile view because mobile has its own header) */}
        <div className="hidden md:block px-6 mb-8 select-none">
          <div className="flex items-center gap-2">
            <YourtLogo size={36} />
            <div>
              <h1 className="font-display font-black text-xl text-[#0d0d0d] tracking-tight">Yourt AI</h1>
              <p className="text-xs text-gray-500 font-sans tracking-wide">Creator Suite</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="px-4 mb-6">
          <button 
            onClick={onNewResearch}
            className="w-full bg-[#0D0D0D] hover:bg-[#ff6b00] active:scale-98 text-white font-sans font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            id="btn-new-research"
          >
            <Plus className="w-4 h-4" />
            New Research
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setOpen(false); // Auto close sidebar on mobile tap
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left cursor-pointer
                  ${isSelected 
                    ? "bg-[#ff6b00] text-white shadow-sm font-semibold scale-98" 
                    : "text-gray-600 hover:bg-[#efeded] hover:text-[#0D0D0D] font-medium"
                  }
                `}
                id={`sidebar-tab-${item.id}`}
              >
                <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-105 ${isSelected ? "text-white" : "text-gray-500"}`} />
                <span className="text-sm font-sans">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info & Account */}
        <div className="px-2 mt-auto pt-4 border-t border-gray-200/50 space-y-1">
          {/* Pro profile widget */}
          <div className="px-4 py-3 mb-2 bg-[#e3e2e2]/30 rounded-xl border border-gray-200/20 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20 flex items-center justify-center font-display font-bold text-sm">
                {`${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase() || "ME"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-sm text-[#0D0D0D] truncate">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <span className="inline-block px-1.5 py-0.5 mt-0.5 rounded text-[10px] font-bold tracking-wider bg-[#ff6b00]/10 text-[#ff6b00] uppercase">
                  Pro Plan
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200/40 flex items-center justify-between text-xs font-sans">
              <span className="text-gray-500 font-medium">{credits.toLocaleString()} Credits</span>
              <button 
                onClick={() => { setTab("settings"); setOpen(false); }}
                className="text-[#ff6b00] hover:underline font-bold text-[11px] cursor-pointer"
              >
                Buy Credits →
              </button>
            </div>
          </div>

          <button
            onClick={() => { setTab("help"); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left text-sm cursor-pointer
              ${currentTab === "help"
                ? "bg-[#ff6b00] text-white shadow-sm font-semibold scale-98 font-sans"
                : "text-gray-600 hover:bg-[#efeded] hover:text-[#0D0D0D] font-medium font-sans"
              }`}
            id="sidebar-tab-help"
          >
            <HelpCircle className={`w-4 h-4 transition-transform ${currentTab === "help" ? "text-white rotate-6" : "text-gray-500"}`} />
            Help Center
          </button>
          
          <button
            onClick={() => { setTab("logout"); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-[#efeded] hover:text-red-600 text-left text-sm font-medium transition-colors cursor-pointer ${currentTab === "logout" ? "bg-[#efeded] text-red-600" : ""}`}
            id="sidebar-tab-logout"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Dimmed Overlay click blocker for Mobile */}
      {isOpen && (
        <div 
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          style={{ contentVisibility: 'auto' }}
        />
      )}
    </>
  );
}
