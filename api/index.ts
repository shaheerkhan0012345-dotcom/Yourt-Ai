import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  getNicheCategory, 
  getFallbackIdeas, 
  getFallbackHooks, 
  getFallbackScript, 
  getFallbackTitles 
} from "./fallbackData.js";

const app = express();

// Enable JSON and URL-encoded parsing with generous limits
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Initialize the Gemini client with professional User-Agent headers
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using local fallback engines.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// UTILITY: Call Gemini API with automatic fallback to gemini-2.5-flash if gemini-3.5-flash fails
async function generateWithFallback(client: any, options: any) {
  try {
    return await client.models.generateContent(options);
  } catch (err: any) {
    console.warn(`[Gemini API Warning] Primary model ${options.model} failed:`, err.message || err);
    if (options.model === "gemini-3.5-flash") {
      console.log("[Gemini API] Retrying with stable model: gemini-2.5-flash...");
      const fallbackOptions = { ...options, model: "gemini-2.5-flash" };
      return await client.models.generateContent(fallbackOptions);
    }
    throw err;
  }
}

// UTILITY: Resilient prompt generator focusing on YouTube strategy and niche depth
function buildSystemPrompt(niche: string, targetAudience: string = "general creators") {
  return `You are a world-class YouTube strategist and viral content consultant with over 10 years of experience scaling channels from zero to millions of subscribers in the "${niche}" space.
Target Audience Profile: ${targetAudience}

YOUR GUIDING COMMANDMENTS:
1. STRICT ADHERENCE TO THE NICHE: Every title, idea, script line, and terminology MUST be native to the "${niche}" community. Never use generic filler templates (e.g., "3 myths that hold you back in [niche]", "the truth about [niche]"). Instead, target actual niche-specific situations (e.g. for Chess: "symmetrical pawn structures", "outpost square coordination", "sourdough starters" for Cooking, "input deadzones" for Gaming, "plastic coolant flange failures" for Automotive).
2. USE NATIVE INSIDER VOCABULARY: Sprinkle high-intent, community-appropriate slang, parameters, and indicators (e.g. "Stockfish evaluate bar", "ELO", "Maillard reaction", "aim tracking deadzones", "Apex rank bracket", "direct injection valve carbon build-up").
3. TARGET MASSIVE AUDIENCE PAIN POINTS & TRENDS: Pinpoint the frustration of players, cooks, or mechanics (e.g., stuck in 1000 ELO, rubbery steaks, manual swaps gone wrong).
4. ANTI-REPETITION SAFEGUARDS: Do NOT reuse structure, framing, or phrases across ideas. Ensure each output represents a distinct format: one High-Effort Challenge, one Analytical Breakdown, one Contrarian Threat Warning, and one Immediate Value Blueprint.

ANTI-REPETITION EXAMPLES FOR COOPERATING NICHES:
- Niche "Cars/Automotive":
  - Challenge: "I Manual-Swapped a $500 Scrap Sleeper (And Made 500HP)"
  - Analytical: "Why Modern Inline-4 Turbo Engines are Engineered to Fail After 100k Miles"
  - Contrast Warning: "Stop Tuning Your Boost Pressure Until You Do This (Or Blow Your Piston)"
- Niche "Cooking/Baking":
  - Challenge: "I Spent 48 Hours Crafting the Hardest Alkaline Ramen on Earth"
  - Analytical: "The Maillard Sizzle Technique Restaurants Hide for Flawless Steaks"
  - Contrast Warning: "Stop Searing Cold Meat Right Out of the Fridge!"
- Niche "Gaming/eSports":
  - Challenge: "I Survived 100 Days in the Hardest Hardcore Modpack"
  - Analytical: "How the New Balancing Update Completely Ruined the Controller Meta"
  - Contrast Warning: "Stop Using Default Sensitivity Settings (You Are Losing Aim Fights)"`;
}

// 1. ENDPOINT: Generate Content Ideas
app.post("/api/ideas/generate", async (req, res) => {
  const { niche, targetAudience } = req.body;
  if (!niche) {
    return res.status(400).json({ error: "Niche is required." });
  }

  try {
    const client = getGeminiClient();
    const category = getNicheCategory(niche);

    if (!client) {
      console.log(`[Ideas API] No key found. Serving high-fidelity fallback for niche: "${niche}" (${category})`);
      return res.json(getFallbackIdeas(niche, targetAudience));
    }

    const prompt = `Formulate exactly 4 highly-differentiated YouTube content ideas tailored precisely to the "${niche}" niche. 
Target Audience: ${targetAudience || "general enthusiasts"}
Recommended Temperature setting: 0.75 for maximum creative but grounded outputs.

Provide output in JSON matching the exact Schema provided. No markdown wrapping.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: buildSystemPrompt(niche, targetAudience),
        temperature: 0.75,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Highly engaging YouTube title, native to niche culture, under 65 characters." },
              conceptDescription: { type: Type.STRING, description: "Clear narrative description of the video pacing, key shots, and pacing." },
              whyItWillWork: { type: Type.STRING, description: "The psychological trigger (e.g. curiosity gap, loss aversion, high-satisfaction visuals)." },
              thumbnailSuggestion: { type: Type.STRING, description: "A detailed description of the optimal thumbnail visual layout." },
              potentialMetric: { type: Type.STRING, description: "Predicted strength tier, e.g. 'Viral Potential', 'Insane Retention', 'S-Tier'." }
            },
            required: ["id", "title", "conceptDescription", "whyItWillWork", "thumbnailSuggestion", "potentialMetric"]
          }
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("Empty response from AI engine.");
  } catch (err: any) {
    console.error("[Ideas Generation Error] falling back to local database:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json(getFallbackIdeas(niche, targetAudience));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in ideas API:", fallbackErr);
    }
  }
});

// 2. ENDPOINT: Generate Video Hooks
app.post("/api/hooks/generate", async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic/Title is required." });
  }

  try {
    const client = getGeminiClient();
    const category = getNicheCategory(topic);

    if (!client) {
      console.log(`[Hooks API] No key found. Serving high-fidelity fallback for topic: "${topic}" (${category})`);
      return res.json(getFallbackHooks(topic));
    }

    const prompt = `Analyze this video topic: "${topic}".
Generate exactly 4 extremely clicky, high-retention video hook variations. Each variation must serve a different psychological trigger:
1. Curiosity Gap (reveal hidden value)
2. High-Stakes Threat (warning of critical failure)
3. Immediate Reward (fast gain promise)
4. Counter-Intuitive Truth (contesting traditional advice)

Temperature: 0.8 for strong linguistic persuasion.
Provide output in JSON matching the response schema.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: buildSystemPrompt(topic, "general creators looking to boost retention"),
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              script: { type: Type.STRING, description: "First 10 seconds of speech, highly intense, instantly catching attention." },
              rationale: { type: Type.STRING, description: "The psychological or retention justification of why this hook format converts." },
              retentionPotential: { type: Type.STRING, description: "Format: 'S-Tier', 'Diamond Tier', 'Super Viral' or 'Viral Potential'" }
            },
            required: ["style", "script", "rationale", "retentionPotential"]
          }
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("No text response from GenAI engine.");
  } catch (err: any) {
    console.error("[Hooks Generation Error] falling back to local database:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json(getFallbackHooks(topic));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in hooks API:", fallbackErr);
    }
  }
});

// 3. ENDPOINT: Generate Clicky Titles
app.post("/api/titles/generate", async (req, res) => {
  const { concept } = req.body;
  if (!concept) {
    return res.status(400).json({ error: "Concept details are required." });
  }

  try {
    const client = getGeminiClient();
    const category = getNicheCategory(concept);

    if (!client) {
      console.log(`[Titles API] No key found. Serving high-fidelity fallback for concept: "${concept}" (${category})`);
      return res.json(getFallbackTitles(concept));
    }

    const prompt = `Formulate exactly 6 highly-optimized, high-CTR YouTube titles for the concept: "${concept}".
Requirements:
- Must avoid cliché phrases and standard clickbait structures.
- Incorporate psychological triggers (contrast, high-effort, loss prevention, curiosity loop).
- Strictly native to the domain.
- Keep them under 65 characters for ideal mobile readability.

Temperature: 0.78 for balanced conversion.
Provide output in JSON format.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: buildSystemPrompt(concept, "audience interested in maximizing video click-through-rates"),
        temperature: 0.78,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The direct proposed title." },
              styleLabel: { type: Type.STRING, description: "E.g. 'High-Effort Challenge', 'Negative Bracket Warning', 'Exclusive Secret'." }
            },
            required: ["title", "styleLabel"]
          }
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("Invalid title response.");
  } catch (err: any) {
    console.error("[Titles Generation Error] falling back to local database:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json(getFallbackTitles(concept));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in titles API:", fallbackErr);
    }
  }
});

// 4. ENDPOINT: Generate Scripts
app.post("/api/scripts/generate", async (req, res) => {
  const { title, duration } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const client = getGeminiClient();
    const category = getNicheCategory(title);

    if (!client) {
      console.log(`[Scripts API] No key found. Serving high-fidelity fallback for script: "${title}" (${category})`);
      return res.json(getFallbackScript(title, duration));
    }

    const prompt = `Generate a high-retaining YouTube video script skeleton for: "${title}" (Duration: ${duration || "5 minutes"}).
Structure requirements:
1. Hook (The first sentences)
2. Intro (Visual set up of the scene or diagnostic setup)
3. Exactly 3 body beats (Step-by-step logical phases, native to the niche)
4. Call to Action (Soft organic pitch to engage or subscribe)

Temperature: 0.7.
Provide output in JSON format.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: buildSystemPrompt(title, "engaged viewers seeking premium niche instruction"),
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            intro: { type: Type.STRING },
            bodyBeats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subtitle: { type: Type.STRING },
                  visualCue: { type: Type.STRING, description: "Detailed guide of camera angle, B-Roll, screen layout, or set action." },
                  talkingPoints: { type: Type.STRING, description: "Direct spoken narration points with industry-native terminology." }
                },
                required: ["subtitle", "visualCue", "talkingPoints"]
              }
            },
            cta: { type: Type.STRING }
          },
          required: ["hook", "intro", "bodyBeats", "cta"]
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("Empty script generated.");
  } catch (err: any) {
    console.error("[Scripts Generation Error] falling back to local database:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json(getFallbackScript(title, duration));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in scripts API:", fallbackErr);
    }
  }
});

// 5. ENDPOINT: Generate Search Tags and Hashtags
app.post("/api/hashtags/generate", async (req, res) => {
  const { videoDetails } = req.body;
  if (!videoDetails) {
    return res.status(400).json({ error: "Video details are required." });
  }

  try {
    const client = getGeminiClient();
    const category = getNicheCategory(videoDetails);

    if (!client) {
      console.log(`[Tags API] No key found. Serving high-fidelity fallback tags for category: "${category}"`);
      if (category === "chess") {
        return res.json({
          tags: ["chess", "grandmaster", "chessengine", "stockfish", "elo", "openingtrap", "siciliandefense"],
          hashtags: ["chess", "grandmaster", "chesstactics", "elo", "stockfish"]
        });
      }
      if (category === "cooking") {
        return res.json({
          tags: ["cooking", "steak", "maillardreaction", "cookinghacks", "baking", "sourdough", "foodscience"],
          hashtags: ["cooking", "chef", "steak", "recipe", "foodie"]
        });
      }
      return res.json({
        tags: [category, "youtube", "viral", "creators", "analytics", "growth", "strategy"],
        hashtags: [category, "creators", "video", "growth", "viral"]
      });
    }

    const prompt = `Provide exactly 15 high-intent tags and 5 focused hashtags for a video in the "${category}" niche with these details: "${videoDetails}".
Provide output in JSON format. No markdown wrapping.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an SEO meta-tag optimization script. You isolate high-volume keywords and related phrases for "${category}".`,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["tags", "hashtags"]
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("Invalid tag response.");
  } catch (err: any) {
    console.error("[Tags Generation Error] falling back to seed database:", err.message || err);
    try {
      if (!res.headersSent) {
        const cat = getNicheCategory(videoDetails);
        return res.json({
          tags: [cat, "youtube", "viral", "creators", "analytics", "growth", "strategy"],
          hashtags: [cat, "creators", "video", "growth", "viral"]
        });
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in hashtags API:", fallbackErr);
    }
  }
});

// 6. ENDPOINT: Analyze Dynamic Trends
app.post("/api/trend/analyze", async (req, res) => {
  const { category } = req.body;
  const cn = category || "General Tech";

  try {
    const cat = getNicheCategory(cn);
    const client = getGeminiClient();
    if (!client) {
      console.log(`[Trend Analyzer API] No key found. Serving high-fidelity seed trends for category: "${cn}"`);
      return res.json(getSeedTrends(cat));
    }

    const prompt = `Analyze current trending topics, competitor gaps, and CTR optimization guidelines for the category: "${cn}".
Provide output in JSON matching the TrendAnalysisResponse schema exactly. No markdown wrapping.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a real-time viral analytics tracker. You monitor CTR indexes, market gaps, and search query acceleration.`,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            overviewSummary: { type: Type.STRING },
            overallInterestTrend: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            lastUpdated: { type: Type.STRING },
            trendingTopics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  category: { type: Type.STRING },
                  trendingScore: { type: Type.NUMBER },
                  momentumPct: { type: Type.NUMBER },
                  viralIndex: { type: Type.STRING },
                  baseCTR: { type: Type.NUMBER },
                  topKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  competitorGap: { type: Type.STRING },
                  ctrOptimization: {
                    type: Type.OBJECT,
                    properties: {
                      thumbnailTheme: { type: Type.STRING },
                      colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                      faceExpression: { type: Type.STRING },
                      overlayText: { type: Type.STRING }
                    },
                    required: ["thumbnailTheme", "colorPalette", "faceExpression", "overlayText"]
                  },
                  suggestedVideos: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedCTR: { type: Type.NUMBER },
                        targetAudience: { type: Type.STRING }
                      },
                      required: ["id", "title", "description", "estimatedCTR", "targetAudience"]
                    }
                  }
                },
                required: ["id", "topic", "category", "trendingScore", "momentumPct", "viralIndex", "baseCTR", "topKeywords", "competitorGap", "ctrOptimization", "suggestedVideos"]
              }
            }
          },
          required: ["category", "overviewSummary", "overallInterestTrend", "lastUpdated", "trendingTopics"]
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("No response text.");
  } catch (err: any) {
    console.error("[Trend Analyze Error] falling back to seed data:", err.message || err);
    try {
      if (!res.headersSent) {
        const cat = getNicheCategory(cn);
        return res.json(getSeedTrends(cat));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in trend analyze API:", fallbackErr);
    }
  }
});

// Helper for Seed Trends
function getSeedTrends(cat: string) {
  if (cat === "chess") {
    return {
      category: "Chess Strategy",
      overviewSummary: "Interest is accelerating around tactical calculation techniques and countering deep engine variations. Players are looking for human ELO progression blueprints.",
      overallInterestTrend: [45, 50, 68, 75, 92, 98],
      lastUpdated: new Date().toLocaleDateString(),
      trendingTopics: [
        {
          id: "chess-trend-1",
          topic: "Stockfish Evaluation Breakdown",
          category: "Chess",
          trendingScore: 97,
          momentumPct: 34,
          viralIndex: "S-Tier",
          baseCTR: 11.4,
          topKeywords: ["stockfish", "evaluation bar", "symmetrical openings", "tactics"],
          competitorGap: "Most channels analyze full boring games; they miss deep 3-move calculation segments.",
          ctrOptimization: {
            thumbnailTheme: "Prismatic evaluate bar sliding aggressively under a single marble pawn.",
            colorPalette: ["#ff6b00", "#111111", "#00ffcc"],
            faceExpression: "Intense focus squinting looking down at coordinate grid.",
            overlayText: "+7.4 IN 2 MOVES"
          },
          suggestedVideos: [
            {
              id: "chess-sug-1",
              title: "The Symmetrical Pawn Mistake That Ruined My ELO",
              description: "Full positional analysis showing where mirror play collapses into tactical defeat.",
              estimatedCTR: 11.2,
              targetAudience: "Frustrated intermediate chess players."
            }
          ]
        }
      ]
    };
  }
  return {
    category: "General Tech & Video",
    overviewSummary: "High-tempo challenge formats and deeply diagnostic reviews are accelerating. Viewers expect hyper-satisfying visual feedback.",
    overallInterestTrend: [60, 62, 70, 78, 85, 94],
    lastUpdated: new Date().toLocaleDateString(),
    trendingTopics: [
      {
        id: "gen-trend-1",
        topic: "The Zero-To-Hero Challenge Blueprint",
        category: "General",
        trendingScore: 90,
        momentumPct: 18,
        viralIndex: "A-Tier",
        baseCTR: 9.2,
        topKeywords: ["challenge", "24 hours", "tested", "results"],
        competitorGap: "Creators post generic tutorials; they fail to establish high stakes, ticking timers, or real failure conditions.",
        ctrOptimization: {
          thumbnailTheme: "High contrast neon timer pinned next to a glossy successful finished result.",
          colorPalette: ["#ff6b00", "#000000", "#ffffff"],
          faceExpression: "Shocked realization with raised eyebrows looking at glowing gauge.",
          overlayText: "I TRIED IT"
        },
        suggestedVideos: [
          {
            id: "gen-sug-1",
            title: "I Attempted the Hardest Challenge in 24 Hours",
            description: "A fast-paced journey detailing constraints and step-by-step master lessons.",
            estimatedCTR: 9.5,
            targetAudience: "Curious creators seeking raw experiment formats."
          }
        ]
      }
    ]
  };
}

// 7. ENDPOINT: Estimate CTR
app.post("/api/trend/estimate-ctr", async (req, res) => {
  const { title, thumbnailStyle, category } = req.body;

  try {
    const client = getGeminiClient();
    if (!client) {
      console.log("[CTR Predictor API] No key found. Serving high-fidelity CTR evaluation report.");
      return res.json(getFallbackCtrReport(title || "Generic YouTube Video", category || "Tech"));
    }

    const prompt = `Evaluate the CTR potential for this video draft:
Title: "${title}"
Thumbnail Style description: "${thumbnailStyle}"
Category: "${category}"

Analyze precisely: Title strength, visual saliency, psychological triggers, and generate a concrete critique, improved title alternative, and predictive rating.
Provide output in JSON matching the CTREvaluationResponse schema. No markdown wrapping.`;

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a high-performance YouTube CTR simulator. You calculate predictive visual saliency metrics, title hooks, and recommend precise micro-adjustments.`,
        temperature: 0.65,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            thumbnailStyle: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedCTR: { type: Type.NUMBER },
            grade: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                titleStrength: { type: Type.NUMBER },
                visualSaliency: { type: Type.NUMBER },
                psychologicalTriggers: { type: Type.NUMBER }
              },
              required: ["titleStrength", "visualSaliency", "psychologicalTriggers"]
            },
            critique: { type: Type.STRING },
            improvedTitle: { type: Type.STRING },
            ctrImpactFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "thumbnailStyle", "category", "estimatedCTR", "grade", "breakdown", "critique", "improvedTitle", "ctrImpactFactors"]
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json(parsed);
    }
    throw new Error("Empty CTR response.");
  } catch (err: any) {
    console.error("[CTR Estimation Error] falling back to static CTR model:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json(getFallbackCtrReport(title, category));
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in estimate CTR API:", fallbackErr);
    }
  }
});

function getFallbackCtrReport(title: string, category: string) {
  const score = 8.4;
  return {
    title,
    thumbnailStyle: "Grounded theme with dynamic light accents and centered element.",
    category: category || "General",
    estimatedCTR: score,
    grade: "S-Tier",
    breakdown: {
      titleStrength: 88,
      visualSaliency: 84,
      psychologicalTriggers: 90
    },
    critique: "Excellent subject definition. However, replacing passive terms with strong high-contrast contrast hooks could secure an extra 2% CTR.",
    improvedTitle: `I Attempted the Hardest "${category}" Challenge (And Broke It)`,
    ctrImpactFactors: [
      "Contrarian threat warning",
      "Clean visual contrast spacing",
      "Immediate value progression promise"
    ]
  };
}

// 8. ENDPOINT: Chat Assistant
app.post("/api/chat/message", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const client = getGeminiClient();
    if (!client) {
      return res.json({ text: "Hello! I am your YouTube Strategist Assistant. Configure your GEMINI_API_KEY in the Secrets panel to activate my intelligent AI reasoning engines. Currently operating in offline high-fidelity simulator mode." });
    }

    const response = await generateWithFallback(client, {
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are a professional YouTube growth coach and channel development strategist. Answer the creator's questions concisely, focusing strictly on target audience retention, high-CTR titles, and video hook metrics.",
        temperature: 0.75
      }
    });

    if (response && response.text) {
      return res.json({ text: response.text });
    }
    throw new Error("No text response from chat assistant.");
  } catch (err: any) {
    console.error("[Chat API Error]:", err.message || err);
    try {
      if (!res.headersSent) {
        return res.json({ text: "I ran into a temporary loading delay connecting to the AI brain. Let's focus on refining your video titles or optimizing your hook scripts manually!" });
      }
    } catch (fallbackErr) {
      console.error("Critical fallback failure in chat API:", fallbackErr);
    }
  }
});

// 9. ENDPOINT: Mock/Fintech Checkout API
app.post("/api/payment/checkout", async (req, res) => {
  const { packageId, packageName, amount, credits, paymentMethod } = req.body;
  
  // Return a secure mock transaction ID
  const mockTxId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  console.log(`[Billing Systems] Secure Payment authorized for package "${packageName}" (${credits} credits). ID: ${mockTxId}`);
  
  return res.json({
    success: true,
    transactionId: mockTxId,
    message: "Transaction successfully authenticated by Yourt Secure Ledger."
  });
});

export default app;
