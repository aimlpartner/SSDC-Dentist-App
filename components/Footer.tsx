'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenCallingAgent: () => void;
  onOpenWhatsApp: () => void;
}

export default function Footer({
  onOpenBooking,
  onOpenCallingAgent,
  onOpenWhatsApp,
}: FooterProps) {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
                💎
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block">
                  Taj White Pearl
                </span>
                <span className="text-[11px] text-stone-400">
                  Agra Dental Hospital & Spa
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Agra&apos;s premier dental tourism center, inspired by the pure white marble brilliance of the Taj Mahal. Serving international visitors and local residents with gentle, world-class dental care.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>NABH Accredited & ISO 9001 Certified</span>
            </div>
          </div>

          {/* Quick Contact & Taj Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-amber-400">
              Agra Hospital Address
            </h4>
            <div className="flex items-start gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                14 Fatehabad Road, Opposite Taj East Gate Rd,<br />
                Agra, Uttar Pradesh 282001, India
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>24/7 Helpline: +91 562 222 8490</span>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>concierge@tajwhitepearldental.com</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 pt-1">
              <Clock className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Mon - Sat: 9:00 AM - 7:30 PM (Sun Emergencies)</span>
            </div>
          </div>

          {/* Treatments & Tourism */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-amber-400">
              Signature Treatments
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • Taj Pearl Laser Whitening (45 Mins)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • German Zirconia Dental Implants
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • Handcrafted E-Max Porcelain Veneers
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • Microscopic Painless Root Canal
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • Clear Invisible Aligners
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={onOpenBooking}>
                • Agra OPD Family Dental Care
              </li>
            </ul>
          </div>

          {/* 24/7 AI Receptionist & Channels */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-amber-400">
              Instant Concierge
            </h4>
            <p className="text-stone-400">
              Need to reschedule or inquire about dental tourism packages? Our AI calling agent Priya and WhatsApp concierge respond instantly.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenCallingAgent}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white p-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Call Priya (AI Voice Agent)</span>
              </button>
              <button
                onClick={onOpenWhatsApp}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open WhatsApp Concierge</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Taj White Pearl Dental Hospital & Luxury Dental Spa, Agra. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>NABH Accredited</span>
            <span>•</span>
            <span>Foreign Dental Tourist Escort Service</span>
            <span>•</span>
            <span>Private Taj View Recovery Suite</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
