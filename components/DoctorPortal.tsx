'use client';

import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Pill, 
  Eye, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Appointment, Doctor, AppointmentStatus } from '../lib/types';

interface DoctorPortalProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onSaveClinicalNotes: (appointmentId: string, notes: string, prescriptions: string[]) => void;
}

export default function DoctorPortal({
  doctors,
  appointments,
  onUpdateStatus,
  onSaveClinicalNotes,
}: DoctorPortalProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-aarav');
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const doctorAppointments = appointments.filter(a => a.doctorId === activeDoctor?.id || a.doctorName === activeDoctor?.name);
  
  // Note editor modal
  const [activeAptForNotes, setActiveAptForNotes] = useState<Appointment | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState('');
  const [rxInput, setRxInput] = useState('Amoxicillin 500mg, Ibuprofen 400mg PRN, Chlorhexidine mouthwash');

  const openNoteEditor = (apt: Appointment) => {
    setActiveAptForNotes(apt);
    setClinicalNotesInput(apt.clinicalNotes || `Clinical evaluation for ${apt.problemCategory}. Patient reports mild sensitivity. Enamel structure prepared. Post-care guidance issued.`);
  };

  const handleSaveNotes = () => {
    if (!activeAptForNotes) return;
    const rxList = rxInput.split(',').map(s => s.trim()).filter(Boolean);
    onSaveClinicalNotes(activeAptForNotes.id, clinicalNotesInput, rxList);
    setActiveAptForNotes(null);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Doctor Header & Switcher */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeDoctor?.avatarUrl}
              alt={activeDoctor?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold border border-teal-200 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  Doctor Clinical Workstation
                </span>
                <span className="text-xs text-stone-400">• {activeDoctor?.roomNumber}</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                {activeDoctor?.name}
              </h2>
              <p className="text-xs text-stone-500">
                {activeDoctor?.specialty} • {activeDoctor?.qualification} • {activeDoctor?.experienceYears} Yrs Experience
              </p>
            </div>
          </div>

          {/* Switch Doctor Roster (supports newly added doctors from admin!) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Switch Clinician:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-800"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty.slice(0, 24)}...)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Summary Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-100">
              Today&apos;s Patient Schedule ({doctorAppointments.length} Appointed)
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Available Clinic Hours: {activeDoctor?.availableHours} • Next OPD slot ready
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
              <span className="text-stone-400 block text-[10px]">Confirmed:</span>
              <span className="font-bold text-stone-200">{doctorAppointments.filter(a => a.status === 'confirmed').length}</span>
            </div>
            <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
              <span className="text-amber-400 block text-[10px]">In Clinic / Chair:</span>
              <span className="font-bold text-amber-300">{doctorAppointments.filter(a => a.status === 'arrived' || a.status === 'in_chair').length}</span>
            </div>
            <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
              <span className="text-emerald-400 block text-[10px]">Completed:</span>
              <span className="font-bold text-emerald-300">{doctorAppointments.filter(a => a.status === 'completed').length}</span>
            </div>
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {doctorAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-400">
              No appointments currently scheduled for {activeDoctor?.name}.
            </div>
          ) : (
            doctorAppointments.map((apt) => (
              <div 
                key={apt.id} 
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-serif font-bold text-amber-800 text-lg">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-stone-900">{apt.patientName}</h4>
                        <span className="font-mono text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          #{apt.appointmentNumber}
                        </span>
                        {apt.patientType === 'international' ? (
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            ✈️ Foreign Guest ({apt.country})
                          </span>
                        ) : (
                          <span className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            📍 Local Agra Resident
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Phone: {apt.patientPhone} • Email: {apt.patientEmail}
                      </p>
                    </div>
                  </div>

                  {/* Slot & Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {apt.date} at {apt.timeSlot}
                    </span>

                    <span className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'arrived' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'in_chair' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                {/* Patient Problem & Symptoms Details */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 mb-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                      Presenting Complaint / Procedure:
                    </span>
                    <span className="font-semibold text-amber-800">{apt.problemCategory}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    <strong>Symptoms & History:</strong> {apt.problemDescription}
                  </p>
                  {apt.tourismDetails && (
                    <p className="text-blue-900 text-[11px] pt-1 border-t border-stone-200">
                      <strong>Tourism Concierge:</strong> Staying at {apt.tourismDetails.hotelInAgra}. Sightseeing schedule around Taj Mahal noted.
                    </p>
                  )}
                  {apt.clinicalNotes && (
                    <div className="bg-white p-3 rounded-xl border border-stone-200 mt-2">
                      <strong className="text-stone-900 block mb-1">Doctor&apos;s Clinical Notes:</strong>
                      <p className="text-stone-600">{apt.clinicalNotes}</p>
                      {apt.prescriptions && apt.prescriptions.length > 0 && (
                        <p className="text-stone-500 mt-1"><strong>Rx:</strong> {apt.prescriptions.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Doctor Clinical Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {apt.status === 'arrived' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'in_chair')}
                        className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Seat Patient In Chair</span>
                      </button>
                    )}

                    {(apt.status === 'in_chair' || apt.status === 'confirmed' || apt.status === 'arrived') && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'completed')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Treatment Completed</span>
                      </button>
                    )}

                    <button
                      onClick={() => openNoteEditor(apt)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-600" />
                      <span>{apt.clinicalNotes ? 'Edit Clinical Notes & Rx' : '+ Add Clinical Notes & Rx'}</span>
                    </button>
                  </div>

                  {apt.rating && (
                    <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                      <span>Patient Rated: {apt.rating} ★</span>
                      {apt.reviewFeedback && <span className="text-stone-400 italic font-normal">&ldquo;{apt.reviewFeedback.slice(0, 30)}...&rdquo;</span>}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Note Editor Modal */}
      {activeAptForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Doctor Notes & Prescription — #{activeAptForNotes.appointmentNumber}
                </h3>
                <p className="text-stone-500">Patient: {activeAptForNotes.patientName}</p>
              </div>
              <button onClick={() => setActiveAptForNotes(null)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Clinical Diagnosis & Procedure Findings</label>
                <textarea
                  rows={4}
                  value={clinicalNotesInput}
                  onChange={(e) => setClinicalNotesInput(e.target.value)}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                  placeholder="Record tooth surfaces treated, anaesthetic used, shade match, post-op instructions..."
                ></textarea>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Prescription Medication (Rx)</label>
                <input
                  type="text"
                  value={rxInput}
                  onChange={(e) => setRxInput(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl focus:border-amber-600 focus:outline-none"
                  placeholder="Medications separated by commas..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveAptForNotes(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save to Patient Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
