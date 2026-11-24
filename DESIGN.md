# SSDC Agra — UX/UI Design System & Clinical OS Architecture (`DESIGN.md`)

## 1. UX Research & Problem Diagnosis

### Why Traditional Medical / Dental Software Fails Clinicians & Patients
1. **Card-Slop & Box-itis**: Wrapping every metric, patient row, and note in `rounded-3xl` cards with drop shadows on a beige/off-white background wastes up to 35% of viewport area and forces constant vertical scrolling.
2. **Modal Context Switching**: Popping modals over stacked cards for routine chairside tasks (writing clinical notes, issuing prescriptions, or inspecting a patient's medical alerts) breaks clinical focus.
3. **Puffy Consumer Badges in Clinical Contexts**: Rounded pill badges (`rounded-full`) and decorative emojis reduce visual authority and slow down rapid tabular scanning in high-volume OPD environments.

### The Solution: *Agra Marble & Pietra Dura Clinical OS*
Inspired by the structural geometry of Mughal marble inlay (*Pietra Dura*) and modern high-density operating systems (**Linear, Stripe Dashboard, Bloomberg Terminal**):
- **Pure Marble Canvas (`#FFFFFF`)**: High-contrast, clinical-grade white background across every view.
- **Exposed `1px` Structural Hairlines (`#E7E5E4`)**: Instead of floating cards, workspaces are partitioned by continuous `1px solid` horizontal and vertical hairlines (`divide-x`, `divide-y`, `border-stone-200`).
- **Master-Detail Split Workstations**: Receptionists and clinicians work in persistent two-pane layouts where selecting a patient in the left ledger immediately populates their clinical dossier, allergy locks, and Rx builder on the right without losing queue context.
- **Strict SVG Iconography**: Crisp `1.5px` stroke Lucide SVG icons only. Zero emojis, zero `<Sparkles>`, zero rounded pills.

---

## 2. Design Tokens

### 2.1 Color Palette
| Token | Hex | Tailwind / Usage |
| :--- | :--- | :--- |
| **Primary Canvas** | `#FFFFFF` | `bg-white` — Base surface for all portals, tables, and dossiers |
| **Secondary Surface** | `#FAFAFA` | `bg-[#FAFAFA]` — Subtle row hover, inactive tab bar, telemetry header |
| **Hairline Divider** | `#E7E5E4` | `border-stone-200` — Exposed `1px` architectural grid lines |
| **Primary Brand / Active** | `#7B1123` | `bg-[#7B1123]` / `text-[#7B1123]` — Royal Agra Maroon primary CTAs & active indicators |
| **Primary Hover** | `#580B18` | `hover:bg-[#580B18]` — Deep Crimson active state |
| **Heritage / Telemetry Accent** | `#D4AF37` | `border-[#D4AF37]` / `text-[#D4AF37]` — Burnished Gold precision accents |
| **Deep Gold Ink** | `#8F6B12` | `text-[#8F6B12]` — Accessible high-contrast gold label text on light surfaces |
| **Primary Ink** | `#171412` | `text-stone-950` — Headings, patient names, primary clinical data |
| **Secondary Ink** | `#57534E` | `text-stone-600` — Procedures, qualifications, secondary descriptions |
| **Muted Telemetry Ink** | `#78716C` | `text-stone-500` — Column headers, timestamps, field labels |

### 2.2 Semantic Clinical Pipeline Tags (Sharp Rectangular `1px` Tags)
All status indicators use `px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border`:
- **`CONFIRMED`**: `bg-blue-50/80 text-blue-900 border-blue-200`
- **`ARRIVED`**: `bg-amber-50/80 text-[#8F6B12] border-[#D4AF37]/50`
- **`IN_CHAIR`**: `bg-[#7B1123]/10 text-[#7B1123] border-[#7B1123]/40` (with square `w-1.5 h-1.5 bg-[#7B1123]` indicator)
- **`COMPLETED`**: `bg-emerald-50/80 text-emerald-900 border-emerald-200`
- **`RESCHEDULED`**: `bg-orange-50/80 text-orange-900 border-orange-200`
- **`CANCELLED`**: `bg-red-50/80 text-red-900 border-red-200`

### 2.3 Typography & Numeric Discipline
- **Display & Workspace Headers (`font-funky` / `Urbanist`)**: `font-extrabold tracking-tight` (`-0.03em`) for portal headers, KPI counters, and section titles.
- **Clinical UI & Body (`font-sans` / `Plus Jakarta Sans`)**: Clean, high-x-height legibility for clinical notes, prescriptions, and patient tables.
- **Telemetry & Reference Codes (`font-mono tabular-nums`)**: Mandatory for Appointment IDs (`#TWP-1042`), slot times (`11:30 AM`), passport numbers (`UK-882194`), and multi-currency fees.

---

## 3. Screen-by-Screen Information Architecture

### 3.1 Hospital Command Center & Live OPD Queue (`AdminDashboard.tsx`)
- **Top Command Header**: Live operatory telemetry (`OPD ACTIVE • SUITES ONLINE`), global search input, `+ Add Specialist` button, and primary Maroon `+ Log Walk-In OPD Intake` CTA.
- **6-Cell Architectural Telemetry Strip**: Flush `1px` hairline grid displaying `Total Bookings`, `Active Queue`, `Foreign Tourists`, `Local Agra OPD`, `Specialist Roster`, and `Clinical NPS Rating`.
- **Hairline Sub-Navigation Bar**: `[01] Live Bookings & OPD Ledger`, `[02] Patient EHR Directory`, `[03] Specialist Roster`, `[04] Automated WhatsApp & Email Dispatch`.
- **Master-Detail Split Workspace**:
  - **Left 8 Columns**: High-density OPD & Bookings Table with inline status selector, reschedule trigger, and row selection.
  - **Right 4 Columns**: Persistent **Patient Clinical Dossier** panel displaying the selected patient's passport/origin, medical alerts, hotel shuttle status, appointment history, and automated notification logs.

### 3.2 Clinician Chairside Split-Pane Workstation (`DoctorPortal.tsx`)
- **Top Workstation Bar**: Active clinician profile, room number, clinician roster switcher, and 4-cell daily pipeline counter (`Appointed`, `Confirmed`, `In Chair`, `Completed`).
- **Master-Detail Split Workspace**:
  - **Left 4 Columns (`Today's Operatory Pipeline`)**: Filterable queue (`All`, `In Chair`, `Upcoming`, `Completed`). Clicking any appointment selects it into the active chairside chart with a `3px` left Maroon bar.
  - **Right 8 Columns (`Active Patient Clinical Chart & Rx Builder`)**:
    - Patient dossier header + 3-step Chair Status Progression Pipeline (`Arrived` -> `In Chair` -> `Completed`).
    - 3-Cell Clinical Telemetry Strip (`Presenting Procedure`, `Medical Sensitivity & Allergy Protocol`, `Agra Concierge & Hotel Context`).
    - **Chairside Clinical Findings Editor** with one-click clinical template chips (`+ Veneer Prep Protocol`, `+ 3D CBCT Implant Osteotomy`, `+ Laser Root Canal Debridement`) and FDI Tooth Verification matrix.
    - **Structured Prescription (Rx) Builder** with one-click medication presets and `"Commit to Patient EHR & Dispatch Rx"` primary CTA.

### 3.3 International Guest Dossier & Digital Dental Passport (`ForeignClientPortal.tsx`)
- **Top Dossier Bar**: Guest identity, passport verification tag, guest profile switcher, and direct `Call Priya Voice AI` / `WhatsApp Desk` buttons.
- **4-Cell Travel & Clinical Telemetry Strip**: `Active Reservation (#TWP-1042)`, `Clinical Sanctuary Suite`, `Sanctuary Lodging (Oberoi Amarvilas)`, and `Corridor Transfers (IGI Delhi <-> Agra)`.
- **Split-Pane Workspace**:
  - **Left 7 Columns**: Active Specialist Dossier, Prosthetic & Sterile Readiness Checklist, inline Slot Rescheduler, and the **Guest Clinical Audit & 5-Star Governance Ledger**.
  - **Right 5 Columns**: **Zero-Downtime Sanctuary Protocol & Taj Sightseeing Timeline** (`06:15 AM Sunrise Taj Window` -> `11:30 AM Clinical Session` -> `07:30 PM Soft-Diet Culinary Protocol`) + **International Digital Dental Passport & Lifetime Warranty Deed** framed in Burnished Gold (`#D4AF37`).

