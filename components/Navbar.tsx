'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Phone, MessageSquare } from 'lucide-react';

export type AppView = 'landing' | 'admin' | 'foreign_client' | 'doctor_portal';

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
  const [portalsOpen, setPortalsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const portalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (portalsRef.current && !portalsRef.current.contains(event.target as Node)) {
        setPortalsOpen(false);
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
    landing: 'SSDC Clinic',
    foreign_client: 'Guest Portal',
    doctor_portal: 'Doctor Portal',
    admin: 'Admin Portal',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Clean Brand Wordmark */}
        <button
          onClick={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#7B1123] text-white flex items-center justify-center font-funky font-extrabold text-lg group-hover:bg-[#580B18] transition-colors">
            S
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-funky text-xl sm:text-2xl font-extrabold tracking-tight text-stone-950">
              SSDC
            </span>
            <span className="text-[11px] font-medium text-stone-400 whitespace-nowrap mt-0.5">
              Taj East Gate &middot; Agra
            </span>
          </div>
        </button>

        {/* Center Navigation Links */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-8 text-xs sm:text-sm font-semibold text-stone-600">
            <button
              onClick={() => handleNavClick('treatments')}
              className="hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Treatments
            </button>
            <button
              onClick={() => handleNavClick('tourism')}
              className="hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Agra Travel
            </button>
            <button
              onClick={() => handleNavClick('specialists')}
              className="hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Our Doctors
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Reviews
            </button>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-500">
            <button
              onClick={() => setCurrentView('doctor_portal')}
              className={`py-1 transition-colors cursor-pointer ${
                currentView === 'doctor_portal'
                  ? 'text-[#7B1123] font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              Doctor Portal
            </button>
            <button
              onClick={() => setCurrentView('foreign_client')}
              className={`py-1 transition-colors cursor-pointer ${
                currentView === 'foreign_client'
                  ? 'text-[#7B1123] font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              Guest Portal
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`py-1 transition-colors cursor-pointer ${
                currentView === 'admin'
                  ? 'text-[#7B1123] font-bold'
                  : 'hover:text-stone-900'
              }`}
            >
              Admin ({stats.activeAppointments})
            </button>
            <span className="h-3.5 w-px bg-stone-200" />
            <button
              onClick={() => setCurrentView('landing')}
              className="text-stone-900 hover:text-[#7B1123] font-semibold cursor-pointer"
            >
              &larr; Clinic Site
            </button>
          </nav>
        )}

        {/* Right Utilities: Clean, Uncluttered */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          {/* Compact Currency Select */}
          <div className="relative flex items-center">
            <select
              value={selectedCurrency}
              onChange={(e) =>
                setSelectedCurrency(e.target.value as 'USD' | 'INR' | 'GBP' | 'EUR')
              }
              aria-label="Currency"
              className="appearance-none bg-transparent pr-4 py-1 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 pointer-events-none absolute right-0" />
          </div>

          <span className="h-4 w-px bg-stone-200" />

          {/* Direct Call Action (No Dropdown Card Clutter) */}
          <button
            onClick={onOpenCallingAgent}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#7B1123]" />
            <span>Call Clinic</span>
          </button>

          {/* Minimal Portals Menu (shown on Landing) */}
          {currentView === 'landing' && (
            <div className="relative" ref={portalsRef}>
              <button
                onClick={() => setPortalsOpen(!portalsOpen)}
                className="flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-[#7B1123] transition-colors cursor-pointer whitespace-nowrap py-1"
              >
                <span>Portals</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {portalsOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-50">
                  <button
                    onClick={() => {
                      setCurrentView('foreign_client');
                      setPortalsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#7B1123] transition-colors cursor-pointer"
                  >
                    Patient Portal
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('doctor_portal');
                      setPortalsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#7B1123] transition-colors cursor-pointer"
                  >
                    Doctor Portal
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setPortalsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#7B1123] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Clinic Admin</span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {stats.activeAppointments}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Single Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="bg-[#7B1123] hover:bg-[#580B18] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            Book Visit
          </button>
        </div>

        {/* Mobile Actions + Hamburger */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {currentView !== 'landing' && (
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-[#7B1123] px-2 py-1"
            >
              {portalLabels[currentView]}
            </button>
          )}
          <button
            onClick={onOpenBooking}
            className="bg-[#7B1123] text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            Book Visit
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-950 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 sm:px-8 py-5 space-y-5 shadow-lg">
          <div className="flex flex-col space-y-2.5 text-sm font-semibold text-stone-800">
            <button onClick={() => handleNavClick('treatments')} className="text-left py-1">
              Treatments
            </button>
            <button onClick={() => handleNavClick('tourism')} className="text-left py-1">
              Agra Travel
            </button>
            <button onClick={() => handleNavClick('specialists')} className="text-left py-1">
              Our Doctors
            </button>
            <button onClick={() => handleNavClick('reviews')} className="text-left py-1">
              Reviews
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-semibold">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCallingAgent();
              }}
              className="flex items-center gap-1.5 text-[#7B1123]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Clinic</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsApp();
              }}
              className="flex items-center gap-1.5 text-emerald-700"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 text-xs text-stone-600 font-semibold">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setCurrentView('foreign_client');
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#7B1123]"
              >
                Patient Portal
              </button>
              <span className="text-stone-300">&middot;</span>
              <button
                onClick={() => {
                  setCurrentView('doctor_portal');
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#7B1123]"
              >
                Doctor Portal
              </button>
              <span className="text-stone-300">&middot;</span>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#7B1123]"
              >
                Admin ({stats.activeAppointments})
              </button>
            </div>

            <select
              value={selectedCurrency}
              onChange={(e) =>
                setSelectedCurrency(e.target.value as 'USD' | 'INR' | 'GBP' | 'EUR')
              }
              aria-label="Mobile Currency"
              className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-700"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
