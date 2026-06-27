export interface LayoutStyle {
  bgTheme: string;
  textColor: string;
  accentColor: string;
  isRotated?: boolean;
}

export interface ThumbnailConcept {
  conceptId: string;
  conceptTitle: string;
  subtitle: string;
  textOverlay: string;
  ctrPotential: number;
  layoutStyle: LayoutStyle;
  backgroundImageUrl?: string; // custom preview url or asset preset
  searchKeywords?: string;
  backgroundImagePrompt?: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  conceptDescription: string;
  whyItWillWork: string;
  thumbnailSuggestion: string;
  potentialMetric: string;
}

export interface VideoHook {
  style: string;
  script: string;
  rationale: string;
  retentionPotential: string;
}

export interface ScriptBeat {
  subtitle: string;
  visualCue: string;
  talkingPoints: string;
}

export interface ScriptOutline {
  hook: string;
  intro: string;
  bodyBeats: ScriptBeat[];
  cta: string;
}

export interface VideoTitle {
  title: string;
  styleLabel: string;
  ctrLevel: string;
}

export interface HashtagSuggestion {
  tags: string[];
  hashtags: string[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: "idea" | "script" | "thumbnail" | "custom";
  description?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  productUpdates: boolean;
  securityAlerts: boolean;
  marketEmails: boolean;
  aiModel: string;
}

export interface SavedItem {
  id: string;
  savedAt: string;
  type: "thumbnail" | "idea" | "hook" | "script" | "title" | "hashtags";
  title: string; // Primary text showing in list
  data: any; // Raw JSON payload
}
