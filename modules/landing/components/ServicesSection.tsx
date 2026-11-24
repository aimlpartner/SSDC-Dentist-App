'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import { DENTAL_PROCEDURES } from '@/modules/clinic/domain/dental-logic';

interface ServicesSectionProps {
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function ServicesSection({
  onOpenBooking,
  selectedCurrency,
}: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Cosmetic',
    'Surgical & Restorative',
    'Endodontics',
    'Orthodontics',
    'Preventative',
  ];

  const filteredProcedures =
    activeCategory === 'All'
      ? DENTAL_PROCEDURES
      : DENTAL_PROCEDURES.filter((p) => p.category === activeCategory);

  return (
    <section
      id="treatments"
      className="py-20 sm:py-28 px-6 sm:px-12 bg-white border-b border-stone-200 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Top Editorial Header & Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-stone-200"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-extrabold text-[#7B1123]">
              <span className="w-6 h-[2px] bg-[#D4AF37]" />
              <span>Clinical Repertoire &amp; Tariff</span>
            </div>
            <h2 className="font-funky text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.04]">
              Precision dental procedures.
            </h2>
          </div>

          {/* Minimalist Underline Filter Tabs (Zero Box Pills) */}
          <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-2 transition-all cursor-pointer relative ${
                  activeCategory === cat
                    ? 'text-[#7B1123]'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <span>{cat}</span>
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeServiceTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7B1123]"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Unboxed Architectural Hairline Index List */}
        <div className="divide-y divide-stone-200 border-b border-stone-200">
          {filteredProcedures.map((proc, idx) => (
            <motion.div
              key={proc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.04 }}
              onClick={onOpenBooking}
              className="py-7 sm:py-9 group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start lg:items-center hover:bg-stone-50/60 transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4"
            >
              {/* Index & Category */}
              <div className="lg:col-span-2 flex lg:flex-col items-baseline gap-3 lg:gap-1">
                <span className="font-funky text-sm font-extrabold text-[#D4AF37]">
                  0{idx + 1}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  {proc.category}
                </span>
              </div>

              {/* Procedure Name & Description */}
              <div className="lg:col-span-5 space-y-1.5">
                <h3 className="font-funky font-extrabold text-xl sm:text-2xl text-stone-950 group-hover:text-[#7B1123] group-hover:translate-x-1 transition-all">
                  {proc.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xl">
                  {proc.description}
                </p>
              </div>

              {/* Clinical Duration & Sightseeing Indicator */}
              <div className="lg:col-span-2 flex lg:flex-col gap-4 lg:gap-1.5 text-xs font-semibold text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {proc.durationMinutes} mins chair time
                </span>
                {proc.tajSightseeingFriendly && (
                  <span className="flex items-center gap-1.5 text-[#7B1123] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7B1123]" />
                    Zero downtime
                  </span>
                )}
              </div>

              {/* Tariff & Direct Reserve Trigger */}
              <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6 w-full pt-2 lg:pt-0">
                <div className="text-left lg:text-right">
                  <p className="font-funky font-extrabold text-2xl sm:text-3xl text-[#7B1123] tabular-nums leading-none">
                    {selectedCurrency === 'USD'
                      ? `$${proc.priceUSD}`
                      : `₹${proc.priceINR.toLocaleString('en-IN')}`}
                  </p>
                  <span className="text-[11px] text-stone-400 font-medium">
                    vs. ${proc.ukPriceCompareUSD} UK / ${proc.usPriceCompareUSD} US
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full border border-stone-300 group-hover:border-[#7B1123] group-hover:bg-[#7B1123] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
