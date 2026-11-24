'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plane,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Hotel,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { Appointment, Doctor, PatientType } from '../domain/types';
import {
  DENTAL_PROCEDURES,
  generateAppointmentNumber,
  isDoctorSlotAvailable,
} from '../domain/dental-logic';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (appointment: Appointment) => void;
  onOpenWhatsApp: () => void;
  onOpenCallingAgent: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

const AVAILABLE_TIME_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
];

export default function BookingModal({
  isOpen,
  onClose,
  doctors,
  appointments,
  onBookAppointment,
  onOpenWhatsApp,
  onOpenCallingAgent,
  selectedCurrency,
}: BookingModalProps) {
  const [patientType, setPatientType] = useState<PatientType>('international');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [city, setCity] = useState('');

  // Tourism details
  const [arrivalDate] = useState('2026-11-10');
  const [hotelInAgra, setHotelInAgra] = useState(
    'The Oberoi Amarvilas (Taj View)'
  );
  const [airportPickup, setAirportPickup] = useState(true);

  // Dental problem & Doctor
  const [problemCategory, setProblemCategory] = useState(
    'Porcelain Smile Veneers (Per Tooth)'
  );
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    doctors[0]?.id || 'doc-saurabh'
  );

  // Date & Slot
  const [selectedDate, setSelectedDate] = useState('2026-11-11');
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');

  // Confirmation state
  const [bookedAppointment, setBookedAppointment] =
    useState<Appointment | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    setSlotError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotError(null);

    const available = isDoctorSlotAvailable(
      appointments,
      selectedDoctorId,
      selectedDate,
      selectedSlot
    );

    if (!available) {
      setSlotError(
        `Slot ${selectedSlot} on ${selectedDate} is already booked. Please choose another time.`
      );
      return;
    }

    const assignedDoctor =
      doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const aptNumber = generateAppointmentNumber();

    const procedure =
      DENTAL_PROCEDURES.find((p) => p.name === problemCategory) ||
      DENTAL_PROCEDURES[0];

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      patientId: `pat-${Date.now()}`,
      patientName:
        fullName ||
        (patientType === 'international' ? 'International Guest' : 'Agra Patient'),
      patientEmail: email || 'patient@ssdc-agra.com',
      patientPhone: phone || '+91 98765 00000',
      patientType,
      country: patientType === 'international' ? country : 'India',
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      problemCategory,
      problemDescription:
        problemDescription ||
        `Scheduled for ${problemCategory} at SSDC Agra.`,
      status: 'confirmed',
      bookingSource: 'website',
      tourismDetails:
        patientType === 'international'
          ? {
              arrivalDate,
              hotelInAgra,
              airportPickupRequired: airportPickup,
              packageType: 'SSDC Agra Smile Sanctuary Package',
            }
          : undefined,
      estimatedCostINR: procedure.priceINR,
      estimatedCostUSD: procedure.priceUSD,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onBookAppointment(newAppointment);
    setBookedAppointment(newAppointment);
  };

  const handleResetForm = () => {
    setBookedAppointment(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setProblemDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/50 backdrop-blur-xs"
        onClick={handleResetForm}
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full sm:max-w-2xl max-h-[92dvh] rounded-t-2xl sm:rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col text-stone-900"
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
            <span className="w-10 h-1 rounded-full bg-stone-300" />
          </div>

          {/* Calm Editorial Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-start justify-between gap-4 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                <span className="w-4 h-[2px] bg-[#D4AF37]" />
                <span>SSDC Dental Clinic &middot; Agra</span>
              </div>
              <h3 className="font-funky font-extrabold text-xl sm:text-2xl text-stone-950 tracking-tight">
                {bookedAppointment ? 'Appointment Confirmed' : 'Book Your Visit'}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close booking dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {bookedAppointment ? (
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[11px] font-bold text-emerald-800 block">
                    Ref #{bookedAppointment.appointmentNumber}
                  </span>
                  <h4 className="font-funky font-extrabold text-xl text-stone-950 mt-0.5">
                    We look forward to welcoming you
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    Your consultation with{' '}
                    <strong className="text-stone-950">
                      {bookedAppointment.doctorName}
                    </strong>{' '}
                    is reserved for{' '}
                    <strong className="text-stone-950">
                      {bookedAppointment.date} at {bookedAppointment.timeSlot}
                    </strong>
                    .
                  </p>
                </div>
              </div>

              {/* Confirmation Dispatch Summary */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 divide-y divide-stone-200 text-xs">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="font-bold text-stone-800">
                    Confirmation Sent
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </span>
                </div>

                <div className="px-4 py-3 text-stone-600">
                  <strong className="text-stone-800">Email:</strong>{' '}
                  Appointment details sent to {bookedAppointment.patientEmail}
                </div>

                <div className="px-4 py-3 text-stone-600">
                  <strong className="text-stone-800">WhatsApp:</strong>{' '}
                  Clinic directions and reminders sent to{' '}
                  {bookedAppointment.patientPhone}
                </div>

                {bookedAppointment.patientType === 'international' && (
                  <div className="px-4 py-3 bg-[#FEFCE8] text-[#8F6B12] flex items-center gap-2 font-medium">
                    <Hotel className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Agra Stay:</strong> Private pickup coordinated for{' '}
                      {bookedAppointment.tourismDetails?.hotelInAgra}.
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWhatsApp();
                    }}
                    className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCallingAgent();
                    }}
                    className="rounded-xl border border-stone-200 hover:border-[#7B1123] text-stone-800 hover:text-[#7B1123] text-xs font-semibold px-4 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#7B1123]" />
                    <span>Call Clinic</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="rounded-xl bg-[#7B1123] hover:bg-[#580B18] text-white text-xs font-bold px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto"
            >
              {/* Patient Origin */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                  Patient Origin
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPatientType('international')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      patientType === 'international'
                        ? 'border-[#7B1123] bg-[#FFF1F2]/40'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 font-funky font-extrabold text-sm text-stone-950">
                        <Plane
                          className={`w-4 h-4 ${
                            patientType === 'international'
                              ? 'text-[#7B1123]'
                              : 'text-stone-400'
                          }`}
                        />
                        International Guest
                      </span>
                      {patientType === 'international' && (
                        <Check className="w-4 h-4 text-[#7B1123]" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Visiting Agra. Includes hotel coordination &amp; pickup.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPatientType('local')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      patientType === 'local'
                        ? 'border-[#7B1123] bg-[#FFF1F2]/40'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 font-funky font-extrabold text-sm text-stone-950">
                        <MapPin
                          className={`w-4 h-4 ${
                            patientType === 'local'
                              ? 'text-[#7B1123]'
                              : 'text-stone-400'
                          }`}
                        />
                        Agra / Indian Resident
                      </span>
                      {patientType === 'local' && (
                        <Check className="w-4 h-4 text-[#7B1123]" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Agra &amp; NCR residents. Fast-track OPD priority slot.
                    </p>
                  </button>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={
                        patientType === 'international'
                          ? 'Sarah Jenkins'
                          : 'Rahul Sharma'
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={
                        patientType === 'international'
                          ? '+44 7911 123456'
                          : '+91 98765 43210'
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {patientType === 'international'
                      ? 'Country'
                      : 'City / Area'}
                  </label>
                  <input
                    type="text"
                    value={patientType === 'international' ? country : city}
                    onChange={(e) =>
                      patientType === 'international'
                        ? setCountry(e.target.value)
                        : setCity(e.target.value)
                    }
                    placeholder={
                      patientType === 'international'
                        ? 'United Kingdom, USA, Australia...'
                        : 'Civil Lines, Dayalbagh...'
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dental Tourism Hotel & Pickup */}
              {patientType === 'international' && (
                <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FEFCE8]/40 p-4 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#8F6B12] flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5 text-[#7B1123]" />
                    Agra Hotel &amp; Airport Transfer
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-center">
                    <select
                      value={hotelInAgra}
                      onChange={(e) => setHotelInAgra(e.target.value)}
                      aria-label="Hotel in Agra"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#7B1123] focus:outline-none"
                    >
                      <option value="The Oberoi Amarvilas (Taj View)">
                        The Oberoi Amarvilas (Taj View)
                      </option>
                      <option value="ITC Mughal, A Luxury Collection">
                        ITC Mughal, A Luxury Collection
                      </option>
                      <option value="Tajview, Agra - IHCL SeleQtions">
                        Tajview, Agra - IHCL SeleQtions
                      </option>
                      <option value="Courtyard by Marriott Agra">
                        Courtyard by Marriott Agra
                      </option>
                      <option value="Arranging Own Stay">
                        Arranging Own Stay
                      </option>
                    </select>

                    <label className="flex items-center gap-2 text-xs text-stone-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={airportPickup}
                        onChange={(e) => setAirportPickup(e.target.checked)}
                        className="w-4 h-4 accent-[#7B1123] rounded"
                      />
                      Complimentary airport / station pickup
                    </label>
                  </div>
                </div>
              )}

              {/* Treatment Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Treatment / Concern
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-stone-200 bg-white font-semibold focus:border-[#7B1123] focus:outline-none"
                >
                  {DENTAL_PROCEDURES.map((proc) => (
                    <option key={proc.id} value={proc.name}>
                      {proc.name} &mdash;{' '}
                      {selectedCurrency === 'INR'
                        ? `₹${proc.priceINR.toLocaleString('en-IN')}`
                        : `$${proc.priceUSD}`}{' '}
                      ({proc.durationMinutes} mins)
                    </option>
                  ))}
                  <option value="Emergency Tooth Pain / Swelling">
                    Emergency Tooth Pain / Swelling
                  </option>
                  <option value="General Checkup & 3D Scan">
                    General Consultation &amp; 3D Scan
                  </option>
                </select>
              </div>

              {/* Specialist Doctor */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Choose Doctor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors
                    .filter((d) => d.active)
                    .map((doc) => {
                      const isSelected = selectedDoctorId === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => handleDoctorChange(doc.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'border-[#7B1123] bg-[#FFF1F2]/40'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-funky font-extrabold text-xs text-stone-950 truncate">
                              {doc.name}
                            </p>
                            <p className="text-[11px] text-[#7B1123] font-semibold truncate">
                              {doc.specialty}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              {doc.experienceYears} yrs exp &middot;{' '}
                              {doc.roomNumber}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min="2026-11-03"
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSlotError(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => {
                      setSelectedSlot(e.target.value);
                      setSlotError(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:border-[#7B1123] focus:outline-none"
                  >
                    {AVAILABLE_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {slotError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{slotError}</span>
                </div>
              )}

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Notes or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Any tooth sensitivity, questions, or Agra sightseeing dates..."
                  className="w-full p-3 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#7B1123] focus:outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-stone-200">
                <button
                  type="submit"
                  className="w-full bg-[#7B1123] hover:bg-[#580B18] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
