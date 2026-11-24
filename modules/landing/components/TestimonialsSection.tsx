'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Rahul Mangla',
      origin: 'Verified Google Review · Agra',
      treatment: 'Comprehensive Dental Care',
      quote:
        'Dr. Saurabh and Dr. Sapna and their team are the most professional, kind, and caring people I have ever met. They do their job with great intent and truly value your time and comfort with their experience.',
      initials: 'RM',
    },
    {
      id: 2,
      name: 'Shweta Sharma',
      origin: 'Verified Google Review · Agra',
      treatment: 'Painless Root Canal (RCT)',
      quote:
        'Best dentist in town — so gentle in their procedures that even my 4-year-old son got his root canal done without pain. Special mention to the doctors’ behaviour, it is remarkably polite.',
      initials: 'SS',
    },
    {
      id: 3,
      name: 'Ankit Porwal',
      origin: 'Verified Google Review · Agra',
      treatment: 'Restorative Dentistry',
      quote:
        'Great place to take care of your teeth. The doctor explained every step of the treatment before performing it, so my fear for dental treatments vanished completely. Very clean and disinfected ambience.',
      initials: 'AP',
    },
  ];

  return (
    <section
      id="reviews"
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
            <span>Patient Reflections</span>
          </div>
          <h2 className="font-funky text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.04]">
            Smiles restored in Agra.
          </h2>
        </motion.div>

        {/* Unboxed 3-Column Hairline Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-b border-stone-200">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7B1123]">
                    {rev.treatment}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-2">
                <div className="w-11 h-11 rounded-full bg-[#7B1123]/10 border border-[#7B1123]/20 text-[#7B1123] flex items-center justify-center font-funky font-extrabold text-sm shrink-0">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="font-funky font-extrabold text-sm text-stone-950">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-semibold">{rev.origin}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
