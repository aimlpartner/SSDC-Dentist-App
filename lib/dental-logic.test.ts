import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateDentalTourismSavings, 
  isDoctorSlotAvailable, 
  generateAppointmentNumber, 
  generateNotificationMessage, 
  computeClinicStats,
  DENTAL_PROCEDURES 
} from './dental-logic';
import { Appointment, Doctor } from './types';

test('Dental procedures catalogue has valid Agra Taj treatments', () => {
  assert.ok(DENTAL_PROCEDURES.length >= 5);
  const whitening = DENTAL_PROCEDURES.find(p => p.id === 'proc-whitening');
  assert.ok(whitening);
  assert.equal(whitening?.tajSightseeingFriendly, true);
  assert.ok(whitening?.priceUSD && whitening.priceUSD > 0);
});

test('calculateDentalTourismSavings calculates significant savings for international patients', () => {
  const savings = calculateDentalTourismSavings('proc-implants', 2, 'UK');
  assert.ok(savings.savingsUSD > 0);
  assert.ok(savings.savingsPercentage >= 50);
  assert.equal(savings.clinicTotalUSD, 520 * 2);
  assert.equal(savings.homeMarketTotalUSD, 2500 * 2);
});

test('isDoctorSlotAvailable accurately detects slot conflicts', () => {
  const mockAppointments: Appointment[] = [
    {
      id: 'apt-1',
      appointmentNumber: 'TWP-1001',
      patientId: 'p-1',
      patientName: 'Emma Watson',
      patientEmail: 'emma@example.com',
      patientPhone: '+44 7911 123456',
      patientType: 'international',
      country: 'United Kingdom',
      doctorId: 'doc-aarav',
      doctorName: 'Dr. Aarav Sharma',
      date: '2026-11-10',
      timeSlot: '10:00 AM',
      problemCategory: 'Dental Implants',
      problemDescription: 'Consultation for lower molar implant',
      status: 'confirmed',
      bookingSource: 'website',
      createdAt: '2026-11-01',
    },
    {
      id: 'apt-2',
      appointmentNumber: 'TWP-1002',
      patientId: 'p-2',
      patientName: 'Rahul Verma',
      patientEmail: 'rahul@example.com',
      patientPhone: '+91 98765 43210',
      patientType: 'local',
      country: 'India',
      doctorId: 'doc-aarav',
      doctorName: 'Dr. Aarav Sharma',
      date: '2026-11-10',
      timeSlot: '11:00 AM',
      problemCategory: 'Routine Clean',
      problemDescription: 'Scaling and polish',
      status: 'cancelled', // Cancelled appointment does not block the slot
      bookingSource: 'reception_walkin',
      createdAt: '2026-11-01',
    }
  ];

  // Occupied slot for Dr. Aarav
  assert.equal(
    isDoctorSlotAvailable(mockAppointments, 'doc-aarav', '2026-11-10', '10:00 AM'),
    false
  );

  // Different slot is available
  assert.equal(
    isDoctorSlotAvailable(mockAppointments, 'doc-aarav', '2026-11-10', '02:00 PM'),
    true
  );

  // Different doctor in the same slot is available
  assert.equal(
    isDoctorSlotAvailable(mockAppointments, 'doc-ananya', '2026-11-10', '10:00 AM'),
    true
  );

  // Cancelled slot should be free
  assert.equal(
    isDoctorSlotAvailable(mockAppointments, 'doc-aarav', '2026-11-10', '11:00 AM'),
    true
  );
});

test('generateAppointmentNumber formats with TWP prefix', () => {
  const code = generateAppointmentNumber();
  assert.ok(code.startsWith('TWP-'));
  assert.equal(code.length, 8);
});

test('generateNotificationMessage crafts both WhatsApp and Email messages', () => {
  const sample = {
    appointmentNumber: 'TWP-4040',
    patientName: 'Lucas Miller',
    doctorName: 'Dr. Ananya Verma',
    date: '2026-11-12',
    timeSlot: '03:30 PM',
    isInternational: true,
    problemCategory: 'Porcelain Smile Veneers',
  };

  const whatsappConfirmation = generateNotificationMessage('booking_confirmation', sample, 'whatsapp');
  assert.ok(whatsappConfirmation.body.includes('Taj White Pearl'));
  assert.ok(whatsappConfirmation.body.includes('TWP-4040'));
  assert.ok(whatsappConfirmation.body.includes('Dental Tourism Support'));

  const emailRating = generateNotificationMessage('post_treatment_rating', sample, 'email');
  assert.ok(emailRating.subject.includes('Review Your Experience'));
  assert.ok(emailRating.body.includes('Dr. Ananya Verma'));
});

test('computeClinicStats generates correct aggregations', () => {
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      appointmentNumber: 'TWP-1',
      patientId: 'p1',
      patientName: 'A',
      patientEmail: 'a@a.com',
      patientPhone: '1',
      patientType: 'international',
      country: 'USA',
      doctorId: 'd1',
      doctorName: 'Doc 1',
      date: '2026-11-10',
      timeSlot: '10:00 AM',
      problemCategory: 'Implants',
      problemDescription: 'test',
      status: 'completed',
      bookingSource: 'website',
      estimatedCostINR: 50000,
      rating: 5,
      createdAt: '2026-11-01',
    },
    {
      id: '2',
      appointmentNumber: 'TWP-2',
      patientId: 'p2',
      patientName: 'B',
      patientEmail: 'b@b.com',
      patientPhone: '2',
      patientType: 'local',
      country: 'India',
      doctorId: 'd2',
      doctorName: 'Doc 2',
      date: '2026-11-10',
      timeSlot: '11:00 AM',
      problemCategory: 'Clean',
      problemDescription: 'test',
      status: 'confirmed',
      bookingSource: 'reception_walkin',
      estimatedCostINR: 5000,
      createdAt: '2026-11-01',
    }
  ];

  const mockDoctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr. Aarav',
      title: 'Senior Surgeon',
      qualification: 'MDS',
      specialty: 'Implants',
      experienceYears: 15,
      bio: 'Bio',
      avatarUrl: '',
      consultationFeeINR: 1000,
      consultationFeeUSD: 25,
      rating: 5,
      reviewCount: 120,
      availableDays: ['Mon', 'Tue'],
      availableHours: '9am - 5pm',
      roomNumber: 'Suite 101',
      active: true,
    },
    {
      id: 'd2',
      name: 'Dr. Ananya',
      title: 'Aesthetic Specialist',
      qualification: 'MDS',
      specialty: 'Smile Design',
      experienceYears: 12,
      bio: 'Bio',
      avatarUrl: '',
      consultationFeeINR: 1000,
      consultationFeeUSD: 25,
      rating: 4.9,
      reviewCount: 95,
      availableDays: ['Mon', 'Wed'],
      availableHours: '10am - 6pm',
      roomNumber: 'Suite 102',
      active: false,
    }
  ];

  const stats = computeClinicStats(mockAppointments, mockDoctors);
  assert.equal(stats.totalBookings, 2);
  assert.equal(stats.internationalPatients, 1);
  assert.equal(stats.localPatients, 1);
  assert.equal(stats.completedTreatments, 1);
  assert.equal(stats.activeAppointments, 1);
  assert.equal(stats.totalEstimatedRevenueINR, 55000);
  assert.equal(stats.totalDoctorsCount, 2);
  assert.equal(stats.activeDoctorsCount, 1);
});
