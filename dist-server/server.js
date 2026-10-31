// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// src/data/srijanResolver.ts
function normalizeQuery(query) {
  if (!query) return "";
  let q = query.toLowerCase().trim();
  q = q.replace(/\b(see\s*sat|c\s*sat|c-sat|see\s*sad|c\s*set|c\s*sap|sea\s*sat|si\s*sat)\b/gi, "csat").replace(/\b(pw\s*only\s*ias|pw\s*ias|only\s*ias)\b/gi, "pwonlyias").replace(/\b(p\s*y\s*q|pyqs|p\s*y\s*qs)\b/gi, "pyq").replace(/\b(flts|f\s*l\s*t|flt\s*test)\b/gi, "flt");
  return q;
}
function isSrijanFactualQuery(userQuery) {
  const q = normalizeQuery(userQuery);
  if (!q) return false;
  return q.includes("csat") || q.includes("class") || q.includes("classes") || q.includes("lecture") || q.includes("faculty") || q.includes("teacher") || q.includes("sir") || q.includes("mam") || q.includes("polity") || q.includes("history") || q.includes("economy") || q.includes("geography") || q.includes("science") || q.includes("current affair") || q.includes("test") || q.includes("mock") || q.includes("plan") || q.includes("price") || q.includes("fee") || q.includes("cost") || q.includes("pro") || q.includes("book") || q.includes("hard copy") || q.includes("pyq") || q.includes("date") || q.includes("start") || q.includes("valid") || q.includes("mentor") || q.includes("offline") || q.includes("medium") || q.includes("language") || q.includes("5000") || q.includes("10000") || q.includes("11000") || q.includes("rishav") || q.includes("shivam") || q.includes("nikhil") || q.includes("ranchan") || q.includes("sonpriya") || q.includes("vikas") || q.includes("manjeet") || q.includes("prashant");
}
function resolveSrijanQuery(userQuery) {
  if (!userQuery) {
    return {
      reply: "Namaste! Main Aditi hoon. SRIJAN Prelims 2027 ke plans, faculty, CSAT classes aur test series ke baare mein aap mujhse kuch bhi poochh sakte hain.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"],
      isFactualMatch: false
    };
  }
  const q = normalizeQuery(userQuery);
  const isAskingFaculty = q.includes("faculty") || q.includes("teacher") || q.includes("teachers") || q.includes("educator") || q.includes("educators") || q.includes("kaun padha") || q.includes("who teaches") || q.includes("sir kaun");
  if (isAskingFaculty) {
    if (q.includes("history") || q.includes("ancient") || q.includes("medieval") || q.includes("modern")) {
      return {
        reply: "History mein: Ancient India, Medieval India aur Art & Culture Sonpriya Mam padhayengi (5+5+5 classes). Modern India ki 9 classes Vikas Ahlawat Sir dwara li jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Polity aur Economy kaun padhayenge?", "CSAT classes kitni hain?", "Kya PYQ books ghar aayengi?"],
        isFactualMatch: true
      };
    }
    if (q.includes("csat") && !q.includes("gs") && !q.includes("all")) {
      return {
        reply: "CSAT ka pura course Rishav Sharma Sir padhayenge: Reading Comprehension ki 13 classes, Logical Reasoning ki 13 classes, aur Quantitative Aptitude ki 11 classes.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["CSAT mein total kitni classes hain?", "Base Plan mein CSAT classes hain kya?", "Select 360 Pro ka price kya hai?"],
        isFactualMatch: true
      };
    }
    if (q.includes("polity") || q.includes("ir")) {
      return {
        reply: "Polity (13 classes) aur International Relations (2 classes) Nikhil Ram Sir dwara padhayi jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Economy kaun padhayenge?", "CSAT faculty kaun hain?", "Select 360 Pro ki fees kya hai?"],
        isFactualMatch: true
      };
    }
    if (q.includes("economy")) {
      return {
        reply: "Indian Economy ki 10 classes Ranchan Kaul Sir dwara li jayengi, jisme core macroeconomics, banking aur budget cover hoga.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Geography kaun padhayenge?", "CSAT classes kitni hain?", "Tests kitne honge?"],
        isFactualMatch: true
      };
    }
    if (q.includes("geography") || q.includes("environment")) {
      return {
        reply: "Geography ki 11 classes aur Environment & Ecology ki 4 classes Shivam Yash Sir padhayenge.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Science & Tech kaun padha rahe hain?", "Total tests kitne hain?", "Select 360 Pro ki fees kitni hai?"],
        isFactualMatch: true
      };
    }
    if (q.includes("science")) {
      return {
        reply: "Science & Technology ki 4 classes Manjeet Choudhary Sir dwara li jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Current Affairs kaun padhayenge?", "CSAT classes kitni hain?", "Select 360 Pro kyu lein?"],
        isFactualMatch: true
      };
    }
    if (q.includes("current affair") || q.includes("ca")) {
      return {
        reply: "Current Affairs Course Prashant Tiwari Sir lenge, jisme 1 saal ke high-yield current affairs month-wise cover honge.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Current Affairs ke tests kitne hain?", "CSAT course details batayein", "Select 360 Pro mein books milti hain kya?"],
        isFactualMatch: true
      };
    }
    return {
      reply: "Hamare star faculty hain: Nikhil Ram Sir (Polity & IR), Shivam Yash Sir (Geography & Environment), Ranchan Kaul Sir (Economy), Sonpriya Mam (Ancient, Medieval, Art & Culture), Vikas Ahlawat Sir (Modern India), Manjeet Choudhary Sir (Science & Tech), Prashant Tiwari Sir (Current Affairs), aur Rishav Sharma Sir (CSAT).",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "History mein kitni classes hain?", "Select 360 Pro ki fees kya hai?"],
      isFactualMatch: true
    };
  }
  if (q.includes("csat") && (q.includes("base") || q.includes("5000"))) {
    return {
      reply: "Base Plan (\u20B95,000) mein CSAT ke tests shamil hain \u2014 68 Daily Tests mein 10 CSAT Qs aur 8 Full Length Tests mein 80 CSAT Qs. Lekin CSAT ki 37 classes Select 360 (\u20B910,000) aur Select 360 Pro (\u20B911,000) plans mein hi shamil hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Select 360 ki fees kitni hai?", "CSAT mein subject-wise classes kitni hain?", "Select 360 Pro mein books milti hain kya?"],
      isFactualMatch: true
    };
  }
  if (q.includes("csat") || q.includes("rishav") || q.includes("quantitative") || q.includes("reasoning") || q.includes("comprehension") || q.includes("math") && !q.includes("aftermath")) {
    return {
      reply: "Select 360 aur 360 Pro plans mein CSAT ki total 37 classes hongi, jo Rishav Sharma Sir lenge: 13 classes Reading Comprehension, 13 classes Logical Reasoning, aur 11 classes Quantitative Aptitude ki rahengi. Saath hi daily 10 CSAT questions aur 8 Full Length CSAT mock tests bhi milenge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Base Plan mein CSAT classes hain kya?", "CSAT ki 16-year PYQ book kaise milegi?", "GS crash course mein kitni classes hain?"],
      isFactualMatch: true
    };
  }
  if ((q.includes("how many") || q.includes("kitni") || q.includes("total") || q.includes("number of") || q.includes("kitne")) && (q.includes("class") || q.includes("classes") || q.includes("lecture") || q.includes("lectures") || q.includes("session"))) {
    return {
      reply: "SRIJAN 2027 mein total 107 classes hongi: lagbhag 70 classes GS Prelims Crash Course ki hain aur 37 classes CSAT ki hain jo Rishav Sharma Sir padhayenge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein subject-wise classes kitni hain?", "GS ke faculty members kaun hain?", "Select 360 Pro ka price kya hai?"],
      isFactualMatch: true
    };
  }
  if (q.includes("history") || q.includes("ancient") || q.includes("medieval") || q.includes("modern") || q.includes("art") || q.includes("culture") || q.includes("sonpriya") || q.includes("vikas")) {
    return {
      reply: "History mein: Ancient India ki 5 classes, Medieval India ki 5 classes, aur Art & Culture ki 5 classes Sonpriya Mam padhayengi. Modern India ki 9 classes Vikas Ahlawat Sir dwara li jayengi.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Polity aur Economy kaun padhayenge?", "CSAT classes kitni hain?", "Kya PYQ books ghar aayengi?"],
      isFactualMatch: true
    };
  }
  if (q.includes("polity") || q.includes("constitution") || q.includes("ir") || q.includes("international relations") || q.includes("nikhil")) {
    return {
      reply: "Polity ki total 13 classes aur International Relations ki 2 classes Nikhil Ram Sir dwara li jayengi, jisme high-yield concepts aur prelims PYQs cover honge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Economy ki kitni classes hain?", "CSAT faculty kaun hain?", "Tests kitne honge?"],
      isFactualMatch: true
    };
  }
  if (q.includes("economy") || q.includes("economic") || q.includes("ranchan") || q.includes("banking") || q.includes("inflation")) {
    return {
      reply: "Indian Economy ki 10 classes Ranchan Kaul Sir lenge, jisme macroeconomics, banking, inflation, fiscal policy aur budget cover kiya jayega.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Geography aur Environment kaun padhayenge?", "CSAT ki classes kitni hain?", "Select 360 Pro mein kya extra hai?"],
      isFactualMatch: true
    };
  }
  if (q.includes("geography") || q.includes("environment") || q.includes("ecology") || q.includes("shivam")) {
    return {
      reply: "Geography ki 11 classes aur Environment & Ecology ki 4 classes Shivam Yash Sir padhayenge, jisme mapping, climatology aur biodiversity hotspots shamil hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Science & Tech kaun padha rahe hain?", "Total tests kitne hain?", "Select 360 Pro ki fees kitni hai?"],
      isFactualMatch: true
    };
  }
  if (q.includes("science") || q.includes("tech") || q.includes("manjeet")) {
    return {
      reply: "Science & Technology ki 4 classes Manjeet Choudhary Sir dwara li jayengi, jisme space missions, biotechnology, AI aur defence technology cover hogi.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Current Affairs kaun padhayenge?", "CSAT classes kitni hain?", "Select 360 Pro kyu lein?"],
      isFactualMatch: true
    };
  }
  if (q.includes("current affair") || q.includes("ca") || q.includes("prashant")) {
    return {
      reply: "Current Affairs Course Prashant Tiwari Sir lenge, jisme 1 saal ke high-yield current affairs month-wise prelims orientation ke saath cover honge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Current Affairs ke tests kitne hain?", "CSAT course details batayein", "Select 360 Pro mein books milti hain kya?"],
      isFactualMatch: true
    };
  }
  if (q.includes("faculty") || q.includes("teacher") || q.includes("teachers") || q.includes("educator") || q.includes("educators") || q.includes("sir") || q.includes("mam") || q.includes("padha")) {
    return {
      reply: "Hamare star faculty hain: Nikhil Ram Sir (Polity & IR), Shivam Yash Sir (Geography & Environment), Ranchan Kaul Sir (Economy), Sonpriya Mam (Ancient, Medieval, Art & Culture), Vikas Ahlawat Sir (Modern India), Manjeet Choudhary Sir (Science & Tech), aur Rishav Sharma Sir (CSAT).",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "History mein kitni classes hain?", "Select 360 Pro ki fees kya hai?"]
    };
  }
  if (q.includes("test") || q.includes("tests") || q.includes("flt") || q.includes("mock") || q.includes("daily test") || q.includes("schedule") || q.includes("series")) {
    return {
      reply: "Program mein total 87 tests hain: 68 Daily Tests (30 GS + 10 CSAT Qs), 6 Subject Completion Tests (100 GS Qs), 5 Current Affairs Tests (100 GS Qs), aur 8 Full Length Tests (100 GS + 80 CSAT Qs), plus Budget aur Economic Survey ke special tests.",
      recommendedPlan: "Base Plan",
      suggestedQuestions: ["Base Plan aur Select 360 mein kya fark hai?", "Offline centers par tests de sakte hain?", "Select 360 Pro ka price kya hai?"]
    };
  }
  if (q.includes("360 pro") || q.includes("pro plan") || q.includes("book") || q.includes("books") || q.includes("hard copy") || q.includes("hardcopy") || q.includes("pyq") || q.includes("11000") || q.includes("11,000") || q.includes("kitab")) {
    return {
      reply: "Select 360 Pro Plan \u20B911,000 ka hai \u2014 yaani regular 360 se sirf \u20B91,000 extra! Isme classes aur tests ke saath GS ke 32 saal aur CSAT ke 16 saal ke solved PYQs ke 2 physical hard copy booklets aapke ghar par deliver honge.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Book delivery mein kitne din lagte hain?", "CSAT classes kon lega?", "Batch kab se shuru ho raha hai?"]
    };
  }
  if (q.includes("fee") || q.includes("fees") || q.includes("price") || q.includes("cost") || q.includes("kitna") || q.includes("paise") || q.includes("5000") || q.includes("10000") || q.includes("rate") || q.includes("plan")) {
    return {
      reply: "Batch ke 3 plans hain: Base Plan \u20B95,000 (Test Series + Mentorship), Select 360 Plan \u20B910,000 (GS Classes + CSAT + Topper Mentorship), aur Select 360 Pro Plan \u20B911,000 (All features + 2 Solved PYQ Hard Copy Books delivered home).",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Select 360 Pro kyu choose karna chahiye?", "CSAT classes mein kya-kya hai?", "Batch validity kab tak hai?"]
    };
  }
  if (q.includes("date") || q.includes("start") || q.includes("validity") || q.includes("valid") || q.includes("end") || q.includes("kab") || q.includes("khatam") || q.includes("duration") || q.includes("november")) {
    return {
      reply: "SRIJAN Prelims 2027 batch 18 November 2026 se start hoga, 9 May 2027 ko complete hoga, aur course validity 30 May 2027 tak rahegi.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Fees kitni hai?", "CSAT classes kitni hain?", "PYQ books kaise milengi?"]
    };
  }
  if (q.includes("mentor") || q.includes("mentorship") || q.includes("topper") || q.includes("guidance") || q.includes("offline") || q.includes("center") || q.includes("visit")) {
    return {
      reply: "Base Plan mein Audio Mentorship request form aur offline PWOnlyIAS centers par walk-in mentorship hai. Select 360 aur Pro plans mein har 14 din mein personalized mentor follow-ups aur UPSC Toppers se sessions milte hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Select 360 Pro ki fees kya hai?", "CSAT mein kitni classes hain?", "Test series schedule kya hai?"]
    };
  }
  if (q.includes("medium") || q.includes("language") || q.includes("bhasha") || q.includes("english") || q.includes("hindi") || q.includes("online") || q.includes("mode")) {
    return {
      reply: "SRIJAN Prelims 2027 batch dono English aur Hindi medium mein available hai! Aap screen par diye gaye 'Buy English' ya 'Buy \u0939\u093F\u0902\u0926\u0940 Medium' buttons se directly PhysicsWallah par enroll kar sakte hain. Course validity 30 May 2027 tak rahegi.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Select 360 Pro fees kitni hai?", "CSAT classes kitni hain?", "Course validity kab tak hai?"]
    };
  }
  if (q === "hi" || q === "hello" || q === "namaste" || q === "hey" || q === "namaskar") {
    return {
      reply: "Namaste! Main Aditi hoon, aapki SRIJAN 2027 counselor. UPSC Prelims 2027 ke liye hamare paas Base Plan (\u20B95,000), Select 360 (\u20B910,000) aur Select 360 Pro (\u20B911,000 with PYQ books) hain. Aap kya jaanna chahte hain?",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"]
    };
  }
  return {
    reply: "SRIJAN Prelims 2027 batch 18 November 2026 se shuru ho raha hai. Isme 107 total classes (70 GS + 37 CSAT by Rishav Sharma Sir), 87 Tests, aur Select 360 Pro mein 32-year GS aur 16-year CSAT solved PYQ hard copy books doorstep delivered hain.",
    recommendedPlan: "Select 360 Pro",
    suggestedQuestions: ["CSAT classes kitni hain?", "Select 360 Pro kyu lena chahiye?", "Batch kab start hoga?"]
  };
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "15mb" }));
var apiKey = process.env.GEMINI_API_KEY || "";
var ai = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var leads = [
  {
    id: "lead-1",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    email: "priya.s@example.com",
    targetYear: "2027",
    planPreference: "Select 360 Pro (\u20B911,000)",
    notes: "Interested in GS + CSAT solved PYQ hard copies and topper mentorship.",
    createdAt: new Date(Date.now() - 36e5 * 4).toISOString()
  },
  {
    id: "lead-2",
    name: "Rahul Verma",
    phone: "+91 91234 56789",
    email: "rahul.v@example.com",
    targetYear: "2027",
    planPreference: "Select 360 (\u20B910,000)",
    notes: "Needs guidance for Rishav Sharma Sir CSAT classes.",
    createdAt: new Date(Date.now() - 36e5 * 20).toISOString()
  }
];
var SRIJAN_PROGRAM_KNOWLEDGE = `
YOU ARE "ADITI", A SENIOR UPSC ACADEMIC & SALES COUNSELOR AT PWOnlyIAS FOR:
"SRIJAN PRELIMS PROGRAM 2027 - ENGLISH"

CRITICAL RULE #1 - DIRECT FACTUAL ANSWERS (NO INTRODUCTORY FLUFF):
- NEVER start your response with "Namaste!", "Hello!", or "Main Aditi hoon" when answering a question!
- ONLY greet if the user explicitly said "hi", "hello", or "namaste".
- Answer the user's specific question in the VERY FIRST SENTENCE with exact factual numbers, dates, faculty names, or pricing.
- Example: If asked "how many csat classes will be there", start directly: "CSAT mein total 37 classes hongi, jo Rishav Sharma Sir lenge: 13 Reading Comprehension, 13 Logical Reasoning, aur 11 Quantitative Aptitude ki."
- Keep the response concise, punchy, factually accurate, and in natural spoken HINGLISH (Hindi + English in Latin script).

EXACT PROGRAM FACTS (NEVER HALLUCINATE OR CHANGE):
1. CSAT Course Details (Rishav Sharma Sir):
   - Total CSAT Classes: 37 Classes
     * Reading Comprehension: 13 Classes
     * Logical & Analytical Reasoning: 13 Classes
     * Quantitative Aptitude: 11 Classes
   - Testing: Daily 10 CSAT questions across 68 Daily Tests + 8 Full Length Tests (80 CSAT Qs each).
   - In 360 Pro: CSAT 16-Year Solved PYQs Booklet (Hard Copy) delivered to home.

2. Prelims GS Crash Course (~70 Classes Total):
   - Polity: 13 classes by Nikhil Ram Sir
   - Geography: 11 classes by Shivam Yash Sir
   - Indian Economy: 10 classes by Ranchan Kaul Sir
   - Modern India: 9 classes by Vikas Ahlawat Sir
   - Ancient India: 5 classes by Sonpriya Mam
   - Medieval India: 5 classes by Sonpriya Mam
   - Art & Culture: 5 classes by Sonpriya Mam
   - Environment & Ecology: 4 classes by Shivam Yash Sir
   - Science & Technology: 4 classes by Manjeet Choudhary Sir
   - International Relations: 2 classes by Nikhil Ram Sir

3. Current Affairs Course:
   - 12 month-wise classes covering 1 full year by Prashant Tiwari Sir.

4. Total Classes in Select 360 / Select 360 Pro:
   - 107 total classes (70 GS Crash Course classes + 37 CSAT classes).

5. Total Tests (87 Tests):
   - 68 Daily Tests: 30 GS questions + 10 CSAT questions per test
   - 6 Subject Completion Tests: 100 GS questions each
   - 5 Current Affairs Tests: 100 GS questions each
   - 8 Full Length Tests (FLTs): 100 GS questions + 80 CSAT questions each
   - Special Milestone Tests: Economic Survey, Union Budget, and India Year Book.

6. Plans & Pricing:
   - Base Plan: \u20B9 5,000 (87 Tests + Audio Request Form Mentorship + Offline PW Center visits)
   - Select 360 Plan: \u20B9 10,000 (Base Plan + 70 GS Classes + 37 CSAT Classes + CA + Fortnightly Topper Mentorship)
   - Select 360 Pro Plan: \u20B9 11,000 (Select 360 + 32-Yr GS Solved PYQs Hard Copy Book + 16-Yr CSAT Solved PYQs Hard Copy Book delivered to doorstep).
   - Difference: Only \u20B91,000 between 360 and 360 Pro!

7. Dates & Validity:
   - Start Date: 18 November 2026
   - End Date: 9 May 2027
   - Course Validity: 30 May 2027
   - Target Year: UPSC CSE 2027
   - Mode: Online only (with offline PWOnlyIAS centers for mentorship).
   - Medium: English (Hindi and Hinglish batches also available).
`;
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], generateVoice = true } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const voiceName = "Aoede";
    let replyText = "";
    let recommendedPlan = null;
    let suggestedQuestions = [];
    const trimmed = message.trim();
    const isPureGreeting = /^(hi|hello|namaste|hey|namaskar|pranam)[\s!.]*$/i.test(trimmed);
    if (isPureGreeting) {
      replyText = "Namaste! Main Aditi hoon, aapki SRIJAN 2027 counselor. UPSC Prelims 2027 ke liye hamare paas Base Plan (\u20B95,000), Select 360 (\u20B910,000) aur Select 360 Pro (\u20B911,000 with PYQ books) hain. Aap kya jaanna chahte hain?";
      recommendedPlan = "Select 360 Pro";
      suggestedQuestions = ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"];
    } else if (isSrijanFactualQuery(trimmed)) {
      const resolved = resolveSrijanQuery(trimmed);
      replyText = resolved.reply;
      recommendedPlan = resolved.recommendedPlan;
      suggestedQuestions = resolved.suggestedQuestions;
    } else if (ai) {
      try {
        const formattedContents = history.slice(-4).map((item) => ({
          role: item.role === "model" ? "model" : "user",
          parts: [{ text: item.text }]
        }));
        formattedContents.push({
          role: "user",
          parts: [{
            text: `Aspirant Question: "${trimmed}".
Counselor: Aditi.
CRITICAL INSTRUCTION:
1. Answer the question DIRECTLY in the first sentence with exact figures.
2. DO NOT say "Namaste!", "Hello!", or "Main Aditi hoon" unless user greeted.
3. Language: Fluent, natural HINGLISH (Hindi + English in Latin script). Keep it to 2 to 3 concise spoken sentences.
4. Suggest 3 short Hinglish follow-up questions.`
          }]
        });
        const generatePromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: formattedContents,
          config: {
            systemInstruction: SRIJAN_PROGRAM_KNOWLEDGE,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                reply: {
                  type: "STRING",
                  description: "Direct factual spoken response in natural conversational HINGLISH. No greetings unless user greeted. Starts with the exact answer."
                },
                recommendedPlan: {
                  type: "STRING",
                  description: 'Recommended plan: "Base Plan", "Select 360", "Select 360 Pro", or "None"'
                },
                suggestedQuestions: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "3 short relevant follow-up questions in Hinglish."
                }
              },
              required: ["reply", "suggestedQuestions"]
            }
          }
        });
        const timeoutPromise = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Gemini API timeout")), 4e3)
        );
        const response = await Promise.race([generatePromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || "{}");
        replyText = parsed.reply || resolveSrijanQuery(trimmed).reply;
        recommendedPlan = parsed.recommendedPlan === "None" ? null : parsed.recommendedPlan;
        suggestedQuestions = Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions.slice(0, 3) : [];
      } catch (geminiError) {
        console.warn("Falling back to direct srijan resolver:", geminiError?.message || geminiError);
        const resolved = resolveSrijanQuery(trimmed);
        replyText = resolved.reply;
        recommendedPlan = resolved.recommendedPlan;
        suggestedQuestions = resolved.suggestedQuestions;
      }
    } else {
      const resolved = resolveSrijanQuery(trimmed);
      replyText = resolved.reply;
      recommendedPlan = resolved.recommendedPlan;
      suggestedQuestions = resolved.suggestedQuestions;
    }
    let audioBase64 = null;
    if (generateVoice && ai && replyText) {
      try {
        const spokenText = replyText.replace(/₹\s*(\d+)/g, "$1 Rupees").replace(/₹/g, "Rupees ").replace(/[—–]/g, ", ").replace(/[*#_`]/g, "");
        const ttsPromise = ai.models.generateContent({
          model: "gemini-3.8-flash-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: spokenText,
                  speechMetadata: {
                    style: "Warm, natural, clear Indian female academic sales counselor speaking conversational Hinglish with realistic human rhythm and breathing"
                  }
                }
              ]
            }
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        });
        const ttsTimeout = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("TTS timeout")), 8500)
        );
        const ttsResponse = await Promise.race([ttsPromise, ttsTimeout]);
        audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr) {
        console.warn("TTS generation warning:", ttsErr?.message || ttsErr);
      }
    }
    res.json({
      reply: replyText,
      recommendedPlan,
      suggestedQuestions,
      audioBase64,
      audioFormat: audioBase64 ? "audio/wav" : null,
      persona: "aditi"
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Aoede" } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }
    if (!ai) {
      res.status(503).json({ error: "Gemini API not configured" });
      return;
    }
    const spokenText = text.replace(/₹\s*(\d+)/g, "$1 Rupees").replace(/₹/g, "Rupees ").replace(/[—–]/g, ", ").replace(/[*#_`]/g, "");
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: spokenText,
              speechMetadata: {
                style: "Warm, natural, clear Indian female academic sales counselor speaking conversational Hinglish with realistic human rhythm and breathing"
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }
          }
        }
      }
    });
    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      res.status(500).json({ error: "No audio returned" });
      return;
    }
    res.json({
      audioBase64,
      mimeType: "audio/wav"
    });
  } catch (error) {
    console.error("TTS endpoint error:", error);
    res.status(500).json({ error: error?.message || "TTS generation failed" });
  }
});
app.post("/api/leads", (req, res) => {
  const { name, phone, email, targetYear, planPreference, notes } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: "Name and Phone number are required" });
    return;
  }
  const newLead = {
    id: `lead-${Date.now()}`,
    name,
    phone,
    email: email || "",
    targetYear: targetYear || "2027",
    planPreference: planPreference || "Select 360 Pro (\u20B911,000)",
    notes: notes || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  leads.unshift(newLead);
  res.status(201).json({ success: true, lead: newLead });
});
app.get("/api/leads", (_req, res) => {
  res.json({ leads });
});
var STREAMLIT_APP_CODE = `"""
SRIJAN PRELIMS PROGRAM 2027 - AI Voice Sales Agent
Deployable on Streamlit Community Cloud (share.streamlit.io)
Integrated with GitHub and Google GenAI SDK
"""

import streamlit as st
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Page Configuration
st.set_page_config(
    page_title="SRIJAN 2027 - AI Voice Sales Agent",
    page_icon="\u{1F393}",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #FF6B00 0%, #FFA800 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #94A3B8;
        margin-bottom: 1.5rem;
    }
    .plan-card {
        padding: 1.5rem;
        border-radius: 12px;
        background-color: #1E293B;
        border: 1px solid #334155;
        margin-bottom: 1rem;
    }
    .badge-best-value {
        background-color: #F59E0B;
        color: #0F172A;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

# System Prompt with SRIJAN 2027 Program Features
SRIJAN_SYSTEM_INSTRUCTION = """
You are an expert, consultative, and encouraging AI Voice Sales Counselor for:
"SRIJAN PRELIMS PROGRAM 2027 - ENGLISH" by PWOnlyIAS.

PROGRAM DETAILS:
- Target Exam: UPSC Civil Services Examination (CSE) Prelims 2027
- Medium: English (Hindi & Hinglish also available)
- Start Date: 18 November 2026 | End Date: 9 May 2027 | Validity: 30 May 2027
- Mode: Online only with in-person mentorship at PWOnlyIAS offline centers.

PRICING TIERS:
1. Base Plan: \u20B9 5,000
   - Test Series: 68 Daily Tests (30 GS + 10 CSAT), 6 Subject Tests (100 GS), 5 CA Tests (100 GS), 8 FLTs (100 GS + 80 CSAT).
   - Special Tests: Economic Survey, Budget, India Year Book.
   - Mentorship: Audio Mentorship request form + Offline PWOnlyIAS Centers.

2. Select 360 Plan: \u20B9 10,000
   - Base Plan included + 70 Prelims GS Crash Course classes.
   - Faculty: Nikhil Ram Sir (Polity 13, IR 2), Shivam Yash Sir (Geography 11, Env 4), Ranchan Kaul Sir (Economy 10), Sonpriya Mam (Ancient 5, Medieval 5, Art & Culture 5), Vikas Ahlawat Sir (Modern History 9), Manjeet Choudhary Sir (Sci & Tech 4).
   - CSAT Course: 37 classes by Rishav Sharma Sir (13 Reading Comprehension, 13 Reasoning, 11 Quant).
   - Current Affairs: 1-Year Month-wise by Prashant Tiwari Sir.
   - Mentorship: Fortnightly 14-day check-ins, Performance Analysis, Mentorship by UPSC Toppers.

3. Select 360 Pro Plan: \u20B9 11,000 (BEST VALUE!)
   - Everything in Select 360 PLUS:
   - Doorstep Delivery of 2 Hard Copy Booklets:
     * GS - 32 Year Solved PYQs Booklet (Hard Copy)
     * CSAT - 16 Year Solved PYQs Booklet (Hard Copy)
   - SALES NOTE: Only \u20B91,000 more than 360 plan for two physical solved PYQ books!

CRITICAL LANGUAGE INSTRUCTION:
- Speak strictly in natural, friendly HINGLISH (Hindi + English mix in Roman script).
- Combine everyday conversational Hindi ("Aapka swagat hai", "bilkul tension mat lijiye", "is plan mein aapko milega") with standard UPSC English terminology ("Prelims 2027", "Test Series", "Crash Course", "CSAT", "Hard Copy Booklets").
- Keep responses to 2 to 4 spoken sentences.
- Never use markdown tables or bullet points in voice responses.
- Persona is Aditi (Female Counselor at PWOnlyIAS).
"""

# Sidebar: Controls & API Key
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80", use_container_width=True)
    st.title("Aditi \u2022 Voice AI")
    st.caption("Senior UPSC Strategy & Sales Counselor (Hinglish)")
    
    api_key = st.text_input(
        "Gemini API Key",
        value=os.getenv("GEMINI_API_KEY", ""),
        type="password",
        help="Enter your Google Gemini API Key or set GEMINI_API_KEY in .streamlit/secrets.toml"
    )
    
    voice_name = "Kore"  # Female voice
    
    st.markdown("---")
    st.subheader("SRIJAN 2027 Plans")
    st.markdown("""
    - **Base Plan**: \u20B9 5,000 (Test Series + Mentorship)
    - **Select 360**: \u20B9 10,000 (Classes + CSAT + Topper Mentorship)
    - **Select 360 Pro**: \u20B9 11,000 (Everything + 2 Hardcopy PYQ Books)
    """)

# Main Content Header
col1, col2 = st.columns([3, 1])
with col1:
    st.markdown('<div class="main-header">SRIJAN 2027 - AI Voice Sales Agent</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Interactive Hinglish voice consultation with Counselor Aditi (PWOnlyIAS)</div>', unsafe_allow_html=True)
with col2:
    st.markdown('<span class="badge-best-value">\u{1F525} BATCH STARTS 18 NOV 2026</span>', unsafe_allow_html=True)

# Initialize Chat History (Direct Q&A, no initial greeting)
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display Chat Messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if "audio" in message:
            st.audio(message["audio"], format="audio/wav")

# Voice/Audio Input & Text Chat
user_prompt = st.chat_input("Speak or type your question in Hinglish / English...")

# Suggested Quick Action Buttons in Hinglish
st.markdown("**Quick Inquiries (Hinglish):**")
quick_cols = st.columns(4)
if quick_cols[0].button("Select 360 Pro kyu lein?"):
    user_prompt = "Select 360 Pro mein extra \u20B91,000 dekar kya benefits milenge?"
if quick_cols[1].button("CSAT classes details"):
    user_prompt = "Rishav Sharma Sir CSAT kaise cover karwayenge?"
if quick_cols[2].button("Faculty kaun hain?"):
    user_prompt = "GS aur CSAT ke teachers kaun-kaun hain?"
if quick_cols[3].button("Batch schedule & validity"):
    user_prompt = "Batch kab start hoga aur validity kab tak hai?"

if user_prompt:
    st.session_state.messages.append({"role": "user", "content": user_prompt})
    with st.chat_message("user"):
        st.markdown(user_prompt)

    with st.chat_message("assistant"):
        with st.spinner("Counselor is answering..."):
            client = genai.Client(api_key=api_key or os.getenv("GEMINI_API_KEY", ""))
            
            chat_history = []
            for msg in st.session_state.messages[:-1]:
                chat_history.append(types.Content(
                    role="model" if msg["role"] == "assistant" else "user",
                    parts=[types.Part.from_text(text=msg["content"])]
                ))
            
            # Generate Text Response
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=chat_history + [types.Content(role="user", parts=[types.Part.from_text(text=user_prompt)])],
                config=types.GenerateContentConfig(
                    system_instruction=SRIJAN_SYSTEM_INSTRUCTION
                )
            )
            reply_text = response.text or "I am happy to assist you with the SRIJAN 2027 Prelims program."
            st.markdown(reply_text)
            
            # Generate Audio Response via Gemini TTS
            audio_bytes = None
            try:
                tts_resp = client.models.generate_content(
                    model="gemini-3.8-flash-lite-tts",
                    contents=[types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=reply_text)]
                    )],
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
                            )
                        )
                    )
                )
                cand = tts_resp.candidates[0].content.parts[0]
                if cand.inline_data:
                    audio_bytes = cand.inline_data.data
                    st.audio(audio_bytes, format="audio/wav")
            except Exception as tts_err:
                st.info("Audio generation fallback: Voice synthesis ready.")
            
            msg_data = {"role": "assistant", "content": reply_text}
            if audio_bytes:
                msg_data["audio"] = audio_bytes
            st.session_state.messages.append(msg_data)
`;
var STREAMLIT_REQUIREMENTS = `streamlit>=1.39.0
google-genai>=0.1.1
python-dotenv>=1.0.0
`;
var STREAMLIT_CONFIG_TOML = `[theme]
primaryColor = "#F59E0B"
backgroundColor = "#0F172A"
secondaryBackgroundColor = "#1E293B"
textColor = "#F8FAFC"
font = "sans serif"

[server]
port = 8501
enableCORS = false
enableXsrfProtection = false
`;
var STREAMLIT_ENV_EXAMPLE = `# Streamlit Community Cloud / Local Environment Variables
GEMINI_API_KEY="your-gemini-api-key-here"
`;
var STREAMLIT_README = `# SRIJAN PRELIMS PROGRAM 2027 - AI Voice Sales Agent (Streamlit)

An interactive conversational AI Voice Sales Counselor built for the **PWOnlyIAS SRIJAN Prelims Program 2027 - English Batch**.

## Features
- **AI Voice Counselor**: Integrated with Google Gemini 3.8 Flash and Gemini TTS for realistic spoken sales consultation.
- **Full Knowledge Base**: Covers Base Plan (\u20B95,000), Select 360 (\u20B910,000), and Select 360 Pro (\u20B911,000).
- **Course Schedule**: Start Date 18 Nov 2026, End Date 9 May 2027, Validity 30 May 2027.
- **Faculty Details**: Nikhil Ram Sir, Shivam Yash Sir, Ranchan Kaul Sir, Sonpriya Mam, Vikas Ahlawat Sir, Rishav Sharma Sir, Prashant Tiwari Sir.
- **Objection Handling**: CSAT preparation fears, test series depth (68 Daily, 6 Subject, 8 FLTs), and PYQ booklet delivery.

## How to Run Locally

1. Clone your repository:
\`\`\`bash
git clone <your-repo-url>
cd <your-repo-directory>
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Set your Gemini API Key in \`.env\`:
\`\`\`bash
echo 'GEMINI_API_KEY="your-api-key"' > .env
\`\`\`

4. Launch Streamlit:
\`\`\`bash
streamlit run app.py
\`\`\`

## 1-Click Deployment to Streamlit Community Cloud (Free)
1. Push this repository to GitHub.
2. Visit [share.streamlit.io](https://share.streamlit.io).
3. Connect your GitHub account and select this repository.
4. Set Main file path: \`app.py\`.
5. Under **Advanced Settings > Secrets**, add:
\`\`\`toml
GEMINI_API_KEY = "your-gemini-api-key"
\`\`\`
6. Click **Deploy**!
`;
app.get("/api/export-files", (_req, res) => {
  res.json({
    files: [
      { name: "app.py", content: STREAMLIT_APP_CODE, language: "python" },
      { name: "requirements.txt", content: STREAMLIT_REQUIREMENTS, language: "text" },
      { name: ".streamlit/config.toml", content: STREAMLIT_CONFIG_TOML, language: "toml" },
      { name: ".env.example", content: STREAMLIT_ENV_EXAMPLE, language: "text" },
      { name: "README.md", content: STREAMLIT_README, language: "markdown" }
    ]
  });
});
app.post("/api/github/push", async (req, res) => {
  try {
    const { githubToken, repoFullName, branch = "main" } = req.body;
    if (!githubToken || !repoFullName) {
      res.status(400).json({ error: "GitHub Token and Repository name (username/repo) are required" });
      return;
    }
    const filesToPush = [
      { path: "app.py", content: STREAMLIT_APP_CODE },
      { path: "requirements.txt", content: STREAMLIT_REQUIREMENTS },
      { path: ".streamlit/config.toml", content: STREAMLIT_CONFIG_TOML },
      { path: ".env.example", content: STREAMLIT_ENV_EXAMPLE },
      { path: "README.md", content: STREAMLIT_README }
    ];
    const results = [];
    for (const file of filesToPush) {
      let sha;
      const getFileUrl = `https://api.github.com/repos/${repoFullName}/contents/${file.path}?ref=${branch}`;
      const checkResp = await fetch(getFileUrl, {
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "aistudio-srijan-sales-agent"
        }
      });
      if (checkResp.ok) {
        const fileData = await checkResp.json();
        sha = fileData.sha;
      }
      const putUrl = `https://api.github.com/repos/${repoFullName}/contents/${file.path}`;
      const bodyPayload = {
        message: `Deploy SRIJAN 2027 Voice Sales Agent: ${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
        branch
      };
      if (sha) {
        bodyPayload.sha = sha;
      }
      const putResp = await fetch(putUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "aistudio-srijan-sales-agent"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!putResp.ok) {
        const errJson = await putResp.json();
        throw new Error(`Failed to push ${file.path}: ${errJson.message || putResp.statusText}`);
      }
      results.push({ path: file.path, status: sha ? "updated" : "created" });
    }
    res.json({
      success: true,
      repo: repoFullName,
      branch,
      pushedFiles: results,
      streamlitDeployUrl: `https://share.streamlit.io/deploy?repository=${encodeURIComponent(repoFullName)}&branch=${encodeURIComponent(branch)}&mainModule=app.py`
    });
  } catch (error) {
    console.error("GitHub push error:", error);
    res.status(500).json({ error: error?.message || "Failed to push to GitHub" });
  }
});
async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const possibleDistPaths = [
      path.resolve(process.cwd(), "dist"),
      path.resolve(__dirname, "..", "dist"),
      path.resolve(__dirname, "dist")
    ];
    const distPath = possibleDistPaths.find((p) => fs.existsSync(p)) || possibleDistPaths[0];
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application build not found");
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SRIJAN 2027 Sales Agent Server running on port ${PORT}`);
  });
}
startServer();
