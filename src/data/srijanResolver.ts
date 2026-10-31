/**
 * Comprehensive Factual Resolver for SRIJAN PRELIMS PROGRAM 2027 (English)
 * Provides 100% accurate, precise factual answers in natural spoken Hinglish.
 */

export interface SrijanResolvedAnswer {
  reply: string;
  recommendedPlan: string;
  suggestedQuestions: string[];
  isFactualMatch?: boolean;
}

/**
 * Strips accidental acoustic echo or speech-to-text feedback from the agent's own voice
 */
export function cleanSpokenTranscript(rawText: string): string {
  if (!rawText) return '';
  let t = rawText.trim();
  // If the mic picked up Aditi introducing herself or greeting:
  t = t.replace(/^(namaste|hello|hi)?\s*(main\s+aditi\s+hoon|i\s+am\s+aditi)[^.?!]*[.?!]?\s*/gi, '');
  return t.trim();
}

/**
 * Normalizes speech recognition text variants (e.g. "c sat", "see sat", "c-sat" -> "csat")
 */
export function normalizeQuery(query: string): string {
  if (!query) return '';
  let q = query.toLowerCase().trim();
  q = q.replace(/\b(see\s*sat|c\s*sat|c-sat|see\s*sad|c\s*set|c\s*sap|sea\s*sat|si\s*sat)\b/gi, 'csat')
       .replace(/\b(pw\s*only\s*ias|pw\s*ias|only\s*ias)\b/gi, 'pwonlyias')
       .replace(/\b(p\s*y\s*q|pyqs|p\s*y\s*qs)\b/gi, 'pyq')
       .replace(/\b(flts|f\s*l\s*t|flt\s*test)\b/gi, 'flt');
  return q;
}

export function isSrijanFactualQuery(userQuery: string): boolean {
  const q = normalizeQuery(userQuery);
  if (!q) return false;
  return (
    q.includes('csat') ||
    q.includes('class') ||
    q.includes('classes') ||
    q.includes('lecture') ||
    q.includes('faculty') ||
    q.includes('teacher') ||
    q.includes('sir') ||
    q.includes('mam') ||
    q.includes('polity') ||
    q.includes('history') ||
    q.includes('economy') ||
    q.includes('geography') ||
    q.includes('science') ||
    q.includes('current affair') ||
    q.includes('test') ||
    q.includes('mock') ||
    q.includes('plan') ||
    q.includes('price') ||
    q.includes('fee') ||
    q.includes('cost') ||
    q.includes('pro') ||
    q.includes('book') ||
    q.includes('hard copy') ||
    q.includes('pyq') ||
    q.includes('date') ||
    q.includes('start') ||
    q.includes('valid') ||
    q.includes('mentor') ||
    q.includes('offline') ||
    q.includes('medium') ||
    q.includes('language') ||
    q.includes('5000') ||
    q.includes('10000') ||
    q.includes('11000') ||
    q.includes('rishav') ||
    q.includes('shivam') ||
    q.includes('nikhil') ||
    q.includes('ranchan') ||
    q.includes('sonpriya') ||
    q.includes('vikas') ||
    q.includes('manjeet') ||
    q.includes('prashant')
  );
}

export function resolveSrijanQuery(userQuery: string): SrijanResolvedAnswer {
  if (!userQuery) {
    return {
      reply: "Namaste! Main Aditi hoon. SRIJAN Prelims 2027 ke plans, faculty, CSAT classes aur test series ke baare mein aap mujhse kuch bhi poochh sakte hain.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"],
      isFactualMatch: false,
    };
  }

  // Normalize query and fix common voice/STT mistranscriptions
  const q = normalizeQuery(userQuery);

  // 1. FACULTY / TEACHERS SPECIFIC INQUIRIES
  const isAskingFaculty = q.includes('faculty') || q.includes('teacher') || q.includes('teachers') || q.includes('educator') || q.includes('educators') || q.includes('kaun padha') || q.includes('who teaches') || q.includes('sir kaun');

  if (isAskingFaculty) {
    if (q.includes('history') || q.includes('ancient') || q.includes('medieval') || q.includes('modern')) {
      return {
        reply: "History mein: Ancient India, Medieval India aur Art & Culture Sonpriya Mam padhayengi (5+5+5 classes). Modern India ki 9 classes Vikas Ahlawat Sir dwara li jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Polity aur Economy kaun padhayenge?", "CSAT classes kitni hain?", "Kya PYQ books ghar aayengi?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('csat') && !q.includes('gs') && !q.includes('all')) {
      return {
        reply: "CSAT ka pura course Rishav Sharma Sir padhayenge: Reading Comprehension ki 13 classes, Logical Reasoning ki 13 classes, aur Quantitative Aptitude ki 11 classes.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["CSAT mein total kitni classes hain?", "Base Plan mein CSAT classes hain kya?", "Select 360 Pro ka price kya hai?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('polity') || q.includes('ir')) {
      return {
        reply: "Polity (13 classes) aur International Relations (2 classes) Nikhil Ram Sir dwara padhayi jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Economy kaun padhayenge?", "CSAT faculty kaun hain?", "Select 360 Pro ki fees kya hai?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('economy')) {
      return {
        reply: "Indian Economy ki 10 classes Ranchan Kaul Sir dwara li jayengi, jisme core macroeconomics, banking aur budget cover hoga.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Geography kaun padhayenge?", "CSAT classes kitni hain?", "Tests kitne honge?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('geography') || q.includes('environment')) {
      return {
        reply: "Geography ki 11 classes aur Environment & Ecology ki 4 classes Shivam Yash Sir padhayenge.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Science & Tech kaun padha rahe hain?", "Total tests kitne hain?", "Select 360 Pro ki fees kitni hai?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('science')) {
      return {
        reply: "Science & Technology ki 4 classes Manjeet Choudhary Sir dwara li jayengi.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Current Affairs kaun padhayenge?", "CSAT classes kitni hain?", "Select 360 Pro kyu lein?"],
        isFactualMatch: true,
      };
    }
    if (q.includes('current affair') || q.includes('ca')) {
      return {
        reply: "Current Affairs Course Prashant Tiwari Sir lenge, jisme 1 saal ke high-yield current affairs month-wise cover honge.",
        recommendedPlan: "Select 360",
        suggestedQuestions: ["Current Affairs ke tests kitne hain?", "CSAT course details batayein", "Select 360 Pro mein books milti hain kya?"],
        isFactualMatch: true,
      };
    }
    // All teachers / general faculty list
    return {
      reply: "Hamare star faculty hain: Nikhil Ram Sir (Polity & IR), Shivam Yash Sir (Geography & Environment), Ranchan Kaul Sir (Economy), Sonpriya Mam (Ancient, Medieval, Art & Culture), Vikas Ahlawat Sir (Modern India), Manjeet Choudhary Sir (Science & Tech), Prashant Tiwari Sir (Current Affairs), aur Rishav Sharma Sir (CSAT).",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "History mein kitni classes hain?", "Select 360 Pro ki fees kya hai?"],
      isFactualMatch: true,
    };
  }

  // 2. CSAT IN BASE PLAN CHECK
  if (q.includes('csat') && (q.includes('base') || q.includes('5000'))) {
    return {
      reply: "Base Plan (₹5,000) mein CSAT ke tests shamil hain — 68 Daily Tests mein 10 CSAT Qs aur 8 Full Length Tests mein 80 CSAT Qs. Lekin CSAT ki 37 classes Select 360 (₹10,000) aur Select 360 Pro (₹11,000) plans mein hi shamil hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Select 360 ki fees kitni hai?", "CSAT mein subject-wise classes kitni hain?", "Select 360 Pro mein books milti hain kya?"],
      isFactualMatch: true,
    };
  }

  // 3. CSAT SPECIFIC CLASSES & DETAILS (Priority Match)
  if (q.includes('csat') || q.includes('rishav') || q.includes('quantitative') || q.includes('reasoning') || q.includes('comprehension') || (q.includes('math') && !q.includes('aftermath'))) {
    return {
      reply: "Select 360 aur 360 Pro plans mein CSAT ki total 37 classes hongi, jo Rishav Sharma Sir lenge: 13 classes Reading Comprehension, 13 classes Logical Reasoning, aur 11 classes Quantitative Aptitude ki rahengi. Saath hi daily 10 CSAT questions aur 8 Full Length CSAT mock tests bhi milenge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Base Plan mein CSAT classes hain kya?", "CSAT ki 16-year PYQ book kaise milegi?", "GS crash course mein kitni classes hain?"],
      isFactualMatch: true,
    };
  }

  // 4. TOTAL CLASSES & CURRICULUM
  if ((q.includes('how many') || q.includes('kitni') || q.includes('total') || q.includes('number of') || q.includes('kitne')) && 
      (q.includes('class') || q.includes('classes') || q.includes('lecture') || q.includes('lectures') || q.includes('session'))) {
    return {
      reply: "SRIJAN 2027 mein total 107 classes hongi: lagbhag 70 classes GS Prelims Crash Course ki hain aur 37 classes CSAT ki hain jo Rishav Sharma Sir padhayenge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein subject-wise classes kitni hain?", "GS ke faculty members kaun hain?", "Select 360 Pro ka price kya hai?"],
      isFactualMatch: true,
    };
  }

  // 5. HISTORY FACULTY & CLASSES (Sonpriya Mam & Vikas Ahlawat Sir)
  if (q.includes('history') || q.includes('ancient') || q.includes('medieval') || q.includes('modern') || q.includes('art') || q.includes('culture') || q.includes('sonpriya') || q.includes('vikas')) {
    return {
      reply: "History mein: Ancient India ki 5 classes, Medieval India ki 5 classes, aur Art & Culture ki 5 classes Sonpriya Mam padhayengi. Modern India ki 9 classes Vikas Ahlawat Sir dwara li jayengi.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Polity aur Economy kaun padhayenge?", "CSAT classes kitni hain?", "Kya PYQ books ghar aayengi?"],
      isFactualMatch: true,
    };
  }

  // 6. POLITY & INTERNATIONAL RELATIONS (Nikhil Ram Sir)
  if (q.includes('polity') || q.includes('constitution') || q.includes('ir') || q.includes('international relations') || q.includes('nikhil')) {
    return {
      reply: "Polity ki total 13 classes aur International Relations ki 2 classes Nikhil Ram Sir dwara li jayengi, jisme high-yield concepts aur prelims PYQs cover honge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Economy ki kitni classes hain?", "CSAT faculty kaun hain?", "Tests kitne honge?"],
      isFactualMatch: true,
    };
  }

  // 7. INDIAN ECONOMY (Ranchan Kaul Sir)
  if (q.includes('economy') || q.includes('economic') || q.includes('ranchan') || q.includes('banking') || q.includes('inflation')) {
    return {
      reply: "Indian Economy ki 10 classes Ranchan Kaul Sir lenge, jisme macroeconomics, banking, inflation, fiscal policy aur budget cover kiya jayega.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Geography aur Environment kaun padhayenge?", "CSAT ki classes kitni hain?", "Select 360 Pro mein kya extra hai?"],
      isFactualMatch: true,
    };
  }

  // 8. GEOGRAPHY & ENVIRONMENT (Shivam Yash Sir)
  if (q.includes('geography') || q.includes('environment') || q.includes('ecology') || q.includes('shivam')) {
    return {
      reply: "Geography ki 11 classes aur Environment & Ecology ki 4 classes Shivam Yash Sir padhayenge, jisme mapping, climatology aur biodiversity hotspots shamil hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Science & Tech kaun padha rahe hain?", "Total tests kitne hain?", "Select 360 Pro ki fees kitni hai?"],
      isFactualMatch: true,
    };
  }

  // 9. SCIENCE & TECHNOLOGY (Manjeet Choudhary Sir)
  if (q.includes('science') || q.includes('tech') || q.includes('manjeet')) {
    return {
      reply: "Science & Technology ki 4 classes Manjeet Choudhary Sir dwara li jayengi, jisme space missions, biotechnology, AI aur defence technology cover hogi.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Current Affairs kaun padhayenge?", "CSAT classes kitni hain?", "Select 360 Pro kyu lein?"],
      isFactualMatch: true,
    };
  }

  // 10. CURRENT AFFAIRS (Prashant Tiwari Sir)
  if (q.includes('current affair') || q.includes('ca') || q.includes('prashant')) {
    return {
      reply: "Current Affairs Course Prashant Tiwari Sir lenge, jisme 1 saal ke high-yield current affairs month-wise prelims orientation ke saath cover honge.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Current Affairs ke tests kitne hain?", "CSAT course details batayein", "Select 360 Pro mein books milti hain kya?"],
      isFactualMatch: true,
    };
  }

  // 9. ALL FACULTY / TEACHERS LIST
  if (q.includes('faculty') || q.includes('teacher') || q.includes('teachers') || q.includes('educator') || q.includes('educators') || q.includes('sir') || q.includes('mam') || q.includes('padha')) {
    return {
      reply: "Hamare star faculty hain: Nikhil Ram Sir (Polity & IR), Shivam Yash Sir (Geography & Environment), Ranchan Kaul Sir (Economy), Sonpriya Mam (Ancient, Medieval, Art & Culture), Vikas Ahlawat Sir (Modern India), Manjeet Choudhary Sir (Science & Tech), aur Rishav Sharma Sir (CSAT).",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "History mein kitni classes hain?", "Select 360 Pro ki fees kya hai?"]
    };
  }

  // 10. TOTAL TESTS & TEST SERIES BREAKDOWN (87 Tests)
  if (q.includes('test') || q.includes('tests') || q.includes('flt') || q.includes('mock') || q.includes('daily test') || q.includes('schedule') || q.includes('series')) {
    return {
      reply: "Program mein total 87 tests hain: 68 Daily Tests (30 GS + 10 CSAT Qs), 6 Subject Completion Tests (100 GS Qs), 5 Current Affairs Tests (100 GS Qs), aur 8 Full Length Tests (100 GS + 80 CSAT Qs), plus Budget aur Economic Survey ke special tests.",
      recommendedPlan: "Base Plan",
      suggestedQuestions: ["Base Plan aur Select 360 mein kya fark hai?", "Offline centers par tests de sakte hain?", "Select 360 Pro ka price kya hai?"]
    };
  }

  // 11. SELECT 360 PRO & PHYSICAL BOOKS
  if (q.includes('360 pro') || q.includes('pro plan') || q.includes('book') || q.includes('books') || q.includes('hard copy') || q.includes('hardcopy') || q.includes('pyq') || q.includes('11000') || q.includes('11,000') || q.includes('kitab')) {
    return {
      reply: "Select 360 Pro Plan ₹11,000 ka hai — yaani regular 360 se sirf ₹1,000 extra! Isme classes aur tests ke saath GS ke 32 saal aur CSAT ke 16 saal ke solved PYQs ke 2 physical hard copy booklets aapke ghar par deliver honge.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Book delivery mein kitne din lagte hain?", "CSAT classes kon lega?", "Batch kab se shuru ho raha hai?"]
    };
  }

  // 12. FEES, PRICING & PLAN COMPARISON
  if (q.includes('fee') || q.includes('fees') || q.includes('price') || q.includes('cost') || q.includes('kitna') || q.includes('paise') || q.includes('5000') || q.includes('10000') || q.includes('rate') || q.includes('plan')) {
    return {
      reply: "Batch ke 3 plans hain: Base Plan ₹5,000 (Test Series + Mentorship), Select 360 Plan ₹10,000 (GS Classes + CSAT + Topper Mentorship), aur Select 360 Pro Plan ₹11,000 (All features + 2 Solved PYQ Hard Copy Books delivered home).",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Select 360 Pro kyu choose karna chahiye?", "CSAT classes mein kya-kya hai?", "Batch validity kab tak hai?"]
    };
  }

  // 13. DATES & VALIDITY
  if (q.includes('date') || q.includes('start') || q.includes('validity') || q.includes('valid') || q.includes('end') || q.includes('kab') || q.includes('khatam') || q.includes('duration') || q.includes('november')) {
    return {
      reply: "SRIJAN Prelims 2027 batch 18 November 2026 se start hoga, 9 May 2027 ko complete hoga, aur course validity 30 May 2027 tak rahegi.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Fees kitni hai?", "CSAT classes kitni hain?", "PYQ books kaise milengi?"]
    };
  }

  // 14. MENTORSHIP & OFFLINE CENTERS
  if (q.includes('mentor') || q.includes('mentorship') || q.includes('topper') || q.includes('guidance') || q.includes('offline') || q.includes('center') || q.includes('visit')) {
    return {
      reply: "Base Plan mein Audio Mentorship request form aur offline PWOnlyIAS centers par walk-in mentorship hai. Select 360 aur Pro plans mein har 14 din mein personalized mentor follow-ups aur UPSC Toppers se sessions milte hain.",
      recommendedPlan: "Select 360",
      suggestedQuestions: ["Select 360 Pro ki fees kya hai?", "CSAT mein kitni classes hain?", "Test series schedule kya hai?"]
    };
  }

  // 15. MEDIUM & MODE
  if (q.includes('medium') || q.includes('language') || q.includes('bhasha') || q.includes('english') || q.includes('hindi') || q.includes('online') || q.includes('mode')) {
    return {
      reply: "SRIJAN Prelims 2027 batch dono English aur Hindi medium mein available hai! Aap screen par diye gaye 'Buy English' ya 'Buy हिंदी Medium' buttons se directly PhysicsWallah par enroll kar sakte hain. Course validity 30 May 2027 tak rahegi.",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["Select 360 Pro fees kitni hai?", "CSAT classes kitni hain?", "Course validity kab tak hai?"]
    };
  }

  // 16. GREETINGS
  if (q === 'hi' || q === 'hello' || q === 'namaste' || q === 'hey' || q === 'namaskar') {
    return {
      reply: "Namaste! Main Aditi hoon, aapki SRIJAN 2027 counselor. UPSC Prelims 2027 ke liye hamare paas Base Plan (₹5,000), Select 360 (₹10,000) aur Select 360 Pro (₹11,000 with PYQ books) hain. Aap kya jaanna chahte hain?",
      recommendedPlan: "Select 360 Pro",
      suggestedQuestions: ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"]
    };
  }

  // General fallback with key batch facts
  return {
    reply: "SRIJAN Prelims 2027 batch 18 November 2026 se shuru ho raha hai. Isme 107 total classes (70 GS + 37 CSAT by Rishav Sharma Sir), 87 Tests, aur Select 360 Pro mein 32-year GS aur 16-year CSAT solved PYQ hard copy books doorstep delivered hain.",
    recommendedPlan: "Select 360 Pro",
    suggestedQuestions: ["CSAT classes kitni hain?", "Select 360 Pro kyu lena chahiye?", "Batch kab start hoga?"]
  };
}
