import React, { useState } from "react";
import { 
  Bookmark, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Clock, 
  TrendingUp, 
  Eye, 
  FileText,
  Sliders,
  Grid,
  List
} from "lucide-react";
import { SavedItem } from "../types";

interface SavedIdeasViewProps {
  savedList: SavedItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedIdeasView({ savedList, onDelete, onClearAll }: SavedIdeasViewProps) {
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"all" | "hooks" | "titles" | "scripts" | "thumbnails">("all");
  const [visibleCount, setVisibleCount] = useState(6);

  // High fidelity default seed elements representing the exact screenshot designs
  const defaultLibraryItems = [
    {
      id: "lib-fit-warmup",
      savedAt: "Added 2 hours ago",
      type: "hook",
      title: "Stop doing your warmups like this if you want to actual...",
      description: "Controversial statement opening designed for fitness niches. High engagement probability.",
      tags: ["Fitness"],
      data: {
        style: "Fitness Hook",
        script: "Stop doing your warmups like this if you want to actually build muscle. Most people are completely killing their gains before their actual work sets even start...",
        rationale: "Attacks popular gym routines directly, triggering high retention scores."
      }
    },
    {
      id: "lib-ai-cost",
      savedAt: "Added Yesterday",
      type: "script",
      title: "The Hidden Cost of 'Free' AI Tools",
      description: "[Visual: Quick zoom into camera, holding a smartphone showing a generic AI app logo] \"You think you're getting a sweet deal using free AI tools for your business? Think again.\" [B-Roll: Scrolling...",
      tags: ["Tech", "Educational"],
      wordsCount: "182 Words",
      estDuration: "⏱️ 60s Est.",
      data: {
        hook: "You think you're getting a sweet deal using free AI tools for your business? Think again.",
        intro: "Visual: Quick zoom into camera, holding a smartphone showing a generic AI app logo. Sound effect: cyber static.",
        bodyBeats: [
          { subtitle: "The Secret Data Harvest", talkingPoints: "Explain how 'free' tiers use your unique intellectual properties to train massive proprietary corporate structures." },
          { subtitle: "Latency & Throttle Traps", talkingPoints: "Detail how free queries get queued and throttled during critical customer hours." }
        ]
      }
    },
    {
      id: "lib-5am-rot",
      savedAt: "Added Yesterday",
      type: "title",
      title: "I Tried the 5AM Routine for 30 Days (It Ruined My Life)",
      score: "📈 92/100 Score",
      description: "Contrarian vlog lifestyle report. Extremely clicky dynamic curiosity gap.",
      tags: ["Vlog"],
      data: {
        styleLabel: "Curiosity Loop",
        ctrLevel: "92/100"
      }
    },
    {
      id: "lib-next-web",
      savedAt: "Added 2 days ago",
      type: "title",
      title: "Why Your Next App Shouldn't Be a Web App",
      score: "📈 78/100 Score",
      description: "Insightful developer strategy title targeting native mobile vs web comparisons.",
      tags: ["Dev"],
      data: {
        styleLabel: "Negative Bracket",
        ctrLevel: "78/100"
      }
    },
    {
      id: "lib-fb-ads",
      savedAt: "Added 1 week ago",
      type: "hook",
      title: "I spent $10,000 on Facebook ads so you don't have to...",
      description: "Value-driven hook promising inside knowledge and saving the viewer money/mistakes.",
      tags: ["Marketing"],
      data: {
        style: "Immediate Reward",
        script: "I spent $10,000 on Facebook ads so you don't have to make these three silent mistakes that pour capital down the drain..."
      }
    }
  ];

  // Combine user-saved assets with our default beautiful mockup feed
  const combinedItems: any[] = [
    ...savedList.map(item => {
      // Map user types to standard representation
      let score: string | undefined;
      let estDuration: string | undefined;
      let wordsCount: string | undefined;
      let tags: string[] = [];
      let description = "AI synthesized metadata asset draft.";

      if (item.type === "title") {
        score = `📈 85/100 Score`;
        tags = ["Dev"];
        description = "Optimized clicky layout alternative.";
      } else if (item.type === "hook") {
        description = item.data.script || "Verbal hook opener.";
        tags = ["Vlog"];
      } else if (item.type === "script") {
        description = item.data.hook || "Screenplay script draft.";
        estDuration = "⏱️ 90s Est.";
        wordsCount = "240 Words";
        tags = ["Tech"];
      } else if (item.type === "thumbnail") {
        description = `CTR Potential: ${item.data.ctrPotential || "8.5"}%. Angled badge: "${item.data.textOverlay || "N/A"}"`;
        tags = ["Design"];
      }

      return {
        id: item.id,
        savedAt: "Saved recently",
        type: item.type,
        title: item.title,
        description,
        tags,
        score,
        estDuration,
        wordsCount,
        data: item.data,
        isUserGenerated: true
      };
    }),
    ...defaultLibraryItems.map(item => ({ ...item, isUserGenerated: false }))
  ];

  // Perform client-side filter
  const filteredItems = combinedItems.filter(item => {
    // Search query
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filters
    if (activeSubTab === "all") return matchesSearch;
    if (activeSubTab === "hooks") return matchesSearch && item.type === "hook";
    if (activeSubTab === "titles") return matchesSearch && item.type === "title";
    if (activeSubTab === "scripts") return matchesSearch && item.type === "script";
    if (activeSubTab === "thumbnails") return matchesSearch && item.type === "thumbnail";
    
    return matchesSearch;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (id: string, isUser: boolean) => {
    if (isUser) {
      onDelete(id);
    } else {
      // Allow visual removal from session list for default seed items too!
      const target = document.getElementById(`card-${id}`);
      if (target) {
        target.style.transition = "all 0.3s ease";
        target.style.opacity = "0";
        target.style.transform = "scale(0.9)";
        setTimeout(() => {
          target.style.display = "none";
        }, 300);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#0d0d0d]" id="saved-ideas-view-container">
      {/* Header matched with screenshots: Search Box on immediate right side block! */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-[#0d0d0d]">
            Saved Library
          </h1>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Browse and organize your saved hooks, scripts, thumbnail layouts, and SEO packages.
          </p>
        </div>

        {/* Precise Search Form */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-4 py-2.5 pl-10 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Sorting & Filter Tab Chips Row! */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Left tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Items" },
            { id: "hooks", label: "Hooks" },
            { id: "titles", label: "Titles" },
            { id: "scripts", label: "Scripts" },
            { id: "thumbnails", label: "Covers" }
          ].map((tab) => {
            const count = combinedItems.filter(i => tab.id === "all" ? true : i.type === tab.id.substring(0, tab.id.length - 1)).length;
            const labelStr = tab.id === "all" ? tab.label : `${tab.label} (${count})`;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab.id 
                    ? "bg-black text-white" 
                    : "bg-[#FAF9F9] text-gray-650 hover:bg-gray-100"
                }`}
              >
                {labelStr}
              </button>
            );
          })}
        </div>

        {/* Right Aux Filter controls */}
        <div className="flex items-center gap-2">
          <select className="bg-transparent text-xs text-gray-500 font-semibold focus:outline-none cursor-pointer">
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <button className="p-1 text-gray-400 hover:text-black">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-black">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid View displaying beautiful items */}
      {filteredItems.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 space-y-4 bg-[#FAF9F9]">
          <Bookmark className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
          <div>
            <p className="font-display font-medium text-gray-700 text-base">No items found matching criteria</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Try editing your search query or filter chip selection above.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.slice(0, visibleCount).map((item) => (
            <div 
              key={item.id}
              id={`card-${item.id}`}
              onClick={() => setSelectedItem(item as any)}
              className={`
                bg-white border border-gray-150 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative cursor-pointer group
                ${selectedItem?.id === item.id ? "ring-1 ring-[#FF6B00] border-transparent" : ""}
              `}
            >
              <div>
                {/* Upper line: Category text & bookmark indicator */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border tracking-wide select-none ${
                    item.type === "hook" 
                      ? "bg-[#FFF2EB] text-[#FF6B00] border-[#FF6B00]/15" 
                      : item.type === "title" 
                        ? "bg-purple-50 text-purple-700 border-purple-100" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                  }`}>
                    {item.type}
                  </span>
                  <Bookmark className="w-4 h-4 text-gray-300 group-hover:text-[#FF6B00] transition-colors" />
                </div>

                {/* Card Main Title */}
                <h3 className="font-display font-semibold text-sm text-[#0D0D0D] tracking-tight hover:text-[#FF6B00] transition-colors mt-3 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Sub-description with line truncation */}
                <p className="text-xs text-gray-500 font-sans mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer row content */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.score && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.score}
                    </span>
                  )}
                  {item.estDuration && (
                    <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                      {item.estDuration}
                    </span>
                  )}
                  {item.wordsCount && (
                    <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                      {item.wordsCount}
                    </span>
                  )}
                  {item.tags.map(t => (
                    <span key={t} className="text-[9px] font-bold text-[#FF6B00] bg-[#FFF2EB] px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                  {item.savedAt}
                </span>
              </div>

              {/* Hover actions block panel */}
              <div className="absolute top-2.5 right-2 px-1 py-0.5 flex items-center bg-white border border-gray-100 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity gap-1 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const payload = typeof item.data === "string" ? item.data : JSON.stringify(item.data, null, 2);
                    handleCopyText(item.id, payload);
                  }}
                  className="p-1.5 text-gray-400 hover:text-[#FF6B00] rounded-md"
                  title="Copy payload details"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#FF6B00]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id, !!item.isUserGenerated);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-md"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Items brown/orange expandable button */}
      {filteredItems.length > visibleCount && (
        <div className="text-center pt-4">
          <button 
            onClick={() => setVisibleCount(prev => prev + 3)}
            className="px-6 py-2 border border-gray-200 hover:border-[#FF6B00] text-gray-700 hover:text-[#FF6B00] text-xs font-semibold rounded-xl transition-all shadow-sm bg-white cursor-pointer"
          >
            Load More Items
          </button>
        </div>
      )}

      {/* Inspector modal drawer for selected libraries */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 p-6 shadow-2xl relative space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-base text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FF6B00]" />
                Inspect Saved Item Details
              </h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-black font-semibold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                <p className="text-[10px] text-gray-450 uppercase font-black tracking-wide">Title Asset</p>
                <p className="font-semibold text-[#0d0d0d] text-sm leading-snug">{selectedItem.title}</p>
                
                <p className="text-[10px] text-gray-450 uppercase font-black tracking-wide mt-2">Description</p>
                <p className="text-gray-600 leading-normal">{selectedItem.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Payload details</span>
                <pre className="p-3.5 bg-black text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-56 leading-normal">
                  {JSON.stringify(selectedItem.data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  const text = JSON.stringify(selectedItem.data, null, 2);
                  navigator.clipboard.writeText(text);
                  setSelectedItem(null);
                }}
                className="bg-[#0d0d0d] hover:bg-[#FF6B00] text-white text-xs font-semibold py-2 px-5 rounded-xl transition-colors cursor-pointer"
              >
                Close &amp; Copy Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
