'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      origin: 'London, United Kingdom',
      treatment: '6 E-Max Porcelain Veneers',
      quote:
        'I flew to India to visit the Taj Mahal and fix my smile. The team at SSDC arranged my Oberoi hotel transfer, and Dr. Sapna gave me the most radiant, natural veneers I could ever imagine. I saved over £4,000 compared to London Harley Street.',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Mark Reynolds',
      origin: 'Sydney, Australia',
      treatment: 'German Zirconia Implant',
      quote:
        'Dr. Saurabh is a brilliant dental surgeon. The 3D CBCT guided implant procedure was 100% painless. I was walking around Agra Fort the very next afternoon. The WhatsApp desk sent all my appointment reminders effortlessly.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Vikram Singhal',
      origin: 'DayalBagh, Agra',
      treatment: 'Laser Whitening & Scaling',
      quote:
        'As Agra locals, our entire family relies on SSDC. We can walk in anytime, and the staff treats us with immense warmth and clinical hygiene. Teeth whitening took only 45 minutes before my wedding.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
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
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover grayscale border border-stone-200"
                />
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
