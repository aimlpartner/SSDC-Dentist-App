'use client';

/**
 * @module @ssdc/medical-ai-agents/agents/voice-calling-agent
 * @description
 * Agent 1 — Standalone, White-Label AI Voice Calling Receptionist Widget.
 * Can be embedded into ANY hospital, clinic, or medical CRM by passing a `MedicalFacilityConfig`
 * and `MedicalCRMAdapter` (or individual callback props).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  AgentConversationMessage,
  MedicalAppointmentRecord,
  MedicalCRMAdapter,
  MedicalDoctorProfile,
  MedicalFacilityConfig,
} from '../../core/types';
import { DEFAULT_MEDICAL_FACILITY_CONFIG } from '../../core/default-facility.config';
import { generateFacilityAppointmentCode } from '../../core/agent-engine';

let msgCounter = 0;
function createAgentMsgId(prefix: string): string {
  msgCounter += 1;
  return `${prefix}-${Date.now()}-${msgCounter}`;
}

function getFormattedTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export interface AICallingAgentWidgetProps<
  TAppointment extends MedicalAppointmentRecord = MedicalAppointmentRecord,
  TDoctor extends MedicalDoctorProfile = MedicalDoctorProfile
> {
  isOpen: boolean;
  onClose: () => void;
  /** Optional white-label hospital/clinic configuration (defaults to Taj White Pearl preset) */
  config?: MedicalFacilityConfig;
  /** Optional unified CRM adapter for external hospital integrations */
  crm?: MedicalCRMAdapter<TAppointment, TDoctor>;
  /** Custom API endpoint override (defaults to `/api/calling-agent`) */
  apiEndpoint?: string;
  /** Direct props for backwards compatibility */
  appointments?: TAppointment[];
  doctors?: TDoctor[];
  onBookAppointment?: (appointment: TAppointment) => void;
  onRescheduleAppointment?: (
    appointmentNumber: string,
    newDate: string,
    newTime: string
  ) => boolean | Promise<boolean>;
  onCancelAppointment?: (appointmentNumber: string) => boolean | Promise<boolean>;
}

export default function AICallingAgentWidget<
  TAppointment extends MedicalAppointmentRecord = MedicalAppointmentRecord,
  TDoctor extends MedicalDoctorProfile = MedicalDoctorProfile
>({
  isOpen,
  onClose,
  config = DEFAULT_MEDICAL_FACILITY_CONFIG,
  crm,
  apiEndpoint = '/api/calling-agent',
  appointments: propAppointments,
  doctors: propDoctors,
  onBookAppointment: propOnBook,
  onRescheduleAppointment: propOnReschedule,
  onCancelAppointment: propOnCancel,
}: AICallingAgentWidgetProps<TAppointment, TDoctor>) {
  const appointments = crm?.appointments ?? propAppointments ?? [];
  const doctors = crm?.doctors ?? propDoctors ?? (config.doctors as unknown as TDoctor[]);
  const onBookAppointment = crm?.onBookAppointment ?? propOnBook;
  const onRescheduleAppointment = crm?.onRescheduleAppointment ?? propOnReschedule;
  const onCancelAppointment = crm?.onCancelAppointment ?? propOnCancel;

  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [messages, setMessages] = useState<AgentConversationMessage[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<unknown>(null);
  const handleUserSpeechRef = useRef<(text: string) => Promise<void>>(() => Promise.resolve());

  // Initialize browser SpeechRecognition if available
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
          // Fallback if speech recognition is unavailable
        }
      }
    }
  }, []);

  // Duration timer
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

  // Auto-scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  const startCall = () => {
    setCallState('ringing');
    setCallDuration(0);
    setMessages([]);
    setLastAction(null);

    setTimeout(() => {
      setCallState('connected');
      const welcomeText = config.voiceAgent.greetingMessage;
      const initialMsg: AgentConversationMessage = {
        id: 'msg-0',
        role: 'agent',
        text: welcomeText,
        timestamp: getFormattedTimestamp(),
      };
      setMessages([initialMsg]);
      speakAgentText(welcomeText);
    }, 1800);
  };

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

  const speakAgentText = (text: string) => {
    if (isSpeakerMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.voiceAgent.voiceRate ?? 1.0;
    utterance.pitch = config.voiceAgent.voicePitch ?? 1.05;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.name.includes('Karen') ||
        v.name.includes('Female')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleUserSpeech = async (userText: string) => {
    if (!userText.trim() || callState !== 'connected') return;

    const userMessage: AgentConversationMessage = {
      id: createAgentMsgId('usr'),
      role: 'user',
      text: userText,
      timestamp: getFormattedTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscriptInput('');
    setIsSpeaking(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'voice',
          transcript: userText,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
          callerInfo: {
            existingAppointmentNumber: appointments[0]?.appointmentNumber,
          },
          facilityConfig: config,
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        `Thank you. ${config.facilityShortName} in ${config.location.city} is ready to welcome you. How else may I assist you?`;

      const agentMessage: AgentConversationMessage = {
        id: createAgentMsgId('agent'),
        role: 'agent',
        text: reply,
        timestamp: getFormattedTimestamp(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      speakAgentText(reply);

      // Execute CRM actions via Adapter callbacks
      if (data.action === 'reschedule_appointment' && onRescheduleAppointment) {
        const targetApt = appointments.find(
          (a) => a.status === 'confirmed' || a.status === 'arrived'
        );
        if (targetApt) {
          const newDate = data.extractedData?.requestedDate || '2026-11-05';
          const newTime = data.extractedData?.requestedTime || '03:00 PM';
          const success = await onRescheduleAppointment(
            targetApt.appointmentNumber,
            newDate,
            newTime
          );
          if (success) {
            setLastAction(
              `Successfully rescheduled #${targetApt.appointmentNumber} to Nov 5, 2026 at 3:00 PM.`
            );
          }
        }
      } else if (data.action === 'cancel_appointment' && onCancelAppointment) {
        const targetApt = appointments.find((a) => a.status === 'confirmed');
        if (targetApt) {
          await onCancelAppointment(targetApt.appointmentNumber);
          setLastAction(`Appointment #${targetApt.appointmentNumber} was cancelled with zero fee.`);
        }
      } else if (data.action === 'book_appointment' && onBookAppointment) {
        const newAptNum = generateFacilityAppointmentCode(config.appointmentPrefix);
        const defaultDoc = doctors[0] || {
          id: config.doctors[0]?.id || 'doc-default',
          name: config.doctors[0]?.name || 'Chief Specialist',
        };
        const newBooking = {
          id: createAgentMsgId('apt'),
          appointmentNumber: newAptNum,
          patientId: createAgentMsgId('pat'),
          patientName: data.extractedData?.patientName || 'Voice Caller Guest',
          patientEmail: 'caller@voice-intake.com',
          patientPhone: '+91 98980 00112',
          patientType: data.extractedData?.isInternational ? 'international' : 'local',
          country: data.extractedData?.isInternational ? 'United Kingdom' : 'India',
          doctorId: defaultDoc.id,
          doctorName: defaultDoc.name,
          date: data.extractedData?.requestedDate || '2026-11-04',
          timeSlot: data.extractedData?.requestedTime || '11:00 AM',
          problemCategory: data.extractedData?.problem || config.defaultConsultationCategory,
          problemDescription: 'Booked via Clinic Reception Line.',
          status: 'confirmed',
          bookingSource: 'call_agent',
          createdAt: '2026-11-03',
          estimatedCostINR: config.defaultConsultationCost.inr,
          estimatedCostUSD: config.defaultConsultationCost.usd,
        } as unknown as TAppointment;

        await onBookAppointment(newBooking);
        setLastAction(`New consultation #${newAptNum} booked with ${defaultDoc.name}!`);
      }
    } catch (err) {
      console.error('[MedicalAIAgentSDK] Call agent fetch error:', err);
      const fallbackReply = `We apologize for the brief line static. Our ${config.location.city} reception desk at ${config.location.address} looks forward to assisting you.`;
      setMessages((prev) => [
        ...prev,
        {
          id: createAgentMsgId('agent'),
          role: 'agent',
          text: fallbackReply,
          timestamp: getFormattedTimestamp(),
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

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert(
        'Microphone recognition is not supported in this browser. You can type or use the quick inquiry buttons below!'
      );
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

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        endCall();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header: Reception Desk Identity */}
        <div className="bg-[#7B1123] text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-200/20">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-[#580B18] border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37]">
                <Phone className="w-5 h-5" />
              </div>
              {callState === 'connected' && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#7B1123]"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-funky font-extrabold text-base text-white tracking-tight">
                  {config.voiceAgent.roleTitle}
                </h3>
                <span className="text-[10px] uppercase tracking-wider bg-[#580B18] text-[#D4AF37] px-2 py-0.5 rounded font-bold border border-[#D4AF37]/40">
                  {config.voiceAgent.badgeText}
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5">
                {config.facilityShortName} &middot; {config.location.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              endCall();
              onClose();
            }}
            className="text-stone-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close calling screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Status & Waveform Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {callState === 'connected' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-bold text-stone-900">
                  Connected
                </span>
                <span className="text-xs font-mono text-[#7B1123] font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200 tabular-nums">
                  {formatDuration(callDuration)}
                </span>
              </>
            ) : callState === 'ringing' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7B1123]" />
                <span className="text-xs font-bold text-[#7B1123]">
                  Calling {config.facilityShortName} reception...
                </span>
              </>
            ) : callState === 'ended' ? (
              <span className="text-xs font-semibold text-stone-500">
                Call Ended
              </span>
            ) : (
              <span className="text-xs text-stone-600 font-semibold">
                Direct reception line &middot; {config.location.city}
              </span>
            )}
          </div>

          {/* Sound Wave Visualizer */}
          {callState === 'connected' && (
            <div className="flex items-center gap-1">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isSpeaking ? 'bg-[#7B1123] animate-pulse' : 'bg-stone-300'
                  }`}
                  style={{ height: isSpeaking ? `${height * 0.22}px` : '4px' }}
                ></span>
              ))}
              <span className="text-[11px] font-medium text-stone-500 ml-1.5">
                {isSpeaking
                  ? 'Speaking'
                  : isListening
                  ? 'Listening...'
                  : 'Connected'}
              </span>
            </div>
          )}
        </div>

        {/* Action Executed Banner */}
        {lastAction && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              {lastAction}
            </span>
            <button
              onClick={() => setLastAction(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Live Conversation Transcript Display */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-white min-h-[220px] max-h-[340px]">
          {callState === 'idle' && (
            <div className="text-center py-8 px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] border border-[#7B1123]/20 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-[#7B1123]" />
              </div>
              <h4 className="font-funky font-extrabold text-stone-950 text-xl">
                {config.facilityShortName} Reception
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                Speak directly with our reception desk to book a visit, reschedule your timing, or ask about treatments and airport transfers.
              </p>
              <div className="mt-5">
                <button
                  onClick={startCall}
                  className="bg-[#7B1123] hover:bg-[#580B18] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Call Reception</span>
                </button>
              </div>
            </div>
          )}

          {callState === 'ringing' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FEFCE8] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Phone className="w-6 h-6 text-[#7B1123]" />
              </div>
              <p className="text-base font-funky font-extrabold text-stone-950">
                Calling {config.facilityShortName} Reception...
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {config.location.address}
              </p>
            </div>
          )}

          {callState === 'connected' &&
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'agent' ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-stone-500">
                    {msg.role === 'agent' ? 'Front Desk' : 'You'}
                  </span>
                  <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed border ${
                    msg.role === 'agent'
                      ? 'bg-stone-50 border-stone-200 text-stone-900 rounded-tl-xs'
                      : 'bg-[#7B1123] border-[#7B1123] text-white rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

          {isSpeaking && (
            <div className="flex items-center gap-2 text-stone-500 text-xs py-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7B1123] animate-pulse"></span>
              <span>Reception is speaking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Bar */}
        {callState === 'connected' && (
          <div className="bg-stone-50 p-3.5 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#7B1123]" />
                Common questions (tap to ask):
              </span>
              <span className="text-[10px] text-stone-400">Or speak using microphone</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {config.voiceAgent.quickPrompts.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserSpeech(query)}
                  className="bg-white hover:bg-[#FFF1F2] hover:border-[#7B1123] border border-stone-200 text-stone-700 hover:text-[#7B1123] rounded-xl text-xs px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer text-left shrink-0"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call Controls Footer */}
        <div className="bg-stone-950 text-white p-4 border-t border-stone-800 flex flex-col gap-3">
          {callState === 'connected' ? (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex-1 flex items-center rounded-xl bg-stone-900 px-3.5 py-2 border border-stone-700">
                <input
                  type="text"
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUserSpeech(transcriptInput);
                    }
                  }}
                  placeholder="Type a message or speak into mic..."
                  className="w-full bg-transparent text-xs text-white placeholder-stone-400 focus:outline-none"
                />
                <button
                  onClick={() => handleUserSpeech(transcriptInput)}
                  disabled={!transcriptInput.trim()}
                  className="text-[#D4AF37] hover:text-white p-1 disabled:opacity-40 cursor-pointer"
                  aria-label="Send message"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-[#7B1123] border-[#D4AF37] text-white animate-pulse'
                    : 'bg-stone-900 border-stone-700 text-stone-200 hover:border-stone-500'
                }`}
                title={isListening ? 'Stop microphone' : 'Speak into microphone'}
                aria-label="Toggle microphone"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakerMuted(!isSpeakerMuted);
                }}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isSpeakerMuted
                    ? 'bg-[#7B1123] border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-stone-900 border-stone-700 text-stone-200 hover:border-stone-500'
                }`}
                title={isSpeakerMuted ? 'Unmute audio' : 'Mute audio'}
                aria-label="Toggle speaker audio"
              >
                {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={endCall}
                className="bg-red-700 hover:bg-red-800 border border-red-500 rounded-xl text-white p-2.5 transition-colors cursor-pointer"
                title="End Call"
                aria-label="End call"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                {config.facilityShortName} &middot; {config.location.phone}
              </span>
              <button
                onClick={onClose}
                className="text-stone-300 hover:text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

