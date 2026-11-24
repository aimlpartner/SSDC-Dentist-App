'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Download,
  Hotel,
  Compass,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Plane,
  X,
  Check,
} from 'lucide-react';
import { Appointment, Doctor, Patient } from '../domain/types';

interface ForeignClientPortalProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onOpenCallingAgent: () => void;
  onOpenWhatsApp: () => void;
  onAddReview: (
    appointmentNumber: string,
    rating: number,
    feedback: string
  ) => void;
  onRescheduleAppointment: (
    appointmentNumber: string,
    newDate: string,
    newTime: string
  ) => boolean;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

const RESCHEDULE_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
];

export default function ForeignClientPortal({
  appointments,
  doctors,
  patients,
  onOpenCallingAgent,
  onOpenWhatsApp,
  onAddReview,
  onRescheduleAppointment,
  selectedCurrency,
}: ForeignClientPortalProps) {
  const foreignPatients = patients.filter((p) => p.type === 'international');
  const [selectedPatientId, setSelectedPatientId] = useState(
    foreignPatients[0]?.id || 'pat-sarah'
  );

  const currentPatient =
    foreignPatients.find((p) => p.id === selectedPatientId) ||
    foreignPatients[0];
  const patientAppointments = appointments.filter(
    (a) =>
      a.patientName === currentPatient?.fullName ||
      a.patientType === 'international'
  );
  const activeAppointment = patientAppointments[0] || appointments[0];
  const assignedDoctor =
    doctors.find((d) => d.name === activeAppointment?.doctorName) || doctors[0];

  // Focused Tab Navigation (one clean view at a time — zero clutter)
  const [activeTab, setActiveTab] = useState<
    'appointment' | 'itinerary' | 'review'
  >('appointment');

  // Reschedule Slide-Over / Bottom-Sheet state
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(
    activeAppointment?.date || '2026-11-06'
  );
  const [rescheduleTime, setRescheduleTime] = useState(
    activeAppointment?.timeSlot || '02:30 PM'
  );
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Digital Passport download state
  const [passportDownloaded, setPassportDownloaded] = useState(false);

  // Review Form state
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAppointment) {
      onRescheduleAppointment(
        activeAppointment.appointmentNumber,
        rescheduleDate,
        rescheduleTime
      );
      setIsRescheduleOpen(false);
      setRescheduleSuccess(true);
      setTimeout(() => setRescheduleSuccess(false), 4000);
    }
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAppointment) {
      onAddReview(
        activeAppointment.appointmentNumber,
        ratingVal,
        reviewText || 'Exceptional treatment in Agra! Painless and flawless.'
      );
      setReviewSubmitted(true);
    }
  };

  const handleDownloadPassport = () => {
    setPassportDownloaded(true);
    setTimeout(() => setPassportDownloaded(false), 3500);
  };

  const tabs = [
    { id: 'appointment' as const, label: 'My Appointment & Specialist' },
    { id: 'itinerary' as const, label: 'Agra Travel & Taj Itinerary' },
    { id: 'review' as const, label: 'Rate Your Visit' },
  ];

  return (
    <section className="bg-white min-h-[calc(100dvh-80px)] text-stone-900">
      {/* Same max-w-7xl & horizontal padding as Navbar, Landing Page & Doctor Portal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* 1. GUEST HEADER — Matches Landing Page & Doctor Portal */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200"
        >
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={
                  currentPatient?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                }
                alt={currentPatient?.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200 shadow-2xs"
              />
              <span className="w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-white absolute -bottom-1 -right-1" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                <span className="w-5 h-[2px] bg-[#D4AF37]" />
                <span>International Guest Dossier</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-funky font-extrabold text-2xl sm:text-4xl text-stone-950 tracking-tight leading-none">
                  {currentPatient?.fullName}
                </h1>
                <span className="text-[10px] bg-[#D4AF37]/15 text-[#8F6B12] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {currentPatient?.country}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-500">
                {currentPatient?.city}, {currentPatient?.country} &middot;
                Passport: {currentPatient?.passportNumber || 'Verified'}
              </p>
            </div>
          </div>

          {/* Right: Guest Switcher & Concierge Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t sm:border-t-0 border-stone-100">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setReviewSubmitted(false);
                }}
                aria-label="Switch Guest Profile"
                className="w-full sm:w-auto appearance-none rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 pl-3.5 pr-9 py-2.5 transition-colors cursor-pointer focus:outline-none focus:border-[#7B1123]"
              >
                {foreignPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    Guest: {p.fullName} ({p.country})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="button"
              onClick={onOpenCallingAgent}
              className="flex-1 sm:flex-initial justify-center rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3.5 py-2.5 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#7B1123]" />
              <span>Call Reception</span>
            </button>

            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="flex-1 sm:flex-initial justify-center rounded-xl text-xs font-bold text-white bg-[#7B1123] hover:bg-[#580B18] border border-[#D4AF37]/50 px-4 py-2.5 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>WhatsApp Desk</span>
            </button>
          </div>
        </motion.div>

        {/* 2. UNBOXED 4-COLUMN SUMMARY STRIP (Hairline Divided) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-stone-200 py-6 sm:py-8 border-b border-stone-200">
          <div className="lg:pr-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Appointment Slot
            </span>
            <p className="font-funky font-extrabold text-lg sm:text-xl text-stone-950">
              {activeAppointment?.timeSlot}
            </p>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {activeAppointment?.date} &middot; #
                {activeAppointment?.appointmentNumber}
              </span>
            </p>
          </div>

          <div className="lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Treatment &amp; Suite
            </span>
            <p className="font-funky font-extrabold text-lg sm:text-xl text-[#7B1123] truncate">
              {activeAppointment?.problemCategory}
            </p>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{assignedDoctor?.roomNumber || 'Mughal Suite 101'}</span>
            </p>
          </div>

          <div className="lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Agra Stay
            </span>
            <p className="font-funky font-extrabold text-lg sm:text-xl text-stone-950 truncate">
              {activeAppointment?.tourismDetails?.hotelInAgra ||
                'The Oberoi Amarvilas'}
            </p>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Private Clinic Shuttle Ready</span>
            </p>
          </div>

          <div className="lg:pl-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Airport Chauffeur
            </span>
            <p className="font-funky font-extrabold text-lg sm:text-xl text-stone-950">
              {activeAppointment?.tourismDetails?.airportPickupRequired
                ? 'VIP Pickup Confirmed'
                : 'Self-Arranged'}
            </p>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" />
              <span>Delhi IGI &harr; Agra Expressway</span>
            </p>
          </div>
        </div>

        {/* Status Toast Notices */}
        {rescheduleSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your appointment (#{activeAppointment?.appointmentNumber}) has
              been rescheduled to {rescheduleDate} at {rescheduleTime}.
              Confirmation sent to WhatsApp!
            </span>
          </div>
        )}

        {passportDownloaded && (
          <div className="mt-6 p-4 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#8F6B12] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7B1123] shrink-0" />
            <span>
              Digital Dental Passport &amp; Warranty Certificate (#
              {activeAppointment?.appointmentNumber}) downloaded to your device.
            </span>
          </div>
        )}

        {/* 3. UNDERLINE NAVIGATION TABS — Matches Landing Page & Doctor Portal */}
        <div className="border-b border-stone-200 flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'text-[#7B1123]'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="clientPortalTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B1123]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 4. SINGLE-FOCUS TAB CONTENT */}
        <div className="py-8 sm:py-12">
          {/* TAB 1: MY APPOINTMENT & SPECIALIST */}
          {activeTab === 'appointment' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
            >
              {/* Left 7 Columns: Appointed Specialist Editorial Profile */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                    <span className="w-5 h-[2px] bg-[#D4AF37]" />
                    <span>Your Assigned Clinician</span>
                  </div>
                  <h2 className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tracking-tight">
                    {assignedDoctor?.name}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-5 pt-2">
                  <img
                    src={assignedDoctor?.avatarUrl}
                    alt={assignedDoctor?.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#7B1123]">
                        {assignedDoctor?.specialty}
                      </span>
                      <span className="text-stone-300">&middot;</span>
                      <span className="flex items-center gap-1 text-xs font-extrabold text-stone-900">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        {assignedDoctor?.rating} ({assignedDoctor?.reviewCount}{' '}
                        reviews)
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-400">
                      {assignedDoctor?.qualification} &middot;{' '}
                      {assignedDoctor?.experienceYears} Years Experience
                    </p>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                      {assignedDoctor?.bio}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRescheduleOpen(true)}
                    className="w-full sm:w-auto justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Reschedule My Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPassport}
                    className="w-full sm:w-auto justify-center rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-4 py-3 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#7B1123]" />
                    <span>Download Digital Dental Passport</span>
                  </button>
                </div>
              </div>

              {/* Right 5 Columns: Visit Summary & Warranty Assurance */}
              <div className="lg:col-span-5 lg:border-l border-stone-200 lg:pl-10 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#D4AF37] block">
                    Clinical Dossier &amp; Warranty
                  </span>
                  <h3 className="font-funky font-extrabold text-xl text-stone-950">
                    Visit Notes &amp; Coverage
                  </h3>
                </div>

                <div className="divide-y divide-stone-200 border-y border-stone-200 text-xs">
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-stone-500">Booking Reference</span>
                    <span className="font-mono font-bold text-stone-950">
                      #{activeAppointment?.appointmentNumber}
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-stone-500">Status</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {activeAppointment?.status}
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-stone-500">Estimated Tariff</span>
                    <span className="font-funky font-extrabold text-base text-[#7B1123]">
                      {selectedCurrency === 'INR'
                        ? `₹${(
                            activeAppointment?.estimatedCostINR || 18000
                          ).toLocaleString('en-IN')}`
                        : `$${activeAppointment?.estimatedCostUSD || 220}`}
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-stone-500">International Warranty</span>
                    <span className="font-semibold text-stone-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      15-Year Global Certificate
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed">
                  {activeAppointment?.problemDescription}
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AGRA TRAVEL & TAJ ITINERARY */}
          {activeTab === 'itinerary' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
            >
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                  <span className="w-5 h-[2px] bg-[#D4AF37]" />
                  <span>Zero-Downtime Dental Tourism</span>
                </div>
                <h2 className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tracking-tight">
                  Your Agra Sanctuary Itinerary.
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Every clinical session is timed around your Taj Mahal sightseeing and hotel recovery so you experience zero travel disruption.
                </p>
              </div>

              <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
                {[
                  {
                    step: '01',
                    time: 'Arrival & Check-In',
                    title:
                      activeAppointment?.tourismDetails?.hotelInAgra ||
                      'The Oberoi Amarvilas (Taj View)',
                    desc: 'Private chauffeur pickup from Delhi IGI Airport or Agra Cantt station directly to your hotel.',
                    tag: 'Confirmed',
                  },
                  {
                    step: '02',
                    time: '06:15 AM – 08:00 AM',
                    title: 'Sunrise Taj Mahal Viewing (East Gate)',
                    desc: 'Best photography window via the Taj East Gate—located just 500m from SSDC Dental Clinic.',
                    tag: 'Sightseeing Friendly',
                  },
                  {
                    step: '03',
                    time: `${activeAppointment?.timeSlot} (${activeAppointment?.date})`,
                    title: `${activeAppointment?.problemCategory} with ${assignedDoctor?.name}`,
                    desc: `Painless microscopic session in ${
                      assignedDoctor?.roomNumber || 'Mughal Suite 101'
                    }. Private electric shuttle transfers you from hotel to chairside.`,
                    tag: 'Clinical Session',
                  },
                  {
                    step: '04',
                    time: 'Evening Recovery',
                    title: 'Soft-Diet Culinary Protocol & 24/7 Hotel Support',
                    desc: 'Enjoy saffron malai kulfi, soft paneer makhani, and herbal mint tea. Direct WhatsApp doctor support on standby.',
                    tag: 'Zero Downtime',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start lg:items-center"
                  >
                    <div className="lg:col-span-3 flex lg:flex-col items-baseline justify-between gap-2">
                      <span className="font-funky text-sm font-extrabold text-[#D4AF37]">
                        {item.step}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        {item.time}
                      </span>
                    </div>

                    <div className="lg:col-span-6 space-y-1">
                      <h3 className="font-funky font-extrabold text-lg sm:text-xl text-stone-950">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="lg:col-span-3 flex lg:justify-end pt-1 lg:pt-0">
                      <span className="text-[10px] bg-[#D4AF37]/15 text-[#8F6B12] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: RATE YOUR VISIT */}
          {activeTab === 'review' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl space-y-8"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                  <span className="w-5 h-[2px] bg-[#D4AF37]" />
                  <span>Patient Experience</span>
                </div>
                <h2 className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tracking-tight">
                  Rate your SSDC Agra experience.
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Your feedback is logged directly to {assignedDoctor?.name}
                  &apos;s clinical record.
                </p>
              </div>

              {reviewSubmitted ? (
                <div className="py-8 border-y border-stone-200 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-funky font-extrabold text-xl">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Thank you for reviewing your visit!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Your {ratingVal}-star rating has been credited to{' '}
                    {assignedDoctor?.name}. A complimentary 10% Family Privilege
                    Voucher has been sent to your WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRating} className="space-y-6">
                  <div className="py-5 border-y border-stone-200 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm font-bold text-stone-800">
                      How would you rate your comfort and results?
                    </span>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingVal(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= ratingVal
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-funky font-extrabold text-base text-stone-950">
                        {ratingVal}.0
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Your Testimonial
                    </label>
                    <textarea
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts about painlessness, clinical precision, or combining your treatment with visiting the Taj Mahal..."
                      className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs sm:text-sm text-stone-900 focus:border-[#7B1123] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
                  >
                    <span>Submit Review</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* 5. RESCHEDULE SLOT SHEET — Mobile PWA Bottom Sheet + Desktop Slide-Over */}
      <AnimatePresence>
        {isRescheduleOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-end bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setIsRescheduleOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md h-auto sm:h-full rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-stone-200 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Mobile Drag Handle */}
              <div className="sm:hidden pt-3 pb-1 flex justify-center">
                <span className="w-10 h-1 rounded-full bg-stone-300" />
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                      <span className="w-4 h-[2px] bg-[#D4AF37]" />
                      <span>Modify Timing</span>
                    </div>
                    <h2 className="font-funky font-extrabold text-2xl text-stone-950">
                      Reschedule Visit
                    </h2>
                    <p className="text-xs text-stone-500">
                      Current: {activeAppointment?.date} at{' '}
                      {activeAppointment?.timeSlot}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRescheduleOpen(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  id="guestRescheduleForm"
                  onSubmit={handleConfirmReschedule}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Select New Date
                    </label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      min="2026-11-04"
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs sm:text-sm text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {RESCHEDULE_SLOTS.map((slot) => {
                        const active = rescheduleTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setRescheduleTime(slot)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              active
                                ? 'bg-[#7B1123] text-white border-[#7B1123]'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 sm:px-10 sm:py-5 border-t border-stone-200 bg-white flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="guestRescheduleForm"
                  className="flex-1 sm:flex-initial justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirm New Slot</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
