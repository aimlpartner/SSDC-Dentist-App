'use client';

/**
 * @module @ssdc/medical-ai-agents/agents/whatsapp-concierge-agent
 * @description
 * Agent 2 — Standalone, White-Label WhatsApp AI Concierge & Patient Engagement Widget.
 * Can be embedded into ANY hospital, clinic, or medical CRM by passing a `MedicalFacilityConfig`
 * and `MedicalCRMAdapter` (or individual callback props).
 */

import React, { useState } from 'react';
import {
  Send,
  CheckCheck,
  Phone,
  Paperclip,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';
import {
  MedicalAppointmentRecord,
  MedicalCRMAdapter,
  MedicalDoctorProfile,
  MedicalFacilityConfig,
  WhatsAppQuickAction,
} from '../../core/types';
import { DEFAULT_MEDICAL_FACILITY_CONFIG } from '../../core/default-facility.config';
import { evaluateWhatsAppAgentFallback } from '../../core/agent-engine';

let waCounter = 0;
function createWaMsgId(prefix: string): string {
  waCounter += 1;
  return `${prefix}-${Date.now()}-${waCounter}`;
}

function getWaFormattedTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export interface WhatsAppConciergeWidgetProps<
  TAppointment extends MedicalAppointmentRecord = MedicalAppointmentRecord,
  TDoctor extends MedicalDoctorProfile = MedicalDoctorProfile
> {
  isOpen: boolean;
  onClose: () => void;
  /** Optional white-label hospital/clinic configuration (defaults to Taj White Pearl preset) */
  config?: MedicalFacilityConfig;
  /** Optional unified CRM adapter for external hospital integrations */
  crm?: MedicalCRMAdapter<TAppointment, TDoctor>;
  /** Direct props for backwards compatibility */
  appointments?: TAppointment[];
  notifications?: unknown[];
  onRescheduleAppointment?: (
    appointmentNumber: string,
    newDate: string,
    newTime: string
  ) => boolean | Promise<boolean>;
  onAddReview?: (
    appointmentNumber: string,
    rating: number,
    feedback: string
  ) => void | Promise<void>;
  onOpenCallingAgent?: () => void;
}

export default function WhatsAppConciergeWidget<
  TAppointment extends MedicalAppointmentRecord = MedicalAppointmentRecord,
  TDoctor extends MedicalDoctorProfile = MedicalDoctorProfile
>({
  isOpen,
  onClose,
  config = DEFAULT_MEDICAL_FACILITY_CONFIG,
  crm,
  appointments: propAppointments,
  onRescheduleAppointment: propOnReschedule,
  onAddReview: propOnAddReview,
  onOpenCallingAgent: propOnOpenCalling,
}: WhatsAppConciergeWidgetProps<TAppointment, TDoctor>) {
  const appointments = crm?.appointments ?? propAppointments ?? [];
  const onRescheduleAppointment = crm?.onRescheduleAppointment ?? propOnReschedule;
  const onAddReview = crm?.onAddReview ?? propOnAddReview;
  const onOpenCallingAgent = crm?.onOpenCallingAgent ?? propOnOpenCalling;

  const activeApt =
    appointments.find((a) => a.status === 'confirmed' || a.status === 'arrived') ||
    appointments[0];

  const defaultAptCode = `${config.appointmentPrefix}-1042`;
  const defaultDocName = config.doctors[0]?.name || 'Dr. Ananya Verma';

  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: 'bot' | 'user';
      text: string;
      time: string;
      actions?: WhatsAppQuickAction[];
    }>
  >([
    {
      id: 'wa-1',
      sender: 'bot',
      text: `*${config.facilityShortName}, ${config.location.city}*\n\nNamaste ${activeApt?.patientName || 'Sarah'}! Welcome to our official WhatsApp patient desk.\n\nYour appointment *#${activeApt?.appointmentNumber || defaultAptCode}* is confirmed for *${activeApt?.date || 'Nov 3, 2026'}* at *${activeApt?.timeSlot || '11:30 AM'}* with *${activeApt?.doctorName || defaultDocName}*.\n\n*Address:* ${config.location.address}.\n\nFeel free to message here anytime if you need airport pickup details or want to adjust your timing.`,
      time: '10:00 AM',
      actions: config.whatsappAgent.quickActions,
    },
    {
      id: 'wa-2',
      sender: 'bot',
      text: config.whatsappAgent.reminderNotice,
      time: '10:05 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsgId = createWaMsgId('msg');
    const currentTime = getWaFormattedTime();

    const userEntry = {
      id: newMsgId,
      sender: 'user' as const,
      text,
      time: currentTime,
    };

    setChatMessages((prev) => [...prev, userEntry]);
    if (!textToSend) setInputMessage('');

    setTimeout(async () => {
      const result = evaluateWhatsAppAgentFallback(text, config, {
        appointmentNumber: activeApt?.appointmentNumber,
        doctorName: activeApt?.doctorName,
        patientEmail: activeApt?.patientEmail,
      });

      if (result.action === 'reschedule_appointment' && activeApt && onRescheduleAppointment) {
        await onRescheduleAppointment(activeApt.appointmentNumber, '2026-11-06', '02:30 PM');
        setSuccessToast(`Rescheduled #${activeApt.appointmentNumber} via WhatsApp!`);
      } else if (result.action === 'submit_review' && activeApt && onAddReview) {
        await onAddReview(
          activeApt.appointmentNumber,
          result.extractedData?.rating || 5,
          result.extractedData?.reviewFeedback ||
            'Remarkable clinical transformation. Extremely gentle and caring.'
        );
        setSuccessToast(`Recorded 5-star review for #${activeApt.appointmentNumber}!`);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: createWaMsgId('bot'),
          sender: 'bot',
          text: result.reply,
          time: getWaFormattedTime(),
          actions: result.suggestedQuickActions,
        },
      ]);
    }, 850);
  };

  const handleActionClick = (action: string) => {
    if (action === 'reschedule_auto') {
      handleSendMessage('Please reschedule my appointment to tomorrow afternoon');
    } else if (action === 'rate_visit') {
      handleSendMessage(
        `I want to rate my ${config.facilityShortName} experience 5 stars! Exceptional service.`
      );
    } else if (action === 'hotel_shuttle' || action === 'concierge_shuttle') {
      handleSendMessage('Can you confirm my hotel shuttle and concierge pickup to the clinic?');
    } else if (action === 'open_calling') {
      onClose();
      onOpenCallingAgent?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b141a] rounded-t-2xl sm:rounded-2xl max-w-lg w-full h-[86dvh] sm:h-[620px] flex flex-col shadow-2xl border border-stone-800 overflow-hidden text-stone-100"
      >
        {/* WhatsApp Header */}
        <div className="bg-[#202c33] px-4 py-3.5 flex items-center justify-between border-b border-[#313d45]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-500/50 flex items-center justify-center text-white font-funky font-extrabold text-base">
                {config.whatsappAgent.avatarEmoji || 'S'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#202c33]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-funky font-extrabold text-sm text-stone-100">
                  {config.whatsappAgent.botName}
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {config.whatsappAgent.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenCallingAgent && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCallingAgent();
                }}
                title="Call Reception"
                className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Wallpaper & Chat Container */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] relative"
          style={{
            backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {successToast && (
            <div className="sticky top-2 z-10 bg-emerald-900/90 border border-emerald-600 text-emerald-200 text-xs px-3 py-1.5 rounded-lg text-center flex items-center justify-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

          {/* End-to-End Encryption Notice */}
          <div className="bg-[#182229] border border-[#222e35] text-[#8696a0] text-[10px] text-center py-1.5 px-3 rounded-lg max-w-xs mx-auto shadow-xs">
            {config.whatsappAgent.encryptionNotice}
          </div>

          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-sm relative ${
                  msg.sender === 'user'
                    ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-xs'
                    : 'bg-[#202c33] text-[#d1d7db] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8696a0]">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  )}
                </div>
              </div>

              {/* Bot Interactive Action Chips */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(act.action)}
                      className="bg-[#202c33] hover:bg-[#2a3942] border border-[#374248] text-emerald-400 text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-left shadow-xs"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp Input Box */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#313d45]">
          <button className="text-stone-400 hover:text-stone-200 p-1.5 cursor-pointer" title="Attach Document / Photo">
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type a message (e.g. Reschedule, directions, rating)..."
            className="flex-1 bg-[#2a3942] text-xs text-stone-100 placeholder-[#8696a0] rounded-xl px-3.5 py-2 focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="bg-[#00a884] hover:bg-[#06cf9c] disabled:opacity-40 text-[#111b21] p-2 rounded-full transition-all cursor-pointer"
            aria-label="Send WhatsApp message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

