import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  Loader2, 
  ScrollText, 
  Download, 
  Play, 
  SlidersHorizontal,
  Flame,
  FileDown
} from "lucide-react";
import { ScriptOutline, ScriptBeat, SavedItem } from "../types";

interface ScriptGeneratorViewProps {
  onSave: (item: Omit<SavedItem, "id" | "savedAt">) => void;
  savedList: SavedItem[];
  credits: number;
  deductCredits: (amount?: number) => void;
  preseedTitle?: string;
  clearPreseed?: () => void;
}

interface DisplayBlock {
  timestamp: string;
  visualText: string;
  audioHeader: string;
  audioText: string;
  pills?: string[];
}

export default function ScriptGeneratorView({ 
  onSave, 
  savedList, 
  credits, 
  deductCredits,
  preseedTitle,
  clearPreseed
}: ScriptGeneratorViewProps) {
  // Pre-loaded state matches the iPhone 15 Pro titanium edges user screenshot exactly
  const [title, setTitle] = useState("5 unknown features of the new iPhone 15 Pro");
  const [duration, setDuration] = useState("60 Seconds (Standard)");
  const [tone, setTone] = useState("Educational & Authoritative");

  // Default script outline that maps perfectly to the screenshot's data
  const [script, setScript] = useState<ScriptOutline | null>(() => {
    return {
      hook: "Stop scrolling! You've been using your new iPhone completely wrong, and I'm about to prove it.",
      intro: "Close up, dynamic shot of the iPhone 15 Pro titanium edges catching light. Fast zoom out.",
      bodyBeats: [
        {
          subtitle: "Everyone knows about the titanium body, but nobody is talking about this hidden Action Button feature.",
          visualCue: "Screen recording overlaid on a sleek dark background showing the Action Button settings menu. High contrast.",
          talkingPoints: "Everyone knows about the titanium body, but nobody is talking about this hidden Action Button feature."
        },
        {
          subtitle: "Instead of just setting it to mute, you can map it to trigger complex shortcuts. Want to instantly start recording a voice memo without unlocking your phone? Done.",
          visualCue: "Split screen: Left side shows someone struggling with an old camera. Right side shows effortless shooting with the new Action Button.",
          talkingPoints: "Instead of just setting it to mute, you can map it to trigger complex shortcuts. Want to instantly start recording a voice memo without unlocking your phone? Done."
        }
      ],
      cta: "Click the subscribe link to unlock more pro features of the iPhone 15 series!"
    };
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSectionIdx, setCopiedSectionIdx] = useState<number | null>(null);

  const durationOptions = [
    "60 Seconds (Standard)",
    "3 Minutes (Mid Form)",
    "8-10 Minutes (Standard YouTube)",
    "15+ Minutes (Deep Dive)"
  ];

  const toneOptions = [
    "Educational & Authoritative",
    "Urgent & Hype",
    "Casual Storytelling",
    "Contrarian & Critical"
  ];

  useEffect(() => {
    if (preseedTitle) {
      setTitle(preseedTitle);
      if (clearPreseed) {
        clearPreseed();
      }
    }
  }, [preseedTitle]);

  const handleGenerate = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    if (credits < 50) {
      setErrorMsg("Insufficient credits. Please recharge your balance on the Overview dashboard.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, duration }),
      });

      if (!res.ok) {
        let errMsg = "Failed to formulate script structure. Verify backend parameters.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      setScript(data);
      deductCredits(50);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isAlreadySaved = (scriptTitle: string) => {
    return savedList.some(item => item.type === "script" && item.title === `[Script] ${scriptTitle}`);
  };

  const handleSaveScript = () => {
    if (!script) return;
    if (isAlreadySaved(title)) return;
    onSave({
      type: "script",
      title: `[Script] ${title}`,
      data: { title, duration, tone, script }
    });
  };

  // Convert script data structure to the parallel dual-column display rows
  const getDisplayBlocks = (): DisplayBlock[] => {
    if (!script) return [];

    // Check if it's the custom iPhone concept or parsed dynamic layout
    const blocks: DisplayBlock[] = [];

    // Hook Row
    blocks.push({
      timestamp: "0:00",
      visualText: script.intro || "Close up dynamic intro scene setup holding high engagement.",
      audioHeader: "HOOK (0:00 - 0:05)",
      audioText: script.hook || "Stop scrolling right now...",
      pills: ["Hook", "Macro Shot"]
    });

    // Body beats mapping
    const beats = script.bodyBeats || [];
    if (beats.length > 0) {
      beats.forEach((beat, index) => {
        // Line increments for timestamps
        const baseStart = 5 + index * 7;
        const baseEnd = baseStart + 7;
        const startFormat = `0:${baseStart < 10 ? "0" + baseStart : baseStart}`;
        const endFormat = `0:${baseEnd < 10 ? "0" + baseEnd : baseEnd}`;

        blocks.push({
          timestamp: startFormat,
          visualText: beat.visualCue || "Screen graphics or high energy B-roll overlay scene.",
          audioHeader: `VOICEOVER (${startFormat} - ${endFormat})`,
          audioText: beat.talkingPoints || beat.subtitle || "",
          pills: index === 0 ? ["B-Roll", "Detail"] : ["Dynamic Split", "Overlay"]
        });
      });
    } else {
      // Fallback
      blocks.push({
        timestamp: "0:05",
        visualText: "A sleek graphic layout explaining the core takeaways.",
        audioHeader: "VOICEOVER (0:05 - 0:12)",
        audioText: "This critical mistake holds you back if not avoided right away."
      });
    }

    // Outro row or addition of CTA
    if (script.cta) {
      const finalStart = 5 + beats.length * 7;
      const finalEnd = finalStart + 6;
      const startFormat = `0:${finalStart < 10 ? "0" + finalStart : finalStart}`;
      const endFormat = `0:${finalEnd < 10 ? "0" + finalEnd : finalEnd}`;
      blocks.push({
        timestamp: startFormat,
        visualText: "Clean outro screen with channel subscribe highlight and end-screen video suggestions.",
        audioHeader: `OUTRO (${startFormat} - ${endFormat})`,
        audioText: script.cta,
        pills: ["CTA", "End Screen"]
      });
    }

    return blocks;
  };

  const handleCopyFullScript = () => {
    if (!script) return;
    const blocks = getDisplayBlocks();
    const formatted = blocks.map(b => {
      return `[${b.timestamp}] VISUAL CUE:\n${b.visualText}\n\nAUDIO/DIALOGUE [${b.audioHeader}]:\n"${b.audioText}"\n--------------------`;
    }).join("\n\n");

    navigator.clipboard.writeText(formatted);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportTextFile = () => {
    if (!script) return;
    const blocks = getDisplayBlocks();
    const formatted = `YOURT AI - SCRIPT GENERATOR BLUEPRINT\nTitle: ${title}\nDuration: ${duration}\nTone: ${tone}\n\n` + 
      blocks.map(b => {
        return `[${b.timestamp}] VISUAL CUE:\n${b.visualText}\n\nAUDIO/DIALOGUE [${b.audioHeader}]:\n"${b.audioText}"\n____________________`;
      }).join("\n\n");

    const element = document.createElement("a");
    const file = new Blob([formatted], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopySection = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionIdx(idx);
    setTimeout(() => setCopiedSectionIdx(null), 2000);
  };

  const displayBlocks = getDisplayBlocks();
  const saved = isAlreadySaved(title);

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      {/* 1. HEADER ZONE */}
      <div className="space-y-2 pb-2">
        <h1 className="font-sans font-extrabold text-[#0D0D0D] text-4xl tracking-tight leading-none">
          Script Generator
        </h1>
        <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xl">
          Transform your ideas into high-retention, dual-column video scripts instantly.
        </p>
      </div>

      {/* 2. SPECIFICATION INPUT BOX CARD (Matches Screenshot perfectly) */}
      <div className="bg-[#FAF8F7] rounded-3xl p-6 md:p-8 border border-[#ff6b00]/10 shadow-sm space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 tracking-wider block uppercase font-sans">
              Video Topic or Idea
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 5 unknown features of the new iPhone 15 Pro..."
              className="w-full bg-white border border-[#ff6b00]/15 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 rounded-2xl px-4 py-4 text-sm text-[#0D0D0D] font-medium font-sans shadow-sm transition-all outline-none"
              id="inp-script-title"
            />
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Target Duration Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 tracking-wider block uppercase font-sans">
                  Target Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white text-gray-700 font-sans text-sm font-medium border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 px-4 py-3 rounded-xl transition-all cursor-pointer outline-none"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone & Style Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 tracking-wider block uppercase font-sans">
                  Tone & Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white text-gray-700 font-sans text-sm font-medium border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 px-4 py-3 rounded-xl transition-all cursor-pointer outline-none"
                >
                  {toneOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Script Button */}
            <button
              type="submit"
              disabled={loading || credits < 50}
              className="bg-[#ff6b00] hover:bg-[#e05e00] disabled:bg-gray-300 text-white font-sans font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#ff6b00]/10 h-[46px] md:self-end"
              id="btn-trigger-script-creation"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Generate Script
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Credits Warning if limited */}
      {credits < 50 && (
        <div className="text-center p-3 bg-[#ff6b00]/5 text-[#ff6b00] border border-[#ff6b00]/15 rounded-xl text-xs font-semibold">
          ⚠️ Insufficient credits (50 credits required). Current balance: {credits} credits.
        </div>
      )}

      {/* 3. METRICS & ACTIONS RECTANGLE PANEL (Matches Screenshot perfectly) */}
      {script && (
        <div className="bg-[#FAF8F7]/40 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Leftside indicators */}
          <div className="flex items-center gap-4">
            {/* Viral Score Badge with red flame gradient */}
            <div className="bg-[#0D0D0D] text-white font-sans text-[11px] font-extrabold py-2 px-3.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="text-[#ff4d40]">🔥</span>
              <span>Viral Score: 92/100</span>
            </div>

            <span className="text-gray-400 font-sans text-xs font-semibold">
              Est. 58s
            </span>
          </div>

          {/* Rightside quick actions */}
          <div className="flex items-center gap-2">
            {/* Save */}
            <button
              onClick={handleSaveScript}
              disabled={saved}
              className={`px-4 py-2 bg-white border rounded-xl text-xs font-extrabold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                saved 
                  ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" 
                  : "border-gray-200 hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 text-gray-700 hover:text-[#ff6b00]"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[#ff6b00] text-[#ff6b00]" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyFullScript}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold font-sans text-gray-700 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  Copy
                </>
              )}
            </button>

            {/* Export */}
            <button
              onClick={handleExportTextFile}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold font-sans text-gray-700 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-gray-500" />
              Export
            </button>
          </div>
        </div>
      )}

      {/* 4. DUAL-COLUMN SCREENPLAY GRID */}
      {errorMsg && (
        <div className="p-4 bg-orange-50 border border-orange-200 text-[#ff6b00] rounded-xl text-xs font-sans">
          <p className="font-bold">Notice</p>
          <p className="mt-1 font-medium">{errorMsg}</p>
        </div>
      )}

      {script ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {/* LEFT COLUMN: Visual Cues & B-Roll */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <h2 className="font-sans font-extrabold text-[#0D0D0D] text-lg">
                  Visual Cues & B-Roll
                </h2>
              </div>
            </div>

            {/* Visual list items */}
            <div className="space-y-5">
              {displayBlocks.map((block, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative space-y-3 hover:shadow-md transition-shadow group"
                >
                  {/* Timestamp handle on left */}
                  <div className="flex items-center justify-between">
                    <span className="bg-gray-100/80 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-lg font-mono">
                      ⏱️ {block.timestamp}
                    </span>

                    {/* Quick copy of Visual segment */}
                    <button
                      onClick={() => handleCopySection(block.visualText, idx)}
                      className="p-1 hover:bg-gray-100 text-gray-400 hover:text-black rounded transition-colors"
                      title="Copy Visual Instructions"
                    >
                      {copiedSectionIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Cue Narrative Text */}
                  <p className="text-gray-600 font-sans text-[13px] leading-relaxed">
                    {block.visualText}
                  </p>

                  {/* Pills */}
                  {block.pills && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {block.pills.map((p, pIdx) => (
                        <span 
                          key={pIdx}
                          className="bg-[#fff2e8] text-[#ff6b00] border border-[#ff6b00]/5 text-[10px] font-bold px-2 rounded-md font-sans"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Audio & Dialogue */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎤</span>
                <h2 className="font-sans font-extrabold text-[#0D0D0D] text-lg">
                  Audio & Dialogue
                </h2>
              </div>

              {/* Edit script marker link */}
              <button 
                onClick={handleCopyFullScript}
                className="text-[11px] font-bold text-[#ff6b00] hover:underline"
              >
                Copy Complete Dialogue
              </button>
            </div>

            {/* Audio list items */}
            <div className="space-y-5">
              {displayBlocks.map((block, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-5 border border-gray-100/70 shadow-sm space-y-3.5 hover:shadow-md transition-shadow relative"
                >
                  <div className="border-l-2 border-[#ff6b00] pl-3.5 space-y-1">
                    <span className="text-[#ff6b00] font-sans text-xs font-extrabold tracking-wide uppercase">
                      {block.audioHeader}
                    </span>
                    <p className="text-[#0D0D0D] font-sans text-[14px] font-medium leading-relaxed pt-1 select-all">
                      {block.audioText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 space-y-3 bg-[#fbf9f9]">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <ScrollText className="w-6 h-6 stroke-1" />
          </div>
          <p className="text-sm font-medium text-gray-500">Narrative timeline layout is empty.</p>
          <p className="text-xs max-w-xs mx-auto">Input your video topic parameters or select options above, and click "Generate Script" to instantly populate the storyboard.</p>
        </div>
      )}
    </div>
  );
}
