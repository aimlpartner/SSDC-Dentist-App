'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Star, 
  Phone, 
  Smile, 
  RotateCcw, 
  MapPin, 
  Sparkles,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { Appointment, NotificationLog } from '../lib/types';
import { generateUniqueId, getCurrentFormattedTime } from '../lib/utils';

interface WhatsAppConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  notifications: NotificationLog[];
  onRescheduleAppointment: (appointmentNumber: string, newDate: string, newTime: string) => boolean;
  onAddReview: (appointmentNumber: string, rating: number, feedback: string) => void;
  onOpenCallingAgent: () => void;
}

export default function WhatsAppConciergeModal({
  isOpen,
  onClose,
  appointments,
  notifications,
  onRescheduleAppointment,
  onAddReview,
  onOpenCallingAgent,
}: WhatsAppConciergeModalProps) {
  const activeApt = appointments.find(a => a.status === 'confirmed' || a.status === 'arrived') || appointments[0];

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'bot' | 'user';
    text: string;
    time: string;
    actions?: Array<{ label: string; action: string; payload?: unknown }>;
  }>>([
    {
      id: 'wa-1',
      sender: 'bot',
      text: `🏛️ *Taj White Pearl Dental Hospital, Agra*\n\nNamaste ${activeApt?.patientName || 'Sarah'}! Welcome to our official WhatsApp Concierge channel.\n\nYour appointment *#${activeApt?.appointmentNumber || 'TWP-1042'}* is confirmed for *${activeApt?.date || 'Nov 3, 2026'}* at *${activeApt?.timeSlot || '11:30 AM'}* with *${activeApt?.doctorName || 'Dr. Ananya Verma'}*.\n\n📍 *Address:* 14 Fatehabad Road, Opposite Taj East Gate, Agra.\n\nYou can manage your visit, request Taj tourism car transfers, or change your timing anytime below!`,
      time: '10:00 AM',
      actions: [
        { label: '📅 Reschedule to Tomorrow', action: 'reschedule_auto' },
        { label: '⭐ Rate My Smile Visit', action: 'rate_visit' },
        { label: '🚗 Request Hotel / Taj Shuttle', action: 'hotel_shuttle' },
        { label: '📞 Call Priya AI Agent', action: 'open_calling' },
      ],
    },
    {
      id: 'wa-2',
      sender: 'bot',
      text: `🔔 *Reminder Alert:*\nYour consultation is coming up! If you need soft-diet culinary recommendations around Agra or assistance with your Taj Mahal sunrise viewing ticket, reply here or tap a button.`,
      time: '10:05 AM',
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsgId = generateUniqueId('msg');
    const currentTime = getCurrentFormattedTime();

    const userEntry = {
      id: newMsgId,
      sender: 'user' as const,
      text: text,
      time: currentTime,
    };

    setChatMessages(prev => [...prev, userEntry]);
    if (!textToSend) setInputMessage('');

    // Process intelligent automated bot response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply = "Thank you for reaching out to Taj White Pearl WhatsApp Concierge. Our Agra reception team has logged your message. How else may we assist you today?";
      let botActions: Array<{ label: string; action: string }> | undefined = undefined;

      if (lower.includes('reschedule') || lower.includes('change') || lower.includes('postpone')) {
        if (activeApt) {
          onRescheduleAppointment(activeApt.appointmentNumber, '2026-11-06', '02:30 PM');
          botReply = `✅ Done! Your appointment *#${activeApt.appointmentNumber}* has been successfully rescheduled to *Friday, Nov 6, 2026 at 2:30 PM* with *${activeApt.doctorName}*.\n\nA revised confirmation email has been dispatched to ${activeApt.patientEmail}.`;
          setSuccessToast(`Rescheduled #${activeApt.appointmentNumber} via WhatsApp!`);
        }
      } else if (lower.includes('rate') || lower.includes('star') || lower.includes('review')) {
        if (activeApt) {
          onAddReview(activeApt.appointmentNumber, 5, "Remarkable Taj smile transformation. Extremely gentle and caring.");
          const formattedDocName = activeApt.doctorName.startsWith('Dr.') ? activeApt.doctorName : `Dr. ${activeApt.doctorName}`;
          botReply = `🌟 *Thank you for your 5-Star Rating!*\n\n${formattedDocName} and our clinical team in Agra are overjoyed. We have attached a 10% complimentary Taj Pearl Hygiene Voucher for your next family visit.`;
          setSuccessToast(`Recorded 5-star review for #${activeApt.appointmentNumber}!`);
        }
      } else if (lower.includes('hotel') || lower.includes('shuttle') || lower.includes('taj mahal') || lower.includes('sightseeing')) {
        botReply = `🚗 *Agra Travel & Concierge Update:*\n\nOur clinic car is synchronized with The Oberoi Amarvilas, ITC Mughal, and Tajview Agra. Your private driver will pick you up 25 minutes prior to your appointment.\n\nTip: The best time to photograph the Taj Mahal with your newly whitened smile is between 6:15 AM and 7:30 AM at the East Gate!`;
        botActions = [
          { label: '📅 Reschedule Slot', action: 'reschedule_auto' },
          { label: '📞 Talk to AI Agent', action: 'open_calling' },
        ];
      } else if (lower.includes('cancel')) {
        botReply = `We have received your cancellation request for #${activeApt?.appointmentNumber}. Our patient relations team will keep your slot open without penalty. Reach back whenever you are in Agra!`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: generateUniqueId('bot'),
          sender: 'bot',
          text: botReply,
          time: getCurrentFormattedTime(),
          actions: botActions,
        }
      ]);
    }, 900);
  };

  const handleActionClick = (action: string) => {
    if (action === 'reschedule_auto') {
      handleSendMessage("Please reschedule my appointment to tomorrow afternoon");
    } else if (action === 'rate_visit') {
      handleSendMessage("I want to rate my Taj White Pearl experience 5 stars! Exceptional service.");
    } else if (action === 'hotel_shuttle') {
      handleSendMessage("Can you confirm my hotel shuttle from Oberoi Amarvilas to the clinic?");
    } else if (action === 'open_calling') {
      onClose();
      onOpenCallingAgent();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b141a] rounded-3xl max-w-lg w-full h-[620px] flex flex-col shadow-2xl border border-stone-800 overflow-hidden text-stone-100">
        
        {/* WhatsApp Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#313d45]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-500/50 flex items-center justify-center text-white font-serif font-bold text-lg">
                🏛️
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#202c33]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-stone-100">
                  Taj White Pearl Concierge
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded font-medium border border-emerald-700/60 flex items-center gap-0.5">
                  ✓ Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Official Agra Dental Tourism & Patient Helpline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCallingAgent();
              }}
              title="Switch to Voice Call"
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
            >
              ✕
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
            🔒 Messages and dental records are end-to-end encrypted with Taj White Pearl Agra EHR.
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
          <button className="text-stone-400 hover:text-stone-200 p-1.5">
            <Smile className="w-5 h-5" />
          </button>
          <button className="text-stone-400 hover:text-stone-200 p-1.5">
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
