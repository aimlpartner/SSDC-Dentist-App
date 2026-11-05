'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Globe, 
  Stethoscope, 
  Calendar,
  MapPin,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Headphones,
  Check,
  Building2
} from 'lucide-react';

export type AppView = 
  | 'landing' 
  | 'admin' 
  | 'foreign_client' 
  | 'doctor_portal';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenBooking: () => void;
  onOpenCallingAgent: () => void;
  onOpenWhatsApp: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
  setSelectedCurrency: (currency: 'USD' | 'INR' | 'GBP' | 'EUR') => void;
  stats: {
    totalBookings: number;
    activeAppointments: number;
  };
}

export default function Navbar({
  currentView,
  setCurrentView,
  onOpenBooking,
  onOpenCallingAgent,
  onOpenWhatsApp,
  selectedCurrency,
  setSelectedCurrency,
  stats,
}: NavbarProps) {
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [conciergeDropdown, setConciergeDropdown] = useState(false);
  const [portalsDropdown, setPortalsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const conciergeRef = useRef<HTMLDivElement>(null);
  const portalsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdown(false);
      }
      if (conciergeRef.current && !conciergeRef.current.contains(event.target as Node)) {
        setConciergeDropdown(false);
      }
      if (portalsRef.current && !portalsRef.current.contains(event.target as Node)) {
        setPortalsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const portalLabels: Record<AppView, string> = {
    landing: 'Public Site',
    foreign_client: 'International Client Portal',
    doctor_portal: 'Clinician Workstation',
    admin: 'Hospital Administration',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Utility Ribbon */}
      <div className="bg-[#fcfbf9] text-stone-600 text-[11px] py-1.5 px-4 sm:px-8 border-b border-stone-200/60 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Clinic Heritage & Location */}
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex items-center gap-1.5 text-stone-700 font-medium">
              <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">Opposite Taj East Gate, Fatehabad Road, Agra</span>
            </span>
            <span className="hidden md:inline text-stone-300" aria-hidden="true">·</span>
            <span className="hidden md:inline text-stone-500 font-normal">
              NABH Accredited Dental Hospital & Luxury Spa
            </span>
          </div>

          {/* Quick Concierge Link & Currency Selector */}
          <div className="flex items-center gap-4 shrink-0 text-stone-600">
            {/* Quiet Concierge Hotline */}
            <button
              onClick={onOpenCallingAgent}
              className="hidden sm:flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors font-medium cursor-pointer"
              title="Speak with Priya, our 24/7 AI Voice Receptionist"
            >
              <Headphones className="w-3 h-3 text-amber-700" />
              <span>24/7 International Desk</span>
            </button>

            <span className="hidden sm:inline text-stone-300" aria-hidden="true">·</span>

            {/* Currency Selector */}
            <div className="relative" ref={currencyRef}>
              <button 
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 hover:text-stone-900 transition-colors font-medium cursor-pointer"
                aria-expanded={currencyDropdown}
                aria-label="Select currency"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-1.5 w-28 bg-white border border-stone-200 rounded-lg shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {(['USD', 'INR', 'GBP', 'EUR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 ${
                        selectedCurrency === curr ? 'text-amber-900 font-semibold bg-amber-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {selectedCurrency === curr && <Check className="w-3 h-3 text-amber-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo & Editorial Typography */}
        <button 
          onClick={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none"
        >
          {/* Architectural Taj Dome + Tooth Sparkle Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200 flex items-center justify-center shadow-xs group-hover:border-amber-400/70 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-800" fill="currentColor">
              <path d="M12 2.5C12 2.5 14.5 5 14.5 7.5C14.5 8.9 13.4 10 12 10C10.6 10 9.5 8.9 9.5 7.5C9.5 5 12 2.5 12 2.5Z" opacity="0.9" />
              <path d="M5.5 13C5.5 11.2 7.2 10.5 12 10.5C16.8 10.5 18.5 11.2 18.5 13C18.5 17.5 16.8 21.5 14.8 21.5C13.5 21.5 13 19.8 12 19.8C11 19.8 10.5 21.5 9.2 21.5C7.2 21.5 5.5 17.5 5.5 13Z" />
            </svg>
          </div>

          <div>
            <span className="block font-serif text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors leading-tight">
              Taj White Pearl
            </span>
            <span className="block text-[10px] tracking-[0.16em] uppercase text-stone-500 font-sans font-medium">
              Dental Sanctuary &middot; Agra
            </span>
          </div>
        </button>

        {/* Center Navigation Links (Clean Editorial Typography) */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-stone-700">
            <button 
              onClick={() => handleNavClick('treatments')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus-visible:outline-none"
            >
              Treatments
            </button>
            <button 
              onClick={() => handleNavClick('tourism')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus-visible:outline-none"
            >
              Taj Dental Tourism
            </button>
            <button 
              onClick={() => handleNavClick('specialists')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus-visible:outline-none"
            >
              Specialists
            </button>
            <button 
              onClick={() => handleNavClick('reviews')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus-visible:outline-none"
            >
              Patient Stories
            </button>
          </nav>
        ) : (
          /* Active Portal Banner when outside landing */
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs text-stone-500">Currently in:</span>
            <span className="text-xs font-semibold text-stone-900 bg-stone-100 px-3 py-1 rounded-md border border-stone-200">
              {portalLabels[currentView]}
            </span>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs text-amber-800 hover:text-amber-950 font-medium underline underline-offset-4 cursor-pointer"
            >
              &larr; Back to Clinic Site
            </button>
          </div>
        )}

        {/* Right Utility & Primary Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Concierge Care Dropdown (Consolidating AI Voice & WhatsApp cleanly) */}
          <div className="relative" ref={conciergeRef}>
            <button
              onClick={() => setConciergeDropdown(!conciergeDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 transition-all cursor-pointer"
              aria-expanded={conciergeDropdown}
            >
              <Headphones className="w-3.5 h-3.5 text-amber-700" />
              <span>Concierge</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {conciergeDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 border-b border-stone-100 mb-1">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-stone-400">
                    24/7 Patient Assistance
                  </p>
                </div>

                <button
                  onClick={() => {
                    setConciergeDropdown(false);
                    onOpenCallingAgent();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-amber-50/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900 group-hover:text-amber-900">
                      Priya (AI Voice Agent)
                    </span>
                    <span className="block text-[11px] text-stone-500 leading-tight">
                      Instant spoken consultation & rescheduling
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setConciergeDropdown(false);
                    onOpenWhatsApp();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-emerald-50/60 transition-colors flex items-start gap-2.5 group cursor-pointer mt-1"
                >
                  <div className="w-7 h-7 rounded-md bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900 group-hover:text-emerald-900">
                      WhatsApp Concierge
                    </span>
                    <span className="block text-[11px] text-stone-500 leading-tight">
                      Reminders, ratings & Agra tourist car service
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Portals Dropdown (Foreign Client, Doctors, Admin Desk) */}
          <div className="relative" ref={portalsRef}>
            <button
              onClick={() => setPortalsDropdown(!portalsDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 transition-all cursor-pointer"
              aria-expanded={portalsDropdown}
            >
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Portals</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {portalsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 border-b border-stone-100 mb-1">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-stone-400">
                    Patient & Staff Access
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('foreign_client');
                    setPortalsDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 group cursor-pointer ${
                    currentView === 'foreign_client' ? 'bg-stone-100' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      International Client Portal
                    </span>
                    <span className="block text-[11px] text-stone-500 leading-tight">
                      Doctor details, hotel pickup & itinerary
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('doctor_portal');
                    setPortalsDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 group cursor-pointer mt-1 ${
                    currentView === 'doctor_portal' ? 'bg-stone-100' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      Clinician Workstation
                    </span>
                    <span className="block text-[11px] text-stone-500 leading-tight">
                      Daily roster, symptoms & prescriptions
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setPortalsDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 group cursor-pointer mt-1 ${
                    currentView === 'admin' ? 'bg-stone-100' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">
                        Hospital Administration
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {stats.activeAppointments} active
                      </span>
                    </div>
                    <span className="block text-[11px] text-stone-500 leading-tight">
                      Walk-in OPD intake, rosters & logs
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button (Bespoke Luxury CTA) */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 active:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-medium tracking-wide shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenBooking}
            className="sm:hidden flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Book</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Clean, Structured & Responsive) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 py-1">
              Explore Taj White Pearl
            </p>
            <button
              onClick={() => handleNavClick('treatments')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Clinical Treatments
            </button>
            <button
              onClick={() => handleNavClick('tourism')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Taj Dental Tourism &amp; Itinerary
            </button>
            <button
              onClick={() => handleNavClick('specialists')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Master Clinicians
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Patient Testimonials
            </button>
          </div>

          {/* Quick Concierge Triggers */}
          <div className="pt-3 border-t border-stone-100 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 py-1">
              24/7 Patient Concierge
            </p>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCallingAgent();
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-stone-800 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                <span>Call Priya (AI Voice Agent)</span>
              </span>
              <span className="text-[10px] text-stone-400">Instant</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsApp();
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-stone-800 hover:bg-emerald-50 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp Helpline</span>
              </span>
              <span className="text-[10px] text-stone-400">Chat</span>
            </button>
          </div>

          {/* Portals Access */}
          <div className="pt-3 border-t border-stone-100 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 py-1">
              Patient &amp; Staff Portals
            </p>
            <button
              onClick={() => {
                setCurrentView('foreign_client');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center gap-2 ${
                currentView === 'foreign_client' ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>International Client Portal</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('doctor_portal');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center gap-2 ${
                currentView === 'doctor_portal' ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Doctor Station</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                currentView === 'admin' ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Hospital Admin Desk</span>
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {stats.activeAppointments} active
              </span>
            </button>
          </div>

          {/* Book Consultation CTA Button */}
          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
