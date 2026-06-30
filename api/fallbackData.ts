export function getNicheCategory(input: string): string {
  const clean = (input || "").toLowerCase();
  if (clean.includes("chess")) return "chess";
  if (
    clean.includes("game") ||
    clean.includes("gaming") ||
    clean.includes("roblox") ||
    clean.includes("minecraft") ||
    clean.includes("valorant") ||
    clean.includes("fortnite") ||
    clean.includes("gta") ||
    clean.includes("esports") ||
    clean.includes("elden")
  ) {
    return "gaming";
  }
  if (
    clean.includes("car") ||
    clean.includes("supercar") ||
    clean.includes("auto") ||
    clean.includes("vehicle") ||
    clean.includes("motorcycle") ||
    clean.includes("restoration") ||
    clean.includes("engine")
  ) {
    return "automotive";
  }
  if (
    clean.includes("cook") ||
    clean.includes("bake") ||
    clean.includes("food") ||
    clean.includes("recipe") ||
    clean.includes("coffee") ||
    clean.includes("street food") ||
    clean.includes("kitchen") ||
    clean.includes("sourdough") ||
    clean.includes("baking") ||
    clean.includes("nutrition") ||
    clean.includes("steak")
  ) {
    return "cooking";
  }
  if (
    clean.includes("finance") ||
    clean.includes("invest") ||
    clean.includes("crypto") ||
    clean.includes("stock") ||
    clean.includes("business") ||
    clean.includes("money") ||
    clean.includes("freelance") ||
    clean.includes("marketing") ||
    clean.includes("entrepreneur") ||
    clean.includes("startups") ||
    clean.includes("hustle")
  ) {
    return "finance";
  }
  if (
    clean.includes("fit") ||
    clean.includes("bodybuilding") ||
    clean.includes("weight") ||
    clean.includes("yoga") ||
    clean.includes("run") ||
    clean.includes("sport") ||
    clean.includes("football") ||
    clean.includes("cricket") ||
    clean.includes("basketball") ||
    clean.includes("tennis") ||
    clean.includes("martial arts") ||
    clean.includes("gym")
  ) {
    return "fitness";
  }
  if (
    clean.includes("program") ||
    clean.includes("code") ||
    clean.includes("coding") ||
    clean.includes("developer") ||
    clean.includes("web dev") ||
    clean.includes("software") ||
    clean.includes("cybersecurity") ||
    clean.includes("hack") ||
    clean.includes("react") ||
    clean.includes("typescript")
  ) {
    return "programming";
  }
  if (
    clean.includes("tech") ||
    clean.includes("ai") ||
    clean.includes("artificial intelligence") ||
    clean.includes("gadget")
  ) {
    return "tech";
  }
  if (
    clean.includes("travel") ||
    clean.includes("vlog") ||
    clean.includes("trip") ||
    clean.includes("luxury travel") ||
    clean.includes("budget travel") ||
    clean.includes("van life") ||
    clean.includes("camping") ||
    clean.includes("hiking")
  ) {
    return "travel";
  }
  if (
    clean.includes("diy") ||
    clean.includes("craft") ||
    clean.includes("sewing") ||
    clean.includes("handmade") ||
    clean.includes("woodworking") ||
    clean.includes("leather")
  ) {
    return "diy";
  }
  if (
    clean.includes("design") ||
    clean.includes("graphic") ||
    clean.includes("ui") ||
    clean.includes("ux") ||
    clean.includes("photography") ||
    clean.includes("video") ||
    clean.includes("animation") ||
    clean.includes("vfx") ||
    clean.includes("art")
  ) {
    return "design";
  }
  if (
    clean.includes("music") ||
    clean.includes("singing") ||
    clean.includes("song") ||
    clean.includes("guitar") ||
    clean.includes("instrument")
  ) {
    return "music";
  }
  if (
    clean.includes("improvement") ||
    clean.includes("motivat") ||
    clean.includes("productivity") ||
    clean.includes("meditat") ||
    clean.includes("minimalism") ||
    clean.includes("skincare") ||
    clean.includes("lifestyle") ||
    clean.includes("book") ||
    clean.includes("habits") ||
    clean.includes("focus")
  ) {
    return "self_improvement";
  }
  if (
    clean.includes("educat") ||
    clean.includes("science") ||
    clean.includes("histor") ||
    clean.includes("geograph") ||
    clean.includes("space") ||
    clean.includes("psycholog") ||
    clean.includes("philosoph") ||
    clean.includes("math") ||
    clean.includes("physics")
  ) {
    return "education";
  }
  if (clean.includes("asmr")) return "asmr";
  return "general";
}

export function getFallbackIdeas(niche: string, targetAudience: string) {
  const cn = niche || "General Niche";
  const cat = getNicheCategory(cn);

  if (cat === "chess") {
    return [
      {
        id: "chess-idea-1",
        title: "I Played the 'Unbeatable' Chess Engine until It Broke",
        conceptDescription: "Testing highly aggressive tactical variations against Stockfish, showcasing specific board transitions and pawn structure breakdowns.",
        whyItWillWork: "Taps into competitive chess player curiosity and engine-beating lore.",
        thumbnailSuggestion: "A split screen showing a wooden chess set with a glowing evaluation bar (+4.5) and a binary computer terminal code background.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "chess-idea-2",
        title: "Why 99% of Beginners Ruin Symmetrical Openings",
        conceptDescription: "Analyzing positional errors in low-to-mid ELO games, showing step-by-step how to punish mirror play instantly.",
        whyItWillWork: "Targets a direct pain point of players stuck in the 1000 ELO plateau.",
        thumbnailSuggestion: "A high-contrast shot of a queen capturing a rook with a large red warning arrow overlay.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "chess-idea-3",
        title: "Can You Solve the Hardest Position Ever Created?",
        conceptDescription: "Deep calculation walkthrough of an infamous mate-in-8 puzzle that baffled grandmasters, with interactive pause cycles.",
        whyItWillWork: "High-level curiosity loop that forces viewers to pause and think.",
        thumbnailSuggestion: "Close-up of a lone king cornered by three pawns, with golden glowing coordinate lines framing the board.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "chess-idea-4",
        title: "The Step-by-Step ELO Blueprint You Actually Need",
        conceptDescription: "A clear structured masterclass focusing on middle-game tactical calculation and basic endgames instead of long openings.",
        whyItWillWork: "Empathetic, structured roadmap that provides instant actionable value.",
        thumbnailSuggestion: "Minimalist neon ELO meter climbing from 800 to 1800 next to a pristine marble pawn.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "gaming") {
    return [
      {
        id: "gaming-idea-1",
        title: "I Survived 100 Days in the Hardest Hardcore Modpack",
        conceptDescription: "An epic, high-stakes narrative challenge featuring frame-perfect mechanics, custom base builds, and gear paths.",
        whyItWillWork: "Extreme challenge format with high storytelling retention.",
        thumbnailSuggestion: "A colossal dark-themed boss beast towering over a player in full iron armor. A Day 100 counter ticking down.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "gaming-idea-2",
        title: "Why the New Update Completely Ruined the Meta",
        conceptDescription: "Analyzing patch notes, balance nerfs, and dynamic weapon stats to reveal why top choices are obsolete.",
        whyItWillWork: "Capitalizes on immediate community trends and patch anger.",
        thumbnailSuggestion: "A split visual: a popular weapon under a huge red 'NERFED' stamp and a secret tier item.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "gaming-idea-3",
        title: "The Frame-Perfect Glitch Speedrunners Kept Secret for Years",
        conceptDescription: "Unpacking the technical mechanics behind a physics clipping skip that broke speedrun history.",
        whyItWillWork: "Appeals to deep nerd curiosity and technical glitch exploration.",
        thumbnailSuggestion: "A game avatar passing through a solid stone gate with glowing coordinate vectors and a timer.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "gaming-idea-4",
        title: "3 Mistakes Keeping You Stuck in Competitive Elo Hell",
        conceptDescription: "An analytical critique of crosshair tracking, team communication, and utility utilization.",
        whyItWillWork: "Provides direct, action-oriented assistance for frustrated ranking players.",
        thumbnailSuggestion: "Rank badge transitioning from a rusty bronze bracket to a gleaming diamond crown with light streaks.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "automotive") {
    return [
      {
        id: "auto-idea-1",
        title: "I Manual-Swapped a $500 Scrap Sleeper (And Made 500HP)",
        conceptDescription: "Rescuing a vintage estate wagon, executing an emergency manual swap, and dyno-tuning it under pressure.",
        whyItWillWork: "Ultimate enthusiast dream format combined with raw mechanics and test dyno tension.",
        thumbnailSuggestion: "Glowing hot exhaust manifold inside a grease-stained engine bay with a digital dyno read overlay.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "auto-idea-2",
        title: "Why Modern Engines are Engineered to Fail After 100k Miles",
        conceptDescription: "Exposing mechanical plastic failures, carbon buildup, and direct injection flaws with full block tear-downs.",
        whyItWillWork: "Fear-based authority guide protecting car owners from high maintenance bills.",
        thumbnailSuggestion: "A piston showing clean wear comparison side-by-side with carbon-crusted valves and an engine warning light.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "auto-idea-3",
        title: "Restoring a Barn-Find Supercar After 30 Years of Dust",
        conceptDescription: "A highly satisfying aesthetic journey of dry-ice blasting, deep cleaning, and starting a classic V12 engine.",
        whyItWillWork: "Extremely visual, highly satisfying therapeutic cleanup dynamics.",
        thumbnailSuggestion: "Dramatic split shot: half-dusty Barn Find paint and half-glossy deep red lacquer finish reflecting neon lights.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "auto-idea-4",
        title: "I Tested the Cheapest eBay Turbo on a Dyno (Explosion?)",
        conceptDescription: "Bolting an unbranded turbocharger to our drift build and running extreme boost levels to find the limit.",
        whyItWillWork: "High risk, scientific curiosity, and dramatic visual tension.",
        thumbnailSuggestion: "A metal charger spinning with sparks flying on a dynamometer, boost meter pinned in the red zone.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "cooking") {
    return [
      {
        id: "cook-idea-1",
        title: "My 100-Year-Old Heirloom Starter Made the Best Bread of My Life",
        conceptDescription: "Benchmarking historical sourdough cultures against industrial yeasts, analyzing crumb structures and lactic acidity.",
        whyItWillWork: "Brings culinary history and baking science together with satisfying macro visual hooks.",
        thumbnailSuggestion: "Macro extreme close-up of a blistered sourdough boule sliced in half, revealing perfect airy crumb pockets with rising steam.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "cook-idea-2",
        title: "I Spent 48 Hours Crafting the Hardest Ramen on Earth",
        conceptDescription: "Boiling dense pork broth for days, hand-pulling alkaline noodles, and curing perfect jammy eggs.",
        whyItWillWork: "Appeals to high-effort foodie challenges and extreme sensory cravings.",
        thumbnailSuggestion: "A glowing steaming bowl of Tonkotsu ramen with shimmering oil droplets, sliced chashu, and a cut golden egg yolk.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "cook-idea-3",
        title: "The Chemical Technique Restaurants Use for Perfect Sauces",
        conceptDescription: "A lesson in deglazing, pan fond emulsification, and mounting cold butter to elevate everyday skillet meals.",
        whyItWillWork: "Provides immediate, professional culinary authority hacks for home cooks.",
        thumbnailSuggestion: "A professional stainless steel pan tilted back, exposing a glossy, velvety sauce dripping off a wooden spoon.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "cook-idea-4",
        title: "Stop Cooking Steak Like This (3 Mistakes You Make)",
        conceptDescription: "Explaining moisture loss, thermal bands, and dry-brining timing for achieving a flawless crust.",
        whyItWillWork: "Corrects massive common cooking anxieties with simple chemical science.",
        thumbnailSuggestion: "Perfect edge-to-edge pink ribeye steak being carved on a wooden cutting board with a side-by-side 'gray band' warning comparison.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "finance") {
    return [
      {
        id: "finance-idea-1",
        title: "I Spent $10,000 Testing 5 Passive Income Streams (Honest ROI)",
        conceptDescription: "Deploying active capital into micro-SaaS, newsletters, print-on-demand, and index strategies to reveal real net profits.",
        whyItWillWork: "Direct value honesty in a market saturated with generic guru tutorials.",
        thumbnailSuggestion: "Stark split comparison panel: 'Capital Invested: $10,000' next to an authentic Stripe revenue dashboard.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "finance-idea-2",
        title: "The Stock Market Cycle Nobody Is Preparing For",
        conceptDescription: "A data-driven historical analysis of quantitative tightening, bond yield curves, and defensive hedging.",
        whyItWillWork: "Provides high-reassurance financial authority during volatile economic times.",
        thumbnailSuggestion: "A clean minimalist trend line experiencing a sudden steep decline, shifting into a glowing hedge asset arrow.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "finance-idea-3",
        title: "How I Scaled a Simple Micro-SaaS to $15k/MRR in 90 Days",
        conceptDescription: "Open-source strategy detailing product discovery, headless integrations, and cold programmatic outreach.",
        whyItWillWork: "Ultra-valuable builder blueprint showing real, non-theoretics tech execution.",
        thumbnailSuggestion: "A programmer desk with a terminal code line alongside a growing monthly recurring revenue dashboard.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "finance-idea-4",
        title: "3 Traps Keeping You Broke in Your 20s (And How to Pivot)",
        conceptDescription: "Exploring high-interest consumer loops, lifestyle inflation, and how to start automatic compounding.",
        whyItWillWork: "Empathizes with financial anxiety and shows a clear mechanical path to wealth consolidation.",
        thumbnailSuggestion: "A striking visual: a heavy iron chain wrapped around a pile of credit cards next to a growing plant made of folded dollar bills.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "fitness") {
    return [
      {
        id: "fitness-idea-1",
        title: "I Executed 100 Pull-Ups Daily for 30 Days (Scientific Results)",
        conceptDescription: "Documenting hypertrophy, scapular stabilization, and joint recovery with biometrics and photo data.",
        whyItWillWork: "High-curiosity transformation experiment backed by real sports medicine.",
        thumbnailSuggestion: "A split before-and-after composition detailing posture differences and shoulder muscle activation points.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "fitness-idea-2",
        title: "Why Your Caloric Deficit Is Actually Making You Fat",
        conceptDescription: "Exposing metabolic adaptation, cortisol spikes, and muscle loss associated with extreme cardio and starvation.",
        whyItWillWork: "Attacks popular fitness fallacies to offer a healthy, sustainable biological blueprint.",
        thumbnailSuggestion: "Medical outline of a body's metabolism engine slowing down next to a weight scale showing stalled numbers.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "fitness-idea-3",
        title: "3 Mechanics You Must Fix on Your Squat to Save Your Knees",
        conceptDescription: "A biomechanical breakdown of foot torque, hip hinge depth, and spine alignment under load.",
        whyItWillWork: "Highly specific injury-prevention coaching that instantly adds weight to the bar.",
        thumbnailSuggestion: "A heavy barbell loaded with plates, featuring red warning force lines and green optimal trajectory arrows.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "fitness-idea-4",
        title: "I Trained Like an Olympic Athlete for 1 Week (Full Breakdown)",
        conceptDescription: "Surviving the extreme conditioning, strict nutrition, and recovery routines of world-class performers.",
        whyItWillWork: "Divergent lifestyle content with extreme physical challenges.",
        thumbnailSuggestion: "Close-up of a smartwatch displaying a peak heart-rate graph next to a plate of performance meals.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  if (cat === "programming") {
    return [
      {
        id: "prog-idea-1",
        title: "I Built a Full-Stack AI App in 24 Hours (No Boilerplates)",
        conceptDescription: "A coding sprint documenting custom WebSockets, state engine optimization, and clean API design from absolute scratch.",
        whyItWillWork: "Incredible technical value combined with high-tempo build pacing.",
        thumbnailSuggestion: "A stylish dark-mode terminal window with successful server compilation messages alongside a gorgeous layout mock.",
        potentialMetric: "Viral Potential"
      },
      {
        id: "prog-idea-2",
        title: "Why Your Application Is Slow: How to Spot a Hot Path",
        conceptDescription: "Debugging database query overhead, memory leaks, and render cycles using advanced runtime profiling.",
        whyItWillWork: "Highly technical problem solving that saves developers hours of debugging.",
        thumbnailSuggestion: "A CPU flame chart showing a massive bottleneck area glowing red, and the optimized block in bright green.",
        potentialMetric: "Insane Retention"
      },
      {
        id: "prog-idea-3",
        title: "How I Hacked My Local Server (Ethical Pen-Testing)",
        conceptDescription: "Demonstrating cross-site scripting vulnerabilities and configuring custom CORS headers to lock down API routes.",
        whyItWillWork: "Fascinating, high-tension cyber security exploration.",
        thumbnailSuggestion: "Glowing command line script injecting a payload next to a secure padlock switching from red to green.",
        potentialMetric: "Exceptional AVD"
      },
      {
        id: "prog-idea-4",
        title: "3 Code Anti-Patterns Ruining Your React Applications",
        conceptDescription: "Exposing bad hook dependencies, stale closure bugs, and how to utilize rendering buffers correctly.",
        whyItWillWork: "Highly actionable technical tutorial directly addressing developer frustrations.",
        thumbnailSuggestion: "A file code snippet showing a red highlighted syntax error pointing to clean, optimized custom hook.",
        potentialMetric: "S-Tier"
      }
    ];
  }

  // Default / general fallback
  return [
    {
      id: "fallback-1",
      title: `The Truth About "${cn}" No One Wants to Hear`,
      conceptDescription: `An analytical look at "${cn}" debunking major misconceptions that hold back 95% of people in this field.`,
      whyItWillWork: "Contrarian angle triggers high immediate curiosity.",
      thumbnailSuggestion: `A dark-themed high-contrast background with the text '95% FAIL' on a red caution sign.`,
      potentialMetric: "Viral Potential"
    },
    {
      id: "fallback-2",
      title: `I Tried the Hardest "${cn}" Challenge for 24 Hours`,
      conceptDescription: `Documenting extreme constraints, mechanical breakdowns, or creative tests trying to master "${cn}" in one day.`,
      whyItWillWork: "High-tempo challenge structures keep viewers hooked to see the outcome.",
      thumbnailSuggestion: `A countdown clock at 23:59 next to a polished icon of "${cn}" glowing with light streaks.`,
      potentialMetric: "Insane Retention"
    },
    {
      id: "fallback-3",
      title: `Why Most Beginners Quit "${cn}" (and How to Excel)`,
      conceptDescription: `An empathetic breakdown of typical starting roadblocks and a step-by-step master roadmap to bypass them easily.`,
      whyItWillWork: "Provides direct assistance to target audience paint points.",
      thumbnailSuggestion: "An abstract line graph showcasing a red 'Obstacle' path splitting into a bright neon green 'Growth' curve.",
      potentialMetric: "Exceptional AVD"
    },
    {
      id: "fallback-4",
      title: `How to Master "${cn}" in Only 10 Minutes a Day`,
      conceptDescription: `A minimalist habit outline demonstrating critical routines and setup secrets for rapid skill progression.`,
      whyItWillWork: "High reward, low-friction entry promise that appeals to busy creators.",
      thumbnailSuggestion: "A minimalist clean bento layout contrasting daily schedules and a neat, finished work result.",
      potentialMetric: "S-Tier"
    }
  ];
}

export function getFallbackHooks(topic: string) {
  const t = topic || "this topic";
  const cat = getNicheCategory(t);

  if (cat === "chess") {
    return [
      {
        style: "Curiosity Gap",
        script: "This simple pawn sacrifice completely breaks the Sicilian Defense, but 99% of players under 1500 ELO have never seen the follow-up.",
        rationale: "Creates instant cognitive interest by exposing a hidden flaw in a highly popular opening.",
        retentionPotential: "S-Tier"
      },
      {
        style: "High-Stakes Threat",
        script: "If you are still blindly castling on move 6 without checking your opponent's bishop diagonal, you are walking straight into a tactical checkmate.",
        rationale: "Taps into loss-aversion; nobody wants to lose games to simple opening traps.",
        retentionPotential: "Diamond Tier"
      },
      {
        style: "Immediate Reward",
        script: "In the next 60 seconds, I will teach you the exact board visualization patterns that Grandmasters use to calculate 5 moves ahead instantly.",
        rationale: "Offers high-value mental upgrade with zero time delay.",
        retentionPotential: "Super Viral"
      },
      {
        style: "Counter-Intuitive Truth",
        script: "Stop trying to memorize 20 moves of opening theory. It's actually keeping your ELO stuck in the triple digits, and here's why.",
        rationale: "Challenges fundamental community beliefs, forcing the player to watch the alternative roadmap.",
        retentionPotential: "Viral Potential"
      }
    ];
  }

  if (cat === "gaming") {
    return [
      {
        style: "Curiosity Gap",
        script: "The developers claimed this weapon was completely useless, but we found a hidden scaling multiplier that turns it into an absolute damage beast.",
        rationale: "Exposes hidden game balance values that players can exploit immediately.",
        retentionPotential: "S-Tier"
      },
      {
        style: "High-Stakes Threat",
        script: "If you are still buying this starter item in the current patch, you are throwing away your early game lane priority and throwing the match.",
        rationale: "Threatens their ranking success, forcing them to watch to correct their build order.",
        retentionPotential: "Diamond Tier"
      },
      {
        style: "Immediate Reward",
        script: "I will show you the exact route to find three legendary items in under 5 minutes right after leaving the starter area.",
        rationale: "Provides immediate, actionable fast-track items to save them hours of grind.",
        retentionPotential: "Super Viral"
      },
      {
        style: "Counter-Intuitive Truth",
        script: "Stop practicing your aim in custom maps. It is actually slowing down your physical muscle memory, and the telemetry logs prove it.",
        rationale: "Directly contradicts the main advice given by professional coaches.",
        retentionPotential: "Viral Potential"
      }
    ];
  }

  if (cat === "cooking") {
    return [
      {
        style: "Curiosity Gap",
        script: "Professional pastry chefs never use cold water in their dough. This simple temperature shift changes the gluten structure entirely, and here is the science.",
        rationale: "Taps into baking chemistry secrets to elevate home kitchen results.",
        retentionPotential: "S-Tier"
      },
      {
        style: "High-Stakes Threat",
        script: "If you are salting your steak right before it hits the skillet, you're drawing out surface moisture and boiling your meat instead of searing it.",
        rationale: "Warns about a major common mistake that ruins expensive ingredients.",
        retentionPotential: "Diamond Tier"
      },
      {
        style: "Immediate Reward",
        script: "I will show you how to emulsify a broken butter sauce in exactly 30 seconds using a simple pantry ingredient you already own.",
        rationale: "Saves their expensive dinner in real-time with an easy kitchen hack.",
        retentionPotential: "Super Viral"
      },
      {
        style: "Counter-Intuitive Truth",
        script: "Extra virgin olive oil is actually ruining your high-heat marinades. It breaks down into bitter compounds, and here is what to use instead.",
        rationale: "Exposes a widely practiced habit as a culinary mistake.",
        retentionPotential: "Viral Potential"
      }
    ];
  }

  // General default fallback
  return [
    {
      style: "Curiosity Gap",
      script: `Almost everyone talking about "${t}" is lying to you. But we found the one weird trick that actually works, and it takes less than 3 minutes to set up.`,
      rationale: "Creates cognitive dissonance. By telling creators they've been lied to, we force them to stay to uncover the truth.",
      retentionPotential: "Diamond Tier"
    },
    {
      style: "High-Stakes Threat",
      script: `If you do not change these 3 settings in your next video about "${t}", you are actively killing your organic reach. Here is exactly why.`,
      rationale: "Taps into risk and loss aversion. People care far more about losing current performance than earning a potential minor win.",
      retentionPotential: "S-Tier"
    },
    {
      style: "Immediate Reward",
      script: `In the next 60 seconds, I am going to show you how to triple your results in "${t}" using a secret blueprint we discovered last week.`,
      rationale: "Fast-paced value statement. Offers an immediate positive benefit for minimal time investment.",
      retentionPotential: "A-Tier"
    },
    {
      style: "Counter-Intuitive Truth",
      script: `Stop trying to optimize your SEO for "${t}". It is actually hurting your views. Here is what we do instead.`,
      rationale: "Directly attacks standard industry advice. It creates instant curiosity because it contradicts what they've heard on 100 other tutorials.",
      retentionPotential: "Super Viral"
    }
  ];
}

export function getFallbackScript(title: string, duration: string) {
  const t = title || "The Truth About Passive Income";
  const d = duration || "8-10 minutes";
  const cat = getNicheCategory(t);

  if (cat === "chess") {
    return {
      hook: "Stop memorizing chess openings. You are actually cluttering your brain, and your opponents will punish you the second they deviate on move 4.",
      intro: "Cinematic close-up of a wooden chessboard. The hand slide-sacrifices a knight, then transitions to a digital overlay diagram analyzing coordinate spaces.",
      bodyBeats: [
        {
          subtitle: "Phase 1: Positional Evaluation Over Raw Calculation",
          visualCue: "A split-screen comparing a frantic calculation line with red paths versus a clear, quiet pawn structure diagram.",
          talkingPoints: "Teach the viewer how to evaluate pawn skeletons, identify weak squares, and locate natural outpost spots for knights instead of blindly checking."
        },
        {
          subtitle: "Phase 2: Exploiting the King-Side Castle Space",
          visualCue: "Visual zoom of the g7 and h7 squares with highlighted diagonal attack lines showing bishop coordination templates.",
          talkingPoints: "Unpack how to force pawn structure weaknesses (like f6 or h6 moves) and coordinate heavy pieces for rapid mating nets."
        },
        {
          subtitle: "Phase 3: Endgame King Opposition Mechanics",
          visualCue: "A simplified 3-piece endgame simulation demonstrating how to use King opposition to force pawn promotion paths.",
          talkingPoints: "Break down the mathematical rule of the square and king opposition mechanics so viewers can secure endgames cleanly."
        }
      ],
      cta: "If you want to stop losing ELO to simple middle-game blunders, hit that subscribe button and click the link in the description for our free tactical sheet."
    };
  }

  if (cat === "gaming") {
    return {
      hook: "If you are still utilizing the default controller deadzone configurations in this patch, you are literally losing aim fights before you pull the trigger.",
      intro: "Fast montage of high-tempo gameplay with synchronized audio hits, transitioning to a controller hand-cam setup showing thumbstick positioning.",
      bodyBeats: [
        {
          subtitle: "Phase 1: Optimizing the Mechanical Input Curve",
          visualCue: "On-screen graph detailing raw response curves and polling rates compared alongside responsive gameplay results.",
          talkingPoints: "Break down the exact settings to eliminate input lag. Show why custom response curves are superior to linear setups."
        },
        {
          subtitle: "Phase 2: Map Rotations and Chokepoint Mastery",
          visualCue: "A dynamic map blueprint showing main rotation lines with red warning sectors and green safe lanes highlighted.",
          talkingPoints: "Explain spawn timing mechanics, rotation priorities, and how to hold specific crosshair angles to maximize headshot CTR."
        },
        {
          subtitle: "Phase 3: Building a Sustainable Meta Inventory",
          visualCue: "An overlay card grading the top tier gear profiles with active numeric comparison metrics.",
          talkingPoints: "A step-by-step optimization build path showing when to allocate game resources to avoid falling behind the progression curve."
        }
      ],
      cta: "Hit that subscribe button to dominate the leaderboards, and drop a comment below sharing your current competitive rank!"
    };
  }

  if (cat === "cooking") {
    return {
      hook: "Professional chefs never season their meat right out of the fridge. Here is why that simple mistake is turning your dinner into rubber.",
      intro: "Extreme close-up of a ribeye hitting a hot cast iron pan with loud sizzle sounds, transitioning to a kitchen counter setup detailing temperature readings.",
      bodyBeats: [
        {
          subtitle: "Phase 1: The Chemistry of Dry Brining",
          visualCue: "Macro comparison shots of a dry-brined steak with deep red cured surface versus a wet, un-brined cut.",
          talkingPoints: "Explain how salt draws out moisture, dissolves, and is reabsorbed back into the muscle fibers, breaking down tough proteins."
        },
        {
          subtitle: "Phase 2: Harnessing the Maillard Reaction",
          visualCue: "Close-up of the crust formation with a thermometer measuring surface temperature spikes during searing.",
          talkingPoints: "Discuss surface dehydration, oil smoking thresholds, and why high-thermal cast iron is crucial for amino acid conversion."
        },
        {
          subtitle: "Phase 3: Carry-Over Cooking and Resting Physics",
          visualCue: "A 3D cross-section diagram showing heat transferring inward while the meat rests on a warm wire rack.",
          talkingPoints: "Demystify muscle contraction and why resting allows internal juices to redistribute, preventing a messy cutting board."
        }
      ],
      cta: "If you want to cook like a Michelin-starred chef from home, subscribe for zero-fluff recipes and check out our kitchen gear list below."
    };
  }

  // General fallback
  return {
    hook: `Stop scrolling if you want to master "${t}". Over 95% of people get this entirely wrong, and it costs them weeks of wasted effort. Today, we're fixing that.`,
    intro: `Fast dramatic transition showing a clean visual checklist, then shifting to a high-contrast timeline map on-screen. Host introduces the underlying mechanics over the next ${d}.`,
    bodyBeats: [
      {
        subtitle: "Phase 1: Deconstructing the Core Misconception",
        visualCue: "Split-screen comparing popular online myths versus realistic spreadsheets showing real data.",
        talkingPoints: "Walk the viewer through the initial work required. Emphasize that there is no shortcut—it is delayed return on high upfront strategic effort."
      },
      {
        subtitle: "Phase 2: The 3 Pillars of Sustainable Execution",
        visualCue: "A dynamic 3-part chart appearing piece-by-piece, highlighting Systems, Audiences, and High-Intent Assets.",
        talkingPoints: "Explain the transition from raw guesswork to template-driven yields. Focus on real-world examples in this space."
      },
      {
        subtitle: "Phase 3: The Step-by-Step Practical Blueprint",
        visualCue: "Step-by-step grid showing clear milestones for week 1, month 1, and month 6.",
        talkingPoints: "Provide actionable milestones. Give the viewer highly practical checklists they can execute today without massive starting overhead."
      }
    ],
    cta: "If you found these steps helpful, hit that subscribe button for more zero-fluff breakdowns, and click the link in the description for our free checklist template."
  };
}

export function getFallbackTitles(concept: string) {
  const c = concept || "YouTube Growth Strategies";
  const cat = getNicheCategory(c);

  if (cat === "chess") {
    return [
      {
        title: "I Tested the Sicilian Defense 100 Times (This Opener Is Broken)",
        styleLabel: "High-Effort Challenge"
      },
      {
        title: "Why 99% of Chess Beginners Ruin Symmetrical Openings",
        styleLabel: "Negative Bracket Warning"
      },
      {
        title: "Stop Memorizing Openings Unless You Want to Stay Stuck Under 1000 ELO",
        styleLabel: "Intense Urgency"
      },
      {
        title: "I Played the Unbeatable Chess Engine Until It Broke...",
        styleLabel: "Curiosity Loop"
      },
      {
        title: "Can You Solve the Hardest Chess Position Ever Created? [Mate in 8]",
        styleLabel: "Curiosity Challenge"
      },
      {
        title: "The 3 Position Mistakes That Keep Your ELO Stuck Forever",
        styleLabel: "Exclusive Secret"
      }
    ];
  }

  if (cat === "gaming") {
    return [
      {
        title: "I Survived 100 Days in the Hardest Hardcore Modpack",
        styleLabel: "High-Effort Challenge"
      },
      {
        title: "Why the New Update Completely Ruined the Competitive Meta",
        styleLabel: "Intense Urgency"
      },
      {
        title: "Stop Using Default Settings (You Are Losing Aim Fights!)",
        styleLabel: "Negative Bracket Warning"
      },
      {
        title: "I Tried the Speedrun Strat That Took 5 Years to Discover",
        styleLabel: "Curiosity Loop"
      },
      {
        title: "3 Aim Blunders Keeping You Stuck in Competitive Elo Hell",
        styleLabel: "Urgent Solution"
      },
      {
        title: "This Secret Weapon Buff is Actually Game-Breaking in Patch 1.25",
        styleLabel: "Exclusive Secret"
      }
    ];
  }

  if (cat === "cooking") {
    return [
      {
        title: "My 100-Year-Old Heirloom Sourdough Made the Perfect Crumb",
        styleLabel: "Curiosity Challenge"
      },
      {
        title: "I Spent 48 Hours Crafting the Hardest Ramen on Earth",
        styleLabel: "High-Effort Challenge"
      },
      {
        title: "Why Your Steaks are Always Dry (3 Skillet Mistakes to Fix)",
        styleLabel: "Negative Bracket Warning"
      },
      {
        title: "Stop Seasoning Your Meat Right Out of the Fridge!",
        styleLabel: "Intense Urgency"
      },
      {
        title: "The Chemical Technique Restaurants Don't Want You to Know",
        styleLabel: "Exclusive Secret"
      },
      {
        title: "I Cooked a $5 Steak vs a $500 Steak (The Truth)",
        styleLabel: "Extreme Comparison"
      }
    ];
  }

  return [
    {
      title: `How I Mastered "${c}" Completely Alone in 24 Hours`,
      styleLabel: "High-Effort Challenge"
    },
    {
      title: `Most people get "${c}" completely wrong (DO THIS INSTEAD)`,
      styleLabel: "Intense Urgency"
    },
    {
      title: `The Ultimate Guide to "${c}" Which Actually Works in 2026`,
      styleLabel: "Value Authority"
    },
    {
      title: `I tried "${c}" for 30 Days. Here is what happened...`,
      styleLabel: "Curiosity Loop"
    },
    {
      title: `Stop doing "${c}" unless you want to lose time/money`,
      styleLabel: "Negative Bracket"
    },
    {
      title: `The 3 simple secrets of "${c}" that gurus hide from you`,
      styleLabel: "Exclusive Secret"
    }
  ];
}
