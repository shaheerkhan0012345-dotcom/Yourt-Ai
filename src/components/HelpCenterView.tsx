import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Rocket, 
  Wand2, 
  CreditCard, 
  FileText, 
  Link as LinkIcon, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  MessageSquare, 
  Bot, 
  X,
  HelpCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  BookOpen,
  ArrowUpRight
} from "lucide-react";

interface Article {
  id: string;
  category: "getting-started" | "tool-guides" | "billing-account";
  title: string;
  excerpt: string;
  icon: React.ComponentType<{ className?: string }>;
  readTime: string;
  content: string[];
}

export default function HelpCenterView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Articles catalog matching the exact references in your request
  const articles: Article[] = [
    {
      id: "art-1",
      category: "tool-guides",
      title: "How to optimize for YouTube algorithm with AI hooks",
      excerpt: "Learn how the curiosity-gap style increases first-3-second retention by over 40% with AI-driven phrasing.",
      icon: FileText,
      readTime: "4 min read",
      content: [
        "In digital video creation, the first three seconds are the absolute differentiator between viral traction and immediate user drop-off.",
        "Yourt AI's Hook Generator utilizes deep-learning semantic patterns to identify key emotional triggers—specifically, the Curiosity Gap and imminent professional threats.",
        "To get the highest CTR and retention, follow these steps:",
        "1. Select a focus keyword (e.g., 'React performance' or 'Vite bundling').",
        "2. Generate 5 variations using our S-Tier curiosity models.",
        "3. A/B test with your actual raw footage during edits: put the text overlays on screen in bold high-contrast fonts during the initial hook sentence.",
        "4. Avoid clickbait that does not match your video content—the algorithm measures average view completion rate, not just click rates."
      ]
    },
    {
      id: "art-2",
      category: "getting-started",
      title: "Connecting your YouTube channel for automatic uploads",
      excerpt: "Step-by-step configuration guide to seamlessly link your creator channels for instant scheduling.",
      icon: LinkIcon,
      readTime: "5 min read",
      content: [
        "Simplify your workflow by allowing Yourt AI to schedule and deploy draft video ideas directly into your YouTube Studio draft queue.",
        "How to execute configuration:",
        "1. Navigate to Settings -> Integrations in your Yourt AI panel.",
        "2. Click 'Link Channel Name' next to the YouTube service option.",
        "3. Authenticate with your secure Google Workspace credentials and authorize permissions.",
        "4. Your content schedules are fully stored end-to-end utilizing our secure encrypted cloud persistence database.",
        "5. Once connected, any final video ideas or thumbnails generated can be pushed directly to your account with a single 'Export to YouTube' click."
      ]
    },
    {
      id: "art-3",
      category: "billing-account",
      title: "Understanding AI credits and monthly roll-over",
      excerpt: "Everything you need to know about your 2,000 monthly Pro credits, refills, and saving unused balance.",
      icon: ShieldCheck,
      readTime: "3 min read",
      content: [
        "Every premium subscription comes bundled with 2,000 Pro generation credits restored every billing cycle on the first day of your subscription.",
        "Credit allocations per action:",
        "- Thumbnail Generation: 50 credits (uses advanced Gemini and Image generation pipelines).",
        "- Viral Script Drafting: 50 credits.",
        "- Curiosity Hooks & Title Generation: 20 credits.",
        "- High-performing Hashtags & Short Ideas: 10 credits.",
        "Important billing notes:",
        "- Unused regular credits roll over for up to 3 calendar months.",
        "- If you exhaust your balances prematurely, you can top-up instantly inside Settings -> Billing without disrupting your active generative workloads."
      ]
    },
    {
      id: "art-4",
      category: "getting-started",
      title: "Collaborating with team members on content calendars",
      excerpt: "Shared workflows, calendars, and asset sharing strategies for modern high-performance creator teams.",
      icon: Users,
      readTime: "6 min read",
      content: [
        "Yourt AI allows you to construct a consolidated content outline and share scheduled calendars with editors, designers, and social managers.",
        "Setting up your team workspace:",
        "1. Invite team members with secure read or edit links stored dynamically in Firestore.",
        "2. Assign roles to team members to manage who can consume generation credits.",
        "3. Coordinate dates: schedule video concepts and check progress markers using our integrated Content Calendar view.",
        "4. Live Synchronization: elements updated by your team are refreshed in real-time so everyone is aligned on delivery deadlines."
      ]
    },
    {
      id: "art-5",
      category: "tool-guides",
      title: "Mastering the Thumbnail Generator & Layout Colors",
      excerpt: "Pro tips to styling high-CTR background images using high-impact visual color principles.",
      icon: Wand2,
      readTime: "4 min read",
      content: [
        "Thumbnails are the entrance gates to your contents. Yourt AI incorporates psychological color layout combinations designed to trigger instant visual focus.",
        "Thumbnail design rules:",
        "1. **Never use generic gradients:** Clean, rich solid colors or high-contrast duotones are statistically more effective.",
        "2. **Impact Orange:** Our iconic `#FF6B00` visual signature combined with deep slate-grays generates a highly eye-catching professional 'Creator Suite' feel.",
        "3. **Tilted Neon Tags:** Tilting your focal text tags by 3 to 5 degrees creates an organic sense of movement & urgency.",
        "4. **Text length:** Keep text overlays to a maximum of 4 high-fidelity impact words (e.g., 'THE SECRET METHOD' or 'DO NOT TOUCH')."
      ]
    }
  ];

  // Filters
  const filteredArticles = articles.filter(art => {
    const matchesSearch = searchQuery.trim() === "" || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().replace("-", " ").includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === null || art.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenHelpBot = () => {
    // Fire custom event to open the chat widget
    const event = new CustomEvent("open-yourt-chat");
    window.dispatchEvent(event);
  };

  const trendingTags = ["AI Credits", "YouTube Integration", "Script Styles"];

  return (
    <div className="max-w-[860px] mx-auto py-4 font-sans select-none animate-fade-in" id="help-center-container">
      
      {/* 1. HERO HEADER */}
      <div className="text-center md:text-left space-y-5 mb-11">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#0D0D0D] tracking-tight">
          How can we help?
        </h1>
        
        {/* Search Input and Icon */}
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tools, features, or billing questions..."
            className="w-full pl-12 pr-4 py-4 bg-gray-100/70 hover:bg-gray-100/90 focus:bg-white text-sm text-gray-800 border-0 focus:ring-2 focus:ring-[#FF6B00] rounded-2xl transition-all placeholder-gray-500 font-sans shadow-3xs"
            id="help-center-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-xs text-gray-400 hover:text-[#FF6B00] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Trending Tags list */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs pt-1">
          <span className="text-gray-500 font-medium font-sans">Trending:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1 bg-gray-100 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] text-gray-600 rounded-full font-semibold transition-all duration-150 border border-gray-200/40 text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THREE GRID HERO CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {/* Card 1: Getting Started */}
        <div 
          onClick={() => {
            setActiveCategory(activeCategory === "getting-started" ? null : "getting-started");
            setSearchQuery("");
          }}
          className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
            activeCategory === "getting-started" 
              ? "bg-[#FF6B00]/5 border-[#FF6B00] shadow-sm" 
              : "bg-gray-100/45 hover:bg-gray-100/75 border-gray-105"
          }`}
          id="help-category-getting-started"
        >
          <div>
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${
              activeCategory === "getting-started" ? "bg-[#FF6B00] text-white" : "bg-[#FF6B00]/10 text-[#FF6B00]"
            }`}>
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0D0D0D] tracking-tight">Getting Started</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-2 font-sans">
              New to Yourt AI? Learn the basics and set up your workspace in minutes.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block mt-4 font-sans">
            {activeCategory === "getting-started" ? "Selected" : "View Articles →"}
          </span>
        </div>

        {/* Card 2: Tool Guides */}
        <div 
          onClick={() => {
            setActiveCategory(activeCategory === "tool-guides" ? null : "tool-guides");
            setSearchQuery("");
          }}
          className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
            activeCategory === "tool-guides" 
              ? "bg-[#FF6B00]/5 border-[#FF6B00] shadow-sm" 
              : "bg-gray-100/45 hover:bg-gray-100/75 border-gray-105"
          }`}
          id="help-category-tool-guides"
        >
          <div>
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${
              activeCategory === "tool-guides" ? "bg-[#FF6B00] text-white" : "bg-[#FF6B00]/10 text-[#FF6B00]"
            }`}>
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0D0D0D] tracking-tight">Tool Guides</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-2 font-sans">
              Master our Hook, Script, and Thumbnail generators to maximize performance.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block mt-4 font-sans">
            {activeCategory === "tool-guides" ? "Selected" : "View Articles →"}
          </span>
        </div>

        {/* Card 3: Billing & Account */}
        <div 
          onClick={() => {
            setActiveCategory(activeCategory === "billing-account" ? null : "billing-account");
            setSearchQuery("");
          }}
          className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
            activeCategory === "billing-account" 
              ? "bg-[#FF6B00]/5 border-[#FF6B00] shadow-sm" 
              : "bg-gray-100/45 hover:bg-gray-100/75 border-gray-105"
          }`}
          id="help-category-billing-account"
        >
          <div>
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${
              activeCategory === "billing-account" ? "bg-[#FF6B00] text-white" : "bg-[#FF6B00]/10 text-[#FF6B00]"
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0D0D0D] tracking-tight">Billing & Account</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-2 font-sans">
              Manage your subscription, understanding credits, and invoice history.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block mt-4 font-sans">
            {activeCategory === "billing-account" ? "Selected" : "View Articles →"}
          </span>
        </div>
      </div>

      {/* 3. POPULAR ARTICLES SECTION */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-5 border-b border-gray-105 pb-3">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0D0D0D] tracking-tight">
            {activeCategory ? `Category: ${activeCategory.replace("-", " ")} Articles` : searchQuery ? "Search Results" : "Popular Articles"}
          </h2>
          { (activeCategory || searchQuery) && (
            <button 
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className="text-xs font-bold text-[#FF6B00] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 space-y-3 py-10" id="articles-empty-state">
            <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-gray-800 font-bold text-sm">No matched support manual found</p>
            <p className="text-gray-400 text-xs">Try adjusting your terms or browse the main categories above</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="mt-2 bg-black hover:bg-[#FF6B00] text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100" id="articles-list">
            {filteredArticles.map((art) => {
              const ArtIcon = art.icon;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50/70 px-2 transition-all rounded-lg"
                  id={`help-article-row-${art.id}`}
                >
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div className="w-10 h-10 shrink-0 bg-gray-100 group-hover:bg-[#FF6B00]/10 rounded-xl flex items-center justify-center transition-colors">
                      <ArtIcon className="w-5 h-5 text-gray-500 group-hover:text-[#FF6B00] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-semibold text-sm text-[#0D0D0D] group-hover:text-[#FF6B00] transition-colors truncate">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 select-none">
                    <span className="text-[10px] font-medium text-gray-400 font-mono hidden sm:inline-block">
                      {art.readTime}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5">
          <button 
            onClick={() => setSearchQuery("YouTube")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:underline"
          >
            View all documentation <span className="text-[14px]">→</span>
          </button>
        </div>
      </div>

      {/* 4. "STILL NEED HELP?" CTA BANNER */}
      <div 
        className="relative bg-gradient-to-r from-gray-100/50 to-gray-50 border border-gray-150 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden select-none"
        id="help-center-cta-banner"
      >
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0D0D0D] tracking-tight">
            Still need help?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed font-sans">
            Our support team is available 24/7 to help you with any technical or billing issues.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto shrink-0 font-sans">
          <button
            onClick={handleOpenHelpBot}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55F00] active:scale-98 text-white px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            id="help-btn-contact-support"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Support
          </button>
          
          <button
            onClick={handleOpenHelpBot}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:scale-98 text-gray-800 border border-gray-200 px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
            id="help-btn-help-bot"
          >
            <Bot className="w-4 h-4 text-gray-500" />
            Help Bot
          </button>
        </div>

        {/* Decorative backdrop graphics */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <HelpCircle className="w-48 h-48 text-[#FF6B00]" />
        </div>
      </div>

      {/* 5. FOOTER INSIDE HELP CENTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400 mt-12 border-t border-gray-100 pt-6">
        <p>© 2026 Yourt AI. All rights reserved.</p>
        <div className="flex gap-4 font-medium text-gray-500">
          <a href="#privacy" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#FF6B00] transition-colors">Terms of Service</a>
          <a href="#apidoc" className="hover:text-[#FF6B00] transition-colors">API Docs</a>
        </div>
      </div>

      {/* 6. EXPANDED ARTICLE MODAL POPUP */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
              id={`modal-article-view-${selectedArticle.id}`}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                    {selectedArticle.category.replace("-", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                    <Clock className="w-3 h-3" />
                    {selectedArticle.readTime}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-450 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-gray-700 leading-relaxed text-sm font-sans flex-1">
                <h3 className="font-display font-black text-2xl text-[#0D0D0D] tracking-tight pb-2 leading-tight">
                  {selectedArticle.title}
                </h3>
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx} className={idx > 2 ? "text-gray-600 shrink-0" : "text-gray-700"}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="p-5 border-t border-gray-100 bg-[#fbf9f9] flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-500 font-sans">Was this support manual helpful?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      alert("Thank you for your response!");
                      setSelectedArticle(null);
                    }}
                    className="bg-white hover:bg-[#FF6B00]/5 hover:text-[#FF6B00] text-[#0D0D0D] border border-gray-200 hover:border-[#FF6B00]/30 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Yes, helpful
                  </button>
                  <button 
                    onClick={() => {
                      alert("Thank you for your feedback! Opening help bot for you...");
                      setSelectedArticle(null);
                      handleOpenHelpBot();
                    }}
                    className="bg-white hover:bg-red-50 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
                  >
                    No, I need help
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
