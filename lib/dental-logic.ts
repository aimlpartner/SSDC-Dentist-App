import { Appointment, Doctor, NotificationLog, NotificationTrigger, PatientType } from './types';

// Dental procedure catalog with local and international tourism pricing
export interface DentalProcedure {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceINR: number;
  priceUSD: number;
  ukPriceCompareUSD: number; // For dental tourism comparison savings
  usPriceCompareUSD: number;
  healingDaysNeeded: number;
  tajSightseeingFriendly: boolean; // Can patient comfortably visit Taj Mahal during/after?
  description: string;
}

export const DENTAL_PROCEDURES: DentalProcedure[] = [
  {
    id: 'proc-whitening',
    name: 'Taj Pearl Laser Whitening',
    category: 'Cosmetic',
    durationMinutes: 45,
    priceINR: 12000,
    priceUSD: 145,
    ukPriceCompareUSD: 650,
    usPriceCompareUSD: 800,
    healingDaysNeeded: 0,
    tajSightseeingFriendly: true,
    description: 'Instant 6-8 shade brightening using gentle cold-light laser. Zero downtime.',
  },
  {
    id: 'proc-veneers',
    name: 'Porcelain Smile Veneers (Per Tooth)',
    category: 'Cosmetic',
    durationMinutes: 90,
    priceINR: 18000,
    priceUSD: 220,
    ukPriceCompareUSD: 950,
    usPriceCompareUSD: 1400,
    healingDaysNeeded: 2,
    tajSightseeingFriendly: true,
    description: 'Ultra-thin E-max porcelain handcrafted by master ceramists for flawless Hollywood / Taj radiance.',
  },
  {
    id: 'proc-implants',
    name: 'German Zirconia / Titanium Implants',
    category: 'Surgical & Restorative',
    durationMinutes: 60,
    priceINR: 42000,
    priceUSD: 520,
    ukPriceCompareUSD: 2500,
    usPriceCompareUSD: 3500,
    healingDaysNeeded: 3,
    tajSightseeingFriendly: true,
    description: 'Lifetime warranted dental implant placement with 3D CBCT computer-guided precision.',
  },
  {
    id: 'proc-root-canal',
    name: 'Microscopic Painless Root Canal',
    category: 'Endodontics',
    durationMinutes: 60,
    priceINR: 8500,
    priceUSD: 110,
    ukPriceCompareUSD: 600,
    usPriceCompareUSD: 950,
    healingDaysNeeded: 1,
    tajSightseeingFriendly: true,
    description: 'Single-sitting laser-assisted root canal preserving natural tooth structure.',
  },
  {
    id: 'proc-aligners',
    name: 'Taj Clear Invisible Aligners',
    category: 'Orthodontics',
    durationMinutes: 45,
    priceINR: 65000,
    priceUSD: 790,
    ukPriceCompareUSD: 3200,
    usPriceCompareUSD: 4500,
    healingDaysNeeded: 0,
    tajSightseeingFriendly: true,
    description: 'Digital 3D mapped orthodontic aligners for discreet, comfortable smile alignment.',
  },
  {
    id: 'proc-hygiene',
    name: 'Ultrasonic Scaling & Pearl Polish',
    category: 'Preventative',
    durationMinutes: 30,
    priceINR: 2500,
    priceUSD: 35,
    ukPriceCompareUSD: 180,
    usPriceCompareUSD: 220,
    healingDaysNeeded: 0,
    tajSightseeingFriendly: true,
    description: 'Deep stain removal, plaque debridement, and enamel remineralization.',
  },
];

/**
 * Calculates estimated savings for international dental tourists visiting Agra
 */
export function calculateDentalTourismSavings(
  procedureId: string, 
  quantity: number = 1, 
  compareMarket: 'UK' | 'US' = 'UK'
): {
  clinicTotalUSD: number;
  homeMarketTotalUSD: number;
  savingsUSD: number;
  savingsPercentage: number;
} {
  const proc = DENTAL_PROCEDURES.find(p => p.id === procedureId) || DENTAL_PROCEDURES[0];
  const clinicTotalUSD = proc.priceUSD * quantity;
  const compareRate = compareMarket === 'UK' ? proc.ukPriceCompareUSD : proc.usPriceCompareUSD;
  const homeMarketTotalUSD = compareRate * quantity;
  const savingsUSD = Math.max(0, homeMarketTotalUSD - clinicTotalUSD);
  const savingsPercentage = homeMarketTotalUSD > 0 
    ? Math.round((savingsUSD / homeMarketTotalUSD) * 100) 
    : 0;

  return {
    clinicTotalUSD,
    homeMarketTotalUSD,
    savingsUSD,
    savingsPercentage,
  };
}

/**
 * Check if a doctor has an overlapping appointment at the requested date and time
 */
export function isDoctorSlotAvailable(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  timeSlot: string,
  excludeAppointmentId?: string
): boolean {
  return !appointments.some(apt => {
    if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
    if (apt.status === 'cancelled') return false;
    return apt.doctorId === doctorId && apt.date === date && apt.timeSlot === timeSlot;
  });
}

/**
 * Generate a unique Taj White Pearl appointment code (e.g., #TWP-8291)
 */
export function generateAppointmentNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TWP-${randomNum}`;
}

/**
 * Generates automated notification messages for both Email and WhatsApp
 */
export function generateNotificationMessage(
  trigger: NotificationTrigger,
  appointment: {
    appointmentNumber: string;
    patientName: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    isInternational: boolean;
    problemCategory: string;
  },
  channel: 'email' | 'whatsapp'
): { subject: string; body: string } {
  const { appointmentNumber, patientName, doctorName, date, timeSlot, isInternational, problemCategory } = appointment;

  if (channel === 'whatsapp') {
    switch (trigger) {
      case 'booking_confirmation':
        return {
          subject: `WhatsApp: Booking Confirmed [${appointmentNumber}]`,
          body: `🏛️ *Taj White Pearl Dental Hospital, Agra*\n\nNamaste ${patientName},\nYour appointment *#${appointmentNumber}* has been confirmed!\n\n👨‍⚕️ *Doctor:* ${doctorName}\n📅 *Date:* ${date}\n⏰ *Time:* ${timeSlot}\n🦷 *Treatment:* ${problemCategory}\n📍 *Location:* Opposite Taj East Gate Rd, Agra\n\n${isInternational ? '✈️ *Dental Tourism Support:* Our concierge is ready with hotel guidance near the Taj Mahal and airport shuttle assistance.\n\n' : ''}Need to reschedule? Reply *RESCHEDULE* or call our 24/7 AI Concierge at +91-562-TAJ-DENT.`,
        };
      case 'reminder_24h':
        return {
          subject: `WhatsApp: 24h Reminder [${appointmentNumber}]`,
          body: `⏳ *Appointment Tomorrow at Taj White Pearl*\n\nHello ${patientName}, this is a gentle reminder for your dental visit tomorrow:\n📅 ${date} at ${timeSlot}\n👨‍⚕️ ${doctorName}\n\nPlease arrive 10 minutes early. We look forward to perfecting your smile in Agra!`,
        };
      case 'reminder_2h':
        return {
          subject: `WhatsApp: 2h Alert [${appointmentNumber}]`,
          body: `🚨 *See you in 2 hours!*\n\n${patientName}, Dr. ${doctorName}'s clinic suite is prepared for you at ${timeSlot}. Valet parking and chilled mint refreshments await at our Taj View Lounge.`,
        };
      case 'post_treatment_rating':
        return {
          subject: `WhatsApp: How is your Taj Smile? [${appointmentNumber}]`,
          body: `✨ *How is your new Taj White smile, ${patientName}?*\n\nWe hope your session with ${doctorName} was soothing and completely comfortable.\n\nPlease rate your experience (1-5 stars) and let us know if you need any follow-up guidance or soft-diet recommendations while in Agra!`,
        };
      case 'recall_checkup':
        return {
          subject: `WhatsApp: 6-Month Taj Hygiene Recall`,
          body: `💎 *Keep Your Taj Pearl Radiance Shining!*\n\nHello ${patientName}, it has been 6 months since your last smile evaluation. Regular maintenance keeps your teeth as pristine as the Taj Mahal marble. Book your checkup today!`,
        };
    }
  }

  // Email format
  switch (trigger) {
    case 'booking_confirmation':
      return {
        subject: `Your Taj White Pearl Appointment is Confirmed (#${appointmentNumber})`,
        body: `Dear ${patientName},\n\nWe are delighted to welcome you to Taj White Pearl Dental Hospital & Luxury Spa in Agra, India.\n\nAPPOINTMENT DETAILS:\n- Reference ID: #${appointmentNumber}\n- Assigned Specialist: ${doctorName}\n- Date & Slot: ${date} at ${timeSlot}\n- Procedure: ${problemCategory}\n- Address: 14 Fatehabad Road, Near Taj East Gate, Agra, UP, India\n\n${isInternational ? 'INTERNATIONAL GUEST CONCIERGE:\nAs our international dental tourist, our travel team has noted your visit. We provide luxury hotel booking coordination near the Taj Mahal, sanitized private chauffeur pickups, and currency exchange guidance.\n\n' : ''}If you need to adjust or reschedule your timing, our automated calling agent and patient care portal are available 24/7.\n\nWarm regards,\nTaj White Pearl Patient Experience Team`,
      };
    case 'reminder_24h':
      return {
        subject: `Reminder: Your Dental Consultation Tomorrow at Taj White Pearl (#${appointmentNumber})`,
        body: `Dear ${patientName},\n\nThis is a friendly reminder of your upcoming consultation with ${doctorName} tomorrow, ${date} at ${timeSlot}.\n\nPlease let us know if your arrival schedule has changed. We look forward to seeing you!`,
      };
    case 'reminder_2h':
      return {
        subject: `Your Appointment is in 2 Hours - Taj White Pearl Agra`,
        body: `Dear ${patientName},\n\nYour treatment suite with ${doctorName} will be ready at ${timeSlot}. Free secure parking and our Taj View reception lounge are ready for your arrival.`,
      };
    case 'post_treatment_rating':
      return {
        subject: `Review Your Experience with ${doctorName} at Taj White Pearl`,
        body: `Dear ${patientName},\n\nThank you for choosing Taj White Pearl Dental Hospital for your oral health and smile transformation with ${doctorName}.\n\nCould you please take 30 seconds to rate your visit with ${doctorName}? Your feedback helps us maintain our world-class standard for patients from Agra and around the world.\n\nClick to rate: 5 Stars / 4 Stars / 3 Stars / 2 Stars / 1 Star\n\nWishing you lasting radiant confidence!`,
      };
    case 'recall_checkup':
      return {
        subject: `Time for Your Biannual Taj Pearl Dental Polish & Hygiene Check`,
        body: `Dear ${patientName},\n\nHealthy teeth require routine care. It has been 6 months since your last preventive visit with us in Agra. Protect your investment and book your routine polish and checkup today!`,
      };
  }
}

/**
 * Filter and compute high-level statistics for the clinic dashboard
 */
export function computeClinicStats(appointments: Appointment[], doctors: Doctor[]) {
  const total = appointments.length;
  const international = appointments.filter(a => a.patientType === 'international').length;
  const local = total - international;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const activeToday = appointments.filter(a => a.status === 'confirmed' || a.status === 'arrived' || a.status === 'in_chair').length;
  
  // Calculate estimated total revenue
  const totalEstimatedINR = appointments.reduce((sum, a) => {
    return sum + (a.estimatedCostINR || 15000);
  }, 0);

  const ratedAppointments = appointments.filter(a => a.rating && a.rating > 0);
  const averageRating = ratedAppointments.length > 0
    ? (ratedAppointments.reduce((sum, a) => sum + (a.rating || 5), 0) / ratedAppointments.length).toFixed(1)
    : '4.9';

  return {
    totalBookings: total,
    internationalPatients: international,
    localPatients: local,
    completedTreatments: completed,
    activeAppointments: activeToday,
    totalEstimatedRevenueINR: totalEstimatedINR,
    averageRating,
    totalDoctorsCount: doctors.length,
    activeDoctorsCount: doctors.filter(d => d.active).length,
  };
}
