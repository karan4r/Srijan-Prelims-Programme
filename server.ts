import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { resolveSrijanQuery, isSrijanFactualQuery } from './src/data/srijanResolver.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory lead storage
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  targetYear: string;
  planPreference: string;
  notes?: string;
  createdAt: string;
}
const leads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.s@example.com',
    targetYear: '2027',
    planPreference: 'Select 360 Pro (₹11,000)',
    notes: 'Interested in GS + CSAT solved PYQ hard copies and topper mentorship.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Rahul Verma',
    phone: '+91 91234 56789',
    email: 'rahul.v@example.com',
    targetYear: '2027',
    planPreference: 'Select 360 (₹10,000)',
    notes: 'Needs guidance for Rishav Sharma Sir CSAT classes.',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  }
];

const SRIJAN_PROGRAM_KNOWLEDGE = `
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
   - Base Plan: ₹ 5,000 (87 Tests + Audio Request Form Mentorship + Offline PW Center visits)
   - Select 360 Plan: ₹ 10,000 (Base Plan + 70 GS Classes + 37 CSAT Classes + CA + Fortnightly Topper Mentorship)
   - Select 360 Pro Plan: ₹ 11,000 (Select 360 + 32-Yr GS Solved PYQs Hard Copy Book + 16-Yr CSAT Solved PYQs Hard Copy Book delivered to doorstep).
   - Difference: Only ₹1,000 between 360 and 360 Pro!

7. Dates & Validity:
   - Start Date: 18 November 2026
   - End Date: 9 May 2027
   - Course Validity: 30 May 2027
   - Target Year: UPSC CSE 2027
   - Mode: Online only (with offline PWOnlyIAS centers for mentorship).
   - Medium: English (Hindi and Hinglish batches also available).
`;

// API endpoint for conversational chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], generateVoice = true } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const voiceName = 'Aoede'; // High quality warm human female voice

    let replyText = '';
    let recommendedPlan: string | null = null;
    let suggestedQuestions: string[] = [];

    const trimmed = message.trim();
    const isPureGreeting = /^(hi|hello|namaste|hey|namaskar|pranam)[\s!.]*$/i.test(trimmed);

    if (isPureGreeting) {
      replyText = "Namaste! Main Aditi hoon, aapki SRIJAN 2027 counselor. UPSC Prelims 2027 ke liye hamare paas Base Plan (₹5,000), Select 360 (₹10,000) aur Select 360 Pro (₹11,000 with PYQ books) hain. Aap kya jaanna chahte hain?";
      recommendedPlan = "Select 360 Pro";
      suggestedQuestions = ["CSAT mein kitni classes hain?", "Select 360 Pro mein kya extra hai?", "Total tests kitne hain?"];
    } else if (isSrijanFactualQuery(trimmed)) {
      // Direct fast-path factual response: 0ms latency, 100% accurate, answers in sentence 1
      const resolved = resolveSrijanQuery(trimmed);
      replyText = resolved.reply;
      recommendedPlan = resolved.recommendedPlan;
      suggestedQuestions = resolved.suggestedQuestions;
    } else if (ai) {
      try {
        const formattedContents = history.slice(-4).map((item: { role: string; text: string }) => ({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }],
        }));

        formattedContents.push({
          role: 'user',
          parts: [{
            text: `Aspirant Question: "${trimmed}".
Counselor: Aditi.
CRITICAL INSTRUCTION:
1. Answer the question DIRECTLY in the first sentence with exact figures.
2. DO NOT say "Namaste!", "Hello!", or "Main Aditi hoon" unless user greeted.
3. Language: Fluent, natural HINGLISH (Hindi + English in Latin script). Keep it to 2 to 3 concise spoken sentences.
4. Suggest 3 short Hinglish follow-up questions.`
          }],
        });

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SRIJAN_PROGRAM_KNOWLEDGE,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT' as any,
              properties: {
                reply: {
                  type: 'STRING' as any,
                  description: 'Direct factual spoken response in natural conversational HINGLISH. No greetings unless user greeted. Starts with the exact answer.'
                },
                recommendedPlan: {
                  type: 'STRING' as any,
                  description: 'Recommended plan: "Base Plan", "Select 360", "Select 360 Pro", or "None"'
                },
                suggestedQuestions: {
                  type: 'ARRAY' as any,
                  items: { type: 'STRING' as any },
                  description: '3 short relevant follow-up questions in Hinglish.'
                }
              },
              required: ['reply', 'suggestedQuestions'],
            }
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');
        replyText = parsed.reply || resolveSrijanQuery(trimmed).reply;
        recommendedPlan = parsed.recommendedPlan === 'None' ? null : parsed.recommendedPlan;
        suggestedQuestions = Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions.slice(0, 3) : [];
      } catch (geminiError: any) {
        console.warn('Falling back to direct srijan resolver:', geminiError?.message || geminiError);
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

    // High-fidelity neural female TTS with cleaned spoken prompt
    let audioBase64: string | null = null;
    if (generateVoice && ai && replyText) {
      try {
        const spokenText = replyText
          .replace(/₹\s*(\d+)/g, '$1 Rupees')
          .replace(/₹/g, 'Rupees ')
          .replace(/[—–]/g, ', ')
          .replace(/[*#_`]/g, '');

        const ttsPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: spokenText,
                  speechMetadata: {
                    style: 'Warm, natural, clear Indian female academic sales counselor speaking conversational Hinglish with realistic human rhythm and breathing',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName as any },
              },
            },
          },
        });

        const ttsTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TTS timeout')), 8500)
        );

        const ttsResponse: any = await Promise.race([ttsPromise, ttsTimeout]);
        audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr: any) {
        console.warn('TTS generation warning:', ttsErr?.message || ttsErr);
      }
    }

    res.json({
      reply: replyText,
      recommendedPlan,
      suggestedQuestions,
      audioBase64,
      audioFormat: audioBase64 ? 'audio/wav' : null,
      persona: 'aditi',
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// Dedicated TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Aoede' } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Gemini API not configured' });
      return;
    }

    const spokenText = text
      .replace(/₹\s*(\d+)/g, '$1 Rupees')
      .replace(/₹/g, 'Rupees ')
      .replace(/[—–]/g, ', ')
      .replace(/[*#_`]/g, '');

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            { 
              text: spokenText,
              speechMetadata: {
                style: 'Warm, natural, clear Indian female academic sales counselor speaking conversational Hinglish with realistic human rhythm and breathing',
              },
            }
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice as any },
          },
        },
      },
    });

    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      res.status(500).json({ error: 'No audio returned' });
      return;
    }

    res.json({
      audioBase64,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS endpoint error:', error);
    res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

// Leads API
app.post('/api/leads', (req, res) => {
  const { name, phone, email, targetYear, planPreference, notes } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and Phone number are required' });
    return;
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name,
    phone,
    email: email || '',
    targetYear: targetYear || '2027',
    planPreference: planPreference || 'Select 360 Pro (₹11,000)',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  leads.unshift(newLead);
  res.status(201).json({ success: true, lead: newLead });
});

app.get('/api/leads', (_req, res) => {
  res.json({ leads });
});

// Generated Streamlit Files Repository Export
const STREAMLIT_APP_CODE = `"""
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
    page_icon="🎓",
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
SRIJAN_SYSTEM_INSTRUCTION = \"\"\"
You are an expert, consultative, and encouraging AI Voice Sales Counselor for:
"SRIJAN PRELIMS PROGRAM 2027 - ENGLISH" by PWOnlyIAS.

PROGRAM DETAILS:
- Target Exam: UPSC Civil Services Examination (CSE) Prelims 2027
- Medium: English (Hindi & Hinglish also available)
- Start Date: 18 November 2026 | End Date: 9 May 2027 | Validity: 30 May 2027
- Mode: Online only with in-person mentorship at PWOnlyIAS offline centers.

PRICING TIERS:
1. Base Plan: ₹ 5,000
   - Test Series: 68 Daily Tests (30 GS + 10 CSAT), 6 Subject Tests (100 GS), 5 CA Tests (100 GS), 8 FLTs (100 GS + 80 CSAT).
   - Special Tests: Economic Survey, Budget, India Year Book.
   - Mentorship: Audio Mentorship request form + Offline PWOnlyIAS Centers.

2. Select 360 Plan: ₹ 10,000
   - Base Plan included + 70 Prelims GS Crash Course classes.
   - Faculty: Nikhil Ram Sir (Polity 13, IR 2), Shivam Yash Sir (Geography 11, Env 4), Ranchan Kaul Sir (Economy 10), Sonpriya Mam (Ancient 5, Medieval 5, Art & Culture 5), Vikas Ahlawat Sir (Modern History 9), Manjeet Choudhary Sir (Sci & Tech 4).
   - CSAT Course: 37 classes by Rishav Sharma Sir (13 Reading Comprehension, 13 Reasoning, 11 Quant).
   - Current Affairs: 1-Year Month-wise by Prashant Tiwari Sir.
   - Mentorship: Fortnightly 14-day check-ins, Performance Analysis, Mentorship by UPSC Toppers.

3. Select 360 Pro Plan: ₹ 11,000 (BEST VALUE!)
   - Everything in Select 360 PLUS:
   - Doorstep Delivery of 2 Hard Copy Booklets:
     * GS - 32 Year Solved PYQs Booklet (Hard Copy)
     * CSAT - 16 Year Solved PYQs Booklet (Hard Copy)
   - SALES NOTE: Only ₹1,000 more than 360 plan for two physical solved PYQ books!

CRITICAL LANGUAGE INSTRUCTION:
- Speak strictly in natural, friendly HINGLISH (Hindi + English mix in Roman script).
- Combine everyday conversational Hindi ("Aapka swagat hai", "bilkul tension mat lijiye", "is plan mein aapko milega") with standard UPSC English terminology ("Prelims 2027", "Test Series", "Crash Course", "CSAT", "Hard Copy Booklets").
- Keep responses to 2 to 4 spoken sentences.
- Never use markdown tables or bullet points in voice responses.
- Persona is Aditi (Female Counselor at PWOnlyIAS).
\"\"\"

# Sidebar: Controls & API Key
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80", use_container_width=True)
    st.title("Aditi • Voice AI")
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
    - **Base Plan**: ₹ 5,000 (Test Series + Mentorship)
    - **Select 360**: ₹ 10,000 (Classes + CSAT + Topper Mentorship)
    - **Select 360 Pro**: ₹ 11,000 (Everything + 2 Hardcopy PYQ Books)
    """)

# Main Content Header
col1, col2 = st.columns([3, 1])
with col1:
    st.markdown('<div class="main-header">SRIJAN 2027 - AI Voice Sales Agent</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Interactive Hinglish voice consultation with Counselor Aditi (PWOnlyIAS)</div>', unsafe_allow_html=True)
with col2:
    st.markdown('<span class="badge-best-value">🔥 BATCH STARTS 18 NOV 2026</span>', unsafe_allow_html=True)

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
    user_prompt = "Select 360 Pro mein extra ₹1,000 dekar kya benefits milenge?"
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

const STREAMLIT_REQUIREMENTS = `streamlit>=1.39.0
google-genai>=0.1.1
python-dotenv>=1.0.0
`;

const STREAMLIT_CONFIG_TOML = `[theme]
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

const STREAMLIT_ENV_EXAMPLE = `# Streamlit Community Cloud / Local Environment Variables
GEMINI_API_KEY="your-gemini-api-key-here"
`;

const STREAMLIT_README = `# SRIJAN PRELIMS PROGRAM 2027 - AI Voice Sales Agent (Streamlit)

An interactive conversational AI Voice Sales Counselor built for the **PWOnlyIAS SRIJAN Prelims Program 2027 - English Batch**.

## Features
- **AI Voice Counselor**: Integrated with Google Gemini 3.8 Flash and Gemini TTS for realistic spoken sales consultation.
- **Full Knowledge Base**: Covers Base Plan (₹5,000), Select 360 (₹10,000), and Select 360 Pro (₹11,000).
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

// Export files endpoint
app.get('/api/export-files', (_req, res) => {
  res.json({
    files: [
      { name: 'app.py', content: STREAMLIT_APP_CODE, language: 'python' },
      { name: 'requirements.txt', content: STREAMLIT_REQUIREMENTS, language: 'text' },
      { name: '.streamlit/config.toml', content: STREAMLIT_CONFIG_TOML, language: 'toml' },
      { name: '.env.example', content: STREAMLIT_ENV_EXAMPLE, language: 'text' },
      { name: 'README.md', content: STREAMLIT_README, language: 'markdown' },
    ]
  });
});

// GitHub Direct Push API
app.post('/api/github/push', async (req, res) => {
  try {
    const { githubToken, repoFullName, branch = 'main' } = req.body;

    if (!githubToken || !repoFullName) {
      res.status(400).json({ error: 'GitHub Token and Repository name (username/repo) are required' });
      return;
    }

    const filesToPush = [
      { path: 'app.py', content: STREAMLIT_APP_CODE },
      { path: 'requirements.txt', content: STREAMLIT_REQUIREMENTS },
      { path: '.streamlit/config.toml', content: STREAMLIT_CONFIG_TOML },
      { path: '.env.example', content: STREAMLIT_ENV_EXAMPLE },
      { path: 'README.md', content: STREAMLIT_README },
    ];

    const results = [];

    for (const file of filesToPush) {
      // Check if file already exists to get its SHA
      let sha: string | undefined;
      const getFileUrl = `https://api.github.com/repos/${repoFullName}/contents/${file.path}?ref=${branch}`;
      const checkResp = await fetch(getFileUrl, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aistudio-srijan-sales-agent',
        },
      });

      if (checkResp.ok) {
        const fileData = await checkResp.json();
        sha = fileData.sha;
      }

      // Create or update file
      const putUrl = `https://api.github.com/repos/${repoFullName}/contents/${file.path}`;
      const bodyPayload: any = {
        message: `Deploy SRIJAN 2027 Voice Sales Agent: ${file.path}`,
        content: Buffer.from(file.content).toString('base64'),
        branch,
      };
      if (sha) {
        bodyPayload.sha = sha;
      }

      const putResp = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-srijan-sales-agent',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!putResp.ok) {
        const errJson = await putResp.json();
        throw new Error(`Failed to push ${file.path}: ${errJson.message || putResp.statusText}`);
      }

      results.push({ path: file.path, status: sha ? 'updated' : 'created' });
    }

    res.json({
      success: true,
      repo: repoFullName,
      branch,
      pushedFiles: results,
      streamlitDeployUrl: `https://share.streamlit.io/deploy?repository=${encodeURIComponent(repoFullName)}&branch=${encodeURIComponent(branch)}&mainModule=app.py`,
    });
  } catch (error: any) {
    console.error('GitHub push error:', error);
    res.status(500).json({ error: error?.message || 'Failed to push to GitHub' });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const possibleDistPaths = [
      path.resolve(process.cwd(), 'dist'),
      path.resolve(__dirname, '..', 'dist'),
      path.resolve(__dirname, 'dist'),
    ];
    const distPath = possibleDistPaths.find((p) => fs.existsSync(p)) || possibleDistPaths[0];
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SRIJAN 2027 Sales Agent Server running on port ${PORT}`);
  });
}

startServer();
