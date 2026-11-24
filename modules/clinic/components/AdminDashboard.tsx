'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Users,
  Stethoscope,
  MessageSquare,
  Mail,
  Search,
  Plus,
  UserPlus,
  Clock,
  Eye,
  MapPin,
  Plane,
  Star,
  X,
  Check,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  Building2,
  FileText,
} from 'lucide-react';
import {
  Appointment,
  Doctor,
  NotificationLog,
  Patient,
  AppointmentStatus,
} from '../domain/types';
import {
  computeClinicStats,
  generateAppointmentNumber,
} from '../domain/dental-logic';

interface AdminDashboardProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  notifications: NotificationLog[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onRescheduleAppointment: (
    appointmentNumber: string,
    newDate: string,
    newTime: string
  ) => boolean;
  onAddDoctor: (doctor: Doctor) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onTriggerNotification: (
    trigger:
      | 'reminder_24h'
      | 'reminder_2h'
      | 'post_treatment_rating'
      | 'recall_checkup',
    appointmentId: string,
    channel: 'email' | 'whatsapp'
  ) => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function AdminDashboard({
  appointments,
  doctors,
  patients,
  notifications,
  onUpdateAppointmentStatus,
  onRescheduleAppointment,
  onAddDoctor,
  onAddAppointment,
  onTriggerNotification,
  selectedCurrency,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'patients' | 'doctors' | 'messaging'
  >('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] =
    useState<Patient | null>(null);
  const [selectedNotificationForPreview, setSelectedNotificationForPreview] =
    useState<NotificationLog | null>(null);
  const [rescheduleModalData, setRescheduleModalData] = useState<{
    appointmentNumber: string;
    currentSlot: string;
  } | null>(null);
  const [newDate, setNewDate] = useState('2026-11-06');
  const [newTime, setNewTime] = useState('02:00 PM');

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState(
    'Pediatric & Family Dentistry'
  );
  const [newDocQualification, setNewDocQualification] = useState('BDS, MDS');
  const [newDocExperience, setNewDocExperience] = useState(8);
  const [newDocFeeINR, setNewDocFeeINR] = useState(800);
  const [newDocFeeUSD, setNewDocFeeUSD] = useState(15);
  const [newDocRoom, setNewDocRoom] = useState('Lotus Suite 103');
  const [newDocBio, setNewDocBio] = useState('');

  // Walk-in Form State for Receptionist
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinProblem, setWalkinProblem] = useState(
    'Acute Tooth Pain & Swelling'
  );
  const [walkinDoctorId, setWalkinDoctorId] = useState(
    doctors[0]?.id || 'doc-saurabh'
  );
  const [walkinNotes, setWalkinNotes] = useState(
    'Patient walked in directly to SSDC Agra reception.'
  );

  const stats = computeClinicStats(appointments, doctors);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (typeFilter !== 'all' && apt.patientType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        apt.patientName.toLowerCase().includes(q) ||
        apt.appointmentNumber.toLowerCase().includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.problemCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatFee = (inr?: number, usd?: number) => {
    const baseINR = inr || 12000;
    const baseUSD = usd || 145;
    if (selectedCurrency === 'INR') return `₹${baseINR.toLocaleString('en-IN')}`;
    if (selectedCurrency === 'GBP') return `£${Math.round(baseUSD * 0.79)}`;
    if (selectedCurrency === 'EUR') return `€${Math.round(baseUSD * 0.92)}`;
    return `$${baseUSD}`;
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in_chair':
        return (
          <span className="text-[10px] bg-[#7B1123]/10 text-[#7B1123] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7B1123] animate-pulse" />
            In Chair
          </span>
        );
      case 'arrived':
        return (
          <span className="text-[10px] bg-[#D4AF37]/15 text-[#8F6B12] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
            Arrived
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
            Completed
          </span>
        );
      case 'rescheduled':
        return (
          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
            Rescheduled
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] bg-red-50 text-red-800 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider line-through">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
            Confirmed
          </span>
        );
    }
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      title: 'Consultant Specialist',
      qualification: newDocQualification,
      specialty: newDocSpecialty,
      experienceYears: Number(newDocExperience),
      bio:
        newDocBio ||
        'Senior clinician dedicated to precision dental aesthetics and patient wellness in Agra.',
      avatarUrl:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      consultationFeeINR: Number(newDocFeeINR),
      consultationFeeUSD: Number(newDocFeeUSD),
      rating: 5.0,
      reviewCount: 1,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: '10:00 AM - 05:00 PM',
      roomNumber: newDocRoom,
      active: true,
    };

    onAddDoctor(newDoctor);
    setIsAddDoctorOpen(false);
    setNewDocName('');
    setNewDocBio('');
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const assignedDoc =
      doctors.find((d) => d.id === walkinDoctorId) || doctors[0];
    const aptNumber = generateAppointmentNumber();

    const walkinApt: Appointment = {
      id: `apt-walkin-${Date.now()}`,
      appointmentNumber: aptNumber,
      patientId: `pat-${Date.now()}`,
      patientName: walkinName,
      patientEmail: 'walkin.agra@ssdc-dental.com',
      patientPhone: walkinPhone || '+91 98000 00000',
      patientType: 'local',
      country: 'India',
      doctorId: assignedDoc.id,
      doctorName: assignedDoc.name,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Immediate (OPD Walk-in)',
      problemCategory: walkinProblem,
      problemDescription: walkinNotes,
      status: 'arrived',
      bookingSource: 'reception_walkin',
      estimatedCostINR: 1500,
      estimatedCostUSD: 20,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddAppointment(walkinApt);
    setIsWalkinModalOpen(false);
    setWalkinName('');
    setWalkinPhone('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalData) return;
    onRescheduleAppointment(
      rescheduleModalData.appointmentNumber,
      newDate,
      newTime
    );
    setRescheduleModalData(null);
  };

  const tabs = [
    {
      id: 'bookings' as const,
      label: 'Bookings & Queue',
      count: appointments.length,
    },
    {
      id: 'patients' as const,
      label: 'Patient Directory',
      count: patients.length,
    },
    {
      id: 'doctors' as const,
      label: 'Specialist Roster',
      count: doctors.length,
    },
    {
      id: 'messaging' as const,
      label: 'Messaging & Alerts',
      count: notifications.length,
    },
  ];

  return (
    <section className="bg-white min-h-[calc(100dvh-80px)] text-stone-900">
      {/* Container aligned with Navbar and Landing Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* 1. ADMIN HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
              <span className="w-5 h-[2px] bg-[#D4AF37]" />
              <span>SSDC Agra &middot; Master Operations</span>
            </div>

            <h1 className="font-funky font-extrabold text-2xl sm:text-4xl text-stone-950 tracking-tight leading-none">
              Hospital Command Center
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-stone-500">
              Master bookings, walk-in OPD triage, patient records &amp; doctor schedules.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t sm:border-t-0 border-stone-100">
            <button
              type="button"
              onClick={() => setIsWalkinModalOpen(true)}
              className="flex-1 sm:flex-initial justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Log Walk-In Intake</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddDoctorOpen(true)}
              className="flex-1 sm:flex-initial justify-center rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3.5 py-2.5 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#7B1123]" />
              <span>Add Doctor</span>
            </button>
          </div>
        </motion.div>

        {/* 2. UNBOXED 4-COLUMN SUMMARY STRIP (Hairline Divided) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-stone-200 py-6 sm:py-8 border-b border-stone-200">
          <div className="lg:pr-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Total Bookings
            </span>
            <p className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tabular-nums">
              {stats.totalBookings}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              100% recorded in clinic ledger
            </p>
          </div>

          <div className="lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Today&apos;s Active Queue
            </span>
            <p className="font-funky font-extrabold text-2xl sm:text-3xl text-[#7B1123] tabular-nums">
              {stats.activeAppointments}
            </p>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B1123] animate-pulse" />
              <span>Currently in clinic / chair</span>
            </p>
          </div>

          <div className="lg:px-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Foreign Dental Tourists
            </span>
            <p className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tabular-nums">
              {stats.internationalPatients}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              Taj tourism packages &middot; Amarvilas
            </p>
          </div>

          <div className="lg:pl-8 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
              Specialists on Duty
            </span>
            <p className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tabular-nums">
              {stats.activeDoctorsCount}/{stats.totalDoctorsCount}
            </p>
            <p className="text-xs text-emerald-700 font-semibold">
              All operatory suites online
            </p>
          </div>
        </div>

        {/* 3. UNDERLINE NAVIGATION TABS */}
        <div className="border-b border-stone-200 flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'text-[#7B1123]'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                    isActive
                      ? 'bg-[#7B1123]/10 text-[#7B1123]'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="adminPortalTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B1123]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 4. SINGLE-FOCUS TAB VIEWS */}
        <div className="py-6 sm:py-10">
          {/* TAB 1: BOOKINGS & QUEUE */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by patient, code (#TWP), doctor, problem..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs sm:text-sm text-stone-900 focus:border-[#7B1123] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    aria-label="Filter Patient Origin"
                    className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#7B1123]"
                  >
                    <option value="all">All Origins</option>
                    <option value="international">Foreign / Tourist</option>
                    <option value="local">Local Agra</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter Status"
                    className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#7B1123]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="arrived">Arrived</option>
                    <option value="in_chair">In Chair</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Responsive Schedule Roster */}
              <div className="divide-y divide-stone-200 border-b border-stone-200">
                {filteredAppointments.length === 0 ? (
                  <div className="py-16 text-center text-sm text-stone-400">
                    No appointments matched your search filters.
                  </div>
                ) : (
                  filteredAppointments.map((apt, idx) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      className="py-5 sm:py-6 group hover:bg-stone-50/60 px-2 sm:px-4 -mx-2 sm:-mx-4 transition-colors"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-start lg:items-center">
                        {/* Col 1: Time & Code */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between">
                          <span className="font-funky font-extrabold text-lg sm:text-xl text-stone-950 leading-none">
                            {apt.timeSlot}
                          </span>
                          <span className="font-mono text-xs text-[#7B1123] font-bold mt-1">
                            #{apt.appointmentNumber}
                          </span>
                        </div>

                        {/* Col 2: Patient & Origin */}
                        <div className="lg:col-span-3 space-y-0.5">
                          <h3 className="font-funky font-extrabold text-base sm:text-lg text-stone-950 group-hover:text-[#7B1123] transition-colors">
                            {apt.patientName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            {apt.patientType === 'international' ? (
                              <span className="inline-flex items-center gap-1 text-[#8F6B12] font-semibold">
                                <Plane className="w-3 h-3" />
                                {apt.country}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-stone-600">
                                <MapPin className="w-3 h-3" />
                                Agra Local
                              </span>
                            )}
                            <span>&middot;</span>
                            <span>{apt.patientPhone}</span>
                          </div>
                        </div>

                        {/* Col 3: Procedure & Doctor */}
                        <div className="lg:col-span-3 space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-stone-800 truncate">
                            {apt.problemCategory}
                          </p>
                          <p className="text-xs text-stone-500">
                            with <strong className="text-stone-700">{apt.doctorName}</strong>
                          </p>
                        </div>

                        {/* Col 4: Status & Fee */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between gap-1">
                          <div>{getStatusBadge(apt.status)}</div>
                          <span className="font-funky font-bold text-sm text-stone-900 tabular-nums">
                            {formatFee(apt.estimatedCostINR, apt.estimatedCostUSD)}
                          </span>
                        </div>

                        {/* Col 5: Actions */}
                        <div className="lg:col-span-2 flex items-center justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          {/* Fast Status Update Select */}
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              onUpdateAppointmentStatus(
                                apt.id,
                                e.target.value as AppointmentStatus
                              )
                            }
                            aria-label="Update Status"
                            className="text-xs font-semibold border border-stone-200 rounded-lg px-2 py-1.5 bg-white text-stone-700 cursor-pointer focus:outline-none focus:border-[#7B1123]"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="arrived">Arrived</option>
                            <option value="in_chair">In Chair</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {/* Reschedule Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setRescheduleModalData({
                                appointmentNumber: apt.appointmentNumber,
                                currentSlot: `${apt.date} at ${apt.timeSlot}`,
                              })
                            }
                            className="text-xs font-semibold text-stone-600 hover:text-[#7B1123] border border-stone-200 hover:border-[#7B1123] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: PATIENT DIRECTORY */}
          {activeTab === 'patients' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
                {patients.map((pat, idx) => (
                  <motion.div
                    key={pat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-stone-50/50 px-2 sm:px-4 -mx-2 sm:-mx-4 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                      <img
                        src={
                          pat.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={pat.fullName}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-funky font-extrabold text-xl text-stone-950 group-hover:text-[#7B1123] transition-colors">
                            {pat.fullName}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                              pat.type === 'international'
                                ? 'bg-[#D4AF37]/15 text-[#8F6B12]'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {pat.type === 'international'
                              ? `${pat.country} Tourist`
                              : 'Agra Local'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 font-medium">
                          {pat.phone} &middot; {pat.email}
                          {pat.passportNumber && (
                            <span> &middot; Passport: {pat.passportNumber}</span>
                          )}
                        </p>

                        <p className="text-xs text-stone-600">
                          <strong className="text-stone-700">Medical Alerts:</strong>{' '}
                          {pat.medicalAlerts?.join(', ') || 'None reported'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-stone-100 pt-3 sm:pt-0">
                      <span className="text-xs font-semibold text-stone-500">
                        <strong className="font-funky font-extrabold text-base text-stone-950">
                          {pat.totalVisits}
                        </strong>{' '}
                        Visits
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedPatientForDrawer(pat)}
                        className="rounded-xl text-xs font-bold text-white bg-[#7B1123] hover:bg-[#580B18] border border-[#D4AF37]/50 px-4 py-2.5 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>View EHR Record</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SPECIALIST ROSTER */}
          {activeTab === 'doctors' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-b border-stone-200">
                {doctors.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-funky font-extrabold text-xl text-stone-950">
                            {doc.name}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                              doc.active
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {doc.active ? 'On Duty' : 'On Leave'}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-[#7B1123]">
                          {doc.specialty}
                        </p>

                        <p className="text-xs text-stone-400 font-medium">
                          {doc.qualification} &middot; {doc.roomNumber}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                      {doc.bio}
                    </p>

                    <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-4 text-stone-700">
                        <span>{doc.experienceYears} Years Exp</span>
                        <span>&middot;</span>
                        <span>
                          {selectedCurrency === 'USD'
                            ? `$${doc.consultationFeeUSD}`
                            : `₹${doc.consultationFeeINR}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-stone-900">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{doc.rating}</span>
                        <span className="text-stone-400 font-normal">
                          ({doc.reviewCount})
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: MESSAGING & ALERTS */}
          {activeTab === 'messaging' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Demo Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <p className="text-xs text-stone-500 font-medium">
                  WhatsApp and Email notification history &amp; patient replies.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      appointments[0] &&
                      onTriggerNotification(
                        'reminder_24h',
                        appointments[0].id,
                        'whatsapp'
                      )
                    }
                    className="rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 transition-colors cursor-pointer"
                  >
                    + Trigger 24h WhatsApp Reminder
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      appointments[0] &&
                      onTriggerNotification(
                        'post_treatment_rating',
                        appointments[0].id,
                        'email'
                      )
                    }
                    className="rounded-xl text-xs font-semibold text-[#7B1123] bg-[#FFF1F2] hover:bg-[#FCE7EA] border border-[#7B1123]/30 px-3.5 py-2 transition-colors cursor-pointer"
                  >
                    + Trigger Review Request Email
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-stone-200 border-b border-stone-200">
                {notifications.map((notif, idx) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-stone-50/50 px-2 sm:px-4 -mx-2 sm:-mx-4 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.channel === 'whatsapp'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-[#FFF1F2] text-[#7B1123]'
                        }`}
                      >
                        {notif.channel === 'whatsapp' ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-950">
                            {notif.subject}
                          </h4>
                          <span className="font-mono text-[10px] text-stone-400">
                            #{notif.appointmentNumber}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                            {notif.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-1 max-w-2xl">
                          {notif.messageContent}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                          <span>
                            To: {notif.patientName} (
                            {notif.channel === 'whatsapp'
                              ? notif.patientPhone
                              : notif.patientEmail}
                            )
                          </span>
                          <span>&middot;</span>
                          <span>Sent: {notif.sentAt}</span>
                          {notif.responseReceived && (
                            <span className="text-emerald-700 font-bold">
                              &middot; Patient Replied: &ldquo;
                              {notif.responseReceived}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNotificationForPreview(notif)}
                      className="rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3.5 py-2 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      View Preview
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 5. PATIENT FULL EHR SHEET (PWA Bottom Sheet on Mobile + Desktop Slide-Over) */}
      <AnimatePresence>
        {selectedPatientForDrawer && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-end bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setSelectedPatientForDrawer(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-lg h-[90dvh] sm:h-full rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-stone-200 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div className="sm:hidden pt-3 pb-1 flex justify-center">
                <span className="w-10 h-1 rounded-full bg-stone-300" />
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-7">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-stone-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedPatientForDrawer.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={selectedPatientForDrawer.fullName}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h3 className="font-funky font-extrabold text-2xl text-stone-950">
                        {selectedPatientForDrawer.fullName}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Patient ID: {selectedPatientForDrawer.id} &middot;{' '}
                        {selectedPatientForDrawer.country}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPatientForDrawer(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <h4 className="font-funky font-extrabold text-sm uppercase tracking-wider text-stone-950">
                    Demographic &amp; Contact Information
                  </h4>
                  <div className="divide-y divide-stone-100 border-y border-stone-100">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-stone-400">Phone:</span>
                      <span className="font-semibold text-stone-800">
                        {selectedPatientForDrawer.phone}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-stone-400">Email:</span>
                      <span className="font-semibold text-stone-800">
                        {selectedPatientForDrawer.email}
                      </span>
                    </div>
                    {selectedPatientForDrawer.passportNumber && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-stone-400">Passport Number:</span>
                        <span className="font-mono font-bold text-[#7B1123]">
                          {selectedPatientForDrawer.passportNumber}
                        </span>
                      </div>
                    )}
                    <div className="py-2.5 flex justify-between">
                      <span className="text-stone-400">Medical Alerts:</span>
                      <span className="font-bold text-[#7B1123]">
                        {selectedPatientForDrawer.medicalAlerts?.join(', ') ||
                          'None reported'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-funky font-extrabold text-sm uppercase tracking-wider text-stone-950">
                    Appointment History
                  </h4>
                  <div className="space-y-2">
                    {appointments
                      .filter(
                        (a) =>
                          a.patientName.toLowerCase() ===
                          selectedPatientForDrawer.fullName.toLowerCase()
                      )
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-950">
                              {apt.problemCategory}
                            </span>
                            <span className="font-mono text-[#7B1123] font-bold">
                              #{apt.appointmentNumber}
                            </span>
                          </div>
                          <p className="text-stone-500">
                            {apt.date} at {apt.timeSlot} &middot; Dr. {apt.doctorName}
                          </p>
                          <div className="pt-1">{getStatusBadge(apt.status)}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:px-10 sm:py-5 border-t border-stone-200 bg-white">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForDrawer(null)}
                  className="w-full justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Patient Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. LOG WALK-IN MODAL */}
      <AnimatePresence>
        {isWalkinModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setIsWalkinModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden text-stone-900"
            >
              <div className="p-6 border-b border-stone-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                    <span className="w-4 h-[2px] bg-[#D4AF37]" />
                    <span>Reception Desk</span>
                  </div>
                  <h3 className="font-funky font-extrabold text-2xl text-stone-950">
                    Log Walk-In Patient Intake
                  </h3>
                  <p className="text-xs text-stone-500">
                    For local Agra patients arriving directly at clinic reception.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWalkinModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWalkin} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Phone Number (WhatsApp Updates)
                  </label>
                  <input
                    type="tel"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="+91 94122 XXXXX"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Presenting Complaint
                  </label>
                  <select
                    value={walkinProblem}
                    onChange={(e) => setWalkinProblem(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  >
                    <option value="Acute Tooth Pain & Swelling">
                      Acute Tooth Pain &amp; Swelling
                    </option>
                    <option value="Scaling & Pearl Polish">
                      Scaling &amp; Pearl Polish
                    </option>
                    <option value="Broken Crown / Filling">
                      Broken Crown / Filling
                    </option>
                    <option value="Wisdom Tooth Impaction">
                      Wisdom Tooth Impaction
                    </option>
                    <option value="General Checkup">
                      General Consultation &amp; X-Ray
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Assign Doctor on Duty
                  </label>
                  <select
                    value={walkinDoctorId}
                    onChange={(e) => setWalkinDoctorId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  >
                    {doctors
                      .filter((d) => d.active)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialty} &middot; {d.roomNumber})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Intake Notes
                  </label>
                  <textarea
                    rows={2}
                    value={walkinNotes}
                    onChange={(e) => setWalkinNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWalkinModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#7B1123] hover:bg-[#580B18] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#D4AF37]/50"
                  >
                    Queue Patient In-Clinic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ADD SPECIALIST DOCTOR MODAL */}
      <AnimatePresence>
        {isAddDoctorOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setIsAddDoctorOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden text-stone-900"
            >
              <div className="p-6 border-b border-stone-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                    <span className="w-4 h-[2px] bg-[#D4AF37]" />
                    <span>Hospital Administration</span>
                  </div>
                  <h3 className="font-funky font-extrabold text-2xl text-stone-950">
                    Add Specialist Doctor
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDoctor} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Doctor Full Name (with Dr. prefix) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g. Dr. Rohan Mehta"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      required
                      value={newDocSpecialty}
                      onChange={(e) => setNewDocSpecialty(e.target.value)}
                      placeholder="Pediatric / Endodontics..."
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      required
                      value={newDocQualification}
                      onChange={(e) => setNewDocQualification(e.target.value)}
                      placeholder="BDS, MDS"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newDocExperience}
                      onChange={(e) => setNewDocExperience(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Fee (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={newDocFeeINR}
                      onChange={(e) => setNewDocFeeINR(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Fee (USD $)
                    </label>
                    <input
                      type="number"
                      value={newDocFeeUSD}
                      onChange={(e) => setNewDocFeeUSD(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Clinic Suite / Room
                  </label>
                  <input
                    type="text"
                    value={newDocRoom}
                    onChange={(e) => setNewDocRoom(e.target.value)}
                    placeholder="Lotus Suite 103"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Doctor Bio
                  </label>
                  <textarea
                    rows={2}
                    value={newDocBio}
                    onChange={(e) => setNewDocBio(e.target.value)}
                    placeholder="Summary of experience and smile philosophy..."
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddDoctorOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#7B1123] hover:bg-[#580B18] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#D4AF37]/50"
                  >
                    Add Doctor to Roster
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. RESCHEDULE MODAL */}
      <AnimatePresence>
        {rescheduleModalData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setRescheduleModalData(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-sm w-full rounded-2xl border border-stone-200 shadow-2xl p-6 text-stone-900 space-y-4"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-funky font-extrabold text-lg text-stone-950">
                    Reschedule Appointment
                  </h3>
                  <p className="text-xs text-stone-500">
                    #{rescheduleModalData.appointmentNumber} &middot; Currently{' '}
                    {rescheduleModalData.currentSlot}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleModalData(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    min="2026-11-04"
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    New Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-[#7B1123] focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalData(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#7B1123] hover:bg-[#580B18] text-white px-4 py-2 rounded-xl text-xs font-bold border border-[#D4AF37]/50"
                  >
                    Confirm &amp; Notify
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. NOTIFICATION PREVIEW MODAL */}
      <AnimatePresence>
        {selectedNotificationForPreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setSelectedNotificationForPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl p-6 text-stone-900 space-y-4"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-2 rounded-xl ${
                      selectedNotificationForPreview.channel === 'whatsapp'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FFF1F2] text-[#7B1123]'
                    }`}
                  >
                    {selectedNotificationForPreview.channel === 'whatsapp' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <h3 className="font-funky font-extrabold text-base text-stone-950">
                      {selectedNotificationForPreview.channel.toUpperCase()} Preview
                    </h3>
                    <p className="text-xs text-stone-400">
                      #{selectedNotificationForPreview.appointmentNumber} &middot;{' '}
                      {selectedNotificationForPreview.sentAt}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNotificationForPreview(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-1">
                  <p>
                    <strong className="text-stone-700">Recipient:</strong>{' '}
                    {selectedNotificationForPreview.patientName}
                  </p>
                  <p>
                    <strong className="text-stone-700">Subject:</strong>{' '}
                    {selectedNotificationForPreview.subject}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-900 text-stone-100 p-4 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-line">
                  {selectedNotificationForPreview.messageContent}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotificationForPreview(null)}
                className="w-full bg-[#7B1123] hover:bg-[#580B18] text-white py-2.5 rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
