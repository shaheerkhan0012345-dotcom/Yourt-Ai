import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Play, 
  Clock, 
  FileText,
  AlertCircle,
  Video,
  CalendarDays,
  Info,
  CheckCircle2,
  ListFilter,
  Calendar as LucideCalendar
} from "lucide-react";
import { CalendarEvent } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarView({ events, onAddEvent, onDeleteEvent }: CalendarViewProps) {
  // Setup dynamic year & month starting at today (which is June 2026 based on mock system context, but let's default dynamically relative to high-fidelity experience)
  const todayDate = new Date("2026-06-23"); // Anchor on June 2026 to coordinate perfectly with mock seed datas
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth()); // 0-indexed: May is 4, June is 5, etc.

  // Calendar event scheduler fields
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState<"idea" | "script" | "thumbnail" | "custom">("custom");
  const [newEventDate, setNewEventDate] = useState("2026-06-23");
  const [newEventTime, setNewEventTime] = useState("14:00");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<"all" | "idea" | "script" | "thumbnail" | "custom">("all");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Dynamically generated seed events relative to active dynamic month we look at,
  // making the calendar appear pristine and full of high-quality items on whatever month is active!
  const getFormattedMonthPart = String(currentMonth + 1).padStart(2, '0');
  const getDynamicDefaultEvents = () => {
    return [
      {
        id: "def-1",
        date: `${currentYear}-${getFormattedMonthPart}-01`,
        time: "10:30 AM",
        title: "AI Trends for 25/26",
        type: "published" as const,
        tag: "Tech",
        thumbnail: "🔥"
      },
      {
        id: "def-2",
        date: `${currentYear}-${getFormattedMonthPart}-12`,
        time: "2:00 PM",
        title: "Prompt Engineering Guide",
        type: "scheduled" as const,
        tag: "Dev",
        thumbnail: "⚡"
      },
      {
        id: "def-3",
        date: `${currentYear}-${getFormattedMonthPart}-23`,
        time: "Requires Edit",
        title: "Creator Suite Mastery",
        type: "draft" as const,
        tag: "Vlog",
        thumbnail: "🎬"
      }
    ];
  };

  // Convert active user items + seed items into homogeneous structure
  const mergedEvents = [
    ...getDynamicDefaultEvents(),
    ...events.map(e => ({
      id: e.id,
      date: e.date,
      time: "12:00 PM",
      title: e.title,
      type: e.type === "thumbnail" ? ("scheduled" as const) : e.type === "idea" ? ("draft" as const) : ("published" as const),
      tag: e.type.toUpperCase(),
      thumbnail: e.type === "thumbnail" ? "🖼️" : e.type === "script" ? "📝" : e.type === "idea" ? "💡" : "🔧"
    }))
  ];

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Mathematical Calendar Grid Builder
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateDynamicGrid = () => {
    const grid = [];
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    
    // Previous Month padding trailing days
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevTotalDays = getDaysInMonth(prevYear, prevMonthIdx);
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      const formattedMonth = String(prevMonthIdx + 1).padStart(2, '0');
      const formattedDay = String(dayNum).padStart(2, '0');
      grid.push({
        dayNum,
        isCurrentMonth: false,
        dateStr: `${prevYear}-${formattedMonth}-${formattedDay}`
      });
    }
    
    // Current Month days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const formattedMonth = String(currentMonth + 1).padStart(2, '0');
      const formattedDay = String(dayNum).padStart(2, '0');
      grid.push({
        dayNum,
        isCurrentMonth: true,
        dateStr: `${currentYear}-${formattedMonth}-${formattedDay}`
      });
    }
    
    // Next Month padding leading days to make standard 42-cell calendar grid
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const paddingNeeded = 42 - grid.length;
    
    for (let dayNum = 1; dayNum <= paddingNeeded; dayNum++) {
      const formattedMonth = String(nextMonthIdx + 1).padStart(2, '0');
      const formattedDay = String(dayNum).padStart(2, '0');
      grid.push({
        dayNum,
        isCurrentMonth: false,
        dateStr: `${nextYear}-${formattedMonth}-${formattedDay}`
      });
    }
    
    return grid;
  };

  const calendarGrid = generateDynamicGrid();

  const getEventsForDate = (date: string) => {
    return mergedEvents.filter((e) => {
      // Apply Date match
      const dateMatches = e.date === date;
      if (!dateMatches) return false;

      // Apply Filter translation
      if (activeFilter === "all") return true;
      if (activeFilter === "thumbnail" && (e.tag === "THUMBNAIL" || e.type === "scheduled")) return true;
      if (activeFilter === "script" && (e.tag === "SCRIPT" || e.tag === "Vlog")) return true;
      if (activeFilter === "idea" && (e.tag === "IDEA" || e.type === "draft")) return true;
      if (activeFilter === "custom" && (e.tag === "CUSTOM" || e.type === "published")) return true;

      return false;
    });
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    onAddEvent({
      date: newEventDate,
      title: newEventTitle,
      type: newEventType,
      description: `Scheduled slot at ${newEventTime}`
    });

    setNewEventTitle("");
    setShowAddForm(false);
  };

  // Clicking an interactive day cell lets the creator select it instantly for adding slot
  const handleCellClick = (dateStr: string) => {
    setNewEventDate(dateStr);
    setShowAddForm(true);
  };

  // Statistics summaries based on active month content pipeline
  const activeMonthEvents = mergedEvents.filter(e => e.date.startsWith(`${currentYear}-${getFormattedMonthPart}`));
  const publishedCount = activeMonthEvents.filter(e => e.type === "published").length;
  const scheduledCount = activeMonthEvents.filter(e => e.type === "scheduled").length;
  const draftCount = activeMonthEvents.filter(e => e.type === "draft").length;

  return (
    <div className="space-y-6 animate-fade-in text-[#0d0d0d]" id="calendar-view-container">
      
      {/* Header with dynamic month navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-semibold text-2xl tracking-tight text-[#0d0d0d]">
              {monthNames[currentMonth]} {currentYear}
            </h1>
            
            {/* Month Toggles */}
            <div className="flex items-center bg-[#FAF9F9] border border-gray-200/60 rounded-xl p-0.5 ml-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white text-gray-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(todayDate.getFullYear());
                  setCurrentMonth(todayDate.getMonth());
                }}
                className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold text-gray-500 hover:text-black hover:bg-white rounded-lg transition-all"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white text-gray-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 font-sans mt-1.5">
            Manage your content calendar workflow. Click on any date box to schedule video production slots.
          </p>
        </div>

        {/* Filters and Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filter toggle */}
          <div className="flex items-center gap-1 bg-[#FAF9F9] border border-gray-100 rounded-xl p-1 text-xs font-semibold text-gray-505 shadow-sm">
            <span className="px-2 text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5" />
              Show:
            </span>
            {(["all", "idea", "script", "thumbnail"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer text-[11px] ${activeFilter === type ? "bg-[#ff6b00] text-white font-bold" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Schedule button */}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Schedule New
          </button>
        </div>
      </div>

      {/* Dynamic Pop-up Form with Slide Down Animations */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="bg-white p-5 border border-orange-100 bg-gradient-to-br from-white to-[#FFFDFB] rounded-2xl shadow-lg max-w-xl mx-auto overflow-hidden text-gray-850"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-sm text-[#0d0d0d] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]/10" />
                Schedule Creators Pipeline Slot
              </h3>
              <span className="text-[10px] font-mono bg-[#FFF2EB] text-[#FF6B00] px-2.5 py-0.5 rounded font-extrabold uppercase">
                Ready to link
              </span>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block">Target Production Date</span>
                  <input 
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-2.5 rounded-xl font-mono text-gray-850"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block">Event Asset Type</span>
                  <select 
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-2.5 rounded-xl font-sans text-gray-800"
                  >
                    <option value="idea">Video Idea Context</option>
                    <option value="script">Narrative Script Beat</option>
                    <option value="thumbnail">YouTube Thumbnail Layout</option>
                    <option value="custom">General Task Slot</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block">Production Time</span>
                  <input 
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-2.5 rounded-xl font-mono text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block">Topic / Title / Short Description</span>
                <input 
                  type="text"
                  placeholder="e.g. 5 CSS parameters that destroy websites, and how to rewrite them..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] p-3 rounded-xl font-sans text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-all cursor-pointer font-medium"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-black text-white hover:shadow rounded-xl transition-all cursor-pointer font-bold"
                >
                  Map to Grid
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid Calendar Panel */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2.5 text-center font-display font-medium text-[11px] text-gray-400 pb-3 border-b border-gray-100">
            {daysOfWeek.map((day) => (
              <span key={day} className="tracking-widest font-extrabold text-[10px]">{day}</span>
            ))}
          </div>

          {/* Calendar grid structure with frame and animations */}
          <div className="grid grid-cols-7 gap-2.5 pt-3">
            {calendarGrid.map((day, idx) => {
              const dayEvents = getEventsForDate(day.dateStr);
              const isToday = day.dateStr === "2026-06-23"; // Current date indicator
              
              return (
                <motion.div
                  key={`${day.dateStr}-${idx}`}
                  whileHover={{ y: -3, scale: 1.015, borderColor: "#ff6b00", boxShadow: "0 4px 15px -3px rgba(255,107,0,0.08), 0 4px 6px -4px rgba(255,107,0,0.08)" }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  onClick={() => handleCellClick(day.dateStr)}
                  className={`
                    min-h-[115px] p-2.5 border rounded-xl flex flex-col justify-between transition-all relative group cursor-pointer select-none
                    ${day.isCurrentMonth ? "border-gray-100 bg-white" : "border-gray-50 bg-[#FCFAFA]/40 opacity-40"}
                    ${isToday && day.isCurrentMonth ? "ring-2 ring-[#FF6B00] border-transparent" : ""}
                  `}
                >
                  {/* Plus hovering shortcut */}
                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-50 text-[#ff6b00] rounded-lg p-1 hover:bg-[#ff6b00] hover:text-white">
                    <Plus className="w-3 h-3" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[12px] font-bold font-sans ${day.isCurrentMonth ? "text-gray-800" : "text-gray-400"}`}>
                      {day.dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[8px] tracking-wider uppercase font-extrabold bg-[#FF6B00] text-white px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Render events inside cell */}
                  <div className="flex-1 flex flex-col justify-end mt-2 space-y-1.5">
                    {dayEvents.map((evt) => {
                      let badgeBg = "bg-gray-100 border-gray-200 text-gray-700";
                      let statusPillText = "DRAFT";

                      if (evt.type === "published") {
                        badgeBg = "bg-black text-white border-black";
                        statusPillText = "PUBLISHED";
                      } else if (evt.type === "scheduled") {
                        badgeBg = "bg-[#FFF2EB] text-[#FF6B00] border-[#FF6B00]/20";
                        statusPillText = "SCHEDULED";
                      } else if (evt.type === "draft") {
                        badgeBg = "bg-white border border-gray-200 text-gray-500 font-medium";
                        statusPillText = "DRAFT";
                      }

                      return (
                        <div 
                          key={evt.id} 
                          className={`p-2 rounded-lg border flex flex-col space-y-1 relative group text-left transition-all hover:bg-white`}
                          style={{ borderColor: evt.type === "scheduled" ? "rgba(255, 107, 0, 0.2)" : "#EAE9E9" }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs select-none">{(evt as any).thumbnail || "💡"}</span>
                            <span className="text-[10px] font-bold text-gray-800 truncate leading-tight block max-w-[80px]">
                              {evt.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5">
                            <span className="text-[8px] font-mono text-gray-400 font-medium block">
                              {evt.time}
                            </span>
                            <span className={`text-[7px] scale-90 origin-right font-black tracking-wider px-1 py-0.2 rounded uppercase ${badgeBg}`}>
                              {statusPillText}
                            </span>
                          </div>

                          {/* Specific Warning for Draft edit requirements */}
                          {(evt as any).tag === "Vlog" && (
                            <div className="text-[7.5px] font-bold text-[#FF453A] bg-red-50/70 px-1 py-0.2 rounded border border-red-100 mt-0.5 w-max">
                              Requires Edit
                            </div>
                          )}

                          {/* Delete capability if it is a user generated event */}
                          {!evt.id.startsWith("def-") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteEvent(evt.id);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="Delete Scheduled Slot"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center py-2 flex items-center justify-center gap-2 text-gray-400">
        <LucideCalendar className="w-3.5 h-3.5 text-gray-300" />
        <p className="text-[11px] font-medium tracking-wide">
          Complete creators timeline mapping system powered by local state synchronization.
        </p>
      </div>

      {/* Dynamic Activity Log breakdown based on Month dates values */}
      <div className="bg-[#FAF9F9] rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
          <h3 className="font-display font-bold text-xs text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            Content Pipeline Status Breakdowns ({monthNames[currentMonth]} {currentYear})
          </h3>
          <span className="text-[10px] text-gray-400 font-mono font-bold">
            Total Slotted Events: {activeMonthEvents.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
              <div>
                <p className="text-xs font-bold text-gray-800">Published Content</p>
                <p className="text-[10px] text-gray-400">{publishedCount} active releases mapped</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-55 px-1.5 py-0.5 rounded">
              Active Logs
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
              <div>
                <p className="text-xs font-bold text-gray-800">Scheduled Slots</p>
                <p className="text-[10px] text-gray-400">{scheduledCount} pending live pipeline slots</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#FF6B00] bg-[#FFF2EB] px-1.5 py-0.5 rounded">
              Pending
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div>
                <p className="text-xs font-bold text-gray-800">Draft Status Updates</p>
                <p className="text-[10px] text-gray-400">{draftCount} awaiting outline finalization</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
              {draftCount} Drafts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
