'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Plane,
  ShieldCheck,
  Camera,
  FileCheck,
} from 'lucide-react';
import {
  DENTAL_PROCEDURES,
  calculateDentalTourismSavings,
} from '@/modules/clinic/domain/dental-logic';

interface DentalTourismSectionProps {
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

const DENTAL_VACATION_STEPS = [
  {
    step: '01 / DAY ONE',
    title: 'VIP Arrival & 3D Scan',
    desc: 'Private chauffeur transfer from Delhi (IGI) or Agra Cantt. Check into your hotel and complete a 15-minute 3D CBCT digital scan at SSDC.',
    icon: Plane,
  },
  {
    step: '02 / DAY TWO',
    title: 'Gentle Treatment Day',
    desc: 'Painless laser preparation, computer-guided implant placement, or porcelain veneer fittings in our Class 100 sterile Agra suite.',
    icon: ShieldCheck,
  },
  {
    step: '03 / DAY THREE',
    title: 'Sunrise at Taj Mahal',
    desc: 'Zero-downtime protocols allow effortless morning sightseeing. Walk 500m from the clinic to watch the sunrise illuminate the white marble.',
    icon: Camera,
  },
  {
    step: '04 / DAY FOUR',
    title: 'Final Fit & Passport',
    desc: 'Final bite calibration and international digital warranty issued. Chauffeur return to Delhi airport with a permanent new smile.',
    icon: FileCheck,
  },
];

export default function DentalTourismSection({
  onOpenBooking,
}: DentalTourismSectionProps) {
  const [selectedProcId, setSelectedProcId] = useState('proc-implants');
  const [quantity, setQuantity] = useState(2);
  const [compareCountry, setCompareCountry] = useState<'UK' | 'US'>('UK');

  const savings = calculateDentalTourismSavings(selectedProcId, quantity, compareCountry);
  const selectedProc =
    DENTAL_PROCEDURES.find((p) => p.id === selectedProcId) || DENTAL_PROCEDURES[0];

  return (
    <section
      id="tourism"
      className="py-20 sm:py-28 px-6 sm:px-12 bg-white border-b border-stone-200 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl space-y-3"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-extrabold text-[#7B1123]">
            <span className="w-6 h-[2px] bg-[#D4AF37]" />
            <span>The Agra Dental Itinerary</span>
          </div>
          <h2 className="font-funky text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.04]">
            Restore your smile &amp; walk the Taj Mahal in four days.
          </h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            International patients fly to Agra for identical German zirconia and E-Max porcelain restorations while saving up to 70%—complete with private airport transfers.
          </p>
        </motion.div>

        {/* Unboxed 4-Column Architectural Hairline Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-t border-b border-stone-200">
          {DENTAL_VACATION_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="py-8 sm:px-7 first:sm:pl-0 last:sm:pr-0 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#D4AF37]">
                  {item.step}
                </span>
                <item.icon className="w-4 h-4 text-[#7B1123] group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="font-funky font-extrabold text-xl text-stone-950 group-hover:text-[#7B1123] transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Clean Split Tariff Comparison (Minimalist Hairline Layout, No Nested Box Slop) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-4"
        >
          {/* Left Configuration Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] block">
                Tariff Estimator
              </span>
              <h3 className="font-funky font-extrabold text-2xl sm:text-4xl text-stone-950 tracking-tight">
                Calculate your Agra savings.
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                Select your procedure and unit count to compare SSDC Agra clinical fees against standard private rates in the UK and US.
              </p>
            </div>

            <div className="space-y-5 pt-2 text-xs sm:text-sm">
              <div className="border-b border-stone-300 pb-2">
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-extrabold mb-1">
                  Procedure
                </label>
                <select
                  value={selectedProcId}
                  onChange={(e) => setSelectedProcId(e.target.value)}
                  className="w-full bg-transparent text-stone-950 font-funky font-bold text-base sm:text-lg focus:outline-none cursor-pointer"
                >
                  {DENTAL_PROCEDURES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-stone-900">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="border-b border-stone-300 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-extrabold mb-1">
                    Units / Teeth
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-transparent text-stone-950 font-funky font-extrabold text-lg tabular-nums focus:outline-none"
                  />
                </div>

                <div className="border-b border-stone-300 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-extrabold mb-1">
                    Home Tariff Region
                  </label>
                  <select
                    value={compareCountry}
                    onChange={(e) => setCompareCountry(e.target.value as 'UK' | 'US')}
                    className="w-full bg-transparent text-stone-950 font-funky font-bold text-lg focus:outline-none cursor-pointer"
                  >
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Unboxed Editorial Numbers Readout */}
          <div className="lg:col-span-6 lg:pl-12 lg:border-l border-stone-200 space-y-8">
            <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                {quantity}x {selectedProc.name}
              </span>
              <span className="font-funky font-extrabold text-sm text-[#7B1123]">
                {savings.savingsPercentage}% Lower Fee
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
                  {compareCountry} Private Fee
                </span>
                <p className="font-funky font-bold text-2xl sm:text-3xl text-stone-400 line-through mt-1 tabular-nums">
                  ${savings.homeMarketTotalUSD.toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7B1123] block">
                  SSDC Agra Fee
                </span>
                <p className="font-funky font-extrabold text-3xl sm:text-4xl text-stone-950 mt-1 tabular-nums">
                  ${savings.clinicTotalUSD.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] block">
                  Estimated Savings
                </span>
                <p className="font-funky font-extrabold text-4xl sm:text-5xl text-[#7B1123] tabular-nums leading-none mt-1">
                  +${savings.savingsUSD.toLocaleString()}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenBooking}
                className="bg-[#7B1123] hover:bg-[#580B18] text-white px-7 py-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-[#D4AF37]/50 shrink-0"
              >
                <span>Reserve Itinerary</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
