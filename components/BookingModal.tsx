'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Plane, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import { Appointment, Doctor, PatientType } from '../lib/types';
import { 
  DENTAL_PROCEDURES, 
  generateAppointmentNumber, 
  isDoctorSlotAvailable,
  generateNotificationMessage 
} from '../lib/dental-logic';

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
  const [arrivalDate, setArrivalDate] = useState('2026-11-10');
  const [hotelInAgra, setHotelInAgra] = useState('The Oberoi Amarvilas (Taj View)');
  const [airportPickup, setAirportPickup] = useState(true);

  // Dental problem & Doctor
  const [problemCategory, setProblemCategory] = useState('Porcelain Smile Veneers (Per Tooth)');
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-aarav');
  
  // Date & Slot
  const [selectedDate, setSelectedDate] = useState('2026-11-11');
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');
  
  // Confirmation state
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    setSlotError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotError(null);

    // Validate slot availability
    const available = isDoctorSlotAvailable(
      appointments,
      selectedDoctorId,
      selectedDate,
      selectedSlot
    );

    if (!available) {
      setSlotError(`This slot (${selectedSlot} on ${selectedDate}) is already booked. Please choose another time.`);
      return;
    }

    const assignedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
    const aptNumber = generateAppointmentNumber();

    // Cost estimation
    const procedure = DENTAL_PROCEDURES.find(p => p.name === problemCategory) || DENTAL_PROCEDURES[0];

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      patientId: `pat-${Date.now()}`,
      patientName: fullName || (patientType === 'international' ? 'International Guest' : 'Agra Patient'),
      patientEmail: email || 'patient@tajwhitepearl.com',
      patientPhone: phone || '+91 98765 00000',
      patientType,
      country: patientType === 'international' ? country : 'India',
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      problemCategory,
      problemDescription: problemDescription || `Scheduled for ${problemCategory} at Taj White Pearl Agra suite.`,
      status: 'confirmed',
      bookingSource: 'website',
      tourismDetails: patientType === 'international' ? {
        arrivalDate,
        hotelInAgra,
        airportPickupRequired: airportPickup,
        packageType: 'Taj Pearl Smile Makeover',
      } : undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
        
        {/* Modal Header with Agra Architectural flair */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-amber-300 text-2xl font-serif">
                💎
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-100">
                  Book Consultation & Treatment
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Taj White Pearl Dental Hospital & Luxury Spa • Agra
                </p>
              </div>
            </div>

            <button
              onClick={handleResetForm}
              className="text-stone-300 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Successful Booking View */}
        {bookedAppointment ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Booking Confirmed • {bookedAppointment.appointmentNumber}
              </span>
              <h4 className="font-serif font-bold text-2xl text-stone-900 mt-2">
                Your Taj Smile Journey Begins!
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                We have reserved your consultation with <strong className="text-stone-900">{bookedAppointment.doctorName}</strong> on <strong className="text-stone-900">{bookedAppointment.date} at {bookedAppointment.timeSlot}</strong>.
              </p>
            </div>

            {/* Notification Dispatch Receipts */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex items-center justify-between font-semibold text-stone-800 border-b border-stone-200 pb-2">
                <span>Automated Confirmation Dispatch</span>
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  ✓ Instant Delivered
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span><strong>Email:</strong> Detailed itinerary & hotel guide dispatched to {bookedAppointment.patientEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span><strong>WhatsApp:</strong> SMS & WhatsApp confirmation with QR check-in sent to {bookedAppointment.patientPhone}</span>
              </div>
              {bookedAppointment.patientType === 'international' && (
                <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 mt-2">
                  🏨 <strong>Agra Concierge Note:</strong> Private transfer coordinated for {bookedAppointment.tourismDetails?.hotelInAgra}.
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsApp();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Open in WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenCallingAgent();
                }}
                className="bg-stone-800 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Call AI Receptionist</span>
              </button>
              <button
                onClick={handleResetForm}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Patient Category Toggle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Select Patient Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPatientType('international')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    patientType === 'international'
                      ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className={`w-4 h-4 ${patientType === 'international' ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span className="font-serif font-bold text-sm text-stone-900">Foreign / Dental Tourist</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Traveling to Agra. Free airport pickup, Oberoi/Mughal hotel perks & Taj viewing timing.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPatientType('local')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    patientType === 'local'
                      ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className={`w-4 h-4 ${patientType === 'local' ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span className="font-serif font-bold text-sm text-stone-900">Local Agra / Indian Resident</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Agra & NCR residents. Fast-track OPD, priority slot & instant walk-in intake.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={patientType === 'international' ? 'e.g. Sarah Jenkins' : 'e.g. Rahul Sharma'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={patientType === 'international' ? '+44 7911 123456' : '+91 98765 43210'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {patientType === 'international' ? 'Country of Residence' : 'City / Area in Agra'}
                </label>
                <input
                  type="text"
                  value={patientType === 'international' ? country : city}
                  onChange={(e) => patientType === 'international' ? setCountry(e.target.value) : setCity(e.target.value)}
                  placeholder={patientType === 'international' ? 'United Kingdom, USA, Australia...' : 'DayalBagh, Kamla Nagar, Sanjay Place...'}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Foreign Dental Tourism Concierge Details */}
            {patientType === 'international' && (
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-amber-700" />
                  Agra Dental Tourism & Concierge Preferences:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Hotel in Agra</label>
                    <select
                      value={hotelInAgra}
                      onChange={(e) => setHotelInAgra(e.target.value)}
                      className="w-full p-2 border border-stone-200 rounded-xl bg-white text-xs"
                    >
                      <option value="The Oberoi Amarvilas (Taj View)">The Oberoi Amarvilas (Taj View)</option>
                      <option value="ITC Mughal, A Luxury Collection">ITC Mughal, A Luxury Collection</option>
                      <option value="Tajview, Agra - IHCL SeleQtions">Tajview, Agra - IHCL SeleQtions</option>
                      <option value="Courtyard by Marriott Agra">Courtyard by Marriott Agra</option>
                      <option value="Arranging Own Stay">Arranging Own Stay</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="pickupCheck"
                      checked={airportPickup}
                      onChange={(e) => setAirportPickup(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-stone-300"
                    />
                    <label htmlFor="pickupCheck" className="text-xs text-stone-700 font-medium">
                      Complimentary Airport / Agra Cantt Chauffeur Pickup
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Dental Problem / Procedure */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Procedure / Concern
              </label>
              <select
                value={problemCategory}
                onChange={(e) => setProblemCategory(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl bg-white focus:border-amber-600 focus:outline-none"
              >
                {DENTAL_PROCEDURES.map((proc) => (
                  <option key={proc.id} value={proc.name}>
                    {proc.name} — {selectedCurrency === 'USD' ? `$${proc.priceUSD}` : `₹${proc.priceINR.toLocaleString('en-IN')}`} ({proc.durationMinutes} mins)
                  </option>
                ))}
                <option value="Emergency Tooth Pain / Swelling">Emergency Tooth Pain / Swelling</option>
                <option value="General Checkup & 3D Scan">General Consultation & 3D Scan</option>
              </select>
            </div>

            {/* Step 4: Doctor Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Choose Specialist Doctor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctors.filter(d => d.active).map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleDoctorChange(doc.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      selectedDoctorId === doc.id
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <p className="font-serif font-bold text-xs text-stone-900">{doc.name}</p>
                      <p className="text-[10px] text-amber-800 font-medium">{doc.specialty}</p>
                      <p className="text-[10px] text-stone-500">{doc.experienceYears} yrs exp • {doc.roomNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Date & Slot Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
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
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => {
                    setSelectedSlot(e.target.value);
                    setSlotError(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
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
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{slotError}</span>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Specific Symptoms or Agra Itinerary Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Mention tooth location, sensitivity, or if you have specific days reserved for Agra sightseeing..."
                className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-800 hover:to-black text-white font-semibold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm Appointment & Dispatch Automated Alerts</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                Instant confirmation code, 24h reminders & review links sent via WhatsApp & Email.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
