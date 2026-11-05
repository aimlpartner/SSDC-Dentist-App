'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { AppView } from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DentalTourismSection from '../components/DentalTourismSection';
import ServicesSection from '../components/ServicesSection';
import DoctorsSection from '../components/DoctorsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import AdminDashboard from '../components/AdminDashboard';
import ForeignClientPortal from '../components/ForeignClientPortal';
import DoctorPortal from '../components/DoctorPortal';
import BookingModal from '../components/BookingModal';
import AICallingAgentModal from '../components/AICallingAgentModal';
import WhatsAppConciergeModal from '../components/WhatsAppConciergeModal';

import { 
  Appointment, 
  Doctor, 
  NotificationLog, 
  Patient, 
  AppointmentStatus, 
  NotificationTrigger 
} from '../lib/types';
import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_DOCTORS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PATIENTS 
} from '../lib/mock-data';
import { 
  computeClinicStats, 
  generateNotificationMessage 
} from '../lib/dental-logic';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR' | 'GBP' | 'EUR'>('USD');

  // Application State
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCallingAgentOpen, setIsCallingAgentOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Stats calculation
  const stats = computeClinicStats(appointments, doctors);

  // Handler: Book an Appointment (Website, Call Agent, or Walk-in)
  const handleBookAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);

    // Check if patient exists, if not, create new patient record
    const patientExists = patients.some(p => p.fullName.toLowerCase() === newApt.patientName.toLowerCase());
    if (!patientExists) {
      const newPatient: Patient = {
        id: newApt.patientId,
        fullName: newApt.patientName,
        email: newApt.patientEmail,
        phone: newApt.patientPhone,
        type: newApt.patientType,
        country: newApt.country,
        city: newApt.patientType === 'local' ? 'Agra' : undefined,
        createdAt: newApt.createdAt,
        totalVisits: 1,
      };
      setPatients((prev) => [newPatient, ...prev]);
    } else {
      setPatients((prev) => prev.map(p => 
        p.fullName.toLowerCase() === newApt.patientName.toLowerCase() 
          ? { ...p, totalVisits: p.totalVisits + 1 }
          : p
      ));
    }

    // Automatically generate and dispatch both an Email confirmation and a WhatsApp notification!
    const sample = {
      appointmentNumber: newApt.appointmentNumber,
      patientName: newApt.patientName,
      doctorName: newApt.doctorName,
      date: newApt.date,
      timeSlot: newApt.timeSlot,
      isInternational: newApt.patientType === 'international',
      problemCategory: newApt.problemCategory,
    };

    const emailMsg = generateNotificationMessage('booking_confirmation', sample, 'email');
    const waMsg = generateNotificationMessage('booking_confirmation', sample, 'whatsapp');

    const emailLog: NotificationLog = {
      id: `notif-email-${Date.now()}`,
      appointmentId: newApt.id,
      appointmentNumber: newApt.appointmentNumber,
      patientName: newApt.patientName,
      patientEmail: newApt.patientEmail,
      patientPhone: newApt.patientPhone,
      channel: 'email',
      trigger: 'booking_confirmation',
      subject: emailMsg.subject,
      messageContent: emailMsg.body,
      sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'delivered',
    };

    const waLog: NotificationLog = {
      id: `notif-wa-${Date.now()}`,
      appointmentId: newApt.id,
      appointmentNumber: newApt.appointmentNumber,
      patientName: newApt.patientName,
      patientEmail: newApt.patientEmail,
      patientPhone: newApt.patientPhone,
      channel: 'whatsapp',
      trigger: 'booking_confirmation',
      subject: waMsg.subject,
      messageContent: waMsg.body,
      sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'delivered',
    };

    setNotifications((prev) => [emailLog, waLog, ...prev]);
  };

  // Handler: Update Appointment Status
  const handleUpdateStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: newStatus };
      }
      return apt;
    }));

    // If marked completed, automatically send post-treatment rating request via WhatsApp & Email!
    if (newStatus === 'completed') {
      const apt = appointments.find(a => a.id === appointmentId);
      if (apt) {
        const sample = {
          appointmentNumber: apt.appointmentNumber,
          patientName: apt.patientName,
          doctorName: apt.doctorName,
          date: apt.date,
          timeSlot: apt.timeSlot,
          isInternational: apt.patientType === 'international',
          problemCategory: apt.problemCategory,
        };
        const waMsg = generateNotificationMessage('post_treatment_rating', sample, 'whatsapp');
        const notif: NotificationLog = {
          id: `notif-rate-${Date.now()}`,
          appointmentId: apt.id,
          appointmentNumber: apt.appointmentNumber,
          patientName: apt.patientName,
          patientEmail: apt.patientEmail,
          patientPhone: apt.patientPhone,
          channel: 'whatsapp',
          trigger: 'post_treatment_rating',
          subject: waMsg.subject,
          messageContent: waMsg.body,
          sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          status: 'delivered',
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    }
  };

  // Handler: Reschedule Appointment
  const handleRescheduleAppointment = (appointmentNumber: string, newDate: string, newTime: string): boolean => {
    const targetApt = appointments.find(a => a.appointmentNumber === appointmentNumber);
    if (!targetApt) return false;

    setAppointments((prev) => prev.map(apt => {
      if (apt.appointmentNumber === appointmentNumber) {
        return {
          ...apt,
          date: newDate,
          timeSlot: newTime,
          status: 'rescheduled' as AppointmentStatus,
        };
      }
      return apt;
    }));

    // Dispatch reschedule confirmation notification
    const rescheduleLog: NotificationLog = {
      id: `notif-resched-${Date.now()}`,
      appointmentId: targetApt.id,
      appointmentNumber: targetApt.appointmentNumber,
      patientName: targetApt.patientName,
      patientEmail: targetApt.patientEmail,
      patientPhone: targetApt.patientPhone,
      channel: 'whatsapp',
      trigger: 'booking_confirmation',
      subject: `Appointment Rescheduled: #${targetApt.appointmentNumber}`,
      messageContent: `📅 Your appointment at Taj White Pearl has been rescheduled to ${newDate} at ${newTime} with ${targetApt.doctorName}. We look forward to seeing you in Agra!`,
      sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'delivered',
    };

    setNotifications((prev) => [rescheduleLog, ...prev]);
    return true;
  };

  // Handler: Cancel Appointment
  const handleCancelAppointment = (appointmentNumber: string): boolean => {
    setAppointments((prev) => prev.map(apt => {
      if (apt.appointmentNumber === appointmentNumber) {
        return {
          ...apt,
          status: 'cancelled' as AppointmentStatus,
        };
      }
      return apt;
    }));
    return true;
  };

  // Handler: Add Doctor (from Admin Panel)
  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors((prev) => [...prev, newDoc]);
  };

  // Handler: Add Review / Rating (from Client Portal or WhatsApp)
  const handleAddReview = (appointmentNumber: string, rating: number, feedback: string) => {
    setAppointments((prev) => prev.map(apt => {
      if (apt.appointmentNumber === appointmentNumber) {
        return {
          ...apt,
          rating,
          reviewFeedback: feedback,
        };
      }
      return apt;
    }));

    // Update doctor's review count
    const targetApt = appointments.find(a => a.appointmentNumber === appointmentNumber);
    if (targetApt) {
      setDoctors((prev) => prev.map(doc => {
        if (doc.name === targetApt.doctorName || doc.id === targetApt.doctorId) {
          const newCount = doc.reviewCount + 1;
          const newRating = Number(((doc.rating * doc.reviewCount + rating) / newCount).toFixed(2));
          return { ...doc, reviewCount: newCount, rating: newRating };
        }
        return doc;
      }));
    }
  };

  // Handler: Doctor saves clinical notes & Rx
  const handleSaveClinicalNotes = (appointmentId: string, notes: string, prescriptions: string[]) => {
    setAppointments((prev) => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          clinicalNotes: notes,
          prescriptions,
        };
      }
      return apt;
    }));
  };

  // Handler: Manually trigger automated notification for demo / testing
  const handleTriggerNotification = (
    trigger: NotificationTrigger, 
    appointmentId: string, 
    channel: 'email' | 'whatsapp'
  ) => {
    const apt = appointments.find(a => a.id === appointmentId) || appointments[0];
    if (!apt) return;

    const sample = {
      appointmentNumber: apt.appointmentNumber,
      patientName: apt.patientName,
      doctorName: apt.doctorName,
      date: apt.date,
      timeSlot: apt.timeSlot,
      isInternational: apt.patientType === 'international',
      problemCategory: apt.problemCategory,
    };

    const msg = generateNotificationMessage(trigger, sample, channel);

    const newLog: NotificationLog = {
      id: `manual-notif-${Date.now()}`,
      appointmentId: apt.id,
      appointmentNumber: apt.appointmentNumber,
      patientName: apt.patientName,
      patientEmail: apt.patientEmail,
      patientPhone: apt.patientPhone,
      channel,
      trigger,
      subject: msg.subject,
      messageContent: msg.body,
      sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'delivered',
    };

    setNotifications((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      
      {/* Universal Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        stats={{
          totalBookings: stats.totalBookings,
          activeAppointments: stats.activeAppointments,
        }}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'landing' && (
          <>
            <HeroSection
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              selectedCurrency={selectedCurrency}
            />

            <DentalTourismSection
              onOpenBooking={() => setIsBookingOpen(true)}
              selectedCurrency={selectedCurrency}
            />

            <ServicesSection
              onOpenBooking={() => setIsBookingOpen(true)}
              selectedCurrency={selectedCurrency}
            />

            <DoctorsSection
              doctors={doctors}
              onOpenBooking={() => setIsBookingOpen(true)}
              selectedCurrency={selectedCurrency}
            />

            <TestimonialsSection />

            <Footer
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
          </>
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            notifications={notifications}
            onUpdateAppointmentStatus={handleUpdateStatus}
            onRescheduleAppointment={handleRescheduleAppointment}
            onAddDoctor={handleAddDoctor}
            onAddAppointment={handleBookAppointment}
            onTriggerNotification={handleTriggerNotification}
            selectedCurrency={selectedCurrency}
          />
        )}

        {currentView === 'foreign_client' && (
          <ForeignClientPortal
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            onAddReview={handleAddReview}
            onRescheduleAppointment={handleRescheduleAppointment}
            selectedCurrency={selectedCurrency}
          />
        )}

        {currentView === 'doctor_portal' && (
          <DoctorPortal
            doctors={doctors}
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            onSaveClinicalNotes={handleSaveClinicalNotes}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctors={doctors}
        appointments={appointments}
        onBookAppointment={handleBookAppointment}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
        selectedCurrency={selectedCurrency}
      />

      <AICallingAgentModal
        isOpen={isCallingAgentOpen}
        onClose={() => setIsCallingAgentOpen(false)}
        appointments={appointments}
        doctors={doctors}
        onBookAppointment={handleBookAppointment}
        onRescheduleAppointment={handleRescheduleAppointment}
        onCancelAppointment={handleCancelAppointment}
      />

      <WhatsAppConciergeModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        appointments={appointments}
        notifications={notifications}
        onRescheduleAppointment={handleRescheduleAppointment}
        onAddReview={handleAddReview}
        onOpenCallingAgent={() => setIsCallingAgentOpen(true)}
      />

    </div>
  );
}
