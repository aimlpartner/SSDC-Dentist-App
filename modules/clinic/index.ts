/**
 * @module @ssdc/clinic
 * @description
 * Pillar 2 — Core Dental Clinic Operations (CRM, EHR, Portals, Booking & Domain Logic).
 */

export * from './domain/types';
export * from './domain/dental-logic';
export * from './domain/mock-data';
export * from './config/taj-clinic-ai.config';

export { default as AdminDashboard } from './components/AdminDashboard';
export { default as DoctorPortal } from './components/DoctorPortal';
export { default as ForeignClientPortal } from './components/ForeignClientPortal';
export { default as BookingModal } from './components/BookingModal';

