'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  PhoneCall, 
  Eye, 
  AlertCircle, 
  Sparkles, 
  Globe, 
  MapPin, 
  Star,
  FileText,
  DollarSign,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Appointment, Doctor, NotificationLog, Patient, PatientType, AppointmentStatus } from '../lib/types';
import { computeClinicStats, generateAppointmentNumber, generateNotificationMessage } from '../lib/dental-logic';

interface AdminDashboardProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  notifications: NotificationLog[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onRescheduleAppointment: (appointmentNumber: string, newDate: string, newTime: string) => boolean;
  onAddDoctor: (doctor: Doctor) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onTriggerNotification: (trigger: 'reminder_24h' | 'reminder_2h' | 'post_treatment_rating' | 'recall_checkup', appointmentId: string, channel: 'email' | 'whatsapp') => void;
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
  const [activeTab, setActiveTab] = useState<'bookings' | 'patients' | 'doctors' | 'messaging'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<Patient | null>(null);
  const [selectedNotificationForPreview, setSelectedNotificationForPreview] = useState<NotificationLog | null>(null);
  const [rescheduleModalData, setRescheduleModalData] = useState<{ appointmentNumber: string; currentSlot: string } | null>(null);
  const [newDate, setNewDate] = useState('2026-11-06');
  const [newTime, setNewTime] = useState('02:00 PM');

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Pediatric & Family Dentistry');
  const [newDocQualification, setNewDocQualification] = useState('BDS, MDS');
  const [newDocExperience, setNewDocExperience] = useState(8);
  const [newDocFeeINR, setNewDocFeeINR] = useState(800);
  const [newDocFeeUSD, setNewDocFeeUSD] = useState(15);
  const [newDocRoom, setNewDocRoom] = useState('Lotus Suite 103');
  const [newDocBio, setNewDocBio] = useState('');

  // Walk-in Form State for Receptionist
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinProblem, setWalkinProblem] = useState('Acute Tooth Pain & Swelling');
  const [walkinDoctorId, setWalkinDoctorId] = useState(doctors[0]?.id || 'doc-aarav');
  const [walkinNotes, setWalkinNotes] = useState('Patient walked in directly to Agra reception.');

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
      bio: newDocBio || 'Expert clinician dedicated to precision dental aesthetics and patient wellness in Agra.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
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

    const assignedDoc = doctors.find(d => d.id === walkinDoctorId) || doctors[0];
    const aptNumber = generateAppointmentNumber();

    const walkinApt: Appointment = {
      id: `apt-walkin-${Date.now()}`,
      appointmentNumber: aptNumber,
      patientId: `pat-${Date.now()}`,
      patientName: walkinName,
      patientEmail: 'walkin.agra@tajwhitepearl.com',
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

  const handleConfirmReschedule = () => {
    if (!rescheduleModalData) return;
    onRescheduleAppointment(rescheduleModalData.appointmentNumber, newDate, newTime);
    setRescheduleModalData(null);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Quick Action Bar */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="font-serif font-bold text-2xl text-stone-900">
                Agra Clinic Master Administration & Staff Roster
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Tracking every booking, walk-in patient, foreign dental tourist, doctor schedule, and automated messaging log.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Walk-In Button for Receptionists */}
            <button
              onClick={() => setIsWalkinModalOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Log Local Walk-in Intake</span>
            </button>

            {/* Add Doctor Button */}
            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Add Specialist Doctor</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Total Bookings</span>
            <p className="font-serif font-bold text-2xl text-stone-900 mt-1">{stats.totalBookings}</p>
            <span className="text-[10px] text-emerald-600 font-medium">100% Recorded</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Active Queue</span>
            <p className="font-serif font-bold text-2xl text-amber-700 mt-1">{stats.activeAppointments}</p>
            <span className="text-[10px] text-amber-600 font-medium">Today in Clinic</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Foreign Tourists</span>
            <p className="font-serif font-bold text-2xl text-blue-700 mt-1">{stats.internationalPatients}</p>
            <span className="text-[10px] text-blue-600 font-medium">Taj Tourism Packages</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Local Agra OPD</span>
            <p className="font-serif font-bold text-2xl text-stone-800 mt-1">{stats.localPatients}</p>
            <span className="text-[10px] text-stone-500 font-medium">Walk-ins & Locals</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Specialists Roster</span>
            <p className="font-serif font-bold text-2xl text-teal-700 mt-1">{stats.totalDoctorsCount}</p>
            <span className="text-[10px] text-teal-600 font-medium">{stats.activeDoctorsCount} on duty now</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Avg Patient Rating</span>
            <p className="font-serif font-bold text-2xl text-amber-600 mt-1 flex items-center gap-1">
              <span>{stats.averageRating}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </p>
            <span className="text-[10px] text-stone-500 font-medium">Taj Smile Standards</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings & Walk-ins Master Table ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'patients'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Profiles & EHR Directory ({patients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctors & Specialists Management ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'messaging'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Automated WhatsApp & Email Center ({notifications.length})</span>
          </button>
        </div>

        {/* TAB 1: Bookings & Walk-ins */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by patient, code (#TWP), doctor, problem..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-stone-200 rounded-xl bg-white text-xs font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="arrived">Arrived (In Clinic)</option>
                  <option value="in_chair">In Chair (Active Treatment)</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Patient Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-stone-200 rounded-xl bg-white text-xs font-medium"
                >
                  <option value="all">All Patient Origins</option>
                  <option value="international">Foreign / Dental Tourist</option>
                  <option value="local">Local Agra / Indian</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Patient & Origin</th>
                    <th className="py-3 px-4">Problem / Procedure</th>
                    <th className="py-3 px-4">Assigned Doctor</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-400">
                        No appointments matched your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-900 whitespace-nowrap">
                          {apt.appointmentNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{apt.patientName}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            {apt.patientType === 'international' ? (
                              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium text-[10px]">
                                ✈️ {apt.country}
                              </span>
                            ) : (
                              <span className="bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium text-[10px]">
                                📍 Agra Local
                              </span>
                            )}
                            <span>{apt.patientPhone}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-medium text-stone-900 truncate">{apt.problemCategory}</div>
                          <div className="text-[11px] text-stone-500 truncate">{apt.problemDescription}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-stone-800">{apt.doctorName}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-stone-900">{apt.date}</div>
                          <div className="text-[11px] text-stone-500">{apt.timeSlot}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="capitalize bg-stone-100 px-2 py-0.5 rounded text-[10px] font-medium text-stone-700 border border-stone-200">
                            {apt.bookingSource.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              apt.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'arrived'
                                ? 'bg-amber-100 text-amber-800'
                                : apt.status === 'in_chair'
                                ? 'bg-purple-100 text-purple-800 animate-pulse'
                                : apt.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'rescheduled'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {apt.status === 'in_chair' && '🩺 '}
                            {apt.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast Status Update Select */}
                            <select
                              value={apt.status}
                              onChange={(e) => onUpdateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                              className="text-[10px] border border-stone-200 rounded p-1 bg-white font-medium cursor-pointer"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="arrived">Arrived</option>
                              <option value="in_chair">In Chair</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {/* Reschedule Button */}
                            <button
                              onClick={() => setRescheduleModalData({ appointmentNumber: apt.appointmentNumber, currentSlot: `${apt.date} at ${apt.timeSlot}` })}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded font-medium transition-colors cursor-pointer"
                            >
                              Reschedule
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Patient Directory & EHR */}
        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((pat) => (
              <div 
                key={pat.id} 
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={pat.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={pat.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shadow-2xs"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-stone-900">{pat.fullName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          pat.type === 'international' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {pat.type === 'international' ? `✈️ ${pat.country}` : '📍 Agra Local Patient'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-lg font-bold">
                      {pat.totalVisits} Visits
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 mb-4 border-t border-stone-100 pt-3">
                    <p className="flex items-center justify-between">
                      <span className="text-stone-400">Phone:</span>
                      <span className="font-medium">{pat.phone}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-stone-400">Email:</span>
                      <span className="font-medium truncate max-w-[170px]">{pat.email}</span>
                    </p>
                    {pat.passportNumber && (
                      <p className="flex items-center justify-between">
                        <span className="text-stone-400">Passport:</span>
                        <span className="font-mono font-medium text-amber-900">{pat.passportNumber}</span>
                      </p>
                    )}
                    <p className="flex items-center justify-between">
                      <span className="text-stone-400">Medical Alerts:</span>
                      <span className="font-medium text-amber-800">{pat.medicalAlerts?.join(', ') || 'None reported'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPatientForDrawer(pat)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>View Complete EHR Record</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Doctors Management */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Current Dental Specialists Roster ({doctors.length})
              </h3>
              <button
                onClick={() => setIsAddDoctorOpen(true)}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Doctor to Hospital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base text-stone-900">{doc.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            doc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {doc.active ? '● Active On Duty' : 'On Leave'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-800 font-semibold">{doc.specialty}</p>
                        <p className="text-[11px] text-stone-500">{doc.qualification}</p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mb-4 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100 mb-4">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Experience</span>
                        <span className="font-semibold text-stone-800">{doc.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Consultation Fee</span>
                        <span className="font-semibold text-stone-800">
                          {selectedCurrency === 'USD' ? `$${doc.consultationFeeUSD}` : `₹${doc.consultationFeeINR}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Clinic Suite</span>
                        <span className="font-semibold text-stone-800">{doc.roomNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Patient Rating</span>
                        <span className="font-semibold text-amber-700 flex items-center gap-0.5">
                          {doc.rating} ★ ({doc.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span>Available: {doc.availableHours}</span>
                    <span className="font-medium text-stone-700">Days: {doc.availableDays.slice(0, 3).join(', ')}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Automated Messaging & Follow-Up Center */}
        {activeTab === 'messaging' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Automated Messaging Engine & Engagement Dispatcher
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time WhatsApp & Email dispatch triggers for 24h reminders, post-treatment reviews, and 6-month hygiene recalls.
                </p>
              </div>

              {/* Quick Trigger Demo Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => appointments[0] && onTriggerNotification('reminder_24h', appointments[0].id, 'whatsapp')}
                  className="bg-green-50 hover:bg-green-100 border border-green-300 text-green-800 px-3 py-1.5 rounded-xl font-medium cursor-pointer"
                >
                  + Trigger 24h WhatsApp Reminder
                </button>
                <button
                  onClick={() => appointments[0] && onTriggerNotification('post_treatment_rating', appointments[0].id, 'email')}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1.5 rounded-xl font-medium cursor-pointer"
                >
                  + Trigger Review Request Email
                </button>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      notif.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {notif.channel === 'whatsapp' ? <MessageSquare className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-stone-900">{notif.subject}</span>
                        <span className="text-[10px] font-mono text-stone-400">#{notif.appointmentNumber}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-semibold uppercase">
                          {notif.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 max-w-2xl line-clamp-1">
                        {notif.messageContent}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                        <span>Recipient: {notif.patientName} ({notif.channel === 'whatsapp' ? notif.patientPhone : notif.patientEmail})</span>
                        <span>• Sent: {notif.sentAt}</span>
                        {notif.responseReceived && (
                          <span className="text-emerald-600 font-medium">• Patient Replied: &ldquo;{notif.responseReceived}&rdquo;</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedNotificationForPreview(notif)}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    View Message Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Add Doctor Form */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Add New Doctor to Agra Hospital
              </h3>
              <button onClick={() => setIsAddDoctorOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Doctor Full Name (with Dr. prefix)</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Rohan Mehta"
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    placeholder="Pediatric / Endodontics / Periodontics..."
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Qualification</label>
                  <input
                    type="text"
                    required
                    value={newDocQualification}
                    onChange={(e) => setNewDocQualification(e.target.value)}
                    placeholder="BDS, MDS (Oral Pathology)"
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="1"
                    value={newDocExperience}
                    onChange={(e) => setNewDocExperience(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Fee (INR ₹)</label>
                  <input
                    type="number"
                    value={newDocFeeINR}
                    onChange={(e) => setNewDocFeeINR(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Fee (USD $)</label>
                  <input
                    type="number"
                    value={newDocFeeUSD}
                    onChange={(e) => setNewDocFeeUSD(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Clinic Suite / Room</label>
                <input
                  type="text"
                  value={newDocRoom}
                  onChange={(e) => setNewDocRoom(e.target.value)}
                  placeholder="Lotus Suite 103"
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Doctor Bio & Credentials</label>
                <textarea
                  rows={2}
                  value={newDocBio}
                  onChange={(e) => setNewDocBio(e.target.value)}
                  placeholder="Summary of experience, training, and smile philosophy..."
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-stone-600 hover:bg-stone-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  Add Doctor to System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Walk-In Intake for Receptionists (Nothing Left Out!) */}
      {isWalkinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Quick Walk-In Patient Intake (OPD)
                </h3>
                <p className="text-[11px] text-stone-500">
                  For local Agra patients walking into the clinic without app booking.
                </p>
              </div>
              <button onClick={() => setIsWalkinModalOpen(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number (For WhatsApp Updates)</label>
                <input
                  type="tel"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+91 94122 XXXXX"
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Presenting Problem / Complaint</label>
                <select
                  value={walkinProblem}
                  onChange={(e) => setWalkinProblem(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl bg-white"
                >
                  <option value="Acute Tooth Pain & Swelling">Acute Tooth Pain & Swelling</option>
                  <option value="Scaling & Pearl Polish">Scaling & Pearl Polish</option>
                  <option value="Broken Crown / Filling">Broken Crown / Filling</option>
                  <option value="Wisdom Tooth Impaction">Wisdom Tooth Impaction</option>
                  <option value="General Checkup">General Consultation & X-Ray</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Assign Doctor on Duty</label>
                <select
                  value={walkinDoctorId}
                  onChange={(e) => setWalkinDoctorId(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl bg-white"
                >
                  {doctors.filter(d => d.active).map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} • {d.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Clinical Intake Notes</label>
                <textarea
                  rows={2}
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWalkinModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl text-stone-600 hover:bg-stone-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  Queue Patient In-Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Reschedule Drawer */}
      {rescheduleModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
              Reschedule Appointment #{rescheduleModalData.appointmentNumber}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Current slot: {rescheduleModalData.currentSlot}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  min="2026-11-04"
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl bg-white"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setRescheduleModalData(null)}
                  className="px-3 py-1.5 bg-stone-100 rounded-xl text-stone-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="px-4 py-1.5 bg-amber-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Full Patient EHR Drawer */}
      {selectedPatientForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white h-full max-w-lg w-full p-6 shadow-2xl border-l border-stone-200 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPatientForDrawer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={selectedPatientForDrawer.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">{selectedPatientForDrawer.fullName}</h3>
                    <p className="text-xs text-stone-500">
                      ID: {selectedPatientForDrawer.id} • Registered {selectedPatientForDrawer.createdAt}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedPatientForDrawer(null)} className="text-stone-400 hover:text-stone-800 p-2">✕</button>
              </div>

              {/* EHR Content */}
              <div className="space-y-4 text-xs">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-semibold text-stone-700 block uppercase tracking-wider text-[10px]">Demographic & Travel Profile</span>
                  <p><strong>Origin:</strong> {selectedPatientForDrawer.city || 'Agra'}, {selectedPatientForDrawer.country}</p>
                  <p><strong>Contact:</strong> {selectedPatientForDrawer.phone} • {selectedPatientForDrawer.email}</p>
                  {selectedPatientForDrawer.passportNumber && (
                    <p><strong>Passport ID:</strong> {selectedPatientForDrawer.passportNumber}</p>
                  )}
                  <p><strong>Medical Sensitivity:</strong> {selectedPatientForDrawer.medicalAlerts?.join(', ') || 'None'}</p>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">Patient&apos;s Appointment History</h4>
                  <div className="space-y-2">
                    {appointments.filter(a => a.patientName === selectedPatientForDrawer.fullName).map(apt => (
                      <div key={apt.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex items-center justify-between font-semibold">
                          <span>{apt.problemCategory}</span>
                          <span className="text-amber-800 font-mono">#{apt.appointmentNumber}</span>
                        </div>
                        <p className="text-stone-500 mt-1">{apt.date} at {apt.timeSlot} with {apt.doctorName}</p>
                        <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">Communications Audit Log</h4>
                  <div className="space-y-2">
                    {notifications.filter(n => n.patientName === selectedPatientForDrawer.fullName).map(notif => (
                      <div key={notif.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-800">
                          <span>{notif.channel.toUpperCase()}: {notif.trigger}</span>
                          <span className="text-stone-400">{notif.sentAt}</span>
                        </div>
                        <p className="text-stone-600 mt-1 line-clamp-2">{notif.messageContent}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedPatientForDrawer(null)}
                className="w-full bg-stone-900 text-white py-2.5 rounded-xl font-semibold text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Notification Message Preview */}
      {selectedNotificationForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${selectedNotificationForPreview.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedNotificationForPreview.channel === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </span>
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  {selectedNotificationForPreview.channel.toUpperCase()} Dispatch Preview
                </h3>
              </div>
              <button onClick={() => setSelectedNotificationForPreview(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <p><strong>To:</strong> {selectedNotificationForPreview.patientName}</p>
                <p><strong>Subject:</strong> {selectedNotificationForPreview.subject}</p>
                <p><strong>Sent At:</strong> {selectedNotificationForPreview.sentAt}</p>
              </div>

              <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl whitespace-pre-line font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto">
                {selectedNotificationForPreview.messageContent}
              </div>

              <button
                onClick={() => setSelectedNotificationForPreview(null)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
