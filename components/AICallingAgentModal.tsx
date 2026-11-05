'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle,
  MessageSquare,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Appointment, CallMessage, Doctor } from '../lib/types';
import { generateAppointmentNumber } from '../lib/dental-logic';
import { generateUniqueId, getCurrentFormattedTime } from '../lib/utils';

interface AICallingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  doctors: Doctor[];
  onBookAppointment: (appointment: Appointment) => void;
  onRescheduleAppointment: (appointmentNumber: string, newDate: string, newTime: string) => boolean;
  onCancelAppointment: (appointmentNumber: string) => boolean;
}

export default function AICallingAgentModal({
  isOpen,
  onClose,
  appointments,
  doctors,
  onBookAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
}: AICallingAgentModalProps) {
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<unknown>(null);
  const handleUserSpeechRef = useRef<(text: string) => Promise<void>>(() => Promise.resolve());

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || 
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new (SpeechRecognition as new () => any)();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const speechText = event.results[0][0].transcript;
            if (speechText) {
              handleUserSpeechRef.current(speechText);
            }
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          speechRecognitionRef.current = recognition;
        } catch {
          // Fallback if permission or speech recognition is unavailable
        }
      }
    }
  }, []);

  // Duration Timer
  useEffect(() => {
    if (callState === 'connected') {
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    }

    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callState]);

  // Scroll to bottom of transcripts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  // Start the call
  const startCall = () => {
    setCallState('ringing');
    setCallDuration(0);
    setMessages([]);
    setLastAction(null);

    // Play ringing sound simulation, then connect in 1.8s
    setTimeout(() => {
      setCallState('connected');
      const welcomeText = "Namaste and warm greetings from Taj White Pearl Dental Hospital, Agra! I am Priya, your senior dental concierge. How can I care for your smile today?";
      const initialMsg: CallMessage = {
        id: 'msg-0',
        role: 'agent',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMsg]);
      speakAgentText(welcomeText);
    }, 1800);
  };

  // End the call
  const endCall = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (speechRecognitionRef.current) {
      try {
        (speechRecognitionRef.current as { stop: () => void }).stop();
      } catch {
        // ignore
      }
    }
    setCallState('ended');
    setIsSpeaking(false);
    setIsListening(false);
  };

  // Text-To-Speech for Priya
  const speakAgentText = (text: string) => {
    if (isSpeakerMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05; // Friendly, warm tone
    utterance.lang = 'en-US';

    // Try finding an articulate female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Send speech or text input to the AI Calling Agent endpoint
  const handleUserSpeech = async (userText: string) => {
    if (!userText.trim() || callState !== 'connected') return;

    const userMessage: CallMessage = {
      id: generateUniqueId('usr'),
      role: 'user',
      text: userText,
      timestamp: getCurrentFormattedTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscriptInput('');
    setIsSpeaking(true); // show thinking / speaking indicator

    try {
      const response = await fetch('/api/calling-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: userText,
          conversationHistory: messages.map(m => ({ role: m.role, text: m.text })),
          callerInfo: {
            existingAppointmentNumber: appointments[0]?.appointmentNumber,
          },
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Thank you. Our clinic in Agra is ready to welcome you. How else may I assist you?";

      const agentMessage: CallMessage = {
        id: generateUniqueId('agent'),
        role: 'agent',
        text: reply,
        timestamp: getCurrentFormattedTime(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      speakAgentText(reply);

      // Handle extracted actions: book, reschedule, cancel
      if (data.action === 'reschedule_appointment') {
        // Execute reschedule on sample appointment if available
        const targetApt = appointments.find(a => a.status === 'confirmed' || a.status === 'arrived');
        if (targetApt) {
          const success = onRescheduleAppointment(targetApt.appointmentNumber, '2026-11-05', '03:00 PM');
          if (success) {
            setLastAction(`Successfully rescheduled #${targetApt.appointmentNumber} to Nov 5, 2026 at 3:00 PM.`);
          }
        }
      } else if (data.action === 'cancel_appointment') {
        const targetApt = appointments.find(a => a.status === 'confirmed');
        if (targetApt) {
          onCancelAppointment(targetApt.appointmentNumber);
          setLastAction(`Appointment #${targetApt.appointmentNumber} was cancelled with zero fee.`);
        }
      } else if (data.action === 'book_appointment') {
        // Create quick booking
        const newAptNum = generateAppointmentNumber();
        const defaultDoc = doctors[0] || { id: 'doc-aarav', name: 'Dr. Aarav Sharma' };
        const newBooking: Appointment = {
          id: generateUniqueId('apt'),
          appointmentNumber: newAptNum,
          patientId: generateUniqueId('pat'),
          patientName: data.extractedData?.patientName || 'Voice Caller Guest',
          patientEmail: 'caller@voice-intake.com',
          patientPhone: '+91 98980 00112',
          patientType: data.extractedData?.isInternational ? 'international' : 'local',
          country: data.extractedData?.isInternational ? 'United Kingdom' : 'India',
          doctorId: defaultDoc.id,
          doctorName: defaultDoc.name,
          date: data.extractedData?.requestedDate || '2026-11-04',
          timeSlot: data.extractedData?.requestedTime || '11:00 AM',
          problemCategory: data.extractedData?.problem || 'Taj Pearl Consultation',
          problemDescription: 'Booked via 24/7 Voice Calling Agent (Priya AI).',
          status: 'confirmed',
          bookingSource: 'call_agent',
          createdAt: '2026-11-03',
          estimatedCostINR: 12000,
          estimatedCostUSD: 145,
        };
        onBookAppointment(newBooking);
        setLastAction(`New consultation #${newAptNum} booked with ${defaultDoc.name}!`);
      }
    } catch (err) {
      console.error('Call agent fetch error:', err);
      const fallbackReply = "We apologize for the brief line static. Our Agra reception desk is located right near Taj East Gate, and we look forward to assisting your smile.";
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId('agent'),
          role: 'agent',
          text: fallbackReply,
          timestamp: getCurrentFormattedTime(),
        },
      ]);
      speakAgentText(fallbackReply);
    } finally {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    handleUserSpeechRef.current = handleUserSpeech;
  });

  // Trigger microphone recognition
  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert("Microphone recognition is not supported in this browser. You can type or use the quick inquiry buttons below!");
      return;
    }

    if (isListening) {
      try {
        (speechRecognitionRef.current as { stop: () => void }).stop();
        setIsListening(false);
      } catch {
        // ignore
      }
    } else {
      try {
        (speechRecognitionRef.current as { start: () => void }).start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Quick prompt buttons for convenience
  const quickQueries = [
    "I want to book an appointment with Dr. Aarav for dental implants",
    "How much does Taj Pearl laser teeth whitening cost for tourists?",
    "Can you reschedule my appointment to a later slot?",
    "Do you provide airport transfer from Delhi and hotel near Taj Mahal?",
    "I have severe toothache and need an emergency slot today",
    "I would like to cancel my consultation",
  ];

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header: Calling Agent Identity */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif font-bold text-xl shadow-inner">
                P
              </div>
              {callState === 'connected' && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900 animate-pulse"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-stone-100">
                  Priya — AI Dental Calling Concierge
                </h3>
                <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                  Agra 24/7 Line
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Taj White Pearl Dental Hospital • Fatehabad Rd, Agra
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              endCall();
              onClose();
            }}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close calling screen"
          >
            ✕
          </button>
        </div>

        {/* Call Status & Waveform Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {callState === 'connected' ? (
              <>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-stone-800">Call Connected</span>
                <span className="text-xs font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {formatDuration(callDuration)}
                </span>
              </>
            ) : callState === 'ringing' ? (
              <>
                <span className="animate-spin text-amber-600 font-bold text-xs">⟳</span>
                <span className="text-xs font-semibold text-amber-800">Ringing Agra Dental Clinic Desk...</span>
              </>
            ) : callState === 'ended' ? (
              <span className="text-xs font-medium text-stone-500">Call Finished</span>
            ) : (
              <span className="text-xs text-stone-600 font-medium">Ready to connect to Agra AI Reception</span>
            )}
          </div>

          {/* Sound Wave Visualizer when Priya is speaking */}
          {callState === 'connected' && (
            <div className="flex items-center gap-1">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-amber-600 animate-pulse' 
                      : 'bg-stone-300'
                  }`}
                  style={{ height: isSpeaking ? `${height * 0.22}px` : '4px' }}
                ></span>
              ))}
              <span className="text-[10px] text-stone-500 font-mono ml-1.5">
                {isSpeaking ? 'Priya Speaking' : isListening ? 'Listening...' : 'Ready'}
              </span>
            </div>
          )}
        </div>

        {/* Action Executed Banner */}
        {lastAction && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center justify-between text-xs text-emerald-800 animate-fade-in">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {lastAction}
            </span>
            <button 
              onClick={() => setLastAction(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Conversation Transcript Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-stone-50/50 to-white min-h-[220px] max-h-[340px]">
          {callState === 'idle' && (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Phone className="w-7 h-7 text-amber-700 animate-bounce" />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-lg">
                Agra AI Calling Receptionist
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                Call Priya 24/7 to book appointments, reschedule your timing, cancel, or inquire about Taj dental tourism packages in English or Hindi.
              </p>
              <div className="mt-5">
                <button
                  onClick={startCall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Voice Call Now</span>
                </button>
              </div>
            </div>
          )}

          {callState === 'ringing' && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 animate-ping">
                <Phone className="w-7 h-7 text-amber-700" />
              </div>
              <p className="text-sm font-serif font-bold text-stone-800">Connecting to Fatehabad Rd Clinic Desk...</p>
              <p className="text-xs text-stone-500 mt-1">Connecting to Senior Coordinator Priya</p>
            </div>
          )}

          {callState === 'connected' && messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'agent' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-semibold text-stone-600">
                  {msg.role === 'agent' ? 'Priya (Taj Concierge)' : 'You (Caller)'}
                </span>
                <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === 'agent'
                    ? 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
                    : 'bg-amber-800 text-white rounded-tr-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isSpeaking && (
            <div className="flex items-center gap-2 text-stone-400 text-xs py-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Priya is speaking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Simulation Query Chips */}
        {callState === 'connected' && (
          <div className="bg-stone-50 p-3 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Quick Voice Prompts (Tap to Speak):
              </span>
              <span className="text-[10px] text-stone-400">Or use microphone below</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserSpeech(query)}
                  className="bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-stone-700 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all shadow-2xs hover:text-amber-900 cursor-pointer text-left shrink-0"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call Controls Footer */}
        <div className="bg-stone-900 text-white p-4 border-t border-stone-800 flex flex-col gap-3">
          {callState === 'connected' ? (
            <div className="flex items-center justify-between gap-3">
              {/* Voice Input Text Fallback */}
              <div className="flex-1 flex items-center bg-stone-800 rounded-xl px-3 py-1.5 border border-stone-700">
                <input
                  type="text"
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUserSpeech(transcriptInput);
                    }
                  }}
                  placeholder="Type or speak to Priya..."
                  className="w-full bg-transparent text-xs text-white placeholder-stone-400 focus:outline-none"
                />
                <button
                  onClick={() => handleUserSpeech(transcriptInput)}
                  disabled={!transcriptInput.trim()}
                  className="text-amber-400 hover:text-amber-300 p-1 disabled:opacity-40 cursor-pointer"
                  aria-label="Send message"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mic Toggle Button */}
              <button
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30' 
                    : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                }`}
                title={isListening ? 'Stop listening' : 'Speak into microphone'}
                aria-label="Toggle microphone"
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Speaker Mute Toggle */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakerMuted(!isSpeakerMuted);
                }}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isSpeakerMuted 
                    ? 'bg-amber-900 text-amber-300' 
                    : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                }`}
                title={isSpeakerMuted ? 'Unmute AI voice' : 'Mute AI voice'}
                aria-label="Toggle speaker audio"
              >
                {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Hangup Red Button */}
              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all shadow-md hover:scale-105 cursor-pointer"
                title="End Call"
                aria-label="End call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Powered by Gemini AI • 24/7 Real-Time Dental Assistant
              </span>
              <button
                onClick={onClose}
                className="text-stone-300 hover:text-white underline cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
