import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, Send, 
  HelpCircle, CheckCircle2, ChevronRight, X, ShoppingCart, ExternalLink
} from 'lucide-react';
import { ChatMessage, VoicePersona } from '../types';
import { SUGGESTED_VOICE_PROMPTS, PW_BATCH_ENROLL_ENGLISH_URL, PW_BATCH_ENROLL_HINDI_URL, PW_BATCH_ENROLL_URL } from '../data/srijanData';
import { resolveSrijanQuery, cleanSpokenTranscript, normalizeQuery } from '../data/srijanResolver';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSelectPlan?: (planId: string) => void;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onSelectPlan,
}) => {
  const [inCall, setInCall] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [persona, setPersona] = useState<VoicePersona>('aditi');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<any>(null);

  // Call duration counter
  useEffect(() => {
    if (inCall) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inCall]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English for UPSC context

      recognition.onstart = () => {
        // Stop any ongoing speech playback to prevent acoustic feedback loop into mic
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        window.speechSynthesis?.cancel();
        setIsAgentSpeaking(false);
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const rawTranscript = event.results[0][0].transcript;
        if (!rawTranscript) return;
        const cleaned = cleanSpokenTranscript(rawTranscript);
        if (cleaned && cleaned.trim().length > 1) {
          handleSendMessage(cleaned.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(`Mic issue: ${event.error}. You can also type below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Handle call start - Direct Q&A mode with zero initial greeting
  const startCall = (customInitial?: string) => {
    setInCall(true);
    setCallDuration(0);
    setSpeechError(null);
    setMessages([]);

    if (customInitial) {
      handleSendMessage(customInitial);
    } else {
      // Promptly arm microphone so user can ask their question directly
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Browser might need user click on mic button
          }
        }
      }, 350);
    }
  };

  // Play audio either from Gemini neural TTS base64 or high-fidelity Web Speech fallback
  const playAgentAudio = (text: string, currentPersona: VoicePersona, base64Audio?: string) => {
    // Stop any ongoing speech
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    window.speechSynthesis?.cancel();

    if (base64Audio) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audioPlayerRef.current = audio;
        setIsAgentSpeaking(true);

        audio.onended = () => {
          setIsAgentSpeaking(false);
          // Auto-resume listening for next user question
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // ignore
              }
            }
          }, 400);
        };

        audio.onerror = () => {
          setIsAgentSpeaking(false);
          fallbackWebSpeech(text);
        };

        audio.play().catch(() => {
          fallbackWebSpeech(text);
        });
        return;
      } catch (err) {
        console.warn('Base64 playback failed, using fallback:', err);
      }
    }

    fallbackWebSpeech(text);
  };

  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05; // Warm, natural human female cadence

    // Pick natural female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = 
      voices.find(v => /natural|online/i.test(v.name) && /female|swara|heera|neerja|priya|kalpana/i.test(v.name)) ||
      voices.find(v => (v.lang === 'hi-IN' || v.lang === 'en-IN') && /female|swara|heera|kalpana|aditi|zira/i.test(v.name)) ||
      voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN') ||
      voices.find(v => /female|woman|zira|samantha/i.test(v.name));
    
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => setIsAgentSpeaking(true);
    utterance.onend = () => {
      setIsAgentSpeaking(false);
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // ignore
          }
        }
      }, 400);
    };
    utterance.onerror = () => setIsAgentSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const endCall = () => {
    setInCall(false);
    setIsListening(false);
    setIsAgentSpeaking(false);
    setIsThinking(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          // Stop agent speech when user wants to talk
          if (audioPlayerRef.current) audioPlayerRef.current.pause();
          window.speechSynthesis?.cancel();
          setIsAgentSpeaking(false);
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Error starting speech:', e);
        }
      } else {
        setSpeechError('Speech recognition not supported in this browser. Please type below.');
      }
    }
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    // Stop speaking if playing
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    window.speechSynthesis?.cancel();
    setIsAgentSpeaking(false);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          persona: 'aditi',
          generateVoice: true, // Use Gemini neural Indian female TTS for ultra-realistic human voice
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach counselor endpoint');
      }

      const data = await response.json();
      const resolved = resolveSrijanQuery(userText);
      const reply = data.reply || resolved.reply;

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioBase64: data.audioBase64,
        recommendedPlan: data.recommendedPlan || resolved.recommendedPlan,
        suggestedQuestions: data.suggestedQuestions && data.suggestedQuestions.length > 0 
          ? data.suggestedQuestions 
          : resolved.suggestedQuestions,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsThinking(false);

      if (audioEnabled) {
        playAgentAudio(reply, 'aditi', data.audioBase64);
      }
    } catch (err: any) {
      console.warn('Network or server exception, using factual resolver fallback:', err);
      setIsThinking(false);
      const resolved = resolveSrijanQuery(userText);
      const fallbackMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: resolved.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedPlan: resolved.recommendedPlan,
        suggestedQuestions: resolved.suggestedQuestions,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (audioEnabled) {
        playAgentAudio(resolved.reply, 'aditi');
      }
    }
  };

  // Auto-connect call directly on modal open (no initial greeting, user directly asks questions)
  useEffect(() => {
    if (isOpen) {
      startCall(initialPrompt);
    } else {
      endCall();
    }
  }, [isOpen, initialPrompt]);

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-amber-500/20">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                AI
              </div>
              {inCall && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Aditi</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Hinglish Counselor • Female Voice</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">PWOnlyIAS • SRIJAN PRELIMS 2027 Voice AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300 font-medium">
              <span>Hinglish</span>
            </div>

            {/* Direct Buy English Button */}
            <a
              href={PW_BATCH_ENROLL_ENGLISH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all hover:scale-102 cursor-pointer"
              title="Buy English Medium Batch on PW.live"
            >
              <ShoppingCart className="w-3 h-3 fill-slate-950" />
              <span>Buy (English)</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>

            {/* Direct Buy Hindi Button */}
            <a
              href={PW_BATCH_ENROLL_HINDI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all hover:scale-102 cursor-pointer"
              title="Buy Hindi Medium Batch on PW.live"
            >
              <ShoppingCart className="w-3 h-3 fill-slate-950" />
              <span>Buy (हिंदी)</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>

            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Voice output enabled' : 'Voice output muted'}
              className={`p-2.5 rounded-xl border transition-colors ${
                audioEnabled
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
                  : 'bg-slate-800/50 border-slate-800 text-slate-500'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                endCall();
                onClose();
              }}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call Visualizer Banner (When Active) */}
        {inCall ? (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/50 p-6 border-b border-slate-800/70 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient animated glow */}
            <div className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
              isAgentSpeaking 
                ? 'bg-amber-500/15 scale-125' 
                : isListening 
                ? 'bg-emerald-500/15 scale-110' 
                : isThinking 
                ? 'bg-blue-500/15 animate-pulse'
                : 'bg-amber-500/5 scale-90'
            }`} />

            {/* Avatar & Voice Waves */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-3">
                {/* Ripple rings when agent is talking */}
                {isAgentSpeaking && (
                  <>
                    <span className="absolute -inset-3 rounded-full border-2 border-amber-400/40 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -inset-6 rounded-full border border-orange-400/20 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Ripple rings when user is speaking */}
                {isListening && (
                  <span className="absolute -inset-3 rounded-full border-2 border-emerald-400/50 animate-ping opacity-75 pointer-events-none" />
                )}

                <div className={`w-24 h-24 rounded-full p-1 border-2 transition-all duration-300 shadow-xl ${
                  isAgentSpeaking
                    ? 'border-amber-400 shadow-amber-500/30 ring-4 ring-amber-500/20'
                    : isListening
                    ? 'border-emerald-400 shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                    : isThinking
                    ? 'border-blue-400 shadow-blue-500/30'
                    : 'border-slate-700'
                }`}>
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-200 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                      alt="Aditi - Female Counselor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Status and dynamic wave animation */}
              <div className="text-center z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isAgentSpeaking 
                      ? 'bg-amber-400 animate-ping' 
                      : isListening 
                      ? 'bg-emerald-400 animate-pulse' 
                      : isThinking
                      ? 'bg-blue-400 animate-spin'
                      : 'bg-slate-400'
                  }`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {isAgentSpeaking 
                      ? 'Aditi is speaking (Hinglish)...' 
                      : isListening 
                      ? 'Listening to you... Ask your question now' 
                      : isThinking
                      ? 'Aditi is analyzing...'
                      : 'Connected • Tap mic or ask any question below'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs ml-1">
                    {formatTimer(callDuration)}
                  </span>
                </div>

                {/* Simulated Audio Frequency Visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-6 mt-1">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isAgentSpeaking
                          ? 'bg-amber-400'
                          : isListening
                          ? 'bg-emerald-400'
                          : 'bg-slate-700'
                      }`}
                      style={{
                        height: isAgentSpeaking
                          ? `${Math.max(4, Math.sin(i * 0.8 + callDuration * 3) * 20 + 8)}px`
                          : isListening
                          ? `${Math.max(4, Math.cos(i * 0.9 + Date.now() / 200) * 18 + 6)}px`
                          : '4px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Call Controls */}
            <div className="flex items-center gap-4 mt-4 z-10">
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title={isListening ? 'Mic is active (listening)' : 'Click to speak'}
              >
                {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-102"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>

            {speechError && (
              <p className="text-xs text-amber-400/90 mt-2 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                {speechError}
              </p>
            )}
          </div>
        ) : (
          /* Dial-In / Call Prompt Header */
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">
                  Ready to consult with Aditi in Hinglish?
                </h4>
                <p className="text-sm text-slate-400">
                  Two-way voice call. SRIJAN 2027 faculty, 87 tests, CSAT strategy aur PYQ hard copies ke baare mein kuch bhi poochhein!
                </p>
              </div>
            </div>

            <button
              onClick={() => startCall()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-102 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4 fill-slate-950" />
              <span>Start Voice Call Now</span>
            </button>
          </div>
        )}

        {/* Live Conversation Transcript */}
        <div 
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/40"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                <Mic className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <h5 className="font-bold text-slate-100 text-lg mb-1">
                Aditi is listening! Ask your question directly
              </h5>
              <p className="text-xs text-slate-400 mb-5 max-w-md">
                No initial greetings or delay. Speak into your microphone or tap any question below to get instant factual details:
              </p>

              {/* Quick High-Yield Prompts */}
              <div className="w-full space-y-2 text-left">
                {[
                  "CSAT mein kitni classes hain aur faculty kaun hain?",
                  "GS Crash Course mein kaun-kaun se teachers hain?",
                  "Select 360 Pro aur Select 360 mein kya difference hai?",
                  "Base Plan mein CSAT classes hain kya?",
                  "Total tests kitne hain aur validity kab tak hai?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-xs font-medium text-slate-200 hover:text-amber-300 transition-all flex items-center justify-between text-left group shadow-sm cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.sender === 'agent' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0 mb-1">
                      A
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-slate-800 border border-slate-700/70 text-slate-100 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Recommendation Card inside agent bubble */}
                    {msg.recommendedPlan && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                              Recommended for you
                            </span>
                            <span className="text-xs font-bold text-amber-300">
                              {msg.recommendedPlan}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <a
                            href={PW_BATCH_ENROLL_ENGLISH_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1 shadow-sm"
                            title="Buy English Medium Batch"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>English</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <a
                            href={PW_BATCH_ENROLL_HINDI_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1 shadow-sm"
                            title="Buy Hindi Medium Batch"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>हिंदी</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          {onSelectPlan && (
                            <button
                              onClick={() => {
                                const planId = msg.recommendedPlan?.toLowerCase().includes('pro')
                                  ? 'select360pro'
                                  : msg.recommendedPlan?.toLowerCase().includes('360')
                                  ? 'select360'
                                  : 'base';
                                onSelectPlan(planId);
                                onClose();
                              }}
                              className="px-2 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow-up question chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 px-3 py-1 rounded-full transition-all flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-400/80" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))
          )}

          {isThinking && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 ml-9">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-400 font-medium">
                Aditi is reviewing the SRIJAN 2027 details...
              </span>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title={isListening ? 'Mic recording active' : 'Click to talk via mic'}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-slate-400" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening... or type here in Hinglish/English" : "Aditi se Hinglish ya English mein poochhein (batch, CSAT, PYQ books, fees)..."}
              className="flex-1 bg-slate-800/90 border border-slate-700 focus:border-amber-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick query chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs text-slate-400 no-scrollbar mt-1">
            <span className="shrink-0 text-slate-500 font-medium">Quick ask:</span>
            {SUGGESTED_VOICE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-lg px-2.5 py-1 text-slate-300 hover:text-amber-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
