'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowUpRight } from 'lucide-react';
import { Doctor } from '@/modules/clinic/domain/types';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onOpenBooking: () => void;
  selectedCurrency: 'USD' | 'INR' | 'GBP' | 'EUR';
}

export default function DoctorsSection({
  doctors,
  onOpenBooking,
  selectedCurrency,
}: DoctorsSectionProps) {
  const activeDoctors = doctors.filter((d) => d.active);

  return (
    <section
      id="specialists"
      className="py-20 sm:py-28 px-6 sm:px-12 bg-white border-b border-stone-200 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl space-y-3"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-extrabold text-[#7B1123]">
            <span className="w-6 h-[2px] bg-[#D4AF37]" />
            <span>Chief Clinicians</span>
          </div>
          <h2 className="font-funky text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.04]">
            Agra&apos;s master smile architects.
          </h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            Internationally certified implantologists and cosmetic surgeons practicing microscopic dentistry for patients from 38+ countries.
          </p>
        </motion.div>

        {/* Unboxed 2-Column Editorial Hairline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-b border-stone-200">
          {activeDoctors.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="py-10 md:px-10 first:md:pl-0 last:md:pr-0 flex flex-col justify-between space-y-8 group"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] block">
                        {doc.roomNumber} &middot; {doc.experienceYears} YRS EXP
                      </span>
                      <h3 className="font-funky font-extrabold text-2xl sm:text-3xl text-stone-950">
                        {doc.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-[#7B1123]">
                        {doc.specialty}
                      </p>
                      <p className="text-[11px] text-stone-400 font-medium">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-extrabold text-stone-900 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              {/* Bottom Unboxed Inline Telemetry & Trigger */}
              <div className="pt-6 border-t border-stone-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                      Consultation
                    </span>
                    <span className="font-funky font-extrabold text-base text-stone-950">
                      {selectedCurrency === 'USD'
                        ? `$${doc.consultationFeeUSD}`
                        : `₹${doc.consultationFeeINR}`}
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-stone-200" />

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                      Hours
                    </span>
                    <span className="font-semibold text-stone-700">{doc.availableHours}</span>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7B1123] hover:text-stone-950 transition-colors cursor-pointer group/btn"
                >
                  <span>Book Chair</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4AF37] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
