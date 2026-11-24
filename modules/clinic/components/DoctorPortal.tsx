'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  X,
} from 'lucide-react';
import { Appointment, Doctor, AppointmentStatus } from '../domain/types';

interface DoctorPortalProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onSaveClinicalNotes: (
    appointmentId: string,
    notes: string,
    prescriptions: string[]
  ) => void;
}

export default function DoctorPortal({
  doctors,
  appointments,
  onUpdateStatus,
  onSaveClinicalNotes,
}: DoctorPortalProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    doctors[0]?.id || 'doc-aarav'
  );
  const activeDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const doctorAppointments = appointments.filter(
    (a) =>
      a.doctorId === activeDoctor?.id || a.doctorName === activeDoctor?.name
  );

  // Filter tab state
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'upcoming' | 'in_chair' | 'completed'
  >('all');

  // Slide-over / Bottom-sheet Patient Chart & Rx state (opens ONLY on click)
  const [activeAptForChart, setActiveAptForChart] =
    useState<Appointment | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState('');
  const [rxInput, setRxInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const upcomingCount = doctorAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'arrived'
  ).length;
  const inChairCount = doctorAppointments.filter(
    (a) => a.status === 'in_chair'
  ).length;
  const completedCount = doctorAppointments.filter(
    (a) => a.status === 'completed'
  ).length;

  const filteredAppointments = doctorAppointments.filter((apt) => {
    if (activeFilter === 'upcoming') {
      return apt.status === 'confirmed' || apt.status === 'arrived';
    }
    if (activeFilter === 'in_chair') {
      return apt.status === 'in_chair';
    }
    if (activeFilter === 'completed') {
      return apt.status === 'completed';
    }
    return true;
  });

  const openPatientChart = (apt: Appointment) => {
    setActiveAptForChart(apt);
    setClinicalNotesInput(
      apt.clinicalNotes ||
        `Clinical evaluation for ${apt.problemCategory}. Patient reports mild sensitivity. Enamel structure prepared. Post-care guidance issued.`
    );
    setRxInput(
      apt.prescriptions && apt.prescriptions.length > 0
        ? apt.prescriptions.join(', ')
        : 'Amoxicillin 500mg, Ibuprofen 400mg PRN, Chlorhexidine 0.2% Rinse'
    );
    setSavedNotice(false);
  };

  const handleSaveChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAptForChart) return;
    const rxList = rxInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSaveClinicalNotes(activeAptForChart.id, clinicalNotesInput, rxList);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setActiveAptForChart(null);
    }, 850);
  };

  // Keep slide-over status in sync if updated inside drawer
  const currentChartApt = activeAptForChart
    ? appointments.find((a) => a.id === activeAptForChart.id) ||
      activeAptForChart
    : null;

  const filterTabs = [
    {
      id: 'all' as const,
      label: 'All Appointments',
      count: doctorAppointments.length,
    },
    { id: 'upcoming' as const, label: 'Upcoming', count: upcomingCount },
    { id: 'in_chair' as const, label: 'In Chair', count: inChairCount },
    { id: 'completed' as const, label: 'Completed', count: completedCount },
  ];

  return (
    <section className="bg-white min-h-[calc(100dvh-80px)] text-stone-900">
      {/* Same max-w-7xl & horizontal padding as Navbar and Landing Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* 1. DOCTOR HEADER — Matches Landing Page Kicker, Typography & Border Radius */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200"
        >
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={activeDoctor?.avatarUrl}
                alt={activeDoctor?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200 shadow-2xs"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                <span className="w-5 h-[2px] bg-[#D4AF37]" />
                <span>{activeDoctor?.roomNumber} &middot; Clinician Suite</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-funky font-extrabold text-2xl sm:text-4xl text-stone-950 tracking-tight leading-none">
                  {activeDoctor?.name}
                </h1>
                <span className="text-[10px] bg-[#D4AF37]/15 text-[#8F6B12] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {activeDoctor?.qualification}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-500">
                {activeDoctor?.specialty} &middot; {activeDoctor?.availableHours}
              </p>
            </div>
          </div>

          {/* Right: Landing-Page-Styled Doctor Switcher & Clean Summary */}
          <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-2 lg:pt-0 border-t sm:border-t-0 border-stone-100">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                aria-label="Switch Clinician"
                className="w-full sm:w-auto appearance-none rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 pl-3.5 pr-9 py-2.5 transition-colors cursor-pointer focus:outline-none focus:border-[#7B1123]"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.roomNumber})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-stone-700">
                <strong className="font-funky font-extrabold text-sm text-stone-950">
                  {upcomingCount}
                </strong>{' '}
                Upcoming
              </span>
              <span className="text-stone-300">&middot;</span>
              <span className="text-[#7B1123]">
                <strong className="font-funky font-extrabold text-sm">
                  {inChairCount}
                </strong>{' '}
                In Chair
              </span>
              <span className="text-stone-300">&middot;</span>
              <span className="text-stone-400">
                <strong className="font-funky font-extrabold text-sm text-stone-600">
                  {completedCount}
                </strong>{' '}
                Completed
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. UNDERLINE FILTER TABS — Exact Match with ServicesSection.tsx */}
        <div className="border-b border-stone-200 flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
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
                    layoutId="doctorPortalTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B1123]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. SPACIOUS SCHEDULE LIST — Mobile-First & Flush with Landing Page Grid */}
        <div className="divide-y divide-stone-200 border-b border-stone-200">
          {filteredAppointments.length === 0 ? (
            <div className="py-16 text-center text-sm text-stone-400">
              No appointments in this filter for {activeDoctor?.name}.
            </div>
          ) : (
            filteredAppointments.map((apt, idx) => {
              const isInChair = apt.status === 'in_chair';
              const isArrived = apt.status === 'arrived';
              const isCompleted = apt.status === 'completed';

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => openPatientChart(apt)}
                  className={`group transition-colors cursor-pointer ${
                    isInChair
                      ? 'py-6 sm:py-8 px-4 sm:px-6 my-3 rounded-2xl border border-[#7B1123]/20 bg-[#7B1123]/[0.02]'
                      : 'py-6 sm:py-8 hover:bg-stone-50/60 px-2 sm:px-4 -mx-2 sm:-mx-4'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start lg:items-center">
                    {/* Col 1: Time & Status Tag on Mobile */}
                    <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between w-full">
                      <div
                        className={`font-funky font-extrabold text-xl sm:text-2xl tracking-tight leading-none tabular-nums ${
                          isInChair
                            ? 'text-[#7B1123]'
                            : isCompleted
                            ? 'text-stone-400'
                            : 'text-stone-950'
                        }`}
                      >
                        {apt.timeSlot}
                      </div>

                      <div className="flex items-center gap-1.5 lg:mt-1.5">
                        {isInChair ? (
                          <span className="text-[10px] bg-[#7B1123]/10 text-[#7B1123] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B1123] animate-pulse" />
                            In Chair
                          </span>
                        ) : isArrived ? (
                          <span className="text-[10px] bg-[#D4AF37]/15 text-[#8F6B12] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                            Arrived
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            {apt.date}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Col 2: Patient Name & Origin */}
                    <div className="lg:col-span-3 space-y-0.5">
                      <h3
                        className={`font-funky font-extrabold text-lg sm:text-xl transition-colors ${
                          isCompleted
                            ? 'text-stone-500'
                            : 'text-stone-950 group-hover:text-[#7B1123]'
                        }`}
                      >
                        {apt.patientName}
                      </h3>
                      <p className="text-xs font-medium text-stone-400">
                        {apt.country} &middot;{' '}
                        <span className="font-mono text-stone-500">
                          #{apt.appointmentNumber}
                        </span>
                      </p>
                    </div>

                    {/* Col 3: Procedure & Clinical Summary */}
                    <div className="lg:col-span-4 space-y-1">
                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          isInChair
                            ? 'text-[#7B1123]'
                            : isCompleted
                            ? 'text-stone-400'
                            : 'text-stone-800'
                        }`}
                      >
                        {apt.problemCategory}
                      </div>
                      <p
                        className={`text-xs leading-relaxed line-clamp-1 ${
                          isCompleted ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        {apt.clinicalNotes || apt.problemDescription}
                      </p>
                    </div>

                    {/* Col 4: Touch-Friendly Actions (Matches Navbar/Landing rounded-xl Buttons) */}
                    <div
                      className="lg:col-span-3 flex items-center justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isInChair ? (
                        <button
                          type="button"
                          onClick={() => openPatientChart(apt)}
                          className="w-full sm:w-auto justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
                        >
                          <span>Open Chart &amp; Rx</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                      ) : isArrived ? (
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(apt.id, 'in_chair')}
                            className="flex-1 sm:flex-initial justify-center bg-white hover:bg-[#7B1123] text-[#7B1123] hover:text-white border border-[#7B1123] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Seat in Chair
                          </button>
                          <button
                            type="button"
                            onClick={() => openPatientChart(apt)}
                            aria-label="Open Chart"
                            className="w-10 h-10 rounded-full border border-stone-300 hover:border-[#7B1123] hover:bg-[#7B1123] hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : isCompleted ? (
                        <button
                          type="button"
                          onClick={() => openPatientChart(apt)}
                          className="text-xs font-bold text-stone-500 hover:text-[#7B1123] inline-flex items-center gap-1.5 py-2 cursor-pointer transition-colors"
                        >
                          <span>Review Notes</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(apt.id, 'arrived')}
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 border border-stone-200 transition-colors cursor-pointer"
                          >
                            Mark Arrived
                          </button>
                          <button
                            type="button"
                            onClick={() => openPatientChart(apt)}
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#7B1123] hover:text-stone-950 transition-colors cursor-pointer py-2"
                          >
                            <span>Chart</span>
                            <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. PATIENT CHART & RX SHEET — Mobile Bottom Sheet + Desktop Slide-Over */}
      <AnimatePresence>
        {currentChartApt && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-end bg-stone-950/50 backdrop-blur-xs"
            onClick={() => setActiveAptForChart(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-xl h-[90dvh] sm:h-full rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-stone-200 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Mobile Drag Handle Indicator */}
              <div className="sm:hidden pt-3 pb-1 flex justify-center">
                <span className="w-10 h-1 rounded-full bg-stone-300" />
              </div>

              {/* Scrollable Sheet Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-7">
                {/* Sheet Header */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-stone-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7B1123]">
                      <span className="w-4 h-[2px] bg-[#D4AF37]" />
                      <span>
                        Patient Chart &middot; #{currentChartApt.appointmentNumber}
                      </span>
                    </div>
                    <h2 className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950 tracking-tight">
                      {currentChartApt.patientName}
                    </h2>
                    <p className="text-xs font-medium text-stone-500">
                      {currentChartApt.country} &middot;{' '}
                      {currentChartApt.patientPhone} &middot;{' '}
                      {currentChartApt.timeSlot}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAptForChart(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Close chart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Segmented Status Bar (Matches Navbar Currency Segmented Control) */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-stone-400 font-bold mb-2">
                    Chair Status
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-stone-50 border border-stone-200 rounded-xl p-1 text-xs font-semibold text-stone-600">
                    {(
                      [
                        { id: 'confirmed', label: 'Confirmed' },
                        { id: 'arrived', label: 'Arrived' },
                        { id: 'in_chair', label: 'In Chair' },
                        { id: 'completed', label: 'Done' },
                      ] as const
                    ).map((step) => {
                      const active = currentChartApt.status === step.id;
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() =>
                            onUpdateStatus(currentChartApt.id, step.id)
                          }
                          className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
                            active
                              ? 'bg-[#7B1123] text-white font-bold shadow-2xs'
                              : 'hover:text-[#7B1123]'
                          }`}
                        >
                          {step.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Presenting Procedure Summary */}
                <div className="py-5 border-y border-stone-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">
                      Scheduled Treatment
                    </span>
                    <span className="text-xs font-bold text-[#7B1123]">
                      {currentChartApt.problemCategory}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {currentChartApt.problemDescription}
                  </p>
                  {currentChartApt.tourismDetails?.hotelInAgra && (
                    <p className="text-xs font-semibold text-[#8F6B12] pt-1">
                      Sanctuary Stay: {currentChartApt.tourismDetails.hotelInAgra}
                    </p>
                  )}
                </div>

                {/* Clinical Notes & Prescription Form */}
                <form
                  id="doctorChartForm"
                  onSubmit={handleSaveChart}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Clinical Diagnosis &amp; Procedure Notes
                    </label>
                    <textarea
                      rows={5}
                      value={clinicalNotesInput}
                      onChange={(e) => setClinicalNotesInput(e.target.value)}
                      placeholder="Record clinical findings, tooth surfaces treated, shade match, and post-op care..."
                      className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs sm:text-sm leading-relaxed text-stone-900 focus:border-[#7B1123] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Prescription Medications (Rx)
                    </label>
                    <input
                      type="text"
                      value={rxInput}
                      onChange={(e) => setRxInput(e.target.value)}
                      placeholder="Medications separated by commas..."
                      className="w-full p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs sm:text-sm text-stone-900 focus:border-[#7B1123] focus:outline-none transition-colors"
                    />
                    <p className="text-[11px] text-stone-400 mt-1.5">
                      Separate multiple medications with commas.
                    </p>
                  </div>
                </form>
              </div>

              {/* Sticky Bottom Action Bar (PWA Safe Area Friendly) */}
              <div className="p-4 sm:px-10 sm:py-5 border-t border-stone-200 bg-white flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveAptForChart(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="doctorChartForm"
                  className="flex-1 sm:flex-initial justify-center bg-[#7B1123] hover:bg-[#580B18] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#D4AF37]/50"
                >
                  {savedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Saved to Patient Record</span>
                    </>
                  ) : (
                    <>
                      <span>Save Notes &amp; Prescription</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
