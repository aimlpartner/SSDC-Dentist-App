'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Phone, MessageSquare, MapPin, Clock, ShieldCheck } from 'lucide-react';

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
    <footer className="bg-white pt-20 pb-12 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Unboxed Editorial Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="pb-16 border-b border-stone-200 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-extrabold text-[#7B1123]">
              <span className="w-6 h-[2px] bg-[#D4AF37]" />
              <span>Taj East Gate &middot; Agra</span>
            </div>
            <h2 className="font-funky font-extrabold text-3xl sm:text-5xl text-stone-950 tracking-tight leading-[1.02]">
              Ready for your new glowing smile?
            </h2>
            <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
              Reserve your visit online in seconds, or call our clinic reception desk anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="bg-[#7B1123] hover:bg-[#580B18] text-white px-7 py-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border border-[#D4AF37]/50"
            >
              Book an Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCallingAgent}
              className="bg-white hover:bg-stone-50 text-[#7B1123] border border-stone-300 hover:border-[#7B1123] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#7B1123]" />
              <span>Call Clinic</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 4 Clean Hairline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs sm:text-sm">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#7B1123] text-white flex items-center justify-center font-funky font-extrabold text-lg">
                S
              </div>
              <span className="font-funky font-extrabold text-2xl text-[#7B1123]">SSDC</span>
            </div>
            <p className="text-stone-500 leading-relaxed">
              Agra&apos;s premier dental hospital and international smile sanctuary, adjacent to the Taj Mahal East Gate.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B1123]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>NABH Accredited &middot; ISO 9001 Certified</span>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2.5">
            <p className="font-funky font-extrabold text-xs text-stone-400 uppercase tracking-widest">
              Clinic Location
            </p>
            <p className="text-stone-600 leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#7B1123] shrink-0 mt-0.5" />
              <span>
                14 Fatehabad Road, Opposite Taj East Gate Rd,
                <br />
                Agra, Uttar Pradesh 282001, India
              </span>
            </p>
            <p className="text-stone-800 flex items-center gap-2 font-bold">
              <Phone className="w-4 h-4 text-[#7B1123] shrink-0" />
              <span>+91 562 222 8490</span>
            </p>
          </div>

          {/* Timings & Walk-in */}
          <div className="space-y-2.5">
            <p className="font-funky font-extrabold text-xs text-stone-400 uppercase tracking-widest">
              Working Hours
            </p>
            <p className="text-stone-800 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Mon &ndash; Sat: 9:00 AM &ndash; 7:30 PM</span>
            </p>
            <p className="text-stone-500 text-xs leading-relaxed">
              Same-day walk-in emergency care and local Agra OPD consultations always welcome.
            </p>
          </div>

          {/* Direct Patient Desk Links (Unboxed) */}
          <div className="space-y-3">
            <p className="font-funky font-extrabold text-xs text-stone-400 uppercase tracking-widest">
              Patient Desk
            </p>
            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              <button
                onClick={onOpenCallingAgent}
                className="w-full text-left py-2.5 text-stone-800 hover:text-[#7B1123] font-bold transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#7B1123]" />
                  <span>Call Reception</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="w-full text-left py-2.5 text-stone-800 hover:text-emerald-700 font-bold transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Desk</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400 font-medium">
          <p>&copy; {new Date().getFullYear()} SSDC Dental Clinic, Agra. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[#7B1123] font-bold">SSDC Agra</span>
            <span>&middot;</span>
            <span>Opposite Taj East Gate Rd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
