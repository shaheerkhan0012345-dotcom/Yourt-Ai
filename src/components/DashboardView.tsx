import React, { useState } from "react";
import YourtLogo from "./YourtLogo";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Sparkles, 
  Image, 
  Play, 
  Lightbulb, 
  Heading, 
  FileText, 
  ArrowUpRight, 
  Inbox,
  Search,
  Bell,
  Anchor,
  ScrollText,
  Download,
  Edit3,
  Eye,
  MoreHorizontal,
  X,
  CheckCheck,
  Trash2,
  Hash,
  ArrowLeft,
  Wand2
} from "lucide-react";
import { SavedItem } from "../types";

interface DashboardViewProps {
  setTab: (tab: string) => void;
  savedList: SavedItem[];
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  userProfile?: {
    firstName: string;
    lastName?: string;
  };
}

export default function DashboardView({ setTab, savedList, credits, setCredits, userProfile }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGenerators, setShowAllGenerators] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎉 Welcome back! Your 250 launch credits have been fully loaded.", time: "Just now", unread: true },
    { id: 2, text: "🦾 Google Gemini API server connection initialized and optimized.", time: "1 hour ago", unread: true },
    { id: 3, text: "💡 Every AI generation is set to cost 50 credits.", time: "2 hours ago", unread: false },
    { id: 4, text: "🔥 Tip: Save your best hooks and outlines to view them in history.", time: "1 day ago", unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const allGenerators = [
    {
      id: "idea",
      title: "Idea Generator",
      desc: "Brainstorm 10 trending Concepts based on your creator style.",
      cost: "10 credits",
      icon: Lightbulb,
      time: "~3s generation",
      tags: ["Ideation", "Trending"]
    },
    {
      id: "hook",
      title: "Hook Generator",
      desc: "Create scroll-stopping intros for your next video.",
      cost: "10 credits",
      icon: Anchor,
      time: "~2s generation",
      tags: ["Retention", "Curiosity"]
    },
    {
      id: "script",
      title: "Script Generator",
      desc: "Full A-to-Z outlines and dialogue from simple prompts.",
      cost: "50 credits",
      icon: ScrollText,
      time: "~8s generation",
      tags: ["Full Script", "Dialogue"]
    },
    {
      id: "title",
      title: "Title Optimizer",
      desc: "A/B test variations of your title for maximum CTR.",
      cost: "10 credits",
      icon: Heading,
      time: "~3s generation",
      tags: ["SEO", "CTR Boost"]
    },
    {
      id: "hashtag",
      title: "Hashtag Optimizer",
      desc: "Find viral, high-volume hashtags tailored to your topics.",
      cost: "10 credits",
      icon: Hash,
      time: "~2s generation",
      tags: ["Visibility", "Trends"]
    },
    {
      id: "trend",
      title: "Trend Analyzer",
      desc: "Analyze trending YouTube topics and evaluate CTR potentials.",
      cost: "50 credits",
      icon: TrendingUp,
      time: "~5s analysis",
      tags: ["Visuals", "CTR Boost", "Trends"]
    }
  ];

  if (showAllGenerators) {
    return (
      <div className="space-y-8 animate-fade-in" id="all-generators-page">
        {/* Header and Back navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
          <div className="space-y-1.5 text-left">
            <button 
              onClick={() => setShowAllGenerators(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#ff6b00] transition-colors mb-2 cursor-pointer border-0 bg-transparent p-0"
              id="back-to-overview-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
            <h1 className="font-display font-black text-3xl text-[#0d0d0d] tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-[#ff6b00]" /> AI Creators & Generators
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl font-sans leading-relaxed">
              Deploy custom generative pipelines using advanced Google Gemini models to automate your script writing, title optimizations, and visuals.
            </p>
          </div>

          <div className="bg-[#fff7f2] border border-orange-100/50 rounded-2xl p-4 flex items-center gap-3 shrink-0 self-start md:self-center">
            <div className="w-9 h-9 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00]">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-display font-black text-[#0d0d0d]">{credits.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 font-bold">PTS</span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans font-medium">Recharge active</p>
            </div>
          </div>
        </div>

        {/* Six-Grid list of creators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="all-generators-grid">
          {allGenerators.map((gen) => {
            const GenIcon = gen.icon;
            return (
              <div 
                key={gen.id}
                className="bg-white border border-gray-150 hover:border-[#ff6b00]/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                id={`all-gen-card-${gen.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
                      <GenIcon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff6b00] bg-[#ff6b00]/10 px-2.5 py-1 rounded-full font-sans">
                      {gen.cost}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-base text-[#0d0d0d] tracking-tight">
                      {gen.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed min-h-[54px]">
                      {gen.desc}
                    </p>
                  </div>

                  {/* Inline tags block */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gen.tags.map((tg) => (
                      <span key={tg} className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md font-sans">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between font-sans text-[10px]">
                  <span className="font-semibold text-gray-400 font-mono">{gen.time}</span>
                  <button 
                    onClick={() => {
                      setTab(gen.id);
                    }}
                    className="bg-[#0d0d0d] hover:bg-[#ff6b00] text-white font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                  >
                    Open Tool
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview Top bar with Search & Notifications */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display font-medium text-2xl md:text-3xl text-[#0d0d0d] tracking-tight">
            Overview
          </h1>
        </div>
        
        {/* Actions header elements */}
        <div className="flex items-center gap-3 relative">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..." 
              className="bg-[#f5f3f3] hover:bg-white focus:bg-white border-0 border-b border-transparent focus:border-[#ff6b00] rounded-full pl-10 pr-12 py-2 text-xs w-full sm:w-60 focus:outline-none text-gray-700 transition-all font-sans shadow-xs" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-[#ff6b00] font-bold"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  setTimeout(markAllRead, 1500);
                }
              }}
              className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-100 bg-white shadow-sm flex-shrink-0 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200/80 rounded-2xl shadow-xl z-50 overflow-hidden font-sans text-xs animate-fade-in">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-[#0d0d0d] flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#ff6b00]" /> Notifications
                  </span>
                  <div className="flex gap-2">
                    {notifications.length > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-[10px] text-gray-500 hover:text-[#ff6b00] font-semibold flex items-center gap-0.5"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3 h-3" /> Read all
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 bg-white py-12">
                      <Inbox className="w-8 h-8 mx-auto stroke-1 mb-2 text-gray-300" />
                      <p>No new updates</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => toggleRead(n.id)}
                        className={`p-3 text-left transition-colors cursor-pointer flex gap-2 ${n.unread ? "bg-[#fff7f2]/40 hover:bg-[#fff7f2]/70 font-medium" : "bg-white hover:bg-gray-50 text-gray-600"}`}
                      >
                        <div className="flex-1 space-y-1">
                          <p className="leading-relaxed text-[#0d0d0d]">{n.text}</p>
                          <span className="text-[10px] text-gray-400 block">{n.time}</span>
                        </div>
                        {n.unread && (
                          <div className="w-2 h-2 bg-[#ff6b00] rounded-full self-center flex-shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] text-red-500 hover:underline font-bold flex items-center justify-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Updates
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Block: Left Welcome Banner & Right Stacked Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Welcome Banner with Star Accent designs */}
        <div className="lg:col-span-2 relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden min-h-[220px]">
          
          {/* Decorative multi-point stars matching logo style */}
          <div className="absolute right-8 bottom-6 text-[#ff6b00]/15 pointer-events-none select-none">
            <svg className="w-36 h-36" viewBox="0 0 120 120" fill="currentColor">
              {/* Main star */}
              <path d="M60,0 C60,35 85,60 120,60 C85,60 60,85 60,120 C60,85 35,60 0,60 C35,60 60,35 60,0 Z" />
              {/* Off-center secondary star */}
              <path d="M100,75 C100,85 106,90 116,90 C106,90 100,95 100,105 C100,95 94,90 84,90 C94,90 100,85 100,75 Z" opacity="0.6"/>
              {/* Small accent star */}
              <path d="M24,80 C24,85 26.5,87 31.5,87 C26.5,87 24,89 24,94 C24,89 21.5,87 16.5,87 C21.5,87 24,85 24,80 Z" opacity="0.4" />
            </svg>
          </div>

          <div className="space-y-4 max-w-[85%] md:max-w-[75%] relative z-10">
            <div>
              <span className="inline-block bg-[#f5f3f3] text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-gray-150">
                Welcome back, {userProfile?.firstName || "Creator"}
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0d0d0d] tracking-tight leading-tight">
              Ready to create your next viral hit?
            </h2>
            <p className="text-sm text-gray-500 font-sans leading-relaxed">
              Generate highly engaging video scripts, viral hooks, and creative outlines optimized for maximum audience retention.
            </p>
          </div>
        </div>

        {/* Right Metric Stack */}
        <div className="flex flex-col justify-between gap-4">
          
          {/* Active Credits Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-display">CREDITS</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-display font-bold text-[#0d0d0d] tracking-tight">{credits.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">/ 2500</span>
                </div>
              </div>
              
              {/* Target logo indicator overlay */}
              <div 
                className="w-10 h-10 rounded-full border border-orange-100 bg-[#fff7f2] flex items-center justify-center pointer-events-none select-none"
              >
                <div className="w-6 h-6 rounded-full border border-[#ff6b00]/30 flex items-center justify-center relative pointer-events-none">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b00] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* progress status indicator */}
            <div className="mt-5 space-y-1.5">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff6b00] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (credits / 2500) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-semibold font-sans">
                <span className="text-gray-400">
                  Resets in 14 days
                </span>
                <button
                  onClick={() => setTab("settings")}
                  className="text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  Buy Credits →
                </button>
              </div>
            </div>
          </div>

          {/* Saved Creations Statistics Card */}
          <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 border border-gray-800 shadow-sm flex flex-col justify-between flex-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">SAVED CREATIONS</span>
              
              {/* Sparkles icon indicating active creative assets */}
              <div className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center text-[#ff6b00]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-display font-bold text-white tracking-tight">{savedList.length}</p>
              <p className="text-[10px] font-semibold text-gray-400 mt-1 font-sans">
                {savedList.length === 1 ? "1 asset saved in library" : `${savedList.length} assets saved in library`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Generators Section header */}
      <div className="space-y-4 pt-2 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-[#0d0d0d]">
            Quick Generators
          </h3>
          <button 
            onClick={() => setShowAllGenerators(true)} 
            className="text-xs font-bold text-[#ff6b00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all <span className="text-sm font-sans">→</span>
          </button>
        </div>

        {/* Dynamic Quad-Grid Columns corresponding to screenshots links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: "idea",
              title: "Idea Generator",
              desc: "Brainstorm 10 trending concepts based on yo...",
              icon: Lightbulb
            },
            {
              id: "hook",
              title: "Hook Generator",
              desc: "Create scroll-stopping intros for your next...",
              icon: Anchor
            },
            {
              id: "script",
              title: "Script Writer",
              desc: "Full A-to-Z outlines and dialogue for YouTube...",
              icon: ScrollText
            },
            {
              id: "title",
              title: "Title Optimizer",
              desc: "A/B test variations of your title for maximum...",
              icon: Heading
            }
          ].map((item) => {
            const ToolIcon = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white hover:bg-[#fff7f2]/10 rounded-2xl p-5 border border-gray-150 shadow-xs flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="space-y-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                    <ToolIcon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0d0d0d]">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-sans mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setTab(item.id)}
                  className="text-[10px] font-black uppercase text-[#ff6b00] tracking-widest font-sans hover:underline text-left inline-flex items-center gap-1 cursor-pointer"
                >
                  GENERATE
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Recent Activity Log */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-display font-semibold text-base text-[#0d0d0d]">
            Recent Activity
          </h3>
          <button className="p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-black transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Activity feed list */}
        <div className="divide-y divide-gray-100 font-sans">
          {(() => {
            const staticActivities = [
              {
                title: "\"Top 10 AI Tools for 2024\"",
                meta: "Script Generation • 2 hours ago",
                status: "COMPLETED",
                statusClass: "bg-gray-100 text-gray-700 border-gray-200",
                icon: ScrollText,
                btnIcon: Download,
                tab: "script",
                tooltip: "Download Script Draft"
              },
              {
                title: "Productivity Hacks Brainstorm",
                meta: "Idea Generation • Yesterday",
                status: "SAVED",
                statusClass: "bg-[#fff7f2] text-[#ff6b00] border-[#ff6b00]/10",
                icon: Lightbulb,
                btnIcon: Edit3,
                tab: "idea",
                tooltip: "Inspect Saved Idea"
              },
              {
                title: "Vlog Intros A/B Test",
                meta: "Hook Generator • 3 days ago",
                status: "EXPORTED",
                statusClass: "bg-emerald-50 text-emerald-800 border-emerald-100",
                icon: Anchor,
                btnIcon: Eye,
                tab: "hook",
                tooltip: "Review Vlog Hook"
              }
            ];

            const savedActivities = savedList.map(item => ({
              title: item.title,
              meta: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Saved on ${item.savedAt}`,
              status: "SAVED",
              statusClass: "bg-[#fff7f2] text-[#ff6b00] border-[#ff6b00]/10",
              icon: item.type === "idea" ? Lightbulb : item.type === "script" ? ScrollText : item.type === "hook" ? Anchor : item.type === "title" ? Heading : Image,
              btnIcon: Eye,
              tab: item.type === "hashtags" ? "hashtag" : item.type,
              tooltip: "Inquire Asset Details"
            }));

            const combinedList = [...staticActivities, ...savedActivities];
            const filtered = combinedList.filter(item => 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.meta.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filtered.length === 0) {
              return (
                <div className="py-8 text-center text-gray-400">
                  <Inbox className="w-8 h-8 mx-auto stroke-1 mb-2 text-gray-300" />
                  <p className="font-semibold">No matches found</p>
                  <p className="text-[10px] text-gray-400 mt-1">Try another keyword like 'AI' or 'Vlog'</p>
                </div>
              );
            }

            return filtered.map((activity, index) => {
              const LogIcon = activity.icon;
              const ActionIcon = activity.btnIcon;
              return (
                <div key={index} className="py-4 flex items-center justify-between gap-4 first:pt-1 last:pb-1">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                      <LogIcon className="w-4.5 h-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#0d0d0d] truncate">
                        {activity.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 font-sans">
                        {activity.meta}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border ${activity.statusClass} select-none`}>
                      {activity.status}
                    </span>
                    
                    <button 
                      onClick={() => setTab(activity.tab)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#ff6b00] hover:border-[#ff6b00]/30 hover:bg-[#fff7f2]/20 transition-all cursor-pointer"
                      title={activity.tooltip}
                    >
                      <ActionIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* View all historical archives path */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <button 
            onClick={() => setTab("saved")}
            className="text-xs font-semibold text-gray-400 hover:text-[#ff6b00] transition-colors cursor-pointer"
          >
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}

