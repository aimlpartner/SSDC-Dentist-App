# SSDC Dentist App & Medical AI Suite — Mandatory Project Protocols (`AGENTS.md`)

> **CRITICAL DIRECTIVE — NEVER FORGET THIS ARCHITECTURE**
> Every developer and AI agent working on this repository MUST strictly adhere to the **3-Pillar Modular Architecture** defined below. Do not blur the boundaries between these three pillars in any future feature, refactor, or bugfix.

---

##🏛️ The 3-Pillar Architecture

This project is structured into **three strictly decoupled modules** under `modules/`:

### Pillar 1: Public Landing & Marketing (`modules/landing/`)
- **Scope**: Public-facing website, brand storytelling, treatment showcase, dental tourism itinerary, interactive savings calculator, doctor showcase, testimonials, and footer.
- **Characteristics**: Lightweight, SEO/conversion-focused, presentation layer.
- **Rule**: Must only trigger modals or view navigation via clean callbacks; must never contain core EHR/CRM mutation logic or AI agent internals.

### Pillar 2: Core Dental Clinic Operations — CRM, EHR & Portals (`modules/clinic/`)
- **Scope**: The complete operational backbone of the dental hospital (`Taj White Pearl Dental Hospital, Agra`):
  - **Hospital Administration (`AdminDashboard`)**: Master bookings & walk-in OPD queue, Patient EHR Directory, Specialist Doctor Roster management, and Automated Notification Dispatcher (WhatsApp & Email logs).
  - **Clinician Workstation (`DoctorPortal`)**: Daily doctor schedule, chair status transitions (`confirmed` -> `arrived` -> `in_chair` -> `completed`), clinical diagnosis notes, and prescriptions (`Rx`).
  - **International Client Portal (`ForeignClientPortal`)**: Dental tourist itinerary, hotel/airport transfer tracking, slot rescheduling, digital dental passport, and post-treatment ratings.
  - **Booking Engine (`BookingModal` & `domain/dental-logic.ts`)**: Slot conflict detection, appointment code generation, pricing/savings calculation, and automated multi-channel notification generation.
- **Rule**: Consumes Pillar 3 (`modules/ai-agents`) as an external product/SDK by passing its clinic configuration (`taj-clinic-ai.config.ts`) and CRM state callbacks (`MedicalCRMAdapter`).

### Pillar 3: Reusable Medical AI Agents Product / SDK (`modules/ai-agents/`)
- **Scope**: The **two standalone, white-label AI Agents** designed as a plug-and-play product that ANY hospital, clinic, or medical CRM (Dental, Cardiology, Dermatology, Orthopedics, Multi-Specialty Hospital, etc.) can integrate into their existing system:
  1. **Agent 1 — AI Voice Calling Receptionist & Coordinator (`agents/voice-calling-agent/`)**:
     - Real-time speech-to-text & text-to-speech voice call experience + API engine (`/api/ai-agents/voice`).
     - Handles natural-language appointment booking, rescheduling, cancellations, emergency triage, and clinical/pricing FAQs.
  2. **Agent 2 — AI WhatsApp & Messaging Concierge (`agents/whatsapp-concierge-agent/`)**:
     - Interactive WhatsApp Business concierge chat experience + AI API engine (`/api/ai-agents/whatsapp`).
     - Handles conversational rescheduling, automated reminders, post-treatment star ratings & reviews, travel/shuttle coordination, and patient support.
- **STRICT PRODUCTIZATION PROTOCOLS FOR PILLAR 3**:
  1. **Zero Clinic Coupling**: Files inside `modules/ai-agents/` MUST NEVER import from `modules/landing/` or `modules/clinic/`.
  2. **100% Configuration-Driven (`MedicalFacilityConfig`)**: Hospital name, location, agent persona (name, tone, greeting), doctor roster, procedure catalog, pricing, and FAQs must be injected via `MedicalFacilityConfig`—never hardcoded to a single clinic.
  3. **CRM-Agnostic Adapter Pattern (`MedicalCRMAdapter`)**: All read/write actions (`onBookAppointment`, `onRescheduleAppointment`, `onCancelAppointment`, `onSubmitReview`) must flow through the standardized `MedicalCRMAdapter` interface or webhook payload so any external hospital CRM (Practo, Epic, custom Next.js/Node CRM, etc.) can plug it in with zero code changes to the AI Agent core.

---

## 📁 Directory Layout & Dependency Rules

```text
SSDC-Dentist-App/
├── AGENTS.md                        # Mandatory AI Agent & Developer Protocols (THIS FILE)
├── ARCHITECTURE.md                  # Detailed 3-Pillar Architecture & External CRM Integration Guide
├── app/                             # Next.js App Router (Application Shell & API Routes)
│   ├── api/
│   │   ├── calling-agent/route.ts   # Legacy/Default route delegating to Pillar 3 Voice Agent Engine
│   │   └── ai-agents/
│   │       ├── voice/route.ts       # Productized Voice AI Agent Endpoint (accepts any MedicalFacilityConfig)
│   │       └── whatsapp/route.ts    # Productized WhatsApp AI Agent Endpoint (accepts any MedicalFacilityConfig)
│   ├── layout.tsx
│   └── page.tsx
├── modules/
│   ├── landing/                     # PILLAR 1: Public Landing Page Module
│   ├── clinic/                      # PILLAR 2: Dental Clinic CRM, EHR & Portals Module
│   └── ai-agents/                   # PILLAR 3: Standalone Medical AI Agents Product / SDK
├── components/                      # Shared Shell UI (Navbar) & backwards-compatible re-exports
├── hooks/                           # Shared React hooks
└── lib/                             # Shared utilities & backwards-compatible barrel exports
```

### Dependency Flow Diagram
- `app/` -> orchestrates `modules/landing`, `modules/clinic`, and `modules/ai-agents`.
- `modules/clinic/` -> may import types/adapters from `modules/ai-agents/` to configure the agents for the dental clinic.
- `modules/landing/` -> presentation components; may use shared types/catalog.
- `modules/ai-agents/` -> **STANDALONE PRODUCT**. Must NEVER import from `modules/clinic/` or `modules/landing/`.

