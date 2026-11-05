'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Download,
  Hotel,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Appointment, Doctor, Patient } from '../lib/types';

interface ForeignClientPortalProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onOpenCallingAgent: () => void;
  onOpenWhatsApp: () => void;
  onAddReview: (appointmentNumber: string, rating: number, feedback: string) => void;
  onRescheduleAppointment: (appointmentNumber: string, newDate: string, newTime: string) => boolean;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

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
  // Foreign patients available for demo
  const foreignPatients = patients.filter(p => p.type === 'international');
  const [selectedPatientId, setSelectedPatientId] = useState(foreignPatients[0]?.id || 'pat-sarah');
  
  const currentPatient = foreignPatients.find(p => p.id === selectedPatientId) || foreignPatients[0];
  const patientAppointments = appointments.filter(a => a.patientName === currentPatient?.fullName || a.patientType === 'international');
  const activeAppointment = patientAppointments[0] || appointments[0];
  const assignedDoctor = doctors.find(d => d.name === activeAppointment?.doctorName) || doctors[0];

  // Review Form state
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Quick Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-11-06');
  const [rescheduleTime, setRescheduleTime] = useState('03:00 PM');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAppointment) {
      onAddReview(activeAppointment.appointmentNumber, ratingVal, reviewText || "Exceptional treatment in Agra! Painless and flawless.");
      setReviewSubmitted(true);
    }
  };

  const handleConfirmReschedule = () => {
    if (activeAppointment) {
      onRescheduleAppointment(activeAppointment.appointmentNumber, rescheduleDate, rescheduleTime);
      setIsRescheduling(false);
      setRescheduleSuccess(true);
      setTimeout(() => setRescheduleSuccess(false), 4000);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Foreign Client Header & Switcher */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentPatient?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={currentPatient?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  International Dental Tourist Portal
                </span>
                <span className="text-xs text-stone-400">• Passport: {currentPatient?.passportNumber || 'Verified'}</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                Welcome, {currentPatient?.fullName}
              </h2>
              <p className="text-xs text-stone-500">
                Origin: {currentPatient?.city}, {currentPatient?.country} • Dental Tourism Concierge VIP
              </p>
            </div>
          </div>

          {/* Switch Demo Patient */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Switch Guest Profile:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-800"
            >
              {foreignPatients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {rescheduleSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your appointment has been successfully rescheduled. Updated confirmation sent to your WhatsApp and Email!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column: Active Appointment & Doctor Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Appointment Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    #{activeAppointment?.appointmentNumber || 'TWP-1042'}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● {activeAppointment?.status || 'Confirmed'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Procedure</span>
                  <span className="font-semibold text-xs text-stone-900">{activeAppointment?.problemCategory}</span>
                </div>
              </div>

              {/* Slot & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 mb-5 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Appointment Date</span>
                  <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    {activeAppointment?.date}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Scheduled Time</span>
                  <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    {activeAppointment?.timeSlot}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Hospital Suite</span>
                  <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    {assignedDoctor?.roomNumber || 'Mughal Suite 101'}
                  </span>
                </div>
              </div>

              {/* Appointed Doctor Detailed Profile */}
              <div className="bg-gradient-to-br from-amber-50/60 via-stone-50 to-white p-5 rounded-2xl border border-amber-200/70 mb-5">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-3">
                  Your Appointed Senior Specialist:
                </span>
                <div className="flex items-start gap-4">
                  <img
                    src={assignedDoctor?.avatarUrl}
                    alt={assignedDoctor?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900">{assignedDoctor?.name}</h4>
                    <p className="text-xs text-amber-800 font-semibold">{assignedDoctor?.specialty}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{assignedDoctor?.qualification}</p>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {assignedDoctor?.bio}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold text-[11px]">
                        ★ {assignedDoctor?.rating} ({assignedDoctor?.reviewCount} reviews)
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {assignedDoctor?.experienceYears} Years International Clinical Experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Action Buttons: Reschedule, WhatsApp, Call Agent */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setIsRescheduling(!isRescheduling)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>Reschedule My Slot</span>
                </button>

                <button
                  onClick={onOpenWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Manage via WhatsApp Bot</span>
                </button>

                <button
                  onClick={onOpenCallingAgent}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call AI Voice Receptionist</span>
                </button>
              </div>

              {/* Inline Reschedule Selector */}
              {isRescheduling && (
                <div className="mt-4 p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs space-y-3 animate-fade-in">
                  <h5 className="font-serif font-bold text-stone-900">Select New Date & Time Slot:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1">New Date</label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        min="2026-11-04"
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">New Time Slot</label>
                      <select
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-1.5 bg-stone-200 rounded-xl text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmReschedule}
                      className="px-4 py-1.5 bg-amber-700 text-white rounded-xl font-semibold shadow-xs"
                    >
                      Confirm New Timing
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post-Treatment Rating & Feedback Form */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-stone-900">
                    Rate Your Taj Smile Experience
                  </h4>
                  <p className="text-xs text-stone-500">
                    Your feedback helps us continuously perfect our luxury dental tourism standards in Agra.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="font-serif font-bold text-stone-900 text-sm">Thank You for Reviewing Your Smile!</h5>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your {ratingVal}-star review has been credited to Dr. {assignedDoctor.name}. A complimentary Taj Pearl 10% Family Voucher has been sent to your WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRating} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">How would you rate your comfort and results?</label>
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
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-serif font-bold text-stone-800 text-sm">
                        {ratingVal === 5 ? 'Exceptional (5.0)' : `${ratingVal}.0 Stars`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1.5">Your Review / Testimonial</label>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts about painlessness, precision, doctor warmth, or combining it with your Taj Mahal visit..."
                      className="w-full p-3 border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Submit Review & Log to EHR
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Sidebar: Dental Tourism Concierge & Sightseeing Guide */}
          <div className="space-y-6">
            
            {/* Travel Concierge Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Plane className="w-5 h-5 text-amber-700" />
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Agra Travel & Stay Concierge
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Assigned Hotel</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Hotel className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-stone-800">
                      {activeAppointment?.tourismDetails?.hotelInAgra || 'The Oberoi Amarvilas (Taj View)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Private clinic shuttle arranged</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Airport Transfer</span>
                  <span className="font-semibold text-stone-800 block mt-1">
                    {activeAppointment?.tourismDetails?.airportPickupRequired ? 'VIP Mercedes Chauffeur Confirmed' : 'Self-Arranged'}
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">IGI Delhi Airport ⇄ Agra Expressway</span>
                </div>
              </div>
            </div>

            {/* Taj Mahal Sightseeing Around Treatment Guide */}
            <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                <Compass className="w-5 h-5 text-amber-300" />
                <h4 className="font-serif font-bold text-base text-stone-100">
                  Taj Sightseeing & Recovery
                </h4>
              </div>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="border-l-2 border-amber-400 pl-3">
                  <strong className="text-amber-200 block">Sunrise Taj Viewing:</strong>
                  Best photography window is 6:15 AM - 7:30 AM via East Gate (5 mins from clinic). Perfect for showing off whitened teeth!
                </div>

                <div className="border-l-2 border-amber-400 pl-3">
                  <strong className="text-amber-200 block">Post-Veneer Diet in Agra:</strong>
                  Enjoy warm saffron malai kulfi, soft paneer makhani, and herbal mint tea for the first 24 hours.
                </div>

                <div className="border-l-2 border-amber-400 pl-3">
                  <strong className="text-amber-200 block">24/7 Hotel Doctor Call:</strong>
                  If you experience any sensitivity at your hotel, Dr. Aarav or Dr. Ananya can dispatch clinic care directly.
                </div>
              </div>
            </div>

            {/* Treatment Guarantee & Digital EHR */}
            <div className="bg-stone-100 rounded-3xl p-5 border border-stone-200 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-serif font-bold text-stone-900">Lifetime Warranty & Digital Records</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                All Zirconia implants and E-max porcelain veneers include an international digital certificate valid across worldwide dental boards.
              </p>
              <button
                onClick={() => alert("Downloading encrypted digital dental summary & X-ray packet (#TWP-1042)...")}
                className="w-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Download Digital Dental Passport</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
