import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Award, 
  Zap, 
  Copy, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  MessageSquare, 
  Compass, 
  ChevronRight, 
  Lightbulb, 
  Gauge, 
  Sliders, 
  Search, 
  Target,
  Upload,
  Image as ImageIcon,
  Trash2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { SavedItem } from "../types";

interface TrendAnalyzerViewProps {
  onSave: (item: Omit<SavedItem, "id" | "savedAt">) => void;
  savedList: SavedItem[];
  credits: number;
  deductCredits: (amount?: number) => void;
}

interface TrendingTopic {
  id: string;
  topic: string;
  category: string;
  trendingScore: number;
  momentumPct: number;
  viralIndex: "S-Tier" | "A-Tier" | "B-Tier" | "C-Tier";
  baseCTR: number;
  topKeywords: string[];
  competitorGap: string;
  ctrOptimization: {
    thumbnailTheme: string;
    colorPalette: string[];
    faceExpression: string;
    overlayText: string;
  };
  suggestedVideos: {
    id: string;
    title: string;
    description: string;
    estimatedCTR: number;
    targetAudience: string;
  }[];
}

interface TrendAnalysisResponse {
  category: string;
  overviewSummary: string;
  overallInterestTrend: number[];
  lastUpdated: string;
  trendingTopics: TrendingTopic[];
}

interface CTREvaluationResponse {
  title: string;
  thumbnailStyle: string;
  category: string;
  estimatedCTR: number;
  grade: string;
  breakdown: {
    titleStrength: number;
    visualSaliency: number;
    psychologicalTriggers: number;
  };
  critique: string;
  improvedTitle: string;
  ctrImpactFactors: string[];
}

export default function TrendAnalyzerView({ onSave, savedList, credits, deductCredits }: TrendAnalyzerViewProps) {
  const [activeCategory, setActiveCategory] = useState("Tech & Programming");
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [trendsData, setTrendsData] = useState<TrendAnalysisResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CTR Predictor States
  const [simulatorTitle, setSimulatorTitle] = useState("I coded a full web app using only free AI tools");
  const [simulatorStyle, setSimulatorStyle] = useState("Split screen showing a high-contrast timer at 23:59 and a custom neon dark dashboard");
  const [loadingCTR, setLoadingCTR] = useState(false);
  const [ctrReport, setCtrReport] = useState<CTREvaluationResponse | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"trends" | "predictor">("trends");

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const categories = [
    { id: "Tech & Programming", label: "Tech & Code", desc: "Software, hardware, AI, web dev" },
    { id: "Gaming", label: "Gaming Vertical", desc: "UE5, retro consoles, speedruns" },
    { id: "Finance & Crypto", label: "Finance & Macro", desc: "Rate cuts, investing, portfolios" },
    { id: "Lifestyle & Vlogs", label: "Lifestyle & Vlogs", desc: "Detox routines, slow productivity" }
  ];

  // Fetch trend analysis
  const fetchTrends = async (catName: string) => {
    if (credits < 50) {
      alert("Insufficient credits. Please top up in Settings.");
      return;
    }
    
    setLoadingTrends(true);
    try {
      const response = await fetch("/api/trend/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: catName })
      });
      const data: TrendAnalysisResponse = await response.json();
      setTrendsData(data);
      if (data.trendingTopics && data.trendingTopics.length > 0) {
        setSelectedTopic(data.trendingTopics[0]);
      }
      deductCredits(50);
    } catch (e) {
      console.error("Failed to fetch trends:", e);
    } finally {
      setLoadingTrends(false);
    }
  };

  // Run initial mock trends load or pre-populate on select change
  useEffect(() => {
    // Generate initial pre-set local default data without charging credits on initial mount
    const seed = getClientSeedTrends(activeCategory);
    setTrendsData(seed);
    if (seed.trendingTopics && seed.trendingTopics.length > 0) {
      setSelectedTopic(seed.trendingTopics[0]);
    }
  }, [activeCategory]);

  // Handle CTR estimation prediction
  const handleEstimateCTR = async () => {
    if (!uploadedImage && !simulatorStyle) {
      alert("Please upload a thumbnail image or provide a visual style description to run analysis.");
      return;
    }

    if (credits < 30) {
      alert("Insufficient credits. Please top up in Settings.");
      return;
    }
    
    setLoadingCTR(true);
    try {
      const response = await fetch("/api/trend/estimate-ctr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: simulatorTitle, 
          thumbnailStyle: simulatorStyle, 
          category: activeCategory,
          thumbnailImage: uploadedImage
        })
      });
      const data: CTREvaluationResponse = await response.json();
      setCtrReport(data);
      deductCredits(30);
    } catch (e) {
      console.error("Failed to estimate CTR:", e);
    } finally {
      setLoadingCTR(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveVideoIdea = (vid: { title: string; description: string; estimatedCTR: number }) => {
    // Save to global items list
    onSave({
      type: "idea",
      title: vid.title,
      data: {
        conceptDescription: vid.description,
        whyItWillWork: `Identified trending opportunity in ${activeCategory}. High estimated click probability of ${vid.estimatedCTR}% CTR.`,
        thumbnailSuggestion: `High relevance style: ${selectedTopic?.ctrOptimization.thumbnailTheme || "Action style"}`,
        potentialMetric: "Viral Concept"
      }
    });
  };

  const chartData = trendsData?.overallInterestTrend 
    ? trendsData.overallInterestTrend.map((val, idx) => ({
        week: `Wk ${idx + 1}`,
        Interest: val
      }))
    : [
        { week: "Wk 1", Interest: 45 },
        { week: "Wk 2", Interest: 52 },
        { week: "Wk 3", Interest: 68 },
        { week: "Wk 4", Interest: 85 },
        { week: "Wk 5", Interest: 95 },
        { week: "Wk 6", Interest: 120 }
      ];

  return (
    <div className="space-y-6 animate-fade-in text-[#0d0d0d]" id="trend-analyzer-container">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-[#0d0d0d] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#FF6B00]" />
            AI Trend Analyzer &amp; CTR Evaluator
          </h1>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Analyze YouTube viral trends, explore competitor gap analysis, and evaluate metadata CTR algorithms with high precision.
          </p>
        </div>

        {/* Workspace Mode selectors */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 self-start md:self-auto">
          <button
            onClick={() => setActiveMainTab("trends")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${activeMainTab === "trends" ? "bg-white text-black shadow-xs" : "text-gray-500 hover:text-black"}`}
          >
            <Compass className="w-4 h-4" />
            Niche Trends
          </button>
          <button
            onClick={() => setActiveMainTab("predictor")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${activeMainTab === "predictor" ? "bg-white text-[#FF6B00] shadow-xs" : "text-gray-500 hover:text-black"}`}
          >
            <Gauge className="w-4 h-4" />
            CTR Predictor &amp; Tuner
          </button>
        </div>
      </div>

      {activeMainTab === "trends" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Category selection & Overview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-sm text-[#0d0d0d] flex items-center gap-2 border-b border-gray-50 pb-2.5">
                <Sliders className="w-4 h-4 text-gray-500" />
                Select Creative Vertical
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${activeCategory === cat.id ? "bg-[#FFF2EB] border-[#FF6B00] shadow-2xs" : "bg-gray-50/50 border-gray-150 hover:bg-gray-50"}`}
                  >
                    <p className="text-xs font-bold text-gray-800">{cat.label}</p>
                    <p className="text-[10px] text-gray-400 font-medium font-sans mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={() => fetchTrends(activeCategory)}
                disabled={loadingTrends}
                className="w-full bg-[#0d0d0d] hover:bg-[#FF6B00] active:scale-98 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loadingTrends ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying Live Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                    Run AI Trend Analysis (-50 CR)
                  </>
                )}
              </button>
            </div>

            {/* Interest curve widget */}
            {trendsData && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <h4 className="font-display font-semibold text-xs text-gray-500 uppercase tracking-wider">Interest Trajectory</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded">
                    +{(trendsData.overallInterestTrend?.[5] || 120) - (trendsData.overallInterestTrend?.[0] || 45)}% Momentum
                  </span>
                </div>
                
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="interestGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="week" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #f1f1f1" }} />
                      <Area type="monotone" dataKey="Interest" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#interestGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Active Trends breakdown & suggestions */}
          <div className="lg:col-span-2 space-y-6">
            {trendsData ? (
              <div className="space-y-6">
                
                {/* General Summary Card */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FFF2EB] px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {trendsData.category} Vertical Report
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans pt-1">
                    {trendsData.overviewSummary}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Last sync database lookup: {trendsData.lastUpdated}
                  </p>
                </div>

                {/* Topics selection bar */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-sm text-[#0D0D0D]">Hot Sub-Topics &amp; Opportunity Arbitrages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trendsData.trendingTopics.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTopic(item)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedTopic?.id === item.id ? "bg-white border-[#FF6B00] ring-1 ring-[#FF6B00]" : "bg-white border-gray-150 hover:bg-gray-50/60"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded">
                            {item.viralIndex} Viral Index
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600">
                            {item.baseCTR}% Avg CTR
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-sm text-gray-900 mt-2 line-clamp-1">{item.topic}</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase">Velocity Score:</span>
                          <span className="text-[11px] font-bold text-[#FF6B00]">+{item.momentumPct}% this week</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed view of the selected topic */}
                {selectedTopic && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6 animate-fade-in">
                    
                    {/* Header */}
                    <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-base text-[#0D0D0D]">{selectedTopic.topic}</h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {selectedTopic.topKeywords.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-650 text-[10px] font-semibold px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#FAF9F9] border border-gray-200 px-3 py-2 rounded-xl text-center self-start">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Opportunity Index</p>
                        <p className="text-lg font-black text-emerald-600 font-sans">{selectedTopic.trendingScore}/100</p>
                      </div>
                    </div>

                    {/* Competitor gap breakdown */}
                    <div className="bg-amber-50/50 border border-amber-100/60 rounded-xl p-4 flex gap-3">
                      <Target className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">Competitor Gap &amp; Strategy</h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
                          {selectedTopic.competitorGap}
                        </p>
                      </div>
                    </div>

                    {/* Thumbnail optimization layout guide */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Click-Through Optimization Guideline</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                        <div className="bg-[#FAF9F9] p-3.5 rounded-xl space-y-2">
                          <p className="font-bold text-gray-700">Visual Background Recommendation</p>
                          <p className="text-gray-500 font-sans leading-relaxed">{selectedTopic.ctrOptimization.thumbnailTheme}</p>
                        </div>
                        <div className="bg-[#FAF9F9] p-3.5 rounded-xl space-y-2">
                          <p className="font-bold text-gray-700">Visual High-CTR Triggers</p>
                          <div className="space-y-1.5 font-sans text-gray-600">
                            <p>🗣️ <span className="font-medium text-gray-700">Face reaction:</span> {selectedTopic.ctrOptimization.faceExpression}</p>
                            <p>🏷️ <span className="font-medium text-gray-700">Overlay phrase:</span> "{selectedTopic.ctrOptimization.overlayText}"</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span>🎨 Colors:</span>
                              <div className="flex items-center gap-1">
                                {selectedTopic.ctrOptimization.colorPalette.map((col) => (
                                  <span 
                                    key={col} 
                                    className="w-4 h-4 rounded-full border border-gray-200" 
                                    style={{ backgroundColor: col }}
                                    title={col}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Concept Drafts */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Viral Concept Templates</h4>
                        <span className="text-[10px] text-gray-400 font-semibold">Click '+' to save ideas to library</span>
                      </div>
                      <div className="space-y-3">
                        {selectedTopic.suggestedVideos.map((vid) => (
                          <div key={vid.id} className="border border-gray-100 hover:border-gray-200 bg-[#FAF9F9]/40 p-4 rounded-xl flex items-start justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-display font-semibold text-xs text-gray-900 leading-tight">{vid.title}</h5>
                                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 rounded-md">
                                  {vid.estimatedCTR}% CTR potential
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{vid.description}</p>
                              <p className="text-[9px] text-gray-400 font-medium">Target segment: {vid.targetAudience}</p>
                            </div>

                            <button
                              onClick={() => handleSaveVideoIdea(vid)}
                              className="p-1.5 bg-white border border-gray-200 rounded-lg hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors cursor-pointer"
                              title="Save Idea to Archive"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="p-16 border border-gray-100 bg-white rounded-3xl text-center space-y-4">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <p className="font-display font-semibold text-gray-700 text-sm">No trend reports parsed yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Select a creative vertical on the left and run our high-accuracy trend analysis engine.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Side */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-5">
            <h3 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-50 pb-2.5">
              <Sliders className="w-4 h-4 text-[#FF6B00]" />
              Simulate Concept CTR
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Draft Video Title</label>
              <textarea
                value={simulatorTitle}
                onChange={(e) => setSimulatorTitle(e.target.value)}
                placeholder="Paste your video title draft..."
                rows={3}
                className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-3 rounded-xl text-xs font-semibold text-gray-700 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Upload Thumbnail Image</label>
              
              {!uploadedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("thumbnail-picker")?.click()}
                  className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging 
                      ? "border-[#FF6B00] bg-[#FF6B00]/5" 
                      : "border-gray-200 hover:border-gray-300 bg-[#FAF9F9]/50 hover:bg-[#FAF9F9]"
                  }`}
                >
                  <input
                    type="file"
                    id="thumbnail-picker"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className={`w-5 h-5 ${isDragging ? "text-[#FF6B00] animate-bounce" : "text-gray-400"}`} />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-700">Drag & drop thumbnail, or browse</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Supports PNG, JPG, JPEG, WebP</p>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-100 bg-[#FAF9F9] p-2.5 rounded-xl relative space-y-2">
                  <div className="aspect-video w-full rounded-lg overflow-hidden relative group border border-gray-200 bg-white">
                    <img 
                      src={uploadedImage} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("thumbnail-picker-change")?.click();
                        }}
                        className="bg-white/95 hover:bg-white text-gray-800 text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer border-0"
                      >
                        <Upload className="w-3 h-3" /> Change Image
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-emerald-500" /> Image loaded
                    </span>
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-red-500 hover:text-red-600 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>

                  <input
                    type="file"
                    id="thumbnail-picker-change"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Describe Thumbnail Visual Style (Optional)</label>
                {uploadedImage && (
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Image active</span>
                )}
              </div>
              <textarea
                value={simulatorStyle}
                onChange={(e) => setSimulatorStyle(e.target.value)}
                placeholder={uploadedImage ? "Add extra context, e.g. text font name, overlay wording..." : "e.g. Split screen showing high-contrast interface elements, dramatic glowing neon details..."}
                rows={2}
                className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-3 rounded-xl text-xs font-semibold text-gray-700 font-sans"
              />
            </div>

            <button
              onClick={handleEstimateCTR}
              disabled={loadingCTR}
              className="w-full bg-[#0D0D0D] hover:bg-[#FF6B00] active:scale-98 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loadingCTR ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating Algorithmic CTR...
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4" />
                  Estimate CTR Potential (-30 CR)
                </>
              )}
            </button>
          </div>

          {/* Report Side */}
          <div className="lg:col-span-7 space-y-6">
            {ctrReport ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6 animate-fade-in">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase">
                      {ctrReport.grade}
                    </span>
                    <h4 className="font-display font-bold text-sm text-gray-900 mt-1">Algorithm Performance Prediction</h4>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-[#FAF9F9] border border-gray-200 p-3 rounded-xl">
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Estimated CTR</p>
                      <p className="text-2xl font-black text-[#FF6B00] font-sans">{ctrReport.estimatedCTR}%</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quality Driver Scores</h5>
                  <div className="space-y-2.5 font-sans">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-700 mb-1">
                        <span>Title Click-Ability &amp; Curiosity Hook</span>
                        <span className="font-bold">{ctrReport.breakdown.titleStrength}/100</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${ctrReport.breakdown.titleStrength}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-700 mb-1">
                        <span>Thumbnail Saliency &amp; Focus Glows</span>
                        <span className="font-bold">{ctrReport.breakdown.visualSaliency}/100</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${ctrReport.breakdown.visualSaliency}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-gray-700 mb-1">
                        <span>Cognitive Dissonance &amp; Tension</span>
                        <span className="font-bold">{ctrReport.breakdown.psychologicalTriggers}/100</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: `${ctrReport.breakdown.psychologicalTriggers}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narrative critique */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1 font-sans text-xs text-gray-600">
                  <p className="font-bold text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-[#FF6B00]" />
                    AI Optimization Critique
                  </p>
                  <p className="leading-relaxed">{ctrReport.critique}</p>
                </div>

                {/* Improved title suggestions */}
                <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-xl p-4 space-y-3">
                  <div>
                    <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">AI Recommendation Title</h5>
                    <p className="font-display font-semibold text-xs text-gray-900 mt-1">{ctrReport.improvedTitle}</p>
                  </div>
                  <button
                    onClick={() => handleCopyText("rec-title", ctrReport.improvedTitle)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF6B00] hover:underline cursor-pointer"
                  >
                    {copiedId === "rec-title" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied to clipboard
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy recommended title
                      </>
                    )}
                  </button>
                </div>

                {/* Impact drivers bullet points */}
                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Growth Factors</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-gray-600">
                    {ctrReport.ctrImpactFactors.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-[#FAF9F9] p-2.5 rounded-lg border border-gray-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-16 border border-gray-150 bg-white rounded-3xl text-center space-y-4">
                <Gauge className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <p className="font-display font-semibold text-gray-700 text-sm">No CTR prediction generated yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Fill out your planned metadata on the left and trigger our algorithmic simulation engine.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

// Client pre-computed default seed reports to avoid loading states or credit locks on initial layout load
function getClientSeedTrends(cat: string): TrendAnalysisResponse {
  const topics: Record<string, TrendingTopic[]> = {
    "Tech & Programming": [
      {
        id: "seed-tech-1",
        topic: "Local AI Agents (MCP & Ollama Integration)",
        category: "Tech & Programming",
        trendingScore: 98,
        momentumPct: 145,
        viralIndex: "S-Tier",
        baseCTR: 11.2,
        topKeywords: ["MCP", "Ollama", "Local LLM", "LangChain"],
        competitorGap: "Many basic setup videos, but zero guides on building custom production-level MCP servers. Focus on real-world custom tool integrations.",
        ctrOptimization: {
          thumbnailTheme: "Dark modern console split screen showing a robot hand and clean code snippets with high-contrast glowing lines",
          colorPalette: ["#FF6B00", "#0D0D0D", "#10B981"],
          faceExpression: "Intense focus or slight smirk looking at terminal logs",
          overlayText: "OLLAMA SECRETS"
        },
        suggestedVideos: [
          {
            id: "seed-tech-1-1",
            title: "I Built a Local AI Agent to Replace My Junior Developer",
            description: "Step-by-step setup using Ollama and Model Context Protocol to automate coding tasks, showing raw unedited speed gains and errors.",
            estimatedCTR: 12.8,
            targetAudience: "Developers, tech enthusiasts, AI tinkerers"
          },
          {
            id: "seed-tech-1-2",
            title: "Stop Using ChatGPT API: Build Local Agents for Free",
            description: "How to run local models on high-performance machines with zero API costs, benchmarking latency against OpenAI.",
            estimatedCTR: 10.4,
            targetAudience: "Indie hackers, startup founders, budget developers"
          }
        ]
      },
      {
        id: "seed-tech-2",
        topic: "Vite 6 + React 19 Core Features",
        category: "Tech & Programming",
        trendingScore: 89,
        momentumPct: 62,
        viralIndex: "A-Tier",
        baseCTR: 8.9,
        topKeywords: ["React 19", "Vite 6", "Server Components", "React Compiler"],
        competitorGap: "Lots of documentation reviews but very few actual build tutorials. Developers want a live migration example.",
        ctrOptimization: {
          thumbnailTheme: "Vibrant gradient backdrop featuring massive brand logos with dual-tone neon shadows",
          colorPalette: ["#61DAFB", "#BD34FE", "#0D0D0D"],
          faceExpression: "Surprised hand on chin or eye-widening stare at logo",
          overlayText: "REACT 19 DEAD?"
        },
        suggestedVideos: [
          {
            id: "seed-tech-2-1",
            title: "We Migrated a 100k-Line React App to React 19 (It Broke)",
            description: "A complete post-mortem of moving a production application to React 19 and Vite 6, detailing breaking changes and performance tests.",
            estimatedCTR: 9.7,
            targetAudience: "Frontend engineers, product managers, web developers"
          }
        ]
      }
    ],
    "Gaming": [
      {
        id: "seed-game-1",
        topic: "Next-Gen Unreal Engine 5.5 Physics Sandbox",
        category: "Gaming",
        trendingScore: 95,
        momentumPct: 112,
        viralIndex: "S-Tier",
        baseCTR: 10.5,
        topKeywords: ["UE5.5", "Unreal Engine", "Substrate", "Nanite Physics"],
        competitorGap: "Most creators just show cinematic trailers. Players want to see raw, chaotic gameplay testing the limits of destruction physics.",
        ctrOptimization: {
          thumbnailTheme: "High-density explosion with intense particle effects and glowing shockwaves",
          colorPalette: ["#FF0055", "#FFCC00", "#111111"],
          faceExpression: "Screaming with mouth wide open in complete chaos",
          overlayText: "NOT REAL LIFE?"
        },
        suggestedVideos: [
          {
            id: "seed-game-1-1",
            title: "Testing the Most Realistic Physics Sandbox Ever Created",
            description: "Spawning 100,000 highly-detailed nanite objects and detonating virtual nuclear weapons to stress test rendering pipelines in UE5.5.",
            estimatedCTR: 11.8,
            targetAudience: "Gamers, graphics nerds, game devs"
          }
        ]
      }
    ],
    "Finance & Crypto": [
      {
        id: "seed-fin-1",
        topic: "Fed Rate Cuts & Global Market Shifts",
        category: "Finance & Crypto",
        trendingScore: 92,
        momentumPct: 80,
        viralIndex: "A-Tier",
        baseCTR: 7.8,
        topKeywords: ["Interest Rates", "Federal Reserve", "Market Crash", "Investment Strategy"],
        competitorGap: "Too much doom-and-gloom clickbait. There is a strong demand for analytical, calm, macro-economic portfolios adjusted for rate changes.",
        ctrOptimization: {
          thumbnailTheme: "Clean high-contrast stock market charts trending downwards, paired with bold warning red colors",
          colorPalette: ["#EF4444", "#10B981", "#1F2937"],
          faceExpression: "Concerned, hands folded on chin, thinking deeply",
          overlayText: "DO THIS NOW"
        },
        suggestedVideos: [
          {
            id: "seed-fin-1-1",
            title: "Where to Invest $10,000 Post-Rate Cuts (Full Portfolio)",
            description: "A transparent look at asset re-allocation, including bonds, gold, selected indices, and high-yield vehicles for the new economic cycle.",
            estimatedCTR: 9.1,
            targetAudience: "Retail investors, passive savers, financial planners"
          }
        ]
      }
    ],
    "Lifestyle & Vlogs": [
      {
        id: "seed-life-1",
        topic: "Dopamine Detox & Slow Productivity Vlogs",
        category: "Lifestyle & Vlogs",
        trendingScore: 88,
        momentumPct: 45,
        viralIndex: "B-Tier",
        baseCTR: 8.2,
        topKeywords: ["Dopamine Detox", "Digital Minimalism", "Deep Work", "Slow Living"],
        competitorGap: "Most vlogs feel fake and overly aesthetic. Creators want gritty, authentic struggles of trying to disconnect for a week.",
        ctrOptimization: {
          thumbnailTheme: "Ultra-clean warm cinematic bedroom, soft lens flare, very calm color tones",
          colorPalette: ["#F5E6CA", "#7D6B5D", "#FAF9F9"],
          faceExpression: "Peaceful closed eyes, holding a warm mug",
          overlayText: "I QUIT PHONE"
        },
        suggestedVideos: [
          {
            id: "seed-life-1-1",
            title: "I Bought a Dumbphone for 30 Days (My Brain Re-wired)",
            description: "A daily log of trading a modern smartphone for a standard text/call only flip-phone, documenting anxiety, focus shifts, and social interactions.",
            estimatedCTR: 9.5,
            targetAudience: "Students, burnt-out professionals, tech consumers"
          }
        ]
      }
    ]
  };

  const matched = topics[cat] || [
    {
      id: "seed-gen-1",
      topic: `${cat} Viral Content Formula`,
      category: cat,
      trendingScore: 85,
      momentumPct: 35,
      viralIndex: "B-Tier",
      baseCTR: 7.5,
      topKeywords: [cat, "Optimization", "Growth Strategy"],
      competitorGap: "General templates exist but lack high-fidelity step-by-step scripts tailored to niche subcultures.",
      ctrOptimization: {
        thumbnailTheme: "A clean minimalist outline of standard dashboard screens with striking colored brackets",
        colorPalette: ["#FF6B00", "#0D0D0D", "#FFFFFF"],
        faceExpression: "Enthusiastic pointing gesture towards statistics",
        overlayText: "10X GROWTH"
      },
      suggestedVideos: [
        {
          id: "seed-gen-1-1",
          title: `How I Mastered the ${cat} Niche (Complete Manual)`,
          description: "A complete masterclass revealing exact scripting, editing style, and audience retention tricks to dominate this space.",
          estimatedCTR: 8.8,
          targetAudience: "Aspiring creators, editors, market researchers"
        }
      ]
    }
  ];

  return {
    category: cat,
    overviewSummary: `The ${cat} vertical is currently experiencing a rapid transition toward high-utility, hyper-authentic instructional frameworks. General advice or shallow syntheses are yielding lower engagement, while deep technical post-mortems and raw, unfiltered case studies are enjoying exponential traction and superior CTR.`,
    overallInterestTrend: [45, 52, 68, 85, 95, 120],
    lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16),
    trendingTopics: matched
  };
}
